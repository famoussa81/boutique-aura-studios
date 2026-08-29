# Journal de reprise — Boutique Aura Studios / T&K Shoes

Dernière mise à jour : 28 août 2026, correction `dashboard-live-link`.

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

### Correctif prioritaire — « Voir ma boutique » ouvre le fichier local

Signalement : depuis un dashboard ouvert comme fichier ou sur un serveur de
test, les liens relatifs `index.html` ouvrent la copie locale au lieu de la
boutique en production. Le flux attendu est
`/admin` → « Voir ma boutique » → domaine public dans un nouvel onglet.

Fichier envisagé : `admin.html` uniquement, plus ce journal. Risque : ne pas
casser les boutons d'aperçu, qui doivent au contraire rester sur la même
origine afin de partager le brouillon par `sessionStorage`. Le domaine public
sera écrit avec la valeur reconnue par `configurer.mjs`, afin qu'une boutique
revendue avec un autre domaine soit réécrite automatiquement.

État Git au début : `main` à `f111b49`; modifications documentaires non
commitées dans `JOURNAL-DE-REPRISE.md`, `IMAGE-BATCH-HANDOFF.md` et
`SPEC-order-product-image.md`; `design-qa.md` non suivi à préserver.

Statut : corrigé localement. Les deux liens « Voir ma boutique » utilisent le
domaine public reconnu par `configurer.mjs`, s'ouvrent dans un nouvel onglet
et ne touchent pas aux aperçus de brouillon. Vérification locale : les deux
ancres portent `https://boutique-aura-studios.vercel.app`, `target="_blank"`
et `rel="noopener"`, sans erreur console. Déploiement à consigner après push.

### Correctif ajouté — grille « Toutes les marques »

Le fond `#faf9f7` des cartes révélait les rectangles blancs intégrés aux PNG
Hermès, Balenciaga, Moncler et EA7. Moncler était en plus cadré sur la mauvaise
zone de sa capture. Correction purement CSS dans `boutique.css` : fusion
visuelle du blanc par `mix-blend-mode:multiply` et cadrages calculés à partir
des pixels réellement occupés. Aucun logo, monogramme ou texte de marque n'a
été généré, redessiné ou retouché.

Vérifications locales exécutées sur `/marques.html?demo=1` : bureau et 375 px,
Balenciaga/Moncler/EA7 visibles en entier, fonds uniformes, aucune erreur
console et aucun débordement horizontal (`clientWidth = scrollWidth = 360`).
Un premier contrôle après déploiement a montré que Moncler restait coupé au
breakpoint mobile ; l'offset mobile a été corrigé puis revalidé localement.
La révision CSS finale est `20260829s` sur les sept pages qui chargent la
feuille.

Mise en ligne terminée : commits `b2c5574` puis `dfe812d`, poussés sur `main`.
La production `/marques` répond 200 et sert bien `boutique.css?v=20260829s`.
Contrôle final en production à 375 px : fonds uniformes, Moncler entier,
Balenciaga et EA7 lisibles, aucune erreur console et aucun débordement. Le
lien public du dashboard avait déjà été déployé dans `9f04251` et a été
recontrôlé dans le HTML de production.

### Nouvelle tâche — génération des visuels d'une marque

L'utilisateur va fournir environ dix photos d'une nouvelle marque. Cette
session doit les inspecter visuellement, les classer du défaut le plus critique
au moins critique, puis régénérer les photos produit nécessaires et une
bannière de marque. L'intégration dans le code sera confiée à un autre agent.

Le registre de reprise dédié est `IMAGE-BATCH-HANDOFF.md`. Il doit recevoir
une ligne pour chaque source et une entrée complète après chaque génération.
À ce stade, aucune photo source de ce nouveau lot n'a encore été jointe et
aucune génération n'a été lancée.

Limites : ne jamais générer ou retoucher un logo, un monogramme ou un texte de
marque ; utiliser uniquement un logo officiel fourni séparément. Ne modifier
ni code, ni produit, ni prix, ni base, ni déploiement pendant ce lot. Les
sorties doivent rester versionnées jusqu'à validation et être remises au
prochain agent avec leurs chemins absolus.

La tâche `order-product-image` ci-dessous est suspendue avant implémentation :
sa spécification existe dans `SPEC-order-product-image.md`, mais les quatre
décisions listées à la fin de la session précédente n'ont pas encore reçu de
validation explicite complète. Aucun changement serveur relatif à cette
spécification n'a été appliqué.

### Nouvelle demande — photo exacte dans les commandes

Ajouter automatiquement à chaque ligne de commande la photo exacte du
coloris choisi, sans demander au commerçant de saisir une référence ni une
URL. La photo doit être visible dans le dashboard et son lien doit apparaître
dans le texte WhatsApp. La solution doit couvrir les produits créés depuis le
dashboard, les téléversements depuis un téléphone, les anciennes commandes,
les images remplacées et les échecs de téléversement.

État Git au début : branche `main`, HEAD `f111b49`, seul fichier non suivi
préexistant : `design-qa.md` (à préserver et ne pas inclure automatiquement).

