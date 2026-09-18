


# Oracle V4 — voies poorPath et fairPath, détail complet

Mesuré sur les 25 dilemmes réels de `saves/sauvegardes.csv`.

poorPath : 2 voies · fairPath : 14 voies


---

## poorPath (2)

#### 2026-03-26 — « Guillemette » (A)
scope: maybe | HP: 2 | code décision réel: B | satisfaction: meh | choisie: non
- Q1: "neutre, flemme,"
- Q2: "satisfaction, stabilité"
- Q3: "rien"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -4 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |

pathPoints = **-3** · règles: aucune · pathScore = **-3** · pathRank = poorPath
drapeaux: damage

mots détectés : hooks/indifference/weak "neutre" · hooks/damage/strong "flemme" · hooks/trivial/weak "rien"

#### 2026-03-22 — « Marcher direct » (B)
scope: maybe | HP: 1 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Ça me stresse. Douleur."
- Q2: "Vite à la maison, j'ai envie de pisser. La chose logique à faire c'est de tracer."
- Q3: "J'en sais rien. Peut-être que je serais arrivée stressée et j'aurais vu mon hôte dans de mauvaises dispositions."
- coût: 2 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -4 | 1 | 0.5 | 0.5 | 0 | 1 | 0 | -2 |

pathPoints = **-4.5** · règles: aucune · pathScore = **-4.5** · pathRank = poorPath
drapeaux: damage

mots détectés : hooks/regret/weak "stress" · hooks/damage/strong "douleur" · sparks/desire/weak "envie" · hooks/trivial/weak "j'en sais rien" · hooks/trivial/weak "peut-être" · hooks/regret/weak "stress" · sparks/connections/moderate "hote" · sparks/desire/weak "dispo"

---

## fairPath (14)

#### 2026-09-13 — « 2 coups d'avance » (B)
scope: no | HP: 5 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "mmh j'ai l'impression que ça peut être difficile mais cool"
- Q2: "je peux l'envoyer à Amir"
- Q3: "Je peux toujours le faire"
- coût: 0 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 1.5 | 1.5 | 0 | 0 | 0 | 0 | 0 | 1 |

pathPoints = **4** · règles: `reversible (×0.5)` · pathScore = **2** · pathRank = fairPath
drapeaux: reversible

mots détectés : sparks/achievements/strong "avance" x0.5 · hooks/indifference/weak "mmh" x0.5 · hooks/reversible/flag "peut" x0.25 · hooks/indifference/weak "difficile" x0.5 · sparks/desire/weak "cool" · sparks/connections/moderate "ami" · hooks/reversible/flag "peux toujours"

#### 2026-09-11 — « Mettre un toz à tout le monde et rester chez moi » (C)
scope: no | HP: 3 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Un peu de peur"
- Q2: "Je crée des trucs et je joue au steam deck"
- Q3: "Rien"
- coût: 0 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 0.5 | 1.5 | 0 | 0 | 1 |

pathPoints = **1.5** · règles: aucune · pathScore = **1.5** · pathRank = fairPath

mots détectés : hooks/fear/strong "peur" x0.5 · hooks/trivial/weak "rien"

#### 2026-09-11 — « Jouer sur le steam deck » (C)
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Moyen, j’suis pas hyper emballée par mon nouveau jeu"
- Q2: "Je vois pas le temps passer"
- Q3: "Je peux toujours le faire"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 1 | 1.5 | 0 | 0 | 0 | 0 | 0 | 0 |

pathPoints = **2.5** · règles: `reversible (×0.5)` · pathScore = **1.25** · pathRank = fairPath
drapeaux: reversible

mots détectés : sparks/playful/moderate "jouer" · hooks/indifference/weak "moyen" · hooks/indifference/weak "pas hyper emballée" · sparks/playful/moderate "jeu" · sparks/passion/moderate "pas le temps passer" · hooks/reversible/flag "peux toujours"

