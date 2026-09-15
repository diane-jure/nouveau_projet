> 🧠

## Scoring Recommandation

### idees
*+2/+4 et +1/+2, c'est le même système. c'est x2. Seuls comptent les **rapports** entre les valeurs — et le rapport entre les poids des trois questions. Donc la vraie question n'est pas « quelle échelle », c'est : _est-ce qu'une forte angoisse pèse deux fois un léger stress, ou trois fois ?_*

### variables
#### Q1
envie (legere / forte) addition
desinteret (leger/fort) soustraction
peur (légère/forte) règle
fatigue soustraction

**calcul de Q1:**

envie-désintérêt=motivation
- peur élevée et regret élevée = c'est important (peurQuiCompte pour QCM)
- peur basse et absence de regret = vraiment pas envie
- motivation basse et absence de regret = pas d'intérêt

#### Q2
récompense (légère/forte) addition
===idée: tous les mots bonus comptent double si dans Q2 ??
===pcq Q2 pèse dans la vraie vie mais pas dans ce scoring pour l'instant

#### Q3

soulagement(fort) ; soustraction
insignifiant (léger) ; soustraction
frustration (légèr) ; addition
egret (fort); addition
irreversibilité (vrai=addition/faux=soustraction)
repetition

**calcul de Q3:**


### bonus/malus = 
sur toutes les Q
#### Bonus
engagement

#### Malus
injonction
culpabilité

les bonus/malus sont des points mais créent aussi des tags pour les réponses suivantes

Q3: inversion des valeurs EXCEPTION injonction sociale

### pondérateurs =

**distance** (« un peu », « un poil »)
**confusion (« je sais pas », « ça dépend »)

prendre en compte les majuscules ????

#### Q0 / portee
====à confirmer====
portée = non   →  si écart faible : pile ou face
portée = oui   →  la peur seule ne peut pas disqualifier une option
portée = oui   →  le regret l'emporte en cas de conflit avec l'envie

portée = non/maybe si répétition dans Q3 = portee = oui

ET/OU
coefficient
par exemple:
Oui multiplie Q3 2
Non divise Q3 par 2

### points
====à confirmer====

cout > HP: alerte visuelle
éliminatoire ? sauf envie forte ET/OU regret fort ?
ou alors fait perdre valeur (forte)
ou alors fait perdre la valeur de (cout-HP) j'aime bien ça

gain:
au choix
toujours ajouté net
OU tranche en cas de doute
OU préfiltre avant la lecture mdr


### calcul


chaque voie,
somme de...
+règles

### comparaison
====à confirmer====

VALEURS ABSOLUES ??? oui je préfère ça
une voie avec un score de x est bon, quoi qu'il en soit
une voie avec un score de -x est mauvaise quoiqu'il en soit

-> la sortie tirage (pileface/card) pourra aussi souligner les qualités des différentes options
-> plus d'occurence du nom des autres voies dans les phrases

### catégories de décisions

choisir P pour sa valeur
ou, rejeter P pour sa valeur


### 

## Detection vocabulaire

### Points de vigilance
détecter la RACINE des mots (terrif*)
Attention envie =/= pas envie (enregistrer soit comme expression, soit le 'pas' comme pondérateur qui inverse - mais parfois ça ne marche pas comme 'pas vraiment envie')

souvent lettre multipliées: pfff ouffff bofff fleeemme mmmh nooon ouiiii

où classer les mmmh et ahhh ? analyser l'historique

que faire des verbes comme pouvoir ?

### Liste de mots

Q1
envie légère: why not, fun, envie, je veux
envie forte: excitée, allez, joie, hâte
désintérêt léger: flemme (si HP>=3) bof, dur, pffff, ennui
désintérêt fort: osef 'pas envie', je le sens pas, horreur, je veux pas

peur légère: stress, inquiète
peur forte: Ahhhh, angoiss*, peur, terrif*,  

fatigue: fatiguée épuisée flemme (si HP=<2)

Q2
récompense: génial, trop bien, rire, s'amuser


Q3
regret léger: stress
regret fort: honteuse, dégoutée, fachée contre moi

insignifiant: osef, pas grave, au pire, rien

soulagement: reposée, soulagée, ouf

irreversibilite vraie: occasion manquée, jamais
irreversibilite faux: peux toujours le faire, au pire

répétition: encore, procrastin*, lentement, longtemps, jamais, chaque fois, comme d'hab, rebelote,

TOUTES
bonus
engagement: « j'ai dit », « j'ai promis », « m'attend », « compte sur moi », « on a prévu »

connexion: pote* ami* papa père maman mère frère famille (maybe les prénoms: détecter une majuscule ?) ensemble, amour

passions: jeux, jouer, musique, chanter, échecs, plage, courir, pole dance, dessiner, écrire

*obligationspositives*: admin*, lettre, travail*, taff*,

????: besoin, fierté, soin

malus

injonction : « il faut  », « je devrais », « normal de », « on est censé », raisonnable


## Scoring dénouement

#### Followed Oracle
null pour pile ou face
true si recommandation ni l'un ni l'autre = decision aucun des deux / autre
#### OracleWasRight:
true si
- recommandation = choix & satisfaction Oui (3/3)
- donc false pour bof et non
- recommandation =/= choix & satisfaction Non ou Bof (1/3 ou 2/3)
- donc false uniquement pour oui


====o=========================


# old

## Les verdicts

| Verdict             | Quand                                    |
| ------------------- | ---------------------------------------- |
| **Une voie**        | un écart net entre les scores            |
| **La pièce**        | ça ne comptera pas : pile ou face assumé |
| **Les cartes**      | ça compte, mais rien ne départage        |
| **Aucune des deux** | toutes les voies sous zéro               |


## Poids proposés

Grossiers, entiers, dans l'esprit de Dawes. ====À discuter

| Signal            | Lu en   | Poids           | Pourquoi                                                |
| ----------------- | ------- | --------------- | ------------------------------------------------------- |
| Regret fort       | Q3      | **+6**          | le meilleur prédicteur de la littérature *et* du corpus |
| Regret modéré     | Q3      | **+2**          |                                                         |
| Regret nul        | Q3      | **−2**          | l'indifférence est une réponse                          |
| Soulagement fort  | Q3      | **−5**          | ne pas le faire soulagerait : signal, pas fatigue       |
| Élan fort         | Q1      | **+3**          | moitié du regret fort, conforme à λ ≈ 2                 |
| Élan modéré       | Q1      | **+1**          |                                                         |
| Désintérêt        | Q1      | **−1** à **−2** | selon l'état de la flemme                               |
| Refus net         | Q1      | **−3**          |                                                         |
| Récompense pleine | Q2      | **+3**          |                                                         |
| Récompense creuse | Q2      | **−1**          |                                                         |
| Valeur (Bonus)    | Q2      | **+1** à plat   | elle qualifie, elle ne pèse pas plus                    |
| Hameçon (Malus)   | Q1 / Q3 | **−2** chacun   |                                                         |
| Peur              | Q1      | **0**           | règles seulement                                        |

---
