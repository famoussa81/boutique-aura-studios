# Plan — Référencement Google et identité visuelle

**Domaine** : `www.tk-shoes.com` (apex `tk-shoes.com` → 301)
**Date de l'audit** : 8 septembre 2026
**Statut** : plan validé pour exécution, rien n'est encore implémenté

---

## 1. Ce qui est déjà en place

L'audit en production a montré une base bien plus solide qu'attendu. À ne
pas refaire :

| Élément | État | Preuve |
|---|---|---|
| Plan du site dynamique | ✅ | `/sitemap.xml` répond, généré depuis Supabase, une URL par produit actif |
| `robots.txt` | ✅ | Autorise tout, bloque `/admin`, déclare le sitemap |
| Fiches produit rendues serveur | ✅ | `/api/produit` injecte titre, `h1`, prix, photo avant le JS |
| Données structurées produit | ✅ | JSON-LD `Product` complet : `offers`, `price`, `priceCurrency` XOF, `availability`, `brand`, `sku` |
| Données structurées boutique | ✅ | JSON-LD `Store` sur l'accueil, avec adresse et téléphone |
| URL canoniques | ✅ | Pointent toutes sur `www.tk-shoes.com` |
| En-têtes de sécurité | ✅ | CSP, HSTS preload, X-Frame-Options, Permissions-Policy |
| Favicon et icône Apple | ✅ | `assets/brand/` |

**Conséquence** : le site est techniquement prêt à être indexé. Ce qui
manque n'est pas la fondation, c'est la mise en visibilité et la finition.

---

## 2. Les manques identifiés

Classés par impact réel sur « être trouvé quand on tape sur Google ».

### Bloquant

**B1 — Aucune console de recherche connectée.**
Google ne sait pas que `tk-shoes.com` existe. Le domaine a été enregistré
il y a quelques heures : sans déclaration explicite, la découverte
spontanée prend des semaines. C'est le seul point qui empêche
réellement le site d'apparaître.

**B2 — L'image de partage pointe encore sur l'ancien domaine.**
Dans les réglages Supabase, `shareImage` vaut
`https://boutique-aura-studios.vercel.app/...`. Le partage fonctionne, mais
il fait vivre l'ancienne adresse et cassera le jour où le projet Vercel
sera renommé.

### Fort impact

**F1 — Les fiches produit partagent toutes la même image d'aperçu.**
Vérifié en production sur Miller Pavé : le JSON-LD porte bien la photo du
modèle, mais `og:image` retombe sur la bannière générique. Quand le
propriétaire envoie un lien produit sur WhatsApp — son canal principal de
vente — le client voit le logo de la boutique au lieu de la chaussure.

**F2 — Mentions légales vides.**
`legal.rccm`, `legal.nif`, `legal.forme`, `legal.adresse`, `legal.email`
sont des chaînes vides dans les réglages. Google traite l'absence
d'identité commerciale comme un signal de défiance sur un site marchand,
et c'est une obligation légale avant toute communication publique.

**F3 — Pas de contenu ciblant les recherches locales.**
Les pages de marque existent mais ne portent aucun texte. Or les requêtes
qui convertissent sont « claquette Dior Bamako », « sandale Tory Burch
Mali », « claquette homme pas cher Bamako ». Sans quelques lignes de
texte réel par marque, ces pages ne se positionneront pas.

### Finition

**FI1 — Pas de `site.webmanifest`.** Pas d'icône propre à l'ajout sur
écran d'accueil Android, pas de nom d'application.

**FI2 — Jeu d'icônes incomplet.** Il manque le 192 px, l'icône *maskable*
(Android la rogne sinon), et une version SVG du logo.

**FI3 — `image` en chemin relatif** dans le JSON-LD `Store` de l'accueil.
Doit être une URL absolue pour être exploitée.

**FI4 — URL produit en paramètre.** `/produit?id=slug` fonctionne et est
indexable, mais `/produit/tory-burch-miller-pave` serait plus lisible en
résultat de recherche et plus solide à long terme.

**FI5 — Redirection apex à revérifier.** À confirmer par un appel direct
que `tk-shoes.com` renvoie bien un 301 vers `www`.

---

## 3. Le système d'images de marque

C'est la partie « plusieurs logos » demandée. Chaque fichier a un rôle
précis, et c'est le rôle qui dicte le format.

### Les quatre familles

**Le logo complet.** Le nom écrit en entier, horizontal. Il sert dans
l'en-tête du site, sur les factures et en signature d'e-mail. Il lui faut
une version sur fond clair et une sur fond sombre, en SVG pour rester net
à toute taille.
→ `tk-shoes-logo.svg`, `tk-shoes-logo-inverse.svg`

**Le monogramme.** La forme abrégée : les initiales T&K seules, dans un
carré. C'est ce qui sert quand il n'y a pas la place d'écrire le nom —
photo de profil WhatsApp Business, avatar Instagram, onglet du navigateur,
icône d'application. Il doit rester lisible à 16 px, donc plus épais et
plus simple que le logo complet.
→ `tk-shoes-monogramme.svg` et ses déclinaisons matricielles

