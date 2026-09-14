/**
 * V2 contre V2.5 — reconstruction des deux moteurs depuis docs/oracle_version/,
 * exécutés sur les 25 dilemmes réels de docs/sauvegardes.md.
 *
 * ⚠️ Reconstruction à partir des extraits documentés. Les fonctions de phrase
 * (_getClearPhrase, etc.) n'affectent pas le verdict et sont ignorées ; la
 * logique de choix, elle, est reproduite fidèlement.
 *
 * Correspondances avec les colonnes des sauvegardes :
 *   spoons     → Energie        cost → Coût        energyGain → Gain
 *   q4 (de V2) → la réponse Q0  (Q4 par voie est devenue Q0 globale)
 */

import { readFileSync } from 'node:fs';

const M = (t, mots) => mots.some((m) => t.includes(m));

/* ------------------------------ ORACLE V2 ------------------------------ */
function oracleV2(options, spoons, q0texte) {
  const analyses = options.filter((o) => o.name?.trim()).map((opt) => {
    const q1 = (opt.q1 || '').toLowerCase(), q2 = (opt.q2 || '').toLowerCase();
    const q3 = (opt.q3 || '').toLowerCase(), q4 = (q0texte || '').toLowerCase();
    let score = 0;
    const s = { n1: [], n2: [], n3: [], n4: [] };

    if (M(q2, ['mega fiere', 'fiere', 'fierte'])) { score += 5; s.n1.push('green'); }
    if (M(q2, ["s'amuse de fou", 'kiffe grave', 'adore'])) { score += 5; s.n1.push('green'); }
    if (M(q2, ['a fond']) || M(q1, ['excit', 'hate'])) { score += 5; s.n1.push('green'); }
    if (M(q3, ['honteu', 'degout', 'fache', 'nulle'])) { score += 4; s.n1.push('green'); }
    if (M(q3, ['trop deg', 'triste'])) { score += 4; s.n1.push('green'); }
    if (M(q1, ['angoisse', 'peur', 'panique'])) { score -= 5; s.n1.push('red'); }
    if (M(q1, ['oppresse', 'noeud au ventre'])) { score -= 5; s.n1.push('red'); }

    const flemme = q1.includes('flemme');
    if (flemme) {
      const vraie = M(q1, ["peur de m'ennuyer", 'ca me soule']) ||
        M(q3, ['change rien', 'un poil coupable']) || M(q4, ["au pire c'est pas grave", "je m'en fous"]);
      const inertie = s.n1.includes('green') || M(q3, ['honteu', 'degout', 'fache']);
      if (vraie && !inertie) score -= 3; else if (inertie) score -= 1; else score -= 2;
      s.n2.push('flemme');
    }
    if (M(q3, ['soulage', 'tranquille', 'ouf ', 'repos'])) { score -= 4; s.n2.push('red'); }
    if (M(q3, ['gene', 'awkward', 'ils vont', 'vont penser', 'je les verrai'])) { score -= 3; s.n2.push('red'); }
    if (M(q3, ['coupable', 'honte']) && !q3.includes('un poil coupable')) { score -= 3; s.n2.push('red'); }
    if (M(q1, ['je devrais', 'il faut que', 'obligation'])) { score -= 3; s.n2.push('red'); }

    if (M(q1, ['why not', 'pourquoi pas', 'ca pourrait'])) score += 2;
    if (M(q1, ['curieu', 'interesse'])) score += 2;
    if (M(q3, ['dommage', 'maybe deg'])) score += 2;
    if (M(q1, ['bof', 'mouais', 'meh'])) score -= 2;
    if (q1.includes('pas envie') && !flemme) score -= 2;
    if (M(q3, ['change rien', 'rien de special'])) score -= 3;   // V2 : -3
    if (M(q3, ["je m'en fous", 'osef', "m'en fiche"])) score -= 2;
    if (M(q2, ['passer le temps', 'en attendant'])) score -= 1;

    if (M(q4, ['au pire', 'pas la fin du monde', 'osef', "je m'en fous"])) score /= 2;

    const cost = parseInt(opt.cost) || 0, gain = parseInt(opt.energyGain) || 0;
    const netCost = cost - gain, deficit = netCost - spoons;
    const ratio = spoons > 0 ? netCost / spoons : 999;
    const fortN1 = s.n1.length > 0;                              // V2 : tout signal N1
    if (!fortN1 && deficit > 0) score -= ratio >= 2 ? 3 : ratio >= 1.5 ? 2 : 1;

    return { option: opt, score: Math.round(score * 10) / 10, s, cost: netCost, deficit };
  });

  analyses.sort((a, b) => b.score - a.score);
  const best = analyses[0], worst = analyses[analyses.length - 1];
  const diff = best ? best.score - (worst?.score || 0) : 0;
  const allWeak = analyses.every((a) => a.score < 0);
  const cheapest = analyses.reduce((a, b) => (a.cost < b.cost ? a : b));
  const bestGain = analyses.reduce((a, b) =>
    (parseInt(a.option.energyGain) || 0) > (parseInt(b.option.energyGain) || 0) ? a : b);

  let choix = best?.option?.name ?? 'Aucune';
  if (diff >= 5 && !allWeak) { /* clear : choix = best */ }
  else if (!allWeak) {
    const conflit = best && best.deficit > 2 && best.s.n1.length > 0;
    if (!conflit) {
      if (cheapest.option.name !== bestGain.option.name && (parseInt(bestGain.option.energyGain) || 0) > 0)
        choix = 'Pile ou face';
      else choix = cheapest.option.name;
    }
  } else choix = "Ni l'un ni l'autre";
  return { choix, analyses, diff, allWeak };
}

