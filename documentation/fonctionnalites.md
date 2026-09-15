> 📠 
> Appli en React

Hebergé sur Netlify, données sur Supabase.
Oracle moteur en local
Saves protégées par un mot de passe règle RLS sur supabase

# Lexique
Dilemme: cartes d'options avant le verdict de l'Oracle
Voie (=path): chacune des options
Recommandation: voie choisie par l'Oracle(ou verdict ? choisir)
Décision: voie prise par l'user
Aventure (=quest): dilemme complété
Portée: dans 10 jours, ça compte ? Q0 ou Q4 dans les archives.
PV: energy/spoons dans les archives.
Coût (=cost): perte d'energie en PV pour prendre cette voie
Récompense (reward): gemmes 

States:
1 texte en écriture (Dilemma)

2 l’oracle a parlé (Recommandation)

2 l’oracle a parlé ET demande t’as fait quoi

3 la décision est prise  (Decision)

3 la décision est prise ET demande c’était comment

4 le feedback a été donné (Feedback)



## 🧠 Les décisions de conception

**Saisie** — texte libre toujours, jamais de QCM. L'oracle te cite.

**Q1** — trois compteurs : `élan`, `peur`, `inertie`. `envie = élan − inertie` entre dans la somme ; **la peur n'y entre pas**, elle ne déclenche que des règles. _(15 % de tes réponses mêlent élan et peur.)_

**Q3** — deux axes : **intensité** (soulagement → regret) × **irréversibilité** (je peux toujours ↔ occasion ratée). Inversion du signe par défaut, **une seule exception : la pression sociale**.

