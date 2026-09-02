# Journal de reprise — Boutique Aura Studios / T&K Shoes

Dernière mise à jour : 30 août 2026, Coach en ligne après correction d'un
archivage accidentel (détail plus bas).

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

Le dossier `C:\\Users\\PC\\Downloads\\Telegram Desktop` contient 42 photos
reçues le 29 août, vraisemblablement de la marque Coach. Demande actualisée :
identifier les modèles, réunir les coloris d'un même modèle, choisir la photo
de couverture la plus soignée, régénérer seulement les visuels insuffisants,
puis ajouter les produits, leur marque, leurs coloris et leurs emplacements
Homme/Femme dans la boutique et le dashboard. Les produits unisexes pourront
être classés Homme tout en restant identifiés comme pertinents pour tous.

Demande précisée : ajouter aussi des prix et stocks fictifs de démonstration,
placer les modèles Coach les plus esthétiques en vedettes, et régénérer les
visuels insuffisants. Les photos produit portent des monogrammes Coach : les
sorties produit seront donc recréées par cadrage/composition non générative
des pixels source, afin de préserver exactement leurs marquages. ImageGen est
autorisé uniquement pour une bannière sans texte, logo ou monogramme.

Résultat local : quatre modèles Femme Coach ont été ajoutés à la graine du
catalogue, pour dix coloris et des prix de démonstration (42 000, 40 000,
38 000, 36 000 FCFA). Les tailles 36–41 et stocks de démonstration sont
présents. La Mule Boucle Signature puis la Claquette Matelassée C sont les
deux premières vedettes Femme et les premières de la marque. Dix photos
produit réelles ont été recadrées en 1200×1600 avec leurs miniatures ; la
bannière sans logo/texte est `assets/brand-banners/coach.jpg` en 1920×600.
Tests exécutés : syntaxe `catalog.js`, structure des quatre fiches, ordre des
vedettes, existence des vingt miniatures et dimensions de chaque visuel.

Limite à ne pas masquer : la production lit les produits depuis Supabase, pas
la graine `catalog.js`. La synchronisation de ces quatre fiches dans la base
demande une session administrateur authentifiée, puis la publication du
brouillon ; aucun contournement de cette protection ne doit être introduit.

Mise en ligne des fichiers terminée : commit `d3f9e04` poussé sur `main`.
Vérification production effectuée : accueil, `catalog.js?v=20260829coach`,
bannière Coach et photo de la Mule Boucle Signature répondent tous 200. Les
fiches ne sont pas encore visibles au public tant que la base Supabase n'a pas
reçu le brouillon Coach depuis une session administrateur.

État Git au début : `main` à `336e934`, seul fichier non suivi préexistant
`design-qa.md` à préserver. Fichiers pressentis : dossier source externe,
`assets/`, `catalog.js`, réglages de marques/catalogue si nécessaire,
documentation de reprise et ce journal. Risques : ne jamais inventer ou
retoucher les logos/marques, ne pas confondre couleurs et modèles, ne pas
écraser les sources reçues, et vérifier la synchronisation dashboard après
l'intégration.

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

## Session du 29 août 2026 — intégration Coach (en cours)

Demande : ajouter rapidement la marque Coach et ses produits depuis le
dashboard, avec prix fictifs et mise en avant. Le dépôt est propre à
l'exception de `design-qa.md`, non suivi et hors sujet : ne pas le modifier.

État réel : les images Coach, le catalogue de secours et la bannière sont déjà
dans Git (`d3f9e04`, déployé). La boutique publique charge toutefois les
données Supabase : la vraie intégration doit donc passer par le dashboard
authentifié et rester en brouillon jusqu'au clic explicite sur « Publier ».
La marque Coach a été ajoutée au brouillon avec son accroche/sa description ;
la première fiche « Mule Boucle Signature » était en cours de création quand
la session d'administration a été interrompue. Ne pas déclarer les produits
ni les couleurs publiés sans vérification dans le dashboard.

Risques : ne pas écraser `design-qa.md`, ne pas abandonner un assistant
d'ajout sans vérifier son état, et demander une confirmation immédiate avant
la publication publique.

Résultat de cette reprise : les visuels Coach complets, leurs miniatures et la
bannière existent déjà dans le dépôt. Un passage de relais autonome a été
créé dans `COACH-INTEGRATION-HANDOFF.md`; il liste les quatre produits, les
dix variantes, les prix fictifs, le stock de départ et l'ordre à appliquer.
La session dashboard reste en brouillon (« À publier ») ; aucune publication
supplémentaire n'a été effectuée pendant cette reprise.

Prochaine action sûre : un agent connecté au dashboard crée les quatre fiches
depuis ce fichier, associe les variantes puis demande confirmation juste avant
« Publier ».

## Session du 29 août 2026 — vérification dashboard + intégration Coach en base

**Vérification du tableau de bord** : passage systématique de tous les
écrans (commandes, produits, classement/vedettes, rayons, réglages,
catalogue, etc.) avec de vraies données de production (export via
`service_role`, jamais écrites dans Supabase — copie hors ligne
`admin-essai.html`, supprimée après usage). Filtres commandes et produits,
recherche insensible aux accents, module Classement et vedettes (jamais
testé avant ce jour : changement de zone, recherche, vedette on/off avec
plafond de 4, réordonnancement, annulation) — tout conforme. Assistant
produit 4 étapes ouvert sur un vrai produit Dior, aucune erreur. Zéro erreur
console sur tout le parcours. Non testé : les actions qui écrivent
directement dans Supabase (masquer/archiver/stock) — nécessitent une vraie
session authentifiée, hors de portée sans les identifiants du propriétaire.

**Intégration Coach** : le propriétaire a demandé d'avancer sans attendre une
session dashboard authentifiée. Un mot de passe a été communiqué dans le
chat pour se connecter au dashboard ; refusé — entrer un mot de passe dans un
formulaire de connexion reste une action interdite quel que soit
l'interlocuteur, y compris le propriétaire du site sur son propre site.
Le mot de passe a été signalé comme à changer par précaution puisqu'il a été
tapé en clair dans la conversation.

À la place, écriture directe via la clé `service_role` (confirmation
explicite de l'utilisateur obtenue avant chaque écriture, l'auto-mode ayant
lui-même bloqué la première tentative de chaque table) :

- 4 lignes ajoutées à `products` : `coach-mule-boucle` (42 000 FCFA, Marron/
  Argent/Ivoire), `coach-matelassee` (40 000 FCFA, Bleu/Ivoire/Noir/Marron/
  Rose), `coach-signature` (38 000 FCFA, Marron), `coach-badge` (36 000 FCFA,
  Beige). Toutes `active:false` — invisibles côté public, vérifié après
  écriture. Pointures 36-41, stock fictif par pointure (2,3,4,4,3,2) repris
  du dossier de passage de relais. `desc` laissé vide à dessein : le dossier
  interdit d'inventer du texte de marque Coach, et aucune description par
  produit n'y était fournie — au propriétaire de l'écrire avant publication.
- Entrée `coach` ajoutée à `settings.data.collections` (accroche « Signature
  C », description reprise mot pour mot du dossier, bannière
  `assets/brand-banners/coach.jpg` déjà présente dans le dépôt). Aucun logo
  Coach : volontaire, conforme au dossier. Les 14 marques existantes
  vérifiées intactes après écriture.

Rien de tout cela n'est visible sur la boutique publique (tous les produits
inactifs, la marque Coach sans produit actif n'apparaît pas dans le
répertoire des marques). Placement en vedette du rayon Femme (étape 4 du
dossier) non fait : nécessite le module Classement et vedettes en session
authentifiée, pas une écriture directe.

**Prochaine action sûre** : le propriétaire se connecte au dashboard,
vérifie les 4 fiches Coach (prix fictifs à confirmer/remplacer, stock réel à
saisir), les active une par une, les place dans le classement du rayon
Femme si souhaité, puis publie. Voir `COACH-INTEGRATION-HANDOFF.md` pour le
détail déjà consigné.

