/**
 * STORAGE — la couche de sauvegarde, et elle seule.
 *
 * Le reste de l'application ne connait que l'interface ci-dessous. Passer a
 * Supabase = reecrire ce seul fichier, sans toucher a une ligne d'UI :
 *
 *   export const magasin = {
 *     async lister()           -> Dilemme[]   (du plus recent au plus ancien)
 *     async enregistrer(d)     -> Dilemme     (cree ou met a jour selon d.id)
 *     async supprimer(id)      -> void
 *     async vider()            -> void
 *     async exporter()         -> string (JSON)
 *     async importer(json)     -> nombre d'entrees ajoutees
 *   }
 *
 * Le schema SQL correspondant est donne dans le README.
 * Toutes les methodes sont async DES MAINTENANT, meme si localStorage est
 * synchrone : c'est ce qui rendra la bascule Supabase invisible.
 */

const CLE = 'oracle.dilemmes.v1';
const CLE_BROUILLON = 'oracle.brouillon.v1';
const CLE_REGLAGES = 'oracle.reglages.v1';

/** localStorage peut lever (navigation privee, cookies bloques). */
function lireBrut(cle, defaut) {
  try {
    const brut = localStorage.getItem(cle);
    return brut ? JSON.parse(brut) : defaut;
  } catch {
    return defaut;
  }
}

function ecrireBrut(cle, valeur) {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
    return true;
  } catch {
    return false;
  }
}

export function nouvelId() {
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Forme d'un dilemme enregistre. C'est aussi la forme de la table Supabase,
 * options / verdict / notes partant dans des colonnes jsonb.
 */
export function dilemmeVierge() {
  return {
    id: nouvelId(),
    date: new Date().toISOString(),
    q0: null,
    options: [
      { nom: '', q1: null, q2: null, q3: null, engagement: false, notes: {} },
      { nom: '', q1: null, q2: null, q3: null, engagement: false, notes: {} },
    ],
    verdict: null,       // instantane du moteur au moment de la consultation
    tirage: null,        // resultat du pile ou face, le cas echeant
    choixFinal: null,    // ce qui a ete fait pour de vrai
    satisfaction: null,  // 'good' | 'meh' | 'bad'
    commentaire: '',
    cloture: false,
  };
}

export const magasin = {
  async lister() {
    const tout = lireBrut(CLE, []);
    return [...tout].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  },

  async enregistrer(dilemme) {
    const tout = lireBrut(CLE, []);
    const d = { ...dilemme, id: dilemme.id ?? nouvelId() };
    const i = tout.findIndex((x) => x.id === d.id);
    if (i >= 0) tout[i] = d;
    else tout.push(d);
    ecrireBrut(CLE, tout);
    return d;
  },

  async supprimer(id) {
    ecrireBrut(CLE, lireBrut(CLE, []).filter((d) => d.id !== id));
  },

  async vider() {
    ecrireBrut(CLE, []);
  },

  async exporter() {
    return JSON.stringify(
      { version: 1, exporte: new Date().toISOString(), dilemmes: lireBrut(CLE, []) },
      null,
      2
    );
  },

  /** Import additif et idempotent : les id deja connus ne sont pas dupliques. */
  async importer(json) {
    let charge;
    try {
      charge = JSON.parse(json);
    } catch {
      throw new Error('Fichier illisible : ce n\'est pas du JSON valide.');
    }
    const entrantes = Array.isArray(charge) ? charge : charge?.dilemmes;
    if (!Array.isArray(entrantes)) {
      throw new Error('Fichier inattendu : aucune liste de dilemmes trouvée.');
    }
    const tout = lireBrut(CLE, []);
    const connus = new Set(tout.map((d) => d.id));
    let ajoutes = 0;
    for (const d of entrantes) {
      if (!d || typeof d !== 'object') continue;
      const id = d.id ?? nouvelId();
      if (connus.has(id)) continue;
      tout.push({ ...dilemmeVierge(), ...d, id });
      connus.add(id);
      ajoutes++;
    }
    ecrireBrut(CLE, tout);
    return ajoutes;
  },
};

/* --- Brouillon : le dilemme en cours survit a un rafraichissement --- */

export const brouillon = {
  lire() {
    return lireBrut(CLE_BROUILLON, null);
  },
  ecrire(dilemme) {
    ecrireBrut(CLE_BROUILLON, dilemme);
  },
  effacer() {
    try {
      localStorage.removeItem(CLE_BROUILLON);
    } catch {
      /* sans importance */
    }
  },
};

/* --- Reglages (son, etc.) --- */

export const reglages = {
  lire() {
    return { son: true, ...lireBrut(CLE_REGLAGES, {}) };
  },
  ecrire(patch) {
    const suivant = { ...reglages.lire(), ...patch };
    ecrireBrut(CLE_REGLAGES, suivant);
    return suivant;
  },
};

/** Statistiques du journal, pour l'ecran d'accueil. */
export function statistiques(dilemmes) {
  const clos = dilemmes.filter((d) => d.choixFinal && d.satisfaction);
  const enAttente = dilemmes.filter((d) => d.verdict && !d.satisfaction).length;
  const suivis = clos.filter((d) => d.verdict?.gagnant === d.choixFinal);
  const reussites = clos.filter((d) => d.satisfaction === 'good').length;
  return {
    total: dilemmes.length,
    clos: clos.length,
    enAttente,
    suivis: suivis.length,
    reussites,
  };
}
