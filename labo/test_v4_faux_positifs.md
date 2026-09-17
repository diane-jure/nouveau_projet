# Oracle V4 — test complet + faux positifs greatPath

Mesuré sur les **25 dilemmes réels** de `saves/sauvegardes.csv` (commit `d8556cf`,
branche `edits`), avec le lexique réorganisé et le `sign()` corrigé.

Critère de faux positif, tel que défini par l'autrice :
- **type A** — la voie rankée `greatPath` est celle qui a été choisie, mais la
  satisfaction réelle a été `meh` ou `bad`.
- **type B** — la voie rankée `greatPath` n'a pas été choisie, et le choix
  réellement fait a donné `good`.

---

## 1. Résultats du test complet (`labo/test_v4_engine.js`)

```
25 dilemmes · 54 voies évaluées

1 · 5 · 6. Score min et max — par variable, par question, et pathScore
──────────────────────────────────────────────────────────────────
variable              min     max   médiane   moyenne
Q1 points              -4       7      0.13      0.75
Q2 points              -1       9         3      2.92
Q3 points (brut)       -3       9         1      1.35
Q3 points (portée)     -6       9         1      1.28
q1Fear                  0      10         0      1.15
q3Regret                0       9         0      0.86
q3Relief                0       3         0      0.39
ressources             -2       4         2      1.37
pathPoints           -4.5      22      6.25      6.33
pathScore            -4.5      27      5.56      6.45


7. Quels pathPoints sont négatifs ?
──────────────────────────────────────────────────────────────────
6 voies sur 54 (11 %)

2026-05-01      -1 →   -0.5   Rester a l'intérieur
2026-03-26      -3 →     -3   Guillemette
2026-03-22    -4.5 →   -4.5   Marcher direct
2026-01-21   -1.75 →  -1.75   Continuer à travailler sur QF
2026-01-15    -2.5 →   -2.5   Chercher job mi-temps maintenant
2026-01-13   -1.75 →  -0.87   BD Tour du monde 80 jours

dont 0 qu'un boost a enfoncées davantage (le piège du signe)


3. Les boosts s'enchaînent-ils jusqu'à l'absurde ?
──────────────────────────────────────────────────────────────────
règles déclenchées   voies   facteur total observé
     0                36   de ×1 à ×1
     1                18   de ×0.5 à ×2

maximum de règles sur une même voie : 1


8. heartOverBody et bodyWisdom se superposent-ils ?
──────────────────────────────────────────────────────────────────
heartOverBody seul : 0
bodyWisdom seul    : 1
LES DEUX           : 0   ← ×2 puis ×0,5, effet net nul et silencieux


4. Zone morte entre avoidanceFear et protectiveFear
──────────────────────────────────────────────────────────────────
voies avec une peur forte : 11
dont dans la zone morte   : 3  (q3Regret entre 1 et 2)
   2026-09-11  fear 6 · regret 1   Faire l'admin sur mon ordi
   2026-01-20  fear 3 · regret 1   ne rien dire ce soir, en parler dema
   2026-01-12  fear 3 · regret 0.25   Aller au bar


9. Quels mots ne devraient pas passer avec includes() ?
──────────────────────────────────────────────────────────────────
Une racine trouvée AU MILIEU d'un mot : includes() ne s'ancre nulle part.

aucun


12. Distribution des pathScore et position du zéro
──────────────────────────────────────────────────────────────────
min -4.5 · q1 1.25 · médiane 5.5 · q3 9.5 · max 27
sous zéro : 6 · à zéro : 3 · au-dessus : 45

Avec X et Z à 3 :
   greatPath    38 voies (70 %)
   fairPath     14 voies (26 %)
   poorPath     2 voies (4 %)


2. Types de verdict produits
──────────────────────────────────────────────────────────────────
   shuffleCoin    11
   pickGreat      11
   shuffleCards   3


11. Corrélation du score avec la satisfaction
──────────────────────────────────────────────────────────────────
(le seul test qui ouvre la colonne Satisfaction)

   good   16 dilemmes · score moyen de la voie recommandée 10.79
   bad     3 dilemmes · score moyen de la voie recommandée 7.17
   meh     3 dilemmes · score moyen de la voie recommandée 16.92
```

