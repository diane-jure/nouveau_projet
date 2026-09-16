> 📎 Brouillon de travail (pas un livrable final) — rapport de l'agent chargé de
> l'objectif 3 du chantier de fusion du corpus Oracle (déduire des sous-types de
> recommandation pour chacun des 5 verdicts). À lire, pas à prendre pour argent
> comptant : 10 points d'ambiguïté sont signalés en fin de rapport, non tranchés.

J'ai lu intégralement, dans l'ordre demandé : `oracle_cerveau.md`, `oracle_parle.md`, le rapport d'exploration (sections 3, 4, 6 en particulier), `sauvegardes.csv` (25 lignes) et `labo/README.md`. Voici la typologie de sous-types déduite pour les 5 verdicts + le bloc dénouement, avec déclencheurs basés sur les flags réels d'`oracle_cerveau.md` et les sources CAS/versions correspondantes.

Note de méthode : la colonne "Verdict Oracle" du CSV encode en réalité l'ancien schéma P (lettre de voie) / Y (random) / X (aucun) d'`oracle_parle.md`, pas le vocabulaire à 5 verdicts. Les illustrations ci-dessous sont donc des inférences à partir du texte Q1-Q3 des lignes, pas des lectures certaines du champ verdict — je le signale aussi dans les ambiguïtés finales.

---

## 1. pickGreat (une voie great bat le reste, gagnant net, pas d'égalité)

| Sous-type | Déclencheur (flags réels) | Source / CAS |
|---|---|---|
| **Clarté nette** (défaut) | greatPath net, aucun flag fort actif | CAS1 générique. Cas réel : ligne "Rester à l'apéro" (09/03) — regret fort + scope oui, victoire nette, satisfaction good. |
| **Peur qui compte (enjeu)** | `avoidanceFear` sur la voie gagnante (fear.isHigh && regret.isHigh) | CAS11 "Peur de la bonne décision" + la phrase-même du corpus ("la peur devant, le regret derrière : pas un refus, un enjeu") + `peurQuiCompte` (QCM). Cas réels : "Rester à l'intérieur/manif" (voie B), "Envoyer le mail" (voie A), "Annuler l'Inde" (x2). |
| **Corps vs cœur (heartOverBody)** | `bodyFeelsBad` + (Q1 desire.isHigh ou regret.isHigh ou irreversible) sur la voie gagnante | CAS2 ("Corps fatigué ne veut pas dire cœur absent") — filé sous P dans oracle_parle mais correspond structurellement à `heartOverBody`. Pas d'exemple CSV net trouvé — repose sur la règle de calcul + le texte de CAS2. |
| **Soulagement comme signal inversé** | relief/soulagement détecté sur la voie **perdante** (renforce le choix de la gagnante) | CAS6. Cas réel : "Envoyer le mail" — voie B ("libéré") perdante confirme A gagnante. |
| **Regret massif comme signal** | `allRegret` fort (regret strong) sur la voie gagnante, indépendamment de la peur | CAS7, quasi verbatim. Cas réel exact : "Rester au lit / Aller au lac" — voie B "honteuse dégoûtée fâchée contre moi" + loot 7, verdict B, décision B, commentaire quasi identique à CAS7 ("dans 10 jours j'aurai pas oublié"). |
| **Hameçon démasqué sur la voie perdante** | `injonction`/`culpabilité` sur la voie **perdante** | CAS5 réappliqué à la voie qui perd. Cas réel : "Rester à l'intérieur" (culpabilité, perd face à la manif) — la suite (satisfaction bad) valide que nommer le hameçon aurait aidé. |
| **Décision importante (grandeDecision)** | irreversible + intensité forte (Q1 peur + Q3 regret hauts simultanément), même si une voie est great | CAS8 + `grandeDecision` (QCM). Cas réel explicite : "Annuler l'Inde" — la commentatrice demande littéralement que l'oracle "nomme plus explicitement le dilemme" malgré son conseil. |

⚠️ **CAS9 ("l'option raisonnable qui écrase")** — je l'ai classé sous pickFair (§2.2) et non ici, car dans `oracle_cerveau.md` l'injonction est un hook qui *réduit* le score : une voie dominée par l'obligation ne devrait normalement pas devenir greatPath. Voir ambiguïté #5.

---

## 2. pickFair (une fairPath bat une poorPath, pas de greatPath en lice)

