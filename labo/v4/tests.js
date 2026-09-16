/**
 * TESTS EN LABO — Oracle V4.
 *
 *   node labo/v4/tests.js
 *
 * Rejoue le cerveau sur les 25 dilemmes réels de labo/saves/sauvegardes.md
 * et répond, dans l'ordre, aux questions de la liste « Tests en labo » de
 * QF_documentation/oracle_cerveau.md.
 *
 * Aucun de ces tests ne règle un poids : ils décrivent ce que le moteur
 * fait, pour que les seuils X et Z soient choisis en connaissance de cause.
 */

import { readFileSync } from 'node:fs';
import { consulte, evalueVoie, porteeDe, CONSTANTES, isHigh } from './cerveau.js';
import { normalise, occurrences } from './detecte.js';

// ── les dilemmes réels ─────────────────────────────────────────────────────

const L = readFileSync('labo/saves/sauvegardes.md', 'utf-8')
  .split('\n').filter((l) => l.trim().startsWith('|'));
const cel = (l) => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
const E = cel(L[0]);
const I = Object.fromEntries(E.map((n, i) => [n, i]));

const DILEMMES = L.slice(2).filter((l) => l.replace(/[|\-\s]/g, '')).map((l) => {
  const c = cel(l);
  return {
    id: (c[I.id] || '').slice(0, 10),
    HP: Number(c[I.Energie]) || 3,
    q0: c[I.Q0],
    satisfaction: c[I.Satisfaction],
    voies: ['A', 'B', 'C'].map((x) => ({
      lettre: x,
      nom: c[I[`Voie ${x}`]],
      q1: c[I[`Q1 (${x})`]], q2: c[I[`Q2 (${x})`]], q3: c[I[`Q3 (${x})`]],
      drain: c[I[`Coût (${x})`]], loot: c[I[`Gain (${x})`]],
    })).filter((v) => v.nom),
  };
}).filter((d) => d.voies.length >= 2);

// ── outils ─────────────────────────────────────────────────────────────────

const titre = (n, t) => console.log(`\n\n  ${n}. ${t}\n  ${'─'.repeat(66)}`);
const num = (x) => (x == null ? '—' : String(Math.round(x * 100) / 100));
const mediane = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const VOIES = [];
const VERDICTS = [];
for (const d of DILEMMES) {
  const v = consulte(d);
  if (!v) continue;
  VERDICTS.push({ d, v });
  for (const p of v.classement) VOIES.push({ d, p, scope: v.scope });
}

console.log(`\n  ${DILEMMES.length} dilemmes · ${VOIES.length} voies évaluées`);

// ── 1 · 5 · 6 — min et max ─────────────────────────────────────────────────

titre('1 · 5 · 6', 'Score min et max — par variable, par question, et pathScore');

const colonnes = {
  'Q1 points': (o) => o.p.detail.Q1,
  'Q2 points': (o) => o.p.detail.Q2,
  'Q3 points (brut)': (o) => o.p.detail.Q3,
  'Q3 points (portée)': (o) => o.p.detail.q3Points,
  'q1Fear': (o) => o.p.detail.q1Fear,
  'q3Regret': (o) => o.p.detail.q3Regret,
  'q3Relief': (o) => o.p.detail.q3Relief,
  'ressources': (o) => o.p.detail.coutRessources,
  'pathPoints': (o) => o.p.pathPoints,
  'pathScore': (o) => o.p.pathScore,
};
console.log('  variable              min     max   médiane   moyenne');
for (const [nom, f] of Object.entries(colonnes)) {
  const a = VOIES.map(f);
  const moy = a.reduce((s, x) => s + x, 0) / a.length;
  console.log('  ' + nom.padEnd(20) + num(Math.min(...a)).padStart(5) +
    num(Math.max(...a)).padStart(8) + num(mediane(a)).padStart(10) + num(moy).padStart(10));
}

// ── 7 — pathPoints négatifs ────────────────────────────────────────────────

titre(7, 'Quels pathPoints sont négatifs ?');
const negs = VOIES.filter((o) => o.p.pathPoints < 0);
console.log(`  ${negs.length} voies sur ${VOIES.length} (${Math.round(negs.length / VOIES.length * 100)} %)\n`);
negs.slice(0, 12).forEach((o) => console.log(
  `  ${o.d.id}  ${num(o.p.pathPoints).padStart(6)} → ${num(o.p.pathScore).padStart(6)}   ${o.p.nom.slice(0, 40)}`));
const negBoost = negs.filter((o) => o.p.pathScore < o.p.pathPoints);
console.log(`\n  dont ${negBoost.length} qu'un boost a enfoncées davantage (le piège du signe)`);

// ── 3 — cascade de boosts ──────────────────────────────────────────────────

titre(3, 'Les boosts s\'enchaînent-ils jusqu\'à l\'absurde ?');
const facteurs = VOIES.map((o) => ({ o, f: o.p.pathPoints === 0 ? 1 : o.p.pathScore / o.p.pathPoints, n: o.p.tags.length }));
const parNb = {};
for (const x of facteurs) (parNb[x.n] ??= []).push(x);
console.log('  règles déclenchées   voies   facteur total observé');
for (const n of Object.keys(parNb).sort()) {
  const fs = parNb[n].map((x) => x.f).filter((f) => Number.isFinite(f));
  console.log(`  ${String(n).padStart(6)}             ${String(parNb[n].length).padStart(5)}   ` +
    (fs.length ? `de ×${num(Math.min(...fs))} à ×${num(Math.max(...fs))}` : '—'));
}
const maxTags = Math.max(...VOIES.map((o) => o.p.tags.length));
console.log(`\n  maximum de règles sur une même voie : ${maxTags}`);

