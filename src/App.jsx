/**
 * APP — le flux de l'application, calqué sur docs/flow.md.
 *
 * Deux règles tenues dans ce fichier :
 *   1. aucune information de style — tout vient de theme.js
 *   2. aucune logique de verdict — tout vient de oracle_brain.js
 *
 * Les encadrés s'empilent : chacun apparaît après validation du bouton
 * précédent, et seul le dernier porte le bouton « revenir ».
 */

import React, { useState, useEffect, useRef } from 'react';
import { consulter, tirerAuSort } from './oracle_brain.js';
import { Icone, Sigil, Coeurs } from './icons.jsx';
import * as S from './theme.js';

const VERSION = 'v0.1';
const MAX_COUT = 5;

const voieVierge = () => ({ nom: '', cout: 0, gain: 0, q1: '', q2: '', q3: '' });
const rempli = (t) => (t || '').trim() !== '';

/* ------------------------------------------------------------------ */
/*  CROCHETS                                                           */
/* ------------------------------------------------------------------ */

function useEstTelephone() {
  const [petit, setPetit] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${S.M.bascule}px)`);
    const maj = () => setPetit(mq.matches);
    maj();
    mq.addEventListener('change', maj);
    return () => mq.removeEventListener('change', maj);
  }, []);
  return petit;
}

/** Frappe machine : le texte s'écrit lettre à lettre. */
function useFrappe(texte, vitesse = 28) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!texte) return;
    const t = setInterval(() => {
      setN((v) => {
        if (v >= texte.length) { clearInterval(t); return v; }
        return v + 1;
      });
    }, vitesse);
    return () => clearInterval(t);
  }, [texte, vitesse]);
  return { visible: (texte || '').slice(0, n), fini: n >= (texte || '').length };
}

/* ------------------------------------------------------------------ */
/*  BRIQUES                                                            */
/* ------------------------------------------------------------------ */

function Panneau({ titre, icone, couleur, onRetour, children }) {
  return (
    <section className={`${S.CL.panneau} ${S.CL.apparait}`}
      style={couleur ? S.panneau(couleur) : S.panneau()}>
      {titre && (
        <header style={couleur ? S.bandeau(couleur) : S.bandeau()}>
          {onRetour && (
            <button style={S.boutonIcone(false)} onClick={onRetour} aria-label="Revenir">
              <Icone nom="retour" contour={S.C.texte} taille={12} />
            </button>
          )}
          {icone && <Icone nom={icone} contour={S.C.texte} remplissage={S.C.page} taille={14} />}
          <span>{titre}</span>
        </header>
      )}
      {children}
    </section>
  );
}

function Bouton({ children, onClick, actif = true, couleur, icone }) {
  return (
    <button style={S.bouton(actif, couleur)} onClick={actif ? onClick : undefined} disabled={!actif}>
      {icone && <Icone nom={icone} contour={S.C.texte} taille={14} />}
      {children}
    </button>
  );
}

function Question({ label, placeholder, valeur, onChange, actif }) {
  return (
    <div style={actif ? undefined : S.verrouille}>
      <label style={S.libelle(actif)}>{label}</label>
      <textarea style={S.champLong(actif)} value={valeur} placeholder={placeholder}
        disabled={!actif} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/**
 * Une ligne de statistique : icône, moins, barre pleine, plus, valeur.
 * C'est le motif de la fiche de personnage — la barre EST le compteur.
 */
function Stat({ icone, label, valeur, max, couleur, onChange }) {
  return (
    <div style={S.ligneStat}>
      <Icone nom={icone} contour={S.C.texteDoux} taille={14} />
      <span style={S.libelle()}>{label}</span>
      {onChange && (
        <button style={S.compteurBouton} onClick={() => onChange(Math.max(0, valeur - 1))}
          aria-label={`${label} moins`}>
          <Icone nom="bas" contour={S.C.texte} taille={9} />
        </button>
      )}
      <span style={S.pisteStat}>
        <span className={S.CL.remplit} style={S.barreStat(valeur / max, couleur)} />
      </span>
      {onChange && (
        <button style={S.compteurBouton} onClick={() => onChange(Math.min(max, valeur + 1))}
          aria-label={`${label} plus`}>
          <Icone nom="haut" contour={S.C.texte} taille={9} />
        </button>
      )}
      <span style={S.valeurStat}>{valeur}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CARTE D'UNE VOIE — fiche de personnage                             */
/* ------------------------------------------------------------------ */

function CarteVoie({ voie, index, surTelephone, score, modifier, retirer, retirable }) {
  const q2Actif = rempli(voie.q1);
  const q3Actif = q2Actif && rempli(voie.q2);

  return (
    <article style={{ ...S.carteVoie(index), position: 'relative' }}>
      {score !== undefined && (
        <span style={S.badgeScore(index)} className={S.CL.scintille}>
          <Icone nom="etoile" contour={S.C.page} taille={10} />{score}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: S.ESPACE.s }}>
        <span style={S.puceVoie(index)} />
        <input style={S.champ()} value={voie.nom} placeholder={`Voie ${index + 1}`}
          onChange={(e) => modifier({ nom: e.target.value })} />
        {retirable && (
          <button style={S.boutonIcone(false)} onClick={retirer} aria-label="Retirer cette voie">
            <Icone nom="ferme" contour={S.C.texteEteint} taille={12} />
          </button>
        )}
      </div>

      <div style={S.corpsCarte(surTelephone)}>
        <div style={{ ...S.medaillon(index, surTelephone), ...S.fondMedaillon(index) }}>
          <span className={`${S.CL.losange} ${S.CL.flotte}`}
            style={{ display: 'grid', placeItems: 'center' }}>
            <Sigil index={index} contour={S.C.contour} remplissage={S.C.page}
              taille={surTelephone ? S.TAILLE_SIGIL.telephone : S.TAILLE_SIGIL.bureau} />
          </span>
        </div>

        <div style={S.colonneCarte}>
          <Question label="Première sensation ?" placeholder="ton instinct..."
            valeur={voie.q1} actif onChange={(v) => modifier({ q1: v })} />

          <Stat icone="coeur" label="COÛT" valeur={voie.cout} max={MAX_COUT}
            couleur={S.C.negatif} onChange={(v) => modifier({ cout: v })} />

          <Question label="Si ça se passe bien ?" placeholder="ça t'apporte..."
            valeur={voie.q2} actif={q2Actif} onChange={(v) => modifier({ q2: v })} />

          <Stat icone="etoile" label="GAIN" valeur={voie.gain} max={MAX_COUT}
            couleur={S.C.positifClair} onChange={(v) => modifier({ gain: v })} />

          <Question label="Si tu l'as pas fait demain ?" placeholder="tu ressens..."
            valeur={voie.q3} actif={q3Actif} onChange={(v) => modifier({ q3: v })} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  JOURNAL — cartes à médaillon, cœurs et citation                    */
/* ------------------------------------------------------------------ */

function Journal({ aventures, onFermer }) {
  const [onglet, setOnglet] = useState('cours');
  const lot = aventures.filter((a) => (onglet === 'cours' ? a.etat <= 2 : a.etat >= 3));

  return (
    <div style={S.voile} onClick={onFermer}>
      <div className={`${S.CL.panneau} ${S.CL.apparait}`} style={S.panneauJournal}
        onClick={(e) => e.stopPropagation()}>
        <header style={S.bandeau(S.C.accent)}>
          <button style={S.boutonIcone(false)} onClick={onFermer} aria-label="Fermer">
            <Icone nom="ferme" contour={S.C.texte} taille={12} />
          </button>
          <span>Journal d'aventures</span>
        </header>

        <div style={S.ongletsJournal}>
          <button style={S.onglet(onglet === 'cours')} onClick={() => setOnglet('cours')}>En cours</button>
          <button style={S.onglet(onglet === 'faites')} onClick={() => setOnglet('faites')}>Accomplies</button>
        </div>

        {lot.length === 0 && <p style={S.verdictPhrase}>Rien par ici pour l'instant.</p>}

        {lot.map((a, i) => (
          <article key={a.id} style={S.entreeJournal(a.satisfaction)}>
            <div style={S.corpsCarte(false)}>
              <div style={{ ...S.medaillon(i, false), ...S.fondMedaillon(i), width: 64, height: 64 }}>
                <span className={S.CL.losange} style={{ display: 'grid', placeItems: 'center' }}>
                  <Sigil index={i} contour={S.C.contour} remplissage={S.C.page} taille={40} />
                </span>
              </div>
              <div style={S.colonneCarte}>
                <span style={S.libelle()}>{a.date}</span>
                <strong>{a.voies.join('  ·  ')}</strong>
                <span style={S.libelle()}>
                  {a.etat <= 2 ? `L'Oracle dit : ${a.oracle}` : `Décision : ${a.decision}`}
                </span>
                {a.satisfaction && (
                  <Coeurs valeur={{ oui: 5, bof: 3, non: 1 }[a.satisfaction]}
                    plein={S.C.coeurPlein} vide={S.C.coeurVide} taille={14} />
                )}
              </div>
            </div>
            {a.feedback && <p style={S.citation}>« {a.feedback} »</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APPLICATION                                                        */
/* ------------------------------------------------------------------ */

const AVENTURES_EXEMPLE = [
  { id: 1, date: '13/09/2026', etat: 4, voies: ['Alice ça glisse', "2 coups d'avance"],
    oracle: 'Pile ou face', decision: 'Alice ça glisse', satisfaction: 'oui',
    feedback: "J'ai enfin fait quelque chose de ce hook que je traînais depuis des mois." },
  { id: 2, date: '11/09/2026', etat: 2, voies: ['Aller au concert', 'Rester bosser'],
    oracle: 'Aller au concert', decision: null, satisfaction: null, feedback: null },
];

const PHRASES = {
  clair: "Ton instinct est clair. Fais-toi confiance.",
  dilemme: "Les deux se valent. Celle-ci te coûte moins — commence par là.",
  aucune: "Aucune de ces routes ne t'appelle. La vraie question n'est peut-être pas encore posée.",
  pileouface: "La pièce a parlé. Vas-y sans y repenser.",
};

export default function App() {
  const surTelephone = useEstTelephone();

  const [etape, setEtape] = useState(0);
  const [energie, setEnergie] = useState(3);
  const [coeursBattent, setCoeursBattent] = useState(false);
  const [voies, setVoies] = useState([voieVierge(), voieVierge()]);
  const [q0, setQ0] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [tirage, setTirage] = useState(null);
  const [pieceTourne, setPieceTourne] = useState(false);
  const [decision, setDecision] = useState('');
  const [feedback, setFeedback] = useState('');
  const [satisfaction, setSatisfaction] = useState('');
  const [journalOuvert, setJournalOuvert] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const styleInjecte = useRef(false);

  useEffect(() => {
    if (styleInjecte.current) return;
    styleInjecte.current = true;
    const s = document.createElement('style');
    s.textContent = S.CSS_GLOBAL;
    document.head.appendChild(s);
  }, []);

  const nommees = voies.filter((v) => rempli(v.nom));
  const toutesRemplies = nommees.length >= 2 && nommees.every((v) => rempli(v.q3));
  const peutConsulter = toutesRemplies && rempli(q0);

  const modifierVoie = (i, patch) =>
    setVoies((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const changerEnergie = () => {
    setEnergie((e) => (e % 5) + 1);
    setCoeursBattent(true);
    setTimeout(() => setCoeursBattent(false), 800);
  };

  const signaler = () => { setSauvegarde(true); setTimeout(() => setSauvegarde(false), 1800); };
  const avancer = (n) => { setEtape(n); signaler(); };

  const consulterOracle = () => { setVerdict(consulter(nommees, energie, q0)); avancer(1); };

  const lancerPiece = () => {
    setPieceTourne(true);
    setTimeout(() => { setPieceTourne(false); setTirage(tirerAuSort(verdict)); }, 1200);
  };

  const choixOracle = verdict ? (verdict.choix ?? tirage) : null;
  const verdictRevele = verdict && (verdict.cas !== 'pileouface' || tirage);
  const frappe = useFrappe(verdictRevele ? PHRASES[verdict.cas] : '');
  const scoreDe = (nom) =>
    verdict?.analyses.find((a) => a.voie.nom === nom)?.score;

  return (
    <div style={S.ecran}>
      <div style={S.flux}>

        {/* ---- Encadré entête ---- */}
        <header className={S.CL.panneau} style={S.entete}>
          <div>
            <h1 style={S.enteteTitre}>Quest Finder {VERSION}</h1>
            <p style={S.enteteSousTitre}>Choisis ton aventure !</p>
          </div>
          <button style={S.boutonIcone(AVENTURES_EXEMPLE.some((a) => a.etat <= 2))}
            onClick={() => setJournalOuvert(true)} aria-label="Journal">
            <Icone nom="journal" contour={S.C.texte} remplissage={S.C.page} taille={18} />
          </button>
        </header>

        {/* ---- Encadré dilemme ---- */}
        <Panneau titre="Ton dilemme" icone="etoile">
          <div style={{ display: 'flex', alignItems: 'center', gap: S.ESPACE.s, marginBottom: S.ESPACE.m }}>
            <span style={S.libelle()}>ÉNERGIE</span>
            <button style={S.boutonIcone(false)} onClick={changerEnergie} aria-label="Changer l'énergie">
              <span className={coeursBattent ? S.CL.bat : undefined}>
                <Coeurs valeur={energie} plein={S.C.coeurPlein} vide={S.C.coeurVide} />
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: S.ESPACE.m }}>
            {voies.map((v, i) => (
              <CarteVoie key={i} voie={v} index={i} surTelephone={surTelephone}
                score={scoreDe(v.nom)} retirable={voies.length > 2}
                modifier={(p) => modifierVoie(i, p)}
                retirer={() => setVoies((vs) => vs.filter((_, j) => j !== i))} />
            ))}
          </div>

          {voies.length < 4 && (
            <div style={{ marginTop: S.ESPACE.m }}>
              <Bouton couleur={S.C.relief} icone="plus"
                onClick={() => setVoies((vs) => [...vs, voieVierge()])}>
                Prendre une autre voie
              </Bouton>
            </div>
          )}

          {/* ---- La portée : une seule question, pour tout le dilemme ---- */}
          <div style={{ marginTop: S.ESPACE.m, ...(toutesRemplies ? undefined : S.verrouille) }}>
            <label style={S.libelle(toutesRemplies)}>Dans dix jours, ça compte ?</label>
            <input style={S.champ(toutesRemplies)} value={q0} placeholder="ça compte ?"
              disabled={!toutesRemplies} onChange={(e) => setQ0(e.target.value)} />
            <div style={{ display: 'flex', gap: S.ESPACE.xs, flexWrap: 'wrap', marginTop: S.ESPACE.s }}>
              {['Oui', 'Peut-être', 'Je sais pas', 'Non'].map((p) => (
                <button key={p} style={S.pastilleChoix(q0 === p)}
                  disabled={!toutesRemplies} onClick={() => setQ0(p)}>{p}</button>
              ))}
            </div>
          </div>

          {etape === 0 && (
            <div style={{ marginTop: S.ESPACE.m }}>
              <Bouton actif={peutConsulter} icone="etoile" onClick={consulterOracle}>
                Consulter l'Oracle
              </Bouton>
              {!peutConsulter && (
                <p style={S.enteteSousTitre}>Nomme au moins deux voies et réponds à tout.</p>
              )}
            </div>
          )}
        </Panneau>

        {/* ---- Encadré : l'Oracle a parlé ---- */}
        {etape >= 1 && verdict && (
          <Panneau titre="L'Oracle a parlé" icone="etoile" couleur={S.C.oracle}
            onRetour={etape === 1 ? () => setEtape(0) : undefined}>
            {!verdictRevele ? (
              <>
                <p style={S.verdictPhrase}>Les deux chemins se valent. Laisse la pièce trancher.</p>
                <button style={S.piece(pieceTourne)} onClick={lancerPiece}>
                  <Icone nom="piece" contour={S.C.contour} remplissage={S.C.oracle} taille={64} />
                </button>
              </>
            ) : (
              <>
                <p style={S.verdictNom} className={S.CL.scintille}>
                  → {choixOracle ?? 'Aucune des deux'} ←
                </p>
                <p style={S.verdictPhrase} className={frappe.fini ? undefined : S.CL.frappe}>
                  {frappe.visible}
                </p>
              </>
            )}
            {etape === 1 && verdictRevele && frappe.fini && (
              <div style={{ marginTop: S.ESPACE.m }}>
                <Bouton couleur={S.C.oracle} onClick={() => avancer(2)}>Merci Oracle !</Bouton>
              </div>
            )}
          </Panneau>
        )}

        {/* ---- Encadré : à toi de jouer ---- */}
        {etape >= 2 && (
          <Panneau titre="À toi de jouer" icone="valide"
            onRetour={etape === 2 ? () => setEtape(1) : undefined}>
            <p style={S.verdictNom}>{choixOracle ?? 'À toi de voir'}</p>
            <p style={S.verdictPhrase}>Ton corps sait déjà. Le reste, c'est du bruit.</p>
            {etape === 2 && (
              <div style={{ marginTop: S.ESPACE.m }}>
                <Bouton onClick={() => avancer(3)}>J'ai décidé !</Bouton>
              </div>
            )}
          </Panneau>
        )}

        {/* ---- Encadré : j'ai décidé ---- */}
        {etape >= 3 && (
          <Panneau titre="Et alors, t'as fait quoi ?" icone="cartes"
            onRetour={etape === 3 ? () => setEtape(2) : undefined}>
            <div style={{ display: 'flex', gap: S.ESPACE.xs, flexWrap: 'wrap' }}>
              {[...nommees.map((v) => v.nom), 'Autre chose', 'Rien'].map((nom) => (
                <button key={nom} style={S.pastilleChoix(decision === nom)}
                  onClick={() => setDecision(nom)}>{nom}</button>
              ))}
            </div>
            {etape === 3 && (
              <div style={{ marginTop: S.ESPACE.m }}>
                <Bouton actif={rempli(decision)} onClick={() => avancer(4)}>
                  Bravo d'avoir décidé !
                </Bouton>
              </div>
            )}
          </Panneau>
        )}

        {/* ---- Encadré : bravo d'avoir décidé ---- */}
        {etape >= 4 && (
          <Panneau titre="Bravo d'avoir décidé !" icone="valide" couleur={S.C.positifClair}
            onRetour={etape === 4 ? () => setEtape(3) : undefined}>
            <p style={S.verdictNom}>{decision}</p>
            <p style={S.verdictPhrase}>Tu as choisi avec ce que tu savais. C'est tout ce qu'on peut faire.</p>
            {etape === 4 && (
              <div style={{ marginTop: S.ESPACE.m }}>
                <Bouton couleur={S.C.positifClair} onClick={() => avancer(5)}>Je l'ai fait !</Bouton>
              </div>
            )}
          </Panneau>
        )}

        {/* ---- Encadré : et c'était comment ? ---- */}
        {etape >= 5 && (
          <Panneau titre="Et c'était comment ?" icone="coeur"
            onRetour={etape === 5 ? () => setEtape(4) : undefined}>
            <textarea style={S.champLong()} value={feedback} placeholder="raconte..."
              onChange={(e) => setFeedback(e.target.value)} />
            <label style={{ ...S.libelle(), marginTop: S.ESPACE.m }}>C'était le bon choix ?</label>
            <div style={{ display: 'flex', gap: S.ESPACE.xs }}>
              {[['oui', 'Oui'], ['bof', 'Bof'], ['non', 'Non']].map(([cle, texte]) => (
                <button key={cle} style={S.pastilleChoix(satisfaction === cle)}
                  onClick={() => setSatisfaction(cle)}>{texte}</button>
              ))}
            </div>
            {etape === 5 && (
              <div style={{ marginTop: S.ESPACE.m }}>
                <Bouton actif={rempli(satisfaction)} couleur={S.C.oracle} onClick={() => avancer(6)}>
                  Quête accomplie !
                </Bouton>
              </div>
            )}
          </Panneau>
        )}

        {/* ---- Encadré : quête accomplie ---- */}
        {etape >= 6 && (
          <Panneau titre="Quête accomplie !" icone="etoile" couleur={S.C.oracle}>
            <p style={S.verdictNom} className={S.CL.scintille}>{decision}</p>
            <div style={{ display: 'grid', placeItems: 'center', marginBottom: S.ESPACE.m }}>
              <span className={S.CL.bat}>
                <Coeurs valeur={{ oui: 5, bof: 3, non: 1 }[satisfaction] ?? 0}
                  plein={S.C.coeurPlein} vide={S.C.coeurVide} taille={22} />
              </span>
            </div>
            {rempli(feedback) && <p style={S.citation}>« {feedback} »</p>}
            <p style={{ ...S.verdictPhrase, marginTop: S.ESPACE.m }}>
              {decision === choixOracle
                ? "L'Oracle et toi étiez sur la même longueur d'onde. Bien joué."
                : "Tu as suivi ta propre voie. L'Oracle apprend de toi aussi."}
            </p>
            <div style={{ marginTop: S.ESPACE.m }}>
              <Bouton couleur={S.C.relief} onClick={() => window.location.reload()}>
                Quitter l'aventure
              </Bouton>
            </div>
          </Panneau>
        )}
      </div>

      {journalOuvert && (
        <Journal aventures={AVENTURES_EXEMPLE} onFermer={() => setJournalOuvert(false)} />
      )}

      {sauvegarde && (
        <div style={S.encadreSauvegarde} className={S.CL.apparait}>
          <Icone nom="disquette" contour={S.C.contour} remplissage={S.C.page} taille={14} />
          Sauvegardé !
        </div>
      )}
    </div>
  );
}