/* ----------------------------- ORACLE V2.5 ----------------------------- */
function oracleV25(options, spoons, q0texte) {
  const q0 = (q0texte || '').toLowerCase();
  const pasImportant = M(q0, ["on s'en fout", 'osef', "j'en sais rien", 'aucune idée', "j'aurais oublié",
    'ça change rien', 'peu importe', 'pas vraiment', 'non', 'pas du tout', "j'y penserais même pas",
    'aucune importance', 'bah non', 'nan', 'pff', 'absolument aucune', 'rien du tout']);
  const important = M(q0, ['carrément', 'oui', 'vraiment', 'beaucoup', 'énormément', 'grave',
    "j'y penserais", 'ça compte', "ça m'affecterait", "j'y penserai", 'ça pèse', "c'est important",
    'ça joue', 'clairement', 'sans hésiter', "j'aurais regret", 'je regretterais', 'pas sûre',
    'peut-être', 'ça dépend', 'ça pourrait', 'possiblement']);

  // LE VERROU : court-circuit total, aucune option n'est analysée.
  if (pasImportant && !important) return { choix: 'Pile ou face', verrou: true, analyses: [] };

  const analyses = options.filter((o) => o.name?.trim()).map((opt) => {
    const q1 = (opt.q1 || '').toLowerCase(), q2 = (opt.q2 || '').toLowerCase(), q3 = (opt.q3 || '').toLowerCase();
    let score = 0; const s = { n1: [], n2: [] };

    if (M(q1, ['excit', 'hâte', 'hate', "j'adore", 'adore', 'kiffe', 'trop bien', 'super', 'génial',
      'enthousiasm', 'joie', 'joyeu', 'trop envie', 'grave envie'])) { score += 5; s.n1.push('green'); }

    const peur = M(q1, ['angoisse', 'angois', 'peur', 'panique', 'paniqu', 'oppress', 'noeud au ventre',
      'boule au ventre', 'mal au ventre', 'stress', 'anxi', 'terreur']);
    const excitForte = s.n1.includes('green') || M(q1, ['excit', 'hâte', 'hate', 'kiffe', 'adore', 'trop envie']);
    if (peur) { if (excitForte) { score -= 2; s.n1.push('orange'); } else { score -= 5; s.n1.push('red'); } }

    if (M(q1, ['soulagée', 'soulagement', 'soulage', 'ouf', 'tranquille', 'apaisée'])) { score -= 4; s.n1.push('red'); }

    if (M(q2, ['mega fiere', 'fière', 'fiere', 'fierté', "s'amuse de fou", 'kiffe', 'adore', 'à fond',
      'a fond', 'trop bien', 'génial', 'créer', 'créativité', 'dessiner', 'apprendre', 'appris',
      'découvert', 'progressé', 'connexion', 'lien', 'rapprochement', 'complicité', 'liberté', 'libre',
      'authentique', 'heureuse', 'épanouie', 'vivante', 'accomplie', 'satisfaite'])) { score += 5; s.n1.push('green'); }

    const regretN1 = M(q3, ['honteu', 'honte', 'dégoûtée', 'degoutee', 'dégoût', 'fâchée', 'fachee',
      'nulle', 'trop deg', 'triste', 'frustr', 'déçue', 'decue', 'pas fière', 'regret', 'je regretterais']);
    if (regretN1) { score += 4; s.n1.push('green'); }

    if (M(q3, ['fière', 'fiere', 'fierté', 'soulagée', 'soulagement', 'soulage', 'ouf', 'tranquille',
      'en paix', 'contente', 'heureuse', 'mieux', 'repos', 'reposée', 'libre', 'libérée'])
      && !M(q3, ['pas fière', 'pas fiere', 'pas contente', 'pas soulagée'])) { score -= 4; s.n1.push('red'); }

    const flemme = M(q1, ['flemme', 'chiant', 'me soûle', 'me saoule', 'démotivée', 'pas envie du tout']);
    if (flemme) {
      const greenN1 = s.n1.includes('green');
      const vraie = M(q1, ["peur de m'ennuyer", 'ennuyer', 'soûle', 'saoule']) ||
        M(q3, ['change rien', 'rien de spécial', 'osef', 'au pire pas grave']) ||
        M(q0, ['non', 'pas du tout', 'osef', "j'aurais oublié"]);
      if (greenN1) score -= 1; else if (vraie) score -= 3; else score -= 2;
    }
    if (M(q1, ['je devrais', 'il faut que', 'il faut', 'obligation', 'obligée', 'je dois',
      "j'ai promis", "j'avais dit", 'tout le monde', 'normal de'])) score -= 3;
    if (M(q3, ['gênée', 'genee', 'gêne', "mal à l'aise", 'awkward', 'bizarre', 'chelou', 'ils vont',
      'vont penser', 'je les verrai', 'jugement', 'jugée', 'décevoir', 'vexer', 'blesser'])) score -= 3;

    const culp = M(q3, ['coupable', 'culpabilité', 'culpab', 'honte', 'honteuse', 'remords', "j'aurais dû"]);
    if (culp && !M(q3, ['un poil coupable', 'un peu coupable']) && !regretN1) score -= 3;

    if (M(q0, ['opportunit', 'occasion', 'important', 'compte vraiment', 'utile', 'ca peut debloquer',
      'respecter', 'engagement', 'parole', 'rare', 'unique', 'avancer', 'progresser', 'debloquer'])) score += 2;

    if (M(q1, ['why not', 'pourquoi pas', 'ça pourrait', 'maybe', 'curiosité', 'curieuse',
      'intéressée', 'intéressant', 'sympa', 'me tenterait', 'tentée'])) score += 2;
    if (M(q3, ['dommage', 'maybe deg', 'un peu deg', 'un peu triste', 'un poil coupable',
      'un peu coupable', 'pas idéal', "j'aurais aimé"])) score += 2;
    if (M(q1, ['bof', 'mouais', 'meh', 'moyen', 'beurk', 'pas folle', 'mmh', 'mmmmh',
      'pas convaincue', 'pas terrible', 'pas ouf'])) score -= 2;
    if (M(q1, ['pas envie', 'pas vraiment envie', 'zéro envie']) && !flemme) score -= 2;
    if (M(q3, ["je m'en fous", 'osef', "m'en fiche", 'rien', 'que dalle', 'change rien',
      'rien de spécial', 'pareil', 'peu importe'])) score -= 2;                      // V2.5 : -2
    if (M(q2, ['passer le temps', 'tuer le temps', 'en attendant', 'faute de mieux', 'par défaut'])) score -= 1;

    const relat = M(q0, ['au pire', 'pas la fin du monde', 'osef', "je m'en fous", "c'est pas grave",
      'pas grave', "j'aurais oublié"]);
    if (relat && !s.n1.includes('green')) score /= 2;

    const cost = parseInt(opt.cost) || 0, gain = parseInt(opt.energyGain) || 0;
    const netCost = cost - gain, deficit = netCost - spoons;
    const ratio = spoons > 0 ? netCost / spoons : 999;
    const fortN1 = s.n1.includes('green');                       // V2.5 : vert seulement
    if (!fortN1 && deficit > 0) score -= ratio >= 2 ? 3 : ratio >= 1.5 ? 2 : 1;

    return { option: opt, score: Math.round(score * 10) / 10, s, cost: netCost, deficit };
  });

  analyses.sort((a, b) => b.score - a.score);
  const best = analyses[0], worst = analyses[analyses.length - 1];
  const diff = best ? best.score - (worst?.score || 0) : 0;
  const allWeak = analyses.every((a) => a.score < 0);
  const importance = important ? 'high' : 'medium';

  let choix = best?.option?.name ?? 'Aucune';
  if (diff >= 5 && !allWeak) { /* clear */ }
  else if (!allWeak) {
    const conflit = best && best.deficit > 2 && best.s.n1.length > 0;
    if (!conflit && importance === 'low') choix = 'Pile ou face';
  } else choix = 'Aucun des deux';
  return { choix, analyses, diff, allWeak, verrou: false };
}

