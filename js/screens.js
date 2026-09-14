/**
 * SCREENS — un ecran = une fonction qui rend du DOM.
 *
 * Aucun calcul de verdict (c'est oracle.js), aucun texte en dur
 * (c'est phrases.js), aucun acces direct au stockage hors de storage.js.
 */

import { el, vider, fenetre, menu, jauge, avancee, dialogue, amener } from './kit.js';
import { Q0, QUESTIONS_OPTION, SATISFACTIONS } from './scales.js';
import { consulter, pileOuFace, estComplet } from './oracle.js';
import { composerVerdict, phraseTirage, INTERFACE as T } from './phrases.js';
import { magasin, brouillon, statistiques } from './storage.js';
import { son } from './audio.js';

export const ETAPES = ['seuil', 'options', 'sensation', 'gain', 'regret', 'oracle'];

const LETTRES = 'ABCDEFGH';
const entreesDe = (question) =>
  Object.entries(question.valeurs).map(([cle, v]) => ({ cle, label: v.label }));
const nommees = (d) => d.options.filter((o) => (o.nom ?? '').trim() !== '');

/* ------------------------------------------------------------------ */
/*  ECRAN TITRE                                                        */
/* ------------------------------------------------------------------ */

export async function ecranTitre(app) {
  const tout = await magasin.lister();
  const s = statistiques(tout);
  const enCours = brouillon.lire();

  return el('div', { class: 'titre' },
    el('h1', { class: 'titre__logo' }, T.titre),
    el('p', { class: 'titre__sous pixel-texte' }, T.sousTitre),
    el('p', { class: 'titre__demarrer pixel-chrome' }, T.commencer),
    el('div', { class: 'scene__pied', style: 'justify-content:center' },
      enCours && el('button', {
        class: 'bouton bouton--fantome',
        onclick: () => { app.dilemme = enCours; son.valider(); app.aller(enCours.q0 ? 'options' : 'seuil'); },
      }, T.reprendre),
      el('button', {
        class: 'bouton',
        onclick: () => { son.valider(); app.nouveau(); },
      }, T.nouveauDilemme),
      el('button', {
        class: 'bouton bouton--fantome',
        onclick: () => { son.valider(); app.aller('journal'); },
      }, T.journal)
    ),
    s.total > 0 && el('div', { class: 'titre__stats pixel-chrome' },
      el('span', { class: 'titre__stat' }, el('b', {}, String(s.total)), ' dilemmes'),
      s.enAttente > 0 && el('span', { class: 'titre__stat' },
        el('b', {}, String(s.enAttente)), ' sans retour'),
      s.clos > 0 && el('span', { class: 'titre__stat' },
        el('b', {}, `${s.reussites}/${s.clos}`), ' satisfaisants')
    )
  );
}

/* ------------------------------------------------------------------ */
/*  Q0 — LE SEUIL                                                      */
/* ------------------------------------------------------------------ */

export function ecranSeuil(app) {
  const d = app.dilemme;
  return el('div', { class: 'scene__corps' },
    entete(Q0.titre, Q0.aide),
    fenetre(null,
      menu(entreesDe(Q0), {
        valeur: d.q0,
        nom: Q0.titre,
        surChoix: (cle) => {
          d.q0 = cle;
          app.sauverBrouillon();
          son.valider();
          setTimeout(() => app.aller('options'), 180);
        },
      })
    ),
    pied(app, { retour: () => app.aller('titre') })
  );
}

/* ------------------------------------------------------------------ */
/*  LES CHEMINS — nommer les options                                   */
/* ------------------------------------------------------------------ */

