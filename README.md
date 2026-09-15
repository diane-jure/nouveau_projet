# Quest Finder — prototype visuel

Calqué sur `docs/flow.md`. Direction visuelle : Fields of Mistria et la
sorcière pastel, palette 16 teintes, cartes de voies façon fiche de
personnage (l'illustration passe au-dessus sur téléphone).

## Quatre fichiers, quatre rôles

| fichier | rôle | règle |
|---|---|---|
| `src/oracle_brain.js` | le verdict | **à importer, jamais réécrire** |
| `src/theme.js` | couleurs, dimensions, polices | rien d'autre |
| `src/icons.jsx` | icônes en grille de pixels | aucune couleur fixée |
| `src/App.jsx` | le flux de `flow.md` | **zéro style, zéro calcul** |

`App.jsx` ne contient pas une seule couleur ni une seule dimension :
tout vient de `theme.js`. Changer l'apparence = ne toucher qu'à ce fichier.
Changer une icône = réécrire sa grille de caractères dans `icons.jsx`.

## Lancer

```bash
npm i esbuild react react-dom
npm run dev          # build + serveur sur http://localhost:5190
```

## Le moteur

C'est **l'Oracle V2** (janvier 2026), retenu après mesure sur les 25
dilemmes réels : 67 % contre 53 % pour la V2.5, au critère
`OracleWasRight` de `docs/oracle_cerveau.md`.

Une seule correction par rapport à l'original : **la réponse à « Dans dix
jours, ça compte ? » lui est transmise.** Dans l'application v4.6.1, les
trois appels omettaient ce troisième argument, si bien que la question
était saisie, sauvegardée, et jamais lue. Toutes les branches qui en
dépendent (relativisation, procrastination, vraie résistance) fonctionnent
donc ici.

⚠️ Le portage est fidèle, donc il reproduit aussi les limites connues de
la V2. Sur le dilemme du 11/09 (« Faire l'admin » contre « Jouer du
synthé »), il répond « Jouer du synthé » : « ça me fait peur » déclenche
l'alerte corporelle à −5 sans rien pour l'amortir. C'est le comportement
du moteur, pas un défaut du prototype.

## Ce qui n'est pas fait

- pas de sauvegarde (ni Supabase ni localStorage) — le journal affiche
  deux aventures d'exemple
- les médaillons sont des sigils géométriques, en attendant de vraies
  illustrations
- les phrases de l'oracle sont minimales, en attendant `oracle_words`
