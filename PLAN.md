# Boutique multi-produits — plan complet et état de livraison

Ce document est le plan que la boutique suit, et l'état exact de ce qui est
livré. Il remplace toute note antérieure.

---

## La règle qui gouverne tout

> **Le commerçant modifie le contenu. Il ne peut pas modifier le design.**

C'est le cœur du produit vendu. Un commerçant qui peut tout changer finit par
casser sa vitrine en trois semaines ; un commerçant qui ne peut rien changer
appelle son développeur pour un prix. La ligne passe exactement ici :

| Il modifie | Il ne peut pas toucher |
|---|---|
| Tous les textes, dans des champs à longueur bornée | Les couleurs, les polices, les espacements |
| Toutes les images, recadrées automatiquement | Le format des images, la mise en page |
| Produits, marques, catégories, déclinaisons, stocks | La structure des pages |
| Allumer ou éteindre un bloc entier | L'ordre des blocs |

Trois mécanismes appliquent cette règle sans qu'il ait à y penser :

1. **Recadrage imposé.** Chaque emplacement a son format (16/10 pour
   l'en-tête, 16/9 pour la bannière, 4/5 pour la présentation, 4/3 pour les
   cartes, 3/4 pour les produits). Une photo de téléphone est recadrée au
   centre, redimensionnée à 1000 px et compressée en WebP avant l'envoi. Une
   photo ne peut pas déformer une page.
2. **Longueurs bornées.** Chaque champ a son maximum : 60 caractères pour un
   titre, 28 pour un bouton. Un titre trop long ne peut pas déborder.
3. **Extinction plutôt que vide.** Un bloc sans contenu s'éteint. Un bloc
   vide fait plus de mal qu'un bloc absent.

---

## Le modèle de données

Deux classements coexistent, et c'est ce qui rend la boutique multi-produits
sans la rendre confuse.

**La catégorie répond à « c'est quoi ? »** — claquettes, mules, sacs, montres.
Elle porte les **déclinaisons** : jusqu'à deux axes, nommés librement.
Pointure × Coloris pour des chaussures, Taille × Couleur pour du textile,
Contenance pour un parfum. Chaque valeur peut porter une pastille de couleur
et sa propre photo.

**La marque répond à « c'est de qui ? »** — Dior, HUGO, Balenciaga. Elle porte
l'identité : accroche, description, image, couleur d'accent, et sa propre
page.

Le stock vit au croisement des deux axes. Une combinaison à zéro devient
grisée et non sélectionnable : un client ne peut jamais commander une paire
qui n'existe pas.

Ce modèle ne suppose rien sur les chaussures. Une catégorie « Sacs » avec les
axes Taille et Matière fonctionne le jour où le commerçant décide d'en
vendre — sans une ligne de code.

---

## Les pages

| Page | Rôle |
|---|---|
| `/` | Présente et oriente : en-tête, garanties, bandeaux des marques mises en avant, présentation, avis, newsletter |
| `/catalogue` | Tout, filtrable par type et par pointure |
| `/collection?c=<marque>` | Une marque : son entête, ses modèles |
| `/produit?id=<produit>` | La fiche : photos, déclinaisons, stock réel, garanties, guide des pointures, autres modèles |
| `/admin` | Le panneau du commerçant, invisible pour Google |
| `/cgv` `/confidentialite` `/guide-des-tailles` `/durabilite` | Pages légales et d'aide |

Chaque page a une adresse partageable sur WhatsApp — le canal de vente réel à
Bamako — avec son propre titre, sa propre description et son aperçu.

Le style, le script et la coque (navigation, panier, modales, pied de page)
sont partagés par un seul fichier chacun. Une correction se fait à un seul
endroit ; aucune divergence entre pages n'est possible.

---

## Ce que le commerçant contrôle — vérifié champ par champ

### Produits
Nom · marque · catégorie · prix · ancien prix · badge · description ·
photo principale depuis le téléphone · photos supplémentaires ·
déclinaisons cochées · stock par combinaison · visible ou masqué ·
marqué en rupture

### Catégories
Nom · image · axes renommables · valeurs · couleur de chaque valeur ·
photo de chaque valeur

