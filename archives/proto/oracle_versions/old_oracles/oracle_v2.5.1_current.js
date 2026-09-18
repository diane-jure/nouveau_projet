// ============================================================================
// ORACLE V2.5.1
// Moteur d'analyse local (mots-clés) pour Quest Finder.
// Pas d'appel LLM : tout se joue sur les réponses q0/q1/q2/q3 saisies.
//
// Depuis la 2.5 :
// - le verrou Q0 s'applique après l'analyse, plus à la place
// - « peut-être » est un niveau à part, il ne compte plus comme un oui
// - coût et récupération séparés : le déficit se mesure sur le coût brut
// - rawCost / rawGain portés par chaque analyse (gainDiff ne vaut plus NaN)
// - les catégories de phrases derrière isDifferent sont redevenues joignables
// ============================================================================

export const analyzeWithOracleV2_5 = (options, spoons, q0Response = '') => {
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
    "j'aurais regret", "je regretterais"
  ].some(w => q0.includes(w));

  // Le « peut-être » est un niveau à part entière, pas un oui timide. Ces mots
  // vivaient dans la liste important : hésiter revenait donc à dire « oui,
  // carrément », et déclenchait les branches réservées aux enjeux réels.
  const q0_maybe = [
    "peut-être", "peut etre", "peut-etre", "pas sûre", "pas sure",
    "ça dépend", "ca depend", "ça pourrait", "ca pourrait", "possiblement"
  ].some(w => q0.includes(w));

  // « Dans 10 jours, ça compte ? » — non : le verdict sera pile ou face.
  // On analyse quand même les voies avant de trancher, pour deux raisons :
  // la phrase « untel t'apporterait un peu plus » a besoin des gains, et une
  // quête sauvegardée avec analyses: [] n'est plus relisible ensuite.
  // Un doute explicite l'emporte sur les deux autres listes : « peut-être que
  // ça compte » est une hésitation, pas une affirmation.
  const q0Verrou = q0_notImportant && !q0_important && !q0_maybe;
  const q0Importance = q0Verrou ? 'low' : (q0_maybe ? 'medium' : (q0_important ? 'high' : 'medium'));

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
// Coût et récupération sont séparés : ce que la voie demande maintenant n'est
// pas financé par ce qu'elle rendra après. Le dépassement se mesure donc sur
// le coût brut, et le gain reste un signal à part.
const energyDeficit = cost - spoons;
const energyRatio = spoons > 0 ? cost / spoons : 999;
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
  rawCost: cost,        // ce que la voie coûte vraiment, avant déduction du gain
  rawGain: energyGain,  // ce qu'elle rend
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
// « te coûte moins » parle du coût brut : une voie à 5 qui rend 4 coûte
// toujours 5 à payer. Comparer les coûts nets désignait la voie la plus chère.
const cheapest = analyses.reduce((a, b) => a.rawCost < b.rawCost ? a : b);
const bestGain = analyses.reduce((a, b) => a.rawGain > b.rawGain ? a : b);
// Écarts entre les deux meilleures valeurs, pas entre les deux premières du
// classement par score : c'est bien l'avantage en énergie qu'on veut nommer.
const parGain = analyses.map(a => a.rawGain).sort((x, y) => y - x);
const parCout = analyses.map(a => a.rawCost).sort((x, y) => x - y);
const gainDiff = parGain.length >= 2 ? parGain[0] - parGain[1] : 0;
const coutDiff = parCout.length >= 2 ? parCout[1] - parCout[0] : 0;
// Littéralement 0/0 partout : aucune voie ne coûte ni ne rapporte quoi que ce
// soit. L'énergie n'a alors rien à dire, ni en écart ni en valeur.
const sansEnergie = analyses.length > 0 && analyses.every(a => a.rawCost === 0 && a.rawGain === 0);