---

## 2. Faux positifs greatPath

**15 faux positifs sur 22 dilemmes avec feedback (68 %)**, très majoritairement
de type B (13/15) : le moteur classe `greatPath` beaucoup plus large que ce qui
a réellement été choisi.

| Date | Voie greatPath | Type | Code décision réel |
|---|---|---|---|
| 2026-09-11 | Faire dame damier à Sing or die | B | A |
| 2026-09-11 | Jouer du synthé | B | A |
| 2026-08-31 | Aller a la chorale | B | C |
| 2026-08-31 | Rentrer chez maria | B | C |
| 2026-03-30 | Aller à la Chorale boucan | B | A |
| 2026-03-26 | Cam | A (meh) | B |
| 2026-02-10 | Aller à BZ et voir Athenais | B | B |
| 2026-01-01 | Rester le week-end dans ma ville natale | B | B |
| 2026-01-19 | Continuer à chercher pour l'Inde ou autre | B | A |
| 2026-01-15 | Aller voir le film avec Romane | B | A |
| 2026-01-15 | Continuer à chercher pour l'Inde ou autre | A (meh) | B |
| 2026-01-15 | Continuer le repos | B | X |
| 2026-01-13 | Annuler et dessiner chez moi | A (meh) | B |
| 2026-01-13 | Vidéos youtube couleurs | B | X |
| 2026-01-12 | Rester chez moi tester le B52 | B | B |

> Les deux lignes `2026-02-10` et `2026-01-01` (greatPath "B" / code décision
> "B" mais sur des lettres différentes selon le dilemme) et les deux lignes
> `2026-01-19`/`2026-01-15` "Continuer à chercher pour l'Inde ou autre"
> (contenu strictement identique — doublon probable dans le CSV) méritent
> une vérification.

### Détail pas à pas de chaque faux positif

#### 2026-09-11 — « Faire dame damier à Sing or die » (B)
scope: no | HP: 3 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Un peu flemme, mais j'aimerais bien y retourner"
- Q2: "Du bonheur dans mon ancien endroit préféré, le faire découvrir à Charlotte"
- Q3: "Mmh, un peu frustrée mais ça peut être un autre jour"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 2.25 | 3 | 0.75 | 0.375 | 0 | 0.25 | 0 | 3 |

pathPoints = **8.625** · règles: `reversible (×0.5)` · pathScore = **4.3125** · pathRank = greatPath

mots détectés : `hooks/indifference/strong "flemme" x0.25` · `sparks/relief/strong "bien"` · `hooks/reversible/flag "retourner"` · `sparks/outings/moderate "endroit"` · `sparks/curiosity/moderate "découvrir"` · `hooks/indifference/weak "mmh" x0.5` · `hooks/regret/weak "frustr" x0.25` · `hooks/reversible/flag "peut"` · `hooks/reversible/flag "autre jour"`

#### 2026-09-11 — « Jouer du synthé » (B)
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "C'est cool, j'ai peu l'occasion de le faire"
- Q2: "Je m'amuse et j'avance sur ma musique"
- Q3: "Je peux le faire"
- coût: 0 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4 | 6 | 0 | 0 | 0 | 0 | 0 | 3 |

pathPoints = **13** · règles: aucune · pathScore = **13** · pathRank = greatPath

mots détectés : `sparks/playful/moderate "jouer"` · `sparks/music/moderate "synth"` · `sparks/desire/weak "cool"` · `sparks/playful/moderate "amuse"` · `sparks/achievements/strong "avance"` · `sparks/music/moderate "musique"`