/* --------------------------- Jeu de données --------------------------- */
const lignes = readFileSync('docs/sauvegardes.md', 'utf-8').split('\n').filter((l) => l.trim().startsWith('|'));
const E = lignes[0].replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
const I = Object.fromEntries(E.map((n, i) => [n, i]));
const corps = lignes.slice(2).filter((l) => l.replace(/[|\-\s]/g, ''));
const cols = (l) => { const c = l.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim()); return [...c, ...Array(Math.max(0, E.length - c.length)).fill('')]; };
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

/* ------------------------------ Jugement ------------------------------ */
const codeDe = (choix, options) => {
  if (/pile ou face/i.test(choix)) return 'Y';
  if (/aucun|ni l'un/i.test(choix)) return 'X';
  const o = options.find((x) => x.name === choix);
  return o ? o.lettre : '?';
};
function aEuRaison(code, decision, satisfaction) {
  if (!code || !decision || !satisfaction || code === 'Y') return null;
  const suivi = code === decision || (code === 'X' && !L.includes(decision));
  return suivi ? satisfaction === 'good' : (satisfaction === 'bad' || satisfaction === 'meh');
}

const score = { v2: [0, 0], v25: [0, 0] };
let verrous = 0;
const lignesR = [];

for (const d of jeux) {
  const r2 = oracleV2(d.options, d.spoons, d.q0);
  const r25 = oracleV25(d.options, d.spoons, d.q0);
  if (r25.verrou) verrous++;
  const c2 = codeDe(r2.choix, d.options), c25 = codeDe(r25.choix, d.options);
  const a2 = aEuRaison(c2, d.decision, d.satisfaction), a25 = aEuRaison(c25, d.decision, d.satisfaction);
  if (a2 !== null) { score.v2[1]++; if (a2) score.v2[0]++; }
  if (a25 !== null) { score.v25[1]++; if (a25) score.v25[0]++; }
  const m = (r) => (r === null ? ' · ' : r ? ' ✓ ' : ' ✗ ');
  lignesR.push('  ' + d.date.padEnd(12) + `én:${String(d.spoons).padEnd(2)} ` +
    `V2:${c2}${m(a2)}  V2.5:${c25}${m(a25)}${r25.verrou ? '🔒' : '  '} ` +
    `fait:${(d.decision || '–').padEnd(3)} ${(d.satisfaction || '').padEnd(5)}`);
}

const pc = (a, b) => (b ? Math.round((a / b) * 100) : 0);
console.log('\n  V2 (jan 2026) contre V2.5 (actuelle) — 25 dilemmes réels\n');
console.log(lignesR.join('\n'));
console.log('\n  ' + '─'.repeat(58));
console.log(`  Oracle V2   : ${score.v2[0]}/${score.v2[1]}  (${pc(score.v2[0], score.v2[1])}%)`);
console.log(`  Oracle V2.5 : ${score.v25[0]}/${score.v25[1]}  (${pc(score.v25[0], score.v25[1])}%)`);
console.log(`\n  🔒 = verrou Q0 de V2.5 : aucune option analysée  (${verrous} fois sur ${jeux.length})\n`);
