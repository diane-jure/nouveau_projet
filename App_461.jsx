import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase.js';

// Configuration centrale
const APP_CONFIG = {
  TITLE: "wesh v4.6.1 Quest Finder"
}

// ============================================================================
// QUEST FINDER v4.6.1
// Pas de save si supabase innacessible
// Architecture : Oracle V2.5
// Date: 2025-08-29
// ============================================================================


// === STYLES ===
const pixelBorder = (color = COLORS.border, width = 4) => ({
  boxShadow: `
    ${width}px 0 0 0 ${color},
    -${width}px 0 0 0 ${color},
    0 ${width}px 0 0 ${color},
    0 -${width}px 0 0 ${color},
    ${width}px ${width}px 0 0 ${color},
    -${width}px ${width}px 0 0 ${color},
    ${width}px -${width}px 0 0 ${color},
    -${width}px -${width}px 0 0 ${color}
  `
});

// === CONSTANTES ===
var pFONT_SIZE = 14;
const PIXEL_FONT = `"Press Start 2P", monospace`;

const COLORS = {
  bg: '#1a1c2c',
  bgLight: '#262b44',
  bgCard: '#3a4466',
  primary: '#5fcde4',
  secondary: '#7bc67b',
  accent: '#f9c22b',
  accentLight: '#fcd34d',
  warning: '#e36956',
  text: '#f4f4f4',
  textMuted: '#94a3b8',
  border: '#5a6988',
  shadow: '#0d0f14',
};


const QUESTIONS = [
  { id: 'q1', label: 'Première sensation ?', placeholder: 'ton instinct...' },
  { id: 'q2', label: 'Si ça se passe bien ?', placeholder: 'ça t\'apporte...' },
  { id: 'q3', label: 'Si tu l as pas fait demain ?', placeholder: 'tu ressens...' },
  { id: 'q0', label: 'Dans 10 jours ?', placeholder: 'ça compte ?' },
];
// ============================================================================
// ORACLE V2.5
// ============================================================================

