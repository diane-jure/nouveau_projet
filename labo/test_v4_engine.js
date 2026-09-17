/**
 * TESTS EN LABO — Oracle V4.
 *
 *   node labo/v4/test_v4_engine.js
 *
 * Rejoue le cerveau sur les 25 dilemmes réels de labo/saves/sauvegardes.csv
 * et répond, dans l'ordre, aux questions de la liste « Tests en labo » de
 * QF_documentation/oracle_cerveau.md.
 *
 * Aucun de ces tests ne règle un poids : ils décrivent ce que le moteur
 * fait, pour que les seuils X et Z soient choisis en connaissance de cause.
 */

import { readFileSync } from 'node:fs';
import { askOracle, isHigh, THRESHOLD, X } from '/v4/oracle/brain.js';
import { normalize, occurrences } from './oracle/scan.js';

// ── les dilemmes réels ─────────────────────────────────────────────────────

const L = readFileSync('./saves/sauvegardes.csv', 'utf-8')
  .split('\n').filter((l) => l.trim().startsWith('|'));
const cells = (l) => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
const E = cells(L[0]);
const I = Object.fromEntries(E.map((n, i) => [n, i]));

const DILEMMAS = L.slice(2).filter((l) => l.replace(/[|\-\s]/g, '')).map((l) => {
  const c = cells(l);
  return {
    id: (c[I.id] || '').slice(0, 10),
    HP: Number(c[I.Energie]) || 3,
    q0: c[I.Q0],
    satisfaction: c[I.Satisfaction],
    paths: ['A', 'B', 'C'].map((x) => ({
      letter: x,
      name: c[I[`Voie ${x}`]],
      q1: c[I[`Q1 (${x})`]], q2: c[I[`Q2 (${x})`]], q3: c[I[`Q3 (${x})`]],
      drain: c[I[`Coût (${x})`]], loot: c[I[`Gain (${x})`]],
    })).filter((p) => p.name),
  };
}).filter((d) => d.paths.length >= 2);

// ── outils ─────────────────────────────────────────────────────────────────

const heading = (n, t) => console.log(`\n\n  ${n}. ${t}\n  ${'─'.repeat(66)}`);
const num = (x) => (x == null ? '—' : String(Math.round(x * 100) / 100));
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const PATHS = [];
const ANSWERS = [];
for (const d of DILEMMAS) {
  const v = askOracle(d);
  if (!v) continue;
  ANSWERS.push({ d, v });
  for (const p of v.ranking) PATHS.push({ d, p, scope: v.scope });
}

console.log(`\n  ${DILEMMAS.length} dilemmes · ${PATHS.length} voies évaluées`);

// ── 1 · 5 · 6 — min et max ─────────────────────────────────────────────────

heading('1 · 5 · 6', 'Score min et max — par variable, par question, et pathScore');

const columns = {
  'Q1 points': (o) => o.p.detail.Q1,
  'Q2 points': (o) => o.p.detail.Q2,
  'Q3 points (brut)': (o) => o.p.detail.Q3,
  'Q3 points (portée)': (o) => o.p.detail.q3Points,
  'q1Fear': (o) => o.p.detail.q1Fear,
  'q3Regret': (o) => o.p.detail.q3Regret,
  'q3Relief': (o) => o.p.detail.q3Relief,
  'ressources': (o) => o.p.detail.resources,
  'pathPoints': (o) => o.p.pathPoints,
  'pathScore': (o) => o.p.pathScore,
};
console.log('  variable              min     max   médiane   moyenne');
for (const [name, f] of Object.entries(columns)) {
  const a = PATHS.map(f);
  const mean = a.reduce((s, x) => s + x, 0) / a.length;
  console.log('  ' + name.padEnd(20) + num(Math.min(...a)).padStart(5) +
    num(Math.max(...a)).padStart(8) + num(median(a)).padStart(10) + num(mean).padStart(10));
}

// ── 7 — pathPoints négatifs ────────────────────────────────────────────────

heading(7, 'Quels pathPoints sont négatifs ?');
const negs = PATHS.filter((o) => o.p.pathPoints < 0);
console.log(`  ${negs.length} voies sur ${PATHS.length} (${Math.round(negs.length / PATHS.length * 100)} %)\n`);
negs.slice(0, 12).forEach((o) => console.log(
  `  ${o.d.id}  ${num(o.p.pathPoints).padStart(6)} → ${num(o.p.pathScore).padStart(6)}   ${o.p.name.slice(0, 40)}`));
const negBoost = negs.filter((o) => o.p.pathScore < o.p.pathPoints);
console.log(`\n  dont ${negBoost.length} qu'un boost a enfoncées davantage (le piège du signe)`);

// ── 3 — cascade de boosts ──────────────────────────────────────────────────

heading(3, 'Les boosts s\'enchaînent-ils jusqu\'à l\'absurde ?');
const factors = PATHS.map((o) => ({ o, f: o.p.pathPoints === 0 ? 1 : o.p.pathScore / o.p.pathPoints, n: o.p.tags.length }));
const byRuleCount = {};
for (const x of factors) (byRuleCount[x.n] ??= []).push(x);
console.log('  règles déclenchées   voies   facteur total observé');
for (const n of Object.keys(byRuleCount).sort()) {
  const fs = byRuleCount[n].map((x) => x.f).filter((f) => Number.isFinite(f));
  console.log(`  ${String(n).padStart(6)}             ${String(byRuleCount[n].length).padStart(5)}   ` +
    (fs.length ? `de ×${num(Math.min(...fs))} à ×${num(Math.max(...fs))}` : '—'));
}
const maxTags = Math.max(...PATHS.map((o) => o.p.tags.length));
console.log(`\n  maximum de règles sur une même voie : ${maxTags}`);

