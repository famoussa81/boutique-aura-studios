# AURA STUDIOS — Dossier de livraison

Boutique e-commerce prête à vendre. Site statique adossé à Supabase,
commande par WhatsApp, sans paiement en ligne.

---

## 1. Ce qui est en service

| | |
|---|---|
| Dépôt | https://github.com/famoussa81/boutique-aura-studios *(privé)* |
| Base de données | Supabase `boutique-aura-studios`, région Paris |
| Tableau de bord base | https://supabase.com/dashboard/project/vgzvavlmmqbxtuhanaqj |
| Hébergement | Vercel, projet lié au dépôt |
| Numéro WhatsApp | +223 76 75 95 15 |

Chaque `git push` redéploie automatiquement.

---

## 2. Il reste trois choses, toutes de votre côté

### Le nom de domaine

Sans lui, l'adresse reste en `.vercel.app`, ce qui fait amateur devant un client.
Une fois le domaine acheté et branché sur Vercel :

```bash
node configurer.mjs --domaine https://votre-domaine.com
```

Cette commande réécrit les douze occurrences du domaine de démonstration dans
les balises canoniques, l'Open Graph, `robots.txt` et le `sitemap.xml`.

### Les mentions légales

Cinq champs vides dans les CGV. Sans eux, les conditions de vente n'ont
aucune valeur juridique.

```bash
node configurer.mjs --enseigne "NOM SARL" --forme "SARL" \
                    --adresse "Rue 224, Porte 15, ACI 2000" \
                    --rccm "MA.BKO.2026.B.1234" --nif "081234567X" \
                    --email "contact@votre-domaine.com"
```

Lancée sans argument, la commande affiche seulement ce qui reste à faire.

### Les photographies

Les visuels actuels viennent de Pexels — licence commerciale, crédits dans
`assets/ATTRIBUTION.md`. **Ce ne sont pas les pièces réellement vendues.**
Un client qui reçoit un vêtement différent de la photo, c'est un litige et un
avis négatif. À remplacer produit par produit depuis l'administration, sans
toucher au code.

---

## 3. Les promesses affichées — à valider avant d'ouvrir

Trois mentions apparaissent en haut de page et sur chaque carte produit :

| Promesse | Réglable ? |
|---|---|
| Paiement à la livraison | c'est le modèle, rien à faire |
| Livraison gratuite partout à Bamako | **oui**, sans minimum d'achat |
| Échange sous 48h | **oui**, champ « Délai d'échange » |

Les deux délais se changent en dix secondes dans Réglages, et la modification
se propage partout — cartes, bandeau, accroche. Laissé vide, le délai d'échange
devient simplement « Échange possible ».

N'annoncez que ce que vous tenez. Une promesse non honorée sur les vingt
premières commandes se paie en bouche-à-oreille, et le bouche-à-oreille est le
seul vrai moteur de vente à Bamako.

---

## 4. Ce que l'administration permet

Connexion par nom d'utilisateur et mot de passe (Supabase Auth). Sept onglets :

- **Tableau de bord** — chiffre d'affaires, commandes en attente, ruptures, activité sur sept jours
- **Commandes** — recherche, filtre par statut, changement de statut qui décrémente vraiment le stock, correction du nom, du numéro et du quartier, retrait d'un article, suppression avec restitution du stock, contact WhatsApp pré-rempli, export CSV
- **Produits** — création, édition, stock par taille, promotions, badges, envoi de photos depuis un téléphone (compressées dans le navigateur avant envoi)
- **Réglages** — WhatsApp, nom, livraison gratuite, délais, bannière, réseaux sociaux, catégories
- **Newsletter** — adresses collectées, export CSV
- **Liste d'attente** — clients à prévenir du retour d'une taille, avec message WhatsApp prêt
- **Avis** — publication et tri des avis clients

---

## 5. Ce qui n'est pas prévu

À dire au client pour éviter tout malentendu :

- Pas de paiement en ligne — la commande passe par WhatsApp
- Pas de codes promo
- Pas de fiche client regroupée par numéro
- Pas de tableau de bord par période au-delà de sept jours
- Pas d'ordre d'affichage personnalisé des produits
- Un seul compte administrateur, sans rôles

---

## 6. Documents

| Fichier | Contenu |
|---|---|
| `AUDIT-LIVRAISON.md` | État détaillé, corrections apportées, mesures |
| `GUIDE-VERCEL-SUPABASE.md` | Mise en service pas à pas |
| `RECETTE.md` | Protocole de test |
| `assets/ATTRIBUTION.md` | Crédits photographiques |
| `configurer.mjs` | Domaine et mentions légales en une commande |