const analyzeWithOracleV2_5 = (options, spoons, q0Response = '') => {
  const validOptions = options.filter(opt => opt.name && opt.name.trim());

  const q0 = (q0Response || '').toLowerCase();

  const q0_notImportant = [
    "on s'en fout", "osef", "j'en sais rien", "aucune idée", "j'aurais oublié",
    "ça change rien", "peu importe", "pas vraiment", "non", "pas du tout",
    "j'y penserais même pas", "aucune importance", "bah non", "nan",
    "pff", "absolument aucune", "rien du tout"
  ].some(w => q0.includes(w));

  const q0_important = [
    "carrément", "oui", "vraiment", "beaucoup", "énormément", "grave",
    "j'y penserais", "ça compte", "ça m'affecterait", "j'y penserai",
    "ça pèse", "c'est important", "ça joue", "clairement", "sans hésiter",
    "j'aurais regret", "je regretterais", "pas sûre", "peut-être",
    "ça dépend", "ça pourrait", "possiblement"
  ].some(w => q0.includes(w));

  if (q0_notImportant && !q0_important) {
    return {
      analyses: [],
      caseType: 'pileouface',
      q0Importance: 'low',
      fallbackRecommendation: {
        choix: 'Pile ou face',
        explication: _getPileOuFacePhrase('low'),
        tags: ['q0_low']
      }
    };
  }

  const q0Importance = q0_important ? 'high' : 'medium';

  const analyses = validOptions.map(opt => {
    const q1 = (opt.q1 || '').toLowerCase();
    const q2 = (opt.q2 || '').toLowerCase();
    const q3 = (opt.q3 || '').toLowerCase();

let score = 0;
let signals = { niveau1: [], niveau2: [], niveau3: [], niveau4: [] };
let tags = [];

// NIVEAU 1
if (_matchAny(q1, [
  'excit', 'hâte', 'hate', 'j\'ai hâte', 'trop hâte',
  'j\'adore', 'adore', 'kiffe', 'kiffer',
  'trop bien', 'super', 'génial', 'incroyable', 'fantastique',
  'ça me fait vibrer', 'me fait vibrer', 'j\'en veux',
  'tellement envie', 'grave envie', 'trop envie',
  'enthousiasm', 'euphor', 'joie', 'joyeu'
])) {
  score += 5;
  signals.niveau1.push({ type: 'green', text: 'excitation forte Q1' });
  tags.push('excitation');
}

const hasPeur = _matchAny(q1, [
  'angoisse', 'angoissée', 'angoissan', 'angois',
  'peur', 'peur de', 'j\'ai peur',
  'panique', 'paniqu', 'paniquée',
  'oppressée', 'oppresse', 'noeud au ventre', 'nœud au ventre',
  'boule au ventre', 'mal au ventre', 'stress', 'stressée',
  'anxiété', 'anxieuse', 'anxi',
  'terreur', 'terrifée', 'effroi'
]);

const hasExcitationForte = signals.niveau1.some(s => s.text === 'excitation forte Q1') ||
  _matchAny(q1, ['excit', 'hâte', 'hate', 'kiffe', 'adore', 'trop envie', 'grave envie']);

if (hasPeur) {
  if (hasExcitationForte) {
    score -= 2;
    signals.niveau1.push({ type: 'orange', text: 'peur mêlée d\'excitation Q1' });
    tags.push('peur_excitation');
  } else {
    score -= 5;
    signals.niveau1.push({ type: 'red', text: 'alerte corporelle forte Q1' });
    tags.push('alerte_corporelle');
  }
}

if (_matchAny(q1, [
  'soulagée', 'soulagement', 'soulage', 'ouf',
  'tranquille', 'relax', 'zen', 'apaisée',
  'contente de pas', 'contente de ne pas'
])) {
  score -= 4;
  signals.niveau1.push({ type: 'red', text: 'soulagement si pas fait Q1' });
  tags.push('soulagement');
}

if (_matchAny(q2, [
  'mega fiere', 'méga fière', 'mega fière', 'trop fière', 'super fière',
  'fiere', 'fière', 'fierté', 'fierte',
  's\'amuse de fou', 'amuse de fou', 'on s\'amuse',
  'kiffe grave', 'kiffe trop', 'kiffe à fond',
  'adore', 'j\'adore',
  'à fond', 'a fond', 'complètement dedans', 'dans mon élément',
  'trop bien', 'super bien', 'génial', 'incroyable', 'fantastique',
  'moment créatif', 'créer', 'créativité', 'création', 'dessiner', 'peindre',
  'apprendre', 'appris', 'découvert', 'progressé', 'évolué',
  'connexion', 'lien', 'rapprochement', 'complicité',
  'liberté', 'libre', 'autonome', 'indépendante',
  'authentique', 'moi-même', 'vraiment moi',
  'heureuse', 'épanouie', 'vivante', 'énergisée',
  'accomplie', 'réalisée', 'satisfaite'
])) {
  score += 5;
  signals.niveau1.push({ type: 'green', text: 'forte satisfaction anticipée Q2' });
  if (_matchAny(q2, ['créatif', 'créer', 'créativité', 'dessiner', 'peindre', 'imagin', 'création'])) tags.push('creativite');
  if (_matchAny(q2, ['appren', 'découv', 'progressé', 'évolué', 'compris'])) tags.push('apprentissage');
  if (_matchAny(q2, ['connexion', 'lien', 'rapprochement', 'complicité', 'ensemble'])) tags.push('connexion');
  if (_matchAny(q2, ['libre', 'liberté', 'autonome', 'indépendante', 'moi-même'])) tags.push('liberte');
}

if (_matchAny(q3, [
  'honteu', 'honte', 'honteuse',
  'dégoûtée', 'degoutee', 'dégoutée', 'degoût', 'dégoût',
  'fâchée', 'fachee', 'fâché', 'en colère contre moi',
  'nulle', 'nulle de chez nulle', 'trop nulle',
  'trop deg', 'trop dég', 'mega deg', 'méga deg',
  'triste', 'tristesse', 'chagrin',
  'frustrée', 'frustration', 'frustr',
  'déçue de moi', 'deçue de moi', 'decue de moi',
  'déçue', 'decue',
  'pas fière', 'pas fiere', 'pas contente de moi',
  'regret', 'je regretterais', 'j\'aurais regretté',
  'j\'aurais raté', 'j\'aurais manqué'
])) {
  score += 4;
  signals.niveau1.push({ type: 'green', text: 'regret massif si pas fait Q3' });
  tags.push('regret_fort');
}

if (_matchAny(q3, [
  'fière', 'fiere', 'fierté',
  'soulagée', 'soulagement', 'soulage', 'ouf',
  'tranquille', 'en paix', 'relax', 'zen',
  'contente', 'heureuse', 'bien',
  'mieux', 'mieux comme ça', 'mieux sans',
  'repos', 'reposée',
  'libre', 'libérée'
])) {
  const hasPasAvant = q3.includes('pas fière') || q3.includes('pas fiere') ||
    q3.includes('pas contente') || q3.includes('pas soulagée');
  if (!hasPasAvant) {
    score -= 4;
    signals.niveau1.push({ type: 'red', text: 'soulagement si pas fait Q3' });
    tags.push('soulagement_q3');
  }
}

// NIVEAU 2
const hasFlemme = _matchAny(q1, [
  'flemme', 'flemme de', 'trop flemme', 'méga flemme', 'mega flemme',
  'j\'ai la flemme', 'flemmasse',
  'chiant', 'chiante', 'chiant à', 'la chiantise',
  'me soûle', 'me saoule', 'ça me soûle', 'ça m\'emmerde',
  'pas motivated', 'démotivée', 'pas envie du tout',
  'bcp de flemme', 'beaucoup de flemme'
]);

if (hasFlemme) {
  const hasGreenN1 = signals.niveau1.some(s => s.type === 'green');
  const vraiResistance = _matchAny(q1, ['peur de m\'ennuyer', 'ennuyer', 'soûle', 'saoule']) ||
    _matchAny(q3, ['change rien', 'rien de spécial', 'osef', 'j\'en sais rien', 'au pire pas grave']) ||
    _matchAny(q0, ['non', 'pas du tout', 'osef', 'j\'aurais oublié']);
  if (hasGreenN1) {
    score -= 1;
    signals.niveau2.push({ type: 'orange', text: 'inertie ignorable (flemme + envie forte)' });
    tags.push('flemme_inertie');
  } else if (vraiResistance) {
    score -= 3;
    signals.niveau2.push({ type: 'red', text: 'vraie résistance (flemme)' });
    tags.push('flemme_resistance');
  } else {
    score -= 2;
    signals.niveau2.push({ type: 'orange', text: 'flemme neutre' });
    tags.push('flemme_neutre');
  }
}

if (_matchAny(q1, [
  'je devrais', 'il faut que', 'il faut', 'obligation', 'obligée',
  'je dois', 'on attend de moi', 'c\'est mon rôle',
  'sinon', 'si je fais pas', 'si je le fais pas',
  'j\'ai dit que', 'j\'ai promis', 'j\'avais dit',
  'tout le monde', 'tout le monde y va',
  'c\'est la chose logique', 'logique de', 'normal de',
])) {
  score -= 3;
  signals.niveau2.push({ type: 'red', text: 'obligation déguisée' });
  tags.push('obligation');
}

if (_matchAny(q3, [
  'gênée', 'genee', 'gêne', 'mal à l\'aise',
  'awkward', 'bizarre', 'chelou',
  'ils vont', 'ils vont penser', 'vont penser',
  'je les reverrai', 'je les verrai', 'on se voit',
  'jugement', 'jugée', 'mal vue',
  'décevoir', 'déçu', 'vexer', 'vexé', 'blesser',
])) {
  score -= 3;
  signals.niveau2.push({ type: 'red', text: 'pression sociale (hameçon)' });
  tags.push('pression_sociale');
}

const hasCulpabilite = _matchAny(q3, [
  'coupable', 'culpabilité', 'culpab',
  'honte', 'honteuse',
  'mauvaise conscience', 'remords',
  'j\'aurais dû', 'j\'aurais du', 'aurais dû faire'
]);
const isUnPoilCoupable = q3.includes('un poil coupable') || q3.includes('un peu coupable');
if (hasCulpabilite && !isUnPoilCoupable) {
  const dejaCompteN1 = signals.niveau1.some(s => s.text === 'regret massif si pas fait Q3');
  if (!dejaCompteN1) {
    score -= 3;
    signals.niveau2.push({ type: 'red', text: 'culpabilité (hameçon)' });
    tags.push('culpabilite');
  }
}

if (_matchAny(q3, ['soulagée', 'soulagement', 'soulage', 'tranquille', 'en paix', 'ouf', 'repos', 'reposée', 'relaxée'])) {
  const dejaCompteN1 = signals.niveau1.some(s => s.text === 'soulagement si pas fait Q3');
  if (!dejaCompteN1) {
    const hasMais = q3.includes('mais') || q3.includes('sauf') || q3.includes('quand même');
    score -= hasMais ? 2 : 4;
    signals.niveau2.push({ type: 'red', text: 'soulagement si pas fait' });
    tags.push('soulagement');
  }
}

if (_matchAny(q0, ['procrastin', 'ça traîne', 'ca traine', 'encore traîner', 'traîne depuis'])) {
  signals.niveau2.push({ type: 'neutral', text: 'pattern procrastination' });
  tags.push('procrastination');
}

if (_matchAny(q0, [
  'opportunit', 'occasion', 'chance unique',
  'important', 'compte vraiment', 'vraiment important',
  'utile', 'ca peut servir', 'ca peut aider', 'ca peut debloquer',
  'respecter', 'engagement', 'parole',
  'rare', 'unique', 'maintenant ou jamais',
  'avancer', 'progresser', 'debloquer', 'debloque'
])) {
  score += 2;
  signals.niveau3.push({ type: 'green', text: 'valeur réelle détectée Q0' });
  tags.push('valeur_q0');
}

// NIVEAU 3
if (_matchAny(q1, [
  'why not', 'pourquoi pas', 'ça pourrait', 'ça peut',
  'maybe', 'peut-être oui', 'p\'tet',
  'bof mais', 'mouais mais', 'mmmh ok',
  'curiosité', 'curieuse', 'intéressée', 'intriguée',
  'intéressant', 'intéressante', 'sympa', 'pas dégueu',
  'ça me tenterait', 'me tenterait', 'tentée'
])) {
  score += 2;
  signals.niveau3.push({ type: 'green', text: 'curiosité / approche modérée' });
  tags.push('curiosite');
}

if (_matchAny(q3, [
  'dommage', 'un peu dommage', 'c\'est dommage',
  'maybe deg', 'un peu deg', 'légèrement deg',
  'un peu triste', 'légèrement déçue',
  'un poil coupable', 'un peu coupable',
  'pas idéal', 'pas top',
  'j\'aurais aimé', 'j\'aimerais quand même'
])) {
  score += 2;
  signals.niveau3.push({ type: 'green', text: 'regret modéré' });
}

if (_matchAny(q1, ['bof', 'mouais', 'meh', 'moyen', 'beurk', 'pas folle', 'pas dingue', 'mmh', 'mmmmh', 'hm', 'hmm', 'pas convaincue', 'sceptique', 'pas terrible', 'pas ouf'])) {
  score -= 2;
  signals.niveau3.push({ type: 'orange', text: 'résistance modérée' });
}

if (_matchAny(q1, ['pas envie', 'pas vraiment envie', 'pas trop envie', 'zéro envie']) && !hasFlemme) {
  score -= 2;
  signals.niveau3.push({ type: 'orange', text: 'pas envie' });
}

if (_matchAny(q3, ['je m\'en fous', 'osef', 'm\'en fiche', 'm\'en bat', 'rien', 'rien du tout', 'que dalle', 'change rien', 'rien de spécial', 'pareil', 'même chose', 'peu importe', 'bah', 'bah rien', 'pff rien'])) {
  score -= 2;
  signals.niveau3.push({ type: 'orange', text: 'importance nulle Q3' });
}

if (_matchAny(q2, ['passer le temps', 'tuer le temps', 'en attendant', 'pour m\'occuper', 'histoire de', 'faute de mieux', 'rien d\'autre à faire', 'par défaut'])) {
  score -= 1;
  signals.niveau3.push({ type: 'orange', text: 'tuer le temps' });
}

const hasRelativisation = _matchAny(q0, [
  'au pire', 'au pire c\'est pas grave', 'pas la fin du monde',
  'osef', 'je m\'en fous', 'bah', 'c\'est juste',
  'c\'est rien', 'c\'est pas grave', 'pas grave',
  'j\'aurais oublié', 'ça compte pas vraiment'
]);
const hasPositiveN1 = signals.niveau1.some(s => s.type === 'green');
if (hasRelativisation && !hasPositiveN1) {
  score = score / 2;
  signals.niveau3.push({ type: 'neutral', text: 'relativisation (poids divisé)' });
  tags.push('relativisation');
}

// NIVEAU 4 — ÉNERGIE
const cost = parseInt(opt.cost) || 0;
const energyGain = parseInt(opt.energyGain) || 0;
const netCost = cost - energyGain;
const energyDeficit = netCost - spoons;
const energyRatio = spoons > 0 ? netCost / spoons : 999;
const hasNiveau1Strong = signals.niveau1.some(s => s.type === 'green');

if (!hasNiveau1Strong && energyDeficit > 0) {
  if (energyRatio >= 2) {
    score -= 3;
    signals.niveau4.push({ type: 'red', text: `dépassement 100%+ (${energyDeficit} cuillères)` });
    tags.push('energie_critique');
  } else if (energyRatio >= 1.5) {
    score -= 2;
    signals.niveau4.push({ type: 'orange', text: `dépassement 50%+ (${energyDeficit} cuillères)` });
    tags.push('energie_faible');
  } else {
    score -= 1;
    signals.niveau4.push({ type: 'orange', text: `léger dépassement (${energyDeficit})` });
  }
} else if (hasNiveau1Strong && energyDeficit > 0) {
  signals.niveau4.push({ type: 'neutral', text: 'dépassement noté mais valeur forte' });
  tags.push('energie_vs_valeur');
}

return {
  option: opt,
  score: Math.round(score * 10) / 10,
  signals,
  tags: [...new Set(tags)],
  cost: netCost,
  energyDeficit
};
});

analyses.sort((a, b) => b.score - a.score);
const best = analyses[0];
const worst = analyses[analyses.length - 1];
const scoreDiff = best ? (best.score - (worst?.score || 0)) : 0;
const allWeak = analyses.every(a => a.score < 0);
const allPositive = analyses.every(a => a.score > 0);

let caseType = '';
let recommendedChoice = best?.option?.name || 'Aucune';
let fallbackText = '';
let globalTags = [...new Set(analyses.flatMap(a => a.tags))];
const cheapest = analyses.reduce((a, b) => a.cost < b.cost ? a : b);
const bestGain = analyses.reduce((a, b) => 
  (parseInt(a.option.energyGain) || 0) > (parseInt(b.option.energyGain) || 0) ? a : b
);
const gainDiff = analyses.length >= 2
? Math.abs(analyses[0].rawGain - analyses[1].rawGain)
: 0;

if (scoreDiff >= 5 && !allWeak) {
caseType = 'clear';
const hasGreenSignal = best.signals.niveau1.some(s => s.type === 'green');
const hasRedOnWorst = worst?.signals.niveau1.some(s => s.type === 'red') ||
  worst?.signals.niveau2.some(s => s.type === 'red');
fallbackText = _getClearPhrase(best, worst, globalTags, hasGreenSignal, hasRedOnWorst);
} else if (!allWeak) {
caseType = 'dilemma';
const hasEnergyConflict = best && best.energyDeficit > 2 && best.signals.niveau1.length > 0;
if (hasEnergyConflict) {
  fallbackText = _getDilemmaEnergyPhrase();
} else {
  fallbackText = _getDilemmaPhrase(best, worst, cheapest, bestGain, globalTags, q0Importance);
  if (q0Importance === 'low') {
    caseType = 'pileouface';
    recommendedChoice = 'Pile ou face';
    fallbackText = _getPileOuFacePhrase('medium', gainDiff, bestGain.option.name);
  }
}
} else {
caseType = 'none';
recommendedChoice = 'Aucun des deux';
fallbackText = _getNonePhrase(globalTags);
}

return {
analyses, best, worst, scoreDiff, allWeak, allPositive,
caseType, q0Importance,
fallbackRecommendation: { choix: recommendedChoice, explication: fallbackText, tags: globalTags }
};
};

// ============================================================================
// HELPERS ORACLE
// ============================================================================

function _matchAny(text, keywords) {
return keywords.some(kw => text.includes(kw));
}

