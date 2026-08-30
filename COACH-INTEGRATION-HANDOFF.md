# Passage de relais — marque Coach

Date : 29 août 2026. Ce fichier est la source de vérité pour intégrer Coach
dans le dashboard/Supabase. Les images sont déjà dans le dépôt : **ne rien
regénérer** et ne pas modifier les marquages Coach.

## Ce qui existe déjà

- Bannière de marque : `assets/brand-banners/coach.jpg`
- Miniature de bannière : `assets/thumbs/brand-banners/coach.jpg`
- 10 photos produit verticales, propres, `1200 × 1600` :
  `assets/products/femme/coach-*-studio.jpg`
- 10 miniatures cartes correspondantes :
  `assets/thumbs/cards/products/femme/coach-*-studio.jpg`
- 10 miniatures coloris correspondantes :
  `assets/thumbs/colors/products/femme/coach-*-studio.jpg`

- Logo officiel inchangé : `assets/logos/coach.svg`. Relevé directement sur
  le site officiel Coach, sans génération, redessin ni déformation.

## Produits déjà intégrés et visibles

Ces quatre modèles sont dans le rayon **Femme**, catégorie **Claquettes**,
marque **Coach**. Ils sont les seuls modèles dont le lot fournit une paire
propre, fiable et complète pour chaque coloris retenu.
Les prix ci-dessous sont fictifs et doivent être confirmés/remplacés par le
propriétaire avant la publication.

| Priorité | Produit | Prix fictif | Couleurs et image principale |
|---|---|---:|---|
| 1 | Mule Boucle Signature | 42 000 FCFA | Marron — `assets/products/femme/coach-mule-boucle-marron-studio.jpg` |
| 2 | Claquette Matelassée C | 40 000 FCFA | Bleu — `assets/products/femme/coach-matelassee-bleu-studio.jpg` |
| 3 | Claquette Signature Toile | 38 000 FCFA | Marron — `assets/products/femme/coach-signature-marron-studio.jpg` |
| 4 | Claquette Badge Signature | 36 000 FCFA | Beige — `assets/products/femme/coach-badge-beige-studio.jpg` |

### Coloris à associer aux mêmes fiches

| Produit | Coloris | Image |
|---|---|---|
| Mule Boucle Signature | Marron | `assets/products/femme/coach-mule-boucle-marron-studio.jpg` |
|  | Argent | `assets/products/femme/coach-mule-boucle-argent-studio.jpg` |
|  | Ivoire | `assets/products/femme/coach-mule-boucle-ivoire-studio.jpg` |
| Claquette Matelassée C | Bleu | `assets/products/femme/coach-matelassee-bleu-studio.jpg` |
|  | Ivoire | `assets/products/femme/coach-matelassee-ivoire-studio.jpg` |
|  | Noir | `assets/products/femme/coach-matelassee-noir-studio.jpg` |
|  | Marron | `assets/products/femme/coach-matelassee-marron-studio.jpg` |
|  | Rose | `assets/products/femme/coach-matelassee-rose-studio.jpg` |
| Claquette Signature Toile | Marron | `assets/products/femme/coach-signature-marron-studio.jpg` |
| Claquette Badge Signature | Beige | `assets/products/femme/coach-badge-beige-studio.jpg` |

Pointures de départ proposées : `36, 37, 38, 39, 40, 41`.
Stock fictif par pointure : `2, 3, 4, 4, 3, 2`. À remplacer par le stock réel.

## Ordre à appliquer

1. Créer/compléter la marque **Coach** : accroche `Signature C` ; description
   `Toile signature, cuir souple et détails métalliques dorés. Une sélection
   féminine pensée pour l'été.` ; associer la bannière déjà présente.
2. Créer les quatre produits dans l'ordre du tableau.
3. Ajouter les coloris, chacun avec l'image exacte indiquée. Ne pas créer une
   fiche par couleur : ce sont des variantes d'un même modèle.
4. Dans le classement Femme, placer en premier la Mule Boucle Signature, puis
   la Claquette Matelassée C. Les deux autres restent après.
5. Mettre Coach en avant si une place est libre. Sinon remplacer seulement une
   marque moins importante après accord du propriétaire.
6. Vérifier les cartes, la fiche produit, le changement de couleur et le
   stock. Le bouton « Publier » doit être cliqué uniquement après validation
   du propriétaire.

## Contraintes

- Ne pas utiliser l'IA sur les produits Coach : le monogramme et les textes de
  marque ne doivent jamais être retouchés, complétés ou inventés.
- Ne pas intégrer les doublons ou les autres sources Telegram non retenues.
- La boutique en ligne lit Supabase : modifier uniquement `catalog.js` ne
  suffit pas. L'intégration doit être faite dans le dashboard authentifié,
  puis publiée.
- Ne pas écraser `design-qa.md` : fichier non suivi, hors tâche.

## Tri complet du lot Telegram — génération terminée

Le lot contient **sept familles de modèles**, pas 42 produits distincts. Les
quatre premières sont déjà intégrées ci-dessus. Les trois suivantes possèdent
maintenant des paires studio générées à partir des sources et contrôlées. Elles
sont ajoutées comme fiches masquées avec prix et stock à zéro.

| Famille | Rayon proposé | Sources propres | Décision |
|---|---|---|---|
| Claquette double bride rose | Femme | photo 36 | Paire rose générée, fiche `femme-coach-double-bride-rose` masquée |
| Slide monobloc toile signature | Homme | photos 35, 38-41 | Cinq coloris, fiche `coach-slide-signature-noir` masquée |
| Sabot à boucle toile signature | Homme | photos 26, 27 et 42 | Trois coloris, fiche `coach-sabot-boucle` masquée |

Visuel rattaché au brouillon à la fiche masquée `coach-slide-signature-noir` :
`assets/products/homme/coach-slide-signature-noir-studio.jpg` avec ses deux
miniatures sous `assets/thumbs/cards/products/homme/` et
`assets/thumbs/colors/products/homme/`.

La fiche reste masquée avec prix et stock à zéro tant que le propriétaire
n'a pas renseigné les vraies valeurs dans le dashboard.

Ces nouvelles images sont des générations IA dérivées des photos produit.
Elles restent masquées jusqu'à validation du propriétaire, saisie des prix et
stocks réels, puis contrôle dans l'aperçu du dashboard.
