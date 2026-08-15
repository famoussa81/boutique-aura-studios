---
name: "Design System Inspired by Nike"
category: Brands
surface: web
colors:
  nike-white: "#ffffff"
  nike-black: "#111111"
  snow: "#fafafa"
  light-gray: "#f5f5f5"
  hover-gray: "#e5e5e5"
  border-secondary: "#cacacb"
  text-secondary: "#707072"
  text-disabled: "#9e9ea0"
  text-disabled-inverse: "#4b4b4d"
  dark-hover: "#39393b"
  dark-surface: "#28282a"
  deep-charcoal: "#1f1f21"
  red: "#d30005"
  red-bright: "#ee0005"
  badge: "#d33918"
  orange-flash: "#ff5000"
  success: "#007d48"
  success-inverse: "#1eaa52"
  link: "#1151ff"
  info-inverse: "#1190ff"
  warning: "#fedf35"
---

# Design System Inspired by Nike

> Category: Brands

> Surface: web

*> Category: E-Commerce & Retail > Athletic retail. Monochrome UI, massive uppercase type, full-bleed photography.*

URA STUDIOS est une marque de vêtement streetwear contemporain et techwear minimaliste, conçue pour un public urbain, jeune et passionné de pop culture.

Positionnement & Style :
Un mélange entre pièces streetwear haut de gamme et vêtements techniques fonctionnels. L'esthétique est sombre, futuriste et élégante, avec des lignes épurées et des détails contrastés.

Produits proposés :
Hoodies oversized, t-shirts graphiques premium, pantalons cargo techniques, vestes imperméables et accessoires (casquettes, sacoches).

Tone of Voice (Voix de la marque) :
Audacieux, moderne, minimaliste et direct.

---

## Provenance & mesure