// ── 8 — heartOverBody et bodyWisdom ────────────────────────────────────────

titre(8, 'heartOverBody et bodyWisdom se superposent-ils ?');
const a = VOIES.filter((o) => o.p.tags.some((t) => t.cle === 'heartOverBody'));
const b = VOIES.filter((o) => o.p.tags.some((t) => t.cle === 'bodyWisdom'));
const deux = VOIES.filter((o) => o.p.tags.some((t) => t.cle === 'heartOverBody') &&
  o.p.tags.some((t) => t.cle === 'bodyWisdom'));
console.log(`  heartOverBody seul : ${a.length - deux.length}`);
console.log(`  bodyWisdom seul    : ${b.length - deux.length}`);
console.log(`  LES DEUX           : ${deux.length}   ← ×2 puis ×0,5, effet net nul et silencieux`);
deux.slice(0, 8).forEach((o) => console.log(`     ${o.d.id}  ${o.p.nom.slice(0, 46)}`));

// ── 4 — zone morte peur / regret ───────────────────────────────────────────

titre(4, 'Zone morte entre avoidanceFear et protectiveFear');
const peureuses = VOIES.filter((o) => isHigh(o.p.detail.q1Fear, CONSTANTES));
const morte = peureuses.filter((o) => o.p.detail.q3Regret > 0 && !isHigh(o.p.detail.q3Regret, CONSTANTES));
console.log(`  voies avec une peur forte : ${peureuses.length}`);
console.log(`  dont dans la zone morte   : ${morte.length}  (q3Regret entre 1 et ${CONSTANTES.THRESHOLD - 1})`);
morte.slice(0, 8).forEach((o) => console.log(
  `     ${o.d.id}  fear ${num(o.p.detail.q1Fear)} · regret ${num(o.p.detail.q3Regret)}   ${o.p.nom.slice(0, 36)}`));

// ── 9 — les mots qui ne devraient pas passer ───────────────────────────────

titre(9, 'Quels mots ne devraient pas passer avec includes() ?');
console.log('  Une racine trouvée AU MILIEU d\'un mot : includes() ne s\'ancre nulle part.\n');

const suspects = new Map();
for (const d of DILEMMES) {
  for (const v of d.voies) {
    for (const [q, txt] of [['Q1', [v.nom, v.q1].filter(Boolean).join(' . ')], ['Q2', v.q2], ['Q3', v.q3]]) {
      if (!txt) continue;
      const t = normalise(txt);
      for (const occ of occurrences(txt, q, { HP: d.HP })) {
        const avant = occ.debut > 0 ? t[occ.debut - 1] : ' ';
        if (/[a-z0-9]/.test(avant)) {
          const m = t.slice(0, occ.fin).match(/[a-z0-9'-]+$/);
          const cle = `${occ.mot}  dans  ${m ? m[0] + t.slice(occ.fin).match(/^[a-z0-9'-]*/)[0] : '?'}  (${occ.champ}/${occ.famille})`;
          suspects.set(cle, (suspects.get(cle) ?? 0) + 1);
        }
      }
    }
  }
}
if (!suspects.size) console.log('  aucun');
[...suspects.entries()].sort((x, y) => y[1] - x[1])
  .forEach(([k, n]) => console.log(`     « ${k} »   ${n}×`));

// ── 12 — distribution et position du zéro ──────────────────────────────────

titre(12, 'Distribution des pathScore et position du zéro');
const scores = VOIES.map((o) => o.p.pathScore).sort((x, y) => x - y);
const q = (p) => scores[Math.floor((scores.length - 1) * p)];
console.log(`  min ${num(scores[0])} · q1 ${num(q(0.25))} · médiane ${num(q(0.5))} · q3 ${num(q(0.75))} · max ${num(scores[scores.length - 1])}`);
console.log(`  sous zéro : ${scores.filter((x) => x < 0).length} · à zéro : ${scores.filter((x) => x === 0).length} · au-dessus : ${scores.filter((x) => x > 0).length}`);
console.log('\n  Avec X et Z à ' + CONSTANTES.X + ' :');
const rangs = {};
for (const o of VOIES) rangs[o.p.rang] = (rangs[o.p.rang] ?? 0) + 1;
Object.entries(rangs).forEach(([r, n]) => console.log(`     ${r.padEnd(12)} ${n} voies (${Math.round(n / VOIES.length * 100)} %)`));

// ── 2 — types de verdict ───────────────────────────────────────────────────

titre(2, 'Types de verdict produits');
const types = {};
for (const { v } of VERDICTS) types[v.type] = (types[v.type] ?? 0) + 1;
Object.entries(types).sort((x, y) => y[1] - x[1])
  .forEach(([t, n]) => console.log(`     ${t.padEnd(14)} ${n}`));

// ── 11 — corrélation avec la satisfaction ──────────────────────────────────

titre(11, 'Corrélation du score avec la satisfaction');
console.log('  (le seul test qui ouvre la colonne Satisfaction)\n');
const paires = VERDICTS.filter(({ d, v }) => d.satisfaction && v.gagnante);
const parSat = {};
for (const { d, v } of paires) (parSat[d.satisfaction] ??= []).push(v.gagnante.pathScore);
for (const [s, a] of Object.entries(parSat)) {
  console.log(`     ${s.padEnd(6)} ${String(a.length).padStart(2)} dilemmes · score moyen de la voie recommandée ${num(a.reduce((x, y) => x + y, 0) / a.length)}`);
}

console.log('\n');
