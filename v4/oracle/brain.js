/**
 * BRAIN — Oracle V4.
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

import { scan } from './scan.js';

// ── constantes ─────────────────────────────────────────────────────────────

export const WEAK = 1;
export const MODERATE = 1.5;
export const STRONG = 3;

export const THRESHOLD = 3;
export const BOOST = 2;      // multiplie
export const REDUCE = 0.5;   // divise

// Seuils de classement. Provisoires : ils sortiront des tests en labo.
export const X = 3;          // score >= X   → greatPath
export const Z = 3;          // score <= -Z  → poorPath

/** Un TOTAL dépasse-t-il le seuil ? Rien à voir avec le niveau d'un keyword. */
export const isHigh = (x) => x >= THRESHOLD;

// ── signes ─────────────────────────────────────────────────────────────────

/**
 * Ce que vaut une famille dans une question donnée : +1, −1, ou 0 quand
 * elle ne marque pas de points (la peur, les drapeaux).
 *
 * En Q3, sparks et hooks s'inversent — « si tu ne le fais pas, tu
 * ressentirais de la joie » parle contre la voie, pas pour elle. La famille
 * injonction est la seule exception : elle reste un malus partout.
 */
function sign(o, question) {
  const { field, family } = o;
  if (family === 'fear' && question === 'Q1') return 0;
  if (field === 'sparks') return question === 'Q3' ? -1 : +1;
  if (field === 'hooks') {
    if (family === 'injunctions') return -1;
    return question === 'Q3' ? +1 : -1;
  }
  if (question === 'Q1') {
    if (family === 'desire') return +1;
    if (family === 'indifference') return -1;
    return 0;
  }
  if (question === 'Q2') return +1;
  if (question === 'Q3') {
    if (family === 'regret') return +1;
    if (family === 'relief' || family === 'trivial') return -1;
    return 0;
  }
  return 0;
}

/**
 * Les points d'UN keyword. Le niveau vient du MD ; le facteur et
 * l'inversion viennent des modificateurs qui l'ont touché.
 */
const value = (o) => {
  const base = o.level === 'strong' ? STRONG
    : o.level === 'moderate' ? MODERATE
      : o.level === 'weak' ? WEAK
        : 0;                                    // flag : ne compte pas de points
  return base * o.factor * (o.inverted ? -1 : 1);
};

/** Somme d'une famille précise, en valeur absolue de son axe (sans son signe). */
const familySum = (occ, family) =>
  occ.filter((o) => o.family === family).reduce((s, o) => s + value(o), 0);

/** Les keywords d'une famille — symétrique de familySum, pour que l'oracle cite. */
const familyWords = (occ, family) =>
  occ.filter((o) => o.family === family).map((o) => o.keyword);

// ── lecture d'une question ─────────────────────────────────────────────────

function questionPoints(text, q, context) {
  const { content } = scan(text, q, context, { BOOST, REDUCE });
  const points = content.reduce((s, o) => s + sign(o, q) * value(o), 0);
  return { q, text, occurrences: content, points };
}

// ── une voie ───────────────────────────────────────────────────────────────

/**
 * Note une voie. `path` porte { name, q1, q2, q3, drain, loot }.
 * `context` porte { HP, scope }.
 */
