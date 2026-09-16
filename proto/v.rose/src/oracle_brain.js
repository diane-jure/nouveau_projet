/**
 * ORACLE_BRAIN — le moteur de verdict. À IMPORTER, JAMAIS RÉÉCRIRE.
 *
 * Port fidèle de l'Oracle V2 (janvier 2026), documenté dans
 * docs/oracle_version/oracle_v2.md. La V2 a été retenue plutôt que la V2.5
 * après mesure sur les 25 dilemmes réels (67 % contre 53 %, critère
 * OracleWasRight de docs/oracle_cerveau.md).
 *
 * UNE SEULE CORRECTION par rapport à l'original, et elle est volontaire :
 * dans l'application v4.6.1, les trois appels au moteur omettaient le
 * troisième argument, si bien que la réponse à « Dans 10 jours ? » n'était
 * jamais lue. Ici elle est transmise. Toutes les branches qui en dépendent
 * (relativisation, procrastination, vraie résistance) fonctionnent donc.
 *
 * Le moteur ne produit QUE des nombres et des codes. Aucune phrase
 * destinée à l'écran : elles vivront dans oracle_words.
 */

const contient = (texte, mots) => mots.some((m) => texte.includes(m));

/* ------------------------------------------------------------------ */
/*  NOTATION D'UNE VOIE                                                */
/* ------------------------------------------------------------------ */

function noterVoie(voie, energie, q0) {
  const q1 = (voie.q1 || '').toLowerCase();
  const q2 = (voie.q2 || '').toLowerCase();
  const q3 = (voie.q3 || '').toLowerCase();

  let score = 0;
  const signaux = { n1: [], n2: [], n3: [], n4: [] };
  const marquer = (niveau, type, texte) => signaux[niveau].push({ type, texte });

  /* --- NIVEAU 1 : signaux ultra-forts (±5) --- */
  if (contient(q2, ['mega fiere', 'fiere', 'fierte', 'fière', 'fierté'])) {
    score += 5; marquer('n1', 'vert', 'méga fierté si fait');
  }
  if (contient(q2, ["s'amuse de fou", 'kiffe grave', 'adore'])) {
    score += 5; marquer('n1', 'vert', "s'amuse de fou");
  }
  if (contient(q2, ['a fond', 'à fond']) || contient(q1, ['excit', 'hate', 'hâte'])) {
    score += 5; marquer('n1', 'vert', 'excitation forte');
  }
  if (contient(q3, ['honteu', 'degout', 'dégoût', 'fache', 'fâche', 'nulle'])) {
    score += 4; marquer('n1', 'vert', 'regret massif si pas fait');
  }
  if (contient(q3, ['trop deg', 'triste'])) {
    score += 4; marquer('n1', 'vert', 'regret fort si pas fait');
  }
  if (contient(q1, ['angoisse', 'peur', 'panique'])) {
    score -= 5; marquer('n1', 'rouge', 'alerte corporelle forte');
  }
  if (contient(q1, ['oppresse', 'oppressé', 'noeud au ventre', 'nœud au ventre'])) {
    score -= 5; marquer('n1', 'rouge', 'résistance corporelle');
  }

  /* --- NIVEAU 2 : signaux forts contextuels (±3) --- */
  const aFlemme = q1.includes('flemme');
  if (aFlemme) {
    const vraieResistance =
      contient(q1, ["peur de m'ennuyer", 'ca me soule', 'ça me soûle']) ||
      contient(q3, ['change rien', 'un poil coupable']) ||
      contient(q0, ["au pire c'est pas grave", "je m'en fous"]);
    const inertie =
      signaux.n1.some((s) => s.type === 'vert') ||
      contient(q3, ['honteu', 'degout', 'dégoût', 'fache', 'fâche']);
    if (vraieResistance && !inertie) { score -= 3; marquer('n2', 'rouge', 'vraie résistance (flemme)'); }
    else if (inertie) { score -= 1; marquer('n2', 'orange', 'inertie (ignorable)'); }
    else { score -= 2; marquer('n2', 'orange', 'flemme neutre'); }
  }
  if (contient(q3, ['soulage', 'soulagé', 'tranquille', 'ouf ', 'repos'])) {
    score -= 4; marquer('n2', 'rouge', 'soulagement si pas fait');
  }
  if (contient(q3, ['gene', 'gêne', 'awkward', 'ils vont', 'vont penser', 'je les verrai'])) {
    score -= 3; marquer('n2', 'rouge', 'pression sociale (hameçon)');
  }
  if (contient(q3, ['coupable', 'honte']) && !q3.includes('un poil coupable')) {
    score -= 3; marquer('n2', 'rouge', 'culpabilité (hameçon)');
  }
  if (contient(q1, ['je devrais', 'il faut que', 'obligation'])) {
    score -= 3; marquer('n2', 'rouge', 'obligation déguisée');
  }
  if (contient(q0, ['procrastin', 'ca traine', 'ça traîne', 'encore trainer'])) {
    marquer('n2', 'neutre', 'traîne depuis longtemps');
  }

  /* --- NIVEAU 3 : signaux modérés (±2) --- */
  if (contient(q1, ['why not', 'pourquoi pas', 'ca pourrait', 'ça pourrait'])) {
    score += 2; marquer('n3', 'vert', 'approche modérée');
  }
  if (contient(q1, ['curieu', 'interesse', 'intéressé'])) {
    score += 2; marquer('n3', 'vert', 'curiosité');
  }
  if (contient(q3, ['dommage', 'maybe deg'])) {
    score += 2; marquer('n3', 'vert', 'regret modéré');
  }
  if (contient(q1, ['bof', 'mouais', 'meh'])) {
    score -= 2; marquer('n3', 'orange', 'résistance modérée');
  }
  if (q1.includes('pas envie') && !aFlemme) {
    score -= 2; marquer('n3', 'orange', 'pas envie');
  }
  if (contient(q3, ['change rien', 'rien de special', 'rien de spécial'])) {
    score -= 3; marquer('n3', 'rouge', 'aucun regret');
  }
  if (contient(q3, ["je m'en fous", 'osef', "m'en fiche"])) {
    score -= 2; marquer('n3', 'orange', 'importance nulle');
  }
  if (contient(q2, ['passer le temps', 'en attendant'])) {
    score -= 1; marquer('n3', 'orange', 'tuer le temps');
  }

  /* --- Relativisation : le poids de tout le reste est divisé --- */
  if (contient(q0, ['au pire', 'pas la fin du monde', 'osef', "je m'en fous"])) {
    score = score / 2; marquer('n3', 'neutre', 'relativisation (poids divisé)');
  }

  /* --- NIVEAU 4 : coût énergétique (théorie des cuillères) --- */
  const cout = parseInt(voie.cout, 10) || 0;
  const gain = parseInt(voie.gain, 10) || 0;
  const coutNet = cout - gain;
  const deficit = coutNet - energie;
  const ratio = energie > 0 ? coutNet / energie : 999;
  const aSignalFort = signaux.n1.length > 0;

  if (!aSignalFort && deficit > 0) {
    if (ratio >= 2) { score -= 3; marquer('n4', 'rouge', `dépassement 100 % (${deficit} cuillères)`); }
    else if (ratio >= 1.5) { score -= 2; marquer('n4', 'orange', `dépassement 50 % (${deficit} cuillères)`); }
    else { score -= 1; marquer('n4', 'orange', `léger dépassement (${deficit})`); }
  } else if (aSignalFort && deficit > 0) {
    marquer('n4', 'neutre', 'dépassement noté mais valeur forte');
  }

  return {
    voie,
    score: Math.round(score * 10) / 10,
    signaux,
    cout: coutNet,
    deficit,
  };
}