function _getClearPhrase(best, worst, tags, hasGreenSignal, hasRedOnWorst) {
const optionName = best.option.name;
const worstName = worst?.option?.name;

if (tags.includes('creativite')) {
return [`Ton cœur a déjà choisi — ${optionName} nourrit quelque chose en toi que l'autre ne peut pas toucher.\nFais-toi confiance.`,
  `Ce n'est pas juste une option — c'est une invitation à créer.\n${optionName} appelle la partie de toi qui est vivante.`
][Math.floor(Math.random() * 2)];
}
if (tags.includes('connexion')) {
return [`${optionName} t'ouvre vers quelqu'un ou quelque chose de réel.\nTon instinct ne ment pas là-dessus.`,
  `La connexion que tu sens pour ${optionName} — c'est une vraie boussole.\nÉcoute-la.`
][Math.floor(Math.random() * 2)];
}
const hasBodySignal = best.signals.niveau1.some(s => s.type === 'green');
if (tags.includes('valeur_q0') && !hasBodySignal) {
return [`Ton corps ne saute pas de joie.\nMais tu sais que ça compte.`,
  `Ce n'est pas l'envie qui parle. C'est ce qui compte.\nTu le sais déjà.`
][Math.floor(Math.random() * 2)];
}
if (tags.includes('pression_sociale') || tags.includes('obligation')) {
return [`Ce que tu listes pour ${worstName || 'l\'autre'} — ce sont des dettes, pas des désirs.\n${optionName} t'appartient vraiment.`,
  `Le regard des autres n'est pas une boussole.\nTon corps, lui, pointe vers ${optionName}.`
][Math.floor(Math.random() * 2)];
}
if (tags.includes('regret_fort')) {
return [`Tes propres mots ont déjà répondu.\nCe regret que tu porterais — c'est la vérité de ce que tu veux.`,
  `Dans dix jours, ${optionName} sera peut-être oubliée.\nMais ce que tu ressentirais de ne pas l'avoir fait — ça, ça reste.`
][Math.floor(Math.random() * 2)];
}
if (tags.includes('alerte_corporelle')) {
return [`Ton corps a dit non avant même que tu finisses de poser la question.\n${optionName} te laisse respirer — l'autre te comprime.`,
  `${worstName || 'L\'autre option'} te tire vers le bas. ${optionName} te fait lever la tête.\nÉcoute la différence.`
][Math.floor(Math.random() * 2)];
}
if (hasGreenSignal) {
return [`Ton instinct est clair — ${optionName} te fait vibrer.\n${hasRedOnWorst ? (worstName + ' te tire vers le bas.\n') : ''}Fais-toi confiance.`,
  `Là où il y a de la vie, suis la vie.\n${optionName} t'appelle — le reste, c'est du bruit.`
][Math.floor(Math.random() * 2)];
}
return [`${optionName} te fait respirer, ${worstName || 'l\'autre'} te pèse.\nÉcoute ton corps.`,
`Ton corps a déjà choisi.\n${optionName} — et tu le sais.`
][Math.floor(Math.random() * 2)];
}

function _getDilemmaEnergyPhrase() {
return [`Ton corps est à plat mais ton cœur veut y être.\nLa fatigue de demain est réelle — vaut-elle ce qui se joue aujourd'hui ?`,
`Corps fatigué ne veut pas dire cœur absent.\nCe coût est réel — mais qu'est-ce que tu regretteras dans dix jours ?`
][Math.floor(Math.random() * 2)];
}

function _getDilemmaPhrase(best, worst, cheapest, bestGain, tags, q0Importance) {
const cheapName = cheapest.option.name;
const bestGainName = bestGain.option.name;
const isDifferent = cheapest.option.name !== bestGain.option.name;

// Vrai dilemme coût vs gain
if (isDifferent) {
return [
  `${cheapName} te coûte moins — mais ${bestGainName} peut t'apporter plus.\nÀ toi de voir ce qui compte aujourd'hui.`,
  `Deux logiques s'affrontent : économiser avec ${cheapName}, ou investir dans ${bestGainName}.\nNi l'une ni l'autre n'a tort.`
][Math.floor(Math.random() * 2)];
}

// Même option gagne sur les deux tableaux
if (!isDifferent) {
return [
  `${cheapName} te coûte moins et t'apporte plus — la question est déjà répondue.\nFais-toi confiance.`,
  `Ton corps et ton énergie pointent vers ${cheapName}.\nPas besoin de chercher plus loin.`
][Math.floor(Math.random() * 2)];
}

if (tags.includes('excitation') || tags.includes('regret_fort')) {
    return [`Les deux t'appellent pour de vraies raisons.\n${cheapName} te coûte moins — commence par là si tu dois choisir.`,
  `Deux vraies envies, pas de mauvais choix.\nTon corps penchera d'un côté au moment de bouger — fais-lui confiance.`
][Math.floor(Math.random() * 2)];
}
if (q0Importance === 'high' && (tags.includes('flemme_neutre') || tags.includes('flemme_resistance'))) {
return [`Ni l'une ni l'autre ne t'appelle vraiment — mais la décision compte.\nNomme ce qui te retient vraiment, pas ce qui est pratique.`,
  `La flemme parle pour les deux. Mais quelque chose d'important attend.\nQu'est-ce que tu veux vraiment, sous la fatigue ?`
][Math.floor(Math.random() * 2)];
}
return [`Les deux options se valent.\n${cheapName} te coûte moins — commence par là si tu hésites.`,
`Ni l'une ni l'autre ne tranche vraiment.\n${cheapName} te coûte moins d'énergie — et parfois, ça suffit.`
][Math.floor(Math.random() * 2)];
}

function _getPileOuFacePhrase(level, gainDiff = 0, bestGainName = '') {
if (level === 'low') {
if (gainDiff > 0 && bestGainName) {
  return [
    `${bestGainName} t'apporterait un peu plus — mais dans dix jours tu n'y penseras plus.\nPile ou face.`,
    `Légère avantage pour ${bestGainName} en énergie — ça reste pile ou face.`
  ][Math.floor(Math.random() * 2)];
}
return [`Dans dix jours tu n'y penseras plus.\nPile ou face — et passe à autre chose.`,
  `Ton futur moi s'en fout.\nChoisis la plus simple et avance.`
][Math.floor(Math.random() * 2)];
}

return [
`Les deux options se valent — ton corps ne tranche pas.\nPile ou face, et fais-toi confiance sur l'exécution.`,
`Aucune boussole ne pointe clairement.\nChoisis et avance — l'hésitation coûte plus cher que le choix.`
][Math.floor(Math.random() * 2)];
}

function _getNonePhrase(tags) {
if (tags.includes('flemme_resistance') || tags.includes('flemme_neutre')) {
return [`Flemme des deux côtés — c'est peut-être pas le moment.\nTon corps demande autre chose.`,
  `Quand rien ne vibre, c'est que la vraie question n'est pas encore posée.\nQu'est-ce qui se cache derrière cette flemme ?`
][Math.floor(Math.random() * 2)];
}
if (tags.includes('obligation') || tags.includes('pression_sociale') || tags.includes('culpabilite')) {
return [`Aucune de ces options ne t'appartient vraiment — elles viennent de l'extérieur.\nQu'est-ce que TOI tu voudrais, sans les regards ?`,
  `Ce que tu décris, c'est ce qu'on attend de toi — pas ce que tu veux.\nAucune des deux n'est la tienne.`
][Math.floor(Math.random() * 2)];
}
return [`Aucune option ne t'appelle vraiment.\nC'est peut-être le signe que la vraie question n'est pas encore posée.`,
`Quand rien ne vibre, c'est que quelque chose d'autre attend d'être nommé.\nCes options ne sont peut-être pas les bonnes.`
][Math.floor(Math.random() * 2)];
}

// ============================================================================
// EXPORT SCORING
// ============================================================================

function buildScoringExplanation(analyses, spoons) {
return analyses.map(analysis => {
const opt = analysis.option;
const { niveau1: n1, niveau2: n2, niveau3: n3, niveau4: n4 } = analysis.signals;
const netCost = parseInt(opt.cost) - (parseInt(opt.energyGain) || 0);
const energyDeficit = netCost - spoons;
const hasGreenSignals = n1.some(s => s.type === 'green') || n3.some(s => s.type === 'green');
const hasRedSignals = n1.some(s => s.type === 'red') || n2.some(s => s.type === 'red');
let interpretation = '';
if (hasGreenSignals && !hasRedSignals) interpretation = `Ce qu'elle veut vraiment : ce domaine est une vraie valeur`;
else if (hasRedSignals && !hasGreenSignals) interpretation = `Hameçons détectés : obligation, culpabilité ou pression externe`;
else if (hasGreenSignals && hasRedSignals) interpretation = `Conflit : vraie envie VS obstacles (fatigue, coût, pression)`;
else interpretation = `Faible attrait : ni vraie envie ni forte résistance`;
return {
  option: opt.name,
  responses: { q1: opt.q1, q2: opt.q2, q3: opt.q3, q0: opt.q0 },
  signals: {
    niveau1: n1.map(s => ({ signal: s.text, type: s.type, value: s.type === 'green' ? 5 : -5 })),
    niveau2: n2.map(s => ({ signal: s.text, type: s.type, value: s.type === 'green' ? 3 : (s.type === 'orange' ? -2 : -3) })),
    niveau3: n3.map(s => ({ signal: s.text, type: s.type, value: s.type === 'green' ? 2 : -2 })),
    niveau4: n4.map(s => ({ signal: s.text, type: s.type }))
  },
  energyCalculation: {
    cost: parseInt(opt.cost), energyGain: parseInt(opt.energyGain) || 0,
    netCost, spoons, energyDeficit,
    explanation: `coût ${opt.cost} - gain +${opt.energyGain || 0} = ${netCost} | dispo ${spoons} = deficit ${energyDeficit}`
  },
  categoryScores: {
    niveau1: n1.reduce((sum, s) => sum + (s.type === 'green' ? 5 : -5), 0),
    niveau2: n2.reduce((sum, s) => sum + (s.type === 'green' ? 3 : (s.type === 'orange' ? -2 : -3)), 0),
    niveau3: n3.reduce((sum, s) => sum + (s.type === 'green' ? 2 : -2), 0)
  },
  totalScore: analysis.score,
  interpretation
};
});
}
const syncToBackend = (drafts, pending, completed) => {
const buildRevealed = (options, timestamp) => {
const revealed = {};
options.forEach((opt, idx) => {
  revealed[`choice_${idx + 1}-${timestamp}`] = ['q1', 'q2', 'q3'];
});
return revealed;
};

const data = {
exportDate: new Date().toISOString(),
version: APP_TITLE,
questFinderDrafts: drafts.map(d => ({
  id: `quest_${d.timestamp}`,
  timestamp: new Date(d.timestamp).toISOString(),
  spoons: d.spoons, q0: d.q0,
  options: d.options.map((opt, idx) => ({
    id: `choice_${idx + 1}-${d.timestamp}`,
    name: opt.name, cost: opt.cost, energyGain: opt.energyGain,
    q1: opt.q1, q2: opt.q2, q3: opt.q3
  })),
  revealedQuestions: buildRevealed(d.options, d.timestamp)
})),
questFinderPending: pending.map(p => ({
  id: `quest_${p.timestamp}`,
  timestamp: new Date(p.timestamp).toISOString(),
  spoons: p.spoons, q0: p.q0,
  options: p.options.map((opt, idx) => ({
    id: `choice_${idx + 1}-${p.timestamp}`,
    name: opt.name, cost: opt.cost, energyGain: opt.energyGain,
    q1: opt.q1, q2: opt.q2, q3: opt.q3
  })),
  revealedQuestions: buildRevealed(p.options, p.timestamp),
  oracleResponse: p.oracleResponse
})),
questFinderCompleted: completed.map(c => ({
  id: `quest_${c.timestamp}`,
  timestamp: new Date(c.timestamp).toISOString(),
  spoons: c.spoons, q0: c.q0,
  options: c.options.map((opt, idx) => ({
    id: `choice_${idx + 1}-${c.timestamp}`,
    name: opt.name, cost: opt.cost, energyGain: opt.energyGain,
    q1: opt.q1, q2: opt.q2, q3: opt.q3
  })),
  revealedQuestions: buildRevealed(c.options, c.timestamp),
  oracleResponse: c.oracleResponse,
  feedback: c.feedback, completedDate: c.completedDate
}))
};

supabase.from('saves').upsert({
  id: 'diane',
  data: data,
  updated_at: new Date().toISOString()
}).then(() => console.log('✓ Sauvegardé dans Supabase'))
  .catch(() => {}); // Échec silencieux
};
// ============================================================================
// FIN ORACLE V2.5