#### 2026-05-01 — « Rester a l’intérieur » (A)
scope: maybe | HP: 2 | code décision réel: A | satisfaction: bad | choisie: oui
- Q1: "Ahhhh j’me sens coupable"
- Q2: "Rien"
- Q3: "Rien"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | -1 | 1 | 1 | 3 | 0 | 0 | 0 |

pathPoints = **-1** · règles: `protectiveFear (×0.5)` · pathScore = **-0.5** · pathRank = fairPath

mots détectés : hooks/fear/strong "ah" · hooks/regret/weak "coupable" · hooks/trivial/weak "rien" · hooks/trivial/weak "rien"

#### 2026-03-31 — « Ne pas envoyer le mail » (B)
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Culpabilité"
- Q2: "Je gagne du temps"
- Q3: "Libéré"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3 | 3 | -3 | -6 | 0 | 0 | 3 | 0 |

pathPoints = **0** · règles: aucune · pathScore = **0** · pathRank = fairPath

mots détectés : hooks/guilt/strong "culpabili" [inversé] · sparks/achievements/strong "gagne" · sparks/relief/strong "liber"

#### 2026-03-30 — « Aller chez Léa » (B)
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "Bof"
- Q2: "Mes affaires"
- Q3: "Rien, je peux y aller demain"
- coût: 1 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 0 | 1 | 2 | 0 | 0 | 0 | 0 |

pathPoints = **1** · règles: aucune · pathScore = **1** · pathRank = fairPath

mots détectés : hooks/indifference/weak "bof" · hooks/trivial/weak "rien"

#### 2026-01-21 — « Continuer à travailler sur QF » (A)
scope: maybe | HP: 7 | code décision réel: A | satisfaction: bad | choisie: oui
- Q1: "mmh ça commence à faire beaucoup"
- Q2: "un outil de plus en plus utile et efficace"
- Q3: "je pourrais toujours reprendre"
- coût: 2 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0.5 | 0.75 | -3 | -3 | 0 | 0 | 0 | 0 |

pathPoints = **-1.75** · règles: aucune · pathScore = **-1.75** · pathRank = fairPath

mots détectés : sparks/work/moderate "travail" · hooks/indifference/weak "mmh" · sparks/achievements/strong "utile" x0.25 · sparks/achievements/strong "reprendre"

#### 2026-01-20 — « ne rien dire ce soir, en parler demain » (B)
scope: maybe | HP: 4 | code décision réel: B | satisfaction: bad | choisie: oui
- Q1: "ça me fait peur"
- Q2: "peut être qu'elles réfléchiront demain"
- Q3: "je sais pas"
- coût: 4 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 0 | 1 | 1 | 3 | 1 | 0 | 0 |

pathPoints = **0** · règles: aucune · pathScore = **0** · pathRank = fairPath

mots détectés : hooks/trivial/weak "rien" · hooks/fear/strong "peur" · hooks/reversible/flag "peut" · hooks/regret/weak "je sais pas"

#### 2026-01-15 — « Chercher job mi-temps maintenant » (A)
scope: no | HP: 6 | code décision réel: X | satisfaction: good | choisie: non
- Q1: "Pffff l'impression de me trahir"
- Q2: "Avoir de l'argent, rester à Strasbourg"
- Q3: "Continue à me reposer"
- coût: 4 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 0 | -3 | -1.5 | 0 | 0 | 3 | 0 |

pathPoints = **-2.5** · règles: aucune · pathScore = **-2.5** · pathRank = fairPath

mots détectés : hooks/trivial/weak "pf" · sparks/relief/strong "repos"

#### 2026-01-13 — « Aller au rendez-vous avec ma conseillère » (A)
scope: yes | HP: 2 | code décision réel: B | satisfaction: meh | choisie: non
- Q1: "Bof, elle est moins intelligente que moi"
- Q2: "Respecter le rendez-vous, peut-être un truc utile"
- Q3: "Un peu coupable de l'avoir posé un lapin"
- coût: 2 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0.5 | 5 | -2.5 | -5 | 0 | 0.5 | 3 | 0 |

pathPoints = **0.5** · règles: aucune · pathScore = **0.5** · pathRank = fairPath

