/**
 * Génère labo/v4/word_bank.js à partir de QF_documentation/oracle_detecte.md.
 *
 *   node labo/v4/genere_word_bank.js
 *
 * Le MD est la source. Ce fichier ne fait que le transporter : il ne décide
 * rien, n'ajoute rien, ne retire rien. Si un mot manque dans le lexique,
 * c'est qu'il manque dans le MD.
 *
 * Deux notations du MD sont interprétées :
 *   « flemme (si HP>=3) »      → une entrée conditionnelle
 *   « de fou *(mot précède)* » → l'annotation en italique est retirée
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'QF_documentation/oracle_detecte.md';
const DST = 'labo/v4/word_bank.js';

// ── lecture ────────────────────────────────────────────────────────────────

const entree = (brut) => {
  const mot = brut
    .replace(/\*\([^)]*\)\*/g, '')          // annotation en italique
    .replace(/\s*\(si\s+([^)]*)\)/i, '')    // condition, récupérée juste après
    .trim();
  const si = brut.match(/\(si\s+([^)]*)\)/i);
  if (!mot) return null;
  return si ? { mot, si: si[1].trim() } : mot;
};

const decoupe = (ligne) => ligne.split(',').map(entree).filter(Boolean);

const familles = {};                        // "Q1" -> "desire" -> "weak" -> [...]
const ajoute = (champ, famille, niveau, mots) => {
  familles[champ] ??= {};
  familles[champ][famille] ??= {};
  familles[champ][famille][niveau] ??= [];
  familles[champ][famille][niveau].push(...mots);
};

let champ = null, groupe = null, famille = null, niveau = null;

for (const l of readFileSync(SRC, 'utf-8').split('\n')) {
  let m;

  if ((m = l.match(/^###\s+(Q[0-3])\s*$/i))) {
    champ = m[1].toUpperCase(); groupe = null; famille = null; continue;
  }
  if (/^##\s+everyField/i.test(l)) { champ = 'ALL'; groupe = null; famille = null; continue; }
  if ((m = l.match(/^###\s+(\w[\w-]*)/)) && champ === 'ALL') {
    groupe = m[1]; famille = null; continue;
  }

  if ((m = l.match(/^\*\*(.+?)\*\*/))) {
    const titre = m[1].trim();
    if (/^Q0$/i.test(titre)) { champ = 'Q0'; famille = null; continue; }

    // « regret — weak » · « trivial (weak) » · « irreversible (booléen) » · « damage »
    const tiret = titre.match(/^(.+?)\s*[—–-]\s*(weak|strong)\s*$/i);
    const paren = titre.match(/^(.+?)\s*\((weak|strong|bool[^)]*)\)\s*$/i);
    if (tiret) { famille = tiret[1].trim(); niveau = tiret[2].toLowerCase(); }
    else if (paren) {
      famille = paren[1].trim();
      niveau = /^bool/i.test(paren[2]) ? 'flag' : paren[2].toLowerCase();
    } else { famille = titre; niveau = 'strong'; }

    if (champ === 'Q3' && /^(irreversible|reversible|recurrence)$/i.test(famille)) niveau = 'flag';
    if (champ === 'ALL' && groupe === 'modifiers') niveau = 'flag';
    continue;
  }

  if (!l.trim() || l.startsWith('#') || l.startsWith('word_bank')) continue;

  if (champ === 'Q0') {
    const q0 = l.match(/^\s*(oui|maybe|non)\s*:\s*(.*)$/i);
    if (q0) ajoute('Q0', q0[1].toLowerCase(), 'flag', decoupe(q0[2]));
    continue;
  }
  if (!champ || !famille) continue;
  ajoute(champ === 'ALL' ? groupe : champ, famille, niveau, decoupe(l));
}

// ── écriture ───────────────────────────────────────────────────────────────

const litteral = (e) =>
  typeof e === 'string' ? JSON.stringify(e) : `{ mot: ${JSON.stringify(e.mot)}, si: ${JSON.stringify(e.si)} }`;

const bloc = (obj, ind = '  ') =>
  Object.entries(obj).map(([cle, val]) => {
    const dedans = Object.entries(val).map(([niv, mots]) =>
      `${ind}  ${niv}: [${mots.map(litteral).join(', ')}],`).join('\n');
    return `${ind}${JSON.stringify(cle)}: {\n${dedans}\n${ind}},`;
  }).join('\n');

const sections = Object.entries(familles)
  .map(([champ, fams]) => `  ${JSON.stringify(champ)}: {\n${bloc(fams, '    ')}\n  },`)
  .join('\n');

mkdirSync('labo/v4', { recursive: true });
writeFileSync(DST, `/**
 * WORD BANK — Oracle V4.
 *
 * FICHIER GÉNÉRÉ. Ne pas éditer à la main : la source est
 * QF_documentation/oracle_detecte.md, et toute modification faite ici
 * disparaîtra à la prochaine génération.
 *
 *   node labo/v4/genere_word_bank.js
 */

export const WORD_BANK = {
${sections}
};
`, 'utf-8');

// ── compte rendu ───────────────────────────────────────────────────────────

let total = 0, cond = 0;
const lignes = [];
for (const [champ, fams] of Object.entries(familles)) {
  const n = Object.values(fams).flatMap((f) => Object.values(f).flat());
  total += n.length;
  cond += n.filter((e) => typeof e !== 'string').length;
  lignes.push(`  ${champ.padEnd(12)} ${String(Object.keys(fams).length).padStart(2)} familles · ${String(n.length).padStart(3)} entrées`);
}
console.log(`\n  ${DST}\n`);
console.log(lignes.join('\n'));
console.log(`\n  ${total} entrées au total, dont ${cond} conditionnelle(s)\n`);
