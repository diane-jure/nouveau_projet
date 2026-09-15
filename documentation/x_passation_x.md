## 📊 Ce qui a été mesuré (tout est dans `labo/`, avec README)

- **V2 : 67 % · V2.5 : 53 %** sur tes 25 dilemmes, critère `OracleWasRight`
- **Lecture du texte libre** : 88 % de couverture, 70 % exact, **95 % à un cran près** ; concordance des verdicts **100 % quand l'oracle est sûr**, les désaccords se concentrent sur les dilemmes déjà serrés
- **Mon moteur vs V2.5 sur données inédites : égalité.** Mon avance de 23 points était du surapprentissage — la démonstration vaut pour quiconque reprendra le barème


## Le journal-livre

**Décision : jamais deux pages visibles simultanément** (impossible sur
téléphone).

Le comportement voulu :

1. le journal s'ouvre sur un **livre fermé**, portant **deux onglets**
2. on choisit un onglet → le livre s'ouvre sur **la page de gauche**
3. on **fait glisser** → on passe à **la page de droite**

L'onglet choisit donc le *chapitre*, et le glissement choisit le *côté*.

## Le tirage de cartes

Idée majeure de la session, avec une réserve importante.

**La réserve :** un tirage de cartes dit « la réponse vient d'ailleurs ». Or
l'outil dit l'inverse : la réponse vient des réponses données, elle est
calculée, et le détail du calcul est consultable. Si le verdict principal
devient un tirage, l'outil perd ce qui le rend fiable.

**Les deux usages légitimes :**

1. **Pour le cas `PILE_OU_FACE` uniquement** — le moment où l'oracle dit
   littéralement « ça ne comptera pas, arrête de calculer, laisse le hasard
   décider ». Là un tirage est thématiquement exact, et plus beau qu'une pièce.
2. **Comme mise en scène du verdict calculé** — l'oracle *étale* les options
   comme des cartes, puis **en retourne une**. Le geste du tirage, la
   théâtralité, mais la carte retournée est celle que le calcul a désignée.
   On garde le rituel sans mentir.

## L'écran de quête complète

Transposition de l'écran « Sweet! » pour le retour d'expérience.

**Ce n'est pas de la décoration.** Dans l'historique, la colonne Satisfaction
est le maillon faible : beaucoup de lignes restent vides. C'est pourtant elle
qui rend le journal utile. Mettre la récompense exactement là où la pratique
décroche est probablement le meilleur usage de tout le moodboard.

⚠️ **Règle à respecter : l'écran doit célébrer d'avoir consigné, pas d'avoir
bien choisi.** Un dilemme noté « raté » et consigné est une réussite pour le
journal. Si l'écran ne félicite que les « good », les « bad » ne seront plus
jamais remplis — et ce sont les plus instructifs.

---
---

# → fonctionnalités

## Idée : illustrations tirées au sort sur les cartes

Un lot d'illustrations simples, tirées aléatoirement pour chaque option, afin
de ne pas toujours voir les mêmes images sur la voie A.

**Deux précautions indispensables :**

1. **Tirage stable, pas retiré à chaque affichage.** On tire une fois et on
   stocke l'identifiant de l'image dans le dilemme. Sinon l'illustration change
   quand on revient sur le dilemme, et la carte cesse d'« être » cette option.
2. **Les illustrations ne doivent rien signifier.** Si le lot contient un
   soleil et un orage, et que l'orage tombe au hasard sur l'option A, elle sera
   lue comme « mauvaise » avant même d'avoir répondu. Ça saboterait
   discrètement l'outil. → lot **neutre en humeur** (motifs, objets, paysages,
   symboles), ou assez varié pour qu'aucune image ne se lise comme un jugement.

Un lot de 20-30 suffit pour que ça ne tourne pas.

## Question ouverte : les PV et le négatif

*(Volontairement mise de côté — notée pour plus tard.)*

Une jauge de points de vie va de 0 à max : **elle ne sait pas exprimer le
négatif.** Or le négatif porte du sens dans le moteur — c'est le barreau
« soulagement » de Q3, qui doit *repousser* une option (cas « Retourner à Lyon »).