#### 2026-08-31 — « Aller a la chorale » (A)
scope: no | HP: 2 | code décision réel: C | satisfaction: good | choisie: non
- Q1: "Flemme anxiete"
- Q2: "Joie partage chant"
- Q3: "Maybe regret"
- coût: 2 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1.5 | 6 | 4 | 2 | 1 | 3 | 0 | 3 |

pathPoints = **9.5** · règles: aucune · pathScore = **9.5** · pathRank = greatPath · damage = true

mots détectés : `sparks/music/moderate "chorale"` · `hooks/damage/strong "flemme"` · `hooks/fear/weak "anxi"` · `sparks/desire/strong "joie"` · `sparks/connections/moderate "partage"` · `sparks/music/moderate "chant"` · `hooks/trivial/weak "maybe"` · `hooks/regret/strong "regret"`

#### 2026-08-31 — « Rentrer chez maria » (B)
scope: no | HP: 2 | code décision réel: C | satisfaction: good | choisie: non
- Q1: "Bof"
- Q2: "Du repos, des rires, du jeu"
- Q3: "Rien"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 6 | 1 | 0.5 | 0 | 0 | 0 | 0 |

pathPoints = **5.5** · règles: aucune · pathScore = **5.5** · pathRank = greatPath

mots détectés : `hooks/indifference/weak "bof"` · `sparks/relief/strong "repos"` · `sparks/wellbeing/moderate "rire"` · `sparks/playful/moderate "jeu"` · `hooks/trivial/weak "rien"`

#### 2026-03-30 — « Aller à la Chorale boucan » (B)
scope: no | HP: 7 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Enthousiasme"
- Q2: "Passer un autre moment à chanter, découvrir"
- Q3: "Peur de pas avoir l'occasion"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4.5 | 0 | 3 | 1.5 | 0 | 0 | 0 | 3 |

pathPoints = **9** · règles: aucune · pathScore = **9** · pathRank = greatPath

mots détectés : `sparks/music/moderate "chorale"` · `sparks/desire/strong "enthousiasme"` · `sparks/music/moderate "chant" [inversé]` · `sparks/curiosity/moderate "découvrir"` · `hooks/fear/strong "peur"`

#### 2026-03-26 — « Cam » (B)
scope: maybe | HP: 2 | code décision réel: B | satisfaction: meh | choisie: oui
- Q1: "excitation et peur"
- Q2: "trop cool, faire plein de trucs, rencontres, projets"
- Q3: "rien / regrets, déception"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3 | 5.5 | 5 | 5 | 3 | 4 | 0 | 0 |

pathPoints = **13.5** · règles: `avoidanceFear (×2)` · pathScore = **27** · pathRank = greatPath

> Score le plus extrême de tous les faux positifs — poussé par `avoidanceFear`
> sur un `q1Fear` de seulement 3.

mots détectés : `sparks/desire/strong "excitation"` · `hooks/fear/strong "peur"` · `sparks/desire/weak "trop cool"` · `sparks/connections/moderate "rencontres"` · `sparks/achievements/strong "projet"` · `hooks/trivial/weak "rien"` · `hooks/regret/strong "regret"` · `hooks/regret/weak "decep"`

#### 2026-02-10 — « Aller à BZ et voir Athenais » (A)
scope: maybe | HP: 6 | code décision réel: B | satisfaction: good | choisie: non
- Q1: "mmmh, cool et stressée en même temps"
- Q2: "joie de la voir, j'avance sur mon vélo, je vois rome"
- Q3: "juste reporté, mais je la vois pas"
- coût: 3 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0.25 | 9 | 0 | 0 | 0 | 0 | 0 | 2 |

pathPoints = **11.25** · règles: `reversible (×0.5)` · pathScore = **5.625** · pathRank = greatPath