// === ICÔNES ===
const SpoonIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="1" width="2" height="8" fill={filled ? COLORS.accent : COLORS.bgLight} />
    <rect x="5" y="9" width="6" height="2" fill={filled ? COLORS.accent : COLORS.bgLight} />
    <rect x="4" y="11" width="8" height="4" rx="2" fill={filled ? COLORS.accent : COLORS.bgLight} />
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="2" width="14" height="18" rx="2" fill={COLORS.textMuted} />
    <rect x="5" y="2" width="2" height="18" fill={COLORS.accent} />
    <rect x="9" y="5" width="6" height="2" fill={COLORS.bgCard} />
  </svg>
);

//cacher plus tard ----->

const ExportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill={COLORS.textMuted}>
    <rect x="4" y="10" width="12" height="8" rx="1" />
    <rect x="9" y="2" width="2" height="10" />
    <path d="M6 6 L10 2 L14 6" stroke={COLORS.textMuted} strokeWidth="2" fill="none" />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.textMuted}>
    <rect x="10" y="4" width="4" height="16" />
    <rect x="4" y="10" width="16" height="4" />
  </svg>
);

// === COMPOSANT : Barre d'énergie ===
const EnergyBar = ({ spoons, onSpoonsChange, onOpenJournal, onExport}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    background: COLORS.bgCard,
    ...pixelBorder(COLORS.border, 3),
    marginBottom: '16px',
    flexWrap: 'wrap',
  }}>
    <span style={{ fontSize: pFONT_SIZE + 'px', color: COLORS.accent, textTransform: 'uppercase', }}>énergie</span>
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[...Array(10)].map((_, i) => (
        <button
          key={i}
          onClick={() => onSpoonsChange(i + 1)}
          style={{ background: 'none', border: 'none', padding: '1px', cursor: 'pointer', opacity: i < spoons ? 1 : 0.4 }}
        >
          <SpoonIcon filled={i < spoons} />
        </button>
      ))}
    </div>
    <span style={{ fontSize: '12px', fontFamily: PIXEL_FONT, color: COLORS.text }}>{spoons}/10</span>
    
    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
      <button onClick={onExport} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.7 }} title="Exporter">
        <ExportIcon />
      </button>
      <button onClick={onOpenJournal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', opacity: 0.7 }} title="Journal d'aventures">
        <BookIcon />
      </button>
    </div>
  </div>
);

// === COMPOSANT : Carte d'option ===
const OptionCard = ({ option, index, spoons, revealedQuestions, onUpdate, onRemove, onRevealNext, onBlur, canRemove, disabled }) => {
  const cardColors = [COLORS.primary, COLORS.secondary, COLORS.accent, '#c47dd1'];
  const cardColor = cardColors[index % cardColors.length];
  
  const cost = parseInt(option.cost) || 0;
  const energyGain = parseInt(option.energyGain) || 0;
  const netCost = cost - energyGain;
  const overBudget = netCost > spoons;
  const severity = netCost - spoons;

  return (
    <div style={{ width: '100%', background: COLORS.bgCard, ...pixelBorder(cardColor, 4), padding: '14px', opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', background: cardColor, ...pixelBorder(cardColor, 2) }} />
        <input
          type="text"
          value={option.name}
          onChange={(e) => onUpdate({ ...option, name: e.target.value })}
          onBlur={onBlur}
          placeholder={`Option ${index + 1}`}
          style={{ flex: 1, background: COLORS.bgLight, border: 'none', ...pixelBorder(COLORS.border, 2), padding: '6px 8px', fontFamily: PIXEL_FONT, fontSize: '15px', color: COLORS.text, textTransform: 'uppercase', outline: 'none' }}
        />
        {canRemove && (
          <button onClick={onRemove} style={{ background: 'none', border: 'none', color: COLORS.warning, fontFamily: PIXEL_FONT, fontSize: '14px', cursor: 'pointer', padding: '2px 6px' }}>×</button>
        )}
      </div>

      {/* Coût */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '8px', background: overBudget ? `${COLORS.warning}22` : COLORS.bgLight, ...pixelBorder(overBudget ? COLORS.warning : COLORS.border, 2) }}>
        <span style={{ fontFamily: PIXEL_FONT, fontSize: '12px', color: COLORS.accent }}>COÛT</span>
        <button onClick={() => onUpdate({ ...option, cost: Math.max(0, cost - 1).toString() })} style={{ background: COLORS.bgCard, border: 'none', ...pixelBorder(COLORS.border, 1), padding: '2px 6px', fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.text, cursor: 'pointer' }}>▼</button>
        <span style={{ fontFamily: PIXEL_FONT, fontSize: '14px', color: overBudget ? COLORS.warning : COLORS.accent, minWidth: '20px', textAlign: 'center' }}>{cost}</span>
        <button onClick={() => onUpdate({ ...option, cost: Math.min(15, cost + 1).toString() })} style={{ background: COLORS.bgCard, border: 'none', ...pixelBorder(COLORS.border, 1), padding: '2px 6px', fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.text, cursor: 'pointer' }}>▲</button>
        {overBudget && <span style={{ fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.warning, marginLeft: 'auto' }}>{severity > 5 ? '⚠️' : '⚡'} -{severity}</span>}
      </div>

      

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {QUESTIONS.map((q, qIndex) => {
          const isRevealed = revealedQuestions.includes(q.id);
          return (
            <div key={q.id} style={{ opacity: isRevealed ? 1 : 0.3, filter: isRevealed ? 'none' : 'blur(2px)', transition: 'opacity 0.4s, filter 0.4s', pointerEvents: isRevealed ? 'auto' : 'none' }}>
              <label style={{ fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.textMuted, display: 'block', marginBottom: '3px' }}>{q.label}</label>
              <input
                type="text"
                value={option[q.id] || ''}
                onChange={(e) => {
                  onUpdate({ ...option, [q.id]: e.target.value });
                  const nextQ = QUESTIONS[qIndex + 1];
                  if (nextQ && !revealedQuestions.includes(nextQ.id)) onRevealNext(nextQ.id);
                }}
                onBlur={onBlur}
                placeholder={q.placeholder}
                style={{ width: '100%', background: COLORS.bgLight, border: 'none', ...pixelBorder(COLORS.border, 2), padding: '6px 8px', fontFamily: PIXEL_FONT, fontSize: '12px', color: COLORS.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          );
        })}
      </div>

      {/* Gain */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0', marginTop: '12px', padding: '8px', background: COLORS.bgLight, ...pixelBorder(COLORS.border, 2), opacity: option.q2?.trim() ? 1 : 0.4 }}>
        <span style={{ fontFamily: PIXEL_FONT, fontSize: '12px', color: COLORS.secondary }}>GAIN</span>
        <button onClick={() => option.q2?.trim() && onUpdate({ ...option, energyGain: Math.max(0, energyGain - 1).toString() })} disabled={!option.q2?.trim()} style={{ background: COLORS.bgCard, border: 'none', ...pixelBorder(COLORS.border, 1), padding: '2px 6px', fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.text, cursor: option.q2?.trim() ? 'pointer' : 'not-allowed' }}>▼</button>
        <span style={{ fontFamily: PIXEL_FONT, fontSize: '12px', color: COLORS.secondary, minWidth: '20px', textAlign: 'center' }}>+{energyGain}</span>
        <button onClick={() => option.q2?.trim() && onUpdate({ ...option, energyGain: Math.min(10, energyGain + 1).toString() })} disabled={!option.q2?.trim()} style={{ background: COLORS.bgCard, border: 'none', ...pixelBorder(COLORS.border, 1), padding: '2px 6px', fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.text, cursor: option.q2?.trim() ? 'pointer' : 'not-allowed' }}>▲</button>
      </div>
    </div>
  );
};

// === COMPOSANT : Bouton Ajouter ===
const AddOptionButton = ({ onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '20px', background: COLORS.bgCard, ...pixelBorder(COLORS.border, 3), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 0.7, border: 'none' }}>
    <PlusIcon />
    <span style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.textMuted }}>Ajouter une option</span>
  </button>
);

// === COMPOSANT : Résultat Oracle ===
const OracleResult = ({ result, onClose, onNewQuest }) => {
  if (!result) return null;
  const isOffline = result.isOffline;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: COLORS.bgCard, ...pixelBorder(isOffline ? COLORS.accent : COLORS.secondary, 4), padding: '20px', animation: 'slideUp 0.3s ease-out', maxHeight: '60vh', overflow: 'auto', zIndex: 100 }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: COLORS.textMuted, fontFamily: PIXEL_FONT, fontSize: '14px', cursor: 'pointer' }}>×</button>
      
      {isOffline && <div style={{ fontFamily: PIXEL_FONT, fontSize: '6px', color: COLORS.accent, textAlign: 'center', marginBottom: '8px' }}>📡 Analyse locale</div>}
      
      <div style={{ fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.accent, textAlign: 'center', marginBottom: '12px', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>★ L'ORACLE A PARLÉ ★</div>
      <div style={{ fontFamily: PIXEL_FONT, fontSize: '12px', color: COLORS.secondary, textAlign: 'center', marginBottom: '12px', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>→ {result.recommandation?.choix || 'Réflexion...'} ←</div>
      <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, lineHeight: '1.8', textAlign: 'center', marginBottom: '16px', maxWidth: '500px', margin: '0 auto 16px' }}>{result.recommandation?.explication || ''}</div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={onNewQuest} style={{ background: COLORS.primary, border: 'none', ...pixelBorder(COLORS.primary, 3), padding: '10px 20px', fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.bg, cursor: 'pointer' }}>Nouvelle Quête</button>
      </div>
    </div>
  );
};