### Marques
Nom · accroche · description · image de couverture · couleur d'accent ·
mise en avant sur l'accueil (quatre au maximum)

### Page d'accueil
En-tête, bannière, présentation, newsletter : sur-titre, titre, texte,
boutons, image, et un interrupteur par bloc

### Réglages
Numéro WhatsApp · nom de la boutique · livraison gratuite partout à Bamako ·
bannière d'annonce · délai de livraison · délai
d'échange · Instagram · TikTok · YouTube

### Commandes
Statut · articles · coordonnées du client · suppression, avec restitution
automatique du stock

### Autres
Avis clients · adresses de la newsletter · liste d'attente des ruptures

---

## Ce qui protège l'argent

**Les prix sont relus par le serveur.** Un client qui modifierait le prix
depuis son navigateur n'y arriverait pas : la fonction `place_order` ignore
ce que le navigateur annonce et relit le prix en base. Le commerçant ne peut
pas recevoir une commande à un prix qu'il n'a pas fixé.

**Le stock est réservé de façon indivisible.** Deux clients qui commandent la
dernière paire en même temps : un seul l'obtient, l'autre reçoit un message
d'indisponibilité. Pas de survente possible.

**La marque est dérivée du produit, côté serveur.** Deux marques peuvent
vendre une « Claquette Monogramme ». La marque inscrite sur la commande vient
du produit en base, pas du navigateur.

**Aucun moyen de paiement ne circule.** Paiement à la livraison, aucune
donnée bancaire stockée nulle part.

**L'administration est protégée par Supabase Auth**, invisible pour Google,
et les politiques RLS refusent toute lecture des commandes sans session.

---

## Ce qui fait vendre

- **Filtre par pointure**, sur le catalogue et chaque page de marque. La
  question d'un client de boutique de chaussures n'est pas « quels modèles
  existent » mais « lesquels existent à ma pointure ». Le filtre tient dans
  l'adresse : « les claquettes en 44 » se partage.
- **Le stock réel affiché**, pointure par pointure. Pas de faux compte à
  rebours : un mensonge convertit une fois puis brûle la marque.
- **Liste d'attente** sur les ruptures. Ce sont des clients qui voulaient
  acheter et n'ont pas pu — les premiers à rappeler au réassort.
- **Bandeaux de marque** sur l'accueil : le visiteur voit la marchandise
  avant de cliquer, pas seulement un nom.
- **Barre d'achat fixe** sur téléphone : au moment de se décider, le client a
  fait défiler les pointures hors de l'écran.
- **Garanties répétées** là où le doute survient : payé à la livraison, essai
  devant le livreur, échange de pointure.
- **Repli sans JavaScript** : sur un navigateur en mode économie de données —
  courant à Bamako — la page explique quoi faire et laisse un lien WhatsApp.

---

## Ce qui reste à la charge du commerçant

Ces points ne peuvent pas être faits à sa place, et aucun n'est technique.

1. **Saisir ses vrais stocks.** Les treize produits livrés sont une
   démonstration. C'est le premier chapitre du guide d'administration.
2. **Remplacer les visuels de démonstration** par ses propres photos. Le
   dispositif de recadrage est en place ; les photos ne le sont pas.
3. **Renseigner les mentions légales** — forme juridique, siège, RCCM, NIF,
   e-mail de contact. Seul élément juridiquement exigible encore vide :

   ```
   node configurer.mjs --forme "SARL" --adresse "..." --rccm "..." --nif "..." --email "..."
   ```

4. **Brancher son nom de domaine**, le jour venu :

   ```
   node configurer.mjs --domaine https://son-domaine.com --whatsapp 223XXXXXXXX
   ```

---

## Documents de livraison

| Fichier | Pour qui |
|---|---|
| `GUIDE-ADMINISTRATION.md` | Le commerçant — douze chapitres, remis avec ses identifiants |
| `GUIDE-VERCEL-SUPABASE.md` | Celui qui déploie |
| `PLAN.md` | Ce document |
| `assets/ATTRIBUTION.md` | Licences des visuels de démonstration |
