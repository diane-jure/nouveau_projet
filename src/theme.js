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

/* ------------------------------------------------------------------ */
/*  MATIÈRE — texture, tramage, ornements                              */
/*                                                                     */
/*  Le pixel art ne connaît pas le dégradé continu : il trame. Et les  */
/*  références (Mistria, point de croix) ont toutes du grain.          */
/* ------------------------------------------------------------------ */

/** Damier 2 px : le tramage classique entre deux teintes. */
export const trame = (a, b, taille = 2) => ({
  backgroundImage:
    `repeating-conic-gradient(${a} 0% 25%, ${b} 0% 50%)`,
  backgroundSize: `${taille * 2}px ${taille * 2}px`,
});

/** Grain de papier : deux trames croisées très discrètes. */
export const grain = (couleur = 'rgba(46,33,64,0.05)') => ({
  backgroundImage:
    `repeating-linear-gradient(0deg, ${couleur} 0 1px, transparent 1px 3px),` +
    `repeating-linear-gradient(90deg, ${couleur} 0 1px, transparent 1px 3px)`,
});

/** Tissage façon point de croix, pour les fonds de médaillon. */
export const tissage = (couleur) => ({
  backgroundImage:
    `repeating-linear-gradient(45deg, ${couleur} 0 2px, transparent 2px 6px),` +
    `repeating-linear-gradient(-45deg, ${couleur} 0 2px, transparent 2px 6px)`,
});

/** Les classes définies dans CSS_GLOBAL — App les utilise par leur nom. */
export const CL = {
  panneau: 'qf-panneau',       // cadre à ferrures dans les quatre coins
  losange: 'qf-losange',       // médaillon en losange
  apparait: 'qf-apparait',     // entrée en escalier
  frappe: 'qf-frappe',         // curseur de frappe machine
  scintille: 'qf-scintille',   // récompense
  flotte: 'qf-flotte',         // sigil qui respire
  bat: 'qf-bat',               // cœurs
  remplit: 'qf-remplit',       // barres de stat
};

/* ------------------------------------------------------------------ */
/*  STATISTIQUES D'UNE VOIE — le motif « fiche de personnage »         */
/* ------------------------------------------------------------------ */

export const ligneStat = {
  display: 'flex', alignItems: 'center', gap: ESPACE.s,
};
export const pisteStat = {
  position: 'relative', flex: 1, height: ESPACE.m,
  background: C.relief,
  border: `${M.px / 2}px solid ${C.contour}`,
  overflow: 'hidden',
};
export const barreStat = (part, couleur) => ({
  position: 'absolute', inset: 0, right: 'auto',
  width: `${Math.max(0, Math.min(100, part * 100))}%`,
  ...trame(couleur, C.page, 1),
});
export const valeurStat = {
  ...T.minus, minWidth: ESPACE.l, textAlign: 'right', color: C.texte,
};
export const badgeScore = (indexVoie) => ({
  ...T.bouton,
  position: 'absolute', top: -ESPACE.s, left: -ESPACE.s, zIndex: 2,
  display: 'flex', alignItems: 'center', gap: ESPACE.xs,
  padding: `${ESPACE.xs}px ${ESPACE.s}px`,
  background: COULEURS_VOIE[indexVoie % COULEURS_VOIE.length].fonce,
  color: C.page,
  border: `${M.px / 2}px solid ${C.contour}`,
});

/** Fond quadrillé du médaillon, comme la fiche de personnage. */
export const fondMedaillon = (indexVoie) => ({
  ...tissage(COULEURS_VOIE[indexVoie % COULEURS_VOIE.length].fonce),
  background: COULEURS_VOIE[indexVoie % COULEURS_VOIE.length].clair,
});

/* ------------------------------------------------------------------ */
/*  CSS GLOBAL — polices, classes, animations                          */
/* ------------------------------------------------------------------ */

