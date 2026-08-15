# Design System Inspired by Nike

Versioned bundle (v1.0.0) for the **URA STUDIOS** retail/streetwear surface — a Nike-inspired (Podium CDS) monochrome design language: massive uppercase display type, full-bleed photography, and a flat, grey-shift elevation model.

> Category: E-Commerce & Retail · Athletic retail. Monochrome UI, massive uppercase type, full-bleed photography.

## Package contents

| Path | What it is |
| --- | --- |
| `DESIGN.md` | Authoritative design reference (palette, type, radius, posture, components, do/don'ts). |
| `brand.json` | Structured brand record (palette, typography, voice, imagery, layout). |
| `guide.md` | Quick brand guide. |
| `context/input-DESIGN.md` | Raw measured evidence (Podium CDS) — provenance source. |
| `system/variables.nike.css` | **Operative token layer** (measured) — light + `.dark`, plus component primitives `.nike-*` (light). |
| `system/tokens.nike.json` | Machine-readable measured tokens (colors, type scale, radius, spacing, motion, ramps). |
| `system/variables.css` | Generative antd-derived theme (light + `.dark`) with Nike semantic overrides. |
| `system/variables.dark.css` | Standalone dark theme (Nike semantic overrides). |
| `system/tokens.default.json` / `.dark.json` / `.compact.json` | Derived DesignTokens (same seed, 3 algorithms). |
| `system/theme.json` | antd ConfigProvider theme. |
| `system/seed.json` | Generative seed (Nike semantic overrides). |
| `system/kit.html` | Component kit (generative baseline + Nike measured layer). |
| `system/kit.dark.html` | Component kit, dark. |
| `system/index.html` | Gallery / live preview (preview entry file). |
| `system/artifacts/*.html` | Generated deliverables: landing, deck, poster, email, newsletter, form. |
| `system/scripts/apply-design-tokens.mjs` | Copies `system/variables.css` into a target CSS file. |
| `index.html` · `admin.html` · `brand.html` | Reference implementations (storefront e-commerce, back-office admin, brand page). |
| `catalog.js` · `supabase-client.js` · `supabase.config.js` · `supabase/schema.sql` | Shop runtime: shared catalogue, Supabase REST client, configuration, database schema. |
| `cgv.html` · `confidentialite.html` · `guide-des-tailles.html` · `durabilite.html` · `404.html` · `page.css` | Content pages of the storefront. |
| `AUDIT-LIVRAISON.md` · `RECETTE.md` · `GUIDE-VERCEL-SUPABASE.md` | Delivery audit, QA protocol, deployment guide (French). |
| `assets/` | Real product & editorial photography, WebP (originals kept in `assets-originaux/`). |
| `logos/` | Extracted favicon. |
| `imagery/` | Social cover images. |

## Quick start

Load the measured layer in any new deliverable:

```html
<link rel="stylesheet" href="system/variables.nike.css">   <!-- light + .dark + .nike-* components -->
<script type="application/json" src="system/tokens.nike.json"></script> <!-- optional for tooling -->
```

Then use the `.nike-*` primitives (`nike-btn`, `nike-input`, `nike-nav`, `nike-card`, `nike-banner`,
`nike-display`, `nike-price`, `nike-badge`, `nike-tag`) or consume the `--nike-*` custom properties directly.

Dark theme:

```html
<html class="dark">
```

For the generative antd theme use `system/variables.css` (or run
`node scripts/apply-design-tokens.mjs <target.css>` to copy the token block into your file).

## Provenance

- **Measured from:** https://nike.com/ (live re-check) and Podium CDS evidence in `context/input-DESIGN.md`.
- **Faces:** Nike Futura ND (display) and Helvetica Now (body) are **proprietary** — shipped as fallback
  stacks with Inter/Helvetica substitution for web. No licensed files to bundle; do not redraw.
- **Inferred:** the `.dark` palette (grey-ramp mapping) and the "focus ring" behavior are derived, not
  directly measured from the live site.
- **Logo:** only a favicon was recoverable; no brand mark was supplied. Do not reconstruct the Swoosh.

## Design posture (non-negotiable)

1. UI is monochrome; color is functional (error/success/link/warning) or carried by product photography.
2. Hero and product imagery is full-bleed, **0px radius**, shadow-free.
3. Display type is uppercase, 96px (→ 64 → 48 responsive), line-height **0.90** pond only on hero.
4. Buttons are **pill (30px)**, primary = `#111111` on white, white on dark; interactive text is weight **500**.
5. Elevation is flat: no card shadows, no hover lifts — depth via grey shifts `#f5f5f5 → #e5e5e5 → #cacacb → #707072`.
6. Product grids are dense (4–12px gaps); sections breathe at 48–80px.

## Known gaps

- `od brand finalize` is not available in this headless build — derived files (`tokens.*.json`,
  `variables.css`, `kit.html`, artifacts) are updated in place and kept manually consistent.
- No licensed display font available; use the fallback stack (Inter renders the system faithfully
  except for the condensed Futura silhouette — apply `text-transform: uppercase` + tight letter-spacing).
- Modal/state interaction (ripple at 0.5 opacity) is documented but not implemented as a reusable JS component.