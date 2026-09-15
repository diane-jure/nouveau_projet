# 1 Correctifs Oracle V2.5
## Réactiver les catégories innaccessibles

💥 Le bug : il manque une virgule
Lignes 505-508, entre les deux gabarits :
```
if (hasGreenSignal) {
  return [`Ton instinct est clair — ...Fais-toi confiance.`     // ← PAS DE VIRGULE `Là où il y a de la vie, suis la vie...`
  ][Math.floor(Math.random() * 2)];}
```
👉 Le correctif est une virgule.
**Virgule manquante** → template tagué → `TypeError`, la branche plante|l. 505-508|



## Arrêter le RE-calcul des phrases de l'Oracle

### Une fois l'aventure sauvegardée, fixer les valeurs.

`explication` est une simple chaîne de caractères, stockée telle quelle dans la colonne `data` (jsonb) de la table `saves`. Ça ressort littéralement :

```
"oracleResponse": {  "recommandation": {    "choix": "Jouer du synthé",    "explication": "Ton corps a dit non avant même que tu finisses de poser la question.\nJouer du synthé te laisse respirer — l'autre te comprime.",    "tags": ["alerte_corporelle", "flemme_neutre"]  },  "isOffline": true}
```

Les `\n` sont de vrais retours à la ligne encodés, rien de plus.

### 🔴 Q0 n'est jamais lue par l'oracle

**Q0 n'arrive jamais au moteur** — 3ᵉ argument omis aux 3 appels. Toutes les branches Q0 sont mortes|l. 1492, 1731, 1762|
`q0Importance === 'low'` est **du code mort** après le retour anticipé|l. 443|
Mais **les trois appels du fichier ne passent que deux arguments** (lignes 1492, 1731, 1762). Donc `q0Response` vaut toujours `''`. Et le moteur ne lit pas non plus `opt.q0`.

**Tu tapes « Dans 10 jours ? », c'est affiché, c'est sauvegardé — et l'oracle ne le voit jamais.**

Tout ce qui en dépend est mort :

| branche                  | perdu                                      |
| ------------------------ | ------------------------------------------ |
| verrou `q0_notImportant` | le pile ou face automatique ne part jamais |
| `valeur_q0`              | +2 jamais accordé                          |
| `relativisation`         | ÷2 jamais appliquée                        |
| `procrastination`        | étiquette jamais posée                     |
| `q0Importance`           | vaut toujours `medium`                     |


## Calcul Gain

`rawGain` n'existe pas → `bestGain` = toujours la dernière voie, `gainDiff` = `NaN`. **Régression : la V2 lisait `option.energyGain` correctement**|l. ~430|

cout: coutNet` écrase le coût brut → « te coûte moins » désigne la mauvaise voie|l. 138|


## le bug des doublons  dans le journal
— `onSubmit` ajoute à `completed` et ne filtre que `pending`

# 2 Extraire des fichier avec les résultats détaillés
Refaire tourner tous les scénarios pour en extraire les arguments employés par l’oracle (possible de le faire aussi avec V2)
Un tableau csv lisible pour nous
Un format JSON qui peut être ouvert dans l'app

# 3 Utiliser les résultats de V2.5/V2/V3a pour en déduire les catégories / codes

`_getClearPhrase` (lignes 470-513) est **exactement** ton système de catégories, déjà là sous forme de cascade :

, pas les phrases : les tags sont la clé d'entrée du dictionnaire.

# 4 Faire la même chose en déterminant la logique qu’on a commencée hier

# 5 Ajouter et soustraire mes propres idées de valeurs/hameçons

# 6 Inclure le feedback dans oracle_brain

# 7 Construire la version 4 de l’Oracle

1. Créer la liste des codes (ex: Pa03, Pe07, X01, Y04 ainsi que pour les dénouements: GT01 M03 BF01 BT02)
2. Déterminer la logique exacte et le nom des variables
3. Associer les mots du lexiques aux différentes variables de l'Oracle
4. Associer les résultats aux différents codes
5. Créer le nouveau template de saves
6. Faire le test en labo de la V4

# 8 Test avec l'UI 4.6
Dans un premier temps, on peut le tester en reprenant l’UI actuelle (quelques erreurs d’affichage, j’imagine qu’on n’est pas obligés d’y toucher immédiatement- maybe chanter la couleur de fond pour notifier que c’est l’oracle 4 qui tourne): ça nous fait la version 4.7.  

# 9 Refaire le squelette de L’UI sans aucun style, basé sur le code actuel (que je comprends) mais remanié  

# 10 Je prends des décisions sur l’esthétique  

# 11 Tu codes le theme.jsx