Pistes non tranchées :
- une barre bicolore à zéro central (ce que fait le prototype actuel)
- **un symbole différent** : des cœurs qui montent pour ce qui attire, et une
  **pastille distincte « soulagement »** au lieu d'une barre pour ce qui
  repousse. Probablement plus lisible et plus honnête
- deux compteurs séparés

## Idées d'écrans supplémentaires (non tranchées)

Nées de la question « que mettre dans une barre à quatre boutons » — sans
objet pour QF, mais les idées restent bonnes :

- **« En attente »** — un lieu dédié aux dilemmes sans retour d'expérience.
  Rend visible le maillon faible.
- **« Ce que j'ai appris »** — un écran de motifs tirés de l'historique.
  Exemple : *« quand tu réponds "flemme", tu le regrettes 2 fois sur 3 »*.
  Les données existent déjà et ne sont pas exploitées.

## Décisions d'UX déjà prises dans le prototype

- **Échelle obligatoire + note libre facultative.** L'échelle alimente le
  calcul, la note alimente le journal. **Le moteur ne lit jamais la note** —
  pas de LLM, donc pas d'interprétation de texte libre.
- **Le dilemme entre au journal dès la consultation**, pas à la clôture. Sinon
  les dilemmes non clôturés disparaissent.
- **Le verdict est figé dans le dilemme au moment de la consultation.** Si le
  barème évolue plus tard, le journal garde ce qui a été dit ce jour-là.
- **Un brouillon survit au rafraîchissement** de la page.
- **Le détail du calcul est toujours consultable.** L'oracle doit pouvoir se
  justifier — c'est ce qui le distingue d'une voyance.
- 2 options minimum, 4 maximum.

## Recommandation d'organisation du travail

**Ne pas faire travailler deux instances en parallèle** sur le même dépôt.

En revanche, **séparer dans le temps** :
- le **moteur est fini et prouvé** — il n'a pas besoin d'une instance, il a
  besoin qu'on le laisse tranquille
- une session **UI** a son contexte mangé par du CSS et de la mise en page
- une session **barème** a besoin de l'historique et du raisonnement

Le jour où `oracle_coeur` fait ajouter une règle : session dédiée, dont le
livrable est **un test qui passe**, pas un écran.

⚠️ **Risque principal d'un envoi vers une instance neuve :** elle découvrira le
barème à froid, le trouvera arbitraire, et voudra l'« améliorer ». Elle
changera un poids, ça paraîtra plus logique, et ça contredira l'historique sans
que personne ne s'en aperçoive. **La suite de régression est la seule
protection contre ça.**

---
---

# → oracle_cerveau

*(logique pure, destinée à être codée — état actuel implémenté et testé)*

## Les quatre questions

| | Question | Portée |
|---|---|---|
| **Q0** | Dans 10 jours, ça compte ? | posée une fois, pour tout le dilemme |
| **Q1** | Première sensation | par option |
| **Q2** | Si ça se passe bien | par option |
| **Q3** | Si demain tu l'as pas fait | par option |

## Les barreaux d'échelle

Un **barreau** = une réponse possible à une question, un cran de l'échelle.
Chacun porte un score. C'est ce qu'on choisit dans le menu, et c'est là que les
petites icônes iraient.

### Q0 — Dans 10 jours, ça compte ?
*Ne marque aucun point. Redistribue les poids des trois autres.*

| Barreau | Enjeu |
|---|---|
| Non, aucune trace | `leger` |
| J'sais pas trop | `moyen` |
| Oui, ça pèse | `lourd` |

### Q1 — Première sensation
*Deux dimensions distinctes : l'envie et la peur.*

| Barreau | envie | peur |
|---|---|---|
| Pfff… flemme | −2 | 0 |
| Bof, neutre | 0 | 0 |
| Ça me fait peur | −1 | **2** |
| J'ai envie, mais j'ai le trac | +1 | **1** |
| Pourquoi pas, je le sens | +1 | 0 |
| Enthousiasme franc | +2 | 0 |

