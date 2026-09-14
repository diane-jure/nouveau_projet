/**
 * MAIN — l'assemblage : etat courant, routage entre ecrans, HUD.
 * Ce fichier ne decide rien : il oriente.
 */

import { el, vider, avancee } from './kit.js';
import * as ecrans from './screens.js';
import { ETAPES } from './screens.js';
import { magasin, brouillon, dilemmeVierge } from './storage.js';
import { INTERFACE as T } from './phrases.js';
import { son } from './audio.js';

const racine = document.documentElement;
const scene = document.getElementById('scene');
const hudEtape = document.getElementById('hud-etape');
const hudAvancee = document.getElementById('hud-avancee');
const hudSon = document.getElementById('hud-son');
const annonce = document.getElementById('annonce');

/** Quelle etape colore l'ecran (cf. palette.css). */
const ETAPE_DE = {
  titre: 'titre', seuil: 'seuil', options: 'options',
  sensation: 'sensation', gain: 'gain', regret: 'regret',
  oracle: 'oracle', retour: 'oracle', journal: 'journal',
};

const app = {
  dilemme: null,
  ecran: 'titre',

  aller(nom) {
    this.ecran = nom;
    this.rendre();
  },

  nouveau() {
    this.dilemme = dilemmeVierge();
    brouillon.ecrire(this.dilemme);
    this.aller('seuil');
  },

  sauverBrouillon() {
    if (this.dilemme) brouillon.ecrire(this.dilemme);
  },

  /** Le dilemme entre au journal des la consultation, pas a la cloture. */
  async enregistrer() {
    if (!this.dilemme) return;
    this.sauverBrouillon();
    await magasin.enregistrer(this.dilemme);
  },

  annoncer(message) {
    annonce.textContent = message;
    annonce.hidden = false;
    clearTimeout(this._minuteurAnnonce);
    this._minuteurAnnonce = setTimeout(() => { annonce.hidden = true; }, 4000);
  },

  async rendre() {
    const nom = this.ecran;
    racine.dataset.etape = ETAPE_DE[nom] ?? 'titre';

    // Un dilemme est obligatoire partout sauf au titre et au journal.
    if (!this.dilemme && !['titre', 'journal'].includes(nom)) return this.aller('titre');

    const fabriques = {
      titre: () => ecrans.ecranTitre(this),
      seuil: () => ecrans.ecranSeuil(this),
      options: () => ecrans.ecranOptions(this),
      sensation: () => ecrans.ecranQuestion(this, 'sensation'),
      gain: () => ecrans.ecranQuestion(this, 'gain'),
      regret: () => ecrans.ecranQuestion(this, 'regret'),
      oracle: () => ecrans.ecranOracle(this),
      retour: () => ecrans.ecranRetour(this),
      journal: () => ecrans.ecranJournal(this),
    };

    const contenu = await fabriques[nom]();
    vider(scene).append(contenu);

    // HUD
    const i = ETAPES.indexOf(nom);
    hudEtape.textContent = T.etapes[ETAPE_DE[nom]] ?? '';
    vider(hudAvancee);
    if (i >= 0) hudAvancee.append(avancee(ETAPES, nom));

    window.scrollTo({ top: 0, behavior: 'instant' });
    scene.querySelector('input, button, textarea')?.focus({ preventScroll: true });
  },
};

/* --- HUD : son et raccourci journal --- */

function rafraichirSon() {
  const actif = son.actif();
  hudSon.textContent = actif ? 'SON ON' : 'SON OFF';
  hudSon.setAttribute('aria-pressed', String(actif));
}

hudSon.addEventListener('click', () => { son.basculer(); rafraichirSon(); });

document.getElementById('hud-journal').addEventListener('click', () => {
  son.valider();
  app.aller(app.ecran === 'journal' ? 'titre' : 'journal');
});

/* --- Clavier : Entree lance un dilemme depuis le titre, Echap revient --- */

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && app.ecran === 'titre' && ev.target === document.body) {
    ev.preventDefault();
    son.valider();
    app.nouveau();
  }
  if (ev.key === 'Escape' && app.ecran !== 'titre') {
    son.retour();
    app.aller('titre');
  }
});

/* --- Demarrage --- */

son.init();
rafraichirSon();
app.rendre();

// Pratique pour bidouiller depuis la console du navigateur.
window.oracle = app;