Fichiers envisagés : `boutique.js`, `admin.html`, `supabase-client.js`,
éventuellement `supabase/schema.sql` si le contrat serveur doit être élargi,
une spécification dédiée, `RECETTE.md`, `GUIDE-ADMINISTRATION.md` et ce
journal.

Risques connus : ne jamais dépendre d'une URL locale `blob:`, ne pas perdre
la photo d'une ancienne commande après remplacement du produit, ne pas
exposer de bucket privé dans WhatsApp, ne pas créer de commande de production
pendant les tests et préserver la compatibilité avec les commandes sans
champ image.

Statut : spécification et audit du flux d'upload en cours ; aucun code produit
modifié à ce stade.

### Demande

Implémenter le module `merchandising` décrit dans
`SPEC-merchandising.md` après création de cette mémoire persistante.

Demande ajoutée pendant l'implémentation : garantir qu'une commande reste
parfaitement identifiable alors que le nom du modèle n'est plus affiché sur
les cartes publiques. Le nom existe toujours dans les données et dans la
commande ; le parcours doit aussi afficher une référence article stable avec
la marque, le modèle interne, le coloris et la pointure.

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
- parcours de commande et listes de commandes dans `admin.html` ;
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

### Mise en ligne

Commit `52514ba`, poussé sur `main`, déployé.

Vérifié sur la production après déploiement :

- Huit routes répondent 200, y compris `/admin` et `/collection?c=hermes`.
- L'écran est présent dans l'administration en ligne.
- `classerProduits()` et `resoudreVedettes()` sont dans le `boutique.js` servi.
- Catalogue du rayon Homme : 32 cartes, les trois premières sont exactement
  les vedettes configurées — Claquette Vintage Check, Mule Oblique,
  Claquette Paris. Les sélections d'avant la tâche sont donc préservées.
- Première paire épuisée en position 30 sur 32 : les disponibles passent bien
  devant.
- Aucune erreur console, aucune image cassée, aucun débordement horizontal.

### Surface réelle du classement de rayon

`hommes.html` et `femmes.html` n'ont pas de section « vedettes du rayon » :
`#audFeaturedGrid` n'existe pas dans ces pages, et
`renderAudienceExperience()` passe donc son chemin sans rien peindre.

L'ordre d'un rayon se voit aujourd'hui dans le catalogue filtré par rayon,
tri « Sélection boutique », et dans la rangée « Autres modèles ». Les quatre
vedettes d'un rayon n'ont, elles, aucune surface d'affichage propre. Le
classement par marque, lui, pilote bien les rangées de marque de l'accueil.

Décider avant de promettre cet écran au commerçant : soit ajouter une section
vedettes aux deux pages de rayon, soit reformuler l'écran pour dire que les
vedettes d'un rayon ordonnent le catalogue plutôt qu'une vitrine.

### Prochaine action sûre

Ouvrir l'écran en production avec les identifiants du propriétaire et refaire
les quatre gestes sur une vraie zone, puis publier. Les vérifications de
cette session ont été menées sur la copie hors ligne et le catalogue de
démonstration ; le parcours authentifié complet reste à faire.

### Complément — identification des articles commandés

Le nom masqué sur une carte publique n'a jamais été supprimé du produit : la
commande enregistrée garde l'identifiant, la marque, le modèle, la variante
et la quantité. Pour rendre la préparation impossible à confondre, chaque
article expose désormais une référence stable dérivée de son identifiant,
par exemple `ART-LV-SIGNATURE` :

- dans le récapitulatif avant commande ;
- dans le message WhatsApp ;
- dans les listes et détails des commandes du dashboard ;
- dans la liste Produits et son moteur de recherche.

Test local exécuté de bout en bout le 28 août 2026 : commande de
`Louis Vuitton Claquette Signature LV`, variante `39 · Bleu`. Le récapitulatif
et le texte WhatsApp contenaient tous deux `ART-LV-SIGNATURE`, la marque, le
modèle et la variante. Le lien WhatsApp n'a pas été ouvert et aucun message
n'a été envoyé.

Correction fonctionnelle commitée sous `394e572`, poussée sur `main` et
déployée sur Vercel. En production, les sept routes principales ont répondu
200. À 375 px, la fiche ne déborde pas (`clientWidth = scrollWidth = 375`) et
le récapitulatif avant envoi affiche bien le modèle complet,
`ART-LV-SIGNATURE`, `39 · Bleu`, la quantité et le prix. La soumission n'a pas
été déclenchée en production afin de ne pas créer une fausse commande ni
réserver du stock réel.

## Points encore ouverts hors tâche

- Mentions légales réelles manquantes : forme juridique, siège, RCCM, NIF et
  e-mail.
- Le catalogue reste présenté comme démonstration dans les documents tant que
  le client final n'a pas confirmé l'offre réelle complète.
- La protection Supabase contre les mots de passe compromis était désactivée
  lors du dernier audit.
- Le parcours administrateur authentifié complet en production demande les
  identifiants du propriétaire.
