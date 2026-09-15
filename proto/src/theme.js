/**
 * THEME — couleurs, dimensions, polices. RIEN D'AUTRE.
 *
 * Pour changer l'apparence de l'application, ce fichier suffit.
 * Aucune couleur, aucune taille, aucune police ne doit être écrite
 * ailleurs que dans ce fichier.
 *
 * Direction : Fields of Mistria (pages crème, cadres bois et or, bandeaux
 * roses, onglets pastel) + la sorcière pastel (jaune beurre, roses et
 * lilas doux, contours prune). Palette 16 teintes.
 */

/* ------------------------------------------------------------------ */
/*  LES 16 COULEURS                                                    */
/* ------------------------------------------------------------------ */

export const PALETTE = {
  plume:   '#2e2140',   // contour et texte : prune très foncé, jamais du noir
  encre:   '#584470',   // texte secondaire
  brume:   '#9c8bb4',   // texte éteint, champs inactifs
  creme:   '#fdf4e3',   // fond des panneaux (la page du livre)
  beurre:  '#f6e3b8',   // fond général
  sable:   '#e7cb9a',   // relief clair, séparateurs
  bois:    '#c08b57',   // cadre
  bois2:   '#8d5f3a',   // cadre, côté ombre
  rose:    '#f4a9c4',   // accent principal (bandeaux de titre)
  rose2:   '#d96f95',   // accent principal foncé
  lilas:   '#bda6ec',   // accent secondaire
  lilas2:  '#8a6fcc',
  menthe:  '#a9debf',   // positif
  menthe2: '#57ad87',
  or:      '#f3c24f',   // récompense, verdict
  corail:  '#e8735f',   // négatif, alerte
};

/** Rôles — c'est ce qu'on utilise dans App, jamais PALETTE directement. */
export const C = {
  fond:        PALETTE.beurre,
  page:        PALETTE.creme,
  contour:     PALETTE.plume,
  texte:       PALETTE.plume,
  texteDoux:   PALETTE.encre,
  texteEteint: PALETTE.brume,
  cadre:       PALETTE.bois,
  cadreOmbre:  PALETTE.bois2,
  relief:      PALETTE.sable,

  titre:       PALETTE.rose,
  titreFonce:  PALETTE.rose2,
  accent:      PALETTE.lilas,
  accentFonce: PALETTE.lilas2,

  positif:     PALETTE.menthe2,
  positifClair:PALETTE.menthe,
  negatif:     PALETTE.corail,
  oracle:      PALETTE.or,

  coeurPlein:  PALETTE.rose2,
  coeurVide:   PALETTE.sable,
};

/** Une couleur par voie : c'est l'identité visuelle de l'option. */
export const COULEURS_VOIE = [
  { clair: PALETTE.rose,   fonce: PALETTE.rose2 },
  { clair: PALETTE.menthe, fonce: PALETTE.menthe2 },
  { clair: PALETTE.lilas,  fonce: PALETTE.lilas2 },
  { clair: PALETTE.or,     fonce: PALETTE.bois2 },
];

/** Satisfaction — utilisé par le journal. */
export const COULEUR_SATISFACTION = {
  oui: PALETTE.menthe2,
  bof: PALETTE.or,
  non: PALETTE.corail,
};

/* ------------------------------------------------------------------ */
/*  MESURES                                                            */
/* ------------------------------------------------------------------ */

export const M = {
  px: 4,                 // l'unité pixel : tout est un multiple
  largeurFlow: 600,      // largeur max du flux (flow.md)
  rayon: 0,              // jamais d'angle arrondi
  entaille: 10,          // taille du coin taillé des panneaux
  gouttiere: 16,         // marge latérale minimale sur téléphone
  bascule: 560,          // en dessous : mise en page téléphone
};

export const ESPACE = { xs: 4, s: 8, m: 12, l: 20, xl: 32 };

/* ------------------------------------------------------------------ */
/*  POLICES                                                            */
/* ------------------------------------------------------------------ */

export const POLICE = "'Pixelify Sans', 'Courier New', monospace";

