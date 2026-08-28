# Spécification : fondation du nouveau dashboard

Module : `admin-foundation`

## Objectif

Réorganiser l'administration existante pour qu'un commerçant puisse comprendre
où aller, ce qui demande son attention et ce qui sera publié, sans formation
technique.

Le MacBook est le poste principal pour les tâches longues. Le téléphone doit
rester complet et confortable pour consulter les commandes, corriger un stock,
masquer un produit, prévisualiser et publier.

### Parcours attendus

1. En arrivant, le commerçant voit les actions prioritaires et l'état de la
   boutique.
2. Il atteint Produits, Commandes, Contenu, Organisation ou Réglages sans
   devoir deviner ce qui se cache derrière « Site » ou « Plus ».
3. Il retrouve une fonction ou un produit avec une recherche globale.
4. Chaque écran explique en une phrase ce qu'il permet de changer.
5. L'état « enregistré en brouillon », « à publier », « publié » ou « hors
   ligne » reste visible et compréhensible.
6. Une action rapide commencée sur téléphone reste possible jusqu'au bout.

## Pile technique

- HTML statique, CSS et JavaScript sans compilation.
- `admin.html` pour l'interface et sa logique actuelle.
- `catalog.js` pour la graine de catalogue et les réglages par défaut.
- `supabase-client.js` pour l'authentification, les données, les brouillons et
  les publications.
- Supabase Auth, Database et Storage existants.

Aucune dépendance d'interface supplémentaire n'est requise pour ce module.

## Commandes

Serveur de vérification locale :

```powershell
python -m http.server 4173
```

Contrôle syntaxique du JavaScript embarqué :

```powershell
node --check admin-script.js
```

Le script embarqué sera extrait temporairement pour ce contrôle, sans publier
le fichier d'extraction.

Contrôle des fichiers modifiés :

```powershell
git diff --check
git diff -- admin.html
```

Vérification finale :

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://boutique-aura-studios.vercel.app/admin
```

## Structure du projet

```text
admin.html              -> interface, styles et logique du dashboard
catalog.js              -> données initiales et réglages par défaut
supabase-client.js      -> accès distant et publication
supabase/schema.sql     -> miroir du schéma déployé
tasks/                  -> plan et suivi de l'implémentation
RECETTE.md              -> parcours fonctionnels à vérifier
GUIDE-ADMINISTRATION.md -> documentation destinée au commerçant
```

## Structure d'interface

### Ordinateur

- Barre latérale persistante : Aujourd'hui, Commandes, Produits, Contenu,
  Organisation, Clients, Réglages.
- En-tête compact avec recherche globale, état de publication et accès à la
  boutique.
- Zone centrale large, sans formulaire dans une petite modale.
- Panneau latéral facultatif uniquement pour un résumé ou une aide courte.

### Téléphone

- Navigation inférieure limitée à cinq entrées : Aujourd'hui, Commandes,
  Produits, Contenu et Plus.
- Les destinations secondaires apparaissent dans Plus, avec des libellés et
  des descriptions.
- Les tableaux deviennent des cartes lisibles.
- Les actions principales restent visibles sans défilement horizontal.
- Les cibles tactiles mesurent au moins 44 × 44 px.

### Accueil du dashboard

- Actions prioritaires calculées : nouvelles commandes, stock faible, produits
  incomplets, changements à publier.
- Résumé compact : commandes à traiter, produits visibles, ruptures et chiffre
  des commandes terminées.
- Raccourcis : ajouter un produit, corriger un stock, modifier l'accueil,
  prévisualiser.
- Une carte « Prendre en main » peut être masquée après utilisation.

### Recherche globale

- Recherche de produits, commandes, catégories, marques et écrans du dashboard.
- Résultats regroupés par type avec une action explicite.
- Aucune recherche distante à chaque frappe : filtrage local des données déjà
  chargées.

## Style de code

Le code reste en JavaScript compatible avec le projet, avec fonctions courtes,
libellés métier et échappement systématique des valeurs injectées :

```javascript
function adminDestination(label, view, description) {
  return '<button type="button" class="admin-destination" data-view="' +
    esc(view) + '"><b>' + esc(label) + '</b><span>' +
    esc(description) + '</span></button>';
}
```

- Aucun `any`, framework ou dépendance ajoutée.
- Une table de correspondance utilisée au démarrage reste dans la fonction qui
  l'utilise.
- Les identifiants techniques ne sont jamais demandés au commerçant.
- Les styles utilisent les variables existantes et une échelle d'espacement de
  4/8 px.

## Stratégie de test

### Fonctionnel

- Connexion et déconnexion.
- Accès à chaque destination depuis ordinateur et téléphone.
- Retour vers l'écran précédent sans perte de filtre ou de recherche.
- Recherche globale avec résultats et état vide.
- Affichage correct des états brouillon, publié, hors ligne et conflit.

### Responsive

- Vérification à 375, 768, 1024 et 1440 px.
- Aucun débordement horizontal.
- Aucun contrôle tactile sous 44 px sur mobile.
- Barre fixe ne masquant aucun champ ni bouton.

### Accessibilité

- Navigation complète au clavier.
- Focus visible et non masqué.
- Libellé accessible pour chaque bouton à icône.
- Ordre des titres cohérent.
- Contraste de texte d'au moins 4,5:1.

### Régression

- Les écrans existants restent atteignables.
- Aucune donnée n'est modifiée par un simple changement d'écran.
- Commandes, brouillons et publication gardent leur comportement actuel.

## Limites

### Toujours faire

- Employer le vocabulaire du commerçant.
- Montrer une seule action principale par écran.
- Conserver une explication courte près des réglages complexes.
- Préserver les modifications locales déjà présentes dans `admin.html`.
- Vérifier le rendu réel après chaque tranche fonctionnelle.

### Demander avant

- Modifier le schéma Supabase.
- Ajouter une dépendance ou une étape de compilation.
- Changer les règles d'authentification ou les droits d'accès.
- Autoriser la personnalisation libre du design public.

### Ne jamais faire

- Exposer une clé `service_role`.
- Publier `admin-essai.html`.
- Employer « collection » dans l'interface commerçant.
- Réinitialiser silencieusement un brouillon ou une saisie.
- Masquer une fonction essentielle derrière une icône sans texte.

## Critères de réussite

- Les sept destinations principales sont visibles sur ordinateur sans passer
  par un écran intermédiaire.
- Les cinq destinations mobiles donnent accès à toutes les fonctions.
- Un nouveau commerçant peut trouver Produits, Marques, Catégories, Page
  d'accueil et Livraison sans aide extérieure.
- Toute recherche retourne un résultat exploitable en moins de 100 ms avec le
  catalogue actuel.
- Aucun écran ne déborde horizontalement à 375 px.
- Les fonctions existantes de commande, stock, brouillon et publication passent
  leurs tests de régression.
- Le dashboard reste utilisable hors ligne pour les brouillons autorisés et
  explique clairement les actions bloquées.

## Questions ouvertes

Aucune pour ce module. Les choix détaillés concernant produits, médias et
organisation seront définis dans leurs spécifications respectives.
