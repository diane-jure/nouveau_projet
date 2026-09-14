/**
 * ORACLE — le moteur de verdict.
 *
 * Regle du fichier : AUCUN texte destine a l'ecran ici. Le moteur ne produit
 * que des nombres et des codes ('TETE', 'peurQuiCompte'...). Toute la parole
 * vit dans phrases.js. On peut donc reecrire entierement le ton de l'oracle
 * sans risquer de casser un calcul, et tester le calcul sans lire un mot.
 *
 * Fonctions pures, sans etat, sans acces au DOM : utilisables tel quel dans
 * le navigateur comme dans les tests node.
 */

import { ECHELLES, POIDS, SEUILS } from './scales.js';

const arrondi = (n) => Math.round(n * 100) / 100;

/** Q0 ne marque aucun point : il choisit le jeu de poids. */
export function enjeuDe(q0) {
  return ECHELLES.q0.valeurs[q0]?.enjeu ?? 'moyen';
}

function barreau(question, cle, defaut) {
  return ECHELLES[question].valeurs[cle] ?? ECHELLES[question].valeurs[defaut];
}

/**
 * Note une option. Trois axes ponderes, plus des bonus conditionnels qui
 * encodent les lecons de l'historique.
 */
export function evaluerOption(option, enjeu) {
  const p = POIDS[enjeu] ?? POIDS.moyen;
  const q1 = barreau('q1', option.q1, 'bof');
  const q2 = barreau('q2', option.q2, 'rien');
  const q3 = barreau('q3', option.q3, 'rien');

  const sensation = arrondi(q1.valence * p.sensation);
  const gain = arrondi(q2.score * p.gain);
  const regret = arrondi(q3.score * p.regret);

  const bonus = [];

  // La peur devant + du regret derriere = ce n'est pas un refus, c'est un enjeu.
  // Sans cette regle, l'outil deconseille systematiquement ce qui fait peur,
  // or l'historique montre que c'est la que sont les bonnes decisions.
  if (q1.peur >= 1 && q3.score >= 2) {
    bonus.push({ cle: 'peurQuiCompte', valeur: enjeu === 'lourd' ? 1.5 : 1 });
  }

  // La peur devant + du soulagement derriere = la peur dit vraiment non.
  // C'est le cas du week-end a Lyon dans l'historique.
  if (q1.peur >= 2 && q3.score <= 0) {
    bonus.push({ cle: 'peurQuiProtege', valeur: -1 });
  }

  // Une parole donnee ne se met pas dans la balance des envies.
  if (option.engagement) {
    bonus.push({ cle: 'engagement', valeur: SEUILS.engagement });
  }

  const sommeBonus = bonus.reduce((s, b) => s + b.valeur, 0);
  const total = arrondi(sensation + gain + regret + sommeBonus);

  // Quel axe porte la decision : sert a phrases.js pour motiver le verdict.
  const axes = [
    { cle: 'sensation', valeur: sensation },
    { cle: 'gain', valeur: gain },
    { cle: 'regret', valeur: regret },
  ];
  const dominante = axes.reduce((a, b) =>
    Math.abs(b.valeur) > Math.abs(a.valeur) ? b : a
  ).cle;

  return {
    nom: option.nom,
    index: option.index,
    engagement: !!option.engagement,
    notes: option.notes ?? {},
    reponses: { q1: option.q1, q2: option.q2, q3: option.q3 },
    detail: { sensation, gain, regret, bonus, sommeBonus, q1, q2, q3, dominante },
    total,
  };
}

/**
 * Consulte l'oracle sur un dilemme complet.
 * Renvoie un classement + un type de verdict + des drapeaux, jamais du texte.
 */
export function consulter(dilemme) {
  const enjeu = enjeuDe(dilemme.q0);
  const options = (dilemme.options ?? [])
    .map((o, index) => ({ ...o, index }))
    .filter((o) => (o.nom ?? '').trim() !== '');

  if (options.length < 2) return null;

  const evaluees = options.map((o) => evaluerOption(o, enjeu));

  // Tri par total ; a egalite, l'energie du moment departage.
  const classement = [...evaluees].sort(
    (a, b) => b.total - a.total || b.detail.sensation - a.detail.sensation
  );
  const [premier, second] = classement;
  const ecart = arrondi(premier.total - second.total);

  // Toutes les options a portee du premier : candidates au pile ou face.
  const exaequo = classement.filter((o) => premier.total - o.total < SEUILS.serre);

  const drapeaux = [];

  // Rien ne t'appelle : score faible ET (aucune envie OU aucun regret).
  // C'est le moment de proposer une option C plutot que de trancher.
  const aucuneEnvie = evaluees.every((o) => o.detail.q1.valence <= 0);
  const aucunRegret = evaluees.every((o) => o.detail.q3.score <= 0.5);
  if (premier.total <= SEUILS.faible && (aucuneEnvie || aucunRegret)) {
    drapeaux.push('aucuneNAppelle');
  }

  // Grosse decision : l'enjeu est lourd ET les options sont chargees.
  // On nomme le dilemme avant de conseiller, on ne se contente pas de trancher.
  const intensite = Math.max(
    ...evaluees.map((o) => o.detail.q2.score + Math.abs(o.detail.q3.score) + o.detail.q1.peur)
  );
  if (enjeu === 'lourd' && intensite >= SEUILS.intensite) {
    drapeaux.push('grandeDecision');
  }

  if (premier.detail.bonus.some((b) => b.cle === 'engagement')) drapeaux.push('engagement');
  if (premier.detail.bonus.some((b) => b.cle === 'peurQuiCompte')) drapeaux.push('peurQuiCompte');
  if (evaluees.some((o) => o.detail.bonus.some((b) => b.cle === 'peurQuiProtege'))) {
    drapeaux.push('peurQuiProtege');
  }

  // Quand ca ne comptera pas dans 10 jours et que c'est serre : arrete de calculer.
  let type = 'TETE';
  if (ecart < SEUILS.serre) type = enjeu === 'leger' ? 'PILE_OU_FACE' : 'SERRE';

  return {
    enjeu,
    type,
    classement,
    gagnant: premier,
    dauphin: second,
    exaequo,
    ecart,
    intensite: arrondi(intensite),
    drapeaux,
    dominante: premier.detail.dominante,
  };
}

/** Tirage au sort parmi les ex aequo. `alea` injectable pour les tests. */
export function pileOuFace(verdict, alea = Math.random) {
  const lot = verdict.exaequo.length ? verdict.exaequo : verdict.classement;
  return lot[Math.floor(alea() * lot.length)];
}

/** Un dilemme est consultable des que 2 options sont entierement remplies. */
export function estComplet(dilemme) {
  const remplies = (dilemme.options ?? []).filter(
    (o) => (o.nom ?? '').trim() && o.q1 && o.q2 && o.q3
  );
  return !!dilemme.q0 && remplies.length >= 2;
}
