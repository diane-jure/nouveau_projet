# Oracle V4 — co-occurrences des facteurs de heartOverBody / bodyWisdom

Pour chaque voie, l'état des 4 facteurs impliqués dans les deux règles :
`damage`, `isHigh(Q1)`, `isHigh(q3Regret) ou isHigh(q3Relief)`, `irreversible ou reversible`.

Trié par nombre de facteurs actifs simultanément (colonne **#**), puis par pathScore.

Répartition par nombre de facteurs actifs :
- 4 facteur(s) : 1 voies
- 3 facteur(s) : 2 voies
- 2 facteur(s) : 11 voies
- 1 facteur(s) : 24 voies
- 0 facteur(s) : 16 voies

| # | id | voie | damage (src) | Q1 | ≥3? | q3Regret | ≥3? | q3Relief | ≥3? | irrev | rev | règle | pathScore |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 2026-01-12 | Aller chez Sophiane (B) | oui (drain) | 4 | oui | 3 | oui | 3 | oui | oui | non | heartOverBody (×2) | 32 |
| 3 | 2026-03-26 | Cam (B) | oui (drain) | 3 | oui | 4 | oui | 0 | non | non | non | heartOverBody (×2) | 66 |
| 3 | 2026-01-13 | Aller au lac (B) | oui (drain) | 3 | oui | 9 | oui | 0 | non | non | non | heartOverBody (×2) | 45 |
| 2 | 2026-03-30 | Rester à l’apéro (A) | non (—) | 0 | non | 3 | oui | 0 | non | oui | non | — | 21 |
| 2 | 2026-05-01 | Aller a la manif (B) | oui (drain) | 0 | non | 3 | oui | 0 | non | non | non | — | 20 |
| 2 | 2026-01-01 | Rester le week-end dans ma ville natale (A) | oui (mot) | 4 | oui | 0 | non | 0 | non | non | non | — | 11.5 |
| 2 | 2026-08-31 | Aller a la chorale (A) | oui (mot+drain) | -1.5 | non | 3 | oui | 0 | non | non | non | — | 9.5 |
| 2 | 2026-01-13 | Annuler et dessiner chez moi (B) | non (—) | 7 | oui | 0.25 | non | 3 | oui | non | non | — | 9.5 |
| 2 | 2026-01-12 | Rester chez moi tester le B52 (A) | oui (mot) | 0.25 | non | 3 | oui | 3 | oui | non | non | bodyWisdom (×0.5) | 4.25 |
| 2 | 2026-09-11 | Faire dame damier à Sing or die (B) | oui (drain) | 0 | non | 0.25 | non | 0 | non | non | oui | bodyWisdom (×0.5) | 2.65625 |
| 2 | 2026-01-12 | Aller au bar (B) | oui (drain) | 0 | non | 0.25 | non | 0 | non | non | oui | bodyWisdom (×0.5) | 0.8125 |
| 2 | 2026-01-13 | Aller au rendez-vous avec ma conseillère (A) | oui (drain) | 1.5 | non | 0.5 | non | 3 | oui | non | non | bodyWisdom (×0.5) | 0.75 |
| 2 | 2026-03-31 | Ne pas envoyer le mail (B) | non (—) | 3 | oui | 0 | non | 3 | oui | non | non | — | 0 |
| 2 | 2026-01-13 | BD Tour du monde 80 jours (B) | oui (drain) | -3 | non | 0.25 | non | 0 | non | non | oui | bodyWisdom (×0.5) | -0.4375 |
| 1 | 2026-01-15 | Rester chez Leonie écrire ma lettre (A) | non (—) | 3.75 | oui | 0 | non | 0 | non | non | non | — | 15.75 |
| 1 | 2026-01-15 | Continuer le repos (B) | non (—) | 4.5 | oui | 0 | non | 0 | non | non | non | — | 15 |
| 1 | 2026-01-19 | Annuler l'Inde et recontacter Asturias Yoga (A) | non (—) | -0.75 | non | 3 | oui | 0 | non | non | non | — | 14.25 |
| 1 | 2026-01-15 | Annuler l'Inde et recontacter Asturias Yoga (A) | non (—) | -0.75 | non | 3 | oui | 0 | non | non | non | — | 14.25 |
| 1 | 2026-09-13 | Alice ça glisse (A) | non (—) | 0.5 | non | 3 | oui | 0 | non | non | non | — | 14 |
| 1 | 2026-09-11 | Jouer du synthé (B) | non (—) | 4 | oui | 0 | non | 0 | non | non | non | — | 13 |
| 1 | 2026-01-01 | Repartir plus tôt (B) | oui (mot) | 1.75 | non | 1 | non | 0 | non | non | non | — | 12.25 |
| 1 | 2026-01-14 | Attendre après le médecin vendredi (B) | non (—) | 3 | oui | 0 | non | 0 | non | non | non | — | 11 |
| 1 | 2026-01-14 | Répondre maintenant à Charlotte (mail) (A) | non (—) | 3.5 | oui | 1 | non | 0 | non | non | non | — | 9.5 |
| 1 | 2026-03-30 | Aller à la Chorale boucan (B) | non (—) | 4.5 | oui | 0 | non | 0 | non | non | non | — | 9 |
| 1 | 2026-09-11 | Aller voir un concert (A) | non (—) | 3 | oui | 0 | non | 0 | non | non | non | — | 8.5 |
| 1 | 2026-01-14 | Appeler Asturias Yoga maintenant (A) | non (—) | 4.5 | oui | 1 | non | 0 | non | non | non | — | 8 |
| 1 | 2026-02-10 | Rester à la maison jouer avec Lola (B) | non (—) | 1.75 | non | 0 | non | 0 | non | non | oui | — | 5.875 |
| 1 | 2026-02-10 | Aller à BZ et voir Athenais (A) | non (—) | 0.25 | non | 0 | non | 0 | non | non | oui | — | 5.625 |
| 1 | 2026-01-20 | Aller me plaindre auprès des filles (A) | oui (mot) | 0 | non | 0 | non | 0 | non | non | non | — | 4.5 |
| 1 | 2026-01-12 | Aller au Molo (A) | oui (mot+drain) | -4 | non | 0.5 | non | 0 | non | non | non | — | 4 |
| 1 | 2026-09-13 | 2 coups d'avance (B) | non (—) | 2.5 | non | 0 | non | 0 | non | non | oui | — | 2.5 |
| 1 | 2026-03-22 | S'asseoir sur un banc pour fumer (A) | non (—) | 3 | oui | 0 | non | 0 | non | non | non | — | 1.5 |
| 1 | 2026-09-11 | Jouer sur le steam deck (C) | non (—) | 0.75 | non | 0 | non | 0 | non | non | oui | — | 1.125 |
| 1 | 2026-01-13 | Rester au lit (A) | non (—) | 0 | non | 0 | non | 3 | oui | non | non | — | 0.5 |
| 1 | 2026-01-20 | ne rien dire ce soir, en parler demain (B) | oui (drain) | -1 | non | 1 | non | 0 | non | non | non | — | 0 |
| 1 | 2026-03-26 | Guillemette (A) | oui (mot) | -3 | non | 0 | non | 0 | non | non | non | — | -2 |
| 1 | 2026-03-22 | Marcher direct (B) | oui (mot+drain) | -4 | non | 1 | non | 0 | non | non | non | — | -2.5 |
| 1 | 2026-01-15 | Chercher job mi-temps maintenant (A) | non (—) | -1 | non | 0 | non | 3 | oui | non | non | — | -2.5 |
| 0 | 2026-09-11 | Faire l’admin sur mon ordi (A) | non (—) | 0.5 | non | 1 | non | 0 | non | non | non | — | 8.5 |
| 0 | 2026-08-31 | Rentrer chez maria (B) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 6.5 |
| 0 | 2026-08-31 | Aller marcher (C) | non (—) | 1 | non | 0 | non | 0 | non | non | non | — | 6.5 |
| 0 | 2026-03-31 | Envoyer le mail (A) | non (—) | -1 | non | 1 | non | 0 | non | non | non | — | 6 |
| 0 | 2026-01-13 | Vidéos youtube couleurs (A) | non (—) | 1 | non | 0 | non | 0 | non | non | non | — | 5 |
| 0 | 2026-09-13 | Strong Enough (C) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 4.5 |
| 0 | 2026-09-11 | Mettre un toz à tout le monde et rester chez moi (C) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 4.5 |
| 0 | 2026-01-15 | Aller voir le film avec Romane (B) | non (—) | -1.5 | non | 0 | non | 0 | non | non | non | — | 4.5 |
| 0 | 2026-03-30 | Faire le tournoi d’échecs (A) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 4 |
| 0 | 2026-01-21 | commencer à ranger ma chambre ou faire la lessive (B) | non (—) | 2 | non | 0 | non | 0 | non | non | non | — | 4 |
| 0 | 2026-01-14 | Attendre qu'ils répondent par message (B) | non (—) | 2.25 | non | 0.5 | non | 0 | non | non | non | — | 3.75 |
| 0 | 2026-01-19 | Continuer à chercher pour l'Inde ou autre (B) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 2.875 |
| 0 | 2026-01-15 | Continuer à chercher pour l'Inde ou autre (B) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 2.875 |
| 0 | 2026-01-21 | Continuer à travailler sur QF (A) | non (—) | 1.5 | non | 0 | non | 0 | non | non | non | — | 2.25 |
| 0 | 2026-03-30 | Aller chez Léa (B) | non (—) | 0 | non | 0 | non | 0 | non | non | non | — | 2 |
| 0 | 2026-05-01 | Rester a l’intérieur (A) | non (—) | -1 | non | 0 | non | 0 | non | non | non | — | -0.5 |