mots détectés : sparks/commitment/moderate "rendez-vous" · hooks/indifference/weak "bof" · sparks/aligned/moderate "respect" · sparks/commitment/moderate "rendez-vous" · hooks/trivial/weak "peut-être" · sparks/achievements/strong "utile" · hooks/regret/weak "coupable" x0.5 · sparks/relief/strong "posé"

#### 2026-01-13 — « BD Tour du monde 80 jours » (B)
scope: maybe | HP: 3 | code décision réel: X | satisfaction: good | choisie: non
- Q1: "Flemme ! Peur de m'ennuyer"
- Q2: "Être à fond dans l'univers du Jules Vernes, apprendre de la géographie"
- Q3: "Un poil coupable, mais peux toujours le lire"
- coût: 3 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -3 | 0 | 0.25 | 0.25 | 1 | 0.25 | 0 | 1 |

pathPoints = **-1.75** · règles: `reversible (×0.5)` · pathScore = **-0.875** · pathRank = fairPath
drapeaux: reversible

mots détectés : hooks/indifference/strong "flemme" · hooks/fear/weak "peur de m'ennuyer" · hooks/regret/weak "coupable" x0.25 · hooks/reversible/flag "peux toujours"

#### 2026-01-13 — « Rester au lit » (A)
scope: maybe | HP: 3 | code décision réel: B | satisfaction: good | choisie: non
- Q1: "Mmmmmmmh oui mais non"
- Q2: "Du repos mais bon je fais rien"
- Q3: "Fière"
- coût: 0 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -0.5 | 0.5 | -3 | -3 | 0 | 0 | 3 | 3 |

pathPoints = **0** · règles: aucune · pathScore = **0** · pathRank = fairPath

mots détectés : hooks/indifference/weak "mmh" x0.5 · sparks/relief/strong "repos" x0.5 · hooks/trivial/weak "rien" · sparks/relief/strong "fièr"

#### 2026-01-12 — « Aller au Molo » (A)
scope: maybe | HP: 1 | code décision réel: X | satisfaction: good | choisie: non
- Q1: "Pffff flemme"
- Q2: "Rigoler et danser avec Alan et Matou, ptet rencontrer une meuf qui me plaît"
- Q3: "Un peu dommage car ça fait longtemps qu'on se rate avec Alan"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -4 | 4.5 | 0.5 | 0.5 | 0 | 0.5 | 0 | 0 |

pathPoints = **1** · règles: aucune · pathScore = **1** · pathRank = fairPath
drapeaux: damage

mots détectés : hooks/trivial/weak "pf" · hooks/damage/strong "flemme" · sparks/playful/moderate "rigoler" · sparks/move/moderate "danser" · hooks/trivial/weak "ptet" · sparks/connections/moderate "meuf" · sparks/desire/weak "plaît" · hooks/regret/weak "dommage" x0.5

#### 2026-01-12 — « Aller au bar » (B)
scope: maybe | HP: 1 | code décision réel: X | satisfaction: good | choisie: non
- Q1: "Angoisse"
- Q2: "Rigoler ensemble"
- Q3: "Un peu gênée parce qu'on va se revoir demain, mais de toutes façons j'avais dit non"
- coût: 2 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 3 | 0.25 | 0.25 | 3 | 0.25 | 0 | -2 |

pathPoints = **1.25** · règles: `reversible (×0.5)` · pathScore = **0.625** · pathRank = fairPath
drapeaux: reversible

mots détectés : hooks/fear/strong "angoiss" · sparks/playful/moderate "rigoler" · sparks/connections/moderate "ensemble" · hooks/regret/weak "genee" x0.25 · hooks/reversible/flag "revoir" x0.5

---

# Faux positifs greatPath


Critère de faux positif, tel que défini par l'autrice :
- **type A** — la voie rankée `greatPath` est celle qui a été choisie, mais la
  satisfaction réelle a été `meh` ou `bad`.
- **type B** — la voie rankée `greatPath` n'a pas été choisie, et le choix
  réellement fait a donné `good`.

