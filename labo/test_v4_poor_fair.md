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