// === COMPOSANT : Feedback (En cours → Accomplies) ===
const FeedbackModal = ({ quest, onClose, onSubmit }) => {
  const [chosenOption, setChosenOption] = useState(null);
  const [satisfaction, setSatisfaction] = useState(null);
  
  if (!quest) return null;
  
  const optionNames = quest.options?.map(o => o.name).filter(Boolean) || [];
  const oracleChoice = quest.oracleResponse?.recommandation?.choix;

  const handleSubmit = () => {
    if (!chosenOption || !satisfaction) return;
    onSubmit({
      chosenOption,
      followedOracle: chosenOption === oracleChoice,
      satisfaction,
      feedbackDate: new Date().toISOString()
    });
  };

  return (
    <div style={{ background: COLORS.bgCard, ...pixelBorder(COLORS.secondary, 4), padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ fontFamily: PIXEL_FONT, fontSize: '9px', color: COLORS.secondary, marginBottom: '16px', textAlign: 'center', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>
        📋 RETOUR D'AVENTURE
      </div>
      
      {/* Rappel de la recommandation */}
      <div style={{ background: COLORS.bgLight, ...pixelBorder(COLORS.border, 2), padding: '10px', marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ fontFamily: PIXEL_FONT, fontSize: '6px', color: COLORS.textMuted, marginBottom: '4px' }}>L'Oracle avait dit :</div>
        <div style={{ fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.secondary }}>→ {oracleChoice} ←</div>
      </div>
      
      {/* Question 1 : T'as fait quoi ? */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, marginBottom: '10px' }}>T'as fait quoi ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {optionNames.map(name => (
            <button
              key={name}
              onClick={() => setChosenOption(name)}
              style={{
                background: chosenOption === name ? COLORS.secondary : COLORS.bgLight,
                border: 'none',
                ...pixelBorder(chosenOption === name ? COLORS.secondary : COLORS.border, 2),
                padding: '8px 12px',
                fontFamily: PIXEL_FONT,
                fontSize: '7px',
                color: chosenOption === name ? COLORS.bg : COLORS.text,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {name} {name === oracleChoice && '(reco)'}
              </button>
            ))}
            <button
              onClick={() => setChosenOption('autre')}
              style={{
                background: chosenOption === 'autre' ? COLORS.accent : COLORS.bgLight,
                border: 'none',
                ...pixelBorder(chosenOption === 'autre' ? COLORS.accent : COLORS.border, 2),
                padding: '8px 12px',
                fontFamily: PIXEL_FONT,
                fontSize: '7px',
                color: chosenOption === 'autre' ? COLORS.bg : COLORS.textMuted,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Autre chose / Rien fait
            </button>
          </div>
        </div>
        
        {/* Question 2 : C'était le bon choix ? */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, marginBottom: '10px' }}>C'était le bon choix ?</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[
              { id: 'good', emoji: '😊', label: 'Oui', color: COLORS.secondary },
              { id: 'meh', emoji: '😐', label: 'Bof', color: COLORS.accent },
              { id: 'bad', emoji: '😞', label: 'Non', color: COLORS.warning },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setSatisfaction(opt.id)}
                style={{
                  background: satisfaction === opt.id ? opt.color : COLORS.bgLight,
                  border: 'none',
                  ...pixelBorder(satisfaction === opt.id ? opt.color : COLORS.border, 2),
                  padding: '10px 14px',
                  fontFamily: PIXEL_FONT,
                  fontSize: '14px',
                  color: satisfaction === opt.id ? COLORS.bg : COLORS.text,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{opt.emoji}</span>
                <span style={{ fontSize: '6px' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Boutons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, background: COLORS.border, border: 'none', ...pixelBorder(COLORS.border, 2), padding: '10px', fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, cursor: 'pointer' }}>
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!chosenOption || !satisfaction}
            style={{
              flex: 1,
              background: (chosenOption && satisfaction) ? COLORS.secondary : COLORS.border,
              border: 'none',
              ...pixelBorder((chosenOption && satisfaction) ? COLORS.secondary : COLORS.border, 2),
              padding: '10px',
              fontFamily: PIXEL_FONT,
              fontSize: '7px',
              color: (chosenOption && satisfaction) ? COLORS.bg : COLORS.textMuted,
              cursor: (chosenOption && satisfaction) ? 'pointer' : 'not-allowed',
            }}
          >
            Terminer ✓
          </button>
        </div>
      </div>
  );
};

// === COMPOSANT : Feedback Inline (version non-modale, pour le flow vertical) ===
const FeedbackInline = ({ quest, feedback, onSubmit, disabled }) => {
  const [chosenOption, setChosenOption] = useState(feedback?.chosenOption || null);
  const [satisfaction, setSatisfaction] = useState(feedback?.satisfaction || null);
  const [comment, setComment] = useState(feedback?.comment || ''); // NOUVEAU
  
  if (!quest) return null;
  
  const optionNames = quest.options?.map(o => o.name).filter(Boolean) || [];
  const oracleChoice = quest.oracleResponse?.recommandation?.choix;

  const handleSubmit = () => {
    if (!chosenOption || !satisfaction) return;
    onSubmit({
      chosenOption,
      followedOracle: chosenOption === oracleChoice,
      satisfaction,
      comment: comment.trim(), // NOUVEAU
      feedbackDate: new Date().toISOString()
    });
  };

  // Si disabled (déjà soumis), afficher version figée
  if (disabled && feedback) {
    return (
      <div style={{ background: COLORS.bgCard, ...pixelBorder(COLORS.border, 4), padding: '20px', marginBottom: '16px', opacity: 0.7 }}>
        <div style={{ fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.textMuted, textAlign: 'center' }}>
          Choix : {feedback.chosenOption} • {feedback.satisfaction === 'good' ? '😊' : feedback.satisfaction === 'meh' ? '😐' : '😞'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.bgCard, ...pixelBorder(COLORS.accent, 4), padding: '20px', marginBottom: '16px' }}>
      <div style={{ fontFamily: PIXEL_FONT, fontSize: '9px', color: COLORS.accent, marginBottom: '16px', textAlign: 'center', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>
        📋 ET ALORS, T'AS FAIT QUOI ?
      </div>
      
      {/* Question 1 : T'as fait quoi ? */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {optionNames.map(name => (
            <button
              key={name}
              onClick={() => setChosenOption(name)}
              style={{
                background: chosenOption === name ? COLORS.secondary : COLORS.bgLight,
                border: 'none',
                ...pixelBorder(chosenOption === name ? COLORS.secondary : COLORS.border, 2),
                padding: '10px 16px',
                fontFamily: PIXEL_FONT,
                fontSize: '7px',
                color: chosenOption === name ? COLORS.bg : COLORS.text,
                cursor: 'pointer',
              }}
            >
              {name} {name === oracleChoice && '✓'}
            </button>
          ))}
          <button
            onClick={() => setChosenOption('autre')}
            style={{
              background: chosenOption === 'autre' ? COLORS.accent : COLORS.bgLight,
              border: 'none',
              ...pixelBorder(chosenOption === 'autre' ? COLORS.accent : COLORS.border, 2),
              padding: '10px 16px',
              fontFamily: PIXEL_FONT,
              fontSize: '7px',
              color: chosenOption === 'autre' ? COLORS.bg : COLORS.textMuted,
              cursor: 'pointer',
            }}
          >
            Autre / Rien
          </button>
        </div>
      </div>
      
      {/* Question 2 : C'était le bon choix ? */}
      {chosenOption && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, marginBottom: '10px', textAlign: 'center' }}>C'était le bon choix ?</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {[
              { id: 'good', emoji: '😊', label: 'Oui', color: COLORS.secondary },
              { id: 'meh', emoji: '😐', label: 'Bof', color: COLORS.accent },
              { id: 'bad', emoji: '😞', label: 'Non', color: COLORS.warning },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setSatisfaction(opt.id)}
                style={{
                  background: satisfaction === opt.id ? opt.color : COLORS.bgLight,
                  border: 'none',
                  ...pixelBorder(satisfaction === opt.id ? opt.color : COLORS.border, 2),
                  padding: '12px 16px',
                  fontFamily: PIXEL_FONT,
                  fontSize: '16px',
                  color: satisfaction === opt.id ? COLORS.bg : COLORS.text,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{opt.emoji}</span>
                <span style={{ fontSize: '6px' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* NOUVEAU: Commentaire optionnel (après avoir choisi la satisfaction) */}
      {chosenOption && satisfaction && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '6px', color: COLORS.textMuted, marginBottom: '8px', textAlign: 'center' }}>
            Commentaire (optionnel)
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Notes, réflexions..."
            style={{
              width: '100%',
              minHeight: '60px',
              background: COLORS.bgLight,
              border: 'none',
              ...pixelBorder(COLORS.border, 2),
              padding: '10px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: COLORS.text,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      )}
      
      {/* Bouton Valider */}
      {chosenOption && satisfaction && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => {handleSubmit(); }}

            style={{
              background: COLORS.secondary,
              border: 'none',
              ...pixelBorder(COLORS.secondary, 3),
              padding: '12px 24px',
              fontFamily: PIXEL_FONT,
              fontSize: '8px',
              color: COLORS.bg,
              cursor: 'pointer',
            }}
          >
            Valider →
          </button>
        </div>
      )}
    </div>
  );
};

// === COMPOSANT : Journal ===
const Journal = ({ pending, completed, onClose, onLoad, onDelete, onViewOracle, onExport }) => {
  const [tab, setTab] = useState('pending');
  const tabs = [
    { id: 'pending', label: 'En cours', data: pending, color: COLORS.primary },
    { id: 'completed', label: 'Accomplies', data: completed, color: COLORS.secondary },
  ];
  const currentTab = tabs.find(t => t.id === tab);
  const currentData = currentTab?.data || [];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: COLORS.bgCard, ...pixelBorder(COLORS.accent, 4), padding: '20px', maxWidth: '450px', width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.accent, textShadow: `2px 2px 0 ${COLORS.shadow}`, flex: 1, textAlign: 'center' }}>📖 JOURNAL</div>
          {completed.length > 0 && (
            <button
              onClick={onExport}
              style={{
                background: COLORS.primary,
                border: 'none',
                ...pixelBorder(COLORS.primary, 2),
                padding: '6px 10px',
                fontFamily: PIXEL_FONT,
                fontSize: '6px',
                color: COLORS.bg,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
             Raconte !
            </button>

          )}


        </div>
        
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: tab === t.id ? t.color : COLORS.bgLight, border: 'none', ...pixelBorder(tab === t.id ? t.color : COLORS.border, 2), padding: '8px 4px', fontFamily: PIXEL_FONT, fontSize: '6px', color: tab === t.id ? COLORS.bg : COLORS.textMuted, cursor: 'pointer' }}>
              {t.label} ({t.data.length})
            </button>
          ))}
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', marginBottom: '14px' }}>
          {currentData.length === 0 ? (
            <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.textMuted, textAlign: 'center', padding: '30px' }}>Aucune aventure</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentData.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (tab === 'drafts') onLoad(item);
                    else if (item.oracleResponse) onViewOracle(item, tab);
                  }}
                  style={{ 
                    background: COLORS.bgLight, 
                    ...pixelBorder(tab === 'drafts' ? COLORS.primary : (item.oracleResponse ? (tab === 'pending' ? COLORS.primary : COLORS.primary) : COLORS.border), 2), 
                    padding: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text }}>{item.options?.map(o => o.name).filter(Boolean).join(' vs ') || 'Sans titre'}</div>
                    <div style={{ fontFamily: PIXEL_FONT, fontSize: '6px', color: item.oracleResponse ? COLORS.secondary : COLORS.textMuted, marginTop: '3px' }}>
                      {new Date(item.timestamp || item.date).toLocaleDateString('fr-FR')}
                      {item.oracleResponse && ` → ${item.oracleResponse.recommandation?.choix}`}
                      {item.feedback && ` ${item.feedback.satisfaction === 'good' ? '😊' : item.feedback.satisfaction === 'meh' ? '😐' : '😞'}`}
                    </div>
                  </div>
                  {tab === 'drafts' && <span style={{ fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.primary }}>📝</span>}
                  {tab === 'pending' && item.oracleResponse && (
                    <span style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.accent }}>📋</span>
                  )}
                  {tab === 'completed' && item.oracleResponse && (
                    <span style={{ fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.secondary }}>🔮</span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onDelete(tab, i); }} style={{ background: 'none', border: 'none', color: COLORS.warning, fontFamily: PIXEL_FONT, fontSize: '12px', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={onClose} style={{ width: '100%', background: COLORS.border, border: 'none', ...pixelBorder(COLORS.border, 2), padding: '10px', fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, cursor: 'pointer' }}>FERMER</button>
      </div>
    </div>
  );
};

