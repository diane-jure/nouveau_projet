# L'Oracle

Un outil de décision. Quatre questions, un verdict, un journal.

Pas d'appel à un LLM : le verdict est un calcul, entièrement lisible et
modifiable. Site statique sans build ni dépendance, prévu pour Netlify.

---

## Les quatre questions

| | Question | Portée |
|---|---|---|
| **Q0** | Dans 10 jours, ça compte ? | posée une fois |
| **Q1** | Première sensation | par option |
| **Q2** | Si ça se passe bien | par option |
| **Q3** | Si demain tu l'as pas fait | par option |

**Q0 ne marque aucun point** : il redistribue les poids des trois autres.
Si ça ne comptera pas, la sensation décide. Si ça comptera, c'est le regret.

## Ce que le moteur a appris de l'historique

Trois règles viennent directement des commentaires du tableau de décisions :

- **La flemme et la peur ne comptent pas pareil.** Dans l'historique,
  « ça me fait peur » accompagne la plupart des choix jugés satisfaisants,
  alors que la flemme accompagne ce qu'il valait mieux lâcher. Q1 note donc
  deux dimensions séparées : l'envie, et la peur.
- **Peur devant + regret derrière = c'est un enjeu** (l'option est
  renforcée). **Peur devant + soulagement derrière = c'est un refus**
  (l'option est pénalisée). Sans cette seconde règle, le dilemme du
  week-end à Lyon reste insoluble — « le calcul n'est pas bon ».
- **Une parole donnée passe devant l'envie.** Un rendez-vous pris n'entre
  pas dans la balance des envies.

Quand rien ne dépasse, l'oracle ne force pas un verdict : il propose
d'**ajouter une option C**, ou tire à **pile ou face** si de toute façon
ça ne comptera pas dans dix jours.

---

## Organisation des fichiers

Chaque fichier a un seul rôle. C'est ce qui permet de changer le ton de
l'oracle sans toucher au calcul, ou de changer de base de données sans
toucher à l'interface.

```
index.html            la page, rien d'autre

css/
  fonts.css           les deux polices pixel, servies en local
  palette.css         LES COULEURS — et le code couleur par étape
  pixel.css           les composants pixel art (fenêtres, menus, jauges)
  app.css             la mise en page

js/
  scales.js           les 4 questions et leur barème
  oracle.js           LE MOTEUR — que des nombres et des codes, zéro texte
  phrases.js          LES PHRASES — tout le texte, zéro calcul
  storage.js          LES SAUVEGARDES — interface unique, prête pour Supabase
  kit.js              fabrique de composants DOM
  screens.js          un écran = une fonction
  audio.js            bips synthétisés (aucun fichier son)
  main.js             routage et HUD

data/historique.js    les 22 dilemmes réels, en jeu de tests
test/                 la régression et le rapport lisible
```

### Changer le ton de l'oracle

Tout est dans `js/phrases.js`, y compris les variantes. Le moteur ne lit
jamais ce fichier, il ne peut donc rien casser. Les marqueurs `{option}`
et `{dauphin}` sont remplacés à l'affichage.

### Régler le jugement

Tout est dans `js/scales.js` : les barreaux d'échelle et leurs scores, les
poids par niveau d'enjeu (`POIDS`), et les seuils (`SEUILS`). Après chaque
modification, `npm test` dit si le nouveau barème contredit l'historique.

### Le code couleur par étape

Dans `css/palette.css`. Un seul attribut pilote tout : `<html data-etape>`.
L'écran vire du bleu nuit (le seuil) au rouge (le ventre), à l'or (ce qu'on
gagne), au vert (ce qu'on perd), puis au violet et or du verdict.

---

## Développement

```bash
npm run dev        # sert la racine sur http://localhost:5173
npm test           # la régression sur les 22 dilemmes réels
npm run rapport    # le tableau comparatif, lisible à l'œil
```

Pas de `npm install` : il n'y a aucune dépendance.

### État de la régression

29 tests. Sur les 22 dilemmes réels : **8/10 des choix satisfaisants
retrouvés, 0 choix regretté recommandé.** Les deux écarts portent sur des
dilemmes signalés comme indécidables dans les commentaires d'origine ;
le moteur y répond « serré » plutôt que de trancher.

> Attention : la conversion des réponses en texte libre de l'historique
> vers les barreaux d'échelle est une **interprétation**. Le texte d'origine
> est conservé dans `notes` pour que chaque choix reste discutable.

---

## Mise en ligne (Netlify)

Rien à construire. `netlify.toml` publie la racine telle quelle.

- soit glisser-déposer le dossier sur Netlify,
- soit brancher le dépôt : build command vide, publish directory `.`.

## Passer à Supabase

Ne toucher qu'à `js/storage.js` : réimplémenter les six méthodes de
`magasin` en async (elles le sont déjà), le reste de l'application ne
verra pas la différence.

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

Le bouton **Exporter** du journal produit exactement cette forme en JSON :
de quoi migrer les données locales sans rien perdre.

---

## Accessibilité et robustesse

- Navigation complète au clavier (flèches dans les menus, Entrée, Échap).
- Les polices sont servies en local : aucune requête vers un tiers, et le
  pixel art ne s'effondre pas si le réseau flanche.
- `prefers-reduced-motion` coupe les animations, frappe machine comprise.
- `localStorage` peut échouer (navigation privée) : l'app continue de
  fonctionner, sans mémoire.
- Le son est synthétisé, coupable, et son état est retenu.
