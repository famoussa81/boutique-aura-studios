# Reprise du projet — tout ce qu'il faut savoir

## 0. Journal de continuité obligatoire

Avant toute nouvelle tâche, lire puis actualiser `JOURNAL-DE-REPRISE.md` :

1. inscrire la date, la demande courante et l'état Git au début de la tâche ;
2. indiquer les fichiers envisagés et les risques connus ;
3. à la fin, remplacer l'état « en cours » par le résultat réel, les tests
   passés, le déploiement éventuel et la prochaine action sûre ;
4. ne jamais présenter une vérification non exécutée comme réussie.

Ce journal est la mémoire de passage entre agents. Il doit rester concis mais
suffisamment précis pour reprendre le travail sans relire les conversations.

Ce fichier existe pour qu'un autre agent (Codex, Claude, ou un humain) puisse
reprendre ce projet sans relire l'historique. Il ne décrit pas ce que le code
fait — le code le dit — mais **pourquoi il est écrit ainsi**, et les pièges qui
ont déjà coûté du temps ou cassé la production.

Dossier : `C:\Users\PC\Downloads\Nike`
Dépôt : `https://github.com/famoussa81/boutique-aura-studios`
En ligne : `https://boutique-aura-studios.vercel.app`
Base : Supabase, projet `vgzvavlmmqbxtuhanaqj`

---

## 1. Ce qu'est ce projet

Une boutique en ligne destinée à être **revendue à des commerçants**. Le
premier client est un revendeur multi-marques à Bamako. Les commandes passent
par **WhatsApp**, le paiement se fait **à la livraison** — aucune carte
bancaire ne circule.

Cela impose trois contraintes qui expliquent la plupart des décisions :

1. **Le commerçant n'a pas fait d'études longues et n'a jamais administré de
   site.** Tout le tableau de bord est écrit dans son vocabulaire, pas dans
   celui d'un développeur.
2. **Les visiteurs sont sur des téléphones modestes**, souvent en économie de
   données. Le poids et la robustesse comptent plus que les effets.
3. **Le site sera revendu tel quel à d'autres commerçants.** Rien ne doit être
   codé en dur pour ce client-ci.

---

## 2. Pile technique

Aucune étape de compilation. Des fichiers statiques servis par Vercel.

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero, garanties, marques mises en avant, éditorial |
| `catalogue.html` | Tout le catalogue, filtrable |
| `collection.html?c=<marque>` | Page d'une marque |
| `produit.html?id=<produit>` | Fiche produit |
| `admin.html` | Tableau de bord du commerçant (9 onglets) |
| `boutique.js` (104 Ko) | Toute la logique de la boutique **et** la coque injectée |
| `boutique.css` (51 Ko) | Tout le style |
| `catalog.js` | Catalogue de démonstration + `CATEGORIES` + `VSEP` |
| `supabase-client.js` | Accès à la base |
| `supabase.config.js` | URL + clé publique. **Jamais la clé `service_role`.** |
| `page.css` | Style des pages annexes (CGV, 404, confidentialité) |
| `configurer.mjs` | Pose le domaine et les mentions légales en une commande |
| `visuels.py` | Recherche Pexels puis adoption des visuels, en deux temps |

Pages annexes : `cgv.html`, `confidentialite.html`, `guide-des-tailles.html`,
`durabilite.html`, `404.html`.

### La coque

`boutique.js` injecte au démarrage, autour de `<main id="page">` : bandeau
d'annonce, navigation, menu mobile, tiroir panier, quatre modales, bouton
WhatsApp flottant, message flottant, pied de page.

Chaque page ne contient donc que **son propre contenu**. Une correction sur la
navigation ou le panier se fait à un seul endroit. C'est ce qui rend viable
l'ajout d'une cinquième page.

Le type de page est déclaré par `data-page` sur le `body` : `accueil`,
`catalogue`, `collection`, `produit`. `typePage()` le lit, et le script
n'anime que ce que la page contient réellement.

