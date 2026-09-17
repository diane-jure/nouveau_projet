/**
 * Convertit le tableau Markdown des sauvegardes en CSV.
 *
 *   node labo/md2csv.js labo/saves/sauvegardes.md labo/saves/sauvegardes.csv
 *
 * Deux particularités du fichier source, gérées ici :
 *   - une ligne trop longue peut être coupée en deux dans le MD ; on recolle
 *     tant que la ligne ne se termine pas par « | » ;
 *   - un « \| » à l'intérieur d'une cellule est un vrai caractère, pas un
 *     séparateur (il apparaît dans un commentaire de feedback).
 */

import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2] ?? 'labo/saves/sauvegardes.md';
const dst = process.argv[3] ?? 'labo/saves/sauvegardes.csv';

const brutes = readFileSync(src, 'utf-8').split('\n');
const lignes = [];
let recolles = 0;
for (const l of brutes) {
  const t = l.trim();
  if (!t.startsWith('|')) continue;
  if (lignes.length && !lignes[lignes.length - 1].endsWith('|')) {
    lignes[lignes.length - 1] += t;
    recolles++;
  } else lignes.push(t);
}

const cellules = (l) =>
  l.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

const entetes = cellules(lignes[0]);

// « Décision finale » apparaît deux fois : la seconde porte la lettre (A/B/C/X/Y).
const dernier = entetes.lastIndexOf('Décision finale');
if (entetes.indexOf('Décision finale') !== dernier) entetes[dernier] = 'Code décision';

const corps = lignes.slice(2).filter((l) => l.replace(/[|\-\s]/g, ''));

// RFC 4180 : guillemets dès qu'il y a virgule, guillemet ou saut de ligne ; internes doublés.
const echapper = (v) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const rangs = corps.map((l) => {
  const c = cellules(l);
  while (c.length < entetes.length) c.push('');
  return c.slice(0, entetes.length);
});

writeFileSync(dst, [entetes, ...rangs].map((r) => r.map(echapper).join(',')).join('\n') + '\n', 'utf-8');

console.log(`  ${dst}`);
console.log(`  ${entetes.length} colonnes · ${rangs.length} lignes · ${recolles} ligne(s) recollée(s)`);
const courtes = rangs.filter((r) => r.filter(Boolean).length < 5).length;
console.log(courtes ? `  ⚠ ${courtes} ligne(s) presque vide(s)` : '  aucune ligne orpheline');
