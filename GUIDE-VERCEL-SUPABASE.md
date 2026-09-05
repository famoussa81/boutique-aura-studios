# AURA STUDIOS — Mise en service de la boutique en ligne

Guide de déploiement **Supabase + Vercel**. Environ 20 minutes pour passer
du mode local (localStorage) au mode réel (base de données partagée).

---

## 0. Ce qui change

| | Mode local (par défaut) | Mode réel (après cette configuration) |
| --- | --- | --- |
| Catalogue | localStorage du navigateur | Table `products`, partagée |
| Réglages | localStorage | Table `settings` |
| Commandes | localStorage + WhatsApp | Table `orders` **+** WhatsApp |
| Accès admin | **aucune protection** | Compte Supabase explicitement autorisé |
| Stock | local à chaque navigateur | Décompté côté serveur à la confirmation |
| Prix | lus dans le navigateur | Recalculés en base à chaque commande |
| Newsletter | localStorage | Table `subscribers` |

La boutique reste utilisable sans Supabase, mais **l'administration n'est alors
pas protégée** : ne la publiez sur Internet qu'une fois Supabase configuré.

---

## Projet en service

| | |
|---|---|
| Nom | `boutique-aura-studios` |
| Référence | `vgzvavlmmqbxtuhanaqj` |
| Région | Paris (eu-west-3) |
| URL | `https://vgzvavlmmqbxtuhanaqj.supabase.co` |
| Tableau de bord | https://supabase.com/dashboard/project/vgzvavlmmqbxtuhanaqj |

Tables créées, RLS active, `place_order` en place, bucket `produits` prêt,
catalogue de 20 produits et réglages importés. `supabase.config.js` est
renseigné et `enabled` est à `true`.

**Il reste à créer puis autoriser le compte administrateur** (étape 3) : sans
lui, personne ne peut se connecter à `admin.html`.

Les étapes 1, 2 et 4 ci-dessous ne servent plus qu'à refaire l'installation
depuis zéro, sur un autre projet.

## Mise à jour de sécurité d'une boutique déjà en ligne

Cette mise à jour est obligatoire si la boutique utilisait déjà Supabase.

1. Dans *SQL Editor*, exécuter l'intégralité du fichier `supabase/schema.sql`
   mis à jour.
2. Juste après, autoriser le compte administrateur existant :

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'votre-email@exemple.com'
   on conflict (user_id) do nothing;
   ```

3. Déconnecter puis reconnecter ce compte sur `/admin`. Un autre compte
   Supabase doit désormais recevoir le message « non autorisé ».

Sans l'étape 2, la nouvelle sécurité bloque aussi le bon compte : c'est
normal, puisqu'une session seule n'est plus considérée comme administrateur.

---

## 1. Créer le projet Supabase

1. https://supabase.com → **New project** (offre gratuite suffisante, région proche de l'Europe).
2. Relever le **Project URL** et la clé **anon public** :
   *Settings → API → Project URL / anon public key*.

---

## 2. Créer les tables et la fonction de commande

1. Ouvrir **SQL Editor**.
2. Coller l'intégralité de `supabase/schema.sql` → **Run**.
3. Résultat : les tables de boutique, la liste privée `admin_users`, les
   limites anti-spam, le bucket `produits`, RLS active partout, et la
   fonction serveur `place_order`.

Ce que garantissent les règles d'accès :

- Le public peut **lire** le catalogue et les réglages.
- Le public **ne peut pas** insérer de commande directement : il passe obligatoirement
  par `place_order`, qui valide les coordonnées, **recalcule les montants depuis la base**
  et ne bloque le stock qu'à la confirmation par le commerçant.
- Le public **ne peut jamais lire** les commandes ni la liste des inscrits.
- Seuls les comptes présents dans `admin_users` peuvent écrire les produits et les
  réglages, ou lire/modifier les commandes.

- Le bucket `produits` est **lisible publiquement** (les visuels s'affichent en
  boutique sans connexion) mais **écrivable seulement par un administrateur autorisé** :
  c'est là qu'atterrissent les photos envoyées depuis l'administration.

> La table `settings` est lisible publiquement : n'y stockez jamais de secret.
> Le code s'en assure déjà (filtrage dans `supabase-client.js`).
> Elle contient aussi la liste des catégories et les avis clients — deux
> informations publiques par nature.

---

## 3. Créer le compte administrateur

1. *Authentication → Users → **Add user***.
2. Renseigner un e-mail et un mot de passe robuste.
3. Dans **SQL Editor**, autoriser ce compte (remplacez l'e-mail) :

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'votre-email@exemple.com'
   on conflict (user_id) do nothing;
   ```

4. **Ces identifiants ne se recopient nulle part dans le code** : ils se saisissent
   dans le formulaire de connexion de `admin.html`.

Pour changer le mot de passe plus tard : même écran Supabase.

---

## 4. Configurer `supabase.config.js`

