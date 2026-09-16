# Oracle V4 — état des mesures et questions ouvertes

Mesuré sur les **25 dilemmes réels** de `labo/saves/sauvegardes.md`, soit
**54 voies**.

```bash
node labo/v4/genere_word_bank.js   # si oracle_detecte.md a changé
node labo/v4/tests.js
```

**Réglages en vigueur** — `WEAK 1` · `STRONG 3` · `achievements 1.5` ·
`THRESHOLD 3` · `BOOST 2` · `REDUCE 0.5` · `X 3` · `Z 3`.

> Ce document remplace la version précédente plutôt que de s'y ajouter :
> deux fichiers de chiffres divergent toujours, et c'est comme ça qu'on perd
> des choses.

---

## Ce qui a été réglé

| | |
|---|---|
| **Détection en regex ancrée** | Les 15 faux positifs d'`includes()` ont disparu. `voir` ne se déclenche plus dans « avoir », `art` dans « parties », `très` dans « stress », `ah` dans « ouah ». Les racines marchent toujours : `terrif` trouve terrifiée. |
| **`fatigu épuis`** | Écrit sans virgule dans le MD : une seule entrée de dix caractères, qui ne pouvait jamais correspondre. Deux mots récupérés, et « fatigue » se déclenche enfin. |
| **`achievements` à 1,5** | Appliqué. Mais voir la question 1 — ça ne suffit pas, et pour une raison qu'on n'avait pas vue. |
| **Le piège du signe** | Mesuré : n'arrive jamais. Aucune voie négative n'a été enfoncée par un boost. |
| **La cascade de boosts** | Mesurée : maximum 2 règles sur une même voie. Le ×8 n'existe pas. |

## Où on en est

```
variable        min    max   médiane  moyenne
Q1 points        -4    7.5        0      1.01
Q2 points         0     12        3      3.70
Q3 points        -4      9        0      0.49
pathPoints       -9   23.5        6      6.72
pathScore      -4.5     33        5      6.72
```

| rang | voies | | verdict | dilemmes |
|---|---|---|---|---|
| `greatPath` | 33 (61 %) | | `pickGreat` | 15 |
| `fairPath` | 19 (35 %) | | `shuffleCoin` | 7 |
| `poorPath` | 2 (4 %) | | `shuffleCards` | 2 |
| | | | `pickFair` | 1 |

| règle | fois |
|---|---|
| `bodyWisdom` | 8 |
| `reversible` | 7 |
| `protectiveFear` | 6 |
| `heartOverBody` | 2 |
| `avoidanceFear` | 2 |
| `irreversible` | 2 |

---

# Questions ouvertes

## 1. Q2 — le coupable n'est pas celui qu'on croyait

`achievements` est passé à 1,5. Effet réel sur la moyenne de Q2 :
**4,21 → 3,70**. Et le maximum n'a pas bougé : toujours **12**.

La raison, mesurée sur ce qui se déclenche dans les champs Q2 :

```
sparks/wellbeing     20×
Q2/achievements      19×   ← le seul touché par le 1,5
sparks/connections    9×
sparks/playful        8×
sparks/move           6×
sparks/music          5×
… et 7 autres familles de sparks
```

**`achievements` ne représente que 24 % de ce qui marque des points en Q2.**
Les trois quarts restants sont des `sparks`, qui valent 3 chacun et que le
réglage n'a pas touchés.

La voie au Q2 le plus élevé le montre sans ambiguïté :

```
« chill, joie, fun, détente »           12 points
    sparks/wellbeing   « chill »
    sparks/wellbeing   « joie »
    sparks/playful     « fun »
    sparks/wellbeing   « detente »       ← zéro achievements
```

**Trois façons d'en sortir**, à trancher :

- **baisser les `sparks`** aussi — mais ils comptent dans les trois
  questions, donc ça déplace tout l'équilibre, pas seulement Q2 ;
- **un coefficient sur l'axe Q2 entier**, `sparks` compris — ciblé, une
  seule ligne, n'affecte que Q2 ;
- **un plafond sur Q2** — c'était ton idée initiale (« +1 par mot,
  plafonné »). Un plafond à 6 mettrait « chill, joie, fun, détente » au même
  niveau qu'une réponse à deux mots, ce qui est peut-être exactement juste :
  énumérer quatre plaisirs ne rend pas la soirée deux fois meilleure
  qu'en énumérer deux.

Je pencherais pour le plafond, pour cette dernière raison.

## 2. Le verdict ignore l'écart — et ça coûte cher

**9 tirages au sort sur 25 dilemmes.** Voici leurs écarts réels :

```
2026-01-13   23.5 / 5           écart 18.5   Aller au lac
2026-01-15   22.5 / 6           écart 16.5   Rester chez Léonie
2026-01-12   22   / 8.5         écart 13.5   Aller chez Sophiane
2026-09-11   17.5 / 6.5 / 3.5   écart 11     Jouer du synthé
2026-09-11   14.5 / 4.19 / 0.5  écart 10.31  Aller voir un concert
2026-01-13   11   / 4.5         écart 6.5    Annuler et dessiner chez moi
2026-08-31   13   / 8.5 / 7.5   écart 4.5    Aller à la chorale
2026-01-13    0.5 / -0.87       écart 1.37   Vidéos youtube couleurs
2026-02-10    8.25 / 7          écart 1.25   Rester à la maison avec Lola
```