if (q0Verrou) {
// Le verrou Q0 court-circuite tout : si ça ne comptera pas dans dix jours,
// aucun écart de score ne mérite qu'on tranche à sa place.
caseType = 'pileouface';
recommendedChoice = 'Pile ou face';
fallbackText = _getPileOuFacePhrase('low', gainDiff, bestGain?.option?.name || '', analyses);
globalTags = [...new Set([...globalTags, 'q0_low'])];
} else if (scoreDiff >= 5 && !allWeak) {
caseType = 'clear';
const hasGreenSignal = best.signals.niveau1.some(s => s.type === 'green');
const hasRedOnWorst = worst?.signals.niveau1.some(s => s.type === 'red') ||
  worst?.signals.niveau2.some(s => s.type === 'red');
fallbackText = _getClearPhrase(best, worst, globalTags, hasGreenSignal, hasRedOnWorst, analyses);
} else if (!allWeak) {
caseType = 'dilemma';
const hasEnergyConflict = best && best.energyDeficit > 2 && best.signals.niveau1.length > 0;
if (hasEnergyConflict) {
  fallbackText = _getDilemmaEnergyPhrase();
} else {
  const verdict = _getDilemmaPhrase(best, worst, cheapest, bestGain, globalTags, q0Importance, gainDiff, coutDiff, sansEnergie, analyses);
  if (verdict.pileOuFace) {
    // Rien ne coûte, rien ne rapporte, et le texte ne tranche pas non plus.
    caseType = 'pileouface';
    recommendedChoice = 'Pile ou face';
    fallbackText = _getPileOuFacePhrase('medium', gainDiff, bestGain?.option?.name || '', analyses);
  } else {
    fallbackText = verdict.texte;
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

// ---------------------------------------------------------------------------
// NOMMER LES RIVALES
// « l'autre » ne désigne personne dès qu'il y a trois voies, et « les deux »
// devient faux. La rivale qui compte est la dauphine — celle qui talonne au
// score — et non la dernière, qui n'est plus en lice.
// ---------------------------------------------------------------------------

// La dauphine : deuxième au score. C'est elle que l'Oracle doit citer.
const _dauphine = (analyses) => analyses?.[1]?.option?.name || '';

// « Les deux » à deux voies, « X et Y » dès trois : on nomme les deux
// premières, les seules encore en lice.
const _tete = (analyses, majuscule = true) => {
  const a = analyses?.[0]?.option?.name, b = analyses?.[1]?.option?.name;
  if (!analyses || analyses.length <= 2 || !a || !b) return majuscule ? 'Les deux' : 'les deux';
  return `${a} et ${b}`;
};

// « l'autre » / « les autres », avec l'accord du verbe qui suit.
const _lAutre = (analyses) => (analyses?.length > 2 ? 'les autres' : "l'autre");
const _accord = (analyses, singulier, pluriel) => (analyses?.length > 2 ? pluriel : singulier);

function _getClearPhrase(best, worst, tags, hasGreenSignal, hasRedOnWorst, analyses) {
const optionName = best.option.name;
// À deux voies, la dernière au score EST la rivale. À trois ou plus, la
// rivale qui compte est la dauphine, pas la lanterne rouge.
const worstName = (analyses?.length > 2 ? _dauphine(analyses) : worst?.option?.name) || worst?.option?.name;

if (tags.includes('creativite')) {
return [`Ton cœur a déjà choisi — ${optionName} nourrit quelque chose en toi que ${_lAutre(analyses)} ${_accord(analyses, 'ne peut', 'ne peuvent')} pas toucher.\nFais-toi confiance.`,
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
return [`Ton corps a dit non avant même que tu finisses de poser la question.\n${optionName} te laisse respirer — ${worstName || _lAutre(analyses)} te comprime.`,
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

// Renvoie { texte } ou { pileOuFace: true } : le cas « rien ne coûte, rien ne
// rapporte » change le verdict, pas seulement la phrase.
function _getDilemmaPhrase(best, worst, cheapest, bestGain, tags, q0Importance, gainDiff = 0, coutDiff = 0, sansEnergie = false, analyses = []) {
const cheapName = cheapest.option.name;
const bestGainName = bestGain.option.name;
const isDifferent = cheapest.option.name !== bestGain.option.name;

// L'ordre compte : les catégories de sens passent avant l'arbitrage
// comptable. Rangées derrière, elles étaient inatteignables — isDifferent et
// !isDifferent couvrant tous les cas, rien ne lisait jamais les tags.

// Deux vraies envies
if (tags.includes('excitation') || tags.includes('regret_fort')) {
// Le conseil de coût ne vaut que si la voie la moins chère est l'une des
// deux nommées. Sinon la phrase désignait deux voies puis en conseillait
// une troisième.
const cheapEnTete = analyses.slice(0, 2).some(a => a.option.name === cheapName);
const variantes = [
  `Deux vraies envies, pas de mauvais choix.\nTon corps penchera vers ${best.option.name} ou ${_dauphine(analyses) || "l'autre"} au moment de bouger — fais-lui confiance.`
];
if (cheapEnTete) {
  variantes.unshift(`${_tete(analyses)} t'appellent pour de vraies raisons.\n${cheapName} te coûte moins — commence par là si tu dois choisir.`);
} else {
  variantes.unshift(`${_tete(analyses)} t'appellent pour de vraies raisons.\nAucune des deux n'est un mauvais choix — c'est déjà une réponse.`);
}
return { texte: variantes[Math.floor(Math.random() * variantes.length)] };
}

// Flemme des deux côtés, mais la décision compte
if (q0Importance === 'high' && (tags.includes('flemme_neutre') || tags.includes('flemme_resistance'))) {
return { texte: [`Ni l'une ni l'autre ne t'appelle vraiment — mais la décision compte.\nNomme ce qui te retient vraiment, pas ce qui est pratique.`,
  `La flemme parle pour ${_tete(analyses, false)}. Mais quelque chose d'important attend.\nQu'est-ce que tu veux vraiment, sous la fatigue ?`
][Math.floor(Math.random() * 2)] };
}

// Vrai dilemme coût vs gain : économiser ici, investir là
if (isDifferent) {
return { texte: [
  `${cheapName} te coûte moins — mais ${bestGainName} peut t'apporter plus.\nÀ toi de voir ce qui compte aujourd'hui.`,
  `Deux logiques s'affrontent : économiser avec ${cheapName}, ou investir dans ${bestGainName}.\nNi l'une ni l'autre n'a tort.`
][Math.floor(Math.random() * 2)] };
}

// Même voie sur les deux tableaux — à condition qu'il y ait un écart réel.
// Sans ce garde-fou, deux voies à 0/0 déclenchaient « te coûte moins et
// t'apporte plus », ce qui était faux.
if (coutDiff > 0 || gainDiff > 0) {
return { texte: [
  `${cheapName} te coûte moins et t'apporte plus — la question est déjà répondue.\nFais-toi confiance.`,
  `Ton corps et ton énergie pointent vers ${cheapName}${_dauphine(analyses) ? `, pas vers ${_dauphine(analyses)}` : ''}.\nPas besoin de chercher plus loin.`
][Math.floor(Math.random() * 2)] };
}

// Plus rien ne départage. Deux cas, et l'ancienne phrase mentait dans les deux
// puisqu'elle disait « te coûte moins » alors que les coûts sont égaux.

// Littéralement 0/0 : rien ne coûte, rien ne rapporte. Pile ou face.
if (sansEnergie) return { pileOuFace: true };

// Égalité de valeurs sans être nulles : l'énergie dit la même chose des deux
// côtés, donc on renvoie au texte.
// TODO phrases : formulation à revoir dans oracle_phrases.
return { texte: [
  `Ni le coût ni le gain ne vous départagent.\nRelis ce que tu as écrit — c'est là que ça se joue.`,
  `L'énergie dit la même chose des deux côtés.\nCe qui tranche est dans tes mots, pas dans les chiffres.`
][Math.floor(Math.random() * 2)] };
}

function _getPileOuFacePhrase(level, gainDiff = 0, bestGainName = '', analyses = []) {
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
`${_tete(analyses)} se valent — ton corps ne tranche pas.\nPile ou face, et fais-toi confiance sur l'exécution.`,
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
// EXPORT SCORING — détail exploitable pour l'export réimportable
// ============================================================================

export const buildScoringExplanation = (analyses, spoons) => {
  return analyses.map(analysis => {
    const opt = analysis.option;
    const signals = analysis.signals;

    const n1 = signals.niveau1;
    const n2 = signals.niveau2;
    const n3 = signals.niveau3;
    const n4 = signals.niveau4;

    const netCost = parseInt(opt.cost) - (parseInt(opt.energyGain) || 0);
    const energyDeficit = (parseInt(opt.cost) || 0) - spoons;

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
        explanation: `coût ${opt.cost} | dispo ${spoons} = deficit ${energyDeficit} | récupération +${opt.energyGain || 0} (comptée à part, net ${netCost})`
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