### Incident du 30 août 2026 — écriture directe archivée par une publication

Le propriétaire a publié depuis le dashboard peu après l'écriture directe
ci-dessus ; les 4 produits Coach ont disparu du site.

**Cause exacte** : `publish_store` (`supabase/schema.sql:409-415`) traite le
brouillon (`admin_drafts`) comme la liste complète et définitive de la
boutique — tout produit vivant en base mais absent de la liste du brouillon
publié est automatiquement mis `active:false, archived:true`. Les 4 produits
Coach avaient été insérés directement dans `products` par `service_role`,
donc jamais entrés dans le brouillon du commerçant : la première publication,
même pour un autre motif, les a archivés. Même mécanisme côté `settings` :
`publish_store` écrase entièrement `settings.data` avec le contenu du
brouillon (pas de fusion) — le brouillon du commerçant portait une version
plus ancienne et partielle de la collection `coach` (`key/desc/label/tagline`
seulement, héritée d'une session Codex antérieure interrompue), qui a donc
effacé `cover/accent/featured/homeProducts` que j'avais ajoutés.

**Leçon pour la suite** : ne plus jamais écrire un produit ou un réglage
directement dans `products`/`settings` en base sans passer par le brouillon
(`admin_drafts`) — toute écriture directe est détruite par la publication
suivante, quel que soit son motif. Le contournement du dashboard n'est donc
plus une option pour ce genre d'ajout ; seule une session authentifiée réelle
(ou une écriture directe dans `admin_drafts.data`, jamais tentée dans cette
session) respecte le contrat de `publish_store`.

**Correction appliquée** : les 4 produits remis `active:true, archived:false`
et la collection `coach` restaurée avec ses champs complets, toujours par
écriture directe `service_role` (confirmation explicite obtenue). Vérifié en
production : `collection.html?c=coach` affiche les 4 modèles, prix corrects,
bannière et description affichées, zéro erreur console.

Comme `publish_store` avait mis le brouillon `dirty=false` lors de la
publication accidentelle, le prochain chargement du dashboard le traite comme
« propre » et le resynchronise depuis les données vivantes (`dbLoadAll`,
`admin.html:967-977`) — donc la correction tient sans action du commerçant,
à condition qu'il recharge le tableau de bord avant sa prochaine modification
ou publication. Ne pas supposer que ce délai de grâce existe pour toute
correction future : il tient spécifiquement au fait que le brouillon n'a pas
été touché depuis.

### Session du 30 août 2026 — reprise complète des visuels Coach (terminée)

Demande : réexaminer les 42 photos Telegram, dédoublonner, retenir tous les
modèles, homogénéiser les visuels et intégrer bannière/logo réel/produits sans
publier. Fichiers visés : nouveaux actifs sous `assets/products/`, miniatures,
bannière et données de catalogue; le tri doit être consigné dans le passage de
relais. Risques connus : ne jamais générer ni retoucher un monogramme/logo;
ne pas intégrer une paire fictive depuis une seule chaussure sans une source
fiable; ne plus écrire les données vivantes sans synchroniser le brouillon.

Tri réalisé : 42 fichiers Telegram représentent sept familles, dont quatre
modèles Femme déjà actifs avec une paire fiable. Trois familles restent à
valider : double bride rose (Femme), slide signature (Homme/unisexe), sabot à
boucle (Homme/unisexe). Seul le slide noir possède une paire source ; son
visuel propre 1200 × 1600 et ses miniatures ont été préparés, sans IA ni
retouche des marquages. Les autres images à chaussure seule ne sont pas
transformées en fausse paire. Le fichier `COACH-INTEGRATION-HANDOFF.md` porte
désormais ce tri et les prochaines décisions nécessaires.

Résultat : logo officiel Coach conservé à l'identique dans
`assets/logos/coach.svg` et référencé par le catalogue de secours ; bannière
Coach déjà existante conservée ; image de paire noire nettoyée par traitement
déterministe du fond seul et contrôlée visuellement. Aucun produit ni réglage
Supabase n'a été écrit, aucune publication n'a été lancée. Contrôles passés :
image `1200 × 1600`, contrôle visuel, `git diff --check`. Prochaine action
sûre : le propriétaire choisit le rayon et le prix du slide noir, puis ajoute
ce produit depuis le dashboard avant publication ; demander une vraie photo
de paire pour double bride rose et sabot à boucle.

### Session du 30 août 2026 — ajout Coach demandé (terminée)

Demande : ajouter maintenant les éléments Coach préparés. Fichiers concernés :
le brouillon administrateur Supabase, le produit Slide Signature Noir et les
réglages Coach. Risque critique : écrire directement dans `products` ou
`settings` sera annulé par la prochaine publication ; utiliser exclusivement
la session dashboard authentifiée et le brouillon, puis vérifier avant tout
clic de publication.

Le passage manuel par l'interface a été abandonné à la demande du propriétaire.
Décision : intégrer directement dans le code et le brouillon Supabase, sans
publier. La nouvelle fiche doit rester masquée, avec prix et stock à zéro,
pour empêcher toute vente avant saisie des vraies valeurs.

Résultat : commit `4b222df` poussé sur `main`; logo, bannière et photo du
slide répondent tous en HTTP 200 sur Vercel. Le brouillon Supabase a été mis à
jour directement de la version 225 à 226 : 55 produits, `dirty=true`, Coach
mis en avant, logo officiel et bannière liés. La fiche
`coach-slide-signature-noir` est présente dans le brouillon comme produit
Homme, masqué, prix 0 et stock 0. Aucune publication Supabase effectuée.
Contrôle SQL : aucun slide noir dans les produits publics et quatre produits
Coach actifs inchangés. Prochaine action sûre : saisir prix et stock réels
dans le dashboard, afficher la fiche, vérifier l'aperçu puis publier.

### Session du 30 août 2026 — génération des paires Coach manquantes (terminée)

Demande : générer maintenant les paires complètes absentes à partir des photos
Telegram à chaussure seule. Sources visées : double bride rose, variantes du
slide signature et sabots à boucle. Sorties prévues : photos produit 3:4 sur
fond blanc et miniatures correspondantes. Risques : conserver exactement
forme, coloris, matières et marquages visibles ; rejeter toute génération qui
déforme ou invente un logo/monogramme. Aucun produit ne sera publié avant
contrôle visuel.

Résultat : huit paires générées avec l'outil intégré ImageGen à partir des
photos 26, 27, 35, 36, 38, 39, 40 et 42, puis contrôlées visuellement et
normalisées en JPEG `1200 × 1600`, fond blanc pur. Cela couvre trois sabots,
quatre nouveaux coloris de slide et la double bride rose ; 24 fichiers produit
et miniatures ont été ajoutés. Commit `2645d2c` poussé sur `main`; les huit
URL répondent HTTP 200. Brouillon Supabase passé de la version 226 à 227, avec
57 produits et trois fiches Coach masquées (`price=0`, stock nul). Vérification
SQL : aucune de ces trois fiches n'est encore publique. Prochaine action sûre :
le propriétaire saisit vrais prix et stocks, contrôle l'aperçu, active les
fiches puis publie.

### Session du 30 août 2026 — reprise premium des 10 visuels Coach Femme (terminée)

Demande : corriger les cadres gris visibles, angles divergents, inclinaisons
et rendu non premium des quatre cartes Coach Femme déjà publiques. Fichiers
visés : les dix `assets/products/femme/coach-*-studio.jpg` existants et leurs
miniatures. Méthode : édition ImageGen depuis chaque vraie paire, même vue
studio trois-quarts, même échelle, fond #FFFFFF sans rectangle. Risques : ne
pas changer modèle, coloris, monogramme, boucle ni texte Coach ; contrôler
chaque résultat avant écrasement et ne pas publier un visuel rejeté.

Résultat : dix éditions ImageGen retenues puis normalisées en JPEG progressif
`1200 × 1600`, avec blanc pur aux quatre coins, ombre légère et vue studio
cohérente. De nouveaux noms `coach-*-premium.jpg` ont été employés pour éviter
le cache des anciennes photos ; les 10 fichiers produit et leurs 20 miniatures
carte/coloris ont été ajoutés. `catalog.js`, les quatre produits Coach publics
et les mêmes produits dans `admin_drafts` utilisent ces nouveaux chemins.
Le brouillon est passé de la version 227 à 228, sans modifier prix, stock ni
statut. Commit `412bcd5` poussé sur `main`. Contrôles réussis : syntaxe JS,
`git diff --check`, dimensions/couleurs de coin, URL de production HTTP 200,
chargement réel des quatre cartes à 1200 px, rendu desktop et mobile sans cadre
interne ni débordement horizontal (`375/375`). Prochaine action sûre : aucune ;
recharger la page si un ancien onglet conserve encore son propre cache.

- Mentions légales réelles manquantes : forme juridique, siège, RCCM, NIF et
  e-mail.
- Le catalogue reste présenté comme démonstration dans les documents tant que
  le client final n'a pas confirmé l'offre réelle complète.
- La protection Supabase contre les mots de passe compromis était désactivée
  lors du dernier audit.
- Le parcours administrateur authentifié complet en production demande les
  identifiants du propriétaire.

### Session du 31 août 2026 — cohérence rayons, marques et filtres (terminée)

Demande : corriger les pages de marque qui mélangent Homme/Femme, les
bannières Coach/Hermès inadaptées au rayon, le filtre Homme du catalogue qui
retourne de mauvaises marques, et l'absence de regroupement « autres marques ».
État Git au départ : `main`, seul `design-qa.md` est non suivi et appartient à
l'utilisateur. Fichiers envisagés : `boutique.js`, `catalog.js`, réglages du
brouillon Supabase si nécessaire. Risques : conserver le catalogue complet
sur `/catalogue`, ne pas masquer une marque qui possède des produits actifs,
ne modifier aucun prix, stock ou statut produit, et ne pas publier le brouillon
global par erreur.

Résultat : les liens Marques/Catalogue gardent désormais le rayon d'origine,
le répertoire affiche seulement les marques du rayon et les pages de marque
refusent une combinaison sans produit (ex. Coach Homme). Les marques mixtes
utilisent une bannière issue du bon rayon ; les suggestions et le fil d'Ariane
des fiches ne mélangent plus Homme/Femme. Birkenstock a été ajouté comme marque
au produit et aux réglages public + brouillon, sans toucher au prix, stock ou
statut et sans publier le brouillon ; version passée de 228 à 230. Commit
`f7d64f5` poussé sur `main`. Contrôles production réussis : Homme mène à
`/marques?audience=homme` sans Coach ; Femme mène aux quatre marques Hermès,
Dior, Coach et Birkenstock ; Hermès emploie deux bannières différentes selon
le rayon ; Coach Homme redirige vers les marques Homme ; catalogues Homme/Femme
montrent respectivement 31 et 17 produits sans mélange ; aucun débordement à
1280 px ni élément bloqué à `opacity:0`. `node --check` et `git diff --check`
réussis. Le changement local de numéro WhatsApp dans `catalog.js` et
`design-qa.md` non suivi ont été laissés intacts. Prochaine action sûre : aucune
pour ce bug ; tester à nouveau après toute future activation de produits Coach
Homme.

### Session du 31 août 2026 — vérification des mules et sabots Coach (terminée)

Demande : confirmer si le lot Telegram contenait aussi des mules et des sabots,
et préciser leur état réel après l'intégration Coach. Contrôle prévu : fichiers
générés, catalogue de secours et brouillon Supabase. Aucun fichier produit,
prix, stock, statut ou réglage ne doit être modifié pendant cette vérification.

Résultat : le lot contenait bien une Mule Boucle Signature Femme déjà publique
(3 coloris), un Sabot Boucle Signature Homme (3 coloris) et une Sandale Double
Bride Rose Femme. Le sabot et la double bride existent dans le brouillon 228,
mais restent volontairement masqués avec prix 0 et stock nul ; le Slide
Signature Homme est dans le même état. Contrôle Supabase effectué en lecture
seule, sans modification. Prochaine action sûre : saisir les prix et stocks
réels, puis activer et publier les fiches masquées depuis le dashboard.

### Session du 31 août 2026 — aperçu public des Coach masqués (terminée)

Demande : rendre visibles les trois fiches Coach jusqu'ici masquées, avec des
prix fictifs, afin de contrôler leur rendu sur la boutique. État Git au départ :
`main`, changement local utilisateur dans `catalog.js` et `design-qa.md` non
suivi. Portée : Supabase public + brouillon admin uniquement. Risques : ne pas
écraser le brouillon 230, garder les variantes et images existantes, et annoncer
clairement que les prix sont fictifs avant toute vente réelle.

Résultat : les trois produits sont désormais publics et synchronisés avec le
brouillon 231 : Sabot Boucle Signature Homme à 32 000 FCFA, Slide Signature
Homme à 27 000 FCFA et Sandale Double Bride Femme à 30 000 FCFA. Chaque
variante a un stock d'aperçu de 2. Les images, coloris et autres fiches n'ont
pas été modifiés. Contrôles SQL réussis : 3/3 fiches publiques, actives, prix
strictement positifs et stock minimal 2. Attention : ces trois prix et stocks
sont explicitement fictifs ; les remplacer avant toute vente réelle. Aucun
fichier de code n'a été modifié. Prochaine action sûre : recharger Homme/Femme
pour examiner les cartes et corriger les vrais prix depuis le dashboard.

### Session du 31 août 2026 — audit du nouveau lot Telegram Homme (terminée)

Demande : analyser le dossier `C:\Users\PC\Downloads\Telegram Desktop`,
détecter toutes les paires Homme, doublons et produits déjà présents, puis
générer des vues studio cohérentes pour les nouveautés. État Git : `main`,
changement utilisateur local dans `catalog.js` et `design-qa.md` non suivi.
Risque principal : ne pas régénérer inutilement une paire déjà validée ni
altérer logos, monogrammes, inscriptions ou détails existants.

Résultat : les 42 fichiers sont le lot Coach déjà traité les 29–30 août, pas
un nouveau lot Homme distinct. Le contact visuel confirme les paires Coach ;
il comporte aussi des doublons binaires exacts (8/15, 5/7, 9/12, 30/32/34).
Les visuels studio correspondants existent déjà dans
`assets/products/femme/coach-*-premium.jpg` et
`assets/products/coach-*-studio.jpg` : mules Femme, claquettes Femme, sabots
Homme, slides Homme et double bride Femme. Aucune génération, écriture de
donnée ou intégration supplémentaire n'est nécessaire ni justifiée pour ce
dossier. Prochaine action sûre : fournir le véritable nouveau lot Homme dans
un autre dossier ou avec des noms de fichiers différents.

### Session du 31 août 2026 — nouveau lot Homme Telegram (déployé, brouillon en attente)

Demande : traiter le lot ajouté après l'audit précédent dans
`C:\Users\PC\Downloads\Telegram Desktop` : identifier modèles, doublons,
marques déjà présentes et créer des photos studio homogènes pour les vraies
nouveautés Homme. État Git : `main`, seul le changement utilisateur local
`catalog.js` et `design-qa.md` non suivi sont hors portée. Fichiers envisagés :
nouveaux assets produit et registre d'intégration. Risques : ne pas confondre
les anciennes sources Coach du 29 août avec les nouvelles photos du 31 août,
ni modifier/recréer logos, monogrammes ou textes de marque.

Résultat au 31 août : 37 nouvelles photos détectées (Diesel, Gucci, Calvin
Klein, Burberry, HUGO, Dior, Fendi et autres), distinctes de l'ancien lot
Coach. Les visuels studio ont été produits ; deux sorties signalées par
l'utilisateur ont été reprises : papier intérieur supprimé sur Burberry vert
et Diesel argent entièrement régénéré. Le HUGO typographique bleu/blanc est
repris une seconde fois depuis la source 24 pour restaurer le motif et le petit
anneau métallique arrière sans disque erroné sur la semelle. Les 41 WebP
retenus sont en 1200 × 1600, fond blanc aux quatre coins. Treize nouvelles
fiches et cinq fiches enrichies sont intégrées au catalogue de secours ; aucun
ID, fichier, coloris ou rattachement de marque ne manque. Commit `fa858b8`
poussé sur `main`, déploiement Vercel confirmé. Le numéro WhatsApp modifié par
l'utilisateur a été préservé.

Correction visuelle complémentaire terminée : l'anneau visible derrière la
chaussure dans la source 24 appartient à la boîte, pas au produit. Le retirer
des deux chaussures HUGO sans toucher au motif, à l'angle ni au fond. Le WebP
1200 × 1600 corrigé a été contrôlé visuellement et remplace l'ancien actif.

Le brouillon administrateur n'est pas encore modifié : à la reconnexion, le
dashboard signale un conflit entre un brouillon local non publié et la version
serveur. Choisir l'une des deux versions supprimerait l'autre ; aucune option
n'a donc été cliquée sans confirmation. Prochaine action sûre : confirmer
« Charger l'autre version » (recommandé : brouillon serveur le plus récent),
puis ajouter les 13 fiches au brouillon et laisser `dirty=true`, sans publier.
Les prix et stocks d'aperçu restent fictifs et doivent être remplacés avant la
vente. Détail dans `NOUVEAU-LOT-HOMME-20260831.md`.

### Session du 31 août 2026 — intégration totale du lot Homme (site déployé, dashboard bloqué)

Demande : rendre les 41 visuels disponibles sur le site, intégrer les 13
nouvelles fiches, les nouvelles marques et leurs bannières, puis synchroniser
le dashboard. État Git : `main`, seul `design-qa.md` non suivi appartient à
l'utilisateur. Fichiers envisagés : six bannières sous
`assets/brand-banners/`, `catalog.js`, journal et brouillon Supabase. Risques :
ne pas générer de logo/texte de marque, conserver les produits dans la bande
centrale visible au recadrage 16/5, ne pas publier les prix fictifs, et ne pas
écraser l'un des deux brouillons en conflit sans confirmation immédiate.

Résultat : les 41 visuels sont reliés à 13 nouvelles fiches et cinq fiches
existantes dans le catalogue de secours. Six bannières 4/3 ont été créées pour
Diesel, Gucci, Fendi, Dolce & Gabbana, Prada et Giuseppe Zanotti ; leur bande
centrale 16/5 a été contrôlée visuellement. Diesel, Gucci et Prada sont mises
en avant. Commit `b05fb2e` poussé, Vercel confirmé avec les nouveaux chemins.
Contrôles : 56 produits, 22 marques, 13/13 nouvelles fiches, aucun ID doublon
et aucun fichier référencé manquant.

Synchronisation dashboard terminée côté serveur sans résoudre ni écraser le
brouillon local en conflit : fusion directe et additive dans `admin_drafts`,
version 231 → 232, `dirty=true`. Le brouillon contient maintenant 70 produits,
dont les 13 nouvelles fiches, et 22 marques, dont les six nouvelles avec leur
bannière. Les cinq fiches existantes ont reçu leurs nouveaux coloris/images en
préservant prix, statut et variantes déjà saisis. Vérifications SQL : 13/13
nouveaux produits, 6/6 nouvelles marques avec bannière, classement Homme
Gucci/Prada/Dior/Diesel, et 0 nouveau produit dans les données publiques.
Contrôle réseau : 48/48 images et bannières répondent HTTP 200. Rien n'a été
publié depuis le dashboard ; les prix et stocks fictifs restent uniquement
dans le brouillon. Sur l'ancien appareil, choisir « Charger l'autre version »
pour afficher le brouillon serveur 232, puis contrôler et publier manuellement.

### Session du 31 août 2026 — publication du brouillon 232 (terminée)

Demande explicite : publier maintenant le brouillon serveur 232. État Git :
`main`, seul `design-qa.md` non suivi appartient à l'utilisateur. Portée : RPC
`publish_store` puis vérifications SQL et production. Risques : concurrence de
version, archivage des produits absents du brouillon, et mise en ligne de prix
et stocks signalés comme fictifs ; l'utilisateur autorise explicitement la
publication malgré cet avertissement.

Résultat : publication atomique réussie avec `publish_store`, version 232 →
233, révision `5aafe5d3-fcff-4be6-882b-7ed8183c1f01`, publiée le 31 août
2026 à 18:15:08 UTC. Le brouillon est propre (`dirty=false`). Vérifications
SQL après publication : 13/13 nouvelles fiches publiques avec prix, 6/6
nouvelles marques avec bannière, 64 produits actifs au total et classement
Gucci / Prada / Dior / Diesel appliqué en tête. Les cinq anciennes fiches
enrichies conservent leurs variantes et utilisent les nouveaux visuels.

Vérification production : `/hommes` répond et son DOM rendu contient bien les
nouvelles cartes Gucci, Prada et Diesel avec prix, coloris et liens produit ;
une capture mobile 390 px confirme que la page se charge avec la coque et le
hero. Les prix et stocks de ce lot sont toujours fictifs : prochaine action
sûre et urgente, les faire remplacer par le propriétaire dans le dashboard.

### Session du 31 août 2026 — audit de chargement production (terminé)

Demande : vérifier que toute la boutique publiée charge correctement et
rapidement. État Git : `main`, `design-qa.md` et `tmp/` non suivis ; ne pas les
publier. Portée envisagée : mesures réseau et Lighthouse sur accueil, Homme,
Femme, catalogue, marque, produit et administration, puis contrôle visuel
mobile/ordinateur et recherche d'erreurs navigateur. Risques : résultats
variables selon le réseau, cache chaud trompeur et faux positifs du serveur de
test local ; mesurer exclusivement la production et distinguer cache froid et
cache chaud.

Résultat : audit Playwright/Chrome effectué en production à 390 × 844 et
1440 × 900, plus simulation mobile 4G (150 ms, 1,6 Mbit/s, CPU ×4).
Accueil, Homme, Femme, catalogue, marque Gucci, fiche Gucci et admin répondent
HTTP 200 ; aucun débordement horizontal, aucune exception JavaScript et la
navigation Homme → Louis Vuitton fonctionne. Les pages Femme ne présentent
pas d'image chargée cassée dans le parcours testé.

Anomalie bloquante de qualité : des dizaines de miniatures sous
`assets/thumbs/cards/products/` et `assets/thumbs/colors/products/` répondent
404. Sont notamment touchés Gucci, Prada, Diesel, Dior, Fendi, Dolce &
Gabbana, Giuseppe Zanotti, plusieurs Calvin Klein, HUGO, Givenchy, Burberry et
Louis Vuitton. Le script `AURA_IMG` réessaie puis rend l'image transparente :
les grandes photos existent, mais les cartes/coloris et miniatures de fiche
peuvent apparaître blanches. La capture de la fiche Gucci le confirme.

Performance observée : les réponses HTML répétées sont généralement entre
0,38 et 0,80 s, avec un pic froid de 4,05 s sur l'accueil. En mobile normal,
LCP Homme/Femme/catalogue est proche de 1,0–1,3 s et CLS reste de 0,003 à
0,078. L'accueil froid atteint 5,55 s de LCP. En 4G simulée, la fiche Gucci
atteint 6,8 s de LCP. Le catalogue ordinateur a montré un CLS ponctuel de
1,001, probablement lié à l'injection tardive de sa grande grille ; à
reproduire avant correction. Les fichiers compressés restent raisonnables :
`boutique.js` 54 Ko, `boutique.css` 22 Ko, `catalog.js` 11 Ko ; `admin.html`
transfère environ 66 Ko. Prochaine action sûre : générer toutes les miniatures
manquantes, les publier, puis répéter exactement le même audit avant de traiter
les deux anomalies de LCP/CLS.

### Session du 31 août 2026 — miniatures et logos responsives (terminée)

Demande : corriger les chargements défectueux détectés, puis empêcher les
logos de marque d'être masqués ou rognés selon la résolution. État Git :
`main`, seuls `design-qa.md` et `tmp/` sont non suivis et ne doivent pas être
publiés. Fichiers envisagés : miniatures sous `assets/thumbs/`, règles de logo
dans `boutique.css`, éventuellement la stratégie de secours dans
`boutique.js`, puis journal. Risques : ne pas dégrader les images originales,
ne pas réintroduire un débordement horizontal, préserver le ratio des logos et
mesurer avant/après sur la production mobile et ordinateur.

Résultat : 88 miniatures manquantes ont été produites à partir des visuels
existants (41 cartes 480 × 640, 41 coloris 144 × 192 et 6 bannières de marque
400 × 300). Les marges raster superflues de cinq logos ont été retirées sans
redessiner ni modifier les marques. Les logos de l'en-tête et du répertoire
emploient désormais `object-fit: contain`, des limites responsives et aucune
transformation de recadrage. Le chargeur d'images retombe sur l'original si
une miniature manque. Commits publiés : `f10e998`, `9f6d4b1`.

La coque, les outils du catalogue, la grille et le répertoire de marques
réservent maintenant leur place avant le chargement des données. Le hero
mobile réserve aussi la hauteur de ses textes. Commits publiés : `21f1f86`,
`f599240`, `0059537`. Vérification Playwright sur la production : HTTP 200,
aucune réponse >= 400, aucune exception JavaScript, aucune image référencée
cassée et aucun débordement horizontal. CLS final : catalogue 0,001 à 320 px
et 0,078 à 390 px ; marques 0,021 à 320 px, 0,005 à 390 px, 0,001 à 768 px
et 0,002 à 1440 px ; rayons Homme/Femme sous 0,060 aux largeurs mobiles
contrôlées. Les 15 logos du répertoire et le logo T&K sont chargés et restent
entièrement dans leur conteneur à 320, 390, 768 et 1440 px. Le temps réseau
reste variable selon Vercel et la connexion ; aucune promesse de LCP fixe
n'est faite. Prochaine action sûre : demander au propriétaire de vérifier les
prix fictifs et les stocks depuis le dashboard avant toute nouvelle campagne.

### Session du 31 août 2026 — contrôle d'exhaustivité du lot Telegram (terminé)

Demande : confirmer avant le prochain lot si tous les modèles et toutes les
photos actuellement présents dans `Downloads/Telegram Desktop` ont bien été
intégrés. État Git : `main`; `design-qa.md` et `tmp/` non suivis appartiennent
à l'utilisateur. Portée : inventaire en lecture seule des 37 photos source,
comparaison avec les visuels produits, le catalogue Git et les produits
publiés. Risque principal : une même photo peut contenir plusieurs coloris ou
dupliquer un modèle ; ne pas confondre « fichier traité » et « paire unique
intégrée ».

Résultat : le dossier contient exactement 37 JPEG datés du 31 août. Le
registre `NOUVEAU-LOT-HOMME-20260831.md`, le commit source `fa858b8` et le
catalogue concordent : ces 37 photos ont été dédoublonnées et regroupées en
41 vues studio WebP, reliées à 13 nouvelles fiches et à cinq fiches déjà
existantes enrichies. Les six nouvelles marques nécessaires ont leur bannière.
La publication 232 → 233 avait déjà confirmé 13/13 fiches publiques, et le
dernier audit réseau avait contrôlé 48/48 visuels et bannières en HTTP 200.
Conclusion : le lot actuellement présent dans ce dossier est entièrement
traité et intégré ; aucun fichier source de ce lot ne reste en attente. Les
prix et stocks de ce lot restent fictifs et doivent être corrigés par le
propriétaire.

### Session du 31 août 2026 — nouveau lot Femme Telegram (terminée)

Demande : traiter le nouveau contenu déposé dans
`C:\Users\PC\Downloads\Telegram Desktop` avant intégration à la boutique.
État Git : `main`; `design-qa.md` et `tmp/` non suivis restent hors portée.
Inventaire initial : 13 JPEG nommés `photo_1_2026-08-31_22-00-10.jpg` à
`photo_13_...`, distincts du lot Homme précédent. Fichiers envisagés : visuels
studio sous `assets/products/femme/`, miniatures, catalogue et brouillon
dashboard après identification. Risques : doublons, plusieurs coloris dans
une même photo, classification Femme/Homme, fidélité absolue aux formes,
coutures, motifs et logos ; aucun prix réel n'a encore été fourni.

Résultat : les 13 sources ont été dédoublonnées en 7 fiches et 31 coloris :
Dolce & Gabbana DG Volume, Hermès Chaîne d'Ancre, Tory Burch Double T Sport,
Tory Burch Miller Jelly, Gucci Interlocking G, Hermès Oran grainé et Hermès
Oran effet autruche. Les 31 visuels finaux sont des JPEG 1200 × 1600 avec
miniatures carte et coloris ; chaque paire a été contrôlée sur une planche de
contact. La bannière Tory Burch a été ajoutée sans générer de logo : le nom
reste rendu en texte. Détail dans `NOUVEAU-LOT-FEMME-20260831.md`.

Le commit `847fb89` est publié sur `main`. La production sert le nouveau
cache-buster et quatre ressources représentatives ont répondu HTTP 200. Le
brouillon Supabase est passé de la version 233 à 234 : 7/7 produits actifs
dans le brouillon, 7/7 matrices pointure × coloris valides, une seule marque
Tory Burch et état `dirty=true`. Aucun des sept produits n'est encore dans la
table publique : le propriétaire doit d'abord remplacer les prix et stocks
provisoires, contrôler l'aperçu, puis publier depuis le dashboard.

### Session du 31 août 2026 — publication du lot Femme (terminée)

Demande : publier sur le site le brouillon Femme version 234 précédemment
préparé. État Git : `main`; `design-qa.md` et `tmp/` non suivis restent hors
portée. Fichiers envisagés : journal uniquement. Opération distante prévue :
appel contrôlé à `publish_store`, puis vérification des 7 fiches et ressources
sur la production. Risques : publier les prix et stocks provisoires tels que
présents dans le brouillon ; éviter toute double publication ou divergence de
version.

Résultat : `publish_store` a publié le brouillon 234 et créé la révision
`a63f7e63-e43c-4089-b477-e9f359a9f296`. Le brouillon est désormais en
version 235 avec `dirty=false`. Contrôle en base : 7/7 nouvelles fiches sont
publiques, actives et non archivées ; Tory Burch apparaît une seule fois dans
les réglages publics. Contrôle sur `/femmes` : Tory Burch, Gucci Interlocking
et Hermès Chaîne d'Ancre sont rendus, aucune erreur console et aucune image
effectivement chargée n'est cassée. Les prix et stocks restent provisoires et
doivent être remplacés par le propriétaire depuis le dashboard.

### Session du 31 août 2026 — correction Burberry vert (terminée)

Demande : reprendre les motifs du dessus de la variante verte Burberry, jugés
infidèles. État Git : `main`; `design-qa.md` et `tmp/` non suivis restent hors
portée. Fichiers envisagés : visuel produit vert, ses miniatures carte/coloris
et journal uniquement. Risques : altérer la forme, le tartan, le logo ou les
autres variantes ; la référence source doit être contrôlée avant toute
retouche et le produit, le prix et le stock doivent rester inchangés.

Résultat : le visuel studio vert a été régénéré à partir de la photo source
avec une grille vert forêt plus fidèle, des bandes gris-vert et bleu clair
mieux espacées, tout en conservant la paire, la semelle noire, l'angle et le
fond blanc. `burberry-check-vert-studio.webp` a été remplacé en 1200 × 1600,
ainsi que ses miniatures carte 480 × 640 et coloris 144 × 192. Aucun champ du
produit, prix, stock, logo ou autre variante n'a été modifié.

### Session du 1er septembre 2026 — rupture Burberry marron (terminée)

Demande : marquer en rupture la variante marron du deuxième produit Burberry,
sans rendre indisponibles les autres coloris. État Git : `main` ;
`design-qa.md` et `tmp/` non suivis restent hors portée. Fichiers envisagés :
journal uniquement ; modification du stock dans le brouillon puis publication.
Risques : identifier précisément le produit et le libellé du coloris, préserver
les réservations et laisser la sélection automatique choisir un coloris encore
disponible.

Résultat : le coloris marron/tan correspond au libellé interne `Beige` de
`bb-check` (Claquette Vintage Check). Les sept pointures 39 à 45 ont désormais
un stock explicite de zéro dans la vitrine publique comme dans le brouillon.
Les 21 combinaisons des coloris Vert, Bleu ciel et Noir restent disponibles,
et le produit reste actif. Aucun fichier produit, prix, image ou classement
n'a été modifié.

### Session du 1er septembre 2026 — recette mobile et dashboard (terminée)

Demande : tester la boutique, surtout sur mobile, et contrôler le fonctionnement
de toutes les fonctions du dashboard. État Git : `main` ; `design-qa.md` et
`tmp/` non suivis restent hors portée. Fichiers envisagés : journal et,
uniquement si un défaut reproductible est trouvé, les fichiers nécessaires à
sa correction. Portée : production aux largeurs 320/375/390 px, parcours
catalogue–produit–panier sans commande fictive, puis les neuf onglets du
dashboard en mobile et ordinateur. Risques : ne pas créer de commande, ne pas
publier ni écraser les données réelles pendant les tests, distinguer un défaut
du serveur local d'un défaut de production.

Résultat : recette visuelle et fonctionnelle exécutée en production aux
largeurs 320, 375 et 390 px sur l'accueil Homme/Femme, catalogue, marques,
collection Burberry, fiche Burberry, pages légales et 404. Menu mobile,
recherche, sélection de variante, panier, limite de quantité selon le stock,
suppression du panier et validations du formulaire de commande fonctionnent ;
aucune commande fictive n'a été créée. Aucune erreur console ni débordement
horizontal n'a été observé sur les parcours principaux.

Les cinq vues principales du dashboard et ses sous-vues Réglages, Contenu,
Publics, Classement, Catalogue, Légal, Liste d'attente, Actualités, Avis,
Demandes clients et Aide ont été ouvertes en copie locale isolée. Recherche,
édition produit, création avec validation, stock par variante, classement,
annulation, filtre et vedettes ont répondu correctement. Les validations des
numéros WhatsApp, frais et URL Instagram ont rejeté les valeurs invalides.
Commandes, export vide et états vides ont été contrôlés. Le portail de
production affiche bien la barrière d'authentification ; aucune écriture
authentifiée réelle, publication ou modification de commande n'a été lancée.
Les 77 produits du brouillon et de la vitrine sont synchronisés, le brouillon
235 est propre, et les RPC attendues ainsi que la fonction `client-intake`
sont présentes.

Défauts reproductibles restant à corriger :

- deux références d'images publiques répondent HTTP 404 :
  `assets/cl-rouge-white-v2.webp` dans `hg-match` et
  `assets/cl-bleu-white-v2.webp` dans `lv-bande` ;
- `/confidentialite` déborde horizontalement à 320 px à cause d'un tableau
  large de 520 px, avec le grand titre rogné ; le rendu est correct à 390 px ;
- la variante `39::Blanc et bleu` de `hg-mono` porte `{s:0,r:1}` alors
  qu'aucune commande actuelle ne référence ce produit : réservation orpheline
  historique à nettoyer prudemment ;
- le bouton WhatsApp flottant mesure environ 41 × 41 px et le bouton
  d'affichage du mot de passe du portail admin 38 × 48 px, sous la cible
  interne de 44 × 44 px ;
- les mentions légales de la politique de confidentialité restent signalées
  « à compléter » ; les vraies informations du commerçant sont requises.

Contrôles réseau : routes principales, `robots.txt` et `sitemap.xml` en 200,
ancienne page `/brand` en 404, en-têtes CSP/HSTS/nosniff/X-Frame-Options
présents. Les 11 visuels initialement lents ont finalement répondu en 200 ;
seules les deux références ci-dessus sont réellement absentes. Prochaine
action sûre : corriger ces quatre défauts techniques, puis refaire une recette
ciblée. `design-qa.md` et `tmp/` n'ont pas été touchés.

### Session du 1er septembre 2026 — corrections issues de la recette (intégrée à la recette finale)

Demande : corriger tous les défauts relevés pendant la recette mobile et
dashboard. État Git : `main` synchronisé avec `origin/main` ; seul le journal
de recette est modifié, `design-qa.md` et `tmp/` restent hors portée. Fichiers
envisagés : références produits/images concernées, styles de la page
Confidentialité et des cibles tactiles, puis journal. Donnée distante envisagée
: nettoyage ciblé de la réservation orpheline `hg-mono` après contrôle.
Risques : ne pas modifier les prix, les autres stocks ou les commandes ; ne
pas remplacer un visuel par le mauvais coloris ; vérifier en production après
publication.

État au changement de demande : les deux ressources manquantes ont été
restaurées localement avec leurs modèles studio correspondants ; le tableau
Confidentialité, les deux cibles tactiles et le titre à 320 px sont corrigés et
validés localement. Les réservations historiques sans commande de `hg-mono`
et `as-pool` ont été nettoyées dans la vitrine et le brouillon, qui reste en
version 235, `dirty=false`, avec 77 produits. Ces changements ne sont pas
encore publiés et sont repris dans la recette finale ci-dessous.

### Session du 1er septembre 2026 — finition complète avant domaine (terminée)

Demande : éliminer les micro-bugs avant la version finale, notamment le double
appui nécessaire sur un coloris, les flashs de mauvaise page, les incohérences
Homme/Femme et les bannières de marque inadaptées ; vérifier cartes, fiches,
commande, message WhatsApp, dashboard et liens de pied de page. État Git :
`main` synchronisé avec `origin/main`, avec les corrections techniques de la
session précédente non encore commitées ; aucun changement distinct attribué
à Claude n'est visible dans le dépôt. Fichiers envisagés : `boutique.js`, les
gabarits ou styles uniquement si une cause reproductible l'exige, journal et
tests temporaires hors dépôt. Risques : préserver les changements existants,
ne créer aucune commande réelle, ne pas publier de données fictives et ne pas
associer une bannière ou un produit au mauvais public.

Résultat : le changement de coloris conserve désormais le premier toucher
pendant l'arrivée des données Supabase et affiche immédiatement la miniature
du coloris, puis la photo complète sans course réseau. Un test exhaustif a
actionné une seule fois les 117 choix de coloris des 48 produits concernés,
sans retour au coloris précédent ; un second test réel sur Burberry a conservé
« Bleu ciel » après 2,2 secondes avec la bonne photo.

La page d'entrée ne redirige plus automatiquement selon un ancien rayon, ce
qui supprime le flash d'une page intermédiaire. La recherche, les collections,
les bannières, le catalogue et les fiches propagent maintenant le public réel.
Une fiche ouverte avec un mauvais paramètre corrige son URL et tous ses liens.
Coach, Gucci, Dior, Dolce & Gabbana et Hermès ont été contrôlés dans les deux
rayons : bannière et produits correspondent au public. Le catalogue réel
compte 46 modèles Homme livrés sous 5 jours et 25 modèles Femme livrés sous
10 jours ; la vue globale annonce les deux délais au lieu d'en choisir un.
Les liens « Tout voir » et « Notre histoire » conservent aussi le bon rayon.

Recette exécutée à 375 px sur toutes les pages publiques et à 1280 px sur les
grilles principales : aucun débordement horizontal, aucune image chargée en
erreur, aucune erreur console, cartes d'une même ligne de hauteur identique et
logos entièrement visibles. Les pages Confidentialité, CGV, Guide des tailles
et 404 passent également. Le parcours panier–commande a été testé en mode
local isolé : référence, produit, pointure, coloris, prix et URL exacte de la
photo sont présents dans le message WhatsApp ; aucune commande distante n'a
été créée. Les vues principales du dashboard s'ouvrent sans débordement et
« Voir ma boutique » pointe vers la production. `node --check`, la compilation
des scripts intégrés et `git diff --check` passent.

Les deux anciennes ressources 404 ont été restaurées ; le tableau mobile de
Confidentialité et les cibles tactiles WhatsApp/mot de passe sont corrigés.
Les réservations orphelines ciblées ont été nettoyées dans la vitrine et le
brouillon sans modifier les commandes, prix ou autres stocks. Seule réserve
non technique : les mentions légales exigent encore la forme juridique,
l'adresse, le RCCM, le NIF et l'e-mail réels du commerçant ; ne pas les
inventer. Prochaine action sûre après publication : acheter le domaine, lancer
`configurer.mjs` avec son URL puis faire l'audit SEO final.

Déploiement : commit `eb92df7` poussé sur `main` et servi par Vercel. Contrôle
production réussi sur toutes les routes principales, les deux ressources
restaurées, la porte d'entrée, les collections Coach Homme/Femme, le coloris
Burberry en un seul appui et le portail admin ; réponses HTTP 200, aucune
image cassée, erreur console ou largeur débordante observée.

### Session du 1er septembre 2026 — séparer le Damier bleu LV (terminée)

Demande : transformer la paire Damier bleue actuellement présentée comme un
coloris de `lv-damier` en produit Homme autonome, disponible, puis la placer en
première position de la sélection Homme sur l'accueil. Le produit Damier
existant doit rester séparé et ne plus contenir cette paire bleue. État Git :
`main` au commit `dff5a07`, propre hors `design-qa.md` et `tmp/` non suivis et
hors portée. Fichiers/données envisagés : catalogue de secours uniquement si
nécessaire, produits publics et brouillon Supabase, classement d'accueil et
journal. Risques : préserver prix, stocks et réservations du modèle existant,
éviter un doublon d'identifiant et maintenir vitrine/dashboard synchronisés.

Résultat : `lv-damier` ne contient plus que le coloris Noir et gris et utilise
sa photo noire. Le nouveau produit autonome `lv-damier-bleu`, intitulé
« Claquette Damier Bleu », reprend la photo studio bleue, le prix de 27 000
FCFA, les pointures 39 à 45 et des stocks disponibles de 2/3/4/5/3/2/1. Il est
placé en première position de la rangée Louis Vuitton sur l'accueil Homme ;
`lv-damier` n'apparaît plus dans cette rangée.

La vitrine publique, les réglages publics et le brouillon admin ont été mis à
jour ensemble. Le brouillon passe en version 236, `dirty=false`, avec 78
produits et une seule occurrence du nouveau produit. Le catalogue de secours
reproduit la même séparation et le même classement. Vérification production :
les deux fiches répondent, chacune ne propose que son propre coloris, les deux
sont en stock, les bonnes photos chargent sans erreur et aucune largeur ne
déborde. Aucune commande existante ne référençait `lv-damier`.

Déploiement : commit `2a40e21` poussé sur `main` et confirmé sur Vercel. La
rangée publique affiche dans l'ordre Damier Bleu, Signature LV, Monogramme
Relief, V Croisée ; aucune image cassée ni erreur console.

### Session du 1er septembre 2026 — refaire le Burberry vert (terminée)

Demande : remplacer totalement le visuel studio Burberry vert par une nouvelle
version fidèle à la vraie paire, avec le marquage authentique « BURBERRY » sur
la semelle intérieure dans la zone du talon. Aucune ancienne version ne doit
rester utilisée par le site. État Git : `main` au commit `5227a9e`, propre hors
`design-qa.md` et `tmp/` non suivis et hors portée. Fichiers envisagés : visuel
produit vert et toutes ses miniatures dérivées, références/cache si nécessaire,
puis journal. Risques : texte de marque mal orthographié, motif tartan déformé,
modèle ou angle modifié, ancien fichier encore servi par le cache immutable.

Résultat : le visuel studio vert a été recréé en paire complète 3:4, sur fond
blanc pur, avec le tartan vert conservé et le mot « BURBERRY » posé une seule
fois sur la zone arrière de chaque semelle intérieure. Le marquage erroné de
la tranche a disparu. L'image principale a été normalisée en 1200 × 1600 ; les
miniatures carte et coloris ont été régénérées depuis cette même source. Les
deux anciens fichiers studio (`burberry-check-vert-studio.webp` et
`burberry-check-vert-white-v2.webp`) et leurs quatre dérivés ont été écrasés,
donc aucune copie de l'ancien rendu studio ne reste dans ces emplacements. La
photo authentique avec emballages a été conservée comme source non utilisée.

Le cache média passe à `20260901g` et les sept pages publiques chargent cette
nouvelle version de `boutique.js`, ce qui force aussi les visiteurs déjà venus
à récupérer le nouveau visuel. Contrôles : image principale 1200 × 1600,
miniature carte 480 × 640, miniature coloris 144 × 192, quatre coins exactement
`#FFFFFF`, `node --check` et `git diff --check` réussis. Déploiement : commit
`7b07023` poussé sur `main` et confirmé sur Vercel ; la fiche `bb-check` répond
HTTP 200 et le SHA-256 du fichier servi en production est exactement celui du
nouveau fichier local.

### Session du 1er septembre 2026 — corriger le marquage Burberry vert (terminée)

Demande : reprendre le visuel vert généré car le marquage de la semelle ne
correspond pas à la photo officielle. Le mot doit être noir, discret et
imprimé dans la matière sur l'arrière de la semelle intérieure, jamais blanc
ni traité comme un texte rapporté. État Git : `main` au commit `c21828c`,
propre hors `design-qa.md` et `tmp/` non suivis et hors portée. Fichiers
envisagés : visuel studio vert, miniatures dérivées, version de cache et
journal. Risques : modifier le motif ou la forme de la paire, produire un
marquage trop fort ou mal orthographié, laisser l'image précédente en cache.

Résultat : la photo officielle et le marquage ton sur ton du coloris beige ont
été repris comme références. Les lettres blanches ont été supprimées ; chaque
semelle porte désormais « BURBERRY » en noir sur noir, discret, intégré comme
un marquage pressé dans le caoutchouc et visible principalement par son léger
relief. La paire, son angle, son tartan vert, ses coutures et son fond blanc
restent inchangés. Les deux fichiers studio et leurs quatre miniatures ont été
écrasés avec cette nouvelle source. Le cache média passe à `20260901h`.

Contrôles : image 1200 × 1600, carte 480 × 640, coloris 144 × 192, coins en
`#FFFFFF`, inspection visuelle, `node --check` et `git diff --check` réussis.
Déploiement : commit `1b0dc9c` poussé sur `main` et confirmé sur Vercel ; la
fiche `bb-check` répond HTTP 200 et le fichier distant a exactement le même
SHA-256 que la nouvelle image locale.

### Session du 1er septembre 2026 — mettre à jour l'application de design PC (terminée)

Demande : retrouver l'application de design installée sur le PC, appelée de
mémoire « OpenDesign », puis installer sa mise à jour officielle. Cette tâche
ne doit modifier aucun fichier ni contenu de la boutique. État Git : `main` au
commit `d3fee3f`, propre hors `design-qa.md` et `tmp/` non suivis et hors
portée. Fichiers du projet envisagés : journal uniquement. Risques : nom de
l'application approximatif, installateur non officiel, fermeture éventuelle
de l'application pendant la mise à jour.

Résultat : l'application identifiée est bien Open Design. Le lanceur local
0.13 ouvrait encore le payload 0.15.1 malgré une tentative 0.16.0 incomplète.
La release officielle la plus récente au moment du contrôle est la 0.21.1,
publiée le 31 août 2026. L'installateur Windows officiel GitHub (418 933 468
octets) a été téléchargé puis vérifié contre le SHA-256 publié
`cd203b1c931fe1f7621929945b5aa8d2387a5c6fa5273cf66325a0b443224e7e`.