---


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


# Oracle V4 — voies avec pathScore > 12

Mesuré sur les 25 dilemmes réels de `saves/sauvegardes.csv`.

11 voies sur 54 au-dessus de 12, triées par score décroissant.

---

#### 2026-03-26 — « Cam » (B) — pathScore 27
scope: maybe | HP: 2 | code décision réel: B | satisfaction: meh | choisie: oui
- Q1: "excitation et peur"
- Q2: "trop cool, faire plein de trucs, rencontres, projets"
- Q3: "rien / regrets, déception"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3 | 5.5 | 5 | 5 | 3 | 4 | 0 | 0 |

pathPoints = **13.5** · règles: `avoidanceFear (×2)` · pathScore = **27** · pathRank = greatPath

mots détectés : sparks/desire/strong "excitation" · hooks/fear/strong "peur" · sparks/desire/weak "trop cool" · sparks/connections/moderate "rencontres" · sparks/achievements/strong "projet" · hooks/trivial/weak "rien" · hooks/regret/strong "regret" · hooks/regret/weak "decep"

#### 2026-01-13 — « Aller au lac » (B) — pathScore 22
scope: maybe | HP: 3 | code décision réel: B | satisfaction: good | choisie: oui
- Q1: "Aaaaaah c'est dur mais allez allez il faut y aller"
- Q2: "Je suis mega fière de moi, on s'amuse de fou"
- Q3: "Honteuse dégoûtée fâchée contre moi"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 2.5 | 7.5 | 9 | 9 | 0 | 9 | 0 | 3 |

pathPoints = **22** · règles: aucune · pathScore = **22** · pathRank = greatPath

mots détectés : hooks/indifference/weak "dur" x0.5 · sparks/desire/strong "allez" · sparks/desire/strong "allez" · hooks/injunctions/strong "il faut" · sparks/relief/strong "fièr" x2 · sparks/playful/moderate "amuse" · hooks/regret/strong "honte" · hooks/regret/strong "degout" · hooks/regret/strong "fâché"

#### 2026-03-30 — « Rester à l’apéro » (A) — pathScore 18
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "Un peu flemme"
- Q2: "On va chanter et je vois des gens cools"
- Q3: "Regret, c’est une opportunité"
- coût: 1 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1.5 | 2.5 | 3 | 6 | 0 | 3 | 0 | 2 |

pathPoints = **9** · règles: `irreversible (×2)` · pathScore = **18** · pathRank = greatPath
drapeaux: irreversible

mots détectés : hooks/indifference/strong "flemme" x0.5 · sparks/music/moderate "chant" · sparks/desire/weak "cools" · hooks/regret/strong "regret" · sparks/irreversible/flag "opportunité"

#### 2026-01-12 — « Aller chez Sophiane » (B) — pathScore 16
scope: no | HP: 1 | code décision réel: B | satisfaction: good | choisie: oui
- Q1: "Curieuse et excitée"
- Q2: "un nouveau pote dans mon quartier et qui aime sortir"
- Q3: "soit regret d'avoir raté l'opportunité, soit rassurée de pas avoir fait une folie en allant chez un inconnu en pleine nuit"
- coût: 1 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4 | 3 | 0 | 0 | 0 | 3 | 3 | 1 |

pathPoints = **8** · règles: `irreversible (×2)` · pathScore = **16** · pathRank = greatPath
drapeaux: irreversible

mots détectés : sparks/desire/weak "curieu" · sparks/achievements/strong "excit" · sparks/desire/strong "aime sortir" · hooks/regret/strong "regret" · sparks/irreversible/flag "opportunité" · sparks/relief/strong "rassur"

#### 2026-01-15 — « Rester chez Leonie écrire ma lettre » (A) — pathScore 15.75
scope: maybe | HP: 6 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "c'est ce que j'avai décidé de faire en plus j'suis confort sur le canapé"
- Q2: "un peu de paix, d'avancer sur le truc de yoga"
- Q3: "culpabilité, rebelote"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3.75 | 6 | 3 | 3 | 0 | 0 | 0 | 3 |

