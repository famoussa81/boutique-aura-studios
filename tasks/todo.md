# Suivi — `merchandising`

- [x] Ajouter la normalisation des ordres rayon et marque.
  - Acceptation : anciennes sélections préservées, produits inconnus ajoutés,
    seuls les identifiants supprimés/archivés sont purgés.
  - Vérification : scénarios de données ciblés.
- [x] Centraliser l'ordre public et la résolution des vedettes.
  - Acceptation : même ordre sur toutes les surfaces, disponibles avant
    épuisés, remplacement automatique des vedettes indisponibles.
  - Vérification : syntaxe et tests purs.
- [x] Construire l'écran « Classement et vedettes ».
  - Acceptation : rayon ou marque, recherche, quatre vedettes, ordre complet,
    monter/descendre/premier et annulation.
  - Vérification : interaction locale ordinateur et mobile.
- [x] Relier brouillon, aperçu et publication.
  - Acceptation : aucune modification publique avant publication et
    persistance après rechargement.
  - Vérification : mode démonstration puis contrôle Supabase non destructif.
- [ ] Mettre à jour guide, recette et journal.
  - Acceptation : prochain agent peut reprendre sans conversation.
  - Vérification : relecture des documents et `git diff --check`.
- [ ] Déployer et vérifier la production.
  - Acceptation : routes 200, aucune erreur console pertinente, classement
    publié visible.
  - Vérification : navigateur production à 375 px et ordinateur.

## Vérifications réellement exécutées — 28 août 2026

Copie hors ligne `admin-essai.html`, catalogue de démonstration, panneau
déverrouillé en mode local.

| Contrôle | Résultat |
|---|---|
| Écran atteignable depuis l'accueil du tableau de bord | oui |
| Zones proposées | 2 rayons + 15 marques |
| Résumé d'une zone | 28 produits, 4/4 vedettes, 25 disponibles, 3 épuisés |
| « Mettre en premier » | position 5 vers 1 |
| « Descendre » | position 1 vers 2 |
| « Monter » | position 3 vers 2 |
| « Annuler le dernier déplacement » | position rendue, bouton redevenu inactif |
| Retirer une vedette | 4 vers 3, les 24 autres boutons se rouvrent |
| Ajouter une vedette | 3 vers 4, les autres boutons se referment |
| Recherche « dior » | 28 lignes vers 1 |
| Effacer la recherche | retour à 28 lignes, champ vidé |
| Changement de zone vers Hermès | 8 produits, 1/4 vedettes, 6 disponibles, 2 épuisés |
| Persistance après rechargement complet | classement conservé, état « À publier » |
| Aperçu | ouvre le rayon avec le brouillon, bandeau d'aperçu présent |
| Mobile 375 px : cibles sous 44 px | aucune (boutons 68 × 44) |
| Mobile 375 px : débordement horizontal | aucun |
| Syntaxe des deux blocs de script d'`admin.html` | valide |

Piste écartée en cours de route : la comparaison `p.audience === key` du module
paraissait fragile puisque 28 produits sur 46 n'ont pas ce champ en base.
`normalizeProduct()` le pose au chargement, la comparaison est donc sûre.
