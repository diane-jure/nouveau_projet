## Oracle V2 (jan 2026)

```
const analyzeWithOracleV2 = (options, spoons) => {

const validOptions = options.filter(opt => opt.name && opt.name.trim());

const analyses = validOptions.map(opt => {

const q1 = (opt.q1 || '').toLowerCase();

const q2 = (opt.q2 || '').toLowerCase();

const q3 = (opt.q3 || '').toLowerCase();

const q4 = (opt.q4 || '').toLowerCase();

let score = 0;

let signals = { niveau1: [], niveau2: [], niveau3: [], niveau4: [] };

// === NIVEAU 1 : SIGNAUX ULTRA-FORTS (±5) ===

if (q2.includes('mega fiere') || q2.includes('fiere') || q2.includes('fierte')) {

score += 5; signals.niveau1.push({ type: 'green', text: 'mega fierté si fait' });

}

if (q2.includes('s\'amuse de fou') || q2.includes('kiffe grave') || q2.includes('adore')) {

score += 5; signals.niveau1.push({ type: 'green', text: 's\'amuse de fou' });

}

if (q2.includes('a fond') || q1.includes('excit') || q1.includes('hate')) {

score += 5; signals.niveau1.push({ type: 'green', text: 'excitation forte' });

}

if (q3.includes('honteu') || q3.includes('degout') || q3.includes('fache') || q3.includes('nulle')) {

score += 4; signals.niveau1.push({ type: 'green', text: 'regret massif si pas fait' });

}

if (q3.includes('trop deg') || q3.includes('triste')) {

score += 4; signals.niveau1.push({ type: 'green', text: 'regret fort si pas fait' });

}

if (q1.includes('angoisse') || q1.includes('peur') || q1.includes('panique')) {

score -= 5; signals.niveau1.push({ type: 'red', text: 'alerte corporelle forte' });

}

if (q1.includes('oppresse') || q1.includes('noeud au ventre')) {

score -= 5; signals.niveau1.push({ type: 'red', text: 'résistance corporelle' });

}

// === NIVEAU 2 : SIGNAUX FORTS CONTEXTUELS (±3) ===

const hasFlemme = q1.includes('flemme');

if (hasFlemme) {

const vraiResistance = q1.includes('peur de m\'ennuyer') || q1.includes('ca me soule') ||

q3.includes('change rien') || q3.includes('un poil coupable') ||

q4.includes('au pire c\'est pas grave') || q4.includes('je m\'en fous');

const inertie = signals.niveau1.some(s => s.type === 'green') ||

q3.includes('honteu') || q3.includes('degout') || q3.includes('fache');

if (vraiResistance && !inertie) {

score -= 3; signals.niveau2.push({ type: 'red', text: 'vraie résistance (flemme)' });

} else if (inertie) {

score -= 1; signals.niveau2.push({ type: 'orange', text: 'inertie (ignorable)' });

} else {

score -= 2; signals.niveau2.push({ type: 'orange', text: 'flemme neutre' });

}

}

// Soulagement si pas fait (Q3) → NE PAS FAIRE

if (q3.includes('soulage') || q3.includes('tranquille') || q3.includes('ouf ') || q3.includes('repos')) {

score -= 4; signals.niveau2.push({ type: 'red', text: 'soulagement si pas fait' });

}

// Pression sociale (Q3) - HAMEÇON ≠ vrai regret

if (q3.includes('gene') || q3.includes('awkward') || q3.includes('ils vont') || q3.includes('vont penser') || q3.includes('je les verrai')) {

score -= 3; signals.niveau2.push({ type: 'red', text: 'pression sociale (hameçon)' });

}

// Culpabilité

if (q3.includes('coupable') || q3.includes('honte')) {

if (!q3.includes('un poil coupable')) {

score -= 3; signals.niveau2.push({ type: 'red', text: 'culpabilité (hameçon)' });

}

}

if (q1.includes('je devrais') || q1.includes('il faut que') || q1.includes('obligation')) {

score -= 3; signals.niveau2.push({ type: 'red', text: 'obligation déguisée' });

}

if (q4.includes('procrastin')) {

signals.niveau2.push({ type: 'neutral', text: 'pattern procrastination' });

}

if (q4.includes('ca traine') || q4.includes('encore trainer')) {

signals.niveau2.push({ type: 'neutral', text: 'traîne depuis longtemps' });

}

// === NIVEAU 3 : SIGNAUX MODÉRÉS (±2) ===

if (q1.includes('why not') || q1.includes('pourquoi pas') || q1.includes('ca pourrait')) {

score += 2; signals.niveau3.push({ type: 'green', text: 'approche modérée' });

}

if (q1.includes('curieu') || q1.includes('interesse')) {

score += 2; signals.niveau3.push({ type: 'green', text: 'curiosité' });

}

if (q3.includes('dommage') || q3.includes('maybe deg')) {

score += 2; signals.niveau3.push({ type: 'green', text: 'regret modéré' });

}

if (q1.includes('bof') || q1.includes('mouais') || q1.includes('meh')) {

score -= 2; signals.niveau3.push({ type: 'orange', text: 'résistance modérée' });

}

if (q1.includes('pas envie') && !hasFlemme) {

score -= 2; signals.niveau3.push({ type: 'orange', text: 'pas envie' });

}

if (q3.includes('change rien') || q3.includes('rien de special')) {

score -= 3; signals.niveau3.push({ type: 'red', text: 'aucun regret' });

}

if (q3.includes('je m\'en fous') || q3.includes('osef') || q3.includes('m\'en fiche')) {

score -= 2; signals.niveau3.push({ type: 'orange', text: 'importance nulle' });

}

if (q2.includes('passer le temps') || q2.includes('en attendant')) {

score -= 1; signals.niveau3.push({ type: 'orange', text: 'tuer le temps' });

}

// === RELATIVISATION ===

const hasRelativisation = q4.includes('au pire') || q4.includes('pas la fin du monde') ||

q4.includes('osef') || q4.includes('je m\'en fous');

if (hasRelativisation) {

score = score / 2;

signals.niveau3.push({ type: 'neutral', text: 'relativisation (poids divisé)' });

}

// === NIVEAU 4 : COÛT ÉNERGÉTIQUE ===

const cost = parseInt(opt.cost) || 0;

const energyGain = parseInt(opt.energyGain) || 0;

const netCost = cost - energyGain;

const energyDeficit = netCost - spoons;

const energyRatio = spoons > 0 ? netCost / spoons : 999;

const hasNiveau1Strong = signals.niveau1.length > 0;

if (!hasNiveau1Strong && energyDeficit > 0) {

if (energyRatio >= 2) {

score -= 3; signals.niveau4.push({ type: 'red', text: `dépassement 100%+ (${energyDeficit} cuillères)` });

} else if (energyRatio >= 1.5) {

score -= 2; signals.niveau4.push({ type: 'orange', text: `dépassement 50%+ (${energyDeficit} cuillères)` });

} else {

score -= 1; signals.niveau4.push({ type: 'orange', text: `léger dépassement (${energyDeficit})` });

}

} else if (hasNiveau1Strong && energyDeficit > 0) {

signals.niveau4.push({ type: 'neutral', text: 'dépassement noté mais valeur forte' });

}

return {

option: opt,

score: Math.round(score * 10) / 10,

signals,

cost: netCost,

energyDeficit

};

});

// Tri et détermination

analyses.sort((a, b) => b.score - a.score);

const best = analyses[0];

const worst = analyses[analyses.length - 1];

const scoreDiff = best ? (best.score - (worst?.score || 0)) : 0;

const allWeak = analyses.every(a => a.score < 0);

// Générer texte explicatif pour fallback (ton Oracle épique)

let fallbackText = '';

let caseType = 'unclear';

let recommendedChoice = best?.option?.name || 'Aucune';

// Trouver le moins coûteux et celui avec le plus de potentiel

const cheapest = analyses.reduce((a, b) => a.cost < b.cost ? a : b);

const bestGain = analyses.reduce((a, b) => (parseInt(a.option.energyGain) || 0) > (parseInt(b.option.energyGain) || 0) ? a : b);

if (scoreDiff >= 5 && !allWeak) {

caseType = 'clear';

const hasGreenSignal = best.signals.niveau1.some(s => s.type === 'green');

const hasRedOnWorst = worst?.signals.niveau1.some(s => s.type === 'red') ||

worst?.signals.niveau2.some(s => s.type === 'red');

if (hasGreenSignal) {

fallbackText = `Ton instinct est clair — ${best.option.name} te fait vibrer.`;

if (hasRedOnWorst) {

fallbackText += `\n${worst.option.name} te tire vers le bas.`;

}

fallbackText += `\nFais-toi confiance.`;

} else {

fallbackText = `${best.option.name} te fait respirer, ${worst?.option?.name || 'l\'autre'} te pèse.\nÉcoute ton corps.`;

}

} else if (!allWeak) {

caseType = 'dilemma';

const hasEnergyConflict = best && best.energyDeficit > 2 && best.signals.niveau1.length > 0;

if (hasEnergyConflict) {

fallbackText = `Ton corps est à plat mais ton cœur veut y être.\nLa fatigue de demain est réelle — vaut-elle ce qui se joue aujourd'hui ?`;

} else {

// Comparer coût vs gain

if (cheapest.option.name !== bestGain.option.name && (parseInt(bestGain.option.energyGain) || 0) > 0) {

fallbackText = `Les deux options se valent.\n${cheapest.option.name} te coûte moins, ${bestGain.option.name} peut t'apporter plus.`;

recommendedChoice = 'Pile ou face';

} else {

fallbackText = `Les deux options se valent.\n${cheapest.option.name} te coûte moins — commence par là si tu hésites.`;

recommendedChoice = cheapest.option.name;

}

}

} else {

caseType = 'allWeak';

// Vérifier si vraiment aucune n'attire ou si c'est juste de la flemme des deux côtés

const allHaveFlemme = analyses.every(a =>

a.signals.niveau2.some(s => s.text.includes('flemme')) ||

a.signals.niveau3.some(s => s.text.includes('flemme'))

);

if (allHaveFlemme) {

fallbackText = `Flemme des deux côtés — c'est peut-être pas le moment.\nSi tu dois choisir, ${cheapest.option.name} te coûtera le moins.`;

recommendedChoice = 'Ni l\'un ni l\'autre';

} else {

fallbackText = `Aucune option ne t'appelle vraiment.\nC'est peut-être le signe que tu as besoin d'autre chose.`;

recommendedChoice = 'Ni l\'un ni l\'autre';

}

}

return {

analyses,

best,

worst,

scoreDiff,

allWeak,

caseType,

fallbackRecommendation: {

choix: recommendedChoice,

explication: fallbackText

}

};

};
```