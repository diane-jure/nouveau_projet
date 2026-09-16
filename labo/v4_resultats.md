# Oracle V4 — résultats des tests en labo

Réponses aux questions de la liste **« Tests en labo »** en tête de
`QF_documentation/oracle_cerveau.md`.

**Mesuré sur** les 25 dilemmes réels de `labo/saves/sauvegardes.md`,
soit **54 voies**. **Seuils provisoires** : `X = 3`, `Z = 3`.

```bash
node labo/v4/genere_word_bank.js   # si le MD a changé
node labo/v4/tests.js
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