export const T = {
  titre:  { fontFamily: POLICE, fontWeight: 700, fontSize: 26, letterSpacing: 1 },
  section:{ fontFamily: POLICE, fontWeight: 700, fontSize: 15, letterSpacing: 1 },
  bouton: { fontFamily: POLICE, fontWeight: 700, fontSize: 15 },
  corps:  { fontFamily: POLICE, fontWeight: 400, fontSize: 17, lineHeight: 1.45 },
  petit:  { fontFamily: POLICE, fontWeight: 400, fontSize: 14 },
  minus:  { fontFamily: POLICE, fontWeight: 600, fontSize: 12, letterSpacing: 0.5 },
};

/* ------------------------------------------------------------------ */
/*  FABRIQUES DE STYLE                                                 */
/*  Des fonctions, pour que App n'ait jamais à composer une couleur.   */
/* ------------------------------------------------------------------ */

/** Le cadre pixel : trait épais + relief décalé, sans flou. */
export const cadre = (couleur = C.cadre, epaisseur = M.px) => ({
  border: `${epaisseur}px solid ${C.contour}`,
  boxShadow: `inset 0 0 0 ${epaisseur}px ${couleur}, ${M.px}px ${M.px}px 0 0 ${C.cadreOmbre}`,
});

/** Coins taillés en escalier — la signature pixel des panneaux. */
export const coinsTailles = (t = M.entaille) => ({
  clipPath: `polygon(${t}px 0, calc(100% - ${t}px) 0, 100% ${t}px,
    100% calc(100% - ${t}px), calc(100% - ${t}px) 100%, ${t}px 100%,
    0 calc(100% - ${t}px), 0 ${t}px)`,
});

/** Panneau : la boîte de base, une page de livre. */
export const panneau = (couleurCadre = C.cadre) => ({
  background: C.page,
  ...cadre(couleurCadre),
  padding: ESPACE.l,
});

/** Bandeau de titre rose, façon Mistria. */
export const bandeau = (couleur = C.titre) => ({
  background: couleur,
  color: C.texte,
  ...T.section,
  padding: `${ESPACE.s}px ${ESPACE.m}px`,
  margin: `-${ESPACE.l}px -${ESPACE.l}px ${ESPACE.m}px`,
  borderBottom: `${M.px}px solid ${C.contour}`,
  display: 'flex', alignItems: 'center', gap: ESPACE.s,
});

/** Bouton d'action. */
export const bouton = (actif = true, couleur = C.titre) => ({
  ...T.bouton,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: ESPACE.s,
  width: '100%',
  padding: `${ESPACE.m}px ${ESPACE.l}px`,
  background: actif ? couleur : C.relief,
  color: actif ? C.texte : C.texteEteint,
  border: `${M.px}px solid ${actif ? C.contour : C.texteEteint}`,
  boxShadow: actif ? `${M.px}px ${M.px}px 0 0 ${C.cadreOmbre}` : 'none',
  cursor: actif ? 'pointer' : 'not-allowed',
  transform: 'translate(0,0)',
});

/** Champ de saisie. */
export const champ = (actif = true) => ({
  ...T.corps,
  width: '100%',
  boxSizing: 'border-box',
  padding: `${ESPACE.s}px ${ESPACE.m}px`,
  background: actif ? '#fff' : C.relief,
  color: C.texte,
  border: `${M.px / 2}px solid ${C.contour}`,
  outline: 'none',
});

/** Variante multiligne du champ : les réponses libres sont longues. */
export const champLong = (actif = true) => ({
  ...champ(actif),
  minHeight: 56,
  resize: 'vertical',
  lineHeight: 1.4,
});

/** Un bloc encore verrouillé : flouté et inerte (flow.md). */
export const verrouille = {
  filter: 'blur(3px)',
  opacity: 0.45,
  pointerEvents: 'none',
  userSelect: 'none',
};

/* ------------------------------------------------------------------ */
/*  FABRIQUES DE MISE EN PAGE                                          */
/*  App ne doit jamais écrire une couleur ni une dimension :           */
/*  tout ce dont elle a besoin est fabriqué ici.                       */
/* ------------------------------------------------------------------ */

