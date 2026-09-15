/**
 * PHRASES — tout ce que l'oracle dit, et tout ce qui s'affiche a l'ecran.
 *
 * Aucun calcul ici, aucun import du moteur. Ce fichier traduit les codes
 * produits par oracle.js ('TETE', 'peurQuiCompte'...) en francais.
 * Tu peux le reecrire de fond en comble : le moteur ne s'en apercevra pas.
 *
 * Les variantes sont tirees de maniere stable (meme dilemme = meme phrase),
 * pour que l'oracle ne change pas d'avis en changeant de mots.
 *
 * Marqueurs disponibles dans les textes : {option}, {dauphin}.
 */

/** Tirage stable : la meme graine donne toujours la meme variante. */
function choisir(liste, graine = 0) {
  if (!liste.length) return '';
  return liste[Math.abs(Math.trunc(graine)) % liste.length];
}

function remplir(texte, valeurs) {
  return texte.replace(/\{(\w+)\}/g, (_, cle) => valeurs[cle] ?? '');
}

/** Graine derivee du dilemme, pour que le phrase ne bouge pas au re-rendu. */
function graineDe(verdict) {
  const base = verdict.classement.map((o) => o.nom).join('|');
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) | 0;
  return h;
}

/* ------------------------------------------------------------------ */
/*  LA VOIX DE L'ORACLE                                                */
/* ------------------------------------------------------------------ */

export const VOIX = {
  /** Ouverture, avant le verdict. */
  preambule: [
    "J'ai regardé les trois colonnes.",
    "Voilà ce que je lis.",
    "J'ai pesé. Écoute.",
  ],

  /** Verdict net : une option devant. Decline selon l'axe qui tranche. */
  TETE: {
    regret: [
      "Ce n'est pas l'envie qui tranche. C'est ce qu'il resterait demain matin.",
      "Demain, l'autre option ne te manquera pas. Celle-ci, si.",
    ],
    gain: [
      "Ce que ça t'apporte pèse plus lourd que tout le reste.",
      "Le reste s'équilibre. C'est ce que tu y gagnes qui fait pencher.",
    ],
    sensation: [
      "Aujourd'hui ton énergie va là. Ne la contrarie pas pour rien.",
      "Rien d'autre ne pèse vraiment. Alors suis ce qui te tire.",
    ],
  },

  /** Deux options a egalite, mais l'enjeu compte : on tranche du bout des levres. */
  SERRE: [
    "Les deux se valent, ou presque. Je penche pour « {option} », d'un cheveu.",
    "C'est serré. « {option} » passe devant de peu — pas de quoi en faire une histoire.",
  ],
  SERRE_apres: [
    "Tu ne te tromperas pas beaucoup.",
    "Choisis vite, l'écart ne mérite pas ton après-midi.",
  ],

  /** Egalite ET ca ne comptera pas : on arrete de calculer. */
  PILE_OU_FACE: [
    "Dans dix jours, tu ne sauras plus ce que tu as choisi.",
    "Ça ne laissera aucune trace. Vraiment aucune.",
  ],
  PILE_OU_FACE_apres: [
    "Arrête de calculer. Laisse la pièce décider.",
    "Le temps passé à choisir coûte déjà plus cher que le choix.",
  ],

  /* --- Drapeaux : ils s'ajoutent au verdict, ils ne le remplacent pas --- */

  aucuneNAppelle: [
    "Mais aucune de ces options ne t'appelle vraiment.",
    "Cela dit : rien là-dedans ne te tire vers l'avant.",
  ],
  aucuneNAppelle_apres: [
    "Tu as le droit d'en écrire une troisième. Tu as même le droit de ne rien faire.",
    "Ajoute une option C. Celle à laquelle tu n'as pas osé penser.",
  ],

  grandeDecision: [
    "Pose la pièce. Ce n'est pas un choix de soirée.",
    "Attends. Celle-là ne se règle pas en trente secondes.",
  ],
  grandeDecision_apres: [
    "Les deux chemins engagent quelque chose de long. Ce que je dis ensuite est un avis, pas un verdict.",
    "Tu as mis des mots lourds dans les deux colonnes. Nomme d'abord le dilemme, tranche ensuite.",
  ],

  peurQuiCompte: [
    "Tu as peur devant « {option} », et ça te manquerait de ne pas le faire.",
    "« {option} » te fait peur. Et son absence te ferait mal.",
  ],
  peurQuiCompte_apres: [
    "Cette peur-là n'est pas un feu rouge. C'est un signe que ça compte.",
    "La peur et l'envie se ressemblent beaucoup. Ici, c'est la seconde.",
  ],

  peurQuiProtege: [
    "Devant « {option} » : la peur. Derrière : le soulagement.",
    "« {option} » t'angoisse, et ne pas le faire te soulage.",
  ],
  peurQuiProtege_apres: [
    "Ce n'est pas du trac, c'est un refus. Écoute-le.",
    "Quand renoncer soulage, c'est que la réponse était déjà là.",
  ],

  engagement: [
    "Quelqu'un compte sur toi pour « {option} ».",
    "Tu as donné ta parole sur « {option} ».",
  ],
  engagement_apres: [
    "Ça ne se met pas dans la balance des envies.",
    "L'envie ne fait pas le poids contre ça, et c'est très bien ainsi.",
  ],

  /** Apres le tirage au sort. */
  tirage: [
    "La pièce a parlé : « {option} ». Vas-y sans y repenser.",
    "« {option} ». Voilà, c'est décidé, n'y reviens pas.",
  ],
};

/* ------------------------------------------------------------------ */
/*  COMPOSITION DU VERDICT                                             */
/* ------------------------------------------------------------------ */

