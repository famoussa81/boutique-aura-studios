# RECETTE — AURA STUDIOS

Protocole de vérification avant remise. À dérouler **sur ordinateur et sur mobile**.
Chaque ligne se coche uniquement après avoir réellement effectué l'action.

Serveur local de test :

```bash
python -m http.server 8899
```

Puis ouvrir `http://localhost:8899/`.

---

## 1. Boutique — navigation

- [ ] La racine `/` affiche la boutique (pas d'erreur 404)
- [ ] La bannière d'annonce affiche le texte des réglages
- [ ] Logo → remonte au catalogue
- [ ] Les 5 liens de navigation filtrent le catalogue et défilent jusqu'à la grille
- [ ] Menu mobile : ouverture, fermeture, fermeture au clic sur un lien
- [ ] Les 4 cartes de catégories filtrent la bonne catégorie
- [ ] Les 5 onglets de filtre fonctionnent et l'onglet actif est mis en évidence
- [ ] Les 2 boutons de l'en-tête et les 2 boutons de la bannière de collection défilent vers le catalogue
- [ ] Aucun défilement horizontal sur mobile

## 2. Boutique — catalogue

- [ ] Les 14 produits s'affichent avec image, nom, catégorie et prix
- [ ] Aucune image cassée (faire défiler toute la page)
- [ ] Les badges s'affichent (Nouveau, Bestseller, -20 %)
- [ ] Un produit sans stock affiche « Rupture de stock » et son bouton est désactivé
- [ ] Cœur favori : bascule, message, **état conservé après rechargement de la page**
- [ ] Recherche : ouverture, résultats en direct, clic sur un résultat ouvre la fiche
- [ ] Recherche : « Voir les N résultats » filtre la grille et referme la modale
- [ ] Touche Entrée dans la recherche : même comportement
- [ ] Recherche sans résultat : message + bouton « Voir tout le catalogue »

## 3. Boutique — fiche produit

- [ ] Ouverture depuis une carte et depuis un résultat de recherche
- [ ] Miniatures : le clic change l'image principale
- [ ] Sélection de taille : les tailles épuisées sont désactivées
- [ ] La ligne de stock affiche la quantité réelle de la taille choisie
- [ ] Le sélecteur de quantité s'arrête au stock disponible
- [ ] « Ajouter au panier » ajoute et ouvre le tiroir
- [ ] « Commander maintenant » ajoute et ouvre le tunnel de commande
- [ ] Fermeture par la croix, par la touche **Échap**, focus rendu au bouton d'origine

## 4. Boutique — panier

- [ ] Compteur de l'en-tête à jour, animation à l'ajout
- [ ] Sous-total, livraison et total corrects
- [ ] **Livraison affichée « Offerte » dès le seuil configuré atteint**
- [ ] `+` / `−` modifient la quantité ; `−` à 1 retire la ligne
- [ ] « Retirer » supprime la ligne
- [ ] Message « Stock disponible limité » quand on dépasse le stock
- [ ] Panier vide : illustration + bouton « Découvrir la collection »
- [ ] Le panier survit au rechargement de la page

## 5. Boutique — commande

- [ ] « Passer commande » sur panier vide : message d'avertissement
- [ ] Nom vide / trop court : erreur affichée, focus sur le champ
- [ ] Téléphone à moins de 8 chiffres : erreur
- [ ] Quartier vide : erreur
- [ ] La liste de quartiers propose des suggestions
- [ ] Commande valide : écran de confirmation avec référence unique
- [ ] Le message WhatsApp contient les articles, le sous-total, la livraison (« Offerte » le cas échéant), le total, le client et le quartier
- [ ] Chaque article commandé conserve la marque, le modèle, la pointure, le coloris et sa référence `ART-…`, même si le nom est masqué sur la carte publique
- [ ] « Ouvrir WhatsApp » pointe vers le bon numéro
- [ ] « Copier le texte de la commande » copie et confirme
- [ ] Le panier est vidé après la commande
- [ ] Le stock du produit commandé est réservé
- [ ] *(Supabase actif)* Commande d'un article en rupture : message d'erreur explicite, aucune commande créée

## 6. Boutique — pied de page

- [ ] Les 5 liens « Boutique » filtrent le catalogue
- [ ] Livraison à Bamako → WhatsApp
- [ ] Guide des tailles → page dédiée
- [ ] Suivi de commande → WhatsApp
- [ ] Contact WhatsApp → WhatsApp
- [ ] Notre histoire → section éditoriale
- [ ] Durabilité → page dédiée
- [ ] Presse → WhatsApp
- [ ] Espace vendeur / Administration → `admin.html`
- [ ] CGV et Confidentialité → pages dédiées
- [ ] Icônes sociales : masquées si aucune URL, sinon ouvrent le bon profil
- [ ] Newsletter : e-mail invalide refusé, e-mail valide confirmé
- [ ] « Nous contacter sur WhatsApp » (section éditoriale) ouvre bien WhatsApp

## 7. Pages de contenu

- [ ] `cgv.html`, `confidentialite.html`, `guide-des-tailles.html`, `durabilite.html`, `404.html` s'affichent correctement
- [ ] Le lien « Retour à la boutique » fonctionne sur chacune
- [ ] Les tableaux défilent horizontalement sur mobile sans casser la page
- [ ] **Plus aucune mention `[à compléter]`** (à vérifier après remplissage par le client)

## 8. Administration — accès

- [ ] Sans Supabase : l'écran d'accueil annonce clairement le mode local et l'absence de protection
- [ ] Avec Supabase : e-mail et mot de passe demandés
- [ ] Mauvais identifiants : message d'erreur, aucun accès
- [ ] Bons identifiants : accès accordé
- [ ] Rechargement de la page : la session est vérifiée auprès du serveur
- [ ] Déconnexion : retour à l'écran de connexion
- [ ] **`aura2026` ne donne aucun accès**

## 9. Administration — tableau de bord

- [ ] Chiffre d'affaires, commandes en attente, ruptures, total produits corrects
- [ ] Boutique neuve : chiffre d'affaires à 0, **aucune commande fictive**
- [ ] Graphique des 7 derniers jours cohérent
- [ ] Date du jour affichée en français

## 10. Administration — commandes

- [ ] La commande passée en test apparaît
- [ ] Recherche par référence, client, téléphone, quartier
- [ ] Le détail d'une commande affiche la référence `ART-…` de chaque article
- [ ] Filtre par statut + compteur cohérent
- [ ] Changement de statut : En attente → Confirmée décrémente le stock
- [ ] Confirmée → Annulée restitue le stock
- [ ] Bouton WhatsApp : message pré-rempli au bon numéro
- [ ] Export CSV : fichier téléchargé, accents corrects dans Excel
- [ ] Aucune commande : message « Aucune commande pour le moment »

## 11. Administration — produits

- [ ] Les 14 produits sont listés avec vignette, prix et stock par taille
- [ ] La recherche Produits retrouve une paire avec sa référence `ART-…`
- [ ] « Modifier » remplit le formulaire
- [ ] Modification du prix : visible immédiatement en boutique
- [ ] « Masquer » / « Afficher » : le produit disparaît/réapparaît en boutique
- [ ] « Supprimer » : confirmation demandée puis suppression
- [ ] Création : nom, prix, image et au moins une taille sont exigés
- [ ] Aperçu de l'image lors de la saisie de l'URL
- [ ] Modification des tailles : le stock réservé existant est préservé

## 11 bis. Administration — classement et vedettes

- [ ] L'écran s'ouvre depuis l'accueil du tableau de bord
- [ ] Le menu propose les deux rayons puis toutes les marques
- [ ] Le rappel indique produits, vedettes, disponibles et ruptures
- [ ] « Monter », « Descendre » et « Premier » déplacent la bonne paire
- [ ] « Annuler le dernier déplacement » revient à l'état précédent
- [ ] Une cinquième vedette est refusée, les boutons se grisent à quatre
- [ ] Retirer une vedette rouvre les boutons des autres
- [ ] La recherche filtre par nom et par marque, « Effacer » la vide
- [ ] Changer de zone conserve le classement de la zone quittée
- [ ] Après rechargement complet, le classement est toujours là
- [ ] L'état passe à « À publier » et la boutique ne bouge pas avant publication
- [ ] « Voir cette zone avant publication » ouvre le rayon ou la marque en aperçu
- [ ] En boutique, les paires disponibles précèdent les paires épuisées
- [ ] Une vedette épuisée est remplacée, puis revient après réapprovisionnement
- [ ] À 375 px : aucune cible sous 44 px, aucun débordement horizontal

## 12. Administration — réglages et newsletter

- [ ] Numéro WhatsApp invalide refusé
- [ ] Frais de livraison négatifs refusés
- [ ] Lien social sans `https://` refusé
- [ ] Enregistrement : effet immédiat sur la boutique (nom, bannière, frais, seuil, icônes)
- [ ] Onglet Newsletter : les inscriptions apparaissent
- [ ] Export CSV de la newsletter

## 13. Technique

- [ ] **Console du navigateur vierge de toute erreur** sur la boutique et sur l'admin
- [ ] Aucune requête en échec dans l'onglet Réseau
- [ ] `supabase.config.js` ne contient **ni mot de passe ni clé `service_role`**
- [ ] Navigation complète au clavier (Tab) possible
- [ ] Contraste et focus visibles
- [ ] Test sur Chrome, Safari et sur un vrai téléphone

## 14. Après déploiement

- [ ] Le domaine racine affiche la boutique
- [ ] `/404` inexistant → page 404 personnalisée
- [ ] `/robots.txt` et `/sitemap.xml` accessibles
- [ ] URL du domaine définitif reportée dans `canonical`, Open Graph, `robots.txt`, `sitemap.xml`
- [ ] En-têtes de sécurité présents (vérifier dans l'onglet Réseau)
- [ ] Une commande de test réelle arrive bien sur le WhatsApp du client
- [ ] `system/` et `brand.html` ne sont pas accessibles en ligne
