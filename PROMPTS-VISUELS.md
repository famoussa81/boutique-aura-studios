# Visuels du site — inventaire et prompts

Deux familles d'images, avec une règle qui les sépare.

> **L'IA pour l'ambiance, jamais pour les produits ni les marques.**
>
> Générer une « chaussure Louis Vuitton » produit un objet qui n'existe pas
> portant une marque réelle. C'est du faux, et cela se retourne contre un
> vendeur d'authentique — un client qui reconnaît un modèle inventé cesse de
> croire au reste. Les photos produit et les couvertures de marque viennent du
> commerçant.

---

## Famille 1 — Ambiance, générée par IA

Prompts en anglais : les modèles d'image y répondent mieux.

Chaque prompt se termine par les mêmes consignes, qui garantissent la
cohérence avec la charte monochrome du site :

```
no text, no logos, no watermark, no brand names,
muted desaturated palette, editorial fashion photography,
natural light, shallow depth of field, 35mm film grain
```

### 1. En-tête — 1920 × 1200 (16/10)

L'image la plus visible du site. Elle doit laisser respirer le coin bas
gauche, où viennent le titre et les deux boutons.

```
Wide editorial shot of a young man walking on a sunlit city street,
seen from the knees down, focus on his sneakers hitting the pavement,
warm dusty light, long shadows, blurred urban background,
empty space on the left third of the frame,
no text, no logos, no watermark, no brand names,
muted desaturated palette, editorial fashion photography,
natural light, shallow depth of field, 35mm film grain
```

Variante plus sombre, si tu préfères une entrée dramatique :

```
Low angle night shot of sneakers on wet asphalt reflecting neon light,
shot from behind as the person walks away, motion blur,
deep shadows, cinematic contrast, empty space on the left,
no text, no logos, no watermark, no brand names,
muted desaturated palette, editorial fashion photography,
shallow depth of field, 35mm film grain
```

### 2. Bannière de collection — 1600 × 900 (16/9)

Bandeau large en milieu de page, texte posé dessus.

```
Overhead flat lay of several pairs of shoes arranged in a loose grid
on a concrete floor, soft directional light from one side,
generous negative space, minimal composition,
no text, no logos, no watermark, no brand names,
muted desaturated palette, editorial fashion photography,
natural light, shallow depth of field, 35mm film grain
```

### 3. Éditorial — 900 × 1125 (4/5)

Portrait vertical, à côté du texte « la marque ».

```
Portrait of a person sitting on a low concrete step, tying a shoelace,
face partly out of frame, quiet unposed moment,
plain wall behind, soft afternoon light,
no text, no logos, no watermark, no brand names,
muted desaturated palette, editorial fashion photography,
natural light, shallow depth of field, 35mm film grain
```

### 4. Carte de catégorie — Chaussures — 800 × 600 (4/3)

```
Close-up of a single pair of sneakers on a plain studio backdrop,
three-quarter angle, soft even light, seamless neutral background,
centered composition with breathing room,
no text, no logos, no watermark, no brand names,
muted desaturated palette, product photography,
natural light, shallow depth of field
```

### 5. Carte de catégorie — Claquettes — 800 × 600 (4/3)

```
Close-up of a pair of slide sandals resting on warm concrete,
strong summer sunlight, sharp shadow, minimal composition,
seamless neutral background,
no text, no logos, no watermark, no brand names,
muted desaturated palette, product photography,
natural light, shallow depth of field
```

### 6. Page 404 — 1200 × 800 (3/2) — facultatif

```
Single empty shoe box open on a concrete floor, seen from above,
soft shadow, lots of empty space around it, quiet and minimal,
no text, no logos, no watermark, no brand names,
muted desaturated palette, editorial photography,
natural light, 35mm film grain
```

---

## Famille 2 — Fournies par le commerçant

### Couvertures de marque — 800 × 600 (4/3), une par collection

Dix images, une par marque. **Ce sont ses photos.**

Trois façons de faire, par ordre de qualité :

1. **Une pièce phare de la marque, photographiée par lui** — la meilleure. Le
   client reconnaît le modèle et comprend immédiatement le niveau de gamme.
2. **Plusieurs paires de la marque disposées ensemble** — donne une idée du
   choix disponible, utile pour une marque à dix modèles.
3. **Une photo d'ambiance neutre** — un pis-aller pour une marque à deux
   modèles, en attendant mieux.

Consigne de cadrage, à lui transmettre : fond uni, lumière naturelle proche
d'une fenêtre, la chaussure prise de trois quarts, un peu d'espace autour.
Toutes les couvertures dans le même style, sinon la bande de marques part dans
tous les sens.

### Photos produit — 3/4 vertical, au moins une par modèle

Idéalement trois par modèle : trois quarts, profil, détail de la semelle ou de
la matière.

Même fond et même lumière pour tout le catalogue. C'est ce qui sépare une
boutique crédible d'une page de petites annonces — plus que la qualité de
chaque photo prise isolément.

---

## Traitement automatique

Toute image envoyée depuis l'administration est **recadrée au format exact de
son emplacement** et recompressée dans le navigateur : 1000 px de côté
maximum, WebP qualité 0,82. Une photo de téléphone de 4 Mo devient quelques
dizaines de Ko.

Le commerçant n'a donc pas à se soucier des dimensions. Il lui suffit de
cadrer large : le recadrage prend le centre.