export const ecran = {
  minHeight: '100vh',
  background: C.fond,
  color: C.texte,
  ...T.corps,
  padding: `${ESPACE.l}px ${M.gouttiere}px ${ESPACE.xl}px`,
  boxSizing: 'border-box',
};

export const flux = {
  maxWidth: M.largeurFlow,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: ESPACE.m,
};

export const entete = {
  ...panneau(C.titre),
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: ESPACE.m,
};
export const enteteTitre = { ...T.titre, margin: 0 };
export const enteteSousTitre = { ...T.petit, color: C.texteDoux, margin: 0 };

/** Bouton discret (journal, retour, fermeture). */
export const boutonIcone = (actif = true) => ({
  ...T.minus,
  display: 'inline-flex', alignItems: 'center', gap: ESPACE.xs,
  padding: ESPACE.s,
  background: actif ? C.relief : 'transparent',
  color: C.texte,
  border: `${M.px / 2}px solid ${actif ? C.contour : 'transparent'}`,
  cursor: 'pointer',
});

/** La carte d'une voie — structure « fiche de personnage ». */
export const carteVoie = (indexVoie) => ({
  background: C.page,
  ...cadre(COULEURS_VOIE[indexVoie % COULEURS_VOIE.length].clair),
  padding: ESPACE.m,
  display: 'flex', flexDirection: 'column', gap: ESPACE.s,
});

/** Corps de la carte : médaillon à gauche, sauf sur téléphone (au-dessus). */
export const corpsCarte = (surTelephone) => ({
  display: 'flex',
  flexDirection: surTelephone ? 'column' : 'row',
  alignItems: surTelephone ? 'stretch' : 'flex-start',
  gap: ESPACE.m,
});

/** Le médaillon : emplacement de la future illustration. */
export const medaillon = (indexVoie, surTelephone) => ({
  flex: 'none',
  alignSelf: surTelephone ? 'center' : 'flex-start',
  width: surTelephone ? '100%' : 96,
  height: surTelephone ? 120 : 96,
  display: 'grid', placeItems: 'center',
  background: COULEURS_VOIE[indexVoie % COULEURS_VOIE.length].clair,
  border: `${M.px}px solid ${C.contour}`,
});

/** Taille du sigil selon le format : il doit remplir son médaillon. */
export const TAILLE_SIGIL = { bureau: 56, telephone: 88 };

export const colonneCarte = { flex: 1, display: 'flex', flexDirection: 'column', gap: ESPACE.s, minWidth: 0 };

/** Pastille de couleur d'une voie. */
export const puceVoie = (indexVoie) => ({
  width: ESPACE.l, height: ESPACE.l, flex: 'none',
  background: COULEURS_VOIE[indexVoie % COULEURS_VOIE.length].fonce,
  border: `${M.px / 2}px solid ${C.contour}`,
});

/** Libellé d'une question. */
export const libelle = (actif = true) => ({
  ...T.minus,
  color: actif ? C.texteDoux : C.texteEteint,
  display: 'block',
  marginBottom: ESPACE.xs,
});

/** Compteur COÛT / GAIN. */
export const compteur = (positif) => ({
  display: 'flex', alignItems: 'center', gap: ESPACE.s,
  padding: ESPACE.s,
  background: C.relief,
  border: `${M.px / 2}px solid ${C.contour}`,
});
export const compteurValeur = (positif) => ({
  ...T.bouton, minWidth: ESPACE.l, textAlign: 'center',
  color: positif ? C.positif : C.texte,
});
export const compteurBouton = {
  ...T.minus, padding: `${ESPACE.xs}px ${ESPACE.s}px`,
  background: C.page, color: C.texte,
  border: `${M.px / 2}px solid ${C.contour}`, cursor: 'pointer',
};

/** Choix rapide pour la question de la portée (autofill). */
export const pastilleChoix = (choisie) => ({
  ...T.petit,
  padding: `${ESPACE.xs}px ${ESPACE.s}px`,
  background: choisie ? C.accent : C.relief,
  color: C.texte,
  border: `${M.px / 2}px solid ${C.contour}`,
  cursor: 'pointer',
});

