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