---

## 3. Modèle de données

### Deux classements, à ne pas confondre

| | Catégorie | Marque (`collection` dans le code) |
|---|---|---|
| Répond à | *C'est quoi ?* | *C'est de qui ?* |
| Porte | Les axes (pointures, coloris) | L'identité visuelle |
| Clé produit | `p.cat` | `p.collection` |

Le mot « collection » ne doit **jamais** apparaître dans l'interface : le
commerçant lit « marque » partout. Le code garde ses noms internes.

### Variantes à deux axes

Un produit déclare jusqu'à deux axes (`Pointure`, `Coloris`). Les combinaisons
sont stockées dans `variants`, avec une clé jointe par `::` (constante `VSEP`).
Exemple : `"42::Noir"`. Un produit sans axe porte la clé vide.

```
p.variants = { "42::Noir": { s: 3, r: 1 } }
             s = stock,  r = réservé par des commandes en cours
```

**Compatibilité ascendante :** les produits créés avant ce modèle portent
`sizes` au lieu de `variants`. `normalizeProduct()` les convertit en mémoire,
sans réécrire la base, et `place_order` accepte les deux formes. Ne pas
supprimer ce chemin.

### Côté serveur

`place_order(payload jsonb)` est la **seule** écriture de commande autorisée.
Elle :

- relit les prix dans la table (le navigateur ne peut pas les falsifier) ;
- vérifie et réserve le stock de façon atomique (`for update`) — pas de
  survente possible ;
- attribue la référence depuis une séquence serveur ;
- **dérive la marque du produit**, jamais de ce que le navigateur annonce.

Le fichier `supabase/schema.sql` doit rester le miroir exact de la fonction
déployée. Il a déjà divergé une fois : une installation neuve serait repartie
avec une fonction incompatible avec les variantes à deux axes.

---

## 4. La règle qui gouverne le produit

> **Le commerçant modifie le contenu, jamais le design.**

C'est ce qui garantit que la boutique sera aussi soignée dans six mois. En
pratique :

- **Longueurs bornées** sur chaque champ de texte. Un titre trop long ne peut
  pas casser la mise en page.
- **Ratios imposés** au téléversement : l'image est recadrée au centre et
  compressée dans le navigateur avant l'envoi (900 px max, WebP q0.76).
- **Blocs extinguibles** plutôt que vides. Un bloc vide fait plus de mal qu'un
  bloc absent.
- **Aucun réglage de couleur, de police ou de disposition n'est exposé.**

### Formats d'image

| Emplacement | Ratio stocké | Piège |
|---|---|---|
| Hero | 16/10 | Texte blanc à gauche : moitié gauche sombre et calme |
| Bannière | 16/9 | Idem |
| Éditorial | 4/5 | — |
| Catégorie | 4/3 | — |
| **Marque** | **4/3** | **Affichée en 16/5 dans le bandeau** — seul le tiers central survit |
| Produit | 3/4 | Fond uni |

Le cas de la marque est le plus mal compris : l'image est stockée en 4/3 mais
le bandeau d'accueil l'affiche en 16/5. Le sujet doit donc tenir dans la bande
centrale, sinon le bandeau ne montre rien d'utile.

---

## 5. Pièges qui ont déjà cassé la production

À lire avant de toucher au code. Chacun a coûté un incident réel.

### `var` de module lue avant son affectation

Deux fois. Une table de correspondance déclarée au niveau du module mais lue
par une fonction appelée plus tôt vaut `undefined`, et le rendu s'arrête net.
La première fois, le catalogue s'est vidé et la boutique est revenue au
catalogue de démonstration sans aucun message. La seconde, la fiche produit
s'est arrêtée au milieu.

**Règle : une table de correspondance se déclare dans la fonction qui
l'utilise.**

### Un effet décoratif qui masque le contenu