```js
window.AURA_SUPA = {
  enabled: true,
  url: "https://abcd1234.supabase.co",   // Project URL
  anonKey: "eyJhbGciOiJ..."              // clé anon public
};
```

Ce fichier est téléchargé par tous les visiteurs de la boutique : il ne doit
contenir que ces deux valeurs, publiques par nature.

Ne mettez **jamais** la clé `service_role` ici : elle contourne toutes les règles d'accès.

---

## 5. Premier remplissage de la base

1. Ouvrir `admin.html`, se connecter avec le compte créé à l'étape 3.
2. Aller dans **Réglages**, renseigner le numéro WhatsApp, vérifier la livraison
   gratuite partout à Bamako, la bannière et les liens sociaux → **Enregistrer**.
3. Aller dans **Produits**, modifier puis enregistrer un produit : le catalogue local
   est alors envoyé en base.
4. Vérifier dans *Table Editor* que `products` et `settings` sont remplies.

---

## 6. Déployer sur Vercel

1. Créer un dépôt Git contenant le dossier du projet.
2. https://vercel.com → **Add New → Project** → importer le dépôt.
3. Aucun réglage de build (site statique) → **Deploy**.

Le fichier `.vercelignore` exclut automatiquement la documentation du système de
design (`system/`, `brand.html`, sources) : seul le site part en production.

Après déploiement :

- Boutique : `https://votre-domaine.com/`
- Administration : `https://votre-domaine.com/admin`

**Remplacez ensuite l'URL de démonstration.** Une commande suffit :

```bash
node configurer.mjs --domaine https://votre-domaine.com
```

Elle réécrit le domaine dans `index.html` (canonical + Open Graph), les quatre
pages de contenu, `robots.txt` et `sitemap.xml`. Lancée sans argument, elle
affiche seulement ce qui reste à faire.

---

## 7. Vérifier le bon fonctionnement

1. Sur la boutique déployée, passer une commande de test : le message WhatsApp
   s'ouvre **et** la commande apparaît dans `orders` (Table Editor).
2. Vérifier qu'une demande « À confirmer » ne bloque pas artificiellement la paire.
3. Dans l'administration, passer la commande à « Confirmée » : le stock est décrémenté atomiquement.
4. Modifier le prix d'un produit, recharger la boutique : le nouveau prix s'affiche.
5. S'inscrire à la newsletter depuis la boutique : l'adresse apparaît dans l'onglet
   Newsletter de l'administration.
6. Sur une taille épuisée, laisser un numéro : il apparaît dans l'onglet
   Liste d'attente.
7. Dans l'administration, envoyer une photo depuis un téléphone : vérifier
   qu'elle apparaît dans *Storage → produits* et s'affiche en boutique.
8. Ajouter une catégorie dans les Réglages : elle doit apparaître dans les
   onglets et la navigation de la boutique.

Le protocole complet est dans [RECETTE.md](RECETTE.md).

---

## 8. Avant la remise au client

- Supprimer les commandes de test de la table `orders`.
- Vider le `localStorage` du navigateur de test (clés `aura_store_v3`, `aura_cart_v1`,
  `aura_wish_v1`, `aura_news_v1`) ou utiliser une fenêtre privée.
- Compléter les mentions légales de `cgv.html` (forme juridique, adresse, RCCM,
  NIF, e-mail de contact). Le même script s'en charge :

  ```bash
  node configurer.mjs --enseigne "NOM SARL" --forme "SARL"                       --adresse "Rue 224, Porte 15, ACI 2000"                       --rccm "MA.BKO.2026.B.1234" --nif "081234567X"                       --email "contact@votre-domaine.com"
  ```

  Ces informations sont **obligatoires** pour une boutique en ligne : sans elles,
  les CGV n'ont aucune valeur.
- Remplacer les photographies produits (voir la section « Actions client » de
  [AUDIT-LIVRAISON.md](AUDIT-LIVRAISON.md)).
- Transmettre au client les identifiants du compte administrateur Supabase.

---

## Sécurité — ce qu'il faut retenir

- L'accès à l'administration repose **entièrement** sur Supabase Auth. Sans configuration
  Supabase, l'espace admin s'ouvre sans mot de passe : c'est volontaire et annoncé à
  l'écran, car aucun contrôle côté navigateur ne constituerait une vraie protection.
- Les montants et le stock sont décidés par le serveur, jamais par le navigateur.
- Une demande WhatsApp ne réserve pas le stock ; seule sa confirmation le décompte.
- Les demandes publiques (commande, newsletter, liste d'attente) sont limitées côté serveur.
- Une session Supabase seule ne donne pas accès à l'administration : le compte doit être
  enregistré dans `admin_users`.
- Les en-têtes de sécurité (CSP, HSTS, X-Frame-Options, Permissions-Policy) sont
  configurés dans `vercel.json`.
- Charte respectée : palette monochrome, boutons pilule, Inter, rayon 8 px, sans ombres.
