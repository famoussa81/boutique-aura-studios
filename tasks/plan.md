# Plan technique — `merchandising`

## Résultat visé

Créer un écran autonome qui pilote l'ordre complet et les quatre vedettes de
chaque rayon ou marque, puis appliquer exactement ces choix sur toutes les
surfaces publiques sans migration Supabase.

## Architecture

1. Normaliser les listes JSON sans modifier les produits.
   - Rayon : `audiencePages[audience].productOrder` et `featuredProducts`.
   - Marque : `collections[].productOrder` et `homeProducts`.
   - Retirer uniquement les identifiants supprimés ou archivés.
   - Conserver les identifiants épuisés ou temporairement masqués.
2. Centraliser le classement public dans `boutique.js`.
   - Produits disponibles d'abord, épuisés ensuite.
   - Ordre manuel dans chaque groupe.
   - Produits non encore classés ajoutés en fin de liste stable.
3. Résoudre les vedettes publiques.
   - Utiliser les choix disponibles dans l'ordre configuré.
   - Compléter jusqu'à quatre avec l'ordre complet.
   - Ne jamais créer de trou quand une vedette devient indisponible.
4. Construire l'écran admin.
   - Sélecteur de zone rayon/marque.
   - Bloc vedettes et bloc ordre complet.
   - Recherche locale, états visibles et boutons tactiles explicites.
   - Annulation de la dernière opération de classement.
5. Brancher aperçu, brouillon et publication existants.
6. Documenter et vérifier localement puis en production.

## Ordre d'implémentation

```text
normalisation des données
        ↓
fonctions pures de classement public
        ↓
écran administrateur et interactions
        ↓
aperçu + publication
        ↓
tests données + rendu mobile/ordinateur
        ↓
documentation + déploiement + production
```

## Fichiers concernés

- `admin.html` — destination, interface, état et interactions.
- `boutique.js` — fonction unique de classement et résolution des vedettes.
- `RECETTE.md` — scénarios fonctionnels et responsive.
- `GUIDE-ADMINISTRATION.md` — mode d'emploi commerçant.
- `JOURNAL-DE-REPRISE.md` — état de fin de tâche.

`supabase/schema.sql` ne change pas. `catalog.js` ne change que si la
normalisation exige une valeur initiale, ce qui n'est pas attendu.

## Risques et protections

| Risque | Protection |
|---|---|
| Perte des vedettes actuelles | Lire les anciennes listes comme source initiale |
| Vedette épuisée supprimée à tort | Ne purger que produit archivé ou inexistant |
| Ordres divergents selon les pages | Une fonction centrale utilisée partout |
| Nouveau produit invisible | Ajouter les identifiants inconnus en fin de liste |
| Classement difficile sur mobile | Boutons texte/position de 44 px, aucune dépendance au glisser-déposer |
| Brouillon ancien écrasant la production | Conserver le correctif `dbLoadAll()` existant |
| Régression syntaxique du monolithe | Extraire le script et exécuter `node --check` |

## Vérification

1. Tests purs des listes avec produits disponibles, épuisés, masqués, archivés
   et nouvellement ajoutés.
2. Syntaxe de `boutique.js` et du script embarqué de `admin.html`.
3. Parcours admin local : choisir une zone, vedette, déplacer, annuler,
   prévisualiser et conserver le brouillon.
4. Rendu à 375 px et 1280 px, sans débordement et avec cibles tactiles.
5. Contrôle que prix, stock, variantes, photos et visibilité ne changent pas.
6. Déploiement sur `main`, puis vérification des routes et de la console en
   production.