**Les icônes système.** Générées depuis le monogramme, à des tailles
imposées par les navigateurs et les téléphones. La version *maskable*
prévoit une marge de sécurité, sinon Android rogne dans les lettres.

| Fichier | Taille | Usage |
|---|---|---|
| `favicon.svg` | vectoriel | Navigateurs récents |
| `favicon.ico` | 32 + 16 | Anciens navigateurs |
| `icon-192.png` | 192 | Android |
| `icon-512.png` | 512 | Android, splash screen |
| `icon-maskable-512.png` | 512 | Android, forme adaptative |
| `apple-touch-icon.png` | 180 | iOS |

**Les images de partage.** Le format 1200 × 630 que WhatsApp, Facebook et
X affichent en grand sous un lien. Il en faut deux niveaux : une image
générique pour l'accueil et les pages fixes, et une image par produit,
composée automatiquement — photo du modèle, nom, marque, prix, logo en
coin.

L'infrastructure existe déjà : `/api/share-image` sert aujourd'hui une
image fixe. L'étendre pour accepter un identifiant produit et composer la
carte à la volée règle F1 sans multiplier les fichiers.

### Direction visuelle

Le monogramme se construit sur l'esperluette existante du logo T&K, en
blanc sur le noir `#111111` déjà utilisé comme `theme-color`. Pas de
dégradé, pas d'ombre : ces effets disparaissent à 16 px. Un contour épais
et beaucoup de contraste.

---

## 4. Ordre d'exécution

Découpé pour que chaque étape soit livrable seule.

### Étape 1 — Rendre le site trouvable (30 min)

1. Créer la propriété Google Search Console sur `www.tk-shoes.com`,
   vérification par enregistrement DNS chez Hostinger.
2. Soumettre `https://www.tk-shoes.com/sitemap.xml`.
3. Demander l'indexation manuelle de l'accueil, `/hommes`, `/femmes`,
   `/catalogue`, `/marques`.
4. Même opération sur Bing Webmaster Tools — import direct depuis Search
   Console, deux minutes, et ça couvre aussi les recherches Windows.
5. Vérifier la redirection apex → `www` et le HTTPS.

C'est l'étape qui produit le résultat demandé. Les suivantes améliorent
le classement, celle-ci conditionne l'existence.

### Étape 2 — Réparer les partages (1 h)

1. Corriger `shareImage` dans les réglages Supabase → nouveau domaine.
2. Corriger `og:image` dans `api/produit.js` pour servir la photo du
   modèle.
3. Rendre absolue l'`image` du JSON-LD `Store`.
4. Tester sur le validateur Facebook et en envoyant un lien réel sur
   WhatsApp.

### Étape 3 — Identité visuelle (2 h)

1. Dessiner le monogramme à partir du logo existant.
2. Générer les six icônes système.
3. Écrire `site.webmanifest` et le déclarer dans les pages.
4. Composer l'image de partage générique 1200 × 630.

### Étape 4 — Carte de partage par produit (2 h)

Étendre `/api/share-image` pour accepter `?id=`, composer la carte
(photo, nom, marque, prix, logo) et la mettre en cache. Brancher
`api/produit.js` dessus.

### Étape 5 — Contenu et confiance (3 h)

1. Renseigner les mentions légales réelles : forme juridique, RCCM, NIF,
   adresse, e-mail de contact. **À demander au propriétaire.**
2. Écrire 120 à 200 mots par page de marque, ciblant « marque + type +
   Bamako ».
3. Enrichir le JSON-LD `Store` : horaires, coordonnées géographiques,
   zone de livraison.
4. Créer une fiche Google Business Profile — c'est ce qui fait apparaître
   la boutique dans le bloc local et sur Maps, souvent avant les résultats
   classiques.

### Étape 6 — Finition technique (2 h)

1. Passer les URL produit en chemin propre, avec redirection 301 depuis
   l'ancienne forme.
2. Ajouter un fil d'Ariane `BreadcrumbList` sur les fiches.
3. Mesurer les Core Web Vitals et corriger ce qui dépasse.

---

## 5. Ce qu'il faut attendre comme délai

Il n'y a pas de raccourci sur cette partie, autant le savoir avant.

Après l'étape 1, l'accueil est généralement indexé en 2 à 7 jours. Le
catalogue complet suit sous 2 à 4 semaines. Une recherche sur le nom exact
« T&K SHOES » remonte le site en une à deux semaines.

Les requêtes concurrentielles du type « claquette Bamako » demandent 2 à
4 mois, et dépendent surtout de l'étape 5. Un domaine neuf n'a aucun
historique : c'est le facteur limitant, pas la technique.

La fiche Google Business Profile est l'exception — validée, elle peut
faire apparaître la boutique sur Maps en quelques jours.

---

## 6. Ce qui est bloqué côté propriétaire

Deux choses ne dépendent pas du code et doivent être demandées :

- Les mentions légales réelles (forme juridique, RCCM, NIF, adresse).
- La validation de la fiche Google Business Profile, qui passe par un
  courrier ou un appel à l'adresse de la boutique.

Le reste peut être exécuté sans intervention extérieure.