La mise à niveau silencieuse s'est terminée après libération des téléchargements
partiels temporaires créés pendant l'opération. Open Design a ensuite été
relancé : l'exécutable installé, son `package.json` et le processus réellement
ouvert indiquent tous la version 0.21.1 ; aucun ancien payload 0.15.1 ne tourne.
L'installateur temporaire de 419 Mo a été supprimé. Aucun fichier de la
boutique n'a été modifié en dehors de ce journal.

### Session du 2 septembre 2026 — plan de finition mobile Homme/Femme (terminée)

Demande : confirmer que l'état actuel de la boutique est récupérable, puis
préparer un plan d'implémentation pour améliorer le rythme, les espacements,
les bannières, les rangées produits et les boutons de continuation sur les
pages Homme et Femme. État Git : `main` au commit `aec7601`, aucune modification
suivie ; seuls `design-qa.md` et `tmp/` sont non suivis et hors portée. Fichiers
envisagés pour l'implémentation future : principalement `boutique.js`,
`boutique.css`, `hommes.html`, `femmes.html` et journal. Risques : casser le
défilement horizontal intentionnel, désynchroniser les deux rayons ou modifier
les données et le classement des produits alors que l'objectif est purement
visuel.

Résultat : état de reprise confirmé. Le commit `aec7601` est identique à
`origin/main`; toutes les modifications suivies sont donc récupérables. Les
deux éléments non suivis existants restent exclus. Les captures mobile ont été
analysées avec les règles de lisibilité, de reflow et d'espacement tactile : le
problème n'est ni les produits ni les images, mais le rythme répétitif des
sections, les rails qui dépassent les gouttières des bannières, les CTA trop
proches de la section suivante et le départ trop serré de la page Marques.

