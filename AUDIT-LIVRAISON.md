# AUDIT DE LIVRAISON — AURA STUDIOS

État du projet après correction. Chaque point est vérifié dans le code source et,
pour les parcours, testé dans un navigateur (boutique + administration).

Périmètre : `index.html` (boutique), `admin.html` (back-office), `catalog.js`,
`supabase-client.js`, `supabase.config.js`, `supabase/schema.sql`, `vercel.json`,
pages de contenu, `assets/`.

---

## ✅ CORRIGÉ

### Sécurité

| Problème | Correction |
|---|---|
| Mot de passe universel `aura2026` en dur, actif même après changement | Système de mot de passe local supprimé. L'authentification passe par **Supabase Auth** (`admin.html`, `tryLogin`) |
| Mot de passe affiché sur la page de connexion et dans le placeholder | Supprimés. La zone d'aide explique désormais d'où vient le compte |
| Mot de passe écrit dans la table `settings`, elle-même en lecture publique | `password` n'est plus jamais persisté. `supabase-client.js` filtre en plus les clés sensibles avant tout envoi (`publicSettings`) |
| `adminEmail` / `adminPassword` livrés dans `supabase.config.js`, téléchargé par tous les visiteurs | Champs supprimés. Le fichier ne contient plus que l'URL et la clé `anon`, toutes deux publiques par nature |
| Portail admin = simple `display:none`, contournable via les devtools | L'interface ne se construit plus sans session (`unlocked`), et les politiques RLS refusent toute lecture des commandes sans session valide |
| Insertion de commandes ouverte à tous (`with check (true)`) | Politique d'insertion publique supprimée. Le seul chemin est la fonction serveur `place_order` |
| En-têtes de sécurité incomplets | `vercel.json` : CSP, HSTS, `X-Frame-Options`, `Permissions-Policy`, `X-Robots-Tag` sur l'admin |

### Déploiement

