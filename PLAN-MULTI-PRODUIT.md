# Plan — Boutique multi-produit, entièrement pilotable

Objectif : passer d'une boutique de vêtements à une boutique **vendable à
n'importe quel commerçant**, où le propriétaire modifie presque tout depuis
son administration, sans qu'aucun réglage ne puisse abîmer le design.

---

## Règle qui gouverne tout le plan

> **Le commerçant modifie le contenu, jamais le design.**

Il choisit ses photos, ses mots, ses catégories, ses tailles, ses couleurs.
Il ne touche ni aux polices, ni aux couleurs de l'interface, ni aux espacements,
ni aux mises en page.

C'est cette règle qui garantit que le site restera beau quoi qu'il saisisse.
Elle se traduit par trois mécanismes concrets :

| Mécanisme | Effet |
|---|---|
| **Longueurs plafonnées** | Chaque champ de texte a une limite, imposée dans le formulaire et à l'affichage. Un titre trop long est coupé, jamais déformé. |
| **Ratios imposés** | Toute image envoyée est recadrée automatiquement dans le navigateur au format exact de son emplacement — 16/10 pour l'en-tête, 16/9 pour la bannière, 4/5 pour l'éditorial, 4/3 pour les catégories, 3/4 pour les produits. Une photo mal cadrée atterrit quand même dans un cadre juste. |
| **Sections masquables** | Un commerçant sans histoire de marque masque le bloc éditorial au lieu d'y écrire du remplissage. Mieux vaut une section absente qu'une section vide. |

Aucun sélecteur de couleur, aucun choix de police, aucun réglage d'espacement
ne sera proposé. C'est délibéré.

---

## Phase 0 — Sécuriser l'existant

La boutique est en production et fonctionne. Ce chantier touche la fonction
`place_order`, celle qui verrouille la ligne produit et réserve le stock de
façon atomique. Une erreur à cet endroit, c'est de la survente ou des commandes
perdues — pas un défaut d'affichage.

1. Branche `multi-produit`, la production reste sur `main`
2. Recette de référence enregistrée avant toute modification
3. Migration SQL écrite pour être rejouable sans dégât
4. Fusion seulement après recette complète repassée

---

## Phase 1 — Modèle de variantes

### Le choix

**Deux axes, facultatifs, renommables.** Ni un seul axe, ni un nombre libre.

Un seul axe ne règle que les pointures : les couleurs resteraient des produits
séparés, le catalogue passerait de 20 à 60 fiches, et la grille mobile qu'on
vient de densifier serait ruinée.

Un nombre libre d'axes — le modèle Shopify — est techniquement supérieur et
commercialement intenable ici : 5 tailles × 4 couleurs × 2 matières font
40 cellules de stock à remplir. Un commerçant qui gère son stock sur un
téléphone n'ouvrira pas ce tableau deux fois.

### La forme des données

Une catégorie déclare ses axes :

```js
{
  key: "crocs", label: "Crocs",
  axes: [
    { name: "Pointure", values: [{ v: "36" }, { v: "37" }, …] },
    { name: "Couleur",  values: [{ v: "Noir", hex: "#111111", img: "…" }, …] }
  ]
}
```

Un produit choisit un sous-ensemble et porte son stock :

```js
{
  id, name, cat, price, oldPrice, badge, desc, active, stockout,
  imgs: ["…", "…"],
  axes: [
    { name: "Pointure", values: ["40", "41", "42"] },
    { name: "Couleur",  values: ["Noir", "Kaki"] }
  ],
  variants: {
    "40::Noir": { s: 3, r: 0 },
    "40::Kaki": { s: 2, r: 0 },
    …
  }
}
```

Quatre décisions à l'intérieur du modèle :

**Les axes sont facultatifs.** Un parfum n'en a aucun : `variants: { "": {s, r} }`,
un seul chiffre de stock. Aucun cas particulier dans le code de disponibilité.
Aujourd'hui il faut inventer « Taille unique » pour un bracelet — c'est une rustine.

**Les axes sont renommables.** *Pointure* pour les sneakers, *Contenance* pour
un parfum, *Longueur* pour des mèches. C'est ce qui fait passer la boutique de
« vendable à un vendeur de hoodies » à « vendable à n'importe quel commerçant ».

**Une valeur de couleur porte une pastille et une photo.** Choisir « Kaki »
change la photo principale. Un sélecteur de couleur qui ne change pas l'image
donne l'impression d'un site cassé.

**Le séparateur `::` est interdit dans les valeurs**, contrôlé à la saisie.

### Ce que ça touche

| Fichier | Points |
|---|---|
| `catalog.js` | `SIZES`/`SLABEL` supprimés, axes portés par les catégories |
| `index.html` | 14 lectures de `p.sizes`, clé de panier `id::v1::v2` en 4 endroits, sélecteur de taille devenu sélecteur d'axes, message WhatsApp, liste d'attente, mention de stock |
| `admin.html` | 9 lectures, formulaire produit, grille de stock, liste produits, changement de statut, édition de commande |
| `schema.sql` | `place_order` lit `variants`, contrainte de la liste d'attente assouplie |
| Migration | Les 20 produits existants convertis sans perte de stock |

### Le point de vigilance base de données