Plan validable avant code : conserver bannières et rails, mais leur donner les
mêmes gouttières; normaliser une seule cadence bannière → rangée → CTA → pause;
centrer les CTA et réserver leur espace vis-à-vis du bouton WhatsApp; ajouter
un vrai espace de départ sous la navigation pour les titres; tester les deux
rayons à 360, 375, 390 et 430 px, puis publier seulement après comparaison
visuelle. Aucun produit, prix, stock, marque, classement ou image ne doit être
modifié par cette passe.

### Session du 2 septembre 2026 — finition visuelle mobile Homme/Femme (terminée)

Demande : appliquer le plan de finition mobile et ne retenir le résultat que
si le rendu public atteint un niveau premium estimable à au moins 98 %.
État Git : `main` au commit `5e01795`, synchronisé avec `origin/main` ; seuls
`design-qa.md` et `tmp/` sont non suivis et strictement hors portée. Fichiers
envisagés : `boutique.css`, éventuellement `boutique.js` si la structure le
requiert, puis ce journal. Risques : casser le glissement horizontal voulu,
masquer une cible derrière WhatsApp, introduire un débordement, ou modifier les
données de produits alors que la demande est uniquement visuelle. Vérifications
prévues : rendu public Homme/Femme à 360, 375, 390 et 430 px, interactions de
rail et CTA, console et débordement horizontal avant déploiement.