export const CSS_GLOBAL = `
  @font-face { font-family:'Pixelify Sans'; font-weight:400; font-display:swap;
    src:url('./fonts/pixelify-400-latin.woff2') format('woff2'); }
  @font-face { font-family:'Pixelify Sans'; font-weight:600; font-display:swap;
    src:url('./fonts/pixelify-600-latin.woff2') format('woff2'); }
  @font-face { font-family:'Pixelify Sans'; font-weight:700; font-display:swap;
    src:url('./fonts/pixelify-700-latin.woff2') format('woff2'); }

  * { box-sizing:border-box; }
  body {
    margin:0; background:${C.fond};
    background-image:
      repeating-linear-gradient(0deg, rgba(46,33,64,.045) 0 1px, transparent 1px 3px),
      repeating-linear-gradient(90deg, rgba(46,33,64,.045) 0 1px, transparent 1px 3px);
  }
  input::placeholder, textarea::placeholder { color:${C.texteEteint}; }
  input:focus, textarea:focus { outline:${M.px / 2}px solid ${C.accent}; outline-offset:0; }
  button { font:inherit; }
  button:active { transform: translate(${M.px}px, ${M.px}px); }

  /* --- Ferrures aux quatre coins : le cadre devient un objet --- */
  .${CL.panneau} {
    background-image:
      linear-gradient(${C.cadreOmbre}, ${C.cadreOmbre}),
      linear-gradient(${C.cadreOmbre}, ${C.cadreOmbre}),
      linear-gradient(${C.cadreOmbre}, ${C.cadreOmbre}),
      linear-gradient(${C.cadreOmbre}, ${C.cadreOmbre}),
      repeating-linear-gradient(0deg, rgba(46,33,64,.035) 0 1px, transparent 1px 3px);
    background-repeat: no-repeat;
    background-size: ${M.px * 4}px ${M.px * 4}px, ${M.px * 4}px ${M.px * 4}px,
                     ${M.px * 4}px ${M.px * 4}px, ${M.px * 4}px ${M.px * 4}px, auto;
    background-position: top left, top right, bottom left, bottom right, top left;
  }

  /* --- Médaillon en losange --- */
  .${CL.losange} {
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  }

  /* --- Apparition d'un encadré : en escalier, jamais en fondu --- */
  .${CL.apparait} { animation: qf-apparait .28s steps(4) both; }
  @keyframes qf-apparait {
    from { transform: translateY(${M.px * 4}px) scaleY(.8); opacity:0 }
    to   { transform: none; opacity:1 }
  }

  /* --- Curseur de frappe machine --- */
  .${CL.frappe}::after {
    content:'\\25BE'; color:${C.titreFonce}; margin-left:${ESPACE.xs}px;
    animation: qf-clignote .7s steps(2,start) infinite;
  }
  @keyframes qf-clignote { 0%,49%{opacity:1} 50%,100%{opacity:0} }

  /* --- Récompense : ça scintille --- */
  .${CL.scintille} { animation: qf-scintille 1.1s steps(3) infinite; }
  @keyframes qf-scintille {
    0%,100% { filter:none }
    50%     { filter:brightness(1.25) }
  }

  /* --- Le sigil respire --- */
  .${CL.flotte} { animation: qf-flotte 2.2s steps(3) infinite alternate; }
  @keyframes qf-flotte { from{transform:translateY(0)} to{transform:translateY(-${M.px}px)} }

  /* --- Les cœurs battent quand l'énergie change --- */
  .${CL.bat} { animation: qf-bat .4s steps(2) 2; }
  @keyframes qf-bat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }

  /* --- Les barres de stat se remplissent par crans --- */
  .${CL.remplit} { animation: qf-remplit .5s steps(6) both; }
  @keyframes qf-remplit { from { width:0 } }

  /* --- La pièce tourne --- */
  @keyframes pivote { 0%{transform:scaleX(1)} 50%{transform:scaleX(.15)} 100%{transform:scaleX(1)} }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:.001ms !important; animation-iteration-count:1 !important }
  }
`;
