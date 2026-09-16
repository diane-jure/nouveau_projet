/**
 * CERVEAU — Oracle V4.
 *
 * Règle du fichier : AUCUN texte destiné à l'écran. Le cerveau ne produit
 * que des nombres et des codes ('pickGreat', 'avoidanceFear'…). Toute la
 * parole vivra ailleurs. On peut donc réécrire entièrement le ton de
 * l'oracle sans risquer de casser un calcul, et tester le calcul sans lire
 * un mot.
 *
 * Deux nombres par voie, et il faut les deux :
 *   pathPoints  la somme du vocabulaire détecté. Calculée une fois,
 *               jamais modifiée ensuite.
 *   pathScore   ce même nombre après les multiplicateurs des règles.
 *
 * Sans les deux, on ne peut pas distinguer « les mots étaient négatifs »
 * de « un ×2 a enfoncé un nombre déjà négatif ».
 */

import { lis } from './detecte.js';

// ── constantes ─────────────────────────────────────────────────────────────

export const CONSTANTES = {
  WEAK: 1,
  STRONG: 3,
  THRESHOLD: 3,
  BOOST: 2,      // multiplie
  REDUCE: 0.5,   // divise

  // Seuils de classement. Provisoires : ils sortiront des tests en labo.
  X: 3,          // score >= X            → greatPath
  Z: 3,          // score <= -Z           → poorPath

  /**
   * Valeur d'un mot quand sa famille s'écarte de WEAK / STRONG.
   *
   * achievements est descendu à 1,5 : la famille n'a qu'un seul niveau, et
   * les réponses Q2 sont des énumérations — « chill, joie, fun, détente »
   * faisait 12 points à 3 le mot, quand une Q3 nuancée en vaut 1. L'axe qui
   * devait peser le moins pesait quatre fois Q1 et seize fois Q3.
   *
   * L'écrasement s'applique à la famille entière, tous niveaux confondus.
   */
  POIDS: { achievements: 1.5 },
};

export const isHigh = (x, C = CONSTANTES) => x >= C.THRESHOLD;

const arrondi = (n) => Math.round(n * 100) / 100;

// ── signes ─────────────────────────────────────────────────────────────────

/**
 * Ce que vaut une famille dans une question donnée : +1, −1, ou 0 quand
 * elle ne marque pas de points (la peur, les drapeaux).
 *
 * En Q3, sparks et hooks s'inversent — « si tu ne le fais pas, tu
 * ressentirais de la joie » parle contre la voie, pas pour elle. La famille
 * injonction est la seule exception : elle reste un malus partout.
 */
function signe(o, question) {
  const { champ, famille } = o;
  if (champ === 'sparks') return question === 'Q3' ? -1 : +1;
  if (champ === 'hooks') {
    if (famille === 'injunctions') return -1;
    return question === 'Q3' ? +1 : -1;
  }
  if (question === 'Q1') {
    if (famille === 'desire') return +1;
    if (famille === 'indifference') return -1;
    return 0;                                   // fear : règles seulement
  }
  if (question === 'Q2') return +1;
  if (question === 'Q3') {
    if (famille === 'regret') return +1;
    if (famille === 'relief' || famille === 'trivial') return -1;
    return 0;                                   // irreversible, reversible, recurrence
  }
  return 0;
}

const valeur = (o, C) => {
  const base = C.POIDS?.[o.famille]
    ?? (o.niveau === 'strong' ? C.STRONG : o.niveau === 'weak' ? C.WEAK : 0);
  return base * o.facteur * (o.inverse ? -1 : 1);
};

/** Somme d'une famille précise, en valeur absolue de son axe (sans son signe). */
const sommeFamille = (occ, famille, C) =>
  arrondi(occ.filter((o) => o.famille === famille).reduce((s, o) => s + valeur(o, C), 0));

// ── lecture d'une question ─────────────────────────────────────────────────

function question(texte, q, contexte, C) {
  const { contenu } = lis(texte, q, contexte, C);
  const points = arrondi(contenu.reduce((s, o) => s + signe(o, q) * valeur(o, C), 0));
  return { q, texte, occurrences: contenu, points };
}

// ── une voie ───────────────────────────────────────────────────────────────

/**
 * Note une voie. `voie` porte { nom, q1, q2, q3, drain, loot }.
 * `contexte` porte { HP, scope }.
 */
