# labo/ — expériences

Code **hors application**, écrit pour trancher une question de conception.
Rien ici n'est destiné à être livré tel quel.

## Lire le texte libre sans LLM

`lecture.js` — lexique français + règles (négation, intensité, sentiments
mêlés) qui propose un cran d'échelle à partir d'une réponse rédigée.

`experience.js` — mesure sa performance sur les 144 réponses en texte libre
de l'historique, en comparant au cran assigné à la main.

```
node labo/experience.js
```

### Résultat (session de conception initiale)

| | couverture | exactitude | à un cran près |
|---|---|---|---|
| Q1 | 98 % | 66 % | 94 % |
| Q2 | 77 % | 68 % | 97 % |
| Q3 | 90 % | 77 % | 95 % |
| **ensemble** | **88 %** | **70 %** | **95 %** |

**Concordance des verdicts** (la seule mesure qui compte) :
- lecture seule : **77 %** des dilemmes désignent la même option
- lecture + confirmation : **82 %**

### Conclusion — révisée par l'expérience 2

Le chiffre global de 82 % est **trompeur, et trop sévère**. Voir plus bas.

Ce qui reste vrai : les erreurs sont majoritairement données avec une
confiance « haute ». Filtrer sur la confiance ne sauverait rien.

**La pré-sélection l'est** : à 95 % le bon cran est la proposition du
lecteur ou son voisin immédiat. Le lecteur est donc un bon *point de
départ*, jamais une *décision*.

### Biais à connaître

Les étiquettes de référence sont des interprétations faites à la main, et le
lexique a été écrit après lecture des textes. **Le chiffre réel sur des
entrées nouvelles serait plus bas.** Affiner le lexique sur ces mêmes 22
dilemmes ferait monter le score sans améliorer l'outil : ce serait du
surapprentissage sur un échantillon minuscule.


---

## Expérience 2 — où se produit le désaccord ?

`experience2.js` — le désaccord frappe-t-il n'importe où, ou seulement là
où l'oracle hésitait déjà ?

```
node labo/experience2.js
```

### Résultat

| Cas | Concordance |
|---|---|
| **verdict NET** (écart ≥ 3) | **12/12 — 100 %** |
| verdict franc (1.2 ≤ écart < 3) | 5/6 — 83 % |
| SERRÉ / pile ou face | 1/4 — 25 % |

**Quand l'oracle est sûr, le lecteur ne le contredit jamais.** Les
désaccords se concentrent sur des dilemmes où l'oracle disait lui-même
« c'est serré, tu ne te tromperas pas beaucoup » : s'y tromper coûte un
pile ou face, c'est-à-dire presque rien.

Le 82 % de l'expérience 1 comptait ces cas comme des échecs. C'est une
mauvaise mesure : elle punit l'outil là où il annonçait lui-même que le
choix était indifférent.

### Le vrai problème est ailleurs

```
Mises en garde préservées : 17/27  (63 %)
```

**Plus d'un tiers des drapeaux se perdent** — `aucuneNAppelle`,
`grandeDecision`, `peurQuiCompte`, `peurQuiProtege`, `engagement`. Le
gagnant reste bon, mais l'oracle devient muet sur ce qu'il avait compris,
et c'est là qu'est une bonne part de sa valeur.

Cause identifiée : le lecteur **sur-lit systématiquement Q2**, ce qui
gonfle les totaux, ce qui franchit le seuil `faible` de 4.0, ce qui tue le
drapeau « rien ne t'appelle ».

### Où l'amélioration est légitime

Corriger un **biais systématique** (tout est décalé d'un cran vers le
haut) est un recalibrage, pas du surapprentissage. Mémoriser les phrases
de l'historique une par une en serait.

### Conséquence pour la conception

La confirmation par l'utilisatrice reste utile — **mais pour protéger les
mises en garde, pas pour sauver le verdict.**

---

## Expérience 3 — duel des deux oracles

`duel.js` — l'oracle v2.5 (celui des prototypes précédents) contre le
moteur de ce dépôt, sur les **25 dilemmes réels de `docs/sauvegardes.md`**,
jugés avec le critère défini par l'autrice dans `docs/oracle_cerveau.md` :

> `OracleWasRight` = vrai si la recommandation a été suivie et la
> satisfaction est bonne, OU si elle n'a pas été suivie et la satisfaction
> est mauvaise ou mitigée.

```
node labo/duel.js
```

### Résultat brut (trompeur)

| | justes |
|---|---|
| oracle v2.5 | 11/20 — 55 % |
| moteur de ce dépôt | 15/21 — **71 %** |

### Le même test, honnêtement

Le moteur a été **conçu en regardant 17 de ces 25 dilemmes**. Il est juge
et partie. L'oracle v2.5, lui, rendait ses verdicts en aveugle, avant de
connaître l'issue. En ne gardant que les dilemmes que le moteur n'avait
jamais vus :

| | déjà vus | **inédits** |
|---|---|---|
| oracle v2.5 | 6/13 — 46 % | **5/7 — 71 %** |
| moteur de ce dépôt | 9/13 — 69 % | **6/8 — 75 %** |

**Sur des données fraîches, les deux oracles sont à égalité.** L'écart de
23 points observé sur les dilemmes connus était du surapprentissage — et
il a suffi de regarder ces dilemmes pendant la conception pour le créer,
sans jamais ajuster un poids exprès.

C'est exactement le risque annoncé au sujet d'une instance qui reprendrait
le barème à froid. La démonstration vaut aussi pour celui qui l'a écrit.

⚠️ 7 et 8 dilemmes jugeables : un seul cas pèse 13 points. Rien ici n'est
concluant, tout est indicatif.

### Question annexe, sans réponse

```
a suivi l'oracle      : 6/8 good  (75 %)
n'a pas suivi         : 6/8 good  (75 %)
```

Aucune différence détectable. Mais avec 8 cas par groupe, **on ne pourrait
pas détecter une différence réelle même si elle existait.** Ce n'est pas un
résultat, c'est une absence de mesure.
