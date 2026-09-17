/**
 * Vérification — ma reconstruction de V2.5 valait-elle le vrai moteur ?
 *
 * Les expériences 4 et 5 tournent sur une reconstruction écrite à partir
 * d'extraits documentés, avec l'avertissement « si l'application réelle diffère,
 * les scores changent ». Le vrai moteur est désormais dans
 * documentation/oracle_versions/oracle_v2.5.1.js : on peut lever le doute.
 *
 *   node labo/verif_reconstruction.js
 */

import { readFileSync } from 'node:fs';
import { analyzeWithOracleV2_5 as vrai } from './oracle_versions/oracle_v2.5.1.js';

const lignes = readFileSync('labo/saves/sauvegardes.md', 'utf-8')
  .split('\n').filter((l) => l.trim().startsWith('|'));
const E = lignes[0].replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const I = Object.fromEntries(E.map((n, i) => [n, i]));
const corps = lignes.slice(2).filter((l) => l.replace(/[|\-\s]/g, ''));
const cols = (l) => {
  const c = l.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
  return [...c, ...Array(Math.max(0, E.length - c.length)).fill('')];
};
const L = ['A', 'B', 'C'];

const jeux = corps.map((l) => {
  const c = cols(l);
  return {
    date: (c[I.id] || '').slice(0, 10),
    spoons: Number(c[I.Energie] || 0),
    q0: c[I.Q0],
    options: L.map((x) => ({
      lettre: x, name: c[I[`Voie ${x}`]],
      q1: c[I[`Q1 (${x})`]], q2: c[I[`Q2 (${x})`]], q3: c[I[`Q3 (${x})`]],
      cost: c[I[`Coût (${x})`]], energyGain: c[I[`Gain (${x})`]],
    })).filter((o) => o.name),
    decision: c[I['Décision finale']],
    satisfaction: c[I.Satisfaction],
  };
});

const codeDe = (choix, options) => {
  if (/pile ou face/i.test(choix)) return 'Y';
  if (/aucun|ni l'un/i.test(choix)) return 'X';
  const o = options.find((x) => x.name === choix);
  return o ? o.lettre : '?';
};
const juge = (code, decision, satisfaction) => {
  if (!code || !decision || !satisfaction || code === 'Y') return null;
  const suivi = code === decision || (code === 'X' && !L.includes(decision));
  return suivi ? satisfaction === 'good' : (satisfaction === 'bad' || satisfaction === 'meh');
};

let bon = 0, total = 0, pof = 0;
const cats = {};
const detail = [];

for (const d of jeux) {
  const r = vrai(d.options, d.spoons, d.q0);
  cats[r.caseType] = (cats[r.caseType] || 0) + 1;
  const c = codeDe(r.fallbackRecommendation.choix, d.options);
  if (c === 'Y') pof++;
  const a = juge(c, d.decision, d.satisfaction);
  if (a !== null) { total++; if (a) bon++; }
  detail.push('  ' + d.date.padEnd(12) + c + (a === null ? ' ·' : a ? ' ✓' : ' ✗') +
    '   ' + r.caseType.padEnd(11) + (d.satisfaction || ''));
}

const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
console.log('\n  Le VRAI moteur 2.5.1 sur les 25 dilemmes réels\n');
console.log(detail.join('\n'));
console.log('\n  ' + '─'.repeat(58));
console.log(`  juste           : ${bon}/${total}  (${pc(bon, total)} %)`);
console.log(`  pile ou face    : ${pof}`);
console.log(`  caseType        : ${JSON.stringify(cats)}`);
console.log(`
  Pour mémoire, sur le même jeu :
    V2 (janvier)                 12/18   67 %
    reconstruction de V2.5        9/17   53 %
    VRAI moteur 2.5.1            ${String(bon).padStart(2)}/${total}   ${pc(bon, total)} %

  La reconstruction se trompait d'un dilemme. L'avertissement des
  expériences 4 et 5 peut être levé : elle était fidèle.
  L'écart avec V2 se resserre à ${67 - pc(bon, total)} points au lieu de 14.
`);