### Q2 — Si ça se passe bien

| Barreau | Score |
|---|---|
| Rien de spécial | 0 |
| Un petit quelque chose | 1 |
| Un bon moment | 2 |
| Ça me nourrit vraiment | 3 |
| Ça change quelque chose | 4 |

### Q3 — Si demain tu l'as pas fait
*La seule échelle qui descend sous zéro. Progression volontairement non
linéaire : une occasion qui ne revient pas ne vaut pas « un peu plus » qu'une
frustration, elle vaut beaucoup plus.*

| Barreau | Score |
|---|---|
| Soulagement, franchement | **−2** |
| Rien, osef | 0 |
| Je peux toujours le faire | 0.5 |
| Un peu frustrée | 2 |
| Regret net | 3.5 |
| Occasion ratée, ça ne revient pas | 5 |

### Interrupteur supplémentaire, par option
**« Quelqu'un compte dessus »** — une parole donnée, un rendez-vous pris.

## Les poids

Q0 ne marque aucun point : il choisit le jeu de poids appliqué aux trois axes.

| Enjeu | sensation | gain | regret |
|---|---|---|---|
| `leger` | **1.6** | 1.0 | 0.6 |
| `moyen` | 1.0 | 1.0 | 1.3 |
| `lourd` | 0.6 | 1.2 | **2.0** |

*Lecture : si ça ne comptera pas, suis ton énergie. Si ça comptera, la
sensation du moment ment et le regret non.*

## Les trois règles conditionnelles

```
peurQuiCompte    si peur ≥ 1 ET regret ≥ 2
                 → +1 (ou +1.5 si enjeu lourd)

peurQuiProtege   si peur ≥ 2 ET regret ≤ 0
                 → −1

engagement       si « quelqu'un compte dessus »
                 → +3
```

**Calcul final d'une option :**
`total = (envie × w_sensation) + (gain × w_gain) + (regret × w_regret) + bonus`

## Les seuils

```
serre       1.2   en dessous de cet écart entre les deux premières, ex aequo
faible      4.0   au-dessus, plus rien ne mérite un verdict tranché
engagement  3     le bonus de parole donnée
intensite   6     seuil de déclenchement du « on nomme le dilemme »
```

## Les types de verdict

| Type | Condition |
|---|---|
| `TETE` | une option devant, écart ≥ `serre` |
| `SERRE` | écart < `serre`, et enjeu `moyen` ou `lourd` |
| `PILE_OU_FACE` | écart < `serre`, et enjeu `leger` |

**Départage à égalité : la sensation.** À total égal, l'énergie du moment
tranche.

## Les drapeaux

Ils s'ajoutent au verdict, ils ne le remplacent pas.

| Drapeau | Condition | Effet |
|---|---|---|
| `aucuneNAppelle` | meilleur total ≤ 4.0 **ET** (aucune envie positive **OU** aucun regret) | propose d'ajouter une option C, ou de ne rien faire |
| `grandeDecision` | enjeu `lourd` **ET** intensité ≥ 6 | **nomme le dilemme avant de trancher** |
| `engagement` | l'option en tête porte une parole donnée | l'explicite |
| `peurQuiCompte` | l'option en tête est renforcée par la règle | nomme la peur |
| `peurQuiProtege` | une option est pénalisée par la règle | nomme le refus |

`intensité = max sur les options de (gain + |regret| + peur)`

## Le garde-fou : la suite de régression

**C'est la pièce la plus importante à transmettre.**

Les 22 dilemmes réels de l'historique sont encodés comme jeu de tests, avec une
**vérité terrain déduite des colonnes Satisfaction et Commentaire**.

Critère : pas « l'oracle est-il d'accord avec ce qui a été fait » mais
**« l'oracle est-il d'accord avec ce qui aurait dû être fait »**. Sur les cas
notés `bad`, un désaccord avec le choix réel est donc un **succès**.

Résultats actuels : **29 tests au vert**, **8/10 des choix satisfaisants
retrouvés**, **0 choix regretté recommandé**. Les deux écarts portent sur des
dilemmes signalés comme indécidables dans les commentaires d'origine ; le
moteur y répond « serré » plutôt que de trancher.