| Sous-type | Déclencheur | Source / CAS |
|---|---|---|
| **Fair par défaut / choix mesuré** | pas de flag fort | Ton neutre, écho atténué de CAS1. |
| **Option raisonnable qui écrase** | la fairPath gagnante porte `injonction`, la/les poorPath perdantes portent du désir/regret mais sont tirées vers le bas (drain>HP, culpabilité, trivial) | CAS9 verbatim ("Ce choix te résigne. Ce n'est pas la même chose que choisir."). |
| **Hameçon sur la voie gagnante elle-même** | `injonction`/`culpabilité` **sur la fairPath qui gagne** — l'oracle doit nommer la dette même en la recommandant | CAS5 réappliqué au gagnant. Cas réel : "Aller au rendez-vous conseillère" — voie A gagnante porte "un peu coupable d'avoir posé un lapin" ; commentaire de l'autrice conteste le verdict, ce qui pointe plutôt vers le sous-type suivant. |
| **Engagement (parole donnée)** | flag `engagement` (drive strong) actif sur une voie — un rendez-vous, une promesse | **Absent des CAS 1-11** (vrai trou dans oracle_parle.md) mais nommé explicitement dans `oracle_cerveau.md` (drives) et dans QCM ("une parole donnée ne se met pas dans la balance des envies"). Cas réel canonique : même ligne "rendez-vous conseillère" — le commentaire de l'autrice dit littéralement "bien sûr qu'il faut honorer un rdv même si on n'a pas envie", ce qui est *exactement* la logique `engagement` non capturée par le verdict affiché. |
| **Pile ou face doux (coût vs gain équilibrés, marge étroite)** | deux fairPath proches, mais pas assez à égalité pour déclencher shuffleCoin/Cards | CAS3 ("Les deux chemins se valent. [chosenPath] te coûte moins.") — reclassé ici (voir ambiguïté #3), pas dans shuffleCoin. |
| **Décision importante en mode fair** | `grandeDecision` mais aucune voie n'atteint great | CAS8 réappliqué. |
| **Peur qui protège, faiblement** | `protectiveFear` présent mais pas assez fort pour faire chuter en poorPath | Inspiré de `peurQuiProtege` (QCM) + ton prudent de CAS2, pas de CAS dédié. |

---

## 3. shuffleCards (égalité entre voies great/fair, scope = OUI)

Correspond à RANDOM(Y) **CAS2 "tirage de cartes"** — actuellement un titre vide dans `oracle_parle.md` (aucune phrase écrite). Sous-types proposés :

| Sous-type | Déclencheur | Source |
|---|---|---|
| **Cartes entre plusieurs greatPath** | égalité de score entre ≥2 greatPath, scope=oui | RANDOM CAS2 (à écrire) + note du doc "la phrase de tirage peut souligner les qualités des différentes voies". |
| **Cartes entre plusieurs fairPath (scope=oui)** | égalité entre fairPath, scope=oui | idem, ton moins "les deux sont géniales", plus "les deux comptent". |
| **Cartes avec hameçons partagés** | toutes les voies à égalité portent `injonction`/`culpabilité` | Combinaison inférée de CAS5 + RANDOM CAS2, non documentée ailleurs. |

⚠️ Aucun exemple net dans les 25 dilemmes du CSV (les lignes Q0=oui les plus proches — "Répondre à Charlotte", "Appeler Asturias Yoga" — sont des brouillons sans verdict/issue enregistrés). Trou de données à signaler.

---

## 4. shuffleCoin (égalité scope NON/indéterminé, OU toutes fairPath, OU toutes trivial)

Correspond à RANDOM(Y) **CAS1 "pile ou face"** (également vide dans oracle_parle.md).

| Sous-type | Déclencheur | Source |
|---|---|---|
| **Pile ou face neutre (peu importe)** | scope=non/maybe ET toutes les voies `trivial` | Règle explicite `scope=no && ALL(trivial) → shuffleCoin`. Écho CAS3 ("le vrai risque, c'est l'acharnement à vouloir que ce soit parfait"). Cas réels : "Alice ça glisse" et "concert/dame damier" (Q0=non, options serrées). |
| **Pile ou face malgré tout fair** | toutes les voies = fairPath (pas forcément trivial) | Règle `si all=fairPath → shuffleCoin`. Ton moins désinvolte que le précédent. |
| **Pile ou face entre greatPath, scope=non** | ≥2 greatPath à égalité mais scope=non | Règle `pickGreat & plusieurs great & scope=NO → shuffleCoin`. Ton rassurant ("tu ne peux pas perdre"), pas de CAS dédié. |
| **Pile ou face avec hameçon commun** | toutes les voies à égalité portent le même hook (flemme, culpabilité légère…) | Inspiré du sous-cas V2.5.1 `_getDilemmaPhrase` "flemme des deux côtés mais décision compte" (écrit à l'origine pour un autre cas, transposé ici). Cas réel : "vidéos youtube / BD Tour du monde" (flemme + culpabilité légère des deux côtés, Q0 ambigu "maybe deg"). |

---

## 5. pickNone (toutes les voies poorPath)

Rapproché de l'ancien "AUCUN (X)" et du sous-arbre `_getNonePhrase` de V2.5.1 (flemme / obligation-pression-culpabilité / générique), ainsi que du flag `aucuneNAppelle` (QCM).

| Sous-type | Déclencheur | Source |
|---|---|---|
| **Aucune n'appelle (générique)** | pas de flag fort, scores simplement négatifs partout | CAS4 verbatim. Cas réel plausible : "Continuer QF / ranger chambre". |
| **Épuisement généralisé (drain > HP partout)** | règle ressource `drain > HP` déclenchée sur toutes les voies, indépendamment du désir | Règle explicite d'`oracle_cerveau.md`, **absente de tout CAS écrit** — vrai trou. Cas réel quasi parfait : "Aller au Molo / Aller au bar" — Energie=1, coûts 2 et 3 — commentaire : "deux options qui coûtent plus que l'énergie disponible". |
| **Hameçons partout** | `injonction`/`culpabilité`/pression sociale sur toutes les voies, aucune n'est du désir pur | CAS5 généralisé + sous-branche obligation/pression_sociale/culpabilite de V2.5.1. Cas réel possible mais incertain : "Rester à l'intérieur / manif" si les deux finissent poorPath (dépend du calcul exact — non tranché). |
| **Presque-envie non reconnue (à nuancer)** | `aucuneNAppelle` vrai structurellement, mais un signal faible existe (apprentissage, peur d'inaction) que le score actuel n'élève pas assez | Directement réclamé par le commentaire de l'autrice sur "vidéos youtube / BD" : *"je dirais pas qu'aucune option m'appelle vraiment (...) peut-être nommer ma peur d'être inactive."* C'est la pièce de feedback la plus explicite du corpus pour ce sous-type. |
| **Peur qui protège sur toutes les voies** | `protectiveFear` actif sur chaque voie | `peurQuiProtege` (QCM, "la peur dit vraiment non — cas du week-end à Lyon") généralisé. Cas candidat imparfait : "BZ / rester maison Lola" (soulagement+stress mêlés des deux côtés). |
| **Flemme partagée, ce n'est pas un refus** | `flemme_inertie` (faible) partout plutôt que vraie résistance | Distinction V2.5.1 `flemme_inertie` vs `flemme_resistance` — ton plus permissif ("le repos est peut-être la vraie 3e voie") vs ton plus ferme si résistance vraie. |

---

## 6. Dénouement post-décision (Gy/Gn/My/Mn/By/Bn) — la version actuelle NE suffit PAS

Deux problèmes concrets trouvés :

1. **My et Mn sont actuellement du texte identique** (3 phrases copiées-collées, lignes 184-194 d'`oracle_parle.md`), alors que Gy/Gn et By/Bn sont bien différenciés. Proposition : différencier My ("bof mais tu as suivi l'oracle — donnée sur le calibrage, pas sur toi") de Mn ("bof mais tu as suivi ta propre voie — donnée sur toi").
2. **Le cas shuffle n'a pas de case dans la matrice** : `oracle_cerveau.md` dit `followedOracle = null pour shuffle`, mais Gy/Gn/My/Mn/By/Bn suppose un booléen. Après un tirage, aucune des 6 phrases actuelles ne s'applique proprement. Proposition (non tranchée) : ajouter une paire dédiée "issue de tirage" (bonne/mauvaise) au ton différent ("le tirage a juste marqué un instant, pas une vérité — le résultat ne valide ni n'invalide l'égalité").
3. **grandeDecision devrait se prolonger dans le dénouement** : si le dilemme initial portait ce flag, Bn/By devraient pouvoir le rappeler ("le poids était réel, l'issue ne l'efface pas") — absent actuellement.

Sinon, structurellement, Gy/Gn/By/Bn suffisent — le problème est seulement de contenu/couverture, pas de structure.

---

## Points ambigus / contradictoires non tranchés

1. Le champ CSV "Verdict Oracle" (Y/B/X/C/A) encode le schéma P/Y/X d'oracle_parle.md, pas les 5 verdicts — mes illustrations par ligne sont des inférences de contenu, pas des lectures certaines.
2. CAS4 ("Ni l'un ni l'autre") est rangé sous "UNE VOIE (P)" dans oracle_parle.md, ce qui est incohérent avec son propre contenu. Je l'ai réparti entre shuffleCoin (cas "toutes fair") et pickNone (cas "toutes poor") selon le score — la source ne permet pas de trancher laquelle l'autrice visait.
3. CAS3 ("pile ou face / coût vs gain") — je l'ai classé en pickFair (métaphore de coin, pas le vrai mécanisme random), pas en shuffleCoin réel. C'est mon interprétation ; il est possible que l'autrice ait voulu que CAS3 alimente directement RANDOM/CAS1.
4. RANDOM(Y) CAS1 et CAS2 n'ont aucune phrase écrite dans oracle_parle.md — tous les sous-types proposés en §3 et §4 sont construits par déduction depuis les règles de calcul + les versions antérieures, pas depuis du texte déjà validé par l'autrice.
5. CAS9 ("l'option raisonnable qui écrase") — placé en pickFair (§2.2) plutôt que pickGreat, parce que l'injonction est un hook négatif dans le calcul actuel ; mais rien n'exclut formellement que l'autrice l'ait pensé pour une greatPath (loot/benefits élevés malgré l'injonction).
6. Interaction dénouement × shuffle : `followedOracle=null` pour shuffle n'a pas de case dans Gy/Gn/My/Mn/By/Bn — proposé en §6 mais non décidé.
7. Interaction dénouement × pickNone : la règle écrite dit `followedOracle=true si decisionOther quand recommandation=pickNone`, mais les lignes CSV où la décision finale est "autre" (ex. "chercher job mi-temps/continuer repos", "vidéos youtube/BD", "Molo/bar") affichent toutes "A suivi l'oracle = non" — contredit la règle écrite. Bug d'implémentation, habitude de saisie, ou règle à réviser : non tranché.
8. Codes BORDEL.md (`Pa03`, `Pe07`, `X01`, `Y04`, `GT01`, `M03`, `BF01`, `BT02`, `o18a`) restent non décodés. Seule piste prudente (déjà suggérée dans le rapport d'exploration) : `Pa`/`Pe` pourraient être des préfixes liés à P (une voie)/sous-lettres a/e, et X/Y échoient clairement à AUCUN/RANDOM — mais rien ne confirme si ce schéma de codes est censé coexister avec, ou être remplacé par, le vocabulaire pickGreat/pickFair/shuffleCards/shuffleCoin/pickNone. Je n'ai pas utilisé ces codes pour nommer mes sous-types afin de ne pas trancher à leur place.
9. L'axe `dominante` (sensation/gain/regret) de QCM est une dimension de sous-typage orthogonale que je n'ai que partiellement absorbée dans les noms ci-dessus (ex. "regret massif" ~ dominante=regret) plutôt que traitée comme un tag croisé indépendant à part entière — choix de conception encore ouvert.
10. Le flag `engagement` n'a d'exemple CSV net que sous pickFair (rendez-vous conseillère) ; aucun dilemme du corpus ne montre clairement engagement + greatPath simultanés, donc je ne sais pas si ce sous-type devrait aussi exister sous pickGreat.

Fichiers lus en entier : `/home/user/nouveau_projet/QF_documentation/oracle_cerveau.md`, `/home/user/nouveau_projet/QF_documentation/oracle_parle.md`, `/tmp/claude-0/-home-user-nouveau-projet/b59d5f60-6620-5608-b927-1eb01eafcc6d/scratchpad/rapport_exploration_versions.md`, `/home/user/nouveau_projet/labo/saves/sauvegardes.csv`, `/home/user/nouveau_projet/labo/README.md`.