export function ecranOptions(app) {
  const d = app.dilemme;
  let suite;

  const verifier = () => { suite.disabled = nommees(d).length < 2; };

  const grille = el('div', { class: 'chemins' },
    d.options.map((o, i) => fenetre(null,
      el('div', { class: 'chemin__entete' },
        el('span', { class: 'chemin__lettre' }, LETTRES[i]),
        el('input', {
          class: 'champ chemin__nom',
          type: 'text',
          value: o.nom ?? '',
          placeholder: T.options.place(i),
          'aria-label': T.options.place(i),
          oninput: (e) => { o.nom = e.target.value; verifier(); app.sauverBrouillon(); },
        })
      ),
      el('label', { class: 'chemin__engagement' },
        el('input', {
          type: 'checkbox',
          checked: !!o.engagement,
          onchange: (e) => { o.engagement = e.target.checked; son.deplacer(); app.sauverBrouillon(); },
        }),
        el('span', {}, 'Quelqu’un compte dessus')
      ),
      d.options.length > 2 && el('button', {
        class: 'hud__bouton',
        onclick: () => { d.options.splice(i, 1); son.retour(); app.rendre(); },
      }, T.options.retirer)
    ))
  );

  suite = el('button', {
    class: 'bouton',
    onclick: () => { son.valider(); app.aller('sensation'); },
  }, T.suite);

  const ecran = el('div', {},
    entete(T.options.titre, T.options.aide),
    grille,
    d.options.length < 4 && el('button', {
      class: 'bouton bouton--fantome',
      onclick: () => {
        d.options.push({ nom: '', q1: null, q2: null, q3: null, engagement: false, notes: {} });
        son.deplacer();
        app.rendre();
      },
    }, T.options.ajouter),
    pied(app, { retour: () => app.aller('seuil'), suite })
  );

  verifier();
  return ecran;
}

/* ------------------------------------------------------------------ */
/*  Q1 / Q2 / Q3 — une question, toutes les options en vis-a-vis       */
/* ------------------------------------------------------------------ */

export function ecranQuestion(app, etape) {
  const d = app.dilemme;
  const question = QUESTIONS_OPTION.find((q) => q.etape === etape);
  const cle = question.cle;
  const liste = nommees(d);
  let suite;

  const verifier = () => { suite.disabled = liste.some((o) => !o[cle]); };

  const grille = el('div', { class: 'chemins' },
    liste.map((o) => fenetre(null,
      el('div', { class: 'chemin__entete' },
        el('span', { class: 'chemin__lettre' }, LETTRES[d.options.indexOf(o)]),
        el('span', { class: 'chemin__nom' }, o.nom)
      ),
      menu(entreesDe(question), {
        valeur: o[cle],
        nom: `${question.titre} — ${o.nom}`,
        surChoix: (v) => { o[cle] = v; son.valider(); verifier(); app.sauverBrouillon(); },
      }),
      el('input', {
        class: 'champ',
        type: 'text',
        style: 'margin-top:calc(var(--px)*2)',
        value: o.notes?.[cle] ?? '',
        placeholder: T.note.place,
        'aria-label': `${T.note.place} — ${o.nom}`,
        oninput: (e) => { (o.notes ??= {})[cle] = e.target.value; app.sauverBrouillon(); },
      })
    ))
  );

  const suivante = { sensation: 'gain', gain: 'regret', regret: 'oracle' }[etape];
  const precedente = { sensation: 'options', gain: 'sensation', regret: 'gain' }[etape];

  suite = el('button', {
    class: 'bouton',
    onclick: () => { son.valider(); app.aller(suivante); },
  }, etape === 'regret' ? T.consulter : T.suite);

  const ecran = el('div', {},
    entete(question.titre, question.aide),
    grille,
    el('p', { class: 'aide', style: 'text-align:center' }, T.note.aide),
    pied(app, { retour: () => app.aller(precedente), suite })
  );

  verifier();
  return ecran;
}

/* ------------------------------------------------------------------ */
/*  LE VERDICT                                                         */
/* ------------------------------------------------------------------ */