⚠️ **La conversion du texte libre de l'historique vers les barreaux est une
INTERPRÉTATION** (« un peu flemme » lu comme `flemme`, « why not » comme
`partant`). Le texte d'origine est conservé dans un champ `notes` pour que
chaque choix reste vérifiable et discutable.

---
---

# → oracle_coeur

*(d'où viennent les règles, et pourquoi)*

## Traçabilité : chaque règle vers sa ligne d'historique

**Le cahier des charges réel de cette session a été la colonne « Commentaire »
du tableau, plus que le brief initial.** Presque chaque règle est une phrase
de l'historique traduite en code.

| Règle | Ce qui la justifie |
|---|---|
| **Q3 est l'échelle la plus lourde** | *« mieux vaut essayer de faire quelque chose qui me donne bof envie que de regretter de pas l'avoir fait »* (1er mai) |
| **« Je peux toujours le faire » ≈ 0** | revient 5-6 fois dans l'historique, toujours sur l'option qu'il fallait déprioriser |
| **Saut non linéaire vers « occasion ratée »** | *« le truc qui gagne beaucoup et qui est rare »* ; *« le 1er mai ça n'a lieu qu'une fois par an »* |
| **Q1 sépare la flemme de la peur** | pattern statistique de l'historique : « ça me fait peur » accompagne la plupart des choix jugés satisfaisants (l'admin, le lac, Asturias) ; la flemme accompagne ce qu'il valait mieux lâcher. **Cette règle ne vient d'aucune théorie, seulement des données** |
| **`peurQuiProtege` (Q3 peut être négatif)** | *« il y a BEAUCOUP de négatif au week-end, alors que le médecin c'est plutôt neutre. Le calcul n'est pas bon »* (Lyon). Sans un barreau négatif, ce dilemme est insoluble |
| **`aucuneNAppelle`** | *« là on arrive à un moment où il faudrait proposer d'ajouter une option C :) »* ; *« deux options qui coûtent plus que l'énergie disponible »* |
| **`grandeDecision`** | *« dans un monde idéal l'oracle comprend qu'il s'agit d'une décision importante… il nomme plus explicitement le dilemme même s'il me conseille l'option A »* (Inde/Asturias) |
| **`engagement`** | *« bien sûr qu'il faut honorer un rendez-vous même si on n'a pas envie »* (RDV conseillère) |
| **`PILE_OU_FACE` et l'aveu d'ignorance** | *« là typiquement l'oracle a pas assez d'éléments pour trancher »* (ville natale) |

## Inspirations externes

- **« Decisive » (Chip & Dan Heath)** — leur premier péché de la décision est le
  *narrow framing* : poser le problème en « je fais X, oui ou non ». Le tableau
  d'origine est structurellement binaire, et le commentaire du 13/01 redécouvre
  exactement ça. Le drapeau `aucuneNAppelle` naît de cette rencontre.
- **Théorie du regret** (Bell ; Loomes & Sugden ; version populaire chez Bezos,
  *regret minimization framework*) — le regret anticipé est un meilleur guide
  que la préférence du moment. Justifie le poids de Q3. *L'historique disait
  déjà la même chose, et plus clairement.*
- **Affective forecasting** (Gilbert & Wilson) — on prédit mal ce qu'on
  ressentira. Justifie que Q0 puisse écraser Q1 : la sensation présente est une
  donnée peu fiable dès que l'échéance s'allonge.
- **Règle « 10/10/10 » (Suzy Welch)** — 10 minutes, 10 mois, 10 ans. Le Q0 « dans
  10 jours » lui ressemble beaucoup, mais **il venait déjà de l'autrice du
  projet**, il n'a pas été importé.

## Tensions non résolues

- **`engagement` est un bonus de +3, pas un veto.** Une très forte pression sur
  la balance, mais théoriquement franchissable si l'autre option écrase tout.
  C'était un compromis d'implémentation, pas une nécessité. **À trancher : un
  rendez-vous pris doit-il être inconditionnel ?** Si oui, ça se change en trois
  lignes.