Résultat : la règle mobile commune de `boutique.css` aligne désormais les
bannières et les rails produits sur les mêmes gouttières de 16 px, tout en
conservant le défilement horizontal des cartes. Les CTA sont centrés, font
44 px de haut, disposent d'un espace supérieur de 20 px et chaque marque se
termine par une pause de 48 px avant la suivante. L'ancre Marques réserve
112 px sous la navigation mobile : le titre ne peut plus être collé sous
l'en-tête fixe. Aucun produit, image, prix, stock, marque ou classement n'a
été modifié.

Le premier push (`e3be915`) avait bien déployé le CSS mais les pages gardaient
une URL CSS immuable ancienne ; les sept gabarits publics portent donc la
version `20260902a` dans le commit `d2fd16c`, poussé sur `main` et confirmé
servi par Vercel. Recette production : Homme et Femme à 360, 375, 390 et 430
px : cinq bandes rendues, aucun débordement document, aucune erreur console,
rails défilables et alignés, CTA à 44 px. Une capture visuelle a confirmé les
deux rendus ; le CTA Hermès Femme ouvre bien
`collection?c=hermes&audience=femme`. Non-régression contrôlée à 1280 px sur
les deux rayons : aucun débordement ni erreur console. Estimation visuelle
limitée à cette portée : 98/100, avec un rendu cohérent et sans défaut
observable sur les vues testées. Prochaine action sûre : recette finale des
parcours de commande et dashboard avant achat du domaine.