// ── 8 — heartOverBody et bodyWisdom ────────────────────────────────────────

heading(8, 'heartOverBody et bodyWisdom se superposent-ils ?');
const a = PATHS.filter((o) => o.p.tags.some((t) => t.key === 'heartOverBody'));
const b = PATHS.filter((o) => o.p.tags.some((t) => t.key === 'bodyWisdom'));
const bothBodyRules = PATHS.filter((o) => o.p.tags.some((t) => t.key === 'heartOverBody') &&
  o.p.tags.some((t) => t.key === 'bodyWisdom'));
console.log(`  heartOverBody seul : ${a.length - bothBodyRules.length}`);
console.log(`  bodyWisdom seul    : ${b.length - bothBodyRules.length}`);
console.log(`  LES DEUX           : ${bothBodyRules.length}   ← ×2 puis ×0,5, effet net nul et silencieux`);
bothBodyRules.slice(0, 8).forEach((o) => console.log(`     ${o.d.id}  ${o.p.name.slice(0, 46)}`));

// ── 4 — zone morte peur / regret ───────────────────────────────────────────

heading(4, 'Zone morte entre avoidanceFear et protectiveFear');
const fearHigh = PATHS.filter((o) => isHigh(o.p.detail.q1Fear));
const deadZone = fearHigh.filter((o) => o.p.detail.q3Regret > 0 && !isHigh(o.p.detail.q3Regret));
console.log(`  voies avec une peur forte : ${fearHigh.length}`);
console.log(`  dont dans la zone morte   : ${deadZone.length}  (q3Regret entre 1 et ${THRESHOLD - 1})`);
deadZone.slice(0, 8).forEach((o) => console.log(
  `     ${o.d.id}  fear ${num(o.p.detail.q1Fear)} · regret ${num(o.p.detail.q3Regret)}   ${o.p.name.slice(0, 36)}`));

// ── 9 — les mots qui ne devraient pas passer ───────────────────────────────

heading(9, 'Quels mots ne devraient pas passer avec includes() ?');
console.log('  Une racine trouvée AU MILIEU d\'un mot : includes() ne s\'ancre nulle part.\n');

const suspects = new Map();
for (const d of DILEMMAS) {
  for (const p of d.paths) {
    for (const [q, txt] of [['Q1', [p.name, p.q1].filter(Boolean).join(' . ')], ['Q2', p.q2], ['Q3', p.q3]]) {
      if (!txt) continue;
      const t = normalize(txt);
      for (const occ of occurrences(txt, q, { HP: d.HP })) {
        const before = occ.start > 0 ? t[occ.start - 1] : ' ';
        if (/[a-z0-9]/.test(before)) {
          const m = t.slice(0, occ.end).match(/[a-z0-9'-]+$/);
          const key = `${occ.keyword}  dans  ${m ? m[0] + t.slice(occ.end).match(/^[a-z0-9'-]*/)[0] : '?'}  (${occ.field}/${occ.family})`;
          suspects.set(key, (suspects.get(key) ?? 0) + 1);
        }
      }
    }
  }
}
if (!suspects.size) console.log('  aucun');
[...suspects.entries()].sort((x, y) => y[1] - x[1])
  .forEach(([k, n]) => console.log(`     « ${k} »   ${n}×`));

// ── 12 — distribution et position du zéro ──────────────────────────────────

heading(12, 'Distribution des pathScore et position du zéro');
const scores = PATHS.map((o) => o.p.pathScore).sort((x, y) => x - y);
const q = (p) => scores[Math.floor((scores.length - 1) * p)];
console.log(`  min ${num(scores[0])} · q1 ${num(q(0.25))} · médiane ${num(q(0.5))} · q3 ${num(q(0.75))} · max ${num(scores[scores.length - 1])}`);
console.log(`  sous zéro : ${scores.filter((x) => x < 0).length} · à zéro : ${scores.filter((x) => x === 0).length} · au-dessus : ${scores.filter((x) => x > 0).length}`);
console.log('\n  Avec X et Z à ' + X + ' :');
const ranks = {};
for (const o of PATHS) ranks[o.p.pathRank] = (ranks[o.p.pathRank] ?? 0) + 1;
Object.entries(ranks).forEach(([r, n]) => console.log(`     ${r.padEnd(12)} ${n} voies (${Math.round(n / PATHS.length * 100)} %)`));

// ── 2 — types de verdict ───────────────────────────────────────────────────

heading(2, 'Types de verdict produits');
const types = {};
for (const { v } of ANSWERS) types[v.verdictType] = (types[v.verdictType] ?? 0) + 1;
Object.entries(types).sort((x, y) => y[1] - x[1])
  .forEach(([t, n]) => console.log(`     ${t.padEnd(14)} ${n}`));

// ── 11 — corrélation avec la satisfaction ──────────────────────────────────

heading(11, 'Corrélation du score avec la satisfaction');
console.log('  (le seul test qui ouvre la colonne Satisfaction)\n');
const pairs = ANSWERS.filter(({ d, v }) => d.satisfaction && v.verdict);
const bySatisfaction = {};
for (const { d, v } of pairs) (bySatisfaction[d.satisfaction] ??= []).push(v.verdict.pathScore);
for (const [s, a] of Object.entries(bySatisfaction)) {
  console.log(`     ${s.padEnd(6)} ${String(a.length).padStart(2)} dilemmes · score moyen de la voie recommandée ${num(a.reduce((x, y) => x + y, 0) / a.length)}`);
}

console.log('\n');