// === COMPOSANT : Navigation entre étapes ===
const StepNav = ({ currentStep, maxStep, onPrev, onNext }) => {
  const steps = ['Questions', 'Oracle', 'Feedback'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '10px', marginBottom: '10px' }}>
      <button
        onClick={onPrev}
        disabled={currentStep <= 1}
        style={{
          background: currentStep > 1 ? COLORS.primary : COLORS.bgCard,
          border: 'none',
          ...pixelBorder(currentStep > 1 ? COLORS.primary : COLORS.border, 2),
          padding: '6px 10px',
          fontFamily: PIXEL_FONT,
          fontSize: '10px',
          color: currentStep > 1 ? COLORS.bg : COLORS.textMuted,
          cursor: currentStep > 1 ? 'pointer' : 'not-allowed',
        }}
      >
        ◀
      </button>
      <span style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.textMuted }}>
        {steps[currentStep - 1]}
      </span>
      <button
        onClick={onNext}
        disabled={currentStep >= maxStep}
        style={{
          background: currentStep < maxStep ? COLORS.primary : COLORS.bgCard,
          border: 'none',
          ...pixelBorder(currentStep < maxStep ? COLORS.primary : COLORS.border, 2),
          padding: '6px 10px',
          fontFamily: PIXEL_FONT,
          fontSize: '10px',
          color: currentStep < maxStep ? COLORS.bg : COLORS.textMuted,
          cursor: currentStep < maxStep ? 'pointer' : 'not-allowed',
        }}
      >
        ▶
      </button>
    </div>
  );
};



// === COMPOSANT PRINCIPAL ===
export default function QuestFinder() {
  const [spoons, setSpoons] = useState(5);
  const [options, setOptions] = useState([
    { id: '1', name: '', cost: '0', energyGain: '0', q1: '', q2: '', q3: '', q0: '' },
    { id: '2', name: '', cost: '0', energyGain: '0', q1: '', q2: '', q3: '', q0: '' },
  ]);
  const [revealedQuestions, setRevealedQuestions] = useState({ '1': ['q1'], '2': ['q1'] });
  const [oracleResult, setOracleResult] = useState(null);
  const [showJournal, setShowJournal] = useState(false);
  const [feedbackQuest, setFeedbackQuest] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [saveNotice, setSaveNotice] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1=Questions, 2=Oracle, 3=Feedback, 4=Conclusion
  const [maxStep, setMaxStep] = useState(1); // Jusqu'où on est allé
  const [currentFeedback, setCurrentFeedback] = useState(null); // Feedback en cours
  const saveTimeoutRef = useRef(null);

  const cloudReady = useRef(false);

  const saveToCloud = useCallback(async (d, p, c, { verbose = false } = {}) => {
    if (!cloudReady.current) {
      console.warn('⛔ Supabase non joignable au chargement → sauvegarde cloud désactivée pour cette session');
      if (verbose) alert('⛔ Supabase hors ligne : rien n\'a été écrasé. Recharge la page quand la connexion revient.');
      return false;
    }
    const { error } = await supabase.from('saves').upsert({
      id: 'diane',
      data: {
        exportDate: new Date().toISOString(),
        version: APP_CONFIG.TITLE,
        questFinderDrafts: d,
        questFinderPending: p,
        questFinderCompleted: c
      },
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      if (verbose) alert('❌ Erreur lors de la sauvegarde');
      return false;
    }
    console.log('✅ Sauvegardé dans Supabase');
    if (verbose) alert('✓ Aventures sauvegardées !');
    return true;
  }, []);

  useEffect(() => {
   
  document.title = APP_CONFIG.TITLE;


    // == IMPORT EXPORT SAVES SUPABASE == // 
    const loadData = async () => {
      const { data, error } = await supabase
        .from('saves')
        .select('data')
        .eq('id', 'diane')
        .single();
  
      const tableEmpty = error?.code === 'PGRST116'; // "0 rows" = vrai vide, pas une panne
  
      if (error && !tableEmpty) {
        // Panne réseau / auth / URL : on lit le localStorage et on VERROUILLE l'écriture
        console.error('❌ Supabase inaccessible, mode lecture locale :', error.message);
        cloudReady.current = false;
        const d = localStorage.getItem('questFinderDrafts');
        const p = localStorage.getItem('questFinderPending');
        const c = localStorage.getItem('questFinderCompleted');
        if (d) setDrafts(JSON.parse(d));
        if (p) setPending(JSON.parse(p));
        if (c) setCompleted(JSON.parse(c));
        return;
      }
  
      if (data?.data) {
        cloudReady.current = true;
        const s = data.data
        setDrafts(s.questFinderDrafts || [])
        setPending(s.questFinderPending || [])
        setCompleted(s.questFinderCompleted || [])
        console.log('✓ Données chargées depuis Supabase')
        return;
      }
    
      // 0 ligne visible : soit vraiment vide, soit masqué par RLS. On ne sait pas → on n'écrit pas.
      console.warn('⚠ Aucune donnée visible sur Supabase, sauvegarde cloud désactivée pour cette session');
      cloudReady.current = false;   }; 
    loadData();     
}, [saveToCloud]);  
    // == FIN IMPORT EXPORT SAVES SUPABASE == // 

  const saveDraft = useCallback(() => {
    const hasContent = options.some(o => o.name?.trim());
    if (!hasContent || oracleResult) return;

    const draftId = currentDraftId || Date.now().toString();
    if (!currentDraftId) setCurrentDraftId(draftId);

    const draft = { id: draftId, timestamp: Date.now(), spoons, options, revealedQuestions };
    const existingIdx = drafts.findIndex(d => d.id === draftId);
    
    let newDrafts;
    if (existingIdx >= 0) {
      newDrafts = [...drafts];
      newDrafts[existingIdx] = draft;
    } else {
      newDrafts = [draft, ...drafts].slice(0, 15);
    }

    setDrafts(newDrafts);
    localStorage.setItem('questFinderDrafts', JSON.stringify(newDrafts));
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 1500);
  }, [options, spoons, revealedQuestions, drafts, oracleResult, currentDraftId]);

  const handleBlur = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(saveDraft, 500);
  }, [saveDraft]);

  const canConsultOracle = useCallback(() => {
    const validOptions = options.filter(o => o.name?.trim());
    if (validOptions.length < 2) return false;
    return validOptions.every(o => o.cost && o.q1?.trim() && o.q2?.trim() && o.q3?.trim() && o.q0?.trim());
  }, [options]);

  const addOption = () => {
    if (options.length >= 4) return;
    const newId = Date.now().toString();
    setOptions([...options, { id: newId, name: '', cost: '0', energyGain: '0', q1: '', q2: '', q3: '', q0: '' }]);
    setRevealedQuestions({ ...revealedQuestions, [newId]: ['q1'] });
  };

  const removeOption = (id) => {
    if (options.length <= 2) return;
    setOptions(options.filter(o => o.id !== id));
  };

  const updateOption = (id, newOption) => setOptions(options.map(o => o.id === id ? newOption : o));
  const revealNext = (optionId, questionId) => setRevealedQuestions({ ...revealedQuestions, [optionId]: [...(revealedQuestions[optionId] || []), questionId] });


 

  // === CONSTRUIRE LE PROMPT UTILISATEUR ===
  const buildUserPrompt = (validOptions, preAnalysis, extra = '') => {
    const signalsSummary = preAnalysis.analyses.map(a => {
      const allSignals = [...a.signals.niveau1, ...a.signals.niveau2, ...a.signals.niveau3, ...a.signals.niveau4];
      const greens = allSignals.filter(s => s.type === 'green').map(s => s.text);
      const reds = allSignals.filter(s => s.type === 'red').map(s => s.text);
      const oranges = allSignals.filter(s => s.type === 'orange').map(s => s.text);
      return `${a.option.name} (score: ${a.score}):\n  🟢 ${greens.join(', ') || 'aucun'}\n  🔴 ${reds.join(', ') || 'aucun'}\n  🟠 ${oranges.join(', ') || 'aucun'}`;
    }).join('\n\n');

    return `Énergie dispo: ${spoons}/10 | Type de cas: ${preAnalysis.caseType}

## SIGNAUX DÉTECTÉS
${signalsSummary}

## CE QUE LA PERSONNE A DIT
${validOptions.map(o => `### ${o.name} (coût ${o.cost}, gain potentiel +${o.energyGain || 0})
- Première sensation : "${o.q1}"
- Si ça se passe bien : "${o.q2}"
- Demain si pas fait : "${o.q3}"  
- Dans 10 jours : "${o.q0}"`).join('\n\n')}

${extra}Parle-lui comme un.e ami.e sage.`;
  };

  // === CONSULTER L'ORACLE ===
  const consultOracle = async () => {
    if (!canConsultOracle()) return;

    const validOptions = options.filter(o => o.name?.trim());
    const preAnalysis = analyzeWithOracleV2_5(validOptions, spoons);
    
    // Toujours utiliser le fallback d'abord (plus rapide, pas de dépendance API)
    const fallbackResult = { recommandation: preAnalysis.fallbackRecommendation, isOffline: true };
    setOracleResult(fallbackResult);
    setCurrentStep(2);
    setMaxStep(2);
    saveToHistory(fallbackResult, validOptions);
  };


  const saveToHistory = (result, validOptions) => {
    const quest = { id: Date.now().toString(), timestamp: Date.now(), spoons, options: validOptions, oracleResponse: result };
    setFeedbackQuest(quest); // Stocker pour le feedback
    
    const newPending = [quest, ...pending].slice(0, 20);
    setPending(newPending);
    localStorage.setItem('questFinderPending', JSON.stringify(newPending));
    
    if (currentDraftId) {
      const newDrafts = drafts.filter(d => d.id !== currentDraftId);
      setDrafts(newDrafts);
      localStorage.setItem('questFinderDrafts', JSON.stringify(newDrafts));
    }
  };

  const exportQuest = () => {
    const validOptions = options.filter(o => o.name?.trim());
    if (validOptions.length === 0) return;
    const md = `# Quest Finder - ${new Date().toLocaleDateString('fr-FR')}\n\n## Énergie: ${spoons}/10\n\n${validOptions.map(o => `### ${o.name}\nCoût: ${o.cost} | Gain: +${o.energyGain || 0}\n- Q1: ${o.q1 || '—'}\n- Q2: ${o.q2 || '—'}\n- Q3: ${o.q3 || '—'}\n- q0: ${o.q0 || '—'}\n`).join('\n')}${oracleResult ? `\n## Oracle\n**→ ${oracleResult.recommandation?.choix} ←**\n${oracleResult.recommandation?.explication}` : ''}`;
    navigator.clipboard.writeText(md).then(() => alert('Copié !')).catch(() => console.log(md));
  };

  const loadDraft = (draft) => {
    setSpoons(draft.spoons || 5);
    setOptions(draft.options || options);
    setRevealedQuestions(draft.revealedQuestions || { '1': ['q1'], '2': ['q1'] });
    setCurrentDraftId(draft.id);
    setOracleResult(null);
    setFeedbackQuest(null);
    setCurrentFeedback(null);
    setCurrentStep(1);
    setMaxStep(1);
    setShowJournal(false);
  };

  const deleteJournalEntry = (type, index) => {
    if (type === 'drafts') {
      const newDrafts = drafts.filter((_, i) => i !== index);
      setDrafts(newDrafts);
      localStorage.setItem('questFinderDrafts', JSON.stringify(newDrafts));
    } else if (type === 'pending') {
      const newPending = pending.filter((_, i) => i !== index);
      setPending(newPending);
      localStorage.setItem('questFinderPending', JSON.stringify(newPending));
    } else {
      const newCompleted = completed.filter((_, i) => i !== index);
      setCompleted(newCompleted);
      localStorage.setItem('questFinderCompleted', JSON.stringify(newCompleted));
    }
  };

  const resetQuest = () => {
    setOptions([
      { id: '1', name: '', cost: '0', energyGain: '0', q1: '', q2: '', q3: '', q0: '' },
      { id: '2', name: '', cost: '0', energyGain: '0', q1: '', q2: '', q3: '', q0: '' },
    ]);
    setRevealedQuestions({ '1': ['q1'], '2': ['q1'] });
    setCurrentDraftId(null);
    setOracleResult(null);
    setFeedbackQuest(null);
    setCurrentFeedback(null);
    setCurrentStep(1);
    setMaxStep(1);
  };

  const viewOracleFromHistory = (item, fromTab) => {
    // Reset les states avant de charger une nouvelle quête
    setCurrentFeedback(null);
    
    // Charger les options pour pouvoir les revoir
    if (item.options) {
      setOptions(item.options);
      const revealed = {};
      item.options.forEach(o => { revealed[o.id] = ['q1', 'q2', 'q3', 'q0']; });
      setRevealedQuestions(revealed);
      setSpoons(item.spoons || 5);
    }
    
    // Stocker la quête en cours de traitement
    setFeedbackQuest(item);
    setOracleResult(item.oracleResponse);
    
    if (fromTab === 'drafts') {
      // Préparation : affiche le formulaire
      setCurrentStep(1);
      setMaxStep(1);
    } else if (fromTab === 'pending') {
      // En cours : affiche Oracle + question feedback
      setCurrentStep(3);
      setMaxStep(3);
    } else {
      // Accomplies : affiche le choix figé
      setCurrentFeedback(item.feedback);
      setCurrentStep(4);
      setMaxStep(4);
    }
    setShowJournal(false);
  };

  const submitFeedback = (feedback) => {
    if (!feedbackQuest) return;
    
    // Créer la quête complétée avec le feedback
    const completedQuest = {
      ...feedbackQuest,
      feedback,
      completedDate: new Date().toISOString()
    };
    
    // Ajouter aux accomplies
    const newCompleted = [completedQuest, ...completed].slice(0, 30);
    setCompleted(newCompleted);
    localStorage.setItem('questFinderCompleted', JSON.stringify(newCompleted));
    
    // Retirer des "en cours"
    const newPending = pending.filter(p => p.id !== feedbackQuest.id);
    setPending(newPending);
    localStorage.setItem('questFinderPending', JSON.stringify(newPending));
    
    // Fermer le modal
    setFeedbackQuest(null);
  };