**7 tirages sur 9 ont un écart supérieur à 3.** L'oracle lance une pièce
entre une voie à 23,5 et une voie à 5.

Ce n'est pas un bug d'implémentation : le document dit « plusieurs
greatPath → tirage », sans jamais mentionner l'écart. Seuls les deux
derniers cas (1,37 et 1,25) sont de vrais ex aequo.

**La règle à ajouter**, dans l'esprit de ce qui existait déjà en V2.5 :

```
plusieurs greatPath ET écart < SERRE  →  tirage
plusieurs greatPath ET écart >= SERRE →  pickGreat sur la première
```

Avec `SERRE = 3`, les 9 tirages tomberaient à 2. À toi de fixer `SERRE`.

## 3. `heartOverBody` ne se déclenche toujours jamais seul

```
heartOverBody seul :  0
bodyWisdom seul    :  6
LES DEUX           :  2      ×2 puis ×0.5 = rien, en silence
```

Inchangé depuis la première mesure. `heartOverBody` n'existe pas en
pratique : les deux seules fois où il part, `bodyWisdom` part aussi.

La cause est structurelle. Les deux règles sont en `||` et leurs
déclencheurs viennent de paires différentes :

```
heartOverBody   damage && (Q1points fort || regret fort || irreversible)
bodyWisdom      damage && (Q1points faible || relief fort || reversible)
```

`Q1points fort` et `reversible` ne s'excluent pas — « flemme, mais grave
envie, et je peux toujours le faire demain » déclenche les deux.

**Deux sorties possibles :** écrire une priorité (`heartOverBody` l'emporte,
ou l'inverse), ou fusionner les deux en une seule règle à trois issues
(boost / rien / reduce). Dans les deux cas il faut décider **laquelle gagne**
quand les deux parlent.

## 4. Les 20 collisions `everyField` — ton arbitrage

Prévu « après les tests », les voici. Chacun de ces mots compte **deux fois
et pose deux tags**.

| mot | famille de question | + everyField |
|---|---|---|
| `cool` `fun` `joie` `kiff` `magnifique` | Q1/desire | sparks |
| `curieu` | Q1/desire | sparks/curiosity |
| `chiant` | Q1/indifference | hooks/unpleasant |
| `flemme` | Q1/indifference | hooks/damage |
| `coupable` | Q1/fear **et** Q3/regret | hooks/guilt |
| `liber` `projet` `stimulant` | Q2/achievements | sparks |
| `honte` | Q3/regret | hooks/auto-jugement |
| `fier` `heureu` `libre` `liber` `paix` `repos` | Q3/relief | sparks/wellbeing |

Le bloc du bas est le plus lourd : **6 mots** qui, en Q3, retirent des points
comme `relief` **et** en retirent encore comme `spark` inversé. Deux fois
dans le même sens.

`flemme` est volontaire — sa famille dépend déjà de HP.

## 5. Ce que Q3 n'entend pas

```
Q3 : positif 23 · négatif 17 · zéro 14
```

Parmi les 40 voies où Q3 parle, **l'équilibre est réel** : 23 contre 17. Ce
n'était pas une illusion.

Mais **11 voies n'ont aucun mot Q3 détecté**, et le texte montre des manques
précis :

| ce que tu avais écrit | ce qui manque |
|---|---|
| « J'aurai d'**autres occasions** » | le bank a `autre occasion`, au singulier |
| « je peux **tjs** le faire » | abréviation absente |
| « Je peux le faire » · « je pourrais toujours reprendre » | aucune forme de `peux toujours` ne correspond |
| « Neutre ou **angoissée** » ×2 · « **Anxiété** qui continue de peser » | `angoiss` et `anxi` n'existent qu'en Q1/fear |
| « tourner en rond » · « toujours en tête » | expressions absentes |
| « Peur de pas avoir l'occasion » | `pas d'autre occasion` ne correspond pas |
| « En action » | n'existe qu'en Q2/achievements |

Le groupe du milieu est le plus intéressant : **en Q3, l'angoisse et
l'anxiété ne sont pas de la peur, c'est du regret anticipé.** Il manque une
passerelle — soit les mots en double dans `regret`, soit une règle qui fait
lire les mots de peur comme du regret quand ils apparaissent en Q3.

*(« fatigue » figurait dans cette liste au test précédent. Depuis la
correction de la virgule, il se déclenche — en `hooks/damage`, pas en
famille Q3, ce qui est correct.)*

---

# À décider, dans l'ordre

1. **Comment plafonner Q2** — plafond, coefficient d'axe, ou baisse des sparks
2. **`SERRE`** — l'écart en dessous duquel un tirage est justifié
3. **Qui gagne entre `heartOverBody` et `bodyWisdom`**
4. **Les 20 collisions `everyField`**
5. **La passerelle peur → regret en Q3**

Les seuils `X` et `Z` restent à 3, sur ta décision.