Une apparition au défilement posait `opacity: 0` par une règle de feuille de
style. En production, une autre règle l'emportait : **la page d'accueil est
restée entièrement invisible**, alors que le script marquait bien les éléments
comme vus.

**Règle : l'état masqué est posé en ligne par le script, jamais par une règle
de feuille de style.** Un style en ligne ne peut pas être battu, et seul le
script qui l'a posé peut le retirer — donc si le script ne tourne pas, rien
n'est masqué. Un filet de sécurité rend tout visible après deux secondes quoi
qu'il arrive.

### `<noscript>` placé entre `</head>` et `<body>`

Le parseur ouvre alors `<body>` tout seul, l'attribut `data-page` disparaît, et
la page ne sait plus ce qu'elle est. Le bloc doit être **dans** le corps.

### Identifiants dupliqués entre la coque et la page

La fiche produit en pleine page porte les mêmes identifiants que la modale
produit (`pvMedia`, `pvAxes`, `pvAdd`…). La coque retire donc la modale sur
`data-page="produit"`. Sans cela, le script écrit dans la copie cachée et la
page reste vide.

Corollaire : `closeModal()` doit tolérer une modale absente. Il ne le faisait
pas, et **on ne pouvait pas acheter depuis la fiche produit** — l'article
entrait au panier puis une exception empêchait le tiroir et l'écran de
commande de s'ouvrir.

### Les réglages qui n'atteignaient pas le site

`saveStore()` n'écrivait que dans `localStorage`, et `syncSettings()` n'était
appelé qu'à un seul endroit. Renommer une catégorie, ajouter une marque,
changer un texte ou poser une couverture restait dans le navigateur du
commerçant. Il voyait sa modification, la boutique gardait l'ancienne valeur,
et rien ne signalait l'écart.

**`saveStore()` synchronise désormais.** Ne pas ajouter d'appel à
`syncSettings()` ailleurs : le remède est à la source, précisément pour que le
vingt-et-unième endroit ne soit pas oublié.

En sens inverse, la lecture initiale utilise `saveStoreWith()` (local seul) :
ce qui vient d'être lu n'a pas à être renvoyé, et une lecture partiellement
échouée ne doit pas réécrire la base.

### Un contrôle qui vérifie le chargement, pas le contenu

Le contrôle automatique disait « 0 image cassée » pendant que l'en-tête du
site affichait **une rue commerçante en Pologne** et qu'une couverture de
marque montrait des bottines en cuir sur une boutique de claquettes. Les
fichiers se chargeaient : c'est tout ce qui était vérifié.

**Une image ne se vérifie qu'en la regardant.** `visuels.py` sépare pour cela
la recherche de l'adoption : les candidats sont téléchargés à part, et rien
n'entre dans `assets/` sans avoir été choisi explicitement après examen.

### Le serveur de test local

Il tronque les fichiers et sert parfois un type MIME faux, de façon
intermittente. Plusieurs faux négatifs en sont venus. **En cas de doute,
vérifier sur la production**, pas en local.

---

## 6. Règles de contenu à ne pas enfreindre

- **Ne jamais inventer d'avis, de note ou de promotion.** Un faux avis se
  repère, et un client déçu qui l'avait lu se sent floué deux fois. Le prix
  barré n'apparaît que s'il correspond à un vrai ancien prix.
- **Ne jamais faire générer un logo ou une marque par une IA.** Risque
  juridique, et ça se voit. Les visuels décrivent des matières et des formes ;
  la marque vient du texte affiché par-dessus.
- **Ne pas afficher la marque d'un tiers sur la couverture d'une autre.** Une
  couverture Moncler portant un logo New Balance a déjà été écartée.
- **N'annoncer que ce que le commerçant peut tenir.** Un délai de 48 h honnête
  vaut mieux qu'un 24 h flatteur : à Bamako le bouche-à-oreille va vite, dans
  les deux sens.

---

## 7. Déploiement

Vercel est branché sur la branche `main` du dépôt GitHub. Un `git push` suffit,
le déploiement suit en une à deux minutes.

