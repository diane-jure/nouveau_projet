> 🧠

# README

## Tests en labo
- Score min et max de chaque variable
- Score min et max de chaque Q
- Score min et max des totaux
- Explication des scores
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
isHighValue(x) => x >= THRESHOLD
isLowValue(x)  => x <= THRESHOLD
```

## variables à détecter
#### Q1
desire (weak / strong) 
indifference (weak / strong)
fear (weak / strong) 
motivation = desire points minus indifference points
#### Q2
benefits (weak / strong)
#### Q3
regret (weak / strong)
relief (strong)
trivial (weak) 
irreversible (true/false)
reversible (true/false)
recurrence (true/false)
#### Q0
scope (yes,maybe,no)

#### allFields
**drives**
[liste des drives] (strong)
**hooks**
[liste des hooks] (strong)
**modifiers**
but
less
more

## autres

allFear
allRegret
motivation

avoidanceFear
protectiveFear

shuffle

greatPath
fairPath
poorPath

followedOracle
oracleWasRight


# Verdict

## calculate Path Points

### qDependant

#### Q1 points
sum of desire points minus sum of indifference points and bonus/malus

#### Q2 points
sum of benefits points and bonus/malus

#### Q3

relief (strong) ; negative points
trivial (weak) ; negative points
regret (weak,strong);  positive points

irreversible (true)
reversible (true)
recurrence (true)

Q3 points = sum of relief trivial regret points and REVERSE bonus/malus

### everyField
Les bonus/malus sont des points mais créent aussi des tags pour les Recommandations

#### drives (strong)
engagement
bodyFeelsGood

#### hooks (strong)
bodyFeelsBad
injonction
culpabilité

#### pondérateurs

but: reduce beginning of field
less: reduce mots adjacents 
more: boost mots adjacents 

### resources

drain: if > HP then negative points
loot: positive points

### calculate pathPoints
sum of Q1pts + Q2pts + Q3pts

## calculate pathScore

create var:
allFear
allRelief
allRegret (weak,strong);  positive value

#### rules
```
// Fear vs Regret
if (totalFear.isHighValue && totalRegret.isHighValue)
  → avoidanceFear: boost sur pathScore

if (totalFear.isHighValue && totalRegret <= 0)
  → protectiveFear: reduce sur pathScore

// Body
if (bodyFeelsBad && (Q1points.isHighValue || regret.isHighValue || irreversible))
  → heartOverBody: boost sur pathScore

if (bodyFeelsBad && (!motivation.islowValue || relief.isHighValue || reversible))
  → selfCare: reduce sur pathScore

// Ir/Reversible
if (irreversible) → boost sur pathScore
if (reversible)   → reduce sur pathScore

// Scope
if (recurrence) → scope = yes

if (scope === 'yes')   → boost Q3points

if (scope === 'no')    → reduce Q3points
if (scope=== 'no' && ALL PATHS(trivial)    →  shuffleCoin

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

if pickFair & several fairPath & scope = YES alors shuffleCards (between every fairPath)


if scope = no & several greatPath alors shuffleCoin (between every greatPath)

si all = fairPath alors shuffleCoin 

si all = poorPath alors pickNone


### Recommandations

- Les tags (drives/hooks) influencent le choix de phrase
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