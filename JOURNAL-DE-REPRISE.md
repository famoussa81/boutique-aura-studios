# Journal de reprise — Boutique Aura Studios / T&K Shoes

Dernière mise à jour : 28 août 2026, fin de la tâche `merchandising`.

## Protocole obligatoire pour chaque agent

Au début de chaque tâche :

1. Lire `AGENTS.md`, ce journal, la spécification active et `git status`.
2. Ajouter ou actualiser la section « Tâche en cours » avant de modifier le
   code.
3. Préserver les changements non liés appartenant à l'utilisateur.
4. À la fin, consigner les fichiers touchés, les vérifications réellement
   exécutées, le commit, le déploiement et les risques restants.

Ce fichier est la mémoire persistante du projet. Les conversations ou la
mémoire d'un modèle peuvent disparaître ; ce fichier doit suffire au prochain
agent pour continuer proprement.

## Repères permanents

- Dossier : `C:\Users\PC\Downloads\Nike`
- Dépôt : `https://github.com/famoussa81/boutique-aura-studios`
- Production : `https://boutique-aura-studios.vercel.app`
- Branche de déploiement : `main`, Vercel se déploie après `git push`.
- Supabase : projet `vgzvavlmmqbxtuhanaqj`.
- Application statique : aucun build ; `admin.html` contient l'essentiel du
  dashboard, `boutique.js` la logique publique commune.
- Ne jamais publier `admin-essai.html`.
- Vérification finale sur la production ; le serveur local a déjà produit des
  faux négatifs de fichiers tronqués et de types MIME incorrects.

## Intention du produit

La boutique est destinée à être revendue à des commerçants maliens. Le
dashboard doit être compréhensible par une personne non technicienne et rester
complet sur téléphone, même si un MacBook est disponible. Le commerçant modifie
le contenu, jamais le design. Les commandes passent par WhatsApp et le paiement
se fait à la livraison.

## Historique consolidé des sessions

### Visuels produit

- Plusieurs séries d'images produit ont été nettoyées ou remplacées : Louis
  Vuitton, Hermès Homme et Femme, Dior, Calvin Klein, Burberry, Givenchy,
  HUGO et EA7.
- Les photos produit visées utilisent un fond blanc, un cadrage homogène et une
  paire complète quand le produit se vend par paire.
- Les photos contenant volontairement une boîte, un carton ou un sac doivent
  être préservées.
- Les noms et extensions des fichiers remplacés ont été conservés pour ne pas
  casser les cartes, miniatures et galeries.
- Une table de correction dans `boutique.js` rattache encore certaines anciennes
  références d'images aux nouveaux fichiers. Ne pas la supprimer sans audit.

### Boutique mobile

- Plusieurs débordements horizontaux ont été corrigés, notamment le panier
  fermé qui élargissait la page sur iPhone et le glissement latéral général.
- Les cartes produit et diverses sections mobiles ont été resserrées sans
  réintroduire les noms de modèles volontairement retirés par l'utilisateur.
- Les délais ne doivent plus promettre 48 heures : l'univers Homme indique
  environ 5 jours et Femme environ 10 jours selon les réglages.
- La priorité reste le téléphone modeste et l'économie de données.

### Disponibilité et variantes

- Le produit Calvin Klein montré par l'utilisateur est entièrement épuisé.
- Certaines couleurs HUGO et Burberry sont épuisées alors que les autres
  couleurs restent disponibles.
- La boutique sélectionne automatiquement la prochaine couleur disponible,
  sans masquer l'option épuisée ; cette option porte un état « rupture de
  stock » lorsqu'elle est choisie.
- Les variantes historiques `sizes` restent compatibles avec le modèle actuel
  `variants`. Ne jamais supprimer la normalisation ascendante.
- `place_order(payload jsonb)` reste la seule écriture de commande : prix relu
  côté serveur, réservation atomique du stock et marque dérivée du produit.

### Dashboard et synchronisation