/* ------------------------------------------------------------------ */
/*  CONSULTATION                                                       */
/* ------------------------------------------------------------------ */

/**
 * @returns { cas, choix, analyses, meilleure, pire, ecart, toutFaible }
 *   cas : 'clair' | 'dilemme' | 'pileouface' | 'aucune'
 *   choix : nom de la voie, ou null quand l'oracle ne tranche pas
 */
export function consulter(voies, energie = 3, reponseQ0 = '') {
  const valides = voies.filter((v) => (v.nom || '').trim());
  if (valides.length < 2) return null;

  const q0 = (reponseQ0 || '').toLowerCase();
  const analyses = valides.map((v) => noterVoie(v, energie, q0));
  analyses.sort((a, b) => b.score - a.score);

  const meilleure = analyses[0];
  const pire = analyses[analyses.length - 1];
  const ecart = Math.round((meilleure.score - pire.score) * 10) / 10;
  const toutFaible = analyses.every((a) => a.score < 0);

  const moinsChere = analyses.reduce((a, b) => (a.cout < b.cout ? a : b));
  const plusGenereuse = analyses.reduce((a, b) =>
    (parseInt(a.voie.gain, 10) || 0) > (parseInt(b.voie.gain, 10) || 0) ? a : b
  );

  let cas = 'dilemme';
  let choix = meilleure.voie.nom;

  if (ecart >= 5 && !toutFaible) {
    cas = 'clair';
  } else if (!toutFaible) {
    const conflitEnergie = meilleure.deficit > 2 && meilleure.signaux.n1.length > 0;
    if (!conflitEnergie) {
      const gainDifferent =
        moinsChere.voie.nom !== plusGenereuse.voie.nom &&
        (parseInt(plusGenereuse.voie.gain, 10) || 0) > 0;
      if (gainDifferent) { cas = 'pileouface'; choix = null; }
      else { choix = moinsChere.voie.nom; }
    }
  } else {
    cas = 'aucune';
    choix = null;
  }

  return {
    cas, choix, analyses, meilleure, pire, ecart, toutFaible,
    moinsChere: moinsChere.voie.nom,
    plusGenereuse: plusGenereuse.voie.nom,
    exaequo: analyses.map((a) => a.voie.nom),
  };
}

/** Tirage au sort, pour le cas « pile ou face ». `alea` injectable. */
export function tirerAuSort(verdict, alea = Math.random) {
  const lot = verdict.exaequo;
  return lot[Math.floor(alea() * lot.length)];
}