// === EXPORT AVEC SCORING - FORMAT RÉIMPORTABLE ===

// CALCUL

  const buildScoringExplanation = (analyses, spoons) => {
  return analyses.map(analysis => {
    const opt = analysis.option;
    const signals = analysis.signals;
    
    const n1 = signals.niveau1;
    const n2 = signals.niveau2;
    const n3 = signals.niveau3;
    const n4 = signals.niveau4;
    
    const netCost = parseInt(opt.cost) - (parseInt(opt.energyGain) || 0);
    const energyDeficit = netCost - spoons;
    
    const hasGreenSignals = n1.some(s => s.type === 'green') || n3.some(s => s.type === 'green');
    const hasRedSignals = n1.some(s => s.type === 'red') || n2.some(s => s.type === 'red');
    
    let interpretation = '';
    if (hasGreenSignals && !hasRedSignals) {
      interpretation = `Ce qu'elle veut vraiment : ce domaine est une vraie valeur`;
    } else if (hasRedSignals && !hasGreenSignals) {
      interpretation = `Hameçons détectés : obligation, culpabilité ou pression externe`;
    } else if (hasGreenSignals && hasRedSignals) {
      interpretation = `Conflit : vraie envie VS obstacles (fatigue, coût, pression)`;
    } else {
      interpretation = `Faible attrait : ni vraie envie ni forte résistance`;
    }
    
    return {
      option: opt.name,
      responses: {
        q1: opt.q1,
        q2: opt.q2,
        q3: opt.q3,
        q0: opt.q0
      },
      signals: {
        niveau1: n1.map(s => ({ signal: s.text, type: s.type, value: s.type === 'green' ? 5 : -5 })),
        niveau2: n2.map(s => ({ signal: s.text, type: s.type, value: s.type === 'green' ? 3 : (s.type === 'orange' ? -2 : -3) })),
        niveau3: n3.map(s => ({ signal: s.text, type: s.type, value: s.type === 'green' ? 2 : -2 })),
        niveau4: n4.map(s => ({ signal: s.text, type: s.type }))
      },
      energyCalculation: {
        cost: parseInt(opt.cost),
        energyGain: parseInt(opt.energyGain) || 0,
        netCost: netCost,
        spoons: spoons,
        energyDeficit: energyDeficit,
        explanation: `coût ${opt.cost} - gain +${opt.energyGain || 0} = ${netCost} | dispo ${spoons} = deficit ${energyDeficit}`
      },
      categoryScores: {
        niveau1: n1.reduce((sum, s) => sum + (s.type === 'green' ? 5 : -5), 0),
        niveau2: n2.reduce((sum, s) => sum + (s.type === 'green' ? 3 : (s.type === 'orange' ? -2 : -3)), 0),
        niveau3: n3.reduce((sum, s) => sum + (s.type === 'green' ? 2 : -2), 0)
      },
      totalScore: analysis.score,
      interpretation: interpretation
    };
  });
};

// EXPORT 
// === EXPORT VERS BACKEND ===

const exportAll = async () => {
  if (completed.length === 0) {
    alert('Aucune aventure à exporter !');
    return;
  }

  // Helper pour générer revealedQuestions
  const buildRevealed = (options, timestamp) => {
    const revealed = {};
    options.forEach((opt, idx) => {
      revealed[`choice_${idx + 1}-${timestamp}`] = ["q1", "q2", "q3", "q0"];
    });
    return revealed;
  };

  const exportData = {
    exportDate: new Date().toISOString(),
    version: APP_CONFIG.TITLE,
    
    questFinderDrafts: drafts.map(d => ({
      id: `quest_${d.timestamp}`,
      timestamp: new Date(d.timestamp).toISOString(),
      spoons: d.spoons,
      options: d.options.map((opt, idx) => ({
        id: `choice_${idx + 1}-${d.timestamp}`,
        name: opt.name,
        cost: opt.cost,
        energyGain: opt.energyGain,
        q1: opt.q1,
        q2: opt.q2,
        q3: opt.q3,
        q0: opt.q0
      })),
      revealedQuestions: buildRevealed(d.options, d.timestamp)
    })),

    questFinderPending: pending.map(p => {
      const scoring = analyzeWithOracleV2_5(p.options, p.spoons);
      return {
        id: `quest_${p.timestamp}`,
        timestamp: new Date(p.timestamp).toISOString(),
        spoons: p.spoons,
        options: p.options.map((opt, idx) => ({
          id: `choice_${idx + 1}-${p.timestamp}`,
          name: opt.name,
          cost: opt.cost,
          energyGain: opt.energyGain,
          q1: opt.q1,
          q2: opt.q2,
          q3: opt.q3,
          q0: opt.q0
        })),
        revealedQuestions: buildRevealed(p.options, p.timestamp),
        scoring: {
          analysesDetailed: buildScoringExplanation(scoring.analyses, p.spoons),
          comparison: {
            scoreDiff: scoring.scoreDiff,
            allWeak: scoring.allWeak,
            caseType: scoring.caseType
          },
          verdict: scoring.fallbackRecommendation.choix,
          verdictExplication: scoring.fallbackRecommendation.explication
        },
        oracleResponse: p.oracleResponse
      };
    }),

    questFinderCompleted: completed.map(c => {
      const scoring = analyzeWithOracleV2_5(c.options, c.spoons);
      return {
        id: `quest_${c.timestamp}`,
        timestamp: new Date(c.timestamp).toISOString(),
        spoons: c.spoons,
        options: c.options.map((opt, idx) => ({
          id: `choice_${idx + 1}-${c.timestamp}`,
          name: opt.name,
          cost: opt.cost,
          energyGain: opt.energyGain,
          q1: opt.q1,
          q2: opt.q2,
          q3: opt.q3,
          q0: opt.q0
        })),
        revealedQuestions: buildRevealed(c.options, c.timestamp),
        scoring: {
          analysesDetailed: buildScoringExplanation(scoring.analyses, c.spoons),
          comparison: {
            scoreDiff: scoring.scoreDiff,
            allWeak: scoring.allWeak,
            caseType: scoring.caseType
          },
          verdict: scoring.fallbackRecommendation.choix,
          verdictExplication: scoring.fallbackRecommendation.explication
        },
        oracleResponse: c.oracleResponse,
        feedback: c.feedback,
        completedDate: c.completedDate
      };
    })
  };

  await saveToCloud(drafts, pending, completed, { verbose: true });
};

