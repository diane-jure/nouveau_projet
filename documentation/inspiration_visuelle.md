> 🌈

## 0. Moodboard
![[witch.jpg]]
![[bars.jpg]]
![[best_score.jpg]]
![[card.jpg]]
![[cards.jpg]]

![[cthulu.jpg]]
![[farm_menu.jpg]]
![[hearts.jpg]]
![[L_sobreviventes.jpg]]
![[meteo.jpg]]
![[mistria.jpg]]
![[piece_hires.jpg]]
![[piece_lofi.jpg]]

![[soft_reset.jpg]]
![[squirrel_menu.jpg]]
## 1. Le vocabulaire du style

Les termes qui qualifient l'esthétique recherchée. Utiles pour chercher des
références, des assets, ou briefer quelqu'un.

### Familles esthétiques

| Terme | Ce que ça désigne |
|---|---|
| **Cozy pixel art** | le genre dominant du moodboard : pixel art chaleureux, non violent, palettes douces. Lignée Stardew Valley |
| **Cottagecore pixel** | variante rurale/végétale du précédent (fleurs, fermes, maisons) |
| **Kawaii pastel** | rondeurs, grands yeux, roses et lavandes, chibi |
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


## 2. Palettes:

**Direction : beige rosé / crème, façon menus JRPG 16-32 bits.** Référence
explicite énoncée : *« les trucs qui me rendent nostalgique de ma Game Boy
Advance »*.

Familles de couleurs observées dans le moodboard :

- **Fonds** : crème, beurre pâle, beige rosé, parchemin
- **Accents** : rose bonbon, rose poudré, lavande, violet moyen, menthe, vert d'eau, or/jaune doux
- **Contours** : prune très foncé, marine très foncé — **jamais de noir pur**
- **Alertes / valeurs** : rouge framboise (PV), vert pomme (positif), or (score)
- 
Une palette entre 16 et 32 couleurs, ex:
https://lospec.com/palette-list/dynamite (ma pref)
![[Screenshot 2026-09-15 at 16-08-44 Dynamite Palette.png]]
https://lospec.com/palette-list/sheltzy32
![[Screenshot 2026-09-15 at 14-04-28 Sheltzy32 Palette.png]]
https://lospec.com/palette-list/chasm
![[Screenshot 2026-09-15 at 14-06-05 chasm Palette.png]]
https://lospec.com/palette-list/island-joy-16
![[Screenshot 2026-09-15 at 14-07-12 Island Joy 16 Palette.png]]
https://lospec.com/palette-list/toybox32
![[Screenshot 2026-09-15 at 14-16-20 ToyBox32 Palette.png]]

OU

une série de palettes très restreinte, soit pour les états d'avancement des states, soit pour les différents écran de l'intérieur, soit pour chaque illustration de carte (ma préférence)

![[Screenshot 2026-09-15 at 14-21-23 Cloudfrenzy Palette.png|250]]![[Screenshot 2026-09-15 at 14-19-51 SLSO8 Palette.png|250]]![[Screenshot 2026-09-15 at 14-20-07 Oil 6 Palette.png|250]]![[Screenshot 2026-09-15 at 14-20-24 Twilight 5 Palette.png|250]]![[Screenshot 2026-09-15 at 14-20-33 Eulbink Palette.png|250]]![[Screenshot 2026-09-15 at 14-20-56 Berry Nebula Palette.png|250]]![[Screenshot 2026-09-15 at 14-21-06 late night bath Palette.png|250]]![[Screenshot 2026-09-15 at 14-21-14 Calm Sunset Palette.png|250]]![[Screenshot 2026-09-15 at 14-26-43 Oil 6 Palette.png|250]]![[Screenshot 2026-09-15 at 14-21-23 Cloudfrenzy Palette.png|250]]![[Screenshot 2026-09-15 at 14-24-31 Cryptic Ocean Palette.png|250]]![[Screenshot 2026-09-15 at 14-24-59 pastel qt Palette.png|250]]![[Screenshot 2026-09-15 at 14-25-14 SLSO8 Palette.png|250]]![[Screenshot 2026-09-15 at 14-24-48 Dream Haze 8 Palette.png|250]]

## Fonts

Retrouver celles utilisées dans QF et QFCM
**Press Start 2P** Pas de minuscules ni d'accents

| Police | Caractère | Où |
|---|---|---|
| **Pixelify Sans** | ronde, chaleureuse, vraies minuscules, variable | Google Fonts |
| **DotGothic16** | héritage bitmap japonais, très « console » | Google Fonts |
| **Silkscreen** | petite, nette, anguleuse | Google Fonts |
| **Jersey 10 / 15 / 20** | famille pixel récente | Google Fonts |
| **Pixel Operator** | très complète (gras, italique, accents) | dafont, gratuite |
| **m5x7 / m6x11** | de Daniel Linssen, omniprésentes dans l'indé | itch.io, gratuites |
| **VT323** | terminal DEC VT320 — lisible en paragraphe | Google Fonts |

## Animations
Boutons dynamiques
Coeurs
Récompense
Pile ou face
Tirage de cartes

## Redesign

Pour l'instant on va pas mettre de titre pcq ça me gonfle je sais pas comment faire: en fait aucun jeu n'a son titre visible comme ça

On a le header qui contient
5 coeurs (2,5 remplis de base) et à droite l'icone journal

les cartes suivent exactement la structure de sobrevivventes:
![[L_sobreviventes.jpg]]
Une illustration dans un carré à 45° sur un autre carré.
Sont superposés: en haut à gauche un siymbole coeur avec un le chiffre 0 (cout)
en bas au centre un bouton vert avec une gemme et le chiffre 0 (recompense)
les deux chiffres ont des petites flèches juste au dessus et juste en dessous pour changer la valeur
A droite de l'illustration sur desktop (en dessous sur mobile): un rectangle qui permet de noter le nom de la voie

Dessous, quatre barres de couleurs différentes chacune précédée d'une petite icone. la question apparait en hover sur ces icones, mais les placeholder sont déjà en place.

En dessous, un rectangle de la largeur d'une carte pour '+ prendre une autre voie'
Une fois minimum 2 voies complétées apparait 'ask oracle' un bon gros bouton brillant

![[best_score.jpg]]

Réfléchir si ça peut faire avancer des onglets colorés à droite ? 
![[mistria.jpg]]



Pour le journal:
