---
name: design-system-nike
description: Generate Nike-inspired (Podium CDS) retail pages for URA STUDIOS using the measured design-language bundle.
---

# Design System Inspired by Nike — generation skill

Follow this skill whenever you produce a new HTML deliverable (page, landing, product grid, admin screen) that must follow the **URA STUDIOS / Nike-inspired** visual language.

## 1. Load the tokens

```html
<link rel="stylesheet" href="system/variables.nike.css">
```

Consume `--nike-*` custom properties and the `.nike-*` component primitives. Do not invent colors, radii, or spacing outside the measured set.

## 2. Non-negotiable rules

- **Monochrome UI.** Use only `--nike-*` neutrals for surfaces/text. Semantic colors reserved for:
  - error `#d30005` (form errors, sale badges)
  - success `#007d48` / inverse `#1eaa52`
  - link `#1151ff` / inverse `#1190ff`
  - warning `#fedf35`
  - expressive orange `#ff5000` (campaign accents only)
- **Full-bleed imagery, 0px radius.** Product/hero images never rounded, never boxed with shadows.
- **Display type:** `class="nike-display"`, uppercase, weight 500, responsive 96→48px. Never below 24px, never in body copy.
- **Buttons:** pill (30px radius). Primary `#111111`/white text on light; white/`#111111` on dark. Hover `#707072` or `#cacacb` (white pills on dark). Interactive text weight 500.
- **Flat elevation:** no card shadows, no hover-lift. Depth = grey shifts or inset divider `0 -1px 0 0 #e5e5e5`.
- **Dense product grids:** gap 4–12px; metadata block 12px under the image.
- **Motion:** 200ms ease transitions; on press use an opacity ripple (~0.5), never a transform scale shadow.

## 3. Component vocabulary

| Need | Use |
| --- | --- |
| CTA | `.nike-btn`, `.nike-btn--outline`, `.nike-btn--sm`, `.nike-btn--icon` |
| Promo strip | `.nike-banner` (`#111111`, white 12/500, full-width) |
| Sticky nav | `.nike-nav` (60px) + `.nike-banner` above it |
| Search | `.nike-input--search` (24px radius, `#f5f5f5` fill) |
| Forms | `.nike-field` + `.nike-input` (8px) + `.nike-input--error` |
| Product card | `.nike-card` + `.nike-card__body` + `.nike-price` / `.nike-price--sale` |
| Badges / tags | `.nike-badge`, `.nike-badge--sale`, `.nike-badge--promo`, `.nike-tag` |
| Hero | `.nike-hero` + `.nike-hero__scrim` + `.nike-hero__content` (donnée en FCFA) |
| Type | `.nike-display`, `.nike-h1..h3`, `.nike-body`, `.nike-caption`, `.nike-meta` |

## 4. Provenance guard

- Nike Futura ND / Helvetica Now are proprietary; rely on the declared fallback stacks (Inter substitutes). Do not hot-link third-party font CDNs.
- Label anything you cannot measure as *inferred* in a code comment or the design hand-off.
- Keep the UI monochrome: if it feels colorful, it's wrong — the product photography is the color story.

## 5. Hand-off checklist

- [ ] All colors are `--nike-*` or the documented semantic set.
- [ ] Images full-bleed, radius 0.
- [ ] Display headlines uppercase + `nike-display`.
- [ ] Buttons pill with weight-500 label text.
- [ ] No shadows on cards; flat elevation.
- [ ] Responsive: display 96→48px, grid 3→2→1, padding 48/24/16.
- [ ] Prose in French (boutique Côte d'Ivoire / Mali, prix FCFA, WhatsApp `+223`).