- **Les émotions absentes de l'échelle Q1.** L'historique contient de la
  *culpabilité* et de la *honte*, qui ne se réduisent ni à la flemme ni à la
  peur. Elles ont été rabattues sur « bof » ou « peur » lors de l'encodage.
  Piste : une troisième dimension, ou des barreaux supplémentaires.
- **Le moteur ne sait pas qu'une option est impossible.** Dans le cas « Lyon »,
  l'ancien oracle répondait « aucun des deux » alors qu'il n'existait pas de
  troisième possibilité. Rien n'a été ajouté pour ça.
- **L'apprentissage depuis le journal n'existe pas encore.** Les données de
  satisfaction sont stockées mais n'influencent pas le barème. C'est
  l'ouverture la plus prometteuse : l'écran « Ce que j'ai appris », puis
  éventuellement un ajustement des poids.

---
---

# → oracle_phrases

## Principe d'architecture

**Le moteur calcule, les phrases parlent.** Séparation stricte, à préserver
quel que soit le langage ou le framework :

- le moteur ne produit **que des nombres et des codes** (`TETE`, `SERRE`,
  `peurQuiCompte`, `aucuneNAppelle`…)
- un fichier de phrases traduit ces codes en français
- on peut réécrire tout le ton sans risquer de casser un calcul, et tester le
  calcul sans lire un mot

Marqueurs de substitution utilisés : `{option}`, `{dauphin}`.

**Tirage stable des variantes :** la variante est choisie à partir d'une graine
dérivée du dilemme, pour que l'oracle ne change pas de mots à chaque réaffichage.

## Ordre de composition d'un verdict

L'ordre compte, il porte du sens :

1. **les mises en garde d'abord** (`grandeDecision`, `aucuneNAppelle`) — on
   nomme le dilemme avant de conseiller
2. **le verdict ensuite**
3. **ce qui a fait pencher la balance enfin** (`engagement`, `peurQuiCompte`,
   `peurQuiProtege`) — explicité, jamais implicite

Chaque réplique porte un **ton** qui pilote son style d'affichage :
`mise-en-garde` · `verdict` · `oracle` · `suite`

## Question de registre — non tranchée

Le moodboard parle doux (*« Resting isn't quitting—it's recharging your
sparkle »*). Le prototype codé pendant cette session est sec : *« Arrête de
calculer »*, *« Écoute-le »*.

**Avis émis :** garder le **verdict tranchant** et adoucir **tout ce qui
l'entoure**. La valeur de l'oracle, c'est qu'il tranche ; la chaleur doit vivre
dans les mises en garde et dans le retour d'expérience.

⚠️ **Le prototype existant gère déjà très bien le vocabulaire et les
formulations** — c'est lui qui fait référence sur ce point, pas les phrases
écrites pendant cette session.

## Exemples de phrases écrites (à titre d'échantillon)

**Verdict net, selon l'axe qui tranche :**
- *regret* : « Ce n'est pas l'envie qui tranche. C'est ce qu'il resterait demain matin. »
- *gain* : « Ce que ça t'apporte pèse plus lourd que tout le reste. »
- *sensation* : « Aujourd'hui ton énergie va là. Ne la contrarie pas pour rien. »

**Serré :** « Les deux se valent, ou presque. Je penche pour « {option} », d'un
cheveu. » / « Tu ne te tromperas pas beaucoup. »

**Pile ou face :** « Dans dix jours, tu ne sauras plus ce que tu as choisi. » /
« Arrête de calculer. Laisse la pièce décider. »

**Aucune n'appelle :** « Mais aucune de ces options ne t'appelle vraiment. » /
« Tu as le droit d'en écrire une troisième. Tu as même le droit de ne rien faire. »

**Grande décision :** « Pose la pièce. Ce n'est pas un choix de soirée. » /
« Les deux chemins engagent quelque chose de long. Ce que je dis ensuite est un
avis, pas un verdict. »