- La fondation du dashboard a été spécifiée dans
  `SPEC-admin-foundation.md`, avec une carte globale dans
  `CAPABILITY-MAP-ADMIN.md`.
- Le dashboard existant possède déjà produits, commandes, stocks, variantes,
  contenus, rayons, marques, catégories, brouillons, publication et aperçu,
  mais plusieurs fonctions restent dispersées.
- Un incident critique a été corrigé : un brouillon distant propre ne doit pas
  remplacer les 50 produits en ligne par une ancienne copie de 38 produits.
  `dbLoadAll()` rafraîchit désormais un brouillon propre depuis les données
  publiées avant de le sauvegarder.
- La production avait ensuite un brouillon synchronisé à 50/50 produits,
  réglages identiques, version 45 et `dirty=false`.
- Vérifications transactionnelles déjà réalisées puis annulées : prix
  38 000→38 001, publication du prix, mise à jour du stock et visibilité.
  La production est restée à 38 000 et le produit visible.
- Le mode local `?demo=1` a permis d'ouvrir le dashboard sans identifiants ; la
  modification guidée d'un prix a produit l'état « À publier » sans erreur
  console.
- L'interface de connexion `/admin` en production charge sans erreur console,
  mais le parcours authentifié complet n'a pas été exécuté faute d'identifiants.

### Classement éditorial existant

- Les sélections actuelles utilisent
  `audiencePages.homme|femme.featuredProducts` pour les rayons et
  `collections[].homeProducts` pour les marques.
- Le site public utilise déjà partiellement ces listes pour les quatre produits
  mis en avant et le tri « Recommandés ».
- Les fonctions sont dispersées entre « Rayons Homme et Femme » et l'éditeur
  de chaque marque. Elles ne constituent pas encore un module autonome de
  classement complet.
- Dernières sélections connues en production :
  - Homme : `bb-check`, `dr-oblique`, `gv-paris`, `ferragamo-gancini`.
  - Louis Vuitton : `lv-signature`, `lv-relief`, `lv-v-croisee`, `lv-damier`.
  - Calvin Klein : `ck-double-bride`, `ck-jeans`, `ck-band`, `ck-pool`.
  - HUGO : `hg-red`, `hg-mono`.
  - Hermès : `hermes-chypre`, `hermes-chypre-bordeaux`,
    `hermes-chypre-vives`, `hermes-chypre-daim`.

### Déploiements récents

- `f2c2ee9` — rafraîchissement des brouillons administrateur propres.
- `6e8bd84` — restauration du rendu des grilles de merchandising.
- `024c8cf` — actualisation du cache des ressources boutique.
- `c570a0f` — priorité donnée aux meilleurs visuels produit.
- `8e73b95` — remplacement automatique des couleurs épuisées.
- `f8e82f3` — amélioration de l'expérience mobile.
- `d060c7b` — images produit et arrêt du glissement mobile.
- `1ec9ddd` — affichage de paires complètes.

## Décisions de conception à préserver

- « Collection » est un nom interne ; l'interface dit toujours « marque ».
- Quatre vedettes maximum par rayon ou marque.
- Une vedette est un choix éditorial. Ne jamais la qualifier automatiquement de
  « populaire » ou de « meilleure vente » sans données réelles.
- Les produits disponibles passent avant les produits totalement épuisés ; les
  produits épuisés restent visibles.
- Les badges « Nouveau », promotions, avis et notes ne sont jamais inventés.
- Les actions mobiles ont une cible tactile minimale de 44 × 44 px.
- Les changements de contenu restent en brouillon jusqu'à publication ; stock
  et visibilité gardent leur comportement immédiat existant.
- `saveStore()` est la source unique de synchronisation des réglages. Ne pas
  disperser de nouveaux appels à `syncSettings()`.
- Une table de correspondance lue tôt doit être déclarée dans la fonction qui
  l'utilise, jamais en `var` de module lu avant affectation.

## État Git au début de la tâche actuelle

Branche `main`. Dernier commit connu : `f2c2ee9`.

Fichiers non suivis présents avant l'implémentation :