mots détectés : `sparks/connections/moderate "voir" x0.5` · `hooks/trivial/weak "mh" x0.5` · `sparks/desire/weak "cool" x0.5` · `hooks/regret/weak "stress" x0.5` · `sparks/desire/strong "joie"` · `sparks/connections/moderate "voir"` · `sparks/relief/strong "j'avance"` · `sparks/move/moderate "vélo"` · `hooks/reversible/flag "report" x0.5`

#### 2026-01-01 — « Rester le week-end dans ma ville natale » (A)
scope: maybe | HP: 5 | code décision réel: B | satisfaction: good | choisie: non
- Q1: "Envie de calme et de repères"
- Q2: "Me reposer et éviter la charge mentale"
- Q3: "Avoir l'impression de tourner en rond"
- coût: 1 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4 | 3 | 0 | 0 | 0 | 0 | 0 | 3 |

pathPoints = **10** · règles: aucune · pathScore = **10** · pathRank = greatPath · damage = true

mots détectés : `sparks/desire/weak "envie"` · `sparks/relief/strong "calme"` · `sparks/relief/strong "repos"` · `sparks/achievements/strong "évit"` · `hooks/damage/strong "charge mentale"`

#### 2026-01-19 — « Continuer à chercher pour l'Inde ou autre » (B)
scope: maybe | HP: 5 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Anxiété de fou, peur panique"
- Q2: "Plus de temps pour réfléchir et trouver le meilleur, peut être plus tôt qu'en Espagne"
- Q3: "Neutre ou angoissée"
- coût: 3 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 4 | 4 | 10 | 0 | 0 | 2 |

pathPoints = **6** · règles: `protectiveFear (×0.5)` · pathScore = **3** · pathRank = greatPath

> Identique (texte et scores) au faux positif du 2026-01-15 ci-dessous —
> doublon probable dans le CSV.

mots détectés : `hooks/fear/weak "anxi"` · `hooks/fear/strong "peur" x2` · `hooks/fear/strong "paniqu"` · `hooks/reversible/flag "peut" x0.5` · `hooks/indifference/weak "neutre"` · `hooks/fear/strong "angoiss"`

#### 2026-01-15 — « Aller voir le film avec Romane » (B)
scope: maybe | HP: 6 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "mmmmmmh je sais pas, un peu d'anxiété ? FOMO ?"
- Q2: "avoir enfin vu un film TPG, sortir ça a l'air cool"
- Q3: "rien"
- coût: 3 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1.5 | 5 | 1 | 1 | 0.5 | 0 | 0 | 0 |

pathPoints = **4.5** · règles: aucune · pathScore = **4.5** · pathRank = greatPath

mots détectés : `sparks/connections/moderate "voir"` · `hooks/trivial/weak "mh"` · `hooks/regret/weak "je sais pas"` · `hooks/fear/weak "anxi" x0.5` · `hooks/regret/weak "FOMO"` · `sparks/achievements/strong "enfin"` · `sparks/outings/moderate "sorti"` · `sparks/desire/weak "cool" x0.5` · `hooks/trivial/weak "rien"`

#### 2026-01-15 — « Continuer à chercher pour l'Inde ou autre » (B)
scope: maybe | HP: 5 | code décision réel: B | satisfaction: meh | choisie: oui
- Q1: "Anxiété de fou, peur panique"
- Q2: "Plus de temps pour réfléchir et trouver le meilleur, peut être plus tôt qu'en Espagne"
- Q3: "Neutre ou angoissée"
- coût: 3 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 4 | 4 | 10 | 0 | 0 | 2 |

pathPoints = **6** · règles: `protectiveFear (×0.5)` · pathScore = **3** · pathRank = greatPath

mots détectés : `hooks/fear/weak "anxi"` · `hooks/fear/strong "peur" x2` · `hooks/fear/strong "paniqu"` · `hooks/reversible/flag "peut" x0.5` · `hooks/indifference/weak "neutre"` · `hooks/fear/strong "angoiss"`

