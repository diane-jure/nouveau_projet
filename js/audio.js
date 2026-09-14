/**
 * AUDIO — bips carres synthetises a la volee. Aucun fichier son, aucun
 * telechargement. Coupable a tout moment, etat conserve dans les reglages.
 */

import { reglages } from './storage.js';

let contexte = null;
let actif = true;

function ctx() {
  if (!contexte) {
    const C = window.AudioContext ?? window.webkitAudioContext;
    if (!C) return null;
    contexte = new C();
  }
  if (contexte.state === 'suspended') contexte.resume();
  return contexte;
}

function bip(frequence, duree = 0.06, type = 'square', volume = 0.04) {
  if (!actif) return;
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = frequence;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duree);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duree);
}

export const son = {
  init() {
    actif = reglages.lire().son !== false;
    return actif;
  },
  actif: () => actif,
  basculer() {
    actif = !actif;
    reglages.ecrire({ son: actif });
    if (actif) son.valider();
    return actif;
  },
  frappe:  () => bip(880, 0.012, 'square', 0.012),
  deplacer:() => bip(440, 0.04),
  valider: () => bip(660, 0.07),
  retour:  () => bip(330, 0.06),
  piece:   () => bip(1200, 0.03, 'square', 0.03),
  verdict() {
    if (!actif) return;
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => bip(f, 0.16, 'square', 0.05), i * 110));
  },
};