**La portée** (ex-Q0) — posée en dernier, agit en **règles**, jamais en points _(elle est globale, donc des points s'annuleraient)_.

**Répétition** — une règle qui **contredit** « ça ne comptera pas ». **Réversibilité** — un cran, pas un pondérateur.

**Engagement** — verbes relationnels +1, impersonnels −1, **les deux peuvent se déclencher** : net zéro, et la phrase pose la question.

**Deux monnaies** —  PV (énergie et cout) **trésor** (pas de l'énergie). Le trésor sert au **départage**, pas au score.

**Pièce** = ça ne comptera pas · **cartes** = ça compte mais je ne peux pas trancher.

> **Une règle se teste. Un poids se défend.** → beaucoup de règles, peu de poids.
> 

# Fragments de code
## ORACLE V2.5(.1)
============================================================================
L'oracle V2.5.1 



**1. Le fichier `oracle_brain.jsx` existe déjà, ne pas le modifier.** Il s'importe comme ça :

```js
import { analyzeWithOracleV2_51 } from './oracle_brain.jsx';
```

---

**2. Ce que l'Oracle attend en entrée — 3 arguments :**

```js
// paths = tableau d'objets, minimum 2
const paths = [
  {
    id: '1',           // identifiant unique
    name: 'Aller au lac',
    pathCost: '3',         // string, cuillères dépensées
    pathGain: '2',   // string, cuillères récupérées
    q1: 'réponse libre',  // "Qu'est-ce que tu ressens à l'idée de faire ça ?"
    q2: 'réponse libre',  // "Imagine : tu l'as fait. Tu te sens comment ?"
    q3: 'réponse libre'   // "Imagine : tu ne l'as PAS fait. Tu ressens quoi ?"
  },
  { id: '2', name: 'Rester au lit', pathCost: '0', pathGain: '1', q1: '...', q2: '...', q3: '...' }
];

// healthpoints = nombre, énergie disponible
const hP = 3;

// q0 = string, oui, non"
const q0 = 'oui';
```

---

**3. L'appel

```js

const askOracle = () => {
  const scan = analyzeWithOracleV2_51(paths, hP, q0);
  setOracleChoice(scan.verdict.choice);
  setOracleSays(scan.verdict.words);
};


<button onClick={askOracle}>✨ Consulter l'Oracle ✨</button>
```
---

**4. Ce que l'Oracle renvoie :**

```js

scan.verdict.choice
// string : le nom du path recommandé, ex "Aller au lac"
// ou "Pile ou face" / "Aucun des deux"

scan.verdict.words
// string : le commentaire épique de l'Oracle, 2-3 lignes

```

---

**5. Comment stocker et relire le verdict dans le state React :**

```js
// Stocker : on met tout l'objet dans l'aventure
const quest = {
  id: Date.now().toString(),
 (...)
  oracle_choice: scan.verdict.choice,
  oracle_words: scan.verdict.words,  
};

// Relire : pour l'affichage
const oracleChoice = quest.oracle_choice;        // la voie recommandé
const oracleSays = quest.oracle_words;  // le commentaire
```

Ouverture  d'ventures sauvegardées = relecture du verdict, pas de rappel de l'analyse

---

**6. Validation avant d'appeler l Oracle :**

```js
const canConsult = () => {
  const valid = paths.filter(p => p.name?.trim());
  if (valid.length < 2) return false;
  if (!q0.trim()) return false;
  return valid.every(p => p.q1?.trim() && p.q2?.trim() && p.q3?.trim());
};
```
=============================


============================================================================




## Infos "followed_oracle et oracle_was_right sont en arrière plan, pas demandés à l'utilisateur."générales
Aide décisionnelle pour hésitation entre 2 ou 3 situations. Ambiance chaleureuse, épique et mystique, inspirée des JRPG.

app React hebergée sur Netlify, Table de base de données sur SupaBase
créer:
src/app.jsx (flow)
src/styles.jsx
src/saves.jsx (système de sauvegarde vers supabase)
src/oracle_words.js (phrases de clôture finales de l oracle)

ne pas créer:
oracle_brain.jsx (à importer - Ne jamais régénérer ou réécrire)

après création: mettre à jour READ ME

Navigation entre les state 1-2-3-4

Faire le code le plus minimaliste et lisible possible. Utiliser des noms de fonctions et constantes claires et cohérentes.
============================================================================

# SAVES
============================================================================
Sauvegarde local storage pendant la complétion du dilemme
Sauvegarde vers supabase après chaque clic de BOUTON
pas de sauvegarde localhost

Créer dans supabase une table QF_saves

Tableau à colonnes
Une ligne par aventure
quest_id: (timestamp)
quest_state: (1,2,3,4)
quest_end: (timestamp) -après aventure complétée
quest_q0: (oui, non)
health_points:
path1_name:
path1_q1:
path1_q2:
path1_q3:
path1_cost:
path1_gain:
path2_name:
path2_q1:
path2_q2:
path2_q3:
path2_cost:
path2_gain:
path3_name:
path3_q1:
path3_q2:
path3_q3:
path3_cost:
path3_gain:
oracle_choice: (path number)
oracle_words: (commentaire)
oracle_code: (ex o18a)
decision: (path number)
feedback: (free text)
satisfaction: (oui, bof, non)
followed_oracle: (true/false)
oracle_was_right: (true/false)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

Indiquer dans la console l'état de la sauvegarde

============================================================================

## 1. Vue d'ensemble : que fait l'appli ?

**Quest Finder** est une aide à la décision. L'utilisateur (Diane 🙂) :
1. Saisit **2 à 4 options** entre lesquelles elle hésite,
2. Répond à quelques questions pour chaque option,
3. Consulte un **"Oracle"** qui recommande un choix,
4. Note après coup **ce qu'elle a vraiment fait** et si c'était un bon choix (feedback),
5. Retrouve toutes ses "aventures" dans un **Journal**.

Les données sont sauvegardées à deux endroits : dans le navigateur (`localStorage`) et dans le cloud (**Supabase**).

---

## 2. Les imports (lignes 1-3)

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase.js';
import { analyzeWithOracleV2_5 } from './oracle.js';
```

- **React + ses "hooks"** : les outils `useState`, `useEffect`, etc. (j'y reviens, c'est le cœur du sujet).
- **`supabase`** : le client de la base de données cloud (défini dans un autre fichier).
- **`analyzeWithOracleV2_5`** : la fonction "cerveau" qui analyse les options et rend un verdict. Toute l'intelligence de l'Oracle est dans `oracle.js`, pas ici.

---

## 3. La "configuration" en haut du fichier (lignes 5-74)

Avant tout composant, le fichier définit des **constantes** réutilisées partout. C'est une bonne pratique : un seul endroit à modifier.

- **`APP_CONFIG`** (l.6) : juste le titre/version.
- **`pixelBorder(...)`** (l.22) : une petite fonction qui génère une **bordure "pixel"** carrée via `boxShadow`. Au lieu d'une bordure CSS classique, elle empile 8 ombres pour donner cet aspect rétro. Tu la verras appelée partout : `...pixelBorder(couleur, épaisseur)`.
- **`COLORS`** (l.48) : la palette de couleurs. Tout le style pioche là-dedans (`COLORS.accent`, `COLORS.bg`...).
- **`FONT`** (l.40) : les tailles de texte harmonisées.
- **`SATISFACTION`** (l.64) : les 3 réponses possibles au feedback (Oui / Bof / Non) avec leur couleur.
- **`QUESTIONS`** (l.70) : les 3 questions posées pour chaque option (q1, q2, q3).

> ⚠️ Petit détail : `pixelBorder` (l.22) utilise `COLORS.border` comme valeur par défaut, mais `COLORS` n'est défini qu'à la ligne 48. Ça marche **uniquement** parce que la valeur par défaut n'est évaluée qu'au *moment de l'appel* (bien après le chargement du fichier), pas à la définition. C'est correct, mais subtil.

---

## 4. Composant vs élément : la notion clé de React

Avant d'aller plus loin, la brique mentale essentielle : **un composant React est une fonction qui reçoit des données (les `props`) et retourne du JSX** (du "HTML dans du JavaScript").

Ton fichier contient plein de petits composants, puis un gros composant principal qui les assemble. On les repère : ce sont les `const NomAvecMajuscule = (props) => (...)`.

---

## 5. Les icônes (lignes 75-113)

`HeartIcon`, `BookIcon`, `ExportIcon`, `PlusIcon` : de tout petits composants qui dessinent une icône en **SVG pixelisé** (des `<rect>` = des carrés colorés). 

Exemple, `HeartIcon` reçoit une prop `filled` : si `true`, les carrés sont colorés (`COLORS.accent`), sinon grisés. C'est comme ça qu'on affiche une jauge de cœurs pleins/vides.

---

## 6. Les composants d'interface (lignes 115-538)

Ce sont les "morceaux" visuels réutilisables. Chacun reçoit ses données par `props` et **remonte les actions** via des fonctions `onXxx` (le composant ne modifie rien lui-même, il *prévient* le parent).

- **`EnergyBar`** (l.116) : la barre d'énergie en haut — 10 cœurs cliquables + boutons Export/Journal. Quand on clique un cœur, elle appelle `onSpoonsChange(i+1)` : c'est le parent qui décide quoi en faire.

- **`OptionCard`** (l.153) : **la carte d'une option**. C'est le composant le plus riche. Elle affiche :
  - un champ nom,
  - un **coût** en énergie (boutons ▲▼) — si le coût dépasse ton énergie (`overBudget`), l'affichage passe en rouge avec un ⚠️,
  - les **3 questions**, révélées **progressivement** : la question suivante n'apparaît (nette) qu'une fois que tu commences à répondre à la précédente (le `filter: blur(2px)` + `opacity: 0.3`, l.197). C'est le mécanisme de "révélation" qui rend le formulaire moins intimidant,
  - un **gain** d'énergie (activé seulement si q2 est remplie).

- **`AddOptionButton`** (l.228) : le bouton "+ Ajouter une option".

- **`CoinFlip`** (l.236) : le **pile ou face animé**. Utilisé quand l'Oracle estime que les deux options se valent. Il a son propre petit état interne (`flipping`, `result`) et lance une animation de 1,2 s avant d'afficher le résultat.

- **`FeedbackInline`** (l.287) : le formulaire "**Et alors, t'as fait quoi ?**". En 3 temps progressifs : quel choix → satisfaction (Oui/Bof/Non) → commentaire optionnel → bouton Valider. S'il est `disabled`, il affiche une version figée en lecture seule.

- **`Journal`** (l.449) : la **fenêtre modale** (superposée, `position: fixed`, l.466) qui liste toutes les aventures, avec deux onglets ("En cours" / "Terminées"). On peut cliquer une entrée pour la recharger, la modifier ou la supprimer.

---

## 7. Le composant principal `QuestFinder` (ligne 544 jusqu'à la fin)

C'est le chef d'orchestre. Il **détient tout l'état** et **assemble** les composants du dessus. C'est lui qui est exporté (`export default`).

### 7a. Les états (`useState`, lignes 545-563)

`useState` crée une **variable "réactive"** : quand on la change (via son `setXxx`), React **redessine** l'écran. Les principaux :

| État | Rôle |
|------|------|
| `spoons` | ton énergie (0-10) |
| `options` | le tableau des options |
| `q0` | la question "Dans 10 jours, ça compte ?" |
| `revealedQuestions` | quelles questions sont révélées par option |
| `oracleResult` | la réponse de l'Oracle |
| `drafts` / `pending` / `completed` | les 3 catégories d'aventures (brouillons / en cours / terminées) |
| `showJournal`, `feedbackQuest`, `currentFeedback`… | états d'affichage divers |
| **`currentStep`** (l.560) | **l'étape courante : 1=Questions, 2=Oracle, 3=Feedback, 4=Conclusion** |

👉 **`currentStep` est la variable la plus importante à comprendre** : toute la page est un **écran unique qui se déroule verticalement** selon l'étape. Tu le verras en bas dans les blocs `{currentStep >= 1 && (...)}`, `{currentStep >= 2 && (...)}`, etc.

### 7b. Les `useRef` (lignes 564, 566)

`useRef` garde une valeur **sans redessiner l'écran** quand elle change.
- `saveTimeoutRef` : mémorise un minuteur (pour éviter de sauver à chaque frappe).
- `cloudReady` : un drapeau "est-ce que Supabase est joignable ?". S'il est `false`, on **bloque toute écriture cloud** pour ne pas écraser des données par erreur — c'est une sécurité importante.

### 7c. Les fonctions logiques (`useCallback` et fonctions simples)

`useCallback` mémorise une fonction pour qu'elle ne soit pas recréée inutilement à chaque rendu. Les principales :

- **`saveToCloud`** (l.568) : écrit dans Supabase (avec les gardes-fous `cloudReady`).
- **`useEffect` de chargement** (l.595) : s'exécute **une fois au démarrage** — met le titre de la page et **charge les données** depuis Supabase, ou à défaut depuis `localStorage`. La logique gère finement les cas d'erreur (panne réseau vs. base vraiment vide, l.608-635).
- **`saveDraft` / `handleBlur`** (l.640, 664) : sauvegarde automatique du brouillon 500 ms après que tu quittes un champ.
- **`canConsultOracle`** (l.669) : renvoie `true` seulement si le formulaire est complet (≥2 options nommées, q0 répondue, toutes les questions remplies). C'est ce qui **active/désactive** le bouton Oracle.
- **`addOption`, `removeOption`, `updateOption`, `revealNext`** : manipulent le tableau d'options.
- **`consultOracle`** (l.695) : appelle le "cerveau" `analyzeWithOracleV2_5`, stocke le résultat, et **passe à l'étape 2**.
- **`saveToHistory`, `exportQuest`, `exportCSV`, `loadDraft`, `deleteJournalEntry`, `resetQuest`, `viewOracleFromHistory`, `editFeedback`…** : la mécanique du Journal et des exports.

### 7d. Le rendu (`return (...)`, ligne 898 à la fin)

C'est ce qui est **affiché**. Structure de haut en bas :

1. **Chargement de la police + animations CSS** (l.900-906) : la police "Press Start 2P" (pixel) et les `@keyframes` (rotation de pièce, pulsation du bouton).
2. **Le titre** (l.908) cliquable qui recharge la page.
3. **Le bandeau "quête en préparation"** (l.916) : n'apparaît que s'il existe un brouillon.
4. **`<EnergyBar />`** (l.947) : la barre d'énergie.
5. **Les 4 étapes**, affichées conditionnellement selon `currentStep` :
   - **Étape 1** (l.952) : les `OptionCard`, la question q0, et le bouton "✨ Consulter l'Oracle ✨".
   - **Étape 2** (l.999) : le bloc "☆ L'ORACLE A PARLÉ ☆" avec la reco (et le `CoinFlip` si pile ou face).
   - **Bouton Retour** (l.1020).
   - **Étape 3** (l.1040) : le `FeedbackInline`.
   - **Étape 4** (l.1070) : la conclusion "✨ QUÊTE ACCOMPLIE ✨" avec un message d'encouragement **tiré au hasard** selon la satisfaction (l.1081-1117), et le bouton "Nouvelle Quête".
6. **Le `Journal`** (l.1126) : affiché seulement si `showJournal` est `true`.

---

## 8. Le "flow" complet en une phrase

> Tu remplis les options (**étape 1**) → tu cliques Oracle qui te recommande un choix et enregistre la quête en "pending" (**étape 2**) → tu notes ce que tu as vraiment fait (**étape 3**), ce qui la déplace en "completed" et sauvegarde dans le cloud → tu vois la conclusion (**étape 4**) → tu peux tout retrouver dans le **Journal**.

Le fil conducteur technique, c'est **`currentStep`** qui monte de 1 à 4, et les **trois listes** `drafts → pending → completed` dans lesquelles une quête voyage au fil de son avancement.

---

Voilà la vue complète ! Si tu veux, je peux **zoomer** sur un point précis — par exemple :
- comment marche exactement le mécanisme de **révélation progressive des questions**,
- la logique de **sauvegarde cloud/local** et ses gardes-fous,
- ou comment le **pile ou face** est déclenché par l'Oracle.

Dis-moi ce qui t'intéresse le plus. 🙂

DANS LE FICHIER STYLES SE TROUVENT 100% des styles, thèmes, couleurs, tailles, marges, width, polices, icones, dans le fichier styles.jsx

Aucune info de style dans app.jsx