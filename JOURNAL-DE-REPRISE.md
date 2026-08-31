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
