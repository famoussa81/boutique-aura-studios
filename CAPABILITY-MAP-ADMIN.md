# Carte des capacités : refonte de l'administration

## Contexte

Le tableau de bord doit permettre à un commerçant non technicien de gérer la
boutique sans toucher au design. Le MacBook est le poste principal pour les
tâches longues. Le téléphone reste entièrement fonctionnel pour les commandes,
les stocks, la visibilité, l'aperçu et la publication.

| Module id | Responsabilité | Dépend de |
|---|---|---|
| `admin-foundation` | Navigation, accueil, recherche, aide contextuelle et structure responsive | — |
| `taxonomy-management` | Catégories, marques, axes, valeurs, visuels et ordre | `admin-foundation` |
| `catalog-management` | Produits, variantes, stocks, photos, duplication, archivage et actions groupées | `taxonomy-management` |
| `merchandising` | Ordre des produits, nouveautés, vedettes, ruptures et sélections par rayon ou marque | `catalog-management` |
| `content-media` | Textes et images de toutes les zones publiques modifiables | `admin-foundation` |
| `operations` | Commandes, clients, alertes de stock et exports | `catalog-management` |
| `publication-safety` | Brouillons, aperçu, historique, erreurs et synchronisation | `admin-foundation` |

Ordre de construction :

1. `admin-foundation`
2. `taxonomy-management` et `content-media`
3. `catalog-management`
4. `merchandising` et `operations`
5. `publication-safety`

## Principes validés

- Le commerçant modifie le contenu, jamais le design.
- Le MacBook est l'usage principal, sans sacrifier le téléphone.
- Les tâches rapides restent accessibles en quelques gestes sur mobile.
- Le vocabulaire de l'interface reste concret : produit, marque, catégorie,
  stock, photo, brouillon et publication.
- Les modules conservent la compatibilité avec les produits historiques et les
  variantes actuelles.
- Une migration Supabase n'est ajoutée que si le modèle JSON existant ne peut
  réellement pas porter une capacité validée.