pathPoints = **15.75** · règles: aucune · pathScore = **15.75** · pathRank = greatPath

mots détectés : sparks/work/moderate "écrire" · sparks/work/moderate "lettre" · sparks/wellbeing/moderate "confort" x0.5 · sparks/relief/strong "paix" x0.5 · sparks/achievements/strong "avance" · sparks/move/moderate "yoga" · hooks/guilt/strong "culpabili"

#### 2026-01-19 — « Annuler l'Inde et recontacter Asturias Yoga » (A) — pathScore 14.25
scope: maybe | HP: 5 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "Excitée mais aussi honteuse"
- Q2: "Consolider un projet"
- Q3: "Peur du regret"
- coût: 2 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -0.75 | 6 | 6 | 6 | 0 | 3 | 0 | 3 |

pathPoints = **14.25** · règles: aucune · pathScore = **14.25** · pathRank = greatPath

mots détectés : sparks/move/moderate "yoga" x0.5 · sparks/achievements/strong "excit" x0.5 · hooks/regret/strong "honte" · sparks/achievements/strong "consolider" · sparks/achievements/strong "projet" · hooks/fear/strong "peur" · hooks/regret/strong "regret"

#### 2026-01-15 — « Annuler l'Inde et recontacter Asturias Yoga » (A) — pathScore 14.25
scope: maybe | HP: 5 | code décision réel: B | satisfaction: meh | choisie: non
- Q1: "Excitée mais aussi honteuse"
- Q2: "Consolider un projet"
- Q3: "Peur du regret"
- coût: 2 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -0.75 | 6 | 6 | 6 | 0 | 3 | 0 | 3 |

pathPoints = **14.25** · règles: aucune · pathScore = **14.25** · pathRank = greatPath

mots détectés : sparks/move/moderate "yoga" x0.5 · sparks/achievements/strong "excit" x0.5 · hooks/regret/strong "honte" · sparks/achievements/strong "consolider" · sparks/achievements/strong "projet" · hooks/fear/strong "peur" · hooks/regret/strong "regret"

#### 2026-09-13 — « Alice ça glisse » (A) — pathScore 14
scope: no | HP: 5 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "fun, mais ça me fait peur"
- Q2: "un tube, j'aurais enfin fait quelque chose de ce hook que j'ai"
- Q3: "je l'aurais toujours en tête"
- coût: 0 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0.5 | 3 | 3 | 1.5 | 3 | 3 | 0 | 2 |

pathPoints = **7** · règles: `avoidanceFear (×2)` · pathScore = **14** · pathRank = greatPath

mots détectés : sparks/desire/weak "fun" x0.5 · hooks/fear/strong "peur" · sparks/achievements/strong "enfin" · hooks/regret/strong "toujours en tête"

#### 2026-05-01 — « Aller a la manif » (B) — pathScore 14
scope: maybe | HP: 2 | code décision réel: A | satisfaction: bad | choisie: non
- Q1: "Ahhhh angoisse"
- Q2: "Rencontres fierté amusement"
- Q3: "Regret"
- coût: 3 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 6 | 3 | 3 | 6 | 3 | 0 | -2 |

pathPoints = **7** · règles: `avoidanceFear (×2)` · pathScore = **14** · pathRank = greatPath

mots détectés : hooks/fear/strong "ah" · hooks/fear/strong "angoiss" · sparks/connections/moderate "rencontres" · sparks/relief/strong "fièr" · sparks/playful/moderate "amuse" · hooks/regret/strong "regret"

#### 2026-09-11 — « Jouer du synthé » (B) — pathScore 13
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: non
- Q1: "C’est cool, j’ai peu l’occasion de le faire"
- Q2: "Je m’amuse et j’avance sur ma musique"
- Q3: "Je peux le faire"
- coût: 0 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4 | 6 | 0 | 0 | 0 | 0 | 0 | 3 |

pathPoints = **13** · règles: aucune · pathScore = **13** · pathRank = greatPath

