/**
 * LEXICON — Oracle V4.
 *
 * FICHIER GÉNÉRÉ. Ne pas éditer à la main : la source est
 * QF_documentation/oracle_detecte.md, et toute modification faite ici
 * disparaîtra à la prochaine génération.
 *
 *   node labo/v4/build_lexicon.js
 */

export const LEXICON = {
  "Q1": {
    "desire": {
      weak: ["why not", "fun", "envie", "je veux", "j'aimerais bien", "tente", "curieu", "curi", "intéress", "sympa", "pas dégueu", "pourquoi pas", "j'ai du temps", "j'ai le temps", "dispo", "envie", "partant", "cool", "fun", "fun", "cool", "cools", "trop cool", "why not", "envie", "'aimerais bien", "plaît", "énergie disponible", "ça me plaît"],
      strong: ["excit", "allez", "joie", "hâte", "rêve", "kiff", "j'adore", "adore", "trop bien", "super", "génial", "incroyable", "fantastique", "tellement envie", "grave envie", "trop envie", "enthousi", "euphorie", "joyeu", "let's go", "goo", "chaud", "hyper envie", "important", "joie", "enthousiasme", "excitation", "magnifique", "décision importante", "aime sortir", "importance"],
    },
    "indifference": {
      weak: ["bof", "dur", "pf", "ennui", "mh", "hm", "je sais pas", "mouais", "meh", "moyen", "pas convaincue", "sceptique", "pas terrible", "pas ouf", "pas dingue", "démotiv", "difficile", "dur", "j'sais pas", "bof", "moyen", "pas hyper emballée", "neutre", "aucune idée", "mmh", "mmmh"],
      strong: ["osef", "pas envie", "pas envie du tout", "pas vraiment envie", "pas trop envie", "zéro envie", "je le sens pas", "je veux pas", "m'en fous", "m'en fiche", { keyword: "flemme", condition: "HP>=3" }, "chiant"],
    },
    "fear": {
      weak: ["stress", "inquièt", "tendu", "anxi", "j'ose pas", "peur de m'ennuyer"],
      strong: ["ah", "angoiss", "peur", "terrif", "paniqu", "oppresse", "ventre", "coupable", "inact", "flipp"],
    },
  },
  "Q2": {
    "achievements": {
      strong: ["c'est fait", "j'avance", "utile", "avance", "progres", "debloqu", "ça peut aider", "aide", "m'occupe", "gagne", "évit", "soulag", "débarrass", "libér", "réglé", "plus à y penser", "stimulant", "excit", "projet", "enfin", "excit", "reprendre", "en action", "en fini", "finir", "consolider"],
    },
  },
  "Q3": {
    "regret": {
      weak: ["dommage", "triste", "déçu", "decep", "coupable", "pas top", "j'aurais aimé", "j'aurais préféré", "j'aimerais quand même", "stress", "FOMO", "frustr", "pas content", "déçue", "je sais pas", "j'hésite", "saoule", "genee", "ça m'affecterait"],
      strong: ["toujours en tête", "honte", "degout", "deg", "fâché", "en colère contre moi", "colère", "nul", "decue de moi", "pas fière", "pas fiere", "pas contente de moi", "regret", "regretter", "je regretterais", "j'aurais regretté", "j'aurais mieux fait", "mauvaise idée", "erreur", "connerie", "j'y pense encore", "rumin", "je m'en veux", "je m'en voudrais", "malaise", "après coup"],
    },
    "trivial": {
      weak: ["osef", "pas grave", "au pire", "rien", "rien du tout", "que dalle", "change rien", "rien de spécial", "pareil", "même chose", "peu importe", "bah", "bah rien", "pf", "mh", "aucune importance", "ça compte pas", "j'aurais oublié", "oublié", "j'en sais rien", "je crois pas", "ça dépend", "peut-être", "ptet", "maybe"],
    },
    "relief": {
      strong: ["repos", "soulag", "ouf", "libre", "liber", "paix", "rassur", "ouf", "tranquille", "relax", "zen", "apaisé", "contente de pas", "contente de ne pas", "paix", "content", "heureu", "bien", "mieux", "mieux comme ça", "mieux sans", "repos", "libre", "libérée", "ça va mieux", "calme", "posé", "ok", "ça passe", "au moins c'est clair", "j'ai dit ce que j'avais à dire", "j'ai essayé", "j'assume", "j'avance", "fièr", "soulag", "liber", "paix", "rassur"],
    },
    "irreversible": {
      flag: ["pas d'autre occasion", "jamais", "rater", "rare", "rareté", "unique", "maintenant ou jamais", "opportunit", "opportunité", "chance unique", "manqu", "trop tard", "peut pas"],
    },
    "reversible": {
      flag: ["peux toujours", "au pire", "autre jour", "autre fois", "autre jour", "on verra", "réversible", "peut", "reverr", "revoir", "retourner", "report", "autre occasion", "pas avoir l'occasion"],
    },
    "recurrence": {
      flag: ["tjs","toujours", "encore", "procrastin", "procrastination", "procrastiner", "lentement", "longtemps", "jamais", "chaque fois", "comme d'hab", "rebelote", "ça traîne", "ca traine", "trainer", "encore trainer", "traîne depuis", "depuis longtemps", "atten", "chaque fois", "enfin"],
    },
  },
  "Q0": {
    "oui": {
      flag: ["yes", "carrement", "completement", "oui"],
    },
    "maybe": {
      flag: ["je crois pas", "pas vraiment", "peut-être", "un peu", "je sais pas", "aucune idée"],
    },
    "non": {
      flag: ["non", "pas du tout", "osef"],
    },
  },
  "sparks": {
    "wellbeing": {
      moderate: ["besoin", "soin", "libre", "liber", "paix", "fier", "cool", "plaisir", "kiff", "rire", "joie", "agréable", "vivante", "dynamique", "énergi", "en forme", "heureu", "épanoui", "satisfai", "repos", "prendre des forces", "magnifique", "sérénité", "serein", "chill", "détent", "confort", "agréable"],
    },
    "commitment": {
      moderate: ["j'ai dit", "promis", "m'attend", "compte sur moi", "prévu", "rdv", "rendez-vous", "entretien", "honorer", "poser un lapin"],
    },
    "connections": {
      moderate: ["être avec", "voir", "se voir", "ensemble pote", "ami", "famille", "frère père", "papa", "maman", "mère", "ensemble", "amour", "amitié", "affection", "relation", "complicité", "rapproch", "lien", "rencontres", "partage", "contact", "meuf", "hote", "appeler", "message"],
    },
    "music": {
      moderate: ["musique", "chant", "chorale", "concert", "son", "morceau", "synth", "guitare", "loop"],
    },
    "move": {
      moderate: ["danser", "sauter", "courir", "pole dance", "salle", "cirque", "vélo", "bouger", "sport", "muscu", "stimulant", "activ", "actif", "yoga"],
    },
    "outings": {
      moderate: ["plage", "vélo", "sorti", "soleil", "il fait beau", "voyage", "aventure", "ciné", "endroit", "lieu"],
    },
    "playful": {
      moderate: ["jeu", "jouer", "jeux vidéos", "amuse", "fun", "instru", "geeker", "rigoler"],
    },
    "create": {
      moderate: ["dessiner", "peindre", "imagin", "créatif", "créer", "créat", "art", "musée", "expo"],
    },
    "work": {
      moderate: ["admin", "boss", "travail", "lettre", "taff", "écrire", "projet"],
    },
    "selfcare": {
      moderate: ["propret", "hygiene", "lessive", "menage", "vaisselle", "ranger"],
    },
    "curiosity": {
      moderate: ["curieu", "curio", "tester", "essayer", "découvrir", "compr"],
    },
    "passion": {
      moderate: ["complètement dedans", "pas le temps passer"],
    },
    "aligned": {
      moderate: ["vraiment moi", "ok avec moi-même", "digne", "respect", "dans mon élément", "passion", "accompli", "motivé", "capable", "reconnect"],
    },
  },
  "hooks": {
    "damage": {
      strong: ["douleur", "mal", "fatigu", "épuis", { keyword: "flemme", condition: "HP=<2" }, "trop mal", "au fond du trou", "dead", "malade", "charge mentale"],
    },
    "injunctions": {
      strong: ["il faut", "je dois", "je devrais", "normal de", "on est censé", "raisonnable", "vont penser", "vont se dire", "jugée", "vex", "bless", "décevoir", "oblig", "si je le fais pas", "contrain", "forc", "résign", "raisonnable", "me forc", "suis forc"],
    },
    "auto-jugement": {
      strong: ["ridicule", "pathétique", "j'abuse", "je me respecte pas", "honte"],
    },
    "rationalisation": {
      strong: ["maybe si", "peut-etre que oui si", "risque que", "pourrait", "pese"],
    },
    "guilt": {
      strong: ["coupable", "culpabili"],
    },
    "unpleasant": {
      strong: ["ouin","chiant", "désagréable", "j'aime pas", "ça me saoule", "ça me fait chier", "ça m'emmerde", "envie de rien"],
    },
  },
  "modifiers": {
    "but": {
      flag: ["mais", "en même temps"],
    },
    "not": {
      flag: ["pas", "pas du tout", "aucun", "aucune"],
    },
    "less": {
      flag: ["un peu", "un poil", "un peu de", "pas vraiment", "moyen", "bof", "pas très", "plus", "a l'air", "j'ai l'impression que"],
    },
    "more": {
      flag: ["très", "trop", "mega vachement", "de fou", "à fond", "énormément", "grav", "complètement", "carrément", "beaucoup", "clairement", "vraiment"],
    },
  },
};
