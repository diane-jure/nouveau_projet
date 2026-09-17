/**
 * Génère labo/v4/oracle/lexicon.js à partir de QF_documentation/oracle_detecte.md.
 *
 *   node labo/v4/build_lexicon.js
 *
 * Le MD est la source. Ce fichier ne fait que le transporter : il ne décide
 * rien, n'ajoute rien, ne retire rien. Si un keyword manque dans le lexique,
 * c'est qu'il manque dans le MD.
 *
 * Trois notations du MD sont interprétées :
 *   « flemme (si HP>=3) »      → un keyword conditionnel
 *   « de fou *(mot précède)* » → l'annotation en italique est retirée
 *   « achievements (moderate) » → le niveau, weak | moderate | strong
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'QF_documentation/oracle_detecte.md';
const DST = 'labo/v4/oracle/lexicon.js';

// ── lecture ────────────────────────────────────────────────────────────────

const entry = (raw) => {
  const keyword = raw
    .replace(/\*\([^)]*\)\*/g, '')          // annotation en italique
    .replace(/\s*\(si\s+([^)]*)\)/i, '')    // condition, récupérée juste après
    .trim();
  const condition = raw.match(/\(si\s+([^)]*)\)/i);
  if (!keyword) return null;
  return condition ? { keyword, condition: condition[1].trim() } : keyword;
};

const splitLine = (line) => line.split(',').map(entry).filter(Boolean);

const families = {};                        // "Q1" -> "desire" -> "weak" -> [...]
const add = (field, family, level, words) => {
  families[field] ??= {};
  families[field][family] ??= {};
  families[field][family][level] ??= [];
  families[field][family][level].push(...words);
};

let field = null, group = null, family = null, level = null;

for (const l of readFileSync(SRC, 'utf-8').split('\n')) {
  let m;

  if ((m = l.match(/^###\s+(Q[0-3])\s*$/i))) {
    field = m[1].toUpperCase(); group = null; family = null; continue;
  }
  if (/^##\s+everyField/i.test(l)) { field = 'ALL'; group = null; family = null; continue; }
  if ((m = l.match(/^###\s+(\w[\w-]*)/)) && field === 'ALL') {
    group = m[1]; family = null; continue;
  }

  if ((m = l.match(/^\*\*(.+?)\*\*/))) {
    const heading = m[1].trim();
    if (/^Q0$/i.test(heading)) { field = 'Q0'; family = null; continue; }

    // « regret — weak » · « trivial (weak) » · « irreversible (booléen) » · « damage »
    const dashForm = heading.match(/^(.+?)\s*[—–-]\s*(weak|moderate|strong)\s*$/i);
    const parenForm = heading.match(/^(.+?)\s*\((weak|moderate|strong|bool[^)]*)\)\s*$/i);
    if (dashForm) { family = dashForm[1].trim(); level = dashForm[2].toLowerCase(); }
    else if (parenForm) {
      family = parenForm[1].trim();
      level = /^bool/i.test(parenForm[2]) ? 'flag' : parenForm[2].toLowerCase();
    } else { family = heading; level = 'strong'; }

    if (field === 'Q3' && /^(irreversible|reversible|recurrence)$/i.test(family)) level = 'flag';
    if (field === 'ALL' && group === 'modifiers') level = 'flag';
    continue;
  }

  if (!l.trim() || l.startsWith('#') || l.startsWith('lexicon')) continue;

  if (field === 'Q0') {
    const q0 = l.match(/^\s*(oui|maybe|non)\s*:\s*(.*)$/i);
    if (q0) add('Q0', q0[1].toLowerCase(), 'flag', splitLine(q0[2]));
    continue;
  }
  if (!field || !family) continue;
  add(field === 'ALL' ? group : field, family, level, splitLine(l));
}

// ── écriture ───────────────────────────────────────────────────────────────

const literal = (e) =>
  typeof e === 'string'
    ? JSON.stringify(e)
    : `{ keyword: ${JSON.stringify(e.keyword)}, condition: ${JSON.stringify(e.condition)} }`;

const block = (obj, ind = '  ') =>
  Object.entries(obj).map(([key, val]) => {
    const inner = Object.entries(val).map(([lvl, words]) =>
      `${ind}  ${lvl}: [${words.map(literal).join(', ')}],`).join('\n');
    return `${ind}${JSON.stringify(key)}: {\n${inner}\n${ind}},`;
  }).join('\n');

const fieldBlocks = Object.entries(families)
  .map(([f, fams]) => `  ${JSON.stringify(f)}: {\n${block(fams, '    ')}\n  },`)
  .join('\n');

mkdirSync('labo/v4/oracle', { recursive: true });
writeFileSync(DST, `/**
 * LEXICON — Oracle V4.
 *
 * FICHIER GÉNÉRÉ. Ne pas éditer à la main : la source est
 * QF_documentation/oracle_detecte.md, et toute modification faite ici
 * disparaîtra à la prochaine génération.
 *
 *   node labo/v4/build_lexicon.js
 */

export const LEXICON = {
${fieldBlocks}
};
`, 'utf-8');

// ── compte rendu ───────────────────────────────────────────────────────────

let total = 0, conditional = 0;
const lines = [];
for (const [f, fams] of Object.entries(families)) {
  const n = Object.values(fams).flatMap((x) => Object.values(x).flat());
  total += n.length;
  conditional += n.filter((e) => typeof e !== 'string').length;
  lines.push(`  ${f.padEnd(12)} ${String(Object.keys(fams).length).padStart(2)} familles · ${String(n.length).padStart(3)} entrées`);
}
console.log(`\n  ${DST}\n`);
console.log(lines.join('\n'));
console.log(`\n  ${total} entrées au total, dont ${conditional} conditionnelle(s)\n`);
