# Spécification : classement des produits et vedettes

Module : `merchandising`

## Objectif

Réunir dans un seul écran du dashboard tout ce qui détermine l'ordre dans
lequel les produits sont vus, sans demander au commerçant de comprendre la
structure technique du site.

Le commerçant doit pouvoir choisir les produits qui font la meilleure première
impression, classer le reste du catalogue, et vérifier le résultat avant de le
publier. Le mot « populaire » n'est jamais affiché automatiquement : une
vedette est un choix éditorial, pas une affirmation de ventes.

### Parcours attendus

1. Ouvrir « Classement et vedettes » depuis l'organisation du site.
2. Choisir une zone : rayon Homme, rayon Femme ou une marque.
3. Voir immédiatement les produits visibles de cette zone, leur photo, leur
   disponibilité et leur position.
4. Choisir jusqu'à quatre produits vedettes et modifier leur ordre.
5. Classer tous les autres produits avec des boutons explicites adaptés au
   téléphone.
6. Prévisualiser la zone avec le brouillon courant.
7. Publier les changements avec le mécanisme de publication existant.

## Règles fonctionnelles

### Zones de classement

- Chaque rayon possède son ordre complet dans `audiencePages.<rayon>.productOrder`.
- Chaque marque possède son ordre complet dans `collections[].productOrder`.
- Le rayon garde sa liste de quatre vedettes maximum dans `featuredProducts`.
- La marque garde sa liste de quatre vedettes maximum dans `homeProducts`.
- Les anciennes listes restent compatibles : si aucun ordre complet n'existe,
  l'ordre actuel des produits sert de point de départ.

### Ordre public

- Le classement choisi s'applique au tri « Recommandés » du catalogue, aux
  pages de rayon, aux pages de marque et aux rangées de produits de l'accueil.
- Les produits absents de la liste sont ajoutés après les produits classés,
  dans leur ordre stable actuel. Un nouveau produit n'efface donc jamais le
  classement existant.
- Les produits disponibles restent devant les produits entièrement épuisés.
  L'ordre manuel est respecté à l'intérieur de chacun de ces deux groupes.
- Un tri demandé par le visiteur, par exemple prix croissant, continue de
  remplacer le classement éditorial.

### Vedettes et disponibilité

- Quatre vedettes maximum sont configurables par rayon ou par marque.
- Une vedette visible et disponible apparaît à la position choisie.
- Si une vedette devient épuisée, masquée ou archivée, elle n'occupe pas une
  place vide sur le site : le prochain produit visible et disponible de
  l'ordre complet prend sa place.
- Une vedette épuisée reste mémorisée et clairement signalée dans le dashboard
  afin de revenir automatiquement lorsqu'elle est réapprovisionnée.
- Une vedette archivée ou supprimée est retirée définitivement des listes.
- Le badge « Nouveau » reste une propriété du produit. Le classement ne crée
  jamais automatiquement une nouveauté, une promotion ou une popularité.

### Commandes de classement

- Chaque ligne propose « Monter », « Descendre » et « Mettre en premier ».
- Les boutons indisponibles sont désactivés aux extrémités de la liste.
- Le glisser-déposer peut améliorer l'usage sur ordinateur, mais ne doit jamais
  être le seul moyen de classer.
- Une action peut être annulée tant que l'écran reste ouvert.
- Un filtre local permet de retrouver un produit sans modifier son ordre.

## Pile technique

- HTML statique, CSS et JavaScript sans compilation.
- `admin.html` pour l'écran, le classement, l'aperçu et le brouillon.
- `boutique.js` pour l'application cohérente du classement sur la boutique.
- `catalog.js` pour les valeurs initiales compatibles.
- `supabase-client.js` et le stockage JSON existant pour la synchronisation.

Aucune dépendance et aucune migration Supabase ne sont nécessaires. Les deux
nouvelles listes d'ordre vivent dans les réglages JSON déjà synchronisés.

## Commandes

Serveur de vérification locale :

```powershell
python -m http.server 4173
```

Contrôle syntaxique du JavaScript embarqué et externe :

```powershell
node --check boutique.js
node --check admin-script.js
```

Le script embarqué de `admin.html` sera extrait temporairement pour le second
contrôle, sans publier le fichier d'extraction.

Contrôle des modifications :

```powershell
git diff --check
git diff -- admin.html boutique.js catalog.js
```