/** Le verdict de l'oracle : le seul panneau doré. */
export const panneauOracle = { ...panneau(C.oracle) };
export const verdictNom = { ...T.titre, color: C.texte, textAlign: 'center', margin: `${ESPACE.m}px 0` };
export const verdictPhrase = { ...T.corps, color: C.texteDoux, textAlign: 'center', margin: 0 };

/** Pièce à lancer. */
export const piece = (tourne) => ({
  display: 'grid', placeItems: 'center',
  margin: '0 auto', padding: ESPACE.m,
  background: 'transparent', border: 'none', cursor: 'pointer',
  animation: tourne ? 'pivote 0.14s steps(2) infinite' : 'none',
});

/** Barre de statistique d'une voie. */
export const pisteStat = {
  position: 'relative', height: ESPACE.m, flex: 1,
  background: C.relief, border: `${M.px / 2}px solid ${C.contour}`,
};
export const barreStat = (part, positif) => ({
  position: 'absolute', top: 0, bottom: 0, left: 0,
  width: `${Math.min(100, Math.abs(part) * 100)}%`,
  background: positif ? C.positifClair : C.negatif,
});

/* --- Journal --- */

export const voile = {
  position: 'fixed', inset: 0, zIndex: 10,
  background: 'rgba(46,33,64,0.55)',
  display: 'flex', justifyContent: 'center',
  padding: `${ESPACE.l}px ${M.gouttiere}px`,
  overflowY: 'auto',
};
export const panneauJournal = {
  ...panneau(C.accent),
  width: '100%', maxWidth: M.largeurFlow, height: 'fit-content',
};
export const ongletsJournal = { display: 'flex', gap: ESPACE.xs, marginBottom: ESPACE.m };
export const onglet = (actif) => ({
  ...T.minus,
  flex: 1, padding: ESPACE.s,
  background: actif ? C.titre : C.relief,
  color: actif ? C.texte : C.texteDoux,
  border: `${M.px / 2}px solid ${C.contour}`,
  borderBottom: actif ? 'none' : `${M.px / 2}px solid ${C.contour}`,
  cursor: 'pointer',
});
export const entreeJournal = (satisfaction) => ({
  background: C.page,
  border: `${M.px / 2}px solid ${C.contour}`,
  borderLeft: `${M.px * 2}px solid ${COULEUR_SATISFACTION[satisfaction] ?? C.texteEteint}`,
  padding: ESPACE.m,
  marginBottom: ESPACE.s,
  display: 'flex', flexDirection: 'column', gap: ESPACE.xs,
});
export const citation = {
  ...T.corps, fontStyle: 'italic', color: C.texteDoux,
  borderLeft: `${M.px / 2}px solid ${C.relief}`,
  paddingLeft: ESPACE.s, margin: 0,
};

/** Petit encadré « Sauvegardé ! », en bas à droite. */
export const encadreSauvegarde = {
  position: 'fixed', right: M.gouttiere, bottom: M.gouttiere, zIndex: 20,
  ...T.minus,
  display: 'flex', alignItems: 'center', gap: ESPACE.xs,
  padding: ESPACE.s,
  background: C.positifClair, color: C.texte,
  border: `${M.px / 2}px solid ${C.contour}`,
};

/** Styles globaux injectés une fois (polices, reset, animation). */
export const CSS_GLOBAL = `
  @font-face { font-family:'Pixelify Sans'; font-weight:400; font-display:swap;
    src:url('./fonts/pixelify-400-latin.woff2') format('woff2'); }
  @font-face { font-family:'Pixelify Sans'; font-weight:600; font-display:swap;
    src:url('./fonts/pixelify-600-latin.woff2') format('woff2'); }
  @font-face { font-family:'Pixelify Sans'; font-weight:700; font-display:swap;
    src:url('./fonts/pixelify-700-latin.woff2') format('woff2'); }
  * { box-sizing:border-box; }
  body { margin:0; background:${C.fond}; }
  input::placeholder { color:${C.texteEteint}; }
  button:active { transform: translate(${M.px}px, ${M.px}px); }
  @keyframes pivote { 0%{transform:scaleX(1)} 50%{transform:scaleX(.15)} 100%{transform:scaleX(1)} }
`;