mots détectés : sparks/playful/moderate "jouer" · sparks/music/moderate "synth" · sparks/desire/weak "cool" · sparks/playful/moderate "amuse" · sparks/achievements/strong "avance" · sparks/music/moderate "musique"

#### 2026-01-01 — « Repartir plus tôt » (B) — pathScore 12.25
scope: maybe | HP: 5 | code décision réel: B | satisfaction: good | choisie: oui
- Q1: "Envie modérée mais plus stimulant"
- Q2: "Me sentir active, avancer"
- Q3: "Fatigue et stress du trajet"
- coût: 2 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 1.75 | 4.5 | 4 | 4 | 0 | 1 | 0 | 2 |

pathPoints = **12.25** · règles: aucune · pathScore = **12.25** · pathRank = greatPath
drapeaux: damage

mots détectés : sparks/desire/weak "envie" x0.25 · sparks/achievements/strong "stimulant" x0.5 · sparks/move/moderate "activ" · sparks/achievements/strong "avance" · hooks/damage/strong "fatigu" · hooks/regret/weak "stress"

# Oracle V4 — voies greatPath restantes (non couvertes par les rapports précédents)

Mesuré sur les 25 dilemmes réels de `saves/sauvegardes.csv`.

54 voies au total · 16 dans `test_v4_poor_fair.md` · 15 dans `test_v4_faux_positifs.md` · 9 dans `test_v4_score_sup_12.md` · **14 restantes ici**, triées par score décroissant.

Ce sont des voies greatPath qui ne sont ni des faux positifs (au sens défini plus tôt), ni au-dessus de 12 — le "gros du peloton" du rang greatPath.

---

#### 2026-01-14 — « Attendre après le médecin vendredi » (B) — pathScore 11
scope: yes | HP: 4 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "Soulagement court terme, anxiété de fond"
- Q2: "Avoir le certificat médical d'abord, réponse plus complète"
- Q3: "Anxiété qui continue de peser"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3 | 0 | 4 | 8 | 1 | 0 | 0 | 0 |

pathPoints = **11** · règles: aucune · pathScore = **11** · pathRank = greatPath

mots détectés : sparks/relief/strong "soulag" · hooks/fear/weak "anxi" · hooks/fear/weak "anxi" · hooks/rationalisation/strong "pese"

#### 2026-09-11 — « Aller voir un concert » (A) — pathScore 9.5
scope: no | HP: 3 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "J’sais pas bof"
- Q2: "Danser, simplement, être avec Lélé"
- Q3: "Osef"
- coût: 1 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4 | 3 | 1 | 0.5 | 0 | 0 | 0 | 2 |

pathPoints = **9.5** · règles: aucune · pathScore = **9.5** · pathRank = greatPath

mots détectés : sparks/connections/moderate "voir" · sparks/music/moderate "concert" · hooks/indifference/weak "bof" [inversé] · sparks/move/moderate "danser" · sparks/connections/moderate "être avec" · hooks/trivial/weak "osef"

#### 2026-01-14 — « Répondre maintenant à Charlotte (mail) » (A) — pathScore 9.5
scope: yes | HP: 4 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "Stress mais aussi envie d'en finir"
- Q2: "Avoir posé mes limites, trace écrite du handicap non-accommodé"
- Q3: "Frustrée de pas avoir agi"
- coût: 3 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3.5 | 3 | 1 | 2 | 0 | 1 | 0 | 1 |

pathPoints = **9.5** · règles: aucune · pathScore = **9.5** · pathRank = greatPath

mots détectés : hooks/regret/weak "stress" x0.5 · sparks/desire/weak "envie" · sparks/achievements/strong "en fini" · sparks/relief/strong "posé" · hooks/regret/weak "frustr"

#### 2026-01-14 — « Appeler Asturias Yoga maintenant » (A) — pathScore 8
scope: yes | HP: 5 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "Angoisse mais aussi excitée"
- Q2: "Peut-être une piste pour février/mars, ou au moins des contacts"
- Q3: "Frustration d'avoir procrastiné encore"
- coût: 2 | gain: 1

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 4.5 | 0.5 | 1 | 2 | 1.5 | 1 | 0 | 1 |