- **`index.html` créé** (l'ancien `aura-studios-ecommerce.html` a été renommé) : la racine du domaine affiche la boutique. Les liens de `admin.html` suivent.
- `supabase.config.js` : `enabled: false` par défaut ; une URL restée à l'état de gabarit est détectée et **ne déclenche plus aucune requête** (`supabase-client.js`, contrôle `valid`).
- `404.html`, `robots.txt`, `sitemap.xml` ajoutés.
- Favicon déclaré sur toutes les pages.
- `.vercelignore` : la documentation du système de design (`system/`, `brand.html`, sources) n'est plus déployée.

### Données

- **Fausses commandes de démonstration supprimées.** Une boutique neuve démarre avec un historique vide et un chiffre d'affaires à 0.
- **Catalogue unifié dans `catalog.js`**, chargé par les deux pages : la divergence d'images entre boutique et admin ne peut plus exister.
- **Références de commande** : générées par une séquence PostgreSQL côté serveur (`place_order`). Hors ligne, repli sur un suffixe aléatoire (`CMD-20260815-7F3A9`) au lieu d'un compteur par navigateur. Plus d'écrasement de commande.
- **Stock** : `place_order` verrouille la ligne produit (`for update`), vérifie la disponibilité et réserve la quantité dans la même transaction. La survente entre deux appareils n'est plus possible.
- **Prix** : recalculés en base à partir de la table `products`. Une modification des montants depuis la console du navigateur n'a plus aucun effet.

### Éléments d'interface

| Élément | État |
|---|---|
| « Nous contacter sur WhatsApp » | Converti en `<a>` : le lien fonctionne |
| Instagram / TikTok / YouTube | Alimentés par les réglages admin ; l'icône est masquée tant qu'aucune URL n'est renseignée |
| Guide des tailles, Durabilité, CGV, Confidentialité | Pages réelles créées et liées |
| Presse | Lien WhatsApp dédié |
| Favoris (cœur) | Persistés dans `localStorage`, état restauré à chaque rendu, `aria-pressed` correct |
| Newsletter | Enregistrée en base (table `subscribers`) ou localement si Supabase est désactivé. Visible et exportable depuis l'admin |
| Recherche | Filtre désormais la grille principale (bouton « Voir les N résultats » + touche Entrée) |
| Ancres de navigation | Corrigées vers `#produits` |
| Code mort (`data-gonext`, `pad`, `updateOrder` inutilisée) | Supprimé ou câblé |
| Grille vide | Bouton « Voir tout le catalogue » |

### Nouveautés fonctionnelles

- **Export CSV** des commandes (respecte les filtres actifs) et de la newsletter — séparateur `;` et BOM UTF-8, donc lisible par Excel en français.
- **Filtres commandes** : recherche libre (référence, client, téléphone, quartier) et filtre par statut, avec compteur.
- **Onglet Newsletter** dans l'administration.
- **Seuil de livraison offerte réellement appliqué** (champ `freeFrom` dans les réglages), au panier, au récapitulatif, au message WhatsApp et dans le calcul serveur.
- **Réglages étendus** : liens réseaux sociaux, seuil de gratuité.
- **Modale d'erreur de commande** : en cas de refus serveur (stock épuisé, coordonnées invalides), le motif exact est affiché au client.

### Performance

- Photothèque reconstruite en WebP : **4,34 Mo → 0,93 Mo (−79 %)**, 21 visuels. Les originaux d'avant remplacement sont conservés dans `assets-originaux/` (non déployé).
- `width`/`height` sur toutes les images, alignés sur les ratios des conteneurs.
- Préchargement + `fetchpriority="high"` sur l'image d'en-tête, `loading="lazy"` + `decoding="async"` ailleurs.
- Synchronisation Supabase ciblée : seule la ligne modifiée est envoyée, au lieu de tout l'historique à chaque clic.

### Chargement — mesures

Base de données Supabase branchée, mesures prises dans le navigateur :

| | Avant | Après |
|---|---|---|
| DOM prêt | 841 ms | **97 ms** |
| Chargement complet | 861 ms | **111 ms** |
| Ressources bloquant le rendu | 4 | **0** |

Trois leviers :

1. **La feuille Google Fonts ne bloque plus le premier rendu** (`media="print"`
   basculé sur `all` au chargement, repli `<noscript>`). Le texte s'affiche
   aussitôt dans la pile système puis bascule sur Inter — ce que faisait déjà
   `display=swap`, sauf qu'on n'attend plus un aller-retour vers un tiers avant
   de peindre. C'est le gain principal sur une connexion mobile à Bamako.
2. **Graisse 600 retirée** de la requête de police : elle n'apparaissait que
   deux fois dans toute la feuille de style. Les pages de contenu ne chargent
   plus que 400, 700 et 800.
3. **Les trois scripts passent en fin de `body`** : ils bloquaient l'analyse du
   document alors qu'aucun n'est nécessaire avant l'affichage. L'ordre de
   chargement est préservé.

S'y ajoute un `preconnect` vers Supabase : la première requête de données ne
paie plus la résolution DNS ni la poignée de main TLS.

La police se charge bien (28 variantes Inter actives) et la feuille bascule
en `media="all"` comme prévu.

### Accessibilité

- Modales et tiroir panier : `role="dialog"`, `aria-modal`, `aria-hidden` synchronisé, **piège de focus**, fermeture par **Échap**, restitution du focus au bouton d'origine.
- Messages flottants en `role="status" aria-live="polite"`.
- Menu mobile avec `aria-expanded` / `aria-controls`.
- Lien d'évitement « Aller au catalogue ».
- Focus visible sur tous les éléments interactifs.
- Le premier champ en erreur reçoit le focus à la validation du formulaire de commande.

### Administration — gestion complète

| Ajout | Détail |
|---|---|
| **Envoi d'images** | Le fichier est redimensionné et recompressé **dans le navigateur** avant tout envoi (1000 px max, WebP qualité 0,82) : une photo de téléphone passe de plusieurs Mo à quelques dizaines de Ko. En ligne, elle part dans le bucket Supabase Storage `produits` (lecture publique, écriture réservée à une session) ; hors ligne, elle est conservée en base64 dans le navigateur, avec un plafond à 400 Ko pour ne pas saturer le stockage local. Glisser-déposer accepté. |
| **Modifier une commande** | Nom, numéro, quartier corrigeables. Retrait d'un article ligne par ligne. Suppression complète de la commande. |
| **Restitution du stock** | Chaque retrait ou suppression rend au stock exactement ce que la ligne immobilisait, selon le statut : une commande en attente libère la réservation, une commande confirmée réincrémente la quantité. Vérifié dans les deux cas. |
| **Catégories libres** | Ajout, renommage, suppression depuis les réglages. L'identifiant est dérivé du nom (accents retirés). Une catégorie utilisée par des produits ne peut pas être supprimée — le bouton est désactivé et indique le nombre de produits concernés. Les onglets, la navigation, le menu mobile et le pied de page se reconstruisent depuis cette liste. |

Corrigé au passage : les onglets et le menu mobile portaient des écouteurs posés
à l'ouverture de la page. Comme ils sont désormais reconstruits, ces écouteurs
étaient perdus — remplacés par de la délégation.

Également corrigé : `catalog.js` n'était couvert par aucune règle de cache. Le
client modifiait son catalogue et les navigateurs continuaient de servir
l'ancienne version. `vercel.json` impose maintenant `must-revalidate` sur les
scripts.

### Carte produit — refonte

Défaut structurel corrigé : la grille était en dents de scie sur téléphone.

| | Avant | Après |
|---|---|---|
| Hauteurs de carte sur mobile | 312 / 332 / 336 / 356 | **405** — une seule |

Quatre causes empilées, toutes trouvées à la mesure :

1. Les noms passaient sur une ou deux lignes selon leur longueur — deux lignes
   sont désormais réservées en permanence.
2. Sur les produits en promo, les deux montants ne tenaient pas sur une ligne.
   L'ancien prix perd sa devise (« 42 000 » barré, puis « 34 000 FCFA ») et
   rétrécit sur petit écran.
3. `1fr` vaut `minmax(auto, 1fr)` : une colonne s'élargissait dès qu'une carte
   avait un contenu insécable plus large que sa part, et la photo — qui suit un
   aspect-ratio — grandissait avec elle. Remplacé par `minmax(0, 1fr)`, sur la
   grille comme sur la colonne interne de la carte.
4. La mention de stock passait sur deux lignes : elle est désormais tenue sur
   une seule, et n'annonce qu'une taille.

Autres corrections de la carte :

- **Collision badge / favoris supprimée.** Le badge « Bestseller » (108 px)
  mordait sur le cœur des trois cartes concernées. Renommé « Top vente »,
  resserré sur mobile et borné par une largeur maximale : aucun libellé, même
  long, ne peut plus l'atteindre. Vérifié sur les 20 cartes.
- **Cœur porté à 44 × 44 px.** Agrandir seul l'aurait décalé vers la gauche et
  aggravé la collision — d'où le resserrement du badge en même temps.
- **La ligne de catégorie cède la place au délai de livraison.** « Accessoires »
  sous « Bonnet AURA » n'apprenait rien à quelqu'un qui vient de filtrer.
- **Sur écran tactile, le bouton quitte la photo** pour la rangée du dessous :
  le bas du vêtement, où se lit la coupe, redevient visible. Sur ordinateur il
  reste révélé au survol par-dessus l'image, inchangé.
- **Contenant gris sur écran tactile.** Le bouton détaché de la photo ne se
  rattachait plus visuellement à son produit. Un aplat `#f5f5f5` referme la
  carte en un bloc — mécanisme prévu par la charte, qui bannit les ombres au
  profit des décalages de gris.

### Réglages pilotés depuis l'administration

| Champ | Effet |
|---|---|
| **Délai de livraison** | Alimente les 20 cartes produit, le bandeau de réassurance et l'accroche. Une seule source : « 24h » ne peut plus cohabiter avec « 1 semaine ». Testé de bout en bout. |
| **Délai d'échange** | Même principe. Laissé vide, la mention devient « Échange possible » — on n'annonce que ce qu'on tient. |

### Corrections issues de l'audit externe

Audit UX passé sur la version déployée. Deux alertes sur quatre étaient fausses,
vérification faite dans le code et dans le navigateur.

| Alerte | Verdict | Suite |
|---|---|---|
| Les liens du menu ne filtrent pas | **Faux** — « Hoodies » affiche bien 7 hoodies et active l'onglet. L'outil a lu le HTML statique et vu onze `href="#produits"` sans voir l'attribut `data-goto` | Le vrai manque, mal nommé, était l'absence d'adresse par catégorie — corrigé |
| Cibles tactiles sous 44 px | **Vrai** | Onglets de filtre portés à 44 px, cœurs à 44 × 44 |
| Le fond défile derrière la modale | **Vrai** | Verrou par `position:fixed` — seule méthode qui tienne sur iOS — avec restitution exacte de la position. Posé dans `pushLayer`/`popLayer`, les deux seuls points de passage de toutes les couches |
| Fiche produit en `role="alertdialog"` | **Faux** — elle est en `role="dialog"`. La seule `alertdialog` est la modale de refus de commande, ce qui est l'usage exact prévu | Aucune |

### Adresses par catégorie

`?cat=hoodies` ouvre directement la catégorie, y compris après l'arrivée des
réglages depuis Supabase. L'adresse suit le filtre courant sans empiler
d'historique. Les quatre catégories sont déclarées au `sitemap.xml`.

Deux gains concrets : un lien de catégorie devient partageable sur WhatsApp,
et Google indexe cinq pages au lieu d'une.

### Conversion — leviers commerciaux

Le design n'a pas été touché : registre monochrome, boutons pilule, mise à plat
sans ombre. Aucune bibliothèque externe ajoutée — le kit est cohérent, une
dépendance de plus l'aurait délavé.

| Levier | Mise en œuvre | Pourquoi |
|---|---|---|
| Bandeau de réassurance | **Remplace le marquee décoratif** (même bande, même hauteur, même typographie) : paiement à la livraison, délai, échange | Le seul argument qui supprime le risque de l'acheteur était enterré dans la modale de commande |
| Arguments dans le hero | Trois mentions en micro-typo sous l'accroche | La page promettait une émotion, jamais un fait vérifiable |
| Rareté réelle | Sur les cartes, uniquement sous 9 pièces en stock, en gris du système — jamais de rouge | La donnée existait et n'était visible que dans la fiche produit. Aucun compteur simulé : un faux convertit une fois puis brûle la marque |
| Progression livraison offerte | Filet de 2px dans le panier + montant restant. Seuil abaissé de 50 000 à **35 000 FCFA** | À 50 000, le message disait à la majorité « ce n'est pas pour vous ». À 35 000, il se déclenche juste au-dessus d'un hoodie |
| Vente croisée | Deux accessoires disponibles sous la liste du panier, lignes nues sans encadré | Le panier était un cul-de-sac : l'acheteur d'un hoodie ne voyait jamais le bonnet |
| WhatsApp permanent | Pilule noire du système, pas de vert de marque ; libellé masqué sur mobile ; **s'efface quand une modale ou le panier est ouvert** | Beaucoup demandent leur taille avant d'acheter. Le bouton ne doit jamais concurrencer l'action principale |
| Liste d'attente | Sur taille épuisée : capture du numéro, visible dans un onglet dédié de l'administration avec lien « Prévenir » pré-rempli et export CSV | Une rupture, c'est un acheteur qui voulait payer et qu'on laissait partir sans trace |
| Avis clients | Section complète pilotée par l'administration : saisie, note, ordre, suppression. **Masquée tant qu'aucun avis réel n'est saisi** ; les données structurées `AggregateRating` ne sont émises que s'il existe de vrais avis notés | Premier levier de conversion du marché, mais sans valeur s'il est fabriqué. Le dispositif est livré prêt, le contenu appartient au client |

Corrigé au passage : les tailles épuisées étaient `disabled`, donc la liste
d'attente était inatteignable. Elles sont désormais sélectionnables et marquées
comme indisponibles, et un produit entièrement épuisé affiche « Me prévenir du
retour » au lieu d'un bouton mort.

### Référencement

Open Graph, Twitter Card, `canonical`, `theme-color` et données structurées JSON-LD (`Store`) sur la boutique ; `canonical` et description sur chaque page de contenu.

---

## ⚠️ CE QUI RESTE À FAIRE — ACTIONS CLIENT

Ces points ne peuvent pas être clos depuis le code : ils demandent des informations
ou des fichiers que seul le client possède.

### 1. Photographies produits — remplacées, à valider

Les visuels d'origine ne correspondaient pas aux produits et plusieurs portaient
des marques tierces. **Les 21 visuels du site ont été remplacés** par des
photographies Pexels sélectionnées et inspectées une par une :

| Produit | Nouveau visuel |
|---|---|
| Hoodie Oversized « Noir Absolu » | Hoodie noir uni, studio gris (marque tierce effacée par retouche) |
| Hoodie Studio Blanc | Hoodie blanc uni, fond neutre |
| Hoodie Aura Tech | Veste technique noire à capuche |
| Hoodie Urban Flow | Hoodie gris délavé, extérieur |
| Hoodie Trench Noir | Manteau long noir, nuit urbaine |
| T-shirt Graphique AURA | T-shirt noir oversize à imprimé |
| T-shirt Essential Core | T-shirt noir uni, fond neutre |
| T-shirt Oversized Blanc | T-shirt blanc uni, studio |
| T-shirt Print Studio | T-shirt blanc à sérigraphie artistique |
| Pantalon Cargo Technique | Cargo vert kaki, plan resserré |
| Cargo Noir Slim | Cargo noir porté, plan entier |
| Pantalon Cargo Beige | Ensemble beige, studio |
| Casquette Ajustée AURA | Casquette noir et blanc, sans marque |
| Bonnet AURA | Bonnets en maille noir et gris, à plat |

Également remplacés : image d'en-tête, bannière de collection, image éditoriale
et les 4 cartes de catégories.

**Règle de sélection appliquée** : aucun vêtement portant une marque tierce
lisible, aucun visuel inadapté au public de la boutique. Les logos de chaussures,
présents dans quasiment toute la photographie de mode, ont été tolérés : ils ne
trompent pas sur le produit vendu.

**Licence** : Pexels — usage commercial autorisé, attribution non obligatoire.
Les crédits figurent tout de même dans `assets/ATTRIBUTION.md`.

**Ce qui reste à faire** : ces photographies restent des visuels génériques. Un
client qui reçoit un vêtement différent de celui photographié, c'est un litige.
Elles conviennent pour le lancement et la démonstration ; le client doit les
remplacer par les photos de ses propres pièces, produit par produit, depuis
l'administration (champ « Image (URL) », aucun code à toucher).

### 2. Mentions légales à compléter

Trois pages contiennent des mentions `[à compléter]` :

- `cgv.html` — raison sociale, forme juridique, adresse, RCCM, NIF, e-mail
- `confidentialite.html` — adresse du responsable de traitement, e-mail
- `durabilite.html` — remplacer les engagements génériques par les engagements réels

**Faites relire les CGV par un conseil juridique** : ce document engage contractuellement.

### 3. Configuration Supabase

Tant que `supabase.config.js` reste vide, la boutique fonctionne **en mode local** :
les commandes et le stock ne vivent que dans le navigateur du visiteur, et
l'administration n'est pas protégée. Pour une vraie mise en ligne :

1. Créer le projet Supabase, exécuter `supabase/schema.sql` dans le SQL Editor.
2. Renseigner `url` et `anonKey` dans `supabase.config.js`, passer `enabled` à `true`.
3. Créer le compte administrateur : Authentication → Users → Add user.
4. Se connecter à `admin.html` et enregistrer les réglages une première fois pour initialiser la base.

### 4. Domaine

Les URL `https://aura-studios.vercel.app` figurant dans `canonical`, Open Graph,
`robots.txt` et `sitemap.xml` doivent être remplacées par le domaine définitif.

### 5. Réglages à saisir dans l'administration

Numéro WhatsApp réel, frais de livraison, seuil de gratuité, texte de la bannière,
liens Instagram / TikTok / YouTube.

---

## 🔎 PISTES D'ÉVOLUTION (non bloquantes)

| Priorité | Fonctionnalité |
|---|---|
| Moyenne | Notification automatique (e-mail ou WhatsApp) à chaque nouvelle commande |
| Moyenne | Page produit dédiée avec URL propre (partage, référencement) |
| Moyenne | Téléversement d'images depuis l'admin via Supabase Storage, au lieu d'une URL à coller |
| Basse | Codes promo |
| Basse | Avis clients |
| Basse | Thème sombre (les jetons existent déjà dans `system/variables.nike.css`) |
| Basse | Page « Mes favoris » (les favoris sont déjà persistés) |

---

## 📋 RECETTE

Le protocole de test complet, à dérouler avant la remise, est dans [RECETTE.md](RECETTE.md).
