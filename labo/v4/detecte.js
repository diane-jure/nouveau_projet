/**
 * DÉTECTION — Oracle V4.
 *
 * Trouve, dans un champ de texte, les entrées de la word bank qui s'y
 * trouvent. Ne calcule aucun point : rend des occurrences situées, avec le
 * mot qui les a déclenchées. C'est le cerveau qui les additionne.
 *
 * Trois normalisations, appliquées des deux côtés (texte ET word bank) :
 *   casse         « Stress » = « stress »
 *   accents       « hâte » = « hate »
 *   répétitions   3 lettres identiques ou plus → une seule
 *                 « fleeemme » = « flemme », « mmmmmmmh » = « mh »
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

import { WORD_BANK } from './word_bank.js';

// ── normalisation ──────────────────────────────────────────────────────────

export const normalise = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(.)\1{2,}/g, '$1')
    .toLowerCase();

/**
 * Forme repli, pour les onomatopées.
 *
 * La règle ci-dessus n'écrase qu'à partir de trois lettres identiques, pour
 * ne pas abîmer « comme », « belle », « passer ». Mais l'entrée « pff » du
 * MD n'a que deux f : elle reste « pff », alors que « Pffff » tapé dans
 * l'app se dégonfle en « pf ». Les deux ne se rencontreraient jamais.
 *
 * On indexe donc chaque entrée sous ses deux formes. Le texte, lui, n'est
 * normalisé qu'une fois — c'est le lexique qui tend les deux mains.
 */
export const normaliseFort = (s) => normalise(s).replace(/(.)\1+/g, '$1');

// ── conditions (« flemme (si HP>=3) ») ─────────────────────────────────────

const conditionTenue = (si, contexte) => {
  if (!si) return true;
  const m = si.match(/^\s*(\w+)\s*(>=|<=|=<|=>|>|<|=)\s*(-?\d+)\s*$/);
  if (!m) return true;                                  // notation inconnue : on ne filtre pas
  const valeur = contexte?.[m[1]] ?? contexte?.[m[1].toUpperCase()];
  if (valeur == null) return true;
  const n = Number(m[3]);
  switch (m[2]) {
    case '>=': case '=>': return valeur >= n;
    case '<=': case '=<': return valeur <= n;
    case '>': return valeur > n;
    case '<': return valeur < n;
    default: return valeur === n;
  }
};

// ── motifs ─────────────────────────────────────────────────────────────────

const echappe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Une entrée devient une regex ancrée en début de mot, fin libre.
 *
 *   terrif      → \bterrif[a-z0-9]*      terrifie · terrifiée · terrifiant
 *   pas envie   → \bpas envie[a-z0-9]*   et pas « pas trop envie »
 *
 * Le \b n'est posé que si l'entrée commence par une lettre : « 'aimerais
 * bien » commence par une apostrophe, où \b ne veut rien dire.
 *
 * Le texte est normalisé avant, donc sans accents — ce qui compte, parce
 * que \b de JavaScript ne reconnaît pas « é » comme une lettre.
 */
const motif = (cle) =>
  new RegExp((/^[a-z0-9]/.test(cle) ? '\\b' : '') + echappe(cle) + '[a-z0-9]*', 'g');

// ── mise à plat de la word bank ────────────────────────────────────────────

/** Toutes les entrées d'un champ : celles de la question + celles qui valent partout. */
export function entreesPour(question, contexte = {}) {
  const plat = [];
  const verse = (champ, familles) => {
    for (const [famille, niveaux] of Object.entries(familles)) {
      for (const [niveau, mots] of Object.entries(niveaux)) {
        for (const e of mots) {
          const mot = typeof e === 'string' ? e : e.mot;
          const si = typeof e === 'string' ? null : e.si;
          if (!conditionTenue(si, contexte)) continue;
          const cle = normalise(mot);
          if (!cle) continue;
          const repli = normaliseFort(mot);
          const cles = repli === cle ? [cle] : [cle, repli];
          plat.push({ champ, famille, niveau, mot, cle, motifs: cles.map(motif) });
        }
      }
    }
  };
  if (WORD_BANK[question]) verse(question, WORD_BANK[question]);
  for (const champ of ['sparks', 'hooks', 'modifiers']) {
    if (WORD_BANK[champ]) verse(champ, WORD_BANK[champ]);
  }
  // La plus longue d'abord : elle consommera le texte avant les racines courtes.
  return plat.sort((a, b) => b.cle.length - a.cle.length);
}

// ── détection ──────────────────────────────────────────────────────────────

/**
 * Renvoie les occurrences trouvées dans `texte`, triées par position.
 * Chaque occurrence porte son mot d'origine — l'oracle pourra te citer.
 */
export function occurrences(texte, question, contexte = {}) {
  const t = normalise(texte);
  if (!t.trim()) return [];

  const pris = new Array(t.length).fill(false);
  const trouves = [];

  for (const e of entreesPour(question, contexte)) {
    for (const re of e.motifs) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(t)) !== null) {
        if (m[0] === '') { re.lastIndex++; continue; }
        const [i, fin] = [m.index, m.index + m[0].length];
        let libre = true;
        for (let k = i; k < fin; k++) if (pris[k]) { libre = false; break; }
        if (libre) {
          for (let k = i; k < fin; k++) pris[k] = true;
          trouves.push({ ...e, debut: i, fin, trouve: m[0] });
        }
      }
    }
  }
  return trouves.sort((a, b) => a.debut - b.debut);
}

// ── application des modificateurs ──────────────────────────────────────────

const estModificateur = (o) => o.champ === 'modifiers';

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
export function applique(trouves, { BOOST = 2, REDUCE = 0.5 } = {}) {
  const contenu = trouves.filter((o) => !estModificateur(o))
    .map((o) => ({ ...o, facteur: 1, inverse: false, modificateurs: [] }));
  const mods = trouves.filter(estModificateur);

  for (const m of mods) {
    if (m.famille === 'but') {
      for (const c of contenu) {
        if (c.fin <= m.debut) { c.facteur *= REDUCE; c.modificateurs.push('but'); }
      }
      continue;
    }
    const apres = contenu.find((c) => c.debut >= m.fin);
    const cible = apres ?? [...contenu].reverse().find((c) => c.fin <= m.debut);
    if (!cible) continue;
    if (m.famille === 'not') { cible.inverse = !cible.inverse; }
    else if (m.famille === 'less') { cible.facteur *= REDUCE; }
    else if (m.famille === 'more') { cible.facteur *= BOOST; }
    cible.modificateurs.push(m.famille);
  }
  return { contenu, mods };
}

/** Détection complète d'un champ : occurrences de contenu, modificateurs appliqués. */
export function lis(texte, question, contexte = {}, constantes = {}) {
  return applique(occurrences(texte, question, contexte), constantes);
}