pathPoints = **8** · règles: aucune · pathScore = **8** · pathRank = greatPath

mots détectés : sparks/connections/moderate "appeler" x0.5 · sparks/move/moderate "yoga" x0.5 · hooks/fear/strong "angoiss" x0.5 · sparks/achievements/strong "excit" · hooks/trivial/weak "peut-être" · sparks/connections/moderate "contact" · hooks/regret/weak "frustr"

#### 2026-09-11 — « Faire l’admin sur mon ordi » (A) — pathScore 6.5
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "Ahhh j’ai pas envie ça me fait peur"
- Q2: "J’ai validé mes documents, soulagée"
- Q3: "Stress"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1.5 | 3 | 1 | 2 | 6 | 1 | 0 | 3 |

pathPoints = **6.5** · règles: aucune · pathScore = **6.5** · pathRank = greatPath

mots détectés : sparks/work/moderate "admin" · hooks/fear/strong "ah" · hooks/indifference/strong "pas envie" · hooks/fear/strong "peur" · sparks/relief/strong "soulag" · hooks/regret/weak "stress"

#### 2026-08-31 — « Aller marcher » (C) — pathScore 6.5
scope: no | HP: 2 | code décision réel: C | satisfaction: good | choisie: oui
- Q1: "Why not"
- Q2: "De la sérénite, de l’activité"
- Q3: "Rien"
- coût: 0 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 1 | 3 | 1 | 0.5 | 0 | 0 | 0 | 2 |

pathPoints = **6.5** · règles: aucune · pathScore = **6.5** · pathRank = greatPath

mots détectés : sparks/desire/weak "why not" · sparks/wellbeing/moderate "sérénité" · sparks/move/moderate "activ" · hooks/trivial/weak "rien"

#### 2026-03-31 — « Envoyer le mail » (A) — pathScore 6
scope: yes | HP: 5 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "Stress"
- Q2: "Faire ce dont j’ai envie"
- Q3: "Stress"
- coût: 3 | gain: 4

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 1 | 1 | 2 | 0 | 1 | 0 | 4 |

pathPoints = **6** · règles: aucune · pathScore = **6** · pathRank = greatPath

mots détectés : hooks/regret/weak "stress" · sparks/desire/weak "envie" · hooks/regret/weak "stress"

#### 2026-02-10 — « Rester à la maison jouer avec Lola » (B) — pathScore 5.875
scope: maybe | HP: 6 | code décision réel: B | satisfaction: good | choisie: oui
- Q1: "soulagée et stressée en même temps"
- Q2: "chill, joie, fun, détente"
- Q3: "pas possible de reporter, occasion ratée"
- coût: 0 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 1.75 | 7 | 0 | 0 | 0 | 0 | 0 | 3 |

pathPoints = **11.75** · règles: `reversible (×0.5)` · pathScore = **5.875** · pathRank = greatPath
drapeaux: reversible

mots détectés : sparks/playful/moderate "jouer" x0.5 · sparks/relief/strong "soulag" x0.5 · hooks/regret/weak "stress" x0.5 · sparks/wellbeing/moderate "chill" · sparks/desire/strong "joie" · sparks/desire/weak "fun" · sparks/wellbeing/moderate "détent" · hooks/reversible/flag "report" [inversé]

#### 2026-01-14 — « Attendre qu'ils répondent par message » (B) — pathScore 5.75
scope: yes | HP: 5 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "Soulagement temporaire mais anxiété de fond"
- Q2: "Pas de stress d'appel, mais ça traine"
- Q3: "Neutre ou un peu frustrée"
- coût: 0 | gain: 0

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 2.25 | 0.5 | 1.5 | 3 | 1 | 0.5 | 0 | 0 |

pathPoints = **5.75** · règles: aucune · pathScore = **5.75** · pathRank = greatPath

