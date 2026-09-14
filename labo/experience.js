/**
 * EXPÉRIENCE — la lecture automatique du texte libre est-elle viable ?
 *
 * Protocole : pour chacune des réponses en texte libre de l'historique, on
 * compare le cran lu automatiquement au cran assigné à la main lors de
 * l'encodage.
 *
 * TROIS MESURES, par ordre d'importance croissante :
 *   1. couverture  — sur combien de réponses le lecteur ose-t-il se prononcer
 *   2. exactitude  — quand il se prononce, tombe-t-il juste
 *   3. CONCORDANCE DES VERDICTS — l'oracle désigne-t-il la même option
 *
 * La 3e est la seule qui compte vraiment : se tromper d'un cran ne change
 * souvent pas le gagnant.
 *
 * BIAIS CONNU ET ASSUMÉ : les étiquettes de référence sont mes propres
 * interprétations, et j'ai lu ces textes avant d'écrire le lexique. Le
 * résultat est donc une borne OPTIMISTE.
 */

import { LECTEURS } from './lecture.js';
import { consulter } from '../js/oracle.js';
import { HISTORIQUE } from '../data/historique.js';

const QUESTIONS = ['q1', 'q2', 'q3'];
const VOISINS = {
  q1: ['flemme', 'bof', 'peur', 'trac', 'partant', 'elan'],
  q2: ['rien', 'petit', 'bon', 'nourrit', 'change'],
  q3: ['soulage', 'rien', 'reporte', 'frustre', 'regret', 'rate'],
};

const stats = {};
for (const q of QUESTIONS) stats[q] = { total: 0, lus: 0, justes: 0, proches: 0, faux: [] };

for (const d of HISTORIQUE) {
  for (const o of d.options) {
    for (const q of QUESTIONS) {
      const texte = o.notes?.[q];
      if (!texte) continue;
      const attendu = o[q];
      const s = stats[q];
      s.total++;

      const lu = LECTEURS[q](texte);
      if (!lu) continue;
      s.lus++;

      if (lu.cran === attendu) {
        s.justes++;
      } else {
        const i = VOISINS[q].indexOf(lu.cran);
        const j = VOISINS[q].indexOf(attendu);
        if (Math.abs(i - j) === 1) s.proches++;
        s.faux.push({ texte, attendu, lu: lu.cran, conf: lu.confiance });
      }
    }
  }
}

/* --- Mesure 3 : les verdicts changent-ils ? --- */

function relire(d, secours) {
  return {
    ...d,
    options: d.options.map((o) => {
      const copie = { ...o };
      for (const q of QUESTIONS) {
        const lu = o.notes?.[q] ? LECTEURS[q](o.notes[q]) : null;
        // secours 'main'   = l'utilisatrice confirme quand le lecteur sèche
        // secours 'defaut' = le lecteur est seul, il retombe sur un cran neutre
        copie[q] = lu ? lu.cran
          : secours === 'main' ? o[q]
          : { q1: 'bof', q2: 'rien', q3: 'rien' }[q];
      }
      return copie;
    }),
  };
}

function concordance(secours) {
  let memeGagnant = 0, memeType = 0, total = 0;
  const ecarts = [];
  for (const d of HISTORIQUE) {
    const ref = consulter(d);
    const auto = consulter(relire(d, secours));
    if (!ref || !auto) continue;
    total++;
    if (ref.gagnant.nom === auto.gagnant.nom) memeGagnant++;
    else ecarts.push(`${d.date} : « ${ref.gagnant.nom} » → « ${auto.gagnant.nom} »`);
    if (ref.type === auto.type) memeType++;
  }
  return { memeGagnant, memeType, total, ecarts };
}

/* --- Rapport --- */

const pc = (n, d) => (d ? Math.round((n / d) * 100) : 0);

console.log('\n  EXPÉRIENCE — lire le texte libre sans LLM\n');
console.log('  ' + '─'.repeat(72));
console.log('  ' + 'Question'.padEnd(14) + 'réponses'.padEnd(11) + 'couverture'.padEnd(13) +
  'exactitude'.padEnd(13) + 'à un cran près');
console.log('  ' + '─'.repeat(72));

for (const q of QUESTIONS) {
  const s = stats[q];
  console.log('  ' + q.toUpperCase().padEnd(14) +
    String(s.total).padEnd(11) +
    `${pc(s.lus, s.total)}%`.padEnd(13) +
    `${pc(s.justes, s.lus)}%`.padEnd(13) +
    `${pc(s.justes + s.proches, s.lus)}%`);
}

const T = QUESTIONS.reduce((a, q) => ({
  total: a.total + stats[q].total, lus: a.lus + stats[q].lus,
  justes: a.justes + stats[q].justes, proches: a.proches + stats[q].proches,
}), { total: 0, lus: 0, justes: 0, proches: 0 });

console.log('  ' + '─'.repeat(72));
console.log('  ' + 'ENSEMBLE'.padEnd(14) + String(T.total).padEnd(11) +
  `${pc(T.lus, T.total)}%`.padEnd(13) + `${pc(T.justes, T.lus)}%`.padEnd(13) +
  `${pc(T.justes + T.proches, T.lus)}%`);

console.log('\n\n  CE QUI COMPTE VRAIMENT — le verdict change-t-il ?\n');
for (const [nom, secours] of [
  ['Lecture SEULE (le lecteur sèche → cran neutre)', 'defaut'],
  ['Lecture + CONFIRMATION (le lecteur sèche → on te demande)', 'main'],
]) {
  const c = concordance(secours);
  console.log(`  ${nom}`);
  console.log(`    même option désignée : ${c.memeGagnant}/${c.total}  (${pc(c.memeGagnant, c.total)}%)`);
  console.log(`    même type de verdict : ${c.memeType}/${c.total}  (${pc(c.memeType, c.total)}%)`);
  for (const e of c.ecarts) console.log(`      ≠ ${e}`);
  console.log('');
}

console.log('\n  OÙ ÇA SE TROMPE (échantillon)\n');
for (const q of QUESTIONS) {
  const ex = stats[q].faux.slice(0, 4);
  if (!ex.length) continue;
  console.log(`  ${q.toUpperCase()}`);
  for (const f of ex) {
    const t = f.texte.length > 46 ? f.texte.slice(0, 45) + '…' : f.texte;
    console.log(`    « ${t} »`);
    console.log(`        lu: ${f.lu.padEnd(9)} attendu: ${f.attendu.padEnd(9)} (${f.conf})`);
  }
  console.log('');
}