- `CAPABILITY-MAP-ADMIN.md`
- `SPEC-admin-foundation.md`
- `SPEC-merchandising.md`
- `design-qa.md`
- `tasks/`

Ces fichiers appartiennent au travail en cours. Ne pas supprimer
`design-qa.md` et ne pas l'inclure automatiquement dans un commit sans l'avoir
revu.

## Tâche en cours

### Demande

Implémenter le module `merchandising` décrit dans
`SPEC-merchandising.md` après création de cette mémoire persistante.

### Résultat attendu

- Un écran autonome « Classement et vedettes » dans le dashboard.
- Choix d'une zone : rayon Homme, rayon Femme ou marque.
- Ordre complet des produits par zone.
- Quatre vedettes maximum, ordonnées séparément.
- Commandes mobiles « Monter », « Descendre » et « Mettre en premier ».
- Produits épuisés signalés ; remplacement public automatique d'une vedette
  indisponible sans perdre sa configuration.
- Brouillon, aperçu et publication utilisant les mécanismes existants.
- Même ordre sur accueil, rayons, marques et catalogue en tri « Recommandés ».

### Fichiers envisagés

- `admin.html`
- `boutique.js`
- `catalog.js` seulement si une valeur initiale est réellement nécessaire.
- `tasks/plan.md`, `tasks/todo.md`
- `RECETTE.md`, `GUIDE-ADMINISTRATION.md`
- ce journal à la fin de la tâche.

### Risques actifs

- `admin.html` est monolithique : contrôler la syntaxe après chaque tranche.
- Ne pas purger une vedette simplement épuisée ; elle doit revenir après
  réapprovisionnement.
- Ne pas créer une deuxième logique de tri divergente entre les pages.
- Ne pas toucher au schéma Supabase : les listes vivent dans le JSON de
  réglages existant.
- Préserver les sélections de vedettes déjà en production.

### Statut

Terminé côté code et vérifications locales. Le module a été écrit lors de la
session précédente puis laissé sans test, sans commit et sans déploiement.
Cette session l'a repris, éprouvé, documenté et mis en ligne.

### Ce qui a été vérifié, et comment

Sur la copie hors ligne `admin-essai.html`, catalogue de démonstration,
panneau déverrouillé en mode local. Le détail chiffré est dans
`tasks/todo.md`.

Les quatre gestes de classement, l'annulation, la mise en vedette et son
retrait, la limite de quatre, la recherche, le changement de zone, la
persistance après rechargement et l'aperçu répondent tous correctement. À
375 px, aucune cible ne descend sous 44 px et rien ne déborde
horizontalement. La syntaxe des deux blocs de script d'`admin.html` est
valide.

Rien n'atteint la boutique avant publication : l'état passe à « À publier »
et y reste tant que le commerçant n'a pas publié.

### Fausse piste consignée

La comparaison `p.audience === key` du module paraissait fragile : 28 des 46
produits actifs n'ont pas de champ `audience` en base. `normalizeProduct()`
le pose au chargement — tout ce qui n'est pas « femme » devient « homme » —
donc la comparaison est sûre. Ne pas « corriger » ce point sans relire cette
fonction.

### Écart de comportement à connaître

`resoudreVedettes()` complète toujours jusqu'à quatre vedettes. Un
commerçant qui n'en choisit que deux en verra quatre sur la boutique, les
deux suivantes venant de l'ordre complet. C'est conforme au plan
(`tasks/plan.md`, point 3) et cela évite un trou dans la grille, mais ce
n'est pas ce qu'une lecture rapide de l'écran laisse deviner.

## Points encore ouverts hors tâche

- Mentions légales réelles manquantes : forme juridique, siège, RCCM, NIF et
  e-mail.
- Le catalogue reste présenté comme démonstration dans les documents tant que
  le client final n'a pas confirmé l'offre réelle complète.
- La protection Supabase contre les mots de passe compromis était désactivée
  lors du dernier audit.
- Le parcours administrateur authentifié complet en production demande les
  identifiants du propriétaire.
