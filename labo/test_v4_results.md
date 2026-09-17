# Oracle V4 — état des mesures et questions ouvertes

Mesuré sur les **25 dilemmes réels** de `labo/saves/sauvegardes.csv, soit
**54 voies**.

```bash
node labo/v4/test_v4_engine.js
```



**Réglages en vigueur** — `WEAK 1` · `STRONG 3` · `achievements 1.5` ·
`THRESHOLD 3` · `BOOST 2` · `REDUCE 0.5` · `X 3` · `Z 3`.

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




------
version de 2026 09 26 23h

# Oracle V4 — résultats des tests en labo

Réponses aux questions de la liste **« Tests en labo »** en tête de
`QF_documentation/oracle_cerveau.md`.

**Mesuré sur** les 25 dilemmes réels de `labo/saves/sauvegardes.md`,
soit **54 voies**. **Seuils provisoires** : `X = 3`, `Z = 3`.

```bash
node labo/v4/genere_word_bank.js   # si le MD a changé
node labo/v4/test_v4_engine.js
```

> Ces tests **décrivent**, ils ne règlent aucun poids. Ils existent pour que
> X et Z soient choisis en connaissance de cause, pas au jugé.

---

## En trois lignes

1. **Q2 écrase Q1 et Q3.** L'axe qui devait peser le moins pèse le plus.
2. **Le verdict ignore l'écart.** 23,5 contre 5 donne un pile ou face.
3. Les deux craintes de conception — le piège du signe et la cascade de
   boosts — **ne se produisent pas** sur les données réelles.

---

## 2. Explication des scores

Le dilemme du 13/01 : *Rester au lit* contre *Aller au lac*. HP 3.

```
┌─ Aller au lac                          pathPoints 23.5 → pathScore 23.5  [greatPath]
│  Q1 2.5   Q2 9   Q3 9   ressources 3
│  Q1       ×0.5 « ah » (fear)      ×0.5 « dur » (indifference)
│           « allez » ×2 (desire/strong)
│  hooks    « il faut » (injunctions)          → malus
│  sparks   « fier » (wellbeing)   ×2 « amuse » (playful)
│  Q3       « honte » « degout » « fâché »     → regret fort ×3
└─
┌─ Rester au lit                         pathPoints 5 → pathScore 5        [greatPath]
│  Q1 -0.5   Q2 1.5   Q3 -3   ressources 7
│  Q1       ×0.5 « mmh » (indifference)
│  sparks   ×0.5 « repos » (wellbeing)
│  Q3       « fièr » (relief)                  → soustraction
└─
```

Trois choses à voir :

- **Le `mais` fonctionne.** *« Aaaaah c'est dur mais allez allez il faut y
  aller »* : `ah` et `dur`, situés avant le mais, sont divisés par deux.
  `allez` garde son poids plein, et compte deux fois puisqu'il est écrit
  deux fois.
- **Les trois mots de regret sont bien lus** — c'est ta phrase
  *« Honteuse dégoûtée fâchée contre moi »*, exactement les mots que la V2.5
  attrapait déjà.
- **Et pourtant le verdict est un pile ou face.** Voir le test 2 bis.

## 2 bis. Types de verdict produits

| verdict | nombre |
|---|---|
| `pickGreat` | 14 |
| `shuffleCoin` | 8 |
| `shuffleCards` | 2 |
| `pickFair` | 1 |

**Un tirage au sort sur quatre dilemmes.** Et le cas ci-dessus montre
pourquoi : les deux voies sont `greatPath`, donc la règle « plusieurs
greatPath → tirage » s'applique — **sans jamais regarder l'écart**, qui est
pourtant de 23,5 contre 5.

Ce n'est pas un bug d'implémentation : c'est ce que dit le document. Mais
c'est presque certainement une règle à compléter.

---

## 1 · 5 · 6. Min, max, médiane de chaque variable

| variable | min | max | médiane | moyenne |
|---|---|---|---|---|
| Q1 points | −4 | 7.5 | 0.63 | **1.13** |
| Q2 points | 0 | 12 | 4.5 | **4.63** |
| Q3 points (brut) | −5.5 | 9 | 0 | 0.19 |
| Q3 points (après portée) | −11 | 9 | 0 | **0.29** |
| q1Fear | 0 | 10 | 0.25 | 1.41 |
| q3Regret | 0 | 9 | 0 | 0.81 |
| q3Relief | 0 | 3 | 0 | 0.39 |
| ressources | −2 | 7 | 2 | 1.44 |
| **pathPoints** | −9 | 24 | 7 | 7.49 |
| **pathScore** | −4.5 | 36 | 6 | 7.61 |

**Q2 pèse quatre fois Q1 et seize fois Q3.** L'intention était l'inverse :
Q2 ne devait pas peser lourd, et le regret devait valoir le double de
l'élan.

La cause est mécanique. `achievements` n'a qu'un seul niveau, `strong`,
donc chaque mot vaut 3. Et les réponses Q2 sont des énumérations — *« chill,
joie, fun, détente »* fait 12 points, pendant qu'une Q3 nuancée en vaut 1.

## 7. Quels pathPoints sont négatifs ?

**5 voies sur 54 (9 %).**

```
2026-05-01    −1     → −0.5    Rester à l'intérieur
2026-03-30    −3     → −3      Aller chez Léa
2026-03-26    −5     → −2.5    Guillemette
2026-03-22    −9     → −4.5    Marcher direct
2026-01-13    −1.75  → −0.87   BD Tour du monde 80 jours
```

**Aucune n'a été enfoncée par un boost.** Les cinq ont été *remontées* par
un `reduce`. Le piège du signe — un ×2 qui aggrave une voie déjà négative —
**ne se produit jamais** sur ces données. La décision d'attendre le test
plutôt que de corriger d'avance était la bonne.

## 3. Les boosts s'enchaînent-ils jusqu'à l'absurde ?

| règles déclenchées | voies | facteur total |
|---|---|---|
| 0 | 29 | ×1 |
| 1 | 23 | de ×0.5 à ×2 |
| 2 | 2 | ×1 |

**Maximum : 2 règles sur une même voie.** Le ×8 redouté n'arrive pas, et les
deux seuls cas à deux règles donnent ×1 — parce que ce sont précisément les
deux règles du corps qui s'annulent (test 8).

## 8. `heartOverBody` et `bodyWisdom` se superposent-ils ?

```
heartOverBody seul :  0
bodyWisdom seul    :  4
LES DEUX           :  2      ×2 puis ×0.5, effet net nul et silencieux
```

**`heartOverBody` ne se déclenche jamais seul.** Les deux seules fois où il
part, `bodyWisdom` part aussi et l'annule. La règle est inerte en l'état.

Cas concernés : *Aller à la chorale* (31/08) et *Rester chez moi tester le
B52* (12/01).

La cause : les deux conditions sont en `||`, et rien n'empêche un
déclencheur de `heartOverBody` de cohabiter avec un déclencheur de
`bodyWisdom` — ils viennent de paires différentes.

## 4. La zone morte entre `avoidanceFear` et `protectiveFear`

```
voies avec une peur forte  : 13
dont dans la zone morte    :  3
```

`avoidanceFear` demande `q3Regret >= 3`, `protectiveFear` demande
`q3Regret <= 0`. Entre les deux, rien.

```
2026-09-11   fear 6  · regret 1     Faire l'admin sur mon ordi
2026-01-20   fear 3  · regret 1     Ne rien dire ce soir
2026-01-12   fear 3  · regret 0.25  Aller au bar
```

3 cas sur 13, soit un quart des voies apeurées. C'est peu, mais ce sont des
voies où la peur est forte et où **aucune règle ne la traite**.

## 9. Quels mots ne devraient pas passer avec `includes()` ?

Le prix du choix, mesuré. **15 faux positifs**, tous réels :

| racine | trouvée dans | fois |
|---|---|---|
| `voir` (connections) | avoir · d'avoir · l'avoir | **11** |
| `art` (create) | parties · clarté · quartier · repartir | 4 |
| `très` (**modifier** `more`) | autres · stress | 3 |
| `ah` (fear) | ouah · trahir | 2 |
| `contact` (connections) | recontacter | 2 |
| `ami` (connections) | damier | 1 |
| `mh` (trivial) | mmh | 1 |

`très` est le plus nuisible : c'est un **modificateur**, donc il double le
mot d'à côté à chaque fois que tu écris « stress » ou « les autres ».

`voir` est le plus fréquent, et le plus facile à corriger : c'est
`« se voir »` que tu veux, pas `voir`.

## 12. Distribution des `pathScore` et position du zéro

```
min −4.5  ·  q1 1.75  ·  médiane 6  ·  q3 12.25  ·  max 36

