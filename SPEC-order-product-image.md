# Spécification — photo exacte dans les commandes

## Objectif

Chaque article commandé doit rester identifiable même si son nom ou sa photo
produit change plus tard. La commande conserve automatiquement la référence
`ART-…`, la marque, le modèle, la variante et l'URL de la photo correspondant
au coloris réellement choisi.

Le commerçant ne saisit ni référence technique ni URL lorsqu'il ajoute un
produit depuis son téléphone.

## Hypothèses soumises à validation

1. La référence article reste dérivée automatiquement de l'identifiant du
   produit : un produit créé par le dashboard reçoit déjà un identifiant
   unique `p<date>`, donc sa référence devient automatiquement
   `ART-P<DATE>`. Elle est stable et non modifiable.
2. Une photo choisie dans la galerie est recadrée en 3:4, compressée en WebP,
   envoyée dans le bucket public Supabase `produits`, puis remplacée dans le
   formulaire par son URL publique. Aucun lien n'est demandé au commerçant.
3. WhatsApp classique ne joint pas automatiquement le fichier. Le message
   contient un lien public `📷 Photo du coloris : …`; WhatsApp peut en produire
   un aperçu, sans que le site puisse le garantir. Une vraie pièce jointe
   automatique nécessiterait l'API WhatsApp Business et sort de cette tâche.
4. La photo est figée dans la commande : remplacer ou supprimer ensuite la
   photo du produit ne réécrit pas les commandes anciennes.

## Contrat fonctionnel

### Création d'un produit

- Le dashboard crée automatiquement `id` et `ART-…`.
- La photo principale est obligatoire.
- Si le produit possède un axe Coloris/Couleur, une photo est obligatoire pour
  chaque valeur choisie.
- En ligne, une erreur d'upload bloque l'adoption de la photo et affiche une
  erreur ; aucune URL locale `blob:` ne peut être publiée.
- Chaque upload utilise un nouveau chemin pour éviter une ancienne image
  encore servie par le CDN après remplacement.

### Ajout au panier

- Le panier utilise la photo de la valeur Coloris/Couleur sélectionnée.
- Sans photo propre à la variante, il retombe sur la photo principale.
- Le panier conserve `image` avec l'identifiant, le modèle et la variante.

### Enregistrement serveur

- `place_order` relit le produit verrouillé en base.
- Le serveur dérive lui-même la marque, le prix et la photo exacte ; il
  n'accorde aucune confiance au nom, au prix ou à l'image envoyés par le
  navigateur.
- La ligne enregistrée ajoute `image` sans supprimer les champs historiques.
- Les commandes anciennes sans `image` restent lisibles.

### Dashboard

- Chaque ligne d'article affiche une miniature 3:4, la référence `ART-…`, le
  modèle, la variante, la quantité et le prix.
- Pour une ancienne commande sans image, le dashboard tente la photo actuelle
  du produit ; sinon il affiche un emplacement neutre, jamais une image
  inventée.
- Une image cassée n'empêche pas d'afficher les informations textuelles.

### WhatsApp

- Le message conserve toutes les informations textuelles actuelles.
- Sous chaque article, il ajoute le lien absolu de la photo exacte si celui-ci
  est partageable en HTTP(S).
- Les URL `data:`, `blob:` ou privées ne sont jamais envoyées.
- L'absence de photo n'empêche jamais la commande.

## Éventualités couvertes

| Cas | Comportement attendu |
|---|---|
| Produit créé depuis téléphone | Identifiant, référence et URL automatiques |
| Deux coloris | La photo du coloris choisi est figée |
| Aucun axe coloris | Photo principale |
| Photo remplacée après achat | Ancienne commande garde l'ancienne URL |
| Produit renommé/archivé | Commande garde nom, référence et photo |
| Ancienne commande sans image | Repli sur photo actuelle, puis emplacement neutre |
| Upload interrompu | Photo non adoptée, produit non publié avec URL temporaire |
| Image devenue inaccessible | Texte et référence restent utilisables |
| Mode local de démonstration | Image locale affichée, aucun lien `data:` envoyé à WhatsApp |
| URL relative d'un ancien produit | Convertie en URL absolue avant le message |
| Client modifie le payload | Serveur ignore son image et relit le produit |

## Structure et fichiers

- `boutique.js` : résolution de la photo exacte, panier, récapitulatif et
  message WhatsApp.
- `admin.html` : miniatures des commandes et repli historique.
- `supabase/schema.sql` : miroir du contrat `place_order` avec champ `image`.
- Base Supabase : fonction `place_order(jsonb)` mise à jour sans nouvelle table.
- `RECETTE.md`, `GUIDE-ADMINISTRATION.md`, `JOURNAL-DE-REPRISE.md` : mode
  d'emploi, vérifications et reprise.

## Commandes de vérification

```powershell
node --check boutique.js
git diff --check
```

Le script inline d'`admin.html` sera aussi compilé avec `new Function`. Le
parcours local vérifiera deux coloris distincts et une ancienne commande sans
image. La production sera contrôlée à 375 px sans soumettre de fausse
commande.

## Limites et sécurité

- Toujours : dériver la photo côté serveur, garder la compatibilité
  ascendante, n'envoyer que des URL HTTP(S), vérifier le mobile.
- Demande validée avant changement serveur : modification de
  `place_order(jsonb)` et déploiement de son miroir SQL.
- Jamais : exposer `service_role`, rendre public le bucket privé des dossiers,
  accepter une URL `blob:`, supprimer une ancienne image encore référencée par
  une commande, envoyer automatiquement un message externe pendant les tests.

## Critères de réussite

- Un nouveau produit reçoit automatiquement sa référence.
- Une photo venant de la galerie devient une URL Supabase publique sans saisie.
- Deux coloris commandés produisent deux miniatures/liens différents.
- Le serveur enregistre l'image dérivée du produit, pas celle du navigateur.
- Dashboard et WhatsApp montrent la photo exacte ou un repli sûr.
- Les commandes historiques restent fonctionnelles.
- Aucun débordement horizontal à 375 px et aucune erreur JavaScript.