### Session du 2 septembre 2026 — carte « autres modèles » dans le rail (terminée)

Demande : remplacer le bouton séparé « Voir les autres modèles », jugé trop
massif, par une dernière carte visible à la fin du défilement horizontal des
produits. État Git : `main` au commit `8033bd4`, synchronisé avec
`origin/main` ; `design-qa.md` et `tmp/` restent non suivis et hors portée.
Fichiers envisagés : `boutique.js`, `boutique.css` et journal. Risques : faire
déborder la page, créer une cinquième carte sur ordinateur, rendre le lien
inaccessible ou casser les rails Homme/Femme. Vérification prévue : rendu et
lien de la carte en production mobile, contrôle de non-régression ordinateur
et absence d'erreurs console.

Résultat : `renderBandes()` ajoute désormais, uniquement s'il reste des
produits, une carte-lien après les quatre cartes de la marque. Elle annonce le
nombre réel de modèles restants, porte un libellé accessible complet et ouvre
la collection dans le bon rayon. L'ancienne pilule sous chaque rangée a été
supprimée. À moins de 760 px, la carte a la même largeur que les produits,
une flèche circulaire de 48 px et une cible entièrement cliquable ; à partir
de 760 px elle est volontairement masquée afin de préserver la grille de
quatre colonnes et le bandeau reste le lien de collection.

Les URL de cache CSS et JavaScript ont été renouvelées dans les sept gabarits
publics (`20260902b` / `20260902a`). Déploiement : commit `a25c246` poussé sur
`main`, confirmé servi par Vercel. Recette production à 390 px : aucune erreur
console ni débordement, trois cartes de suite Homme et une Femme rendues,
l'ancien bouton absent, et le défilement horizontal atteint effectivement la
carte finale. Un clic sur « Voir les 9 autres modèles Hermès » ouvre
`collection?c=hermes&audience=femme`. Contrôle à 1280 px sur Homme/Femme : les
cartes de suite sont masquées, aucun débordement ni erreur console. Prochaine
action sûre : recueillir l'avis visuel du propriétaire, puis conserver ou
retoucher uniquement la couleur/le contenu de la carte finale.