Valeurs **mesurées** à partir de nike.com / Podium CDS (preuves détaillées dans `context/input-DESIGN.md`, re-vérifiées en live sur https://nike.com/). La couche opératoire se charge via `system/variables.nike.css` (light + `.dark`) ; le jumeau machine est `system/tokens.nike.json`. Valeurs *inférées* signalées explicitement (thème sombre).

## Color Palette

### Core neutrals (mesuré)

| Role | Name | Hex | Usage |
| --- | --- | --- | --- |
| background | Nike White | `#ffffff` | page canvas, cartes, fond de nav |
| foreground / CTA | Nike Black | `#111111` | texte primaire, boutons, nav, overlays hero |
| surface-lightest | Snow | `#fafafa` | différenciation quasi-blanche (grey-50) |
| surface | Light Gray | `#f5f5f5` | fond recherche/input, placeholder, squelette (grey-100) |
| surface-hover | Hover Gray | `#e5e5e5` | hover bg, bouton disabled (grey-200) |
| border | Border Secondary | `#cacacb` | bordures fines, inputs, diviseurs (grey-300) |
| text-secondary | Secondary Text | `#707072` | texte descriptif, prix, métadonnées (grey-500) |
| text-disabled | Disabled Text | `#9e9ea0` | éléments inactifs (grey-400) |
| text-disabled-inverse | Disabled Inverse | `#4b4b4d` | disabled sur fond sombre |
| surface-dark-hover | Dark Hover | `#39393b` | hover sur surfaces sombres (grey-700) |
| surface-dark | Dark Surface | `#28282a` | panneaux sombres (grey-800) |
| surface-darkest | Deep Charcoal | `#1f1f21` | fond inverse principal (grey-900) |

### Semantic & accent (mesuré)

| Role | Name | Hex | Usage |
| --- | --- | --- | --- |
| error | Nike Red | `#d30005` | erreurs critiques, badges soldes |
| error-bright | Bright Red | `#ee0005` | emphase red-500 |
| badge | Orange Badge | `#d33918` | texte de badge, promotions |
| accent-expressive | Orange Flash | `#ff5000` | orange expressif (orange-400) |
| success | Success Green | `#007d48` | confirmation, disponibilité |
| success-inverse | Success Inverse | `#1eaa52` | succès sur fond sombre |
| link | Link Blue | `#1151ff` | liens texte |
| info-inverse | Info Inverse | `#1190ff` | liens sur fond sombre |
| warning | Warning Yellow | `#fedf35` | bandeaux d'attention |
| focus | Focus Ring | `rgba(39, 93, 197, 1)` | anneau focus clavier |

### Rampes expressives (50→900) — pour campagnes et pages produit

Red `#ffe5e5→#ee0005→#530300` · Orange `#ffe2d6→#ff5000→#3e1009` · Yellow `#fef087→#fca600→#99470a` · Green `#dfffb9→#1eaa52→#003c2a` · Teal `#d4fffb→#008e98→#043441` · Blue `#d6eeff→#1151ff→#020664` · Purple `#e4e1fc→#6e0ff6→#1c0060` · Pink `#ffe1f3→#ed1aa0→#4c012d`.

### Règle d'or

L'UI reste **monochrome** ; la couleur n'apparaît que de façon **fonctionnelle** (erreur/succès/lien/alerte) ou portée par la **photographie produit**. Pas de dégradés d'interface — seuls les dégradés photographiques (fond de produit) sont admis.

## Typography

Faces mesurées (propriétaires) avec substitutions web :

- **Display:** Nike Futura ND (500) — uppercase uniquement, line-height 0.90 — fallbacks: Helvetica Now Display Medium, Helvetica Neue, Inter, system-ui, Arial, sans-serif
- **Heading:** Helvetica Now Display Medium (500) — fallbacks: Helvetica Neue, Inter, Arial
- **Body Medium:** Helvetica Now Text Medium (500) — fallbacks: Helvetica Neue, Inter, Arial
- **Body:** Helvetica Now Text (400) — fallbacks: Helvetica Neue, Inter, Arial

### Échelle

| Role | Size | Weight | Line Height | Notes |
| --- | --- | --- | --- | --- |
| Display | 96px | 500 | 0.90 | uppercase, hero uniquement |
| Heading 1 | 32px | 500 | 1.20 | titres de section |
| Heading 2 | 24px | 500 | 1.20 | sous-sections |
| Heading 3 | 16px | 500 | 1.50 | titres de carte |
| Body | 16px | 400 | 1.75 | descriptions produit |
| Body Medium | 16px | 500 | 1.75 | texte emphatique |
| Link | 16px | 500 | 1.75 | navigation |
| Link Small | 14px | 500 | 1.86 | footer / utilitaires |
| Button | 16px | 500 | 1.50 | CTA |
| Button Small | 14px | 500 | 1.50 | boutons secondaires |
| Caption | 14px | 500 | 1.50 | prix, libellés |
| Small | 12px | 500 | 1.50 | horodatages |
| Tiny | 12px | 400 | 1.50 | mentions légales |

Principes : le poids 500 domine le texte interactif (jamais 400 sur les boutons/liens) ; le Display reste uppercase et jamais en dessous de 24px.

## Radius

| Value | Context |
| --- | --- |
| 0px | images produit, hero photography (bords francs) |
| 8px | inputs de formulaire |
| 18px | petits éléments interactifs |
| 20px | conteneurs, cartes UI |
| 24px | inputs de recherche, pills moyens |
| 30px | boutons, tags, filtres (pill complet) |
| 50% | boutons icône circulaires, avatars |

## Layout & Élévation

- Grille de base **4px**, multiple 8px (space-1..10 = 4/8/12/16/20/24/32/48/64/80px).
- Container max **1920px**, contenu standard ~1440px. Padding : 48px desktop / 24px tablette / 16px mobile.
- Grille produit 3 colonnes desktop → 2 → 1 ; gaps produit **4-12px** (dense, abondant).
- **Élévation totalement plate** : aucune ombre de carte, aucun hover-lift. Profondeur par shifts de gris `#f5f5f5 → #e5e5e5 → #cacacb → #707072`. Seule « ombre » : le divider inset `0 -1px 0 0 #e5e5e5` et l'anneau de focus `0 0 0 2px rgba(39,93,197,1)`.
- Breakpoints : 640 / 768 / 960 / 1024 / 1440. Cibles tactiles ≥ 44×44px.
- Motion : transitions `200ms ease` (background, border-color, opacity) ; appui actif avec ripple en opacité 0.5.

## Composants

- **Buttons** : pill 30px, fond `#111111`, texte blanc 16/500, hover `#707072`, outline 1.5px `#cacacb` (hover `#707072`), disabled `#e5e5e5`/`#9e9ea0`. Sur sombre : blanc/`#111111`, hover `#cacacb`.
- **Nav** : sticky blanche, ~60px, liens centraux 16/500 `#111111` (hover `#707072`), recherche à 24px, icônes favoris/panier. Bandeau promo `#111111` texte blanc 12/500.
- **Product cards** : image 1:1 ou 4:3 sans radius en haut, métadonnées en dessous (gap 12px), hover sans lift — swap image secondaire en opacity 200ms.
- **Inputs** : fond `#f5f5f5`, bordure `#cacacb`, radius 8px (recherche 24px), focus bordure `#111111` + anneau focus, erreur `#d30005`, placeholder `#707072`.
- **Badges/Tags** : pill 30px, hauteur min 36px, badge solde `#d30005`, badge promo `#fedf35`.

## Voice & Tone

- **Adjectives:** audacieux, moderne, minimaliste, direct
- **Tone:** URA STUDIOS est une marque de vêtement streetwear contemporain et techwear minimaliste, conçue pour un public urbain, jeune et passionné de pop culture.

### Messaging pillars
- URA STUDIOS est une marque de vêtement streetwear contemporain et techwear minimaliste, conçue pour un public urbain, jeune et passionné de pop culture.
- > Category: E-Commerce & Retail > Athletic retail. Monochrome UI, massive uppercase type, full-bleed photography.

### Vocabulary
- **Use:** vocabulaire sportif et urbain, phrases courtes et affirmatives, ton impératif ("Just Do It" / "Acheter").
- **Avoid:** fioritures, superlatifs génériques, ton éditorial mou.

## Imagery

- **Style:** full-bleed, sans radius, éditorial sportif.
- **Subjects:** athlètes en mouvement, produits sur fond neutre, détails de matière.
- **Treatment:** photographe unique source de couleur ; scrim dégradé sombre sur hero pour la lisibilité ; lazy-loading avec placeholder `#f5f5f5`.
- **Avoid:** cadres, ombres portées, images à coins arrondis.

## Do's and Don'ts

### Do
- Utiliser Nike Black `#111111` pour le texte primaire et les CTA.
- Boutons pill (30px) et limités aux variantes primary/secondary.
- Full-bleed pour hero et produits (0px radius).
- Display uppercase réservé aux titres hero.
- Gris `#f5f5f5` pour inputs et placeholders.
- Poids 500 sur tout texte interactif.

### Don't
- Pas d'ombres de cartes, pas de hover-lift.
- Pas de radius sur la photographie.
- Pas de couleur de marque hors gris dans l'UI (couleur = fonctionnelle ou produit).
- Pas de Display sous 24px.
- Pas de dégradés d'interface.
- Pas de boutons/liens en poids 400.
