/**
 * HISTORIQUE — les 22 dilemmes reels, convertis en jeu de tests.
 *
 * AVERTISSEMENT : la traduction des reponses en texte libre vers les barreaux
 * d'echelle est une INTERPRETATION. « Un peu flemme » a ete lu comme 'flemme',
 * « why not » comme 'partant', etc. Le texte d'origine est conserve dans
 * `notes` pour que chaque choix reste verifiable et discutable.
 *
 * `attendu` est la verite terrain, deduite des colonnes Satisfaction et
 * Commentaire :
 *   { gagnant: i }      l'oracle doit designer l'option i
 *   { pasGagnant: i }   l'oracle ne doit PAS designer l'option i
 *   { type: '...' }     le type de verdict attendu
 *   { drapeau: '...' }  ce drapeau doit etre leve
 *   null                aucune verite terrain (dilemme jamais tranche)
 *
 * Les cas notes 'bad' sont les plus precieux : l'oracle doit y contredire
 * ce qui a ete fait.
 */

export const HISTORIQUE = [
  {
    date: '2026-09-13', q0: 'non',
    options: [
      { nom: 'Alice ça glisse', q1: 'trac', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'fun, mais ça me fait peur', q2: "un tube, j'aurais enfin fait quelque chose de ce hook que j'ai", q3: "je l'aurais toujours en tête" } },
      { nom: "2 coups d'avance", q1: 'trac', q2: 'bon', q3: 'reporte',
        notes: { q1: "mmh j'ai l'impression que ça peut être difficile mais cool", q2: "je peux l'envoyer à amir", q3: 'je peux tjs le faire' } },
      { nom: 'Strong Enough', q1: 'peur', q2: 'nourrit', q3: 'reporte',
        notes: { q1: "ouah ça a l'air vraiment dur", q2: "j'apprends à faire une instru disco", q3: 'je peux tjs le faire' } },
    ],
    reel: { oracle: 'Pile ou face', choixFinal: null, satisfaction: null, commentaire: '' },
    attendu: null,
  },
  {
    date: '2026-09-11', q0: 'non',
    options: [
      { nom: 'Aller voir un concert', q1: 'bof', q2: 'bon', q3: 'rien',
        notes: { q1: "J'sais pas bof", q2: 'Danser, simplement, être avec Lélé', q3: 'Osef' } },
      { nom: 'Faire dame damier à sing or die', q1: 'bof', q2: 'nourrit', q3: 'reporte',
        notes: { q1: "Un peu flemme, mais j'aimerais bien y retourner", q2: 'Du bonheur dans mon ancien endroit préféré, le faire découvrir à Charlotte', q3: 'un peu frustrée mais ça peut être un autre jour' } },
      { nom: 'Mettre un toz à tout le monde et rester chez moi', q1: 'peur', q2: 'bon', q3: 'rien',
        notes: { q1: 'Un peu de peur', q2: 'Je crée des trucs et je joue au steam deck', q3: 'Rien' } },
    ],
    reel: { oracle: 'Pile ou face', choixFinal: null, satisfaction: null, commentaire: '' },
    attendu: null,
  },
  {
    date: '2026-09-11', q0: 'oui',
    options: [
      { nom: "Faire l'admin sur mon ordi", q1: 'peur', q2: 'nourrit', q3: 'regret',
        notes: { q1: "Ahhh j'ai pas envie ça me fait peur", q2: "J'ai validé mes documents, soulagée", q3: 'Stress' } },
      { nom: 'Jouer du synthé', q1: 'elan', q2: 'nourrit', q3: 'reporte',
        notes: { q1: "C'est cool, j'ai peu l'occasion de le faire", q2: "Je m'amuse et j'avance sur ma musique", q3: 'Je peux le faire' } },
      { nom: 'Jouer sur le steam deck', q1: 'bof', q2: 'bon', q3: 'reporte',
        notes: { q1: "Moyen, j'suis pas hyper emballée par mon nouveau jeu", q2: 'Je vois pas le temps passer', q3: 'Je peux toujours le faire' } },
    ],
    reel: { oracle: 'Jouer du synthé', choixFinal: "Faire l'admin sur mon ordi", satisfaction: 'good',
      commentaire: "Ça m'a permis de régler rapidement la question de la CMU, vérifier mon contrat ES, et relancer la facture bouygues" },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-08-31', q0: 'non',
    options: [
      { nom: 'Aller à la chorale', q1: 'peur', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'Flemme anxiete', q2: 'Joie partage chant', q3: 'Maybe regret' } },
      { nom: 'Rentrer chez maria', q1: 'bof', q2: 'bon', q3: 'rien',
        notes: { q1: 'Bof', q2: 'Du repos, des rires, du jeu', q3: 'Rien' } },
      { nom: 'Aller marcher', q1: 'partant', q2: 'bon', q3: 'rien',
        notes: { q1: 'Why not', q2: 'De la sérénite, de l’activité', q3: 'Rien' } },
    ],
    reel: { oracle: 'Aller marcher', choixFinal: 'Aller marcher', satisfaction: 'good',
      commentaire: "J'ai pu bouger mais sans me forcer à avoir les interactions sociales de la chorale" },
    attendu: { gagnant: 2, type: 'PILE_OU_FACE' },
  },
  {
    date: '2026-05-01', q0: 'bof',
    options: [
      { nom: "Rester à l'intérieur", q1: 'bof', q2: 'rien', q3: 'rien',
        notes: { q1: "Ahhhh j'me sens coupable", q2: 'Rien', q3: 'Rien' } },
      { nom: 'Aller à la manif', q1: 'peur', q2: 'nourrit', q3: 'regret',
        notes: { q1: 'Ahhhh angoisse', q2: 'Rencontres fierté amusement', q3: 'Regret' } },
    ],
    reel: { oracle: 'Aller à la manif', choixFinal: "Rester à l'intérieur", satisfaction: 'bad',
      commentaire: "Je me suis juste sentie coupable, le 1er mai n'a lieu qu'une fois par an. Mieux vaut essayer quelque chose qui me donne bof envie que de regretter de pas l'avoir fait" },
    attendu: { gagnant: 1 },
  },
  {
    date: '2026-03-31', q0: 'oui',
    options: [
      { nom: 'Envoyer le mail', q1: 'peur', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'Stress', q2: "Faire ce dont j'ai envie", q3: 'Stress' } },
      { nom: 'Ne pas envoyer le mail', q1: 'bof', q2: 'petit', q3: 'soulage',
        notes: { q1: 'Culpabilité', q2: 'Je gagne du temps', q3: 'Libéré' } },
    ],
    reel: { oracle: 'Ne pas envoyer le mail', choixFinal: 'Envoyer le mail', satisfaction: 'good', commentaire: '' },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-03-30', q0: 'non',
    options: [
      { nom: 'Faire le tournoi des Échecs', q1: 'bof', q2: 'bon', q3: 'reporte',
        notes: { q1: 'Bof', q2: 'Un moment avec Yoann, peut-être gagner des parties', q3: "J'aurai d'autres occasions" } },
      { nom: 'Aller à la Chorale boucan', q1: 'elan', q2: 'nourrit', q3: 'rate',
        notes: { q1: 'Enthousiasme', q2: 'Passer un autre moment à chanter, découvrir', q3: "Peur de pas avoir l'occasion" } },
    ],
    reel: { oracle: 'Aller à la Chorale boucan', choixFinal: 'Faire le tournoi des Échecs', satisfaction: 'good',
      commentaire: "Oui car je suis restée avec Yoann. Mais on était tous les deux malades donc il n'y avait pas de bonne activité" },
    attendu: { gagnant: 1 },
  },
  {
    date: '2026-03-30', q0: 'oui',
    options: [
      { nom: "Rester à l'apéro", q1: 'flemme', q2: 'nourrit', q3: 'rate',
        notes: { q1: 'Un peu flemme', q2: 'On va chanter et je vois des gens cools', q3: "Regret, c'est une opportunité" } },
      { nom: 'Aller chez Lea', q1: 'bof', q2: 'petit', q3: 'reporte',
        notes: { q1: 'Bof', q2: 'Mes affaires', q3: "Rien, je peux y aller demain" } },
    ],
    reel: { oracle: "Rester à l'apéro", choixFinal: "Rester à l'apéro", satisfaction: 'good',
      commentaire: 'Grave chant après ! Juste je sais pas encore quand je recup mon sac' },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-03-26', q0: null,
    options: [
      { nom: 'Guillemette', q1: 'bof', q2: 'bon', q3: 'rien',
        notes: { q1: 'neutre, flemme', q2: 'satisfaction, stabilité', q3: 'rien' } },
      { nom: 'CAM', q1: 'trac', q2: 'change', q3: 'regret',
        notes: { q1: 'excitation et peur', q2: 'trop cool, faire plein de trucs, rencontres, projets', q3: 'rien / regrets, déception' } },
    ],
    reel: { oracle: 'CAM', choixFinal: 'Guillemette', satisfaction: 'meh', commentaire: 'pas ma décision seule' },
    attendu: { gagnant: 1 },
  },
  {
    date: '2026-02-10', q0: null,
    options: [
      { nom: 'Aller à bz et voir Athenais', q1: 'trac', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'cool et stressée en même temps', q2: "joie de la voir, j'avance sur mon vélo, je vois rome", q3: 'juste reporté, mais je la vois pas' } },
      { nom: 'Rester à la maison jouer avec Lola', q1: 'trac', q2: 'bon', q3: 'rate',
        notes: { q1: 'soulagée et stressée en même temps', q2: 'chill, joie, fun, détente', q3: 'pas possible de reporter, occasion ratée' } },
    ],
    reel: { oracle: 'Aucun des deux', choixFinal: 'Rester à la maison jouer avec Lola', satisfaction: 'good',
      commentaire: "à l'époque j'avais trop de stress par rapport à athé, et c'était rare qu'on ait l'occasion de geeker avec lola" },
    attendu: { gagnant: 1 },
  },
  {
    date: '2026-01-21', q0: null,
    options: [
      { nom: 'Aller me plaindre auprès des filles', q1: 'peur', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'ça me fait peur !!!', q2: "de la sérénité, elles sont au courant pour l'avenir", q3: 'fatigue' } },
      { nom: "Ne rien dire ce soir, en parler demain", q1: 'peur', q2: 'petit', q3: 'rien',
        notes: { q1: 'ça me fait peur', q2: 'peut être qu’elles réfléchiront demain', q3: 'je sais pas' } },
    ],
    reel: { oracle: 'Aucun des deux', choixFinal: 'Ne rien dire ce soir, en parler demain', satisfaction: 'bad',
      commentaire: "Elles auraient été compréhensives, j'ai souffert pour rien et ça m'a rendu parano" },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-01-21', q0: null,
    options: [
      { nom: 'Continuer à travailler sur QF', q1: 'bof', q2: 'nourrit', q3: 'reporte',
        notes: { q1: 'mmh ça commence à faire beaucoup', q2: 'un outil de plus en plus utile et efficace', q3: 'je pourrais toujours reprendre' } },
      { nom: 'Ranger ma chambre ou faire la lessive', q1: 'flemme', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'aaaaaah pas envie', q2: 'de la clarté, de la motivation', q3: 'rebelote, culpabilité' } },
    ],
    reel: { oracle: 'Aucun des deux', choixFinal: 'Continuer à travailler sur QF', satisfaction: 'bad',
      commentaire: "Toujours le bordel, j'suis deg parce qu'un peu de propreté m'aiderait, et QF progresse LEEEENTEMENT" },
    attendu: { type: 'SERRE', drapeau: 'aucuneNAppelle' },
  },
  {
    date: '2026-01-19', q0: null,
    options: [
      { nom: "Annuler l'Inde et recontacter Asturias Yoga", q1: 'trac', q2: 'nourrit', q3: 'regret',
        notes: { q1: 'Excitée mais aussi honteuse', q2: 'Consolider un projet', q3: 'Peur du regret' } },
      { nom: "Continuer à chercher pour l'Inde ou autre", q1: 'peur', q2: 'bon', q3: 'rien',
        notes: { q1: 'Anxiété de fou, peur panique', q2: 'Plus de temps pour réfléchir et trouver le meilleur', q3: 'Neutre ou angoissée' } },
    ],
    reel: { oracle: "Annuler l'Inde et recontacter Asturias Yoga", choixFinal: "Annuler l'Inde et recontacter Asturias Yoga", satisfaction: 'good',
      commentaire: "Même si c'était dur en Asturias, j'ai profité d'une nature magnifique et je n'étais pas TROP LOIN de la France" },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-01-14', q0: null,
    options: [
      { nom: 'Continuer à travailler sur QF', q1: 'bof', q2: 'nourrit', q3: 'reporte',
        notes: { q1: 'mmh ça commence à faire beaucoup', q2: 'un outil de plus en plus utile et efficace', q3: 'je pourrais toujours reprendre' } },
      { nom: 'Ranger ma chambre ou faire la lessive', q1: 'flemme', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'aaaaaah pas envie', q2: 'de la clarté, de la motivation', q3: 'rebelote, culpabilité' } },
    ],
    reel: { oracle: 'Aucun des deux', choixFinal: 'Continuer à travailler sur QF', satisfaction: 'meh', commentaire: 'Aucun souvenir' },
    attendu: { type: 'SERRE' },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Aller au rendez-vous avec ma conseillère', q1: 'bof', q2: 'petit', q3: 'frustre', engagement: true,
        notes: { q1: 'Bof, elle est moins intelligente que moi', q2: 'Respecter le rendez-vous, peut-être un truc utile', q3: "Un peu coupable de l'avoir posé un lapin" } },
      { nom: 'Annuler et dessiner chez moi', q1: 'elan', q2: 'nourrit', q3: 'rien',
        notes: { q1: "Soulagée, j'ai envie de créer", q2: 'Avancer sur mes dessins, me reconnecter à ma passion', q3: 'Un peu coupable mais surtout libre' } },
    ],
    reel: { oracle: 'Aller au rendez-vous avec ma conseillère', choixFinal: 'Aller au rendez-vous avec ma conseillère', satisfaction: 'meh',
      commentaire: "bien sûr qu'il faut honorer un rdv même si on n'a pas envie" },
    attendu: { gagnant: 0, drapeau: 'engagement' },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Vidéos youtube couleurs', q1: 'partant', q2: 'nourrit', q3: 'rien',
        notes: { q1: 'Mmmmh why not', q2: "J'aurais appris des trucs sur les couleurs, et ça débloquera les deux autres vidéos qui traînent", q3: 'Change rien !' } },
      { nom: 'BD Tour du monde en 80 jours', q1: 'flemme', q2: 'nourrit', q3: 'reporte',
        notes: { q1: "Flemme ! Peur de m'ennuyer", q2: "Être à fond dans l'univers de Jules Verne, apprendre de la géographie", q3: 'Un poil coupable, mais peux toujours le lire' } },
    ],
    reel: { oracle: 'Vidéos youtube couleurs', choixFinal: 'autre', satisfaction: 'good',
      commentaire: "il y a l'apprentissage (très important pour moi) et être à fond c'est la passion — peut-être nommer ma peur d'être inactive" },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Aller au Molo', q1: 'flemme', q2: 'nourrit', q3: 'frustre',
        notes: { q1: 'Pffff flemme', q2: 'Rigoler et danser avec mes potes A et M, ptet rencontrer une meuf qui me plaît', q3: "Un peu dommage car ça fait longtemps qu'on se rate avec A" } },
      { nom: 'Aller au bar', q1: 'peur', q2: 'bon', q3: 'reporte',
        notes: { q1: 'Angoisse', q2: 'Rigoler ensemble', q3: "Un peu gênée parce qu'on va se revoir demain, mais de toutes façons j'avais dit non" } },
    ],
    reel: { oracle: 'Aller au Molo', choixFinal: 'autre', satisfaction: 'good',
      commentaire: "Aucun des deux : j'ai eu une invitation à l'improviste ailleurs. Deux options qui coûtent plus que l'énergie disponible" },
    attendu: { drapeau: 'aucuneNAppelle' },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Rester au lit', q1: 'bof', q2: 'petit', q3: 'soulage',
        notes: { q1: 'Mmmmmmmh oui mais non', q2: 'Du repos mais bon je fais rien', q3: 'Fière' } },
      { nom: 'Aller au lac', q1: 'trac', q2: 'change', q3: 'regret',
        notes: { q1: "Aaaaaah c'est dur mais allez allez il faut y aller", q2: "Je suis mega fière de moi, on s'amuse de fou", q3: 'Honteuse dégoûtée fâchée contre moi' } },
    ],
    reel: { oracle: 'Aller au lac', choixFinal: 'Aller au lac', satisfaction: 'good',
      commentaire: "Evidemment meilleure idée d'aller faire le truc qui gagne beaucoup et qui est rare. Dans 10 jours j'aurais pas oublié" },
    attendu: { gagnant: 1 },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: "Annuler l'Inde et recontacter Asturias Yoga", q1: 'trac', q2: 'nourrit', q3: 'regret',
        notes: { q1: 'Excitée mais aussi honteuse', q2: 'Consolider un projet', q3: 'Peur du regret' } },
      { nom: "Continuer à chercher pour l'Inde ou autre", q1: 'peur', q2: 'bon', q3: 'rien',
        notes: { q1: 'Anxiété de fou, peur panique', q2: 'Plus de temps pour réfléchir et trouver le meilleur', q3: 'Neutre ou angoissée' } },
    ],
    reel: { oracle: "Annuler l'Inde et recontacter Asturias Yoga", choixFinal: "Continuer à chercher pour l'Inde ou autre", satisfaction: 'meh',
      commentaire: "Dans un monde idéal l'oracle comprend qu'il s'agit d'une décision importante et nomme explicitement le dilemme même s'il me conseille l'option A" },
    attendu: { gagnant: 0 },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Chercher un job mi-temps maintenant', q1: 'flemme', q2: 'nourrit', q3: 'rien',
        notes: { q1: "Pffff l'impression de me trahir", q2: "Avoir de l'argent, rester à Strasbourg", q3: 'Continue à me reposer' } },
      { nom: 'Continuer le repos', q1: 'trac', q2: 'nourrit', q3: 'rien',
        notes: { q1: 'Peur de couler mais aussi... honnêtement soulagée', q2: 'Me reposer vraiment, dessiner, préparer Asturias', q3: 'En action' } },
    ],
    reel: { oracle: 'Aucun des deux', choixFinal: 'autre', satisfaction: 'good',
      commentaire: "Pas faux !! et là on arrive à un moment où il faudrait proposer d'ajouter une option C :)" },
    attendu: { drapeau: 'aucuneNAppelle' },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Retourner à Lyon ce week-end', q1: 'peur', q2: 'change', q3: 'soulage',
        notes: { q1: 'Sabrina me glace le sang', q2: 'Continuer ma formation, investir les 2000€', q3: 'Soulagée. Vraiment soulagée.' } },
      { nom: 'Certificat médical et rester chez moi', q1: 'trac', q2: 'bon', q3: 'rien',
        notes: { q1: 'Peur de perdre l’argent mais aussi soulagement', q2: 'Me reposer, dessiner, rigoler avec mes colocs', q3: 'Un peu coupable de l’argent, mais en paix' } },
    ],
    reel: { oracle: 'Aucun des deux', choixFinal: 'Certificat médical et rester chez moi', satisfaction: 'good',
      commentaire: "il y a BEAUCOUP de négatif au week-end, alors que le médecin c'est plutôt neutre. Le calcul n'est pas bon" },
    attendu: { gagnant: 1, drapeau: 'peurQuiProtege' },
  },
  {
    date: '2026-01-13', q0: null,
    options: [
      { nom: 'Rester le week-end dans ma ville natale', q1: 'partant', q2: 'bon', q3: 'rien',
        notes: { q1: 'Envie de calme et de repères', q2: 'Me reposer et éviter la charge mentale', q3: "Avoir l'impression de tourner en rond" } },
      { nom: 'Repartir plus tôt', q1: 'partant', q2: 'bon', q3: 'rien',
        notes: { q1: 'Envie modérée mais plus stimulant', q2: 'Me sentir active, avancer', q3: 'Fatigue et stress du trajet' } },
    ],
    reel: { oracle: 'Rester le week-end dans ma ville natale', choixFinal: 'Repartir plus tôt', satisfaction: 'good',
      commentaire: "Là typiquement l'oracle a pas assez d'éléments pour trancher" },
    attendu: { type: 'SERRE' },
  },
];

export default HISTORIQUE;
