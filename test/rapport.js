/**
 * Rapport lisible : le moteur d'aujourd'hui rejoue les 22 dilemmes reels,
 * face a l'ancien oracle et a ce qui a ete fait pour de vrai.
 *
 *   npm run rapport
 */

import { consulter } from '../js/oracle.js';
import { HISTORIQUE } from '../data/historique.js';

const court = (s, n) => {
  const t = String(s ?? '—');
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
};
const cale = (s, n) => court(s, n).padEnd(n);

const MARQUE = { good: '+', meh: '~', bad: '-', null: ' ' };

console.log('\n  L\'ORACLE — rejeu de l\'historique\n');
console.log(
  '  ' + cale('Date', 11) + cale('Verdict du moteur', 34) + cale('Ancien oracle', 26) +
  cale('Fait', 26) + 'Sat.'
);
console.log('  ' + '─'.repeat(101));

let accords = 0;
let jugeables = 0;
const alertes = [];

for (const d of HISTORIQUE) {
  const v = consulter(d);
  const marques = [];
  if (v.type === 'PILE_OU_FACE') marques.push('pièce');
  else if (v.type === 'SERRE') marques.push('serré');
  if (v.drapeaux.includes('aucuneNAppelle')) marques.push('option C ?');
  if (v.drapeaux.includes('grandeDecision')) marques.push('grosse déc.');
  if (v.drapeaux.includes('engagement')) marques.push('parole');
  if (v.drapeaux.includes('peurQuiCompte')) marques.push('peur→ok');
  if (v.drapeaux.includes('peurQuiProtege')) marques.push('peur→non');

  const verdict = v.gagnant.nom + (marques.length ? ` (${marques.join(', ')})` : '');

  console.log(
    '  ' + cale(d.date, 11) + cale(verdict, 34) + cale(d.reel.oracle, 26) +
    cale(d.reel.choixFinal, 26) + (MARQUE[d.reel.satisfaction] ?? ' ')
  );

  if (d.reel.satisfaction === 'good' && d.reel.choixFinal && d.reel.choixFinal !== 'autre') {
    jugeables++;
    if (v.gagnant.nom === d.reel.choixFinal) accords++;
  }
  if (d.reel.satisfaction === 'bad' && v.gagnant.nom === d.reel.choixFinal && v.type === 'TETE') {
    alertes.push(`${d.date} : recommande fermement un choix regrette`);
  }
}

console.log('  ' + '─'.repeat(101));
console.log(`\n  Choix satisfaisants retrouves : ${accords}/${jugeables}`);
console.log(`  Choix regrettes recommandes   : ${alertes.length}  ${alertes.length ? '⚠' : '✓'}`);
for (const a of alertes) console.log(`    ⚠ ${a}`);
console.log('\n  + satisfaite   ~ mitigée   - regrettée\n');