export function evalueVoie(voie, contexte = {}, C = CONSTANTES) {
  const HP = contexte.HP ?? 3;
  const ctx = { HP };

  const champs = [
    question([voie.nom, voie.q1].filter(Boolean).join(' . '), 'Q1', ctx, C),
    question(voie.q2, 'Q2', ctx, C),
    question(voie.q3, 'Q3', ctx, C),
  ];
  const [Q1, Q2, Q3] = champs;
  const toutes = champs.flatMap((c) => c.occurrences);

  // ── drapeaux et compteurs dont les règles ont besoin
  const drapeau = (famille) => Q3.occurrences.some((o) => o.famille === famille);
  const irreversible = drapeau('irreversible');
  const reversible = drapeau('reversible');
  const recurrence = drapeau('recurrence');
  const damage = toutes.some((o) => o.champ === 'hooks' && o.famille === 'damage');

  const q1Fear = sommeFamille(Q1.occurrences, 'fear', C);
  const q3Regret = sommeFamille(Q3.occurrences, 'regret', C);
  const q3Relief = sommeFamille(Q3.occurrences, 'relief', C);

  // ── portée : elle agit sur Q3 AVANT la somme, sinon elle arrive trop tard
  let scope = contexte.scope ?? 'maybe';
  if (recurrence) scope = 'yes';
  let q3Points = Q3.points;
  if (scope === 'yes') q3Points = arrondi(q3Points * C.BOOST);
  else if (scope === 'no') q3Points = arrondi(q3Points * C.REDUCE);

  // ── ressources
  const drain = Number(voie.drain) || 0;
  const loot = Number(voie.loot) || 0;
  const coutRessources = (drain > HP ? -drain : 0) + loot;

  const pathPoints = arrondi(Q1.points + Q2.points + q3Points + coutRessources);

  // ── règles : elles multiplient pathScore, jamais pathPoints
  let pathScore = pathPoints;
  const tags = [];
  const declenche = (cle, facteur, mots = []) => {
    pathScore = arrondi(pathScore * facteur);
    tags.push({ cle, facteur, mots });
  };
  const motsDe = (occ, famille) =>
    occ.filter((o) => o.famille === famille).map((o) => o.mot);

  if (isHigh(q1Fear, C) && isHigh(q3Regret, C)) {
    declenche('avoidanceFear', C.BOOST,
      [...motsDe(Q1.occurrences, 'fear'), ...motsDe(Q3.occurrences, 'regret')]);
  }
  if (isHigh(q1Fear, C) && q3Regret <= 0) {
    declenche('protectiveFear', C.REDUCE, motsDe(Q1.occurrences, 'fear'));
  }
  if (damage && (isHigh(Q1.points, C) || isHigh(q3Regret, C) || irreversible)) {
    declenche('heartOverBody', C.BOOST,
      toutes.filter((o) => o.famille === 'damage').map((o) => o.mot));
  }
  if (damage && (!isHigh(Q1.points, C) || isHigh(q3Relief, C) || reversible)) {
    declenche('bodyWisdom', C.REDUCE,
      toutes.filter((o) => o.famille === 'damage').map((o) => o.mot));
  }
  if (irreversible) declenche('irreversible', C.BOOST, motsDe(Q3.occurrences, 'irreversible'));
  if (reversible) declenche('reversible', C.REDUCE, motsDe(Q3.occurrences, 'reversible'));

  // ── classement
  const rang = pathScore >= C.X ? 'greatPath' : pathScore <= -C.Z ? 'poorPath' : 'fairPath';

  // ── tags de vocabulaire, pour la parole : chacun porte son mot déclencheur
  const tagsVocabulaire = toutes.map((o) => ({
    champ: o.champ, famille: o.famille, niveau: o.niveau,
    mot: o.mot, facteur: o.facteur, inverse: o.inverse,
  }));

  return {
    nom: voie.nom,
    pathPoints,
    pathScore,
    rang,
    detail: {
      Q1: Q1.points, Q2: Q2.points, Q3: Q3.points, q3Points,
      q1Fear, q3Regret, q3Relief,
      drain, loot, coutRessources,
      irreversible, reversible, recurrence, damage, scope,
    },
    tags,
    tagsVocabulaire,
    occurrences: toutes,
  };
}

// ── un dilemme ─────────────────────────────────────────────────────────────

/** Le mot de Q0 tel qu'il a été tapé → 'yes' | 'maybe' | 'no'. */
export function porteeDe(q0, C = CONSTANTES) {
  const { contenu } = lis(q0 ?? '', 'Q0', {}, C);
  const f = contenu.find((o) => o.champ === 'Q0');
  if (!f) return 'maybe';
  return f.famille === 'oui' ? 'yes' : f.famille === 'non' ? 'no' : 'maybe';
}

/**
 * Consulte l'oracle. Rend un classement, un type de verdict et des tags.
 * Jamais de texte.
 */
export function consulte(dilemme, C = CONSTANTES) {
  const HP = Number(dilemme.HP) || 3;
  const scope = dilemme.scope ?? porteeDe(dilemme.q0, C);

  const voies = (dilemme.voies ?? []).filter((v) => (v.nom ?? '').trim());
  if (voies.length < 2) return null;

  const evaluees = voies.map((v) => evalueVoie(v, { HP, scope }, C));
  const classement = [...evaluees].sort((a, b) => b.pathScore - a.pathScore);

  const par = (r) => classement.filter((v) => v.rang === r);
  const great = par('greatPath'), fair = par('fairPath'), poor = par('poorPath');

  const tirage = (lot) => (scope === 'yes' ? 'shuffleCards' : 'shuffleCoin');
  const toutesTriviales = evaluees.every((v) =>
    v.occurrences.some((o) => o.famille === 'trivial'));

  let type, lot;
  if (scope === 'no' && toutesTriviales) { type = 'shuffleCoin'; lot = classement; }
  else if (great.length) {
    lot = great;
    type = great.length > 1 ? tirage(great) : 'pickGreat';
  } else if (fair.length && poor.length) {
    lot = fair;
    type = fair.length > 1 ? tirage(fair) : 'pickFair';
  } else if (fair.length) { type = 'shuffleCoin'; lot = fair; }
  else { type = 'pickNone'; lot = []; }

  const gagnante = type === 'pickNone' ? null : (lot[0] ?? classement[0]);
  const ecart = classement.length > 1
    ? arrondi(classement[0].pathScore - classement[1].pathScore) : 0;

  return {
    scope, HP, type, classement, gagnante, exaequo: lot, ecart,
    tags: [...new Set(classement.flatMap((v) => v.tags.map((t) => t.cle)))],
  };
}

/** Tirage au sort parmi les ex aequo. `alea` injectable pour les tests. */
export function tireAuSort(verdict, alea = Math.random) {
  const lot = verdict.exaequo?.length ? verdict.exaequo : verdict.classement;
  return lot[Math.floor(alea() * lot.length)];
}