sous zéro   5 voies
à zéro      3 voies
au-dessus  46 voies
```

Avec `X = Z = 3` :

| rang | voies | part |
|---|---|---|
| `greatPath` | 34 | **63 %** |
| `fairPath` | 18 | 33 % |
| `poorPath` | 2 | 4 % |

**Deux voies sur trois sont « excellentes ».** Le seuil ne trie plus rien —
et c'est la cause directe des huit pile ou face du test 2 bis.

La distribution suggère un `X` autour de **10-12** (le troisième quartile)
et un `Z` autour de **1**, puisque presque rien ne descend sous zéro.

## 11. Corrélation du score avec la satisfaction

*Le seul test qui ouvre la colonne Satisfaction.*

| satisfaction | dilemmes | score moyen de la voie recommandée |
|---|---|---|
| `good` | 16 | 13.31 |
| `bad` | 3 | 10.67 |
| `meh` | 3 | **20.67** |

**Les `meh` ont le score le plus élevé.** Sur 22 dilemmes c'est trop peu
pour conclure quoi que ce soit, mais en l'état **le score ne prédit rien**.

C'est attendu avant calibrage. Ce test ne deviendra intéressant qu'une fois
Q2 remis à sa place et les seuils fixés.

## 10. Collisions entre familles de `everyField`

À trancher **après** ces tests, comme prévu. Voici la matière : **20 mots**
appartiennent à la fois à une famille de question et à `sparks` ou `hooks`,
et comptent donc deux fois avec deux tags.

| mot | famille de question | + everyField |
|---|---|---|
| `cool` | Q1/desire | sparks/wellbeing |
| `fun` | Q1/desire | sparks/playful |
| `joie` | Q1/desire | sparks/wellbeing |
| `kiff` | Q1/desire | sparks/wellbeing |
| `curieu` | Q1/desire | sparks/curiosity |
| `magnifique` | Q1/desire | sparks/wellbeing |
| `chiant` | Q1/indifference | hooks/unpleasant |
| `flemme` | Q1/indifference | hooks/damage |
| `coupable` | Q1/fear | hooks/guilt |
| `coupable` | Q3/regret | hooks/guilt |
| `liber` | Q2/achievements | sparks/wellbeing |
| `projet` | Q2/achievements | sparks/work |
| `stimulant` | Q2/achievements | sparks/move |
| `honte` | Q3/regret | hooks/auto-jugement |
| `fier` | Q3/relief | sparks/wellbeing |
| `heureu` | Q3/relief | sparks/wellbeing |
| `libre` | Q3/relief | sparks/wellbeing |
| `liber` | Q3/relief | sparks/wellbeing |
| `paix` | Q3/relief | sparks/wellbeing |
| `repos` | Q3/relief | sparks/wellbeing |

Le gros bloc `Q3/relief + sparks/wellbeing` (6 mots) est le plus
conséquent : en Q3, `relief` retire des points **et** le spark s'inverse
pour en retirer aussi. Le même mot compte deux fois dans le même sens.

`flemme` est un cas à part et volontaire : sa famille dépend déjà de HP.

---

## Ce qu'il reste à décider

Par ordre d'effet sur le résultat.

1. **Rééquilibrer Q2.** Lui donner deux niveaux, plafonner son total, ou lui
   appliquer un coefficient. C'est la décision qui change le plus de choses.
2. **Fixer X et Z** — la distribution propose X ≈ 10-12, Z ≈ 1.
3. **Faire regarder l'écart au verdict.** Plusieurs `greatPath` ne devraient
   pas suffire à déclencher un tirage si l'un écrase les autres.
4. **Réparer les deux règles du corps**, qui s'annulent l'une l'autre.
5. **Décider les 20 collisions `everyField`** ci-dessus.
6. **Corriger `voir` → `se voir` et `très`**, les deux faux positifs qui
   coûtent vraiment.
7. **Combler le Q0.** *« M'aura rien apporté »* n'est reconnu par aucune des
   trois familles et retombe sur `maybe` par défaut.