mots détectés : sparks/connections/moderate "message" x0.5 · sparks/relief/strong "soulag" x0.5 · hooks/fear/weak "anxi" · hooks/regret/weak "stress" [inversé] x0.5 · hooks/indifference/weak "neutre" · hooks/regret/weak "frustr" x0.5

#### 2026-03-22 — « S'asseoir sur un banc pour fumer » (A) — pathScore 4.5
scope: maybe | HP: 1 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "Ça m'apaise"
- Q2: "Ça me recharge légèrement"
- Q3: "Aucune idée — peut-être que j'arriverai dans de moins bonnes dispositions pour retrouver mon hôte"
- coût: 0 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 3 | 0 | -0.5 | -0.5 | 0 | 0 | 0 | 2 |

pathPoints = **4.5** · règles: aucune · pathScore = **4.5** · pathRank = greatPath

mots détectés : sparks/relief/strong "apaisé" · hooks/indifference/weak "aucune idée" · hooks/trivial/weak "peut-être" · sparks/desire/weak "dispo" · sparks/connections/moderate "hote"

#### 2026-01-20 — « Aller me plaindre auprès des filles » (A) — pathScore 4.5
scope: maybe | HP: 4 | code décision réel: B | satisfaction: bad | choisie: non
- Q1: "ça me fait peur !!!"
- Q2: "de la sérénité, elles sont au courant pour l'avenir"
- Q3: "fatigue"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 3 | 3 | 3 | 3 | 0 | 0 | 3 |

pathPoints = **9** · règles: `protectiveFear (×0.5)` · pathScore = **4.5** · pathRank = greatPath
drapeaux: damage

mots détectés : hooks/fear/strong "peur" · sparks/wellbeing/moderate "sérénité" · sparks/music/moderate "son" · hooks/damage/strong "fatigu"

#### 2026-09-13 — « Strong Enough » (C) — pathScore 3.5
scope: no | HP: 5 | code décision réel: (vide) | satisfaction: (sans retour) | choisie: non
- Q1: "ouah ça a l'air vraiment dur"
- Q2: "j'apprends à faire une instru disco"
- Q3: "je peux tjs le faire"
- coût: 1 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 1.5 | 0 | 0 | 0 | 0 | 0 | 3 |

pathPoints = **3.5** · règles: aucune · pathScore = **3.5** · pathRank = greatPath

mots détectés : hooks/indifference/weak "dur" · sparks/playful/moderate "instru"

#### 2026-03-30 — « Faire le tournoi d’échecs » (A) — pathScore 3
scope: no | HP: 7 | code décision réel: A | satisfaction: good | choisie: oui
- Q1: "Bof"
- Q2: "Un moment avec Yoann, peut peut-être gagner des parties"
- Q3: "J’aurai d’autres occasions"
- coût: 2 | gain: 2

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| -1 | 2 | 0 | 0 | 0 | 0 | 0 | 2 |

pathPoints = **3** · règles: aucune · pathScore = **3** · pathRank = greatPath

mots détectés : hooks/indifference/weak "bof" · hooks/reversible/flag "peut" · hooks/trivial/weak "peut-être" · sparks/achievements/strong "gagne"

#### 2026-01-21 — « commencer à ranger ma chambre ou faire la lessive » (B) — pathScore 3
scope: maybe | HP: 7 | code décision réel: A | satisfaction: bad | choisie: non
- Q1: "aaaaaah pas envie"
- Q2: "de la clarté, de la motivation"
- Q3: "rebelote, culpabilité"
- coût: 3 | gain: 3

| Q1 | Q2 | Q3 brut | Q3 (portée) | q1Fear | q3Regret | q3Relief | ressources |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 3 | 3 | 3 | 0 | 0 | 3 |

pathPoints = **6** · règles: `protectiveFear (×0.5)` · pathScore = **3** · pathRank = greatPath

mots détectés : sparks/selfcare/moderate "ranger" · sparks/selfcare/moderate "lessive" · hooks/fear/strong "ah" · hooks/indifference/strong "pas envie" · hooks/guilt/strong "culpabili"