export function ecranOracle(app) {
  const d = app.dilemme;
  const v = consulter(d);

  if (!v) {
    return el('div', {},
      entete(T.options.titre, T.options.aide),
      pied(app, { retour: () => app.aller('options') })
    );
  }

  // On fige le verdict dans le dilemme : le journal doit garder ce qui a
  // ete dit au moment ou ca a ete dit, meme si le bareme evolue ensuite.
  d.verdict = {
    gagnant: v.gagnant.nom,
    type: v.type,
    ecart: v.ecart,
    enjeu: v.enjeu,
    drapeaux: v.drapeaux,
    scores: v.classement.map((o) => ({ nom: o.nom, total: o.total })),
  };
  app.enregistrer();

  const apresTexte = el('div', { style: 'display:none' });
  const boite = dialogue(composerVerdict(v), {
    son: son.frappe,
    surFin: () => { apresTexte.style.display = ''; amener(apresTexte); },
  });

  son.verdict();

  // Pile ou face : la piece n'apparait que quand l'oracle refuse de trancher.
  if (v.type === 'PILE_OU_FACE') {
    const piece = el('span', { class: 'piece' });
    const sortie = el('p', { class: 'dialogue__ligne pixel-texte', style: 'text-align:center' });
    const lancer = el('button', {
      class: 'bouton',
      onclick: () => {
        piece.dataset.tourne = 'true';
        lancer.disabled = true;
        const bruit = setInterval(son.piece, 90);
        setTimeout(() => {
          clearInterval(bruit);
          piece.dataset.tourne = 'false';
          const tire = pileOuFace(v);
          d.tirage = tire.nom;
          app.enregistrer();
          sortie.textContent = phraseTirage(tire, tire.nom.length);
          lancer.disabled = false;
          lancer.textContent = T.relancer;
          son.verdict();
        }, 1400);
      },
    }, T.lancerPiece);

    apresTexte.append(
      el('div', { style: 'display:grid; gap:calc(var(--px)*3); justify-items:center' },
        piece, lancer, sortie)
    );
  }

  apresTexte.append(detailDuCalcul(v), el('div', { class: 'scene__pied' },
    el('button', {
      class: 'bouton bouton--fantome',
      onclick: () => { son.valider(); app.aller('retour'); },
    }, T.retourExperience.titre),
    el('button', {
      class: 'bouton',
      onclick: () => { son.valider(); app.nouveau(); },
    }, T.nouveauDilemme)
  ));

  return el('div', { onclick: () => boite.terminer() },
    el('p', { class: 'verdict__enjeu pixel-chrome' }, T.verdict.enjeux[v.enjeu]),
    fenetre(null, boite.noeud),
    apresTexte
  );
}

/** Le detail du calcul, replie par defaut : l'oracle doit pouvoir se justifier. */
function detailDuCalcul(v) {
  return el('details', { class: 'repli' },
    el('summary', {}, T.verdict.detail),
    el('div', { class: 'verdict__scores' },
      v.classement.map((o, rang) => el('div', { class: 'score', dataset: { rang: String(rang) } },
        el('div', { class: 'score__entete' },
          el('span', { class: 'score__nom' }, o.nom),
          el('span', { class: 'score__total pixel-chrome' }, String(o.total))
        ),
        jauge(T.verdict.axes.sensation, o.detail.sensation),
        jauge(T.verdict.axes.gain, o.detail.gain),
        jauge(T.verdict.axes.regret, o.detail.regret),
        o.detail.bonus.length > 0 && el('div', { class: 'score__bonus' },
          o.detail.bonus.map((b) => el('span', {
            class: b.valeur < 0 ? 'etiquette etiquette--sourdine' : 'etiquette',
          }, `${T.verdict.bonus[b.cle] ?? b.cle} ${b.valeur > 0 ? '+' : ''}${b.valeur}`))
        )
      ))
    )
  );
}

/* ------------------------------------------------------------------ */
/*  APRES COUP — ce qui boucle la pratique                             */
/* ------------------------------------------------------------------ */

export function ecranRetour(app) {
  const d = app.dilemme;
  const choix = [
    ...nommees(d).map((o) => ({ cle: o.nom, label: o.nom })),
    { cle: 'autre', label: T.retourExperience.autre },
  ];

  return el('div', {},
    entete(T.retourExperience.titre, T.retourExperience.aide),
    fenetre(T.retourExperience.choixFinal,
      menu(choix, {
        valeur: d.choixFinal,
        nom: T.retourExperience.choixFinal,
        surChoix: (v) => { d.choixFinal = v; son.valider(); app.enregistrer(); },
      })
    ),
    fenetre(T.retourExperience.satisfaction,
      menu(Object.entries(SATISFACTIONS).map(([cle, s]) => ({ cle, label: s.label })), {
        valeur: d.satisfaction,
        nom: T.retourExperience.satisfaction,
        surChoix: (v) => { d.satisfaction = v; son.valider(); app.enregistrer(); },
      })
    ),
    fenetre(T.retourExperience.commentaire,
      el('textarea', {
        class: 'champ',
        value: d.commentaire ?? '',
        'aria-label': T.retourExperience.commentaire,
        oninput: (e) => { d.commentaire = e.target.value; },
        onchange: () => app.enregistrer(),
      })
    ),
    el('div', { class: 'scene__pied' },
      el('button', {
        class: 'bouton bouton--fantome',
        onclick: () => { son.retour(); app.aller('oracle'); },
      }, T.retour),
      el('button', {
        class: 'bouton',
        onclick: () => {
          d.cloture = true;
          app.enregistrer();
          brouillon.effacer();
          son.valider();
          app.aller('journal');
        },
      }, T.retourExperience.enregistrer)
    )
  );
}