```bash
git push origin main
```

Vérifier ensuite en production, pas en local :

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://boutique-aura-studios.vercel.app/
```

Le jour où un vrai nom de domaine arrive :

```bash
node configurer.mjs --domaine https://votre-domaine.com
```

Cette commande réécrit les balises canoniques, les URL de partage, `robots.txt`
et le plan du site. Le domaine d'exemple d'origine appartenait à une agence
italienne : chaque page déclarait appartenir au site de quelqu'un d'autre, et
la boutique n'aurait jamais été indexée.

### Fichier à ne jamais publier

`admin-essai.html` est une copie du tableau de bord avec Supabase désactivé.
Elle **ouvre le panneau sans mot de passe** — c'est le seul moyen de tester
l'administration sans identifiants. Elle est exclue de `.gitignore` et de
`.vercelignore`. Ne jamais la déployer.

---

## 8. Ce qui reste ouvert

1. **Les mentions légales des CGV sont vides** — forme juridique, siège, RCCM,
   NIF, e-mail. Seul élément juridiquement exigible qui manque. Il faut les
   vraies informations du commerçant :

   ```bash
   node configurer.mjs --forme "SARL" --adresse "…" --rccm "…" --nif "…" --email "…"
   ```

2. **Le catalogue en ligne est celui de démonstration** : treize produits,
   prix, stocks et photos d'exemple. Le client final n'a pas confirmé ce qu'il
   vend réellement — la question était posée et reste sans réponse. Les
   catégories, les axes (pointures ou tailles) et les photos en dépendent.

3. **La couleur d'action est du noir** (`--accent: #000000`). Le bouton
   d'achat a donc la couleur du texte, de la navigation et des filets : rien
   sur la page ne dit *appuie ici*. Une seule variable à changer. La palette
   noir et blanc est un choix assumé — c'est le standard des revendeurs
   multi-marques, parce qu'un site coloré se bat avec chaque photo produit et
   chaque logo — mais l'absence de point d'appui en est un effet secondaire,
   pas une intention.

4. **`brand.html`** est une page « Brand Kit » en anglais, sans rapport avec la
   boutique, arrivée dans le premier commit. Elle est publiquement accessible
   sur `/brand`. À supprimer.

---

## 9. Contrôles à repasser après toute modification

Sur la **production**, pas en local :

- Les cinq pages répondent : `/`, `/catalogue`, `/collection?c=<marque>`,
  `/produit?id=<produit>`, `/admin`.
- Aucun élément à `opacity: 0` au chargement ni après défilement.
- Les cartes produit ont toutes la même hauteur, en 375 px de large comme en
  1280.
- Aucune cible tactile sous 44 px.
- Aucun débordement horizontal.
- Une commande passe de bout en bout, et le message WhatsApp porte la marque
  devant le nom du modèle.
- Les commandes de test sont supprimées et le stock restitué.

Pour tester le tableau de bord sans identifiants : régénérer la copie hors
ligne, puis soumettre le formulaire de connexion — le mode local ouvre le
panneau sans mot de passe.

```bash
sed 's|<script src="supabase.config.js"></script>|<script>window.AURA_SUPA={enabled:false,url:"",anonKey:"",loginDomain:"test"};</script>|' admin.html > admin-essai.html
```

---

## 10. Documents compagnons

| Fichier | Pour qui |
|---|---|
| `GUIDE-ADMINISTRATION.md` | Le commerçant. Mode d'emploi complet, douze chapitres. |
| `GUIDE-VERCEL-SUPABASE.md` | Celui qui installe une nouvelle boutique. |
| `PLAN-MULTI-PRODUIT.md` | L'architecture multi-produits et son registre de risques. |
| `PROMPTS-VISUELS.md` | Les consignes de génération d'images. |
| `AUDIT-LIVRAISON.md`, `RECETTE.md` | État de la livraison et parcours de test. |
