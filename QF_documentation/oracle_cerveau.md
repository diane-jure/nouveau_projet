> 🧠

# README

## Tests en labo
- Score min et max de chaque variable
- - Explication des scores
- tester si les écarts entre les plus gros et moyen pathscore devient absurde (si les boost ou reduces s'enchainent)
- Score min et max de chaque q
- Score min et max des pathScore
- tester si certains pathPoints sont négatifs, et lesquels
- tester si heartoverbody & selfcare se superposent
- Corrélation des scores avec satisfaction
- Distribution des totaux (médiane) et position du zéro

 
## Lexique
Dilemme (dilemma) — Cartes d'options avant le verdict de l'Oracle
Voie (path) — Chacune des options
Verdict (verdict) — Voie choisie par l'Oracle
Recommandation (recommendation) — Phrase prononcée par l'Oracle
Décision (decision) — Voie prise par l'user
Aventure (quest) — Dilemme complété
Portée (scope) — Dans 10 jours, ça compte ? (Q0 / Q4 dans les archives)
PV (HP) — Niveau général d'énergie de l'user à l'ouverture de l'app
Dépense (drain) — Perte de PV pour prendre cette voie
Butin (loot) — Gemmes promises pour une voie
Tirage au sort(shuffle): pile ou face || tirage de carte

pathPoints: somme des points du vocabulaire détecté
pathScore: score après opération des facteurs multiplicateurs


## Constantes

```js
const WEAK   = 1
const STRONG = 3
 
const THRESHOLD  = 3
const BOOST      = 2    // multiply
const REDUCE     = 0.5  // divide
```
 
```js
// Classification d'une valeur
isHigh(x) => x >= THRESHOLD
```

## detection
Ignorer la casse (maybe les prénoms: détecter une majuscule ?)
Ignorer les accents
Inclut +5 caractères avant et après
Si plusieurs regex superposés: l'expression la plus longue gagne
Dans Q3 les valeurs des sparks & hooks sont
inversées - sauf injonction
Détection inclut titre du path

#### Q1
desire (weak / strong) 
indifference (weak / strong)
fear (weak / strong) 

#### Q2
benefits (weak / strong)
#### Q3
regret (weak / strong)
relief (strong)
trivial (weak) 
reversible (true/false)
irreversible (true/false)
recurrence (true/false)
#### Q0
scope (yes,maybe,no)

#### allFields
**sparks**
[liste des sparks] (strong)
**hooks**
[liste des hooks] (strong)
**modifiers**
but
less
more

## autres

allFear
allRegret


avoidanceFear
protectiveFear

shuffle

greatPath
fairPath
poorPath

followedOracle
oracleWasRight
pathPoints
pathScore


### resources

HP(1-5)
drain(1-5)
loot(1-10)


# Verdict

## count PathPoints

### qDependant

#### Q1 points
sum of desire points minus sum of indifference points and bonus/malus

#### Q2 points
sum of benefits points and bonus/malus

#### Q3

relief (strong) ; negative points
trivial (weak) ; negative points
regret (weak,strong);  positive points

irreversible
recurrence

Q3 points = sum of relief trivial regret points and REVERSE bonus/malus

### everyField
Les bonus/malus sont des points mais créent aussi des tags pour les Recommandations

#### sparks (strong)


#### hooks (strong)


#### pondérateurs

but: reduce beginning of field
less: reduce mots adjacents 
more: boost mots adjacents 

#### resources

drain: if > HP then minus (drain) points
loot: add (loot) points

### calculate pathPoints
sum of Q1pts + Q2pts + Q3pts

## calculate pathScore

create var:
allFear
allRelief
allRegret (weak,strong);  positive value

#### règles
```
// Fear vs Regret
if (totalFear.isHigh && totalRegret.isHigh)
  → avoidanceFear: boost sur pathPoints

if (totalFear.isHigh && totalRegret <= 0)
  → protectiveFear: reduce sur pathPoints

// Body
if (damage && (Q1points.isHigh || regret.isHigh || irreversible))
  → heartOverBody: boost sur pathPoints

if (damage && (!Q1.isHigh || relief.isHigh || reversible))
  → selfCare: reduce sur pathPoints

// Ir/Reversible
if (irreversible) → boost sur pathPoints
if (reversible)   → reduce sur pathPoints

// Scope
if (recurrence) → scope = yes

if (scope === 'yes')   → boost Q3Points

if (scope === 'no')    → reduce Q3Points
if (scope=== 'no' && ALL PATHS(trivial)    →  shuffleCoin

si HP<=2 mot flemme change de sens

```


### Totaux

score >= x → greatPath
score <= -z → poorPath
score entre -z et x → fairPath

> ⚠️ Valeurs x et z à définir après tests en labo


### Verdicts
comparer toutes les voies (jusqu'à 4)

greatPath vs poorPath and/or Fair= pickGreat

if pickGreat & several greatPath & scope = YES alors shuffleCards (between every greatPath)

if pickGreat & several greatPath & scope = NO alors shuffleCoin (between every greatPath)

fairPath vs poorPath = pickFair

if pickFair & several fairPath & scope = YES alors shuffleCards (between every fairPath)

if pickFair & several fairPath & scope = NO alors shuffleCoin (between every fairPath)

if scope = no & several greatPath alors shuffleCoin (between every greatPath)

si all = fairPath alors shuffleCoin 

si all = poorPath alors pickNone


### Recommandations
Les var des q123 sont des tags
Les règles qui s'appliquent sont des tags

Note: peur de faire chose importante = procrastination

Chaque tag devrait porter **le mot qui l'a déclenché**. Deux bénéfices : l'oracle peut te citer, ce qui est tout ton style ; et ça s'auto-contrôle

- Les tags (sparks/hooks) influencent le choix de phrase
- La phrase de tirage (shuffle) peut souligner les qualités des différentes voies
- Les noms des autres voies peuvent apparaître dans les phrases


# Dénouement

#### followedOracle
true si decision = verdict
true si decisionOther quand recommandation pickNone
null pour shuffle

#### OracleWasRight:

true si
- verdict = decision & satisfaction Oui (=3)
- donc false pour meh et no

- recommandation =/= choice & satisfaction non ou meh (=<3)
- donc false uniquement pour yes