/* ------------------------------------------------------------------ */
/*  JOURNAL                                                            */
/* ------------------------------------------------------------------ */

export async function ecranJournal(app) {
  const tout = await magasin.lister();
  const s = statistiques(tout);

  const fichier = el('input', {
    type: 'file', accept: 'application/json', style: 'display:none',
    onchange: async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      try {
        const n = await magasin.importer(await f.text());
        app.annoncer(`${n} dilemme${n > 1 ? 's' : ''} importé${n > 1 ? 's' : ''}.`);
      } catch (err) {
        app.annoncer(err.message);
      }
      app.rendre();
    },
  });

  return el('div', {},
    entete(T.journalEcran.titre,
      s.clos > 0 ? T.journalEcran.accord(s.suivis, s.clos) : ''),
    s.enAttente > 0 && el('p', { class: 'aide', style: 'text-align:center;color:var(--alerte)' },
      T.journalEcran.enAttente(s.enAttente)),
    tout.length === 0
      ? el('p', { class: 'aide', style: 'text-align:center' }, T.journalEcran.vide)
      : el('div', { class: 'journal' }, tout.map((d) => entreeJournal(app, d))),
    el('div', { class: 'scene__pied' },
      el('button', {
        class: 'bouton bouton--fantome',
        onclick: () => { son.retour(); app.aller('titre'); },
      }, T.retour),
      el('button', {
        class: 'bouton bouton--fantome',
        onclick: async () => {
          const url = URL.createObjectURL(
            new Blob([await magasin.exporter()], { type: 'application/json' })
          );
          const a = el('a', { href: url, download: `oracle-${new Date().toISOString().slice(0, 10)}.json` });
          document.body.append(a); a.click(); a.remove();
          URL.revokeObjectURL(url);
        },
      }, T.journalEcran.exporter),
      el('button', {
        class: 'bouton bouton--fantome',
        onclick: () => fichier.click(),
      }, T.journalEcran.importer),
      tout.length > 0 && el('button', {
        class: 'bouton bouton--danger',
        onclick: async () => {
          if (!confirm(T.journalEcran.confirmerEffacer)) return;
          await magasin.vider();
          app.rendre();
        },
      }, T.journalEcran.effacer),
      fichier
    )
  );
}

function entreeJournal(app, d) {
  const date = new Date(d.date);
  const jour = Number.isNaN(date.valueOf()) ? '' : date.toLocaleDateString('fr-FR');
  const options = (d.options ?? []).map((o) => o.nom).filter(Boolean);

  return el('article', { class: 'journal__entree', dataset: { satisfaction: d.satisfaction ?? '' } },
    el('div', { class: 'journal__date' }, jour),
    el('div', { class: 'journal__titre' }, options.join('  /  ')),
    d.verdict && el('div', { class: 'journal__ligne' },
      `${T.journalEcran.oracleDit} : `, el('b', {}, d.verdict.gagnant),
      d.verdict.type !== 'TETE' ? ` (${d.verdict.type === 'SERRE' ? 'serré' : 'pile ou face'})` : ''),
    d.choixFinal && el('div', { class: 'journal__ligne' },
      `${T.journalEcran.tuAsFait} : `, el('b', {}, d.choixFinal),
      d.satisfaction ? `  ${SATISFACTIONS[d.satisfaction].signe}` : ''),
    d.commentaire && el('div', { class: 'journal__ligne' }, d.commentaire),
    el('div', { class: 'journal__actions' },
      !d.satisfaction && el('button', {
        class: 'hud__bouton',
        onclick: () => { app.dilemme = d; son.valider(); app.aller('retour'); },
      }, 'Compléter'),
      el('button', {
        class: 'hud__bouton',
        onclick: async () => { await magasin.supprimer(d.id); son.retour(); app.rendre(); },
      }, 'Supprimer')
    )
  );
}

/* ------------------------------------------------------------------ */
/*  MORCEAUX PARTAGES                                                  */
/* ------------------------------------------------------------------ */

function entete(question, aide) {
  return el('header', { class: 'scene__entete' },
    el('h2', { class: 'scene__question' }, question),
    aide && el('p', { class: 'scene__aide pixel-texte' }, aide)
  );
}

function pied(app, { retour, suite } = {}) {
  return el('div', { class: 'scene__pied' },
    retour && el('button', {
      class: 'bouton bouton--fantome',
      onclick: () => { son.retour(); retour(); },
    }, T.retour),
    suite ?? null
  );
}
