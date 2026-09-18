/**
 * ECHELLES — les 4 questions et leur traduction chiffree.
 *
 * Tout le jugement de l'oracle vit ici. Aucun LLM : l'utilisatrice choisit un
 * barreau d'echelle, le barreau porte un score, et oracle.js fait la somme.
 * Les notes en texte libre sont conservees pour le journal mais ne sont
 * JAMAIS lues par le moteur.
 *
 * Les valeurs viennent de l'historique reel (22 dilemmes) et surtout de la
 * colonne "Commentaire", ou sont consignees les lecons :
 *   - "mieux vaut essayer de faire quelque chose qui me donne bof envie
 *      que de regretter de pas l'avoir fait"   -> Q3 pese le plus lourd
 *   - "je peux toujours le faire"               -> marqueur de report, ~0
 *   - "le truc qui gagne beaucoup, qui est rare" -> la raretee est un saut,
 *      d'ou une echelle Q3 volontairement non lineaire
 *   - le week-end a Lyon : "soulagee, vraiment soulagee" de ne PAS y aller
 *      -> Q3 doit pouvoir etre negatif, sinon le calcul est faux
 */

/** Q0 — pose une seule fois, calibre tout le reste. */
export const Q0 = {
  cle: 'q0',
  titre: 'Dans 10 jours, ça compte ?',
  aide: "Pas « est-ce que c'est grave », juste : est-ce que tu t'en souviendras.",
  etape: 'seuil',
  valeurs: {
    non: { label: 'Non, aucune trace', enjeu: 'leger' },
    bof: { label: "J'sais pas trop", enjeu: 'moyen' },
    oui: { label: 'Oui, ça pèse', enjeu: 'lourd' },
  },
};

/**
 * Q1 — deux dimensions dans une seule liste.
 *   valence : est-ce que ça tire vers l'avant ou vers l'arriere
 *   peur    : intensite de la trouille, notee SEPAREMENT
 *
 * Pourquoi separer : dans l'historique, "ça me fait peur" accompagne presque
 * toujours les choix notes "good" (l'admin, le lac, Asturias). La flemme, elle,
 * accompagne les options qu'il fallait laisser tomber. Confondre les deux,
 * c'est l'erreur que faisait l'ancien outil.
 */
export const Q1 = {
  cle: 'q1',
  titre: 'Première sensation',
  aide: 'Sans réfléchir. Ce que ça fait dans le ventre, là, maintenant.',
  etape: 'sensation',
  valeurs: {
    flemme:  { label: 'Pfff… flemme',                 valence: -2, peur: 0 },
    bof:     { label: 'Bof, neutre',                  valence:  0, peur: 0 },
    peur:    { label: 'Ça me fait peur',              valence: -1, peur: 2 },
    trac:    { label: "J'ai envie, mais j'ai le trac", valence: 1, peur: 1 },
    partant: { label: 'Pourquoi pas, je le sens',     valence:  1, peur: 0 },
    elan:    { label: 'Enthousiasme franc',           valence:  2, peur: 0 },
  },
};

/** Q2 — la taille du gain si tout se passe bien. */
export const Q2 = {
  cle: 'q2',
  titre: 'Si ça se passe bien',
  aide: "Le meilleur scenario realiste. Pas le fantasme, le meilleur plausible.",
  etape: 'gain',
  valeurs: {
    rien:    { label: 'Rien de spécial',            score: 0 },
    petit:   { label: 'Un petit quelque chose',     score: 1 },
    bon:     { label: 'Un bon moment',              score: 2 },
    nourrit: { label: 'Ça me nourrit vraiment',     score: 3 },
    change:  { label: 'Ça change quelque chose',    score: 4 },
  },
};

/**
 * Q3 — le regret. L'echelle la plus lourde, et la seule qui descend sous zero.
 *
 * Le saut 2 -> 3.5 -> 5 est volontaire : une occasion qui ne revient pas ne
 * vaut pas "un peu plus" qu'une frustration, elle vaut beaucoup plus.
 * Le barreau "soulagement" existe a cause du week-end a Lyon : quand ne pas
 * le faire SOULAGE, c'est une raison de ne pas le faire, pas un zero.
 */
export const Q3 = {
  cle: 'q3',
  titre: "Si demain tu l'as pas fait",
  aide: 'Demain matin, au reveil, en y repensant.',
  etape: 'regret',
  valeurs: {
    soulage: { label: 'Soulagement, franchement',        score: -2 },
    rien:    { label: 'Rien, osef',                      score: 0 },
    reporte: { label: 'Je peux toujours le faire',       score: 0.5 },
    frustre: { label: 'Un peu frustrée',                 score: 2 },
    regret:  { label: 'Regret net',                      score: 3.5 },
    rate:    { label: 'Occasion ratée, ça ne revient pas', score: 5 },
  },
};

export const ECHELLES = { q0: Q0, q1: Q1, q2: Q2, q3: Q3 };
export const QUESTIONS_OPTION = [Q1, Q2, Q3];

/**
 * POIDS — Q0 ne marque pas de points, il redistribue les poids.
 *
 *   leger : ça ne comptera pas -> suis ton energie, arrete de calculer
 *   lourd : ça comptera        -> la sensation du moment ment, le regret non
 */
export const POIDS = {
  leger: { sensation: 1.6, gain: 1.0, regret: 0.6 },
  moyen: { sensation: 1.0, gain: 1.0, regret: 1.3 },
  lourd: { sensation: 0.6, gain: 1.2, regret: 2.0 },
};

export const SEUILS = {
  /** en-dessous de cet ecart entre les 2 premieres, c'est un ex aequo */
  serre: 1.2,
  /** au-dessus, plus rien ne mérite un verdict tranché */
  faible: 4.0,
  /** une parole donnee ne se met pas dans la balance des envies */
  engagement: 3,
  /** intensite mini pour declencher le "on nomme le dilemme" */
  intensite: 6,
};

/** L'engagement n'est pas une question a echelle mais un interrupteur. */
export const ENGAGEMENT = {
  cle: 'engagement',
  label: 'Quelqu\'un compte dessus',
  aide: "Un rendez-vous pris, une promesse. Coche seulement si quelqu'un d'autre est impacté.",
};

export const ENJEUX = ['leger', 'moyen', 'lourd'];
export const SATISFACTIONS = {
  good: { label: 'Bien joué', signe: '+' },
  meh:  { label: 'Mouais',    signe: '~' },
  bad:  { label: 'Raté',      signe: '-' },
};
