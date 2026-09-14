# Passation — Quest Finder (QF)

> Récapitulatif d'une session de conception et de prototypage.
> Destiné à être découpé dans les fichiers Obsidian existants : chaque
> section majeure porte le nom de son fichier de destination.
>
> **Important pour une instance qui reprendrait ce dossier :** les images du
> moodboard ne sont pas jointes. Les descriptions graphiques de la section
> `inspiration_visuelle` sont volontairement détaillées pour les remplacer.

---
---

# → inspiration_visuelle

*(fichier vierge — voici de quoi l'inaugurer)*

## 1. Le vocabulaire du style

Les termes qui qualifient l'esthétique recherchée. Utiles pour chercher des
références, des assets, ou briefer quelqu'un.

### Familles esthétiques

| Terme | Ce que ça désigne |
|---|---|
| **Cozy pixel art** | le genre dominant du moodboard : pixel art chaleureux, non violent, palettes douces. Lignée Stardew Valley |
| **Cottagecore pixel** | variante rurale/végétale du précédent (fleurs, fermes, maisons) |
| **Kawaii pastel** | rondeurs, grands yeux, roses et lavandes, chibi |
| **Cross-stitch aesthetic** / point de croix | pixel art qui imite la broderie : texture de toile visible, couleurs mates. Très présent dans l'image de la sorcière |
| **Lo-fi / cozy gamer aesthetic** | l'imagerie « lofi girl » : chambre douillette, guirlandes lumineuses, casque audio, violets et roses |
| **Celestial / arcana / witchy** | soleil, lune, étoiles, tarot. Le registre des cartes |
| **GBA-era JRPG UI** | menus de Game Boy Advance / SNES : cadres beige-rosé, encadrés à bordure, chiffres alignés à droite |
| **Farm-sim UI / life-sim UI** | Stardew, Animal Crossing, Fields of Mistria : inventaires, onglets, fiches de personnage |

### Termes techniques et de design

| Terme | Ce que ça désigne |
|---|---|
| **UI diégétique** | une interface qui existe comme *objet* dans la fiction. Le journal-livre en est un cas exemplaire : ce n'est pas un écran « journal », c'est un livre qu'on ouvre. À garder comme principe directeur |
| **Skeuomorphisme** | l'objet imité (reliure à spirale, onglets cartonnés, page qui se tourne) |
| **9-slice / 9-patch** | la technique pour qu'un cadre ornementé s'étire à n'importe quelle taille sans déformer ses coins. **Le terme à connaître** pour tout cadre décoré |
| **Dithering** (tramage) | dégradés obtenus par damier de deux couleurs, faute de dégradé continu. Signature du pixel art |
| **Sprite sheet** | une image contenant toutes les étapes d'une animation (les séquences de pièce en sont) |
| **Animation en `steps()`** | en CSS, faire avancer une animation par crans nets au lieu d'interpoler. Indispensable, sinon le pixel art « glisse » |
| **Contour / outline** | le trait sombre qui cerne chaque forme. Presque jamais noir pur : plutôt prune ou marine très foncé |
| **Drop shadow décalée** | ombre portée franche de 1-2 px, sans flou |
| **Juicy UI** | interface qui « répond » : rebonds, tremblements, particules à chaque action |
| **Palette indexée** | se limiter volontairement à N couleurs (16, 32) pour la cohérence |

## 2. LA règle structurante : inverser le contraste

**C'est la découverte principale de la session.**

L'ensemble du moodboard fonctionne sur le même principe : **des formes cernées
d'un trait sombre, posées sur un fond clair.** Crème, beurre, rose poudré,
lavande, menthe.

Le premier prototype codé pendant cette session faisait l'inverse — des traits
lumineux sur fond noir — et c'est ce qui lui donnait un air « arcade / Windows
98 » au lieu de « console cozy ».

**Conséquences en cascade**, à ne pas sous-estimer :

- les **scanlines** (voile de lignes sombres horizontales) ne fonctionnent que
  sur fond sombre → à supprimer
- les **halos lumineux** autour des boutons ne fonctionnent que sur fond sombre
  → à supprimer
- à la place : **contours épais**, **ombres portées franches**, et de la
  **texture dans les aplats** (grain, toile, papier)

Ce n'est pas un réglage de couleurs, c'est un autre métier.

## 3. Palette

**Direction : beige rosé / crème, façon menus JRPG 16-32 bits.** Référence
explicite énoncée : *« les trucs qui me rendent nostalgique de ma Game Boy
Advance »*.

Familles de couleurs observées dans le moodboard :

- **Fonds** : crème, beurre pâle, beige rosé, parchemin
- **Accents** : rose bonbon, rose poudré, lavande, violet moyen, menthe, vert
  d'eau, or/jaune doux
- **Contours** : prune très foncé, marine très foncé — **jamais de noir pur**
- **Alertes / valeurs** : rouge framboise (PV), vert pomme (positif), or (score)

**Ressource à connaître : [lospec.com/palette-list](https://lospec.com/palette-list)**
— la référence du milieu pour les palettes pixel art, filtrables par nombre de
couleurs. Chercher les familles « pastel », « cozy », « soft ».

*(Note : le prototype actuel utilise SWEETIE-16, une palette 16 couleurs
classique mais sombre et saturée. Elle est à remplacer.)*

## 4. Typographie

**Statut : non tranché.** Press Start 2P n'est pas écartée — elle plaît.

Éléments factuels pour décider :

- **Press Start 2P** — copiée du lettrage des bornes d'arcade Namco.
  Monospace, très large, pas de vraies minuscules distinctives.
  ⚠️ **Elle n'a pas de majuscules accentuées** (É, È, À, Ç). En français, tout
  `text-transform: uppercase` bascule alors sur une police de secours au milieu
  d'un mot (« ENTRéE », « APRèS »). Contrainte réelle et vérifiée.
- **Les polices du moodboard sont différentes** : rondes, proportionnelles,
  avec de vraies minuscules. Le journal de Fields of Mistria n'utilise pas
  Press Start 2P.

**Candidates libres :**

| Police | Caractère | Où |
|---|---|---|
| **Pixelify Sans** | ronde, chaleureuse, vraies minuscules, variable | Google Fonts |
| **DotGothic16** | héritage bitmap japonais, très « console » | Google Fonts |
| **Silkscreen** | petite, nette, anguleuse | Google Fonts |
| **Jersey 10 / 15 / 20** | famille pixel récente | Google Fonts |
| **Pixel Operator** | très complète (gras, italique, accents) | dafont, gratuite |
| **m5x7 / m6x11** | de Daniel Linssen, omniprésentes dans l'indé | itch.io, gratuites |
| **VT323** | terminal DEC VT320 — lisible en paragraphe | Google Fonts |

**Recommandation : deux polices.** Une pour le chrome (titres, boutons), une
pour le texte long. Un paragraphe entier en police d'arcade est illisible.

Pour les gros titres cernés type « SQUIRRELS » ou « Sweet! » : se simule en CSS
avec `-webkit-text-stroke` + ombres portées empilées.

## 5. Les images du moodboard, décrites

*(Les fichiers ne sont pas joints. Ces descriptions les remplacent.)*

### A. Carte « Too Much Rainbow »
Carte verticale sur fond vert pomme à pois. Bordure noire très épaisse. Fond de
carte crème **avec une texture de toile visible** (trame régulière, comme du
lin). En haut, une illustration pixel dans un cadre noir : arc-en-ciel, nuages
crème, collines vertes et roses. Dessous : `#4125` en petit, puis le titre en
gros caractères pixel cernés. Ligne auteur avec une vignette d'avatar carrée.
Trois lignes de texte de description. Puis **deux encadrés côte à côte** :
chacun un cadre fin, une grande valeur (`0.30 ETH`, `41`) et un libellé gris
en dessous (`Last Bid`, `Favourites`). Enfin un bouton jaune pleine largeur.

> 💡 **Ce qui est retenu : les encadrés de stats du bas**, pas la carte entière.
> Grande valeur + petit libellé gris dessous, dans un cadre fin. C'est le motif
> à reprendre.

### B. Journal de Fields of Mistria
Un **livre ouvert en double page**, vu de face, avec des **ferrures dorées aux
quatre coins** et une reliure centrale. Fond de page crème.
Page de gauche : un bandeau rose « Character Customization », une grille de
petites tuiles d'options (coiffures, couleurs), un sprite de personnage au
centre, puis **une liste de lignes, chacune précédée d'une petite icône
ronde** : `Rosette` / `She/They` / `Summer 10` / `Hydrangea Farms` / `Single`.
Page de droite : un portrait encadré avec un cœur vert en haut à gauche, deux
grilles d'icônes (`Loved Gifts`, `Liked Gifts`), et un bloc `Skills` avec des
paires icône + nombre.
**Sur le bord droit du livre : une colonne d'onglets verticaux**, chacun d'une
couleur pastel différente (rose, bleu, vert, violet) avec une icône.

> 💡 Retenu : les **onglets verticaux colorés**, les **petites icônes à gauche
> de chaque ligne**, le **bord du livre** pour le journal.

### C. Sorcière pastel — les quatre boutons
Format carré, fond jaune beurre. **Barre d'état en haut** dans un cadre en
pointillés : `LV.07 ♥`, une date, une heure, une icône de batterie.
Au centre, une scène en **style point de croix** : une petite sorcière au
chapeau violet et cheveux verts, assise, tenant une rose ; un chat blanc ; une
arche de roses ; une maisonnette verte et rose ; nuages et cœurs roses en
pixels épars.
En dessous, une **boîte de dialogue** à coins adoucis, bordure verte fine,
fond crème, texte violet : *« May your heart be as wild as a rose garden and as
gentle as its petals »*.
Tout en bas : **quatre boutons carrés** côte à côte, chacun une tuile-icône
colorée (portrait, cœur, livre, étoile) avec son libellé dessous :
`CARE` / `PLAY` / `LEARN` / `MAGIC`.

> 💡 **Ces quatre boutons ne sont PAS pour QF** — ils sont pour l'accueil de
> l'application parente, *L'Intérieure*. Dans QF il n'y a que deux destinations
> (accueil, journal). L'image est retenue **pour son esthétique générale.**

### D. Trois cartes de tarot
Trois cartes en éventail, légèrement pivotées, qui se chevauchent. Grosse
bordure crème, contour noir épais et irrégulier (style pixel « sale »). Champ
central violet profond parsemé de petites croix et étoiles jaunes et roses.
La carte du dessus : un **croissant de lune jaune** et des **nuages roses
stylisés** en bas. Celle du dessous : un **soleil rose à rayons**.

### E. Cœurs de PV
Cinq cœurs pixel sur fond blanc, montrant **le remplissage progressif** : vide
(bleu très pâle, contour marine), puis 25 %, 50 %, 75 %, plein (rouge
framboise avec un reflet blanc en haut à gauche). Contour marine foncé, petite
ombre portée.

> 💡 La granularité fractionnée est jolie. **Limite connue : une jauge de PV ne
> descend pas sous zéro**, or le moteur a besoin du négatif (cas « soulagement »).
> Question mise de côté volontairement — voir `fonctionnalités`.

### F. Icônes météo
Dix icônes pixel sur fond rose très pâle : nuage de pluie, orage, soleil,
soleil derrière nuage, vent, nuage seul, croissant de lune étoilé, averse,
arc-en-ciel, flocon. Palette réduite : bleu-gris, orange, jaune, blanc.
Style net, contour sombre, environ 32×32.

> 💡 Exemple du **niveau de complexité** visé pour les icônes des barreaux
> d'échelle.

### G & H. Deux séquences de pièce
Deux sprite sheets horizontales de rotation de pièce, 7 images chacune : de la
tranche (fin rectangle) à la face pleine et retour.
- **Version A** : dorée, ronde, dégradé lisse, reflet diagonal blanc.
- **Version B** : plus anguleuse, facettes marquées, contour marron épais,
  aspect plus « chunky ».

### I. Écran « Sweet! »
Une **fenêtre modale rose** par-dessus un jeu de pâtisserie. Bordure blanche
épaisse, puis rose. Titre `Sweet!` en très gros caractères pixel blancs à
contour épais, débordant hors de la fenêtre par le haut.
Texte centré en capitales violettes : `YOU GOT STUCK / BUT YOU DID GREAT!`
Puis `PASTRIES SERVED:` avec le nombre `6859` dans un encadré sombre.
Un panneau crème avec **quatre icônes de viennoiseries** dans des cases.
`BEST SCORE!` en capitales cernées. Enfin deux boutons : `MENU` (crème) et
`AGAIN` (violet foncé).

> 💡 **La phrase compte plus que le graphisme : « YOU GOT STUCK BUT YOU DID
> GREAT! » récompense d'avoir joué, pas d'avoir gagné.** Voir `fonctionnalités`.

### J. « Soft Reset Activated »
Illustration verticale, palette violet / rose / lavande. Une chambre : une
fille aux cheveux roses dans un pouf, casque sur les oreilles, manette en
main ; guirlande lumineuse ; trois cadres roses au mur ; un vieil ordinateur
rose affichant un cœur ; un gobelet de boba ; des chaussettes montantes.
Un petit écran affiche `> LOGGING OUT OF < BURNOUT…`
En bas, un **bandeau titre violet** : `SOFT RESET ACTIVATED`, puis un pavé
crème : *« Resting isn't quitting—it's recharging your sparkle. Save to enter
Soft Reset Mode. »*

> 💡 Registre de voix : chaud, permissif, qui donne la permission de se reposer.

### K. Inventaire à onglets
Panneau en bois brun. **Onglets horizontaux en haut** avec icône + libellé :
`Items` (actif, plus clair) / `Tools` / `People`.
À gauche, un panneau gris séparé : nom `Sunflower`, `1:3` dans une pastille
rose, `Stages`, trois vignettes d'étapes de croissance, puis ✔ et ✘.
Au centre, une grille d'objets, chacun avec une **pastille de quantité** en
haut à droite.
À droite, une **infobulle** flottante : nom, nom latin en gris, un badge jaune
`L2 CROP`, un `?` rouge.
En bas à gauche : `BUY`, un sélecteur de quantité avec flèches haut/bas, et un
bouton prix `200 ¢` en jaune.

### L. Fiches « Sobreviventes »
**La meilleure correspondance pour les cartes d'option.** Fond parchemin,
onglets en haut (`JOIAS` / `RECURSOS` / `SOBREVIVENTES`), croix rouge de
fermeture.
Chaque fiche, dans un cadre à **coins ornementés** :
- en haut à gauche, un **badge cœur rouge avec un nombre** (`60`, `150`)
- un **sprite dans un cadre en losange** sur fond quadrillé pâle
- à droite, le **nom en rouge** et un **sous-titre en brun** (`ALFRED /
  MACACO`)
- dessous, **quatre lignes de stats**, chacune : une petite icône, une **barre
  horizontale colorée** (bleu, vert, orange, violet) sur fond sombre, et le
  **nombre aligné à droite dans la barre**
- un bouton vert de prix avec une icône (`250 🍖`, `400 💎`)

Tout en bas de l'écran, une **barre de ressources** : viande 60, bois 20,
métal 0, gemmes 37.

> 💡 **Structure transposable presque à l'identique** : badge de score = total,
> médaillon = identité de l'option, 3 lignes de stats = ventre / gain / regret.
> **Et le médaillon peut être typographique (une lettre A / B / C dans une
> pastille) — donc réalisable sans aucune illustration.**

### M. Menu pause violet
Le seul exemple sombre du moodboard. Fond noir, décor pixel violet et rose
(lune, arbres en fleurs, étoiles). Boutons semi-transparents violets à bordure
claire, disposés en **deux colonnes**, avec `Back to Game` pleine largeur en
haut et `Disconnect` pleine largeur en bas. Une option grisée (`Open to LAN`).
Signature `ARCANE PIGEON` en bas.

### N. Carnet à spirale « Squirrel Info »
Fond orange à losanges. Un **carnet à reliure spirale** : anneaux gris sur le
bord gauche, pages vertes, un **marque-page dépassant en haut à gauche**.
Bandeau titre `SQUIRREL INFO` en capitales cernées, avec de petites attaches.
Un sous-titre encadré `NUTLOVERS OMNIBUS` avec des flèches de navigation
gauche/droite de part et d'autre.
Puis **quatre gros boutons empilés**, chacun : une tuile-icône jaune à gauche
(écureuil, cerveau, planète, personne) collée à une **plaque brune** portant le
libellé en capitales crème.
En haut à droite, un HUD : argent, ressource, et une horloge `TIME 12:00`.

> 💡 Très bon modèle de **menu principal sur téléphone** : grandes cibles
> tactiles, icône + libellé, lisible d'un coup d'œil.

### O. Création de personnage *(la blague)*
Écran vertical. En haut, une forêt pixel et un sprite de personnage par défaut,
pâle et non configuré. Un champ `Your Name` dans un cadre turquoise à bordure
saumon. Deux boutons de genre (♀ actif en saumon, ♂ inactif). Quatre lignes de
réglage avec des **flèches triangulaires saumon** de part et d'autre :
`HAIR STYLE`, `HAIR COLOR`, `SKIN COLOR`, `EYE COLOR`. Une case à cocher
`DO TUTORIAL`. Un gros bouton jaune `START`.

## 6. Références de jeux à citer

Pour chercher d'autres visuels ou briefer quelqu'un :

- **Fields of Mistria** — la référence n°1 citée. Journal, onglets, portraits
- **Stardew Valley** — l'ancêtre du genre, inventaires et menus
- **Moonstone Island** — *le plus proche de la direction visée* : cozy pixel +
  **cartes** + créatures. À regarder en priorité
- **Animal Crossing** — UI diégétique, douceur
- **Potion Permit**, **Sun Haven**, **Littlewood**, **Cozy Grove** — même famille
- **Loop Hero**, **Inscryption** — pour la mécanique de cartes (mais sombres)

## 7. Ressources d'assets

| Ressource | Licence | Pour quoi |
|---|---|---|
| **game-icons.net** | CC-BY | ~4000 icônes SVG d'inspiration RPG. Idéal pour les icônes des barreaux d'échelle |
| **kenney.nl** | CC0 (sans attribution) | gros packs d'UI, boutons, icônes |
| **lospec.com** | — | palettes pixel art, et des tutoriels de dithering |
| **itch.io** (asset packs) | variable | cadres, cartes, décors. Vérifier la licence commerciale |

## 8. Frontière technique : ce qui demande des assets

| ✅ Réalisable en CSS/SVG, sans image | ❌ Demande une image fournie |
|---|---|
| palette, inversion crème/contour | illustrations de scène (sorcière, chat, maison) |
| panneaux cernés, ombres portées | portraits de personnages |
| cadres à coins pixel | faces de tarot illustrées (soleil à visage) |
| onglets verticaux et horizontaux | texture point de croix convaincante |
| cartes d'option avec stats | cadres ornementés très détaillés |
| écran de quête complète | |
| éventail de cartes + retournement | |
| cœurs fractionnés | |
| animations en `steps()` depuis un sprite sheet | |
| dos de carte **géométrique** (étoiles, croissant, points) | |

---
---

# → flow

## Structure actuelle du parcours

Le prototype codé pendant la session suit cet ordre :

1. **Accueil** — titre, `Nouveau dilemme`, `Journal`, plus un rappel des
   dilemmes sans retour d'expérience
2. **Le seuil** — Q0, posée une seule fois
3. **Les chemins** — nommer les options (2 minimum, 4 maximum), avec une case
   à cocher « Quelqu'un compte dessus » par option
4. **Le ventre** — Q1 pour toutes les options, affichées côte à côte
5. **La lumière** — Q2, idem
6. **L'ombre** — Q3, idem
7. **Le verdict** — l'oracle parle, puis le détail du calcul est consultable
8. **Et après ?** — choix final réellement fait, satisfaction, commentaire
9. **Journal** — historique, export/import

**Principe de la présentation par question :** une question à l'écran, toutes
les options en vis-à-vis. C'est la transposition directe de la structure du
tableau d'origine (colonnes groupées par option), et ça permet de comparer.

## Décisions prises sur la navigation

- **Pas de barre de quatre boutons dans QF.** On est soit sur l'accueil (avec
  une icône journal quelque part), soit dans le journal ouvert. La barre à
  quatre boutons appartient à l'accueil de **L'Intérieure**, l'application
  parente.
- **Les onglets remplacent l'indicateur d'avancée.** Avantage fonctionnel, pas
  seulement esthétique : un onglet est cliquable, donc revenir corriger une
  réponse devient gratuit. L'historique montre que c'est un besoin réel.

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
