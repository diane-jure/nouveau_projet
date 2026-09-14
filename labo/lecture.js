/**
 * LECTURE — expérience : lire une réponse en texte libre et en déduire un cran
 * d'échelle, SANS LLM. Lexique + règles, rien d'autre.
 *
 * STATUT : expérimental. Ne fait pas partie de l'application.
 *
 * Principe : on ne cherche pas à "comprendre" la phrase. On y repère des
 * marqueurs affectifs, on en tire des valeurs numériques sur les mêmes axes
 * que les échelles, puis on choisit le cran le plus proche.
 *
 * Le lexique est volontairement écrit en vocabulaire français général, et non
 * comme un dictionnaire des phrases de l'historique : sinon la mesure ne
 * mesurerait que ma mémoire.
 */

const sansAccent = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Étire les lettres répétées : "aaaaah" -> "ah", et signale l'intensité. */
function normaliser(texte) {
  const brut = sansAccent(texte ?? '');
  const etire = /(.)\1{2,}/.test(brut);
  return { t: brut.replace(/(.)\1{2,}/g, '$1'), etire };
}

/* ------------------------------------------------------------------ */
/*  LEXIQUES                                                           */
/* ------------------------------------------------------------------ */

// Q1 — axe ENVIE
const ENVIE_PLUS = [
  'envie', 'cool', 'excit', 'enthousias', 'hate', 'fun', 'tente', 'motiv',
  'why not', 'pourquoi pas', 'j aimerais', 'jaimerais', 'aimerais bien',
  'partant', 'curieu', 'interess', 'plaisir', 'joie', 'sympa', 'chouette',
  'le sens bien', 'ca me dit',
];
const ENVIE_MOINS = [
  'flemme', 'pas envie', 'pas tres envie', 'rechigne', 'corvee', 'chiant',
  'lourd', 'trahir', 'fait beaucoup', 'saoul', 'marre', 'pff', 'pfff',
];
const NEUTRE = ['bof', 'mmh', 'mmmh', 'moyen', 'neutre', 'osef', 'sais pas', 'j sais pas'];

// Q1 — axe PEUR (indépendant de l'envie : les sentiments mêlés sont la norme)
const PEUR = [
  'peur', 'angoiss', 'anxiet', 'anxieu', 'stress', 'panique', 'trac',
  'apprehen', 'trouille', 'glace le sang', 'terrifi', 'flippe', 'redoute',
  'honte', 'honteu', 'coupable', 'culpabil', 'dur', 'difficile',
];

// Q2 — magnitude du gain
const GAIN = [
  { poids: 4, mots: ['change quelque chose', 'change ma vie', 'projet', 'formation', 'consolider', 'plein de trucs', 'mega fier', 'mega fiere', 'investir'] },
  { poids: 3, mots: ['apprend', 'avance', 'avancer', 'nourri', 'fier', 'fiere', 'serenite', 'soulag', 'creer', 'decouvr', 'rencontre', 'partage', 'clarte', 'motivation', 'utile', 'efficace', 'bonheur', 'passion'] },
  { poids: 2, mots: ['rigol', 'danser', 'chanter', 'jouer', 'repos', 'reposer', 'chill', 'detente', 'amus', 'moment', 'fun', 'geeker', 'sortir', 'activite', 'plaisir'] },
  { poids: 1, mots: ['gagne du temps', 'gagner du temps', 'mes affaires', 'un peu', 'petit', 'peut etre un truc', 'respecter'] },
  { poids: 0, mots: ['rien', 'pas grand chose', 'rien de special'] },
];

// Q3 — le regret. Ordre important : les motifs les plus spécifiques d'abord.
const REGRET = [
  { score: 5, mots: ['occasion rate', 'occasion ratee', 'pas possible de reporter', 'reviendra pas', 'revient pas', 'opportunite', 'pas avoir l occasion', 'une seule fois', 'rare'] },
  { score: 3.5, mots: ['regret', 'honteu', 'degoute', 'fachee', 'rebelote', 'culpabil', 'stress', 'rate'] },
  { score: 2, mots: ['frustr', 'dommage', 'coupable', 'fatigue', 'en tete', 'tourner en rond', 'gene'] },
  { score: 0.5, mots: ['peux toujours', 'peut toujours', 'pourrais toujours', 'peux tjs', 'tjs le faire', 'autre jour', 'autres occasions', 'reporte', 'demain', 'plus tard', 'le faire'] },
  { score: -2, mots: ['soulag', 'libere', 'en paix', 'fiere de moi', 'delivr'] },
  { score: 0, mots: ['rien', 'osef', 'change rien', 'neutre'] },
];

/* ------------------------------------------------------------------ */
/*  DÉTECTION                                                          */
/* ------------------------------------------------------------------ */

const NEGATIONS = ['pas', 'plus', 'jamais', 'aucun', 'sans', 'ni'];