Vérification finale en production :

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://boutique-aura-studios.vercel.app/admin
curl.exe -s -o NUL -w "%{http_code}`n" https://boutique-aura-studios.vercel.app/catalogue
```

## Structure du projet

```text
admin.html                 -> écran « Classement et vedettes » et brouillon
boutique.js                -> résolution de l'ordre et des vedettes publiques
catalog.js                 -> réglages initiaux et compatibilité
supabase-client.js         -> chargement, synchronisation et publication
SPEC-merchandising.md      -> contrat fonctionnel du module
tasks/                     -> plan et suivi après validation de la spec
RECETTE.md                 -> parcours de vérification à compléter
GUIDE-ADMINISTRATION.md    -> mode d'emploi du commerçant à compléter
```

## Structure d'interface

### Écran principal

- En-tête « Classement et vedettes » avec une explication en une phrase.
- Sélecteur de zone en deux groupes lisibles : Rayons et Marques.
- Résumé de la zone : nombre de produits, nombre de vedettes et alertes de
  produits épuisés ou masqués.
- Bloc « Les 4 vedettes » avant la liste complète.
- Bloc « Ordre de tous les produits » avec recherche locale.
- Boutons « Prévisualiser » et « Publier » utilisant les mécanismes existants.

### Téléphone

- Une seule colonne et aucun tableau horizontal.
- Les zones sont choisies dans un contrôle natif ou une liste de grandes
  cartes, sans menu minuscule.
- Chaque produit est une carte compacte avec miniature, nom, marque,
  disponibilité, position et commandes tactiles d'au moins 44 × 44 px.
- Les actions de déplacement restent visibles sans glisser horizontalement.
- `overscroll-behavior` limite les rafraîchissements accidentels pendant une
  série de déplacements.

### Ordinateur

- La liste utilise la largeur disponible et conserve les mêmes commandes.
- Un aperçu compact des quatre premières cartes peut être affiché à côté de la
  liste, sans créer une deuxième source de vérité.

## Style de code

Le calcul de l'ordre public est centralisé dans une fonction pure afin que les
différentes pages ne divergent pas :

```javascript
function produitsClasses(produits, ordre) {
  var positions = {};
  (ordre || []).forEach(function(id, index) { positions[id] = index; });
  return produits.slice().sort(function(a, b) {
    var positionA = positions[a.id] == null ? 9999 : positions[a.id];
    var positionB = positions[b.id] == null ? 9999 : positions[b.id];
    return positionA - positionB;
  });
}
```

- JavaScript compatible avec le projet, sans framework ni dépendance.
- Valeurs injectées systématiquement échappées avec `esc()`.
- Tables de correspondance déclarées dans la fonction qui les utilise.
- Le mot « marque » est utilisé dans l'interface, jamais « collection ».
- Aucun identifiant technique n'est demandé ou affiché au commerçant.
- Les fonctions de normalisation ne réécrivent pas silencieusement la base au
  chargement.

## Stratégie de test

### Fonctionnel

- Classer tous les produits d'un rayon, recharger le dashboard et retrouver le
  même ordre dans le brouillon.
- Choisir zéro, une et quatre vedettes ; refuser proprement une cinquième.
- Déplacer une vedette et vérifier son ordre sur l'aperçu.
- Classer les produits d'une marque sans modifier les autres marques.
- Ajouter un nouveau produit et vérifier qu'il apparaît après l'ordre existant.
- Masquer, archiver puis restaurer un produit classé.
- Épuiser une vedette et vérifier le remplacement public sans perte de sa
  configuration.
- Réapprovisionner cette vedette et vérifier son retour automatique.
- Publier, recharger la boutique et vérifier la persistance Supabase.
- Vérifier qu'un tri visiteur par prix ou nom reste prioritaire.

### Responsive et accessibilité

- Vérification à 375, 768, 1024 et 1440 px.
- Aucun débordement horizontal.
- Aucun contrôle tactile sous 44 × 44 px sur mobile.
- Navigation clavier complète et focus visible.
- Annonce textuelle de la position et de la disponibilité ; la couleur seule
  ne transmet aucune information.
- Les boutons de déplacement portent un libellé accessible incluant le nom du
  produit et la destination.

### Régression

- Les listes historiques `featuredProducts` et `homeProducts` restent lues.
- Les produits épuisés restent visibles sur le catalogue après les produits
  disponibles.
- Les favoris, filtres et tris visiteurs conservent leur comportement.
- Les pages Homme, Femme, marque, catalogue et accueil utilisent la même règle
  d'ordre.
- Aucune modification de classement ne change le prix, le stock, les variantes,
  les photos ou la visibilité d'un produit.

## Limites

### Toujours faire

- Enregistrer les changements comme brouillon avant publication.
- Montrer la disponibilité réelle près de chaque produit.
- Préserver les identifiants classés devenus temporairement épuisés.
- Purger les identifiants réellement supprimés ou archivés.
- Utiliser les contrôles existants d'aperçu et de publication.

### Demander avant

- Changer la limite de quatre vedettes.
- Ajouter des statistiques de ventes ou un classement automatique par ventes.
- Modifier le schéma Supabase.
- Ajouter une dépendance de glisser-déposer.

### Ne jamais faire

- Présenter une paire comme « populaire » sans données réelles.
- Inventer une promotion, une note ou un badge.
- Cacher automatiquement un produit uniquement parce qu'il est épuisé.
- Modifier le stock, le prix ou les variantes depuis cet écran.
- Publier `admin-essai.html`.

## Critères de réussite

- Le commerçant trouve le module depuis l'écran d'organisation sans passer par
  les réglages de contenu d'un rayon ou d'une marque.
- Il peut classer un rayon ou une marque entièrement sur un téléphone de
  375 px sans défilement horizontal.
- Les quatre vedettes et l'ordre complet sont deux notions distinctes et
  compréhensibles sans documentation technique.
- Une modification non publiée reste dans le brouillon et n'affecte pas la
  boutique publique.
- Après publication, toutes les surfaces publiques concernées affichent le
  même classement.
- Une vedette indisponible est remplacée automatiquement sans trou ni carte
  cassée, puis revient après réapprovisionnement.
- Aucun prix, stock, produit ou média n'est altéré par le classement.
- Les tests fonctionnels, responsive, accessibilité et régression décrits
  ci-dessus passent avant le déploiement.

## Questions ouvertes

Aucune. Cette spécification conserve la limite existante de quatre vedettes,
le modèle de brouillon actuel et le stockage JSON déjà en production.
