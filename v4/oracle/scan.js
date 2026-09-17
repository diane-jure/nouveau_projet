/**
 * SCAN — Oracle V4.
 *
 * Trouve, dans un champ de texte, les keywords du lexique qui s'y trouvent.
 * Ne calcule aucun point : rend des occurrences situées, avec le keyword qui
 * les a déclenchées. C'est le cerveau qui les additionne.
 *
 * Trois normalisations, appliquées des deux côtés (texte ET lexique) :
 *   casse         « Stress » = « stress »
 *   accents       « hâte » = « hate »
 *   répétitions   3 lettres identiques ou plus → une seule
 *                 « fleeemme » = « flemme », « mmmmmmmh » = « mh »
 *
 * Les onomatopées du MD sont écrites sous leur forme déjà écrasée (« pf »,
 * « mh ») : l'ancrage en début de mot avec la fin libre fait le reste, donc
 * « pf » attrape pff, pfff, pffff. Pas besoin d'une seconde normalisation.
 *
 * La recherche est une regex ancrée en DÉBUT DE MOT, la fin libre : la
 * racine « terrif » trouve terrifie, terrifiée, terrifiant — mais plus
 * « voir » dans « avoir », ni « art » dans « parties », ni « très » dans
 * « stress ». Le test 9 avait mesuré 15 faux positifs avec includes() ;
 * l'ancrage les supprime tous.
 *
 * À chaque position, l'expression la plus longue gagne et consomme le texte.
 * « pas envie » l'emporte donc sur « envie », et « envie » reste disponible
 * ailleurs dans la même phrase.
 */

import { LEXICON } from './lexicon.js';

// ── normalisation ──────────────────────────────────────────────────────────

export const normalize = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(.)\1{2,}/g, '$1')
    .toLowerCase();

// ── conditions (« flemme (si HP>=3) ») ─────────────────────────────────────

const isMet = (condition, context) => {
  if (!condition) return true;
  const m = condition.match(/^\s*(\w+)\s*(>=|<=|=<|=>|>|<|=)\s*(-?\d+)\s*$/);
  if (!m) return true;                                  // notation inconnue : on ne filtre pas
  const value = context?.[m[1]] ?? context?.[m[1].toUpperCase()];
  if (value == null) return true;
  const n = Number(m[3]);
  switch (m[2]) {
    case '>=': case '=>': return value >= n;
    case '<=': case '=<': return value <= n;
    case '>': return value > n;
    case '<': return value < n;
    default: return value === n;
  }
};

// ── motifs ─────────────────────────────────────────────────────────────────

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Un keyword devient une regex ancrée en début de mot, fin libre.
 *
 *   terrif      → \bterrif[a-z0-9]*      terrifie · terrifiée · terrifiant
 *   pas envie   → \bpas envie[a-z0-9]*   et pas « pas trop envie »
 *
 * Le \b n'est posé que si le keyword commence par une lettre : « 'aimerais
 * bien » commence par une apostrophe, où \b ne veut rien dire.
 *
 * Le texte est normalisé avant, donc sans accents — ce qui compte, parce
 * que \b de JavaScript ne reconnaît pas « é » comme une lettre.
 */
const pattern = (key) =>
  new RegExp((/^[a-z0-9]/.test(key) ? '\\b' : '') + escape(key) + '[a-z0-9]*', 'g');

// ── mise à plat du lexique ─────────────────────────────────────────────────

/** Tous les keywords d'un champ : ceux de la question + ceux qui valent partout. */
export function keywordsFor(question, context = {}) {
  const flat = [];
  const feed = (field, families) => {
    for (const [family, levels] of Object.entries(families)) {
      for (const [level, words] of Object.entries(levels)) {
        for (const e of words) {
          const keyword = typeof e === 'string' ? e : e.keyword;
          const condition = typeof e === 'string' ? null : e.condition;
          if (!isMet(condition, context)) continue;
          const key = normalize(keyword);
          if (!key) continue;
          flat.push({ field, family, level, keyword, key, pattern: pattern(key) });
        }
      }
    }
  };
  if (LEXICON[question]) feed(question, LEXICON[question]);
  for (const field of ['sparks', 'hooks', 'modifiers']) {
    if (LEXICON[field]) feed(field, LEXICON[field]);
  }
  // Le plus long d'abord : il consommera le texte avant les racines courtes.
  return flat.sort((a, b) => b.key.length - a.key.length);
}

// ── détection ──────────────────────────────────────────────────────────────

/**
 * Renvoie les occurrences trouvées dans `text`, triées par position.
 * Chaque occurrence porte son keyword d'origine — l'oracle pourra te citer.
 */
export function occurrences(text, question, context = {}) {
  const t = normalize(text);
  if (!t.trim()) return [];

  const claimed = new Array(t.length).fill(false);
  const found = [];

  for (const e of keywordsFor(question, context)) {
    const re = e.pattern;
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(t)) !== null) {
      if (m[0] === '') { re.lastIndex++; continue; }
      const [start, end] = [m.index, m.index + m[0].length];
      let free = true;
      for (let k = start; k < end; k++) if (claimed[k]) { free = false; break; }
      if (free) {
        for (let k = start; k < end; k++) claimed[k] = true;
        found.push({ ...e, start, end, match: m[0] });
      }
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

// ── application des modificateurs ──────────────────────────────────────────

/**
 * Applique but / not / less / more aux occurrences de contenu.
 *
 *   but   tout ce qui précède compte moitié moins
 *   not   inverse l'occurrence adjacente
 *   less  l'occurrence adjacente compte moitié moins
 *   more  l'occurrence adjacente compte double
 *
 * « Adjacente » = la première occurrence de contenu qui commence après le
 * modificateur. S'il n'y en a aucune après, celle qui le précède
 * immédiatement.
 */
export function applyModifiers(found, { BOOST = 2, REDUCE = 0.5 } = {}) {
  const content = found.filter((o) => o.field !== 'modifiers')
    .map((o) => ({ ...o, factor: 1, inverted: false, modified: [] }));
  const modifiers = found.filter((o) => o.field === 'modifiers');

  for (const m of modifiers) {
    if (m.family === 'but') {
      for (const c of content) {
        if (c.end <= m.start) { c.factor *= REDUCE; c.modified.push('but'); }
      }
      continue;
    }
    const after = content.find((c) => c.start >= m.end);
    const target = content.find((c) => c.start >= m.end);
    if (!target) continue;
    if (m.family === 'not') { target.inverted = !target.inverted; }
    else if (m.family === 'less') { target.factor *= REDUCE; }
    else if (m.family === 'more') { target.factor *= BOOST; }
    target.modified.push(m.family);
  }
  return { content, modifiers };
}

/** Détection complète d'un champ : occurrences de contenu, modificateurs appliqués. */
export function scan(text, question, context = {}, constants = {}) {
  return applyModifiers(occurrences(text, question, context), constants);
}