#### 2026-01-15 — « Continuer le repos » (B)
scope: no | HP: 6 | code décision réel: X | satisfaction: good | choisie: non
- Q1: "Peur de couler mais aussi... honnêtement soulagée"
- Q2: "Me reposer vraiment, dessiner, préparer Asturias"
- Q3: "En action"
- coût: 0 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4.5 | 6 | -3 | -1.5 | 1.5 | 0 | 0 | 3 |

pathPoints = **12** · règles: aucune · pathScore = **12** · pathRank = greatPath

mots détectés : `sparks/relief/strong "repos" x0.5` · `hooks/fear/strong "peur" x0.5` · `sparks/relief/strong "soulag"` · `sparks/relief/strong "repos"` · `sparks/create/moderate "dessiner" x2` · `sparks/achievements/strong "en action"`

#### 2026-01-13 — « Annuler et dessiner chez moi » (B)
scope: yes | HP: 2 | code décision réel: B | satisfaction: meh | choisie: oui
- Q1: "Soulagée, j'ai envie de créer"
- Q2: "Avancer sur mes dessins, me reconnecter à ma passion"
- Q3: "Un peu coupable mais surtout libre"
- coût: 0 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 7 | 6 | -2.75 | -5.5 | 0 | 0.25 | 3 | 2 |

pathPoints = **9.5** · règles: aucune · pathScore = **9.5** · pathRank = greatPath

mots détectés : `sparks/create/moderate "dessiner"` · `sparks/relief/strong "soulag"` · `sparks/desire/weak "envie"` · `sparks/create/moderate "créer"` · `sparks/achievements/strong "avance"` · `sparks/aligned/moderate "reconnect"` · `sparks/aligned/moderate "passion"` · `hooks/regret/weak "coupable" x0.25` · `sparks/relief/strong "libre"`

#### 2026-01-13 — « Vidéos youtube couleurs » (A)
scope: maybe | HP: 3 | code décision réel: X | satisfaction: good | choisie: non
- Q1: "Mmmmh why not"
- Q2: "J'aurais appris des trucs sur les couleurs, et ça débloquera les deux autres vidéos qui font suite, ça fait longtemps que ça traîne"
- Q3: "Change rien !"
- coût: 1 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 3 | 1 | 1 | 0 | 0 | 0 | 0 |

pathPoints = **4** · règles: aucune · pathScore = **4** · pathRank = greatPath

mots détectés : `hooks/indifference/weak "mmh"` · `sparks/desire/weak "why not"` · `sparks/achievements/strong "debloqu"` · `hooks/trivial/weak "change rien"`

#### 2026-01-12 — « Rester chez moi tester le B52 » (A)
scope: no | HP: 1 | code décision réel: B | satisfaction: good | choisie: non
- Q1: "pffff rester toute seule à la maison"
- Q2: "bien reposée et en forme pour le lac demain"
- Q3: "Ça dépend, maybe épuisée deg dead pas capable de profiter du lac, maybe contente d'être sortie"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0.25 | 7.5 | 9 | 4.5 | 0 | 3 | 3 | 0 |

pathPoints = **12.25** · règles: `bodyWisdom (×0.5)` · pathScore = **6.125** · pathRank = greatPath · damage = true

mots détectés : `sparks/curiosity/moderate "tester" x0.5` · `hooks/trivial/weak "pf" x0.5` · `sparks/relief/strong "bien"` · `sparks/relief/strong "repos"` · `sparks/wellbeing/moderate "en forme"` · `hooks/trivial/weak "ça dépend"` · `hooks/trivial/weak "maybe"` · `hooks/damage/strong "épuis"` · `hooks/regret/strong "deg"` · `hooks/damage/strong "dead"` · `sparks/aligned/moderate "capable" [inversé]` · `hooks/trivial/weak "maybe"` · `sparks/relief/strong "content"` · `sparks/outings/moderate "sorti"`