La contrainte actuelle **rejette** toute taille hors de `S/M/L/XL/XXL/TU`. Une
pointure 42 en liste d'attente serait refusée par PostgreSQL, silencieusement
pour le client. Elle devient un contrôle de format borné en longueur.

### L'interface d'administration

C'est là que ce type de projet échoue d'habitude. Trois partis pris :

- **Affichage progressif** : un produit sans second axe n'affiche aucune trace
  du second axe. La complexité n'apparaît que si on l'utilise.
- **Pas de matrice brute** : le stock se saisit par ligne du premier axe, avec
  le second axe en colonnes dans un tableau défilable horizontalement.
- **Report en un clic** : « appliquer cette quantité à toutes les couleurs »,
  parce que dans la vraie vie le stock est souvent identique.

---

## Phase 2 — Médias produits

- **Plusieurs images par produit**, réordonnables, supprimables
- **Une image par valeur de couleur**, qui pilote la photo principale
- **Galerie de la fiche produit** réagissant au choix de couleur
- **Pastilles de couleur sur la carte** : le client voit les coloris sans ouvrir

Toutes les images passent par la compression navigateur déjà en place — 1000 px,
WebP qualité 0,82 — puis par le recadrage au ratio de l'emplacement.

---

## Phase 3 — Contenu de la page d'accueil

Aujourd'hui figé dans le HTML, donc intouchable par le propriétaire :

| Bloc | Ce qui devient modifiable |
|---|---|
| En-tête | Image, pastille, sur-titre, titre, sous-titre, libellés des deux boutons |
| Bandeau de réassurance | Les trois titres et leurs trois descriptions |
| Cartes de catégories | Une image par catégorie |
| Bannière collection | Image, sur-titre, titre, texte, libellés des deux boutons |
| Éditorial | Image, sur-titre, titre, texte, les trois piliers |
| Newsletter | Titre, texte, mention |
| Pied de page | Ligne de marque |
| Identité | Logo et favicon |

Chaque bloc porte un interrupteur d'affichage.

Rappel de la règle : longueurs plafonnées, ratios imposés, aucun réglage de style.

---

## Phase 4 — Pages de contenu

**Le guide des tailles** est aujourd'hui un guide de vêtement — poitrine,
longueur, épaules. Sans rapport avec une pointure. Il devient un bloc par
catégorie : un titre, un paragraphe, et un tableau dont le commerçant définit
les colonnes et les lignes.

**Les mentions légales** deviennent des réglages : dénomination, forme
juridique, adresse, RCCM, NIF, e-mail de contact. Elles s'injectent dans les
CGV et la page de confidentialité. Cela supprime l'étape `configurer.mjs` pour
la partie légale et permet au propriétaire de corriger lui-même.

---

## Phase 5 — Marchandisage

- **Ordre d'affichage** des produits, par glisser-déposer
- **Mise en avant** : les produits marqués passent en tête
- Le tri par défaut se règle par catégorie

---

## Phase 6 — Recette, migration, mise en ligne

1. Recette complète repassée : parcours d'achat, filtres, recherche, favoris,
   liste d'attente, newsletter, administration, sur mobile et ordinateur
2. Migration des 20 produits vérifiée : aucun stock perdu, aucune commande cassée
3. Contrôle du rendu à trois largeurs — 375, 768, 1280
4. Fusion dans `main`, déploiement, vérification en production
5. `LIVRAISON.md` et `AUDIT-LIVRAISON.md` mis à jour

---

## Registre des risques

| Risque | Gravité | Parade |
|---|---|---|
| Erreur dans `place_order` : survente ou commande perdue | **Critique** | Branche séparée, production intacte, recette complète avant fusion |
| Migration abîmant le stock des 20 produits | **Élevée** | Migration idempotente, rejouable, vérifiée sur les compteurs avant/après |
| Administration devenue trop complexe, le commerçant abandonne | **Élevée** | Affichage progressif, second axe invisible s'il n'est pas utilisé, report de stock en un clic |
| Design abîmé par les contenus saisis | **Élevée** | Longueurs plafonnées, ratios imposés au recadrage, aucun réglage de style exposé |
| Saturation du stockage navigateur en mode local | Moyenne | Les médias multiples exigent Supabase ; plafond maintenu en mode local |
| Rupture de compatibilité avec les commandes déjà passées | Moyenne | Les commandes gardent leur libellé de variante figé, jamais relu depuis le produit |

---

## Ce que je n'inclus pas, et pourquoi

**Le prix par variante.** Un parfum 50 ml et 100 ml n'ont pas le même prix.
Mais le prix est recalculé côté serveur dans `place_order` — c'est la protection
contre la manipulation des montants depuis la console du navigateur. Y toucher
en même temps que le modèle de variantes, c'est cumuler deux risques sur la
même fonction. À faire dans un second temps, une fois les variantes stabilisées.

**Un troisième axe.** Voir le raisonnement de la phase 1.

**Un choix de thème ou de couleurs.** C'est la porte ouverte au site laid.
Le design monochrome est un actif : il tient parce qu'il n'est pas négociable.

---

## Ordre d'exécution

Phase 0 → 1 → 2 → 3 → 5 → 4 → 6

La phase 4, la plus longue et la moins urgente, passe après le marchandisage :
un guide des tailles générique se remplit à la main en attendant, alors qu'un
catalogue mal ordonné se voit tout de suite.
