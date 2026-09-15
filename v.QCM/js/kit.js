/**
 * KIT — fabrique de composants DOM. Pas de logique metier, pas de texte
 * en dur (il vient de phrases.js), pas de couleur (elle vient du CSS).
 */

/** Mini-hyperscript : el('div', {class:'x', onclick:f}, 'texte', autreEl) */
export function el(balise, props = {}, ...enfants) {
  const noeud = document.createElement(balise);
  for (const [cle, val] of Object.entries(props ?? {})) {
    if (val === null || val === undefined || val === false) continue;
    if (cle === 'class') noeud.className = val;
    else if (cle === 'dataset') Object.assign(noeud.dataset, val);
    else if (cle.startsWith('on') && typeof val === 'function') {
      noeud.addEventListener(cle.slice(2).toLowerCase(), val);
    } else if (cle in noeud && cle !== 'list') noeud[cle] = val;
    else noeud.setAttribute(cle, val);
  }
  ajouter(noeud, enfants);
  return noeud;
}

function ajouter(parent, enfants) {
  for (const e of enfants.flat(Infinity)) {
    if (e === null || e === undefined || e === false) continue;
    parent.append(e instanceof Node ? e : document.createTextNode(String(e)));
  }
}

export function vider(noeud) {
  while (noeud.firstChild) noeud.firstChild.remove();
  return noeud;
}

/** Fenetre de dialogue JRPG. */
export function fenetre(titre, ...contenu) {
  return el('section', { class: 'fenetre' },
    titre && el('h2', { class: 'fenetre__titre' }, titre),
    ...contenu
  );
}

/**
 * Menu navigable au clavier (fleches + Entree) et a la souris.
 * `entrees` : [{ cle, label, aide }]
 */
export function menu(entrees, { valeur = null, surChoix, nom = 'menu' } = {}) {
  const boite = el('div', { class: 'menu', role: 'radiogroup', 'aria-label': nom });

  const boutons = entrees.map((e) =>
    el('button', {
      type: 'button',
      class: 'menu__item',
      role: 'radio',
      'aria-checked': String(e.cle === valeur),
      dataset: { choisi: String(e.cle === valeur), cle: e.cle },
      onclick: () => { definir(e.cle); surChoix?.(e.cle); },
    }, el('span', {}, e.label))
  );

  /** Met a jour la selection sans re-rendre l'ecran (le focus est conserve). */
  function definir(v) {
    for (const b of boutons) {
      const choisi = b.dataset.cle === String(v);
      b.dataset.choisi = String(choisi);
      b.setAttribute('aria-checked', String(choisi));
    }
  }

  boite.addEventListener('keydown', (ev) => {
    const i = boutons.indexOf(document.activeElement);
    if (i < 0) return;
    const pas = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[ev.key];
    if (!pas) return;
    ev.preventDefault();
    boutons[(i + pas + boutons.length) % boutons.length].focus();
  });

  ajouter(boite, boutons);
  boite.definir = definir;
  return boite;
}

/** Jauge a zero central : positif a droite, negatif a gauche. */
export function jauge(nom, valeur, max = 10) {
  const part = Math.min(Math.abs(valeur) / max, 1) * 50;
  const signe = valeur < 0 ? '-' : '+';
  return el('div', { class: 'jauge' },
    el('span', { class: 'jauge__nom' }, nom),
    el('span', { class: 'jauge__piste' },
      el('span', {
        class: 'jauge__barre',
        dataset: { signe },
        style: valeur < 0
          ? `right:50%; width:${part}%`
          : `left:50%; width:${part}%`,
      })
    ),
    el('span', { class: 'jauge__valeur' }, valeur > 0 ? `+${valeur}` : String(valeur))
  );
}

/** Six blocs d'avancee, un par etape. */
export function avancee(etapes, courante) {
  const i = etapes.indexOf(courante);
  return el('div', { class: 'avancee', 'aria-hidden': 'true' },
    etapes.map((e, n) => el('span', {
      class: 'avancee__bloc',
      dataset: { actif: String(n === i), passe: String(n < i) },
    }))
  );
}

/**
 * Boite de dialogue a frappe machine.
 * Renvoie { noeud, terminer() }. Un clic ou Entree revele tout d'un coup.
 */
export function dialogue(lignes, { vitesse = 18, surFin, son } = {}) {
  const noeud = el('div', { class: 'dialogue pixel-texte' });
  const curseur = el('span', { class: 'dialogue__curseur' }, '▾');
  let index = 0;
  let minuteur = null;
  let fini = false;

  function terminer() {
    if (fini) return;
    fini = true;
    clearInterval(minuteur);
    vider(noeud);
    for (const l of lignes) {
      noeud.append(el('p', { class: 'dialogue__ligne', dataset: { ton: l.ton } }, l.texte));
    }
    noeud.append(curseur);
    surFin?.();
  }

  function ligneSuivante() {
    if (index >= lignes.length) {
      fini = true;
      noeud.append(curseur);
      surFin?.();
      return;
    }
    const l = lignes[index++];
    const p = el('p', { class: 'dialogue__ligne', dataset: { ton: l.ton } });
    noeud.append(p);
    let c = 0;
    minuteur = setInterval(() => {
      if (fini) return clearInterval(minuteur);
      p.textContent = l.texte.slice(0, ++c);
      if (c % 3 === 0) son?.();
      if (c >= l.texte.length) {
        clearInterval(minuteur);
        setTimeout(ligneSuivante, 260);
      }
    }, vitesse);
  }

  ligneSuivante();
  return { noeud, terminer, estFini: () => fini };
}

/** Descend doucement sur l'element (respecte prefers-reduced-motion). */
export function amener(noeud) {
  const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  noeud?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'nearest' });
}