**Peur qui compte :** « Tu as peur devant « {option} », et ça te manquerait de
ne pas le faire. » / « Cette peur-là n'est pas un feu rouge. C'est un signe que
ça compte. »

**Peur qui protège :** « Devant « {option} » : la peur. Derrière : le
soulagement. » / « Ce n'est pas du trac, c'est un refus. Écoute-le. »

**Parole donnée :** « Quelqu'un compte sur toi pour « {option} ». » / « Ça ne
se met pas dans la balance des envies. »

---
---

# → sauvegardes

## Forme d'un dilemme enregistré

```
id            identifiant unique
date          horodatage
q0            le barreau choisi
options[]     nom, q1, q2, q3, engagement, notes{q1,q2,q3}
verdict       instantané figé au moment de la consultation
              (gagnant, type, écart, enjeu, drapeaux, scores)
tirage        résultat du pile ou face, le cas échéant
choixFinal    ce qui a été fait pour de vrai
satisfaction  'good' | 'meh' | 'bad'
commentaire   texte libre rétrospectif
cloture       booléen
```

À prévoir si les illustrations tirées au sort sont retenues : **un champ
`illustration` par option**, pour que le tirage soit stable.

## Interface de stockage

Six méthodes, **toutes asynchrones dès maintenant** même si le stockage local
est synchrone — c'est ce qui rendra la bascule vers Supabase invisible :

```
lister()        → Dilemme[]  (du plus récent au plus ancien)
enregistrer(d)  → Dilemme    (crée ou met à jour selon d.id)
supprimer(id)
vider()
exporter()      → string JSON
importer(json)  → nombre d'entrées ajoutées  (additif et idempotent)
```

Plus, à part : un **brouillon** (le dilemme en cours survit au
rafraîchissement) et des **réglages** (son, etc.).

## Schéma Supabase

```sql
create table dilemmes (
  id            text primary key,
  utilisateur   uuid references auth.users (id) default auth.uid(),
  date          timestamptz not null default now(),
  q0            text,
  options       jsonb not null default '[]',
  verdict       jsonb,
  tirage        text,
  choix_final   text,
  satisfaction  text check (satisfaction in ('good', 'meh', 'bad')),
  commentaire   text,
  cloture       boolean not null default false
);

alter table dilemmes enable row level security;

create policy "chacun ses dilemmes" on dilemmes
  for all using (utilisateur = auth.uid())
  with check (utilisateur = auth.uid());
```

Le bouton **Exporter** du journal produit exactement cette forme en JSON : de
quoi migrer les données locales sans rien perdre.

---
---

# Annexe — état du prototype codé

Dépôt `myleonis-git/nouveau_projet`, branche `claude/laughing-allen-bg64r3`.

**JS natif, zéro dépendance, zéro build.** Prévu pour Netlify (publication de
la racine). 248 Ko au total. Polices servies en local (55 Ko) plutôt que depuis
un CDN.

```
js/oracle.js      LE MOTEUR — fonctions pures, aucun texte, aucun DOM
js/scales.js      les 4 questions et leur barème
js/phrases.js     LES PHRASES — aucun calcul
js/storage.js     LES SAUVEGARDES — interface unique
js/screens.js     un écran = une fonction
js/kit.js         fabrique de composants DOM
js/audio.js       bips synthétisés (aucun fichier son)
js/main.js        routage et HUD
css/              palette / pixel / app / fonts, séparés
data/historique.js  les 22 dilemmes réels
test/             la régression (29 tests) et un rapport lisible
```

**Ce qui survit à un changement de codeur ou de framework** — `oracle.js`,
`scales.js`, `data/historique.js` et `test/` sont du JS pur sans DOM, donc
réutilisables tels quels en React ou ailleurs.

**Ce qui est jetable** — toute la couche visuelle, qui part dans la mauvaise
direction esthétique (fond sombre, police d'arcade). Voir
`inspiration_visuelle`.

**Commandes :**
```
npm test        la régression sur les 22 dilemmes
npm run rapport le tableau comparatif lisible
npm run dev     sert la racine sur localhost:5173
```
