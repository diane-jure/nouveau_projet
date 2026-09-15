> 👩‍💻Affichage et comportement de l'app

Révélation progressive des items
q1 nécéssaire pour révéler q2 (blurred et inactif)
Encadrés apparaissent après la validation des BOUTONS précédents
Bouton ← revenir visible uniquement sur le dernier encadré actif

# Encadré entête
Quest Finder (numéro de version)
Trouve ta voie !
Icône journal à droite (en surbrillance si aventures en cours dans supabase)

# Div flow (largeur max 600px)

## Encadré dilemme
`quest:state1`
PV: 5 coeurs en pixel - 3 par défaut

### Carte voie
- Icône / Placeholder 'Première voie'
- q1 Première sensation ?
- Placeholder 'ton instinct...'
- Coût - 0 par défaut
- q2 Si ça se passe bien ?
- Placeholder 'ça t'apporte...'
- Gain - 0 par défaut
- q3 Si tu l'as pas fait ?
- Placeholder 'tu ressens...'

### Carte autre voie
### + Prendre une autre voie

### q0 Dans dix jours, ça compte ?
Oui / Peut-être / Maybe / Je sais pas / Non
(case libre mais autofill)

### BOUTON Consulter l'Oracle `sauvegarder`*

### Encadré 'L'Oracle a parlé'
`recommandation-viewer`
← revenir (petit en haut à gauche)
====Recommandation de l'Oracle

> Si pile ou face:
> - bouton en forme de pièce
> - clic pour tirer au sort (facultatif)
> - ====nom de la voie apparaît

Phrase de motivation de l'Oracle


### BOUTON Merci Oracle ! 
```sauvegarder```

### Encadré 'A toi de jouer'
`recommendation-state`
`quest:state2`
← revenir (petit en haut à gauche)
====Choix de l'Oracle - ou du pile ou face

Phrase de motivation de l'oracle

### BOUTON J'ai décidé !

### Encadré ' J'ai décidé !'
`decision-fill`
← revenir (petit en haut à gauche)
====Et alors, t'as fait quoi ?

Sélection voie ou 'autre/rien' 


### BOUTON Bravo d'avoir décidé !  
```sauvegarder```

### Encadré  'Bravo d'avoir décidé !'
`decision-state`
`quest:state3`
← revenir (petit en haut à gauche)
====Titre décision

Commentaire de l'Oracle

### BOUTON Je l'ai fait !

### Encadré  'Je l'ai fait !'
`feedback-fill`
← revenir (petit en haut à gauche)
====Et c'était comment ?

Feedback libre %%Placeholder ???%%
====C'était le bon choix ?

Sélection satisfaction Oui Bof Non (1/2/3)

### BOUTON Quête accomplie ! 
```sauvegarder```

### Encadré 'Quête accomplie !'
`feedback-state`
`quest:state4`
← revenir (petit en haut à gauche)
Titre Dilemme
====Voie décidée

Citation feedback de l'user
Phrase finale de l'Oracle qui inclut:
- Arguments de l'oracle (si applicable) 
- Congruence avec choix Oracle followedOracle


### BOUTON Quitter l'aventure 
```sauvegarder```

# Journal d'aventures
- grise le flow en fond
En haut à gauche croix de fermeture
## Onglet en cours (state 1&2)
## Onglet accomplies (state 3&4)
### Carte de dilemmes
Voie vs voie vs voie
Pour en préparation, afficher le choix de l'Oracle
Pour accomplies, afficher la décision de l'user.
Si state 4:
- décision de la couleur de la satisfaction
- feedback entre guillemets

# Encadré save Quand enregistré sur supabase
 - miniature, en bas à droite
icone disquette, "Sauvegardé !"

# Bandeau (si dilemme state dans Local Storage)
- grise le flow en fond
icone, Une aventure en préparation !

------
L'intérieure.
Illustration centrale
En haut, barre d'état
En bas, barre de navigation (grosses icones)