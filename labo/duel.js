/**
 * DUEL — l'oracle v2.5 (celui de l'autrice) contre le moteur de ce dépôt,
 * jugés sur les 25 dilemmes réels de docs/sauvegardes.md, avec SON critère.
 *
 * Critère `OracleWasRight`, tel que défini dans docs/oracle_cerveau.md :
 *   vrai si  recommandation == choix  ET  satisfaction = good
 *   vrai si  recommandation != choix  ET  satisfaction = bad ou meh
 *
 * Autrement dit : l'oracle a eu raison quand il a approuvé un bon choix,
 * OU quand il a désapprouvé un choix qui s'est mal passé.
 *
 * Les crans du moteur sont déduits du texte libre par labo/lecture.js, dont
 * on sait qu'il est imparfait (~70 % d'exactitude). Le résultat du moteur
 * est donc une estimation BASSE de ce qu'il ferait avec des crans corrects.
 */

import { readFileSync } from 'node:fs';
import { LECTEURS } from './lecture.js';
import { consulter } from '../js/oracle.js';

/* --- Lecture du tableau --- */
const lignes = readFileSync('docs/sauvegardes.md', 'utf-8')
  .split('\n').filter((l) => l.trim().startsWith('|'));
const E = lignes[0].replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const I = Object.fromEntries(E.map((n, i) => [n, i]));
const corps = lignes.slice(2).filter((l) => l.replace(/[|\-\s]/g, ''));
const cols = (l) => {
  const c = l.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
  return [...c, ...Array(Math.max(0, E.length - c.length)).fill('')];
};

const q0De = (brut) => {
  const t = (brut ?? '').toLowerCase();
  if (/^oui|^\s*oui/.test(t)) return 'oui';
  if (/^non/.test(t)) return 'non';
  if (/peut-?etre|peut-?être|maybe/.test(t)) return 'bof';
  return 'bof';
};

const LETTRES = ['A', 'B', 'C'];

const dilemmes = corps.map((l) => {
  const c = cols(l);
  const options = LETTRES.map((L) => ({
    lettre: L,
    nom: c[I[`Voie ${L}`]],
    textes: { q1: c[I[`Q1 (${L})`]], q2: c[I[`Q2 (${L})`]], q3: c[I[`Q3 (${L})`]] },
    cout: Number(c[I[`Coût (${L})`]] || 0),
    gain: Number(c[I[`Gain (${L})`]] || 0),
  })).filter((o) => o.nom);

  return {
    id: c[I.id], q0: q0De(c[I.Q0]),
    state: Number(c[I.State] || 0), energie: Number(c[I.Energie] || 0),
    options,
    verdictV25: c[I['Verdict Oracle']],
    decision: c[I['Décision finale']],
    satisfaction: c[I.Satisfaction],
    commentaire: c[I.Commentaire],
  };
});

/* --- Le moteur de ce dépôt, nourri par la lecture du texte libre --- */
function verdictMoteur(d) {
  const options = d.options.map((o) => {
    const r = {};
    for (const q of ['q1', 'q2', 'q3']) {
      const lu = o.textes[q] ? LECTEURS[q](o.textes[q]) : null;
      r[q] = lu ? lu.cran : { q1: 'bof', q2: 'rien', q3: 'rien' }[q];
    }
    return { nom: o.nom, ...r };
  });
  const v = consulter({ q0: d.q0, options });
  if (!v) return null;
  if (v.drapeaux.includes('aucuneNAppelle')) return { code: 'X', v };
  if (v.type === 'PILE_OU_FACE') return { code: 'Y', v };
  return { code: LETTRES[d.options.findIndex((o) => o.nom === v.gagnant.nom)], v };
}

/** Le critère de l'autrice, applicable aux deux oracles. */
function aEuRaison(reco, decision, satisfaction) {
  if (!reco || !decision || !satisfaction) return null;  // non jugeable
  if (reco === 'Y') return null;                          // pile ou face : neutre
  const suivi = reco === decision || (reco === 'X' && !LETTRES.includes(decision));
  if (suivi) return satisfaction === 'good';
  return satisfaction === 'bad' || satisfaction === 'meh';
}

/* --- Comparaison --- */
const score = { v25: { ok: 0, ko: 0 }, moteur: { ok: 0, ko: 0 } };
const lignesRapport = [];
let suiviGood = [0, 0], nonSuiviGood = [0, 0];

for (const d of dilemmes) {
  const m = verdictMoteur(d);
  const rV25 = aEuRaison(d.verdictV25, d.decision, d.satisfaction);
  const rMot = aEuRaison(m?.code, d.decision, d.satisfaction);
  if (rV25 !== null) score.v25[rV25 ? 'ok' : 'ko']++;
  if (rMot !== null) score.moteur[rMot ? 'ok' : 'ko']++;

  // A-t-elle suivi l'oracle, et est-elle satisfaite ?
  if (d.satisfaction && d.verdictV25 && LETTRES.includes(d.verdictV25) && d.decision) {
    const suivi = d.verdictV25 === d.decision;
    const cible = suivi ? suiviGood : nonSuiviGood;
    cible[1]++;
    if (d.satisfaction === 'good') cible[0]++;
  }

  const marque = (r) => (r === null ? ' · ' : r ? ' ✓ ' : ' ✗ ');
  lignesRapport.push(
    '  ' + (d.id ?? '').slice(0, 10).padEnd(12) +
    `q0:${d.q0.padEnd(4)} én:${String(d.energie).padEnd(2)} ` +
    `v2.5:${(d.verdictV25 || '–').padEnd(2)}${marque(rV25)}` +
    `moteur:${(m?.code || '–').padEnd(2)}${marque(rMot)}` +
    `fait:${(d.decision || '–').padEnd(3)} ${(d.satisfaction || '').padEnd(5)}`
  );
}

const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);

console.log('\n  DUEL — oracle v2.5 vs moteur de ce dépôt');
console.log('  25 dilemmes réels, critère « OracleWasRight » de oracle_cerveau.md\n');
console.log(lignesRapport.join('\n'));
console.log('\n  ' + '─'.repeat(62));
console.log(`  oracle v2.5 : ${score.v25.ok} justes / ${score.v25.ok + score.v25.ko} jugeables  (${pc(score.v25.ok, score.v25.ok + score.v25.ko)}%)`);
console.log(`  moteur ici  : ${score.moteur.ok} justes / ${score.moteur.ok + score.moteur.ko} jugeables  (${pc(score.moteur.ok, score.moteur.ok + score.moteur.ko)}%)`);

console.log('\n  Suivre l\'oracle rend-il plus satisfaite ?');
console.log(`    a suivi      : ${suiviGood[0]}/${suiviGood[1]} good  (${pc(suiviGood[0], suiviGood[1])}%)`);
console.log(`    n'a pas suivi: ${nonSuiviGood[0]}/${nonSuiviGood[1]} good  (${pc(nonSuiviGood[0], nonSuiviGood[1])}%)`);
console.log('\n  ✓ = a eu raison   ✗ = a eu tort   · = non jugeable (pile ou face, ou données manquantes)\n');

/* ------------------------------------------------------------------ */
/*  TEST À L'AVEUGLE                                                    */
/*                                                                      */
/*  Le moteur a été conçu en regardant les dilemmes de data/historique. */
/*  Les scores ci-dessus le favorisent donc. On refait la mesure sur    */
/*  les seuls dilemmes qu'il n'a JAMAIS vus — un vrai hold-out.         */
/* ------------------------------------------------------------------ */

const { HISTORIQUE } = await import('../data/historique.js');
const vus = new Set(HISTORIQUE.map((d) => d.date));          // 'AAAA-MM-JJ'
const dateDe = (id) => (id ?? '').slice(0, 10);

const inedits = dilemmes.filter((d) => !vus.has(dateDe(d.id)));
const connus = dilemmes.filter((d) => vus.has(dateDe(d.id)));

function bilan(lot) {
  const s = { v25: [0, 0], moteur: [0, 0] };
  for (const d of lot) {
    const m = verdictMoteur(d);
    const a = aEuRaison(d.verdictV25, d.decision, d.satisfaction);
    const b = aEuRaison(m?.code, d.decision, d.satisfaction);
    if (a !== null) { s.v25[1]++; if (a) s.v25[0]++; }
    if (b !== null) { s.moteur[1]++; if (b) s.moteur[0]++; }
  }
  return s;
}

console.log('  ' + '═'.repeat(62));
console.log('  TEST À L\'AVEUGLE — seulement les dilemmes jamais vus par le moteur\n');
for (const [nom, lot] of [['déjà vus (moteur avantagé)', connus], ['INÉDITS (test honnête)', inedits]]) {
  const s = bilan(lot);
  console.log(`  ${nom}  — ${lot.length} dilemmes`);
  console.log(`      oracle v2.5 : ${s.v25[0]}/${s.v25[1]}  (${pc(s.v25[0], s.v25[1])}%)`);
  console.log(`      moteur ici  : ${s.moteur[0]}/${s.moteur[1]}  (${pc(s.moteur[0], s.moteur[1])}%)\n`);
}
console.log('  Dilemmes inédits : ' + inedits.map((d) => dateDe(d.id)).join(', ') + '\n');