/**
 * Transforme la sortie du moteur en repliques pretes a afficher.
 * Chaque replique : { ton, texte }
 *   ton = 'mise-en-garde' | 'oracle' | 'verdict' | 'suite'
 */
export function composerVerdict(verdict) {
  const g = graineDe(verdict);
  const vals = {
    option: verdict.gagnant.nom,
    dauphin: verdict.dauphin?.nom ?? '',
  };
  const lignes = [];
  const pousser = (ton, liste, valeurs = vals) => {
    const t = choisir(liste, g);
    if (t) lignes.push({ ton, texte: remplir(t, valeurs) });
  };

  // 1. Les mises en garde passent AVANT le verdict : on nomme, puis on conseille.
  if (verdict.drapeaux.includes('grandeDecision')) {
    pousser('mise-en-garde', VOIX.grandeDecision);
    pousser('mise-en-garde', VOIX.grandeDecision_apres);
  }
  if (verdict.drapeaux.includes('aucuneNAppelle')) {
    pousser('mise-en-garde', VOIX.aucuneNAppelle);
    pousser('mise-en-garde', VOIX.aucuneNAppelle_apres);
  }

  // 2. Le verdict lui-meme.
  if (verdict.type === 'PILE_OU_FACE') {
    pousser('oracle', VOIX.PILE_OU_FACE);
    pousser('oracle', VOIX.PILE_OU_FACE_apres);
  } else if (verdict.type === 'SERRE') {
    pousser('verdict', VOIX.SERRE);
    pousser('suite', VOIX.SERRE_apres);
  } else {
    lignes.push({ ton: 'verdict', texte: `« ${verdict.gagnant.nom} »` });
    pousser('suite', VOIX.TETE[verdict.dominante] ?? VOIX.TETE.gain);
  }

  // 3. Ce qui a fait pencher la balance, nomme explicitement.
  if (verdict.drapeaux.includes('engagement')) {
    pousser('oracle', VOIX.engagement);
    pousser('suite', VOIX.engagement_apres);
  }
  if (verdict.drapeaux.includes('peurQuiCompte')) {
    pousser('oracle', VOIX.peurQuiCompte);
    pousser('suite', VOIX.peurQuiCompte_apres);
  }
  if (verdict.drapeaux.includes('peurQuiProtege')) {
    const vise = verdict.classement.find((o) =>
      o.detail.bonus.some((b) => b.cle === 'peurQuiProtege')
    );
    const v = { ...vals, option: vise?.nom ?? vals.option };
    pousser('oracle', VOIX.peurQuiProtege, v);
    pousser('suite', VOIX.peurQuiProtege_apres, v);
  }

  return lignes;
}

/** Phrase de fin de tirage au sort. */
export function phraseTirage(option, graine = 0) {
  return remplir(choisir(VOIX.tirage, graine), { option: option.nom });
}

/* ------------------------------------------------------------------ */
/*  LIBELLES D'INTERFACE                                               */
/* ------------------------------------------------------------------ */

export const INTERFACE = {
  titre: "L'ORACLE",
  sousTitre: 'quatre questions, un verdict',
  commencer: 'APPUYER POUR COMMENCER',
  nouveauDilemme: 'Nouveau dilemme',
  journal: 'Journal',
  reprendre: 'Reprendre le dilemme en cours',
  suite: 'Suite ▸',
  retour: '◂ Retour',
  consulter: "CONSULTER L'ORACLE",
  lancerPiece: 'TIRER AU SORT',
  relancer: 'Relancer',

  etapes: {
    seuil: 'Le seuil',
    options: 'Les chemins',
    sensation: 'Le ventre',
    gain: 'La lumière',
    regret: "L'ombre",
    oracle: 'Le verdict',
  },

  options: {
    titre: 'Entre tes options',
    aide: 'Deux minimum. La troisième est souvent la bonne — celle à laquelle tu ne penses pas.',
    place: (i) => `Option ${'ABC'[i] ?? i + 1}`,
    ajouter: '+ Ajouter une option',
    retirer: 'Retirer',
  },

  note: {
    place: 'Note libre (facultative)',
    aide: "Pour le journal. L'oracle ne la lit pas.",
  },

  verdict: {
    detail: 'Le détail du calcul',
    axes: { sensation: 'Ventre', gain: 'Gain', regret: 'Regret' },
    bonus: {
      peurQuiCompte: 'Peur qui compte',
      peurQuiProtege: 'Peur qui protège',
      engagement: 'Parole donnée',
    },
    total: 'Total',
    enjeux: {
      leger: "Ça ne comptera pas — l'envie décide",
      moyen: 'Enjeu moyen — tout compte un peu',
      lourd: 'Ça comptera — le regret décide',
    },
  },

  retourExperience: {
    titre: 'Et après ?',
    aide: "Reviens le remplir plus tard. C'est ça qui rend le journal utile.",
    choixFinal: "Qu'est-ce que tu as fait ?",
    autre: 'Autre chose',
    satisfaction: 'Avec le recul ?',
    commentaire: 'Ce que tu en retiens',
    enregistrer: 'Enregistrer',
  },

  journalEcran: {
    titre: 'Journal',
    vide: 'Aucun dilemme consigné pour le moment.',
    enAttente: (n) => `${n} dilemme${n > 1 ? 's' : ''} sans retour`,
    accord: (n, total) => `L'oracle et toi d'accord : ${n}/${total}`,
    exporter: 'Exporter (.json)',
    importer: 'Importer',
    effacer: 'Tout effacer',
    confirmerEffacer: 'Effacer définitivement tout le journal ?',
    oracleDit: 'Oracle',
    tuAsFait: 'Choix',
  },
};