export function evaluatePath(path, context = {}) {
  const HP = context.HP ?? 3;
  const ctx = { HP };

  const fields = [
    questionPoints([path.name, path.q1].filter(Boolean).join(' . '), 'Q1', ctx),
    questionPoints(path.q2, 'Q2', ctx),
    questionPoints(path.q3, 'Q3', ctx),
  ];
  const [Q1, Q2, Q3] = fields;
  const all = fields.flatMap((c) => c.occurrences);

  // ── drapeaux et compteurs dont les règles ont besoin
  const flag = (family) => Q3.occurrences.some((o) => o.family === family);
  const irreversible = flag('irreversible');
  const reversible = flag('reversible');
  const recurrence = flag('recurrence');
  const damage = all.some((o) => o.family === 'damage');

  const q1Fear = familySum(Q1.occurrences, 'fear');
  const q3Regret = familySum(Q3.occurrences, 'regret');
  const q3Relief = familySum(Q3.occurrences, 'relief');

  // ── portée : elle agit sur Q3 AVANT la somme, sinon elle arrive trop tard
  let scope = context.scope ?? 'maybe';
  if (recurrence) scope = 'yes';
  let q3Points = Q3.points;
  if (scope === 'yes') q3Points = q3Points * BOOST;
  else if (scope === 'no') q3Points = q3Points * REDUCE;

  // ── ressources
  //
  // ⚠️ Cette ligne additionne des PV et des gemmes, et verse le résultat
  // dans un total de points de vocabulaire. Trois devises. C'est le problème
  // du loot, laissé intact ici pour que le renommage ne change aucun chiffre.
  const drain = Number(path.drain) || 0;
  const loot = Number(path.loot) || 0;
  const resources = (drain > HP ? -drain : 0) + loot;

  const pathPoints = Q1.points + Q2.points + q3Points + resources;

  // ── règles : elles multiplient pathScore, jamais pathPoints
  let pathScore = pathPoints;
  const tags = [];
  const fireRule = (key, factor, keywords = []) => {
    pathScore = pathScore * factor;
    tags.push({ key, factor, keywords });
  };

  if (isHigh(q1Fear) && isHigh(q3Regret)) {
    fireRule('avoidanceFear', BOOST,
      [...familyWords(Q1.occurrences, 'fear'), ...familyWords(Q3.occurrences, 'regret')]);
  }
  if (isHigh(q1Fear) && q3Regret <= 0) {
    fireRule('protectiveFear', REDUCE, familyWords(Q1.occurrences, 'fear'));
  }
  if (damage && isHigh(Q1.points) && (isHigh(q3Regret) || irreversible)) {
    fireRule('heartOverBody', BOOST, familyWords(all, 'damage'));
  }
  if (damage && !isHigh(Q1.points) && (isHigh(q3Relief) || reversible)) {
    fireRule('bodyWisdom', REDUCE, familyWords(all, 'damage'));
  }
  if (irreversible) fireRule('irreversible', BOOST, familyWords(Q3.occurrences, 'irreversible'));
  if (reversible) fireRule('reversible', REDUCE, familyWords(Q3.occurrences, 'reversible'));

  // ── classement
  const pathRank = pathScore >= X ? 'greatPath' : pathScore <= -Z ? 'poorPath' : 'fairPath';

  // ── tags de vocabulaire, pour la parole : chacun porte son keyword déclencheur
  const keywordTags = all.map((o) => ({
    field: o.field, family: o.family, level: o.level,
    keyword: o.keyword, factor: o.factor, inverted: o.inverted,
  }));

  return {
    name: path.name,
    pathPoints,
    pathScore,
    pathRank,
    detail: {
      Q1: Q1.points, Q2: Q2.points, Q3: Q3.points, q3Points,
      q1Fear, q3Regret, q3Relief,
      drain, loot, resources,
      irreversible, reversible, recurrence, damage, scope,
    },
    tags,
    keywordTags,
    occurrences: all,
  };
}

// ── un dilemme ─────────────────────────────────────────────────────────────

/** Le mot de Q0 tel qu'il a été tapé → 'yes' | 'maybe' | 'no'. */
export function readScope(q0) {
  const { content } = scan(q0 ?? '', 'Q0', {}, { BOOST, REDUCE });
  const f = content.find((o) => o.field === 'Q0');
  if (!f) return 'maybe';
  return f.family === 'oui' ? 'yes' : f.family === 'non' ? 'no' : 'maybe';
}

/**
 * Consulte l'oracle. Rend un classement, un type de verdict et des tags.
 * Jamais de texte.
 */
export function askOracle(dilemma) {
  const HP = Number(dilemma.HP) || 3;
  const scope = dilemma.scope ?? readScope(dilemma.q0);

  const paths = (dilemma.paths ?? []).filter((p) => (p.name ?? '').trim());
  if (paths.length < 2) return null;

  const scored = paths.map((p) => evaluatePath(p, { HP, scope }));
  const ranking = [...scored].sort((a, b) => b.pathScore - a.pathScore);

  const ranked = (r) => ranking.filter((p) => p.pathRank === r);
  const great = ranked('greatPath'), fair = ranked('fairPath'), poor = ranked('poorPath');

  const shuffleType = () => (scope === 'yes' ? 'shuffleCards' : 'shuffleCoin');
  const allTrivial = scored.every((p) =>
    p.occurrences.some((o) => o.family === 'trivial'));

  let verdictType, pool;
  if (scope === 'no' && allTrivial) { verdictType = 'shuffleCoin'; pool = ranking; }
  else if (great.length) {
    pool = great;
    verdictType = great.length > 1 ? shuffleType() : 'pickGreat';
  } else if (fair.length && poor.length) {
    pool = fair;
    verdictType = fair.length > 1 ? shuffleType() : 'pickNotPoor';
  } else if (fair.length) { verdictType = 'shuffleCoin'; pool = fair; }
  else { verdictType = 'pickNone'; pool = []; }

  const verdict = verdictType === 'pickNone' ? null : (pool[0] ?? ranking[0]);
  const margin = ranking.length > 1 ? ranking[0].pathScore - ranking[1].pathScore : 0;

  return {
    scope, HP, verdictType, ranking, verdict, tied: pool, margin,
    tags: [...new Set(ranking.flatMap((p) => p.tags.map((t) => t.key)))],
  };
}

/** Tirage au sort parmi les ex aequo. `random` injectable pour les tests. */
export function shuffle(oracleAnswer, random = Math.random) {
  const pool = oracleAnswer.tied?.length ? oracleAnswer.tied : oracleAnswer.ranking;
  return pool[Math.floor(random() * pool.length)];
}