// FIN EXPORT

{/* Header */}
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bgLight} 100%)`, padding: '16px', fontFamily: PIXEL_FONT }}>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gentlePulse { 0%, 100% { background-color: ${COLORS.accent}; } 50% { background-color: ${COLORS.accentLight}; } }
        * { box-sizing: border-box; font-family: "Press Start 2P", monospace; }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <button onClick={() => window.location.reload()}>
        <h1 style={{ fontFamily: PIXEL_FONT, fontSize: '20px', color: COLORS.accent, textShadow: `3px 3px 0 ${COLORS.shadow}`, margin: 0 }}>{APP_CONFIG.TITLE}</h1>
        </button>
        <p style={{ fontFamily: PIXEL_FONT, fontSize: '14px', color: COLORS.textMuted, marginTop: '6px' }}>Choisis ton aventure</p>
      </div>

{/* Bandeau last draft */}
{
drafts.length > 0 && currentDraftId === null &&

(
<div 
      onClick={() => loadDraft(drafts[0])}
      style={{
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 14px',
  background: COLORS.primary,
  ...pixelBorder(COLORS.primary, 3),
  marginBottom: '12px',
  cursor: 'pointer'
}} >
  <span style={{ 
    fontFamily: PIXEL_FONT, 
    fontSize: '12px', 
    textAlign: 'center',
    color: COLORS.bg,
    flex: 1
  }}>
  📝 Une quête en préparation !
  </span>
  
  </div>
)
}

{/* Bandeau energy bar */}
      <EnergyBar spoons={spoons} onSpoonsChange={setSpoons} onOpenJournal={() => setShowJournal(true)} onExport={exportQuest} /> 

      {saveNotice && <div style={{ position: 'fixed', bottom: '16px', right: '16px', background: COLORS.bgCard, ...pixelBorder(COLORS.secondary, 2), padding: '8px 12px', fontFamily: PIXEL_FONT, fontSize: '6px', color: COLORS.secondary, zIndex: 50 }}>💾 Sauvé</div>}
      
      {/* ÉTAPE 1 : Questions */}
      {currentStep >= 1 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
            {options.map((option, index) => (
              <OptionCard key={option.id} option={option} index={index} spoons={spoons} revealedQuestions={revealedQuestions[option.id] || []} onUpdate={(newOpt) => updateOption(option.id, newOpt)} onRemove={() => removeOption(option.id)} onRevealNext={(qId) => revealNext(option.id, qId)} onBlur={handleBlur} canRemove={options.length > 2} disabled={currentStep > 1} />
            ))}
            {options.length < 4 && currentStep === 1 && <AddOptionButton onClick={addOption} disabled={options.length >= 4} />}
          </div>

          {currentStep === 1 && (
             <div style={{ textAlign: 'center' }}>
           
               <button onClick={() => {consultOracle(); }} disabled={!canConsultOracle()} style={{ background: canConsultOracle() ? COLORS.accent : COLORS.border, border: 'none', ...pixelBorder(canConsultOracle() ? COLORS.accent : COLORS.border, 4), padding: '14px 28px', fontFamily: PIXEL_FONT, fontSize: '10px', color: canConsultOracle() ? COLORS.bg : COLORS.textMuted, cursor: canConsultOracle() ? 'pointer' : 'not-allowed', animation: canConsultOracle() ? 'gentlePulse 3s ease-in-out infinite' : 'none' }}>✨ Consulter l'Oracle ✨</button>
             
           {!canConsultOracle() && <div style={{ fontFamily: PIXEL_FONT, fontSize: '6px', color: COLORS.textMuted, marginTop: '10px' }}>{options.filter(o => o.name?.trim()).length < 2 ? 'Nomme au moins 2 options' : 'Complète toutes les questions'}</div>}
           </div>
          )}
        </>
      )}

      {/* ÉTAPE 2 : Oracle (en dessous des cartes) */}
      {currentStep >= 2 && oracleResult && (
        <div style={{ background: COLORS.bgCard, ...pixelBorder(oracleResult.isOffline ? COLORS.accent : COLORS.secondary, 4), padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.accent, textAlign: 'center', marginBottom: '12px', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>☆ L'ORACLE A PARLÉ ☆</div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '12px', color: COLORS.secondary, textAlign: 'center', marginBottom: '12px', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>→ {oracleResult.recommandation?.choix || 'Réflexion...'} ←</div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.text, lineHeight: '2.2', textAlign: 'center', marginBottom: '16px', maxWidth: '500px', margin: '0 auto 16px', whiteSpace: 'pre-line' }}>{oracleResult.recommandation?.explication || ''}</div>
          
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => { setCurrentStep(3); setMaxStep(3); exportAll();}} style={{ background: COLORS.secondary, border: 'none', ...pixelBorder(COLORS.secondary, 3), padding: '10px 20px', fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.bg, cursor: 'pointer' }}>🙏 Merci Oracle</button>
              
              
              
              
              
              
            </div>
          )}
        </div>
      )}
{/* BOUTON RETOUR */}
{currentStep > 1 && (
  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
    <button 
      onClick={() => setCurrentStep(currentStep - 1)} 
      style={{ 
        background: COLORS.border, 
        border: 'none', 
        ...pixelBorder(COLORS.border, 2), 
        padding: '8px 16px', 
        fontFamily: PIXEL_FONT, 
        fontSize: '7px', 
        color: COLORS.textMuted, 
        cursor: 'pointer' 
      }}
    >
      ◀ Retour
    </button>
  </div>
)}
      {/* ÉTAPE 3 : Feedback (en dessous de l'Oracle) */}
      {currentStep >= 3 && (
        <FeedbackInline 
          quest={feedbackQuest || { options, oracleResponse: oracleResult }}
          feedback={currentFeedback}
          onSubmit={(feedback) => {
            setCurrentFeedback(feedback);
            let newCompleted = completed;
            let newPending = pending;
            if (feedbackQuest) {
              const completedQuest = { ...feedbackQuest, feedback, completedDate: new Date().toISOString() };
              newCompleted = [completedQuest, ...completed].slice(0, 30);
              setCompleted(newCompleted);
              localStorage.setItem('questFinderCompleted', JSON.stringify(newCompleted));
              newPending = pending.filter(p => p.id !== feedbackQuest.id);
              setPending(newPending);
              localStorage.setItem('questFinderPending', JSON.stringify(newPending));
            }
            setCurrentStep(4);
            setMaxStep(4);
            saveToCloud(drafts, newPending, newCompleted);
          }}
          disabled={currentStep > 3}
        />
      )}

      {/* ÉTAPE 4 : Conclusion (figée) */}
      {currentStep >= 4 && currentFeedback && (
        <div style={{ background: COLORS.bgCard, ...pixelBorder(COLORS.primary, 4), padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '10px', color: COLORS.primary, textAlign: 'center', marginBottom: '12px', textShadow: `2px 2px 0 ${COLORS.shadow}` }}>✨ QUÊTE ACCOMPLIE ✨</div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.text, textAlign: 'center', marginBottom: '8px' }}>
            Tu as choisi : <span style={{ color: COLORS.secondary }}>{currentFeedback.chosenOption}</span>
            {currentFeedback.chosenOption === oracleResult?.recommandation?.choix ? ' (comme l\'Oracle)' : ' (ton propre chemin)'}
          </div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '20px', textAlign: 'center', marginBottom: '12px' }}>
            {currentFeedback.satisfaction === 'good' ? '😊' : currentFeedback.satisfaction === 'meh' ? '😐' : '😞'}
          </div>
          <div style={{ fontFamily: PIXEL_FONT, fontSize: '7px', color: COLORS.textMuted, textAlign: 'center', lineHeight: '2', maxWidth: '400px', margin: '0 auto 16px', whiteSpace: 'pre-line' }}>
            {(() => {
              const followedOracle = currentFeedback.chosenOption === oracleResult?.recommandation?.choix;
              const phrases = {
                good_followed: [
                  "Tu as écouté ton cœur et ça a payé.\nContinue à te faire confiance.",
                  "L'Oracle et toi étiez sur la même longueur d'onde.\nBien joué.",
                  "Ton instinct était aligné avec ce qui comptait.\nGarde cette écoute."
                ],
                good_own: [
                  "Tu as suivi ton propre chemin et c'était le bon.\nTon instinct te connaît.",
                  "Tu savais ce dont tu avais besoin.\nL'Oracle apprend de toi aussi.",
                  "Parfois le cœur voit ce que l'Oracle ne voit pas.\nBien joué."
                ],
                meh: [
                  "Parfois les choix ne sont ni bons ni mauvais — ils sont.\nL'important c'est d'avoir choisi.",
                  "Choisir c'est renoncer.\nLe \"bof\" fait partie du jeu.",
                  "Pas de regret, pas d'euphorie.\nC'est une donnée pour la prochaine fois."
                ],
                bad_followed: [
                  "Même les bons choix peuvent mal tourner.\nCe n'est pas ta faute.",
                  "L'Oracle n'est pas infaillible.\nLa prochaine fois on fera mieux ensemble.",
                  "Le résultat ne définit pas la qualité du choix.\nTu as fait de ton mieux."
                ],
                bad_own: [
                  "Tu as appris quelque chose.\nLa prochaine fois, tu sauras.",
                  "L'expérience est le meilleur professeur.\nCette quête t'a appris quelque chose.",
                  "Parfois il faut se tromper pour trouver son chemin.\nC'est fait maintenant."
                ]
              };
              let key = '';
              if (currentFeedback.satisfaction === 'good') key = followedOracle ? 'good_followed' : 'good_own';
              else if (currentFeedback.satisfaction === 'meh') key = 'meh';
              else key = followedOracle ? 'bad_followed' : 'bad_own';
              
              const options = phrases[key];
              return options[Math.floor(Math.random() * options.length)];
            })()}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button onClick={resetQuest} style={{ background: COLORS.primary, border: 'none', ...pixelBorder(COLORS.primary, 3), padding: '10px 20px', fontFamily: PIXEL_FONT, fontSize: '8px', color: COLORS.bg, cursor: 'pointer' }}>Nouvelle Quête →</button>
          </div>
        </div>
      )}

      {showJournal && <Journal drafts={drafts} pending={pending} completed={completed} onClose={() => setShowJournal(false)} onLoad={loadDraft} onDelete={deleteJournalEntry} onViewOracle={viewOracleFromHistory} onExport={exportAll} />}
    </div>
  );
}
