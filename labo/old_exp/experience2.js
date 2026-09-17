/**
 * EXPÉRIENCE 2 — le désaccord se produit-il n'importe où, ou seulement là où
 * l'oracle hésitait déjà ?
 *
 * Se tromper de gagnant sur un dilemme à égalité ne coûte presque rien :
 * l'oracle disait lui-même "c'est serré". Se tromper sur un verdict net, si.
 */

import { LECTEURS } from './lecture.js';
import { consulter } from '../v.QCM/js/oracle.js';
import { HISTORIQUE } from '../v.QCM/data/historique.js';
import { SEUILS } from '../v.QCM/js/scales.js';

const Q = ['q1', 'q2', 'q3'];

const relire = (d) => ({
  ...d,
  options: d.options.map((o) => {
    const c = { ...o };
    for (const q of Q) {
      const lu = o.notes?.[q] ? LECTEURS[q](o.notes[q]) : null;
      c[q] = lu ? lu.cran : o[q]; // lecture + confirmation
    }
    return c;
  }),
});

const groupes = {
  'verdict NET (écart ≥ 3)':      { f: (v) => v.ecart >= 3, ok: 0, n: 0, ecarts: [] },
  'verdict franc (1.2 ≤ é < 3)':  { f: (v) => v.ecart >= SEUILS.serre && v.ecart < 3, ok: 0, n: 0, ecarts: [] },
  'SERRÉ / pile ou face':         { f: (v) => v.ecart < SEUILS.serre, ok: 0, n: 0, ecarts: [] },
};

let drapeauxOk = 0, drapeauxN = 0;

for (const d of HISTORIQUE) {
  const ref = consulter(d);
  const auto = consulter(relire(d));
  if (!ref || !auto) continue;

  for (const g of Object.values(groupes)) {
    if (!g.f(ref)) continue;
    g.n++;
    if (ref.gagnant.nom === auto.gagnant.nom) g.ok++;
    else g.ecarts.push(`${d.date} (écart ${ref.ecart}) : « ${ref.gagnant.nom} » → « ${auto.gagnant.nom} »`);
  }

  // Les drapeaux survivent-ils ? Ce sont eux qui portent les mises en garde.
  for (const dr of ['aucuneNAppelle', 'grandeDecision', 'peurQuiCompte', 'peurQuiProtege', 'engagement']) {
    if (ref.drapeaux.includes(dr)) {
      drapeauxN++;
      if (auto.drapeaux.includes(dr)) drapeauxOk++;
    }
  }
}

const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);

console.log('\n  Le désaccord se concentre-t-il sur les dilemmes déjà serrés ?\n');
console.log('  ' + '─'.repeat(66));
for (const [nom, g] of Object.entries(groupes)) {
  console.log('  ' + nom.padEnd(32) + `${g.ok}/${g.n}`.padEnd(10) + `${pc(g.ok, g.n)}%`);
  for (const e of g.ecarts) console.log(`      ≠ ${e}`);
}
console.log('  ' + '─'.repeat(66));
console.log(`\n  Mises en garde préservées : ${drapeauxOk}/${drapeauxN}  (${pc(drapeauxOk, drapeauxN)}%)`);
console.log('    (aucuneNAppelle, grandeDecision, peurQuiCompte, peurQuiProtege, engagement)\n');