/** Le marqueur est-il nié dans les ~3 mots qui le précèdent ? */
function estNie(texte, position) {
  const avant = texte.slice(Math.max(0, position - 22), position);
  return NEGATIONS.some((n) => new RegExp(`\\b${n}\\b`).test(avant));
}

function trouve(texte, motifs) {
  const vus = [];
  for (const m of motifs) {
    const i = texte.indexOf(m);
    if (i >= 0) vus.push({ motif: m, position: i, nie: estNie(texte, i) });
  }
  return vus;
}

function intensite(texte, etire) {
  let k = 1;
  if (etire) k += 0.3;
  if (/\bun peu\b|\bun poil\b|\blegerement\b/.test(texte)) k -= 0.4;
  if (/\bde fou\b|\bvraiment\b|\btres\b|\benorme\b|!!/.test(texte)) k += 0.4;
  return Math.max(0.4, Math.min(1.7, k));
}

/* ------------------------------------------------------------------ */
/*  LECTURE PAR QUESTION                                               */
/* ------------------------------------------------------------------ */

export function lireQ1(texte) {
  const { t, etire } = normaliser(texte);
  if (!t.trim()) return null;
  const k = intensite(t, etire);

  const plus = trouve(t, ENVIE_PLUS);
  const moins = trouve(t, ENVIE_MOINS);
  const peurs = trouve(t, PEUR);
  const neutres = trouve(t, NEUTRE);

  // Une envie niée bascule du côté négatif, et inversement.
  let envie = 0;
  for (const v of plus) envie += v.nie ? -1.5 : 1.5;
  for (const v of moins) envie += v.nie ? 1 : -1.8;
  if (!plus.length && !moins.length && neutres.length) envie = 0;

  let peur = 0;
  for (const v of peurs) if (!v.nie) peur += 1.2;

  if (!plus.length && !moins.length && !peurs.length && !neutres.length) return null;

  envie = Math.max(-2, Math.min(2, envie * k));
  peur = Math.max(0, Math.min(2, peur * k));

  // On choisit le cran le plus proche dans le plan (envie, peur).
  const crans = {
    flemme:  { envie: -2, peur: 0 },
    bof:     { envie: 0,  peur: 0 },
    peur:    { envie: -1, peur: 2 },
    trac:    { envie: 1,  peur: 1 },
    partant: { envie: 1,  peur: 0 },
    elan:    { envie: 2,  peur: 0 },
  };
  let meilleur = null;
  let best = Infinity;
  for (const [cle, c] of Object.entries(crans)) {
    // La peur pèse un peu plus que l'envie dans le choix du cran :
    // c'est elle qui distingue les crans voisins.
    const d = (c.envie - envie) ** 2 + 1.4 * (c.peur - peur) ** 2;
    if (d < best) { best = d; meilleur = cle; }
  }
  return { cran: meilleur, confiance: best < 1 ? 'haute' : 'basse', envie, peur };
}

export function lireQ2(texte) {
  const { t, etire } = normaliser(texte);
  if (!t.trim()) return null;

  let trouve_ = null;
  for (const niveau of GAIN) {
    if (niveau.mots.some((m) => t.includes(m))) { trouve_ = niveau; break; }
  }
  if (!trouve_) return null;

  let score = trouve_.poids * intensite(t, etire);
  // Beaucoup d'éléments énumérés = gain plus large.
  const virgules = (t.match(/,/g) ?? []).length;
  if (virgules >= 2) score += 0.6;
  score = Math.max(0, Math.min(4, score));

  const crans = { rien: 0, petit: 1, bon: 2, nourrit: 3, change: 4 };
  let meilleur = null, best = Infinity;
  for (const [cle, v] of Object.entries(crans)) {
    const d = Math.abs(v - score);
    if (d < best) { best = d; meilleur = cle; }
  }
  return { cran: meilleur, confiance: best < 0.5 ? 'haute' : 'basse', score };
}

export function lireQ3(texte) {
  const { t, etire } = normaliser(texte);
  if (!t.trim()) return null;

  let niveau = null;
  for (const n of REGRET) {
    if (n.mots.some((m) => t.includes(m))) { niveau = n; break; }
  }
  if (!niveau) return null;

  let score = niveau.score;
  if (score > 0) score *= intensite(t, etire);
  score = Math.max(-2, Math.min(5, score));

  const crans = { soulage: -2, rien: 0, reporte: 0.5, frustre: 2, regret: 3.5, rate: 5 };
  let meilleur = null, best = Infinity;
  for (const [cle, v] of Object.entries(crans)) {
    const d = Math.abs(v - score);
    if (d < best) { best = d; meilleur = cle; }
  }
  return { cran: meilleur, confiance: best < 0.6 ? 'haute' : 'basse', score };
}

export const LECTEURS = { q1: lireQ1, q2: lireQ2, q3: lireQ3 };
