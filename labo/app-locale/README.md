# Faire tourner QF v4.6.1 en local

`docs/QFv4.6.1.md` contient le composant React complet. Il n'a que deux
imports : `react` et `./supabase.js`. On peut donc le lancer sans backend,
l'application prévoyant déjà le cas (« Pas de save si supabase
inaccessible »).

```bash
mkdir -p qf/src && cd qf
sed -n '2,2001p' ../docs/QFv4.6.1.md > src/App.jsx
# + un stub supabase.js (chaîne de méthodes qui renvoie une erreur)
# + src/main.jsx qui monte <QuestFinder /> dans #root
npm i react react-dom esbuild
npx esbuild src/main.jsx --bundle --loader:.jsx=jsx --outfile=bundle.js \
  --define:process.env.NODE_ENV='"production"'
python3 -m http.server 5180
```

Puis piloter au navigateur (Chromium est préinstallé, `playwright-core`
suffit). Les champs se trouvent par leur placeholder :
`Option 1`, `ton instinct...`, `ça t'apporte...`, `tu ressens...`,
`ça compte ?`.

---

## CE QUE LE LANCEMENT A RÉVÉLÉ

### 1. Q0 n'est jamais lue par le moteur

Le moteur la déclare :

```js
const analyzeWithOracleV2_5 = (options, spoons, q0Response = '') => {
```

Mais les **trois** appels ne passent que deux arguments :

```js
analyzeWithOracleV2_5(validOptions, spoons);   // ligne 1492
analyzeWithOracleV2_5(p.options, p.spoons);    // ligne 1731
analyzeWithOracleV2_5(c.options, c.spoons);    // ligne 1762
```

`q0Response` vaut donc toujours `''`. Le moteur ne lit pas non plus
`opt.q0`. **La réponse est saisie, affichée, sauvegardée — et ignorée.**

Tout ce qui dépend de Q0 est mort :

| branche | effet perdu |
|---|---|
| verrou `q0_notImportant` | le pile ou face automatique ne se déclenche jamais |
| `valeur_q0` | bonus +2 jamais accordé |
| `relativisation` | division par 2 jamais appliquée |
| `procrastination` | étiquette jamais posée |
| `vraiResistance` (branche q0) | la flemme est mal qualifiée |
| `q0Importance` | vaut toujours `'medium'` |

### 2. Q0 est posée deux fois dans l'interface

Un champ « Dans 10 jours ? » par voie, alors que le schéma Supabase
(`docs/fonctionnalites.md`) n'a qu'une colonne `quest_q0`, et que le
moteur n'accepte qu'un seul `q0Response`. L'unification en question
globale est donc à moitié faite : côté données oui, côté écran non.

### 3. Conséquence sur la comparaison V2 / V2.5

`labo/v2_vs_v25.js` **transmet** q0 au moteur V2.5, à partir de la colonne
des sauvegardes. La V2.5 y était donc testée dans une version plus
capable que celle qui tourne réellement. La comparaison reste valable
comme comparaison des deux *algorithmes documentés*, mais la V2.5 réelle
se comporte encore différemment : sans verrou, mais aussi sans aucun des
bonus Q0.
