# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static single-page website for **KNS Kancelaria Radców Prawnych** (law firm in Bytom, Poland). No build system, no package manager — pure HTML/CSS/JS opened directly in a browser or served via any static file server.

## Development

No build step. To preview locally, open `index.html` in a browser or serve the directory:

```powershell
# Python (if available)
python -m http.server 8080

# Node (if npx available)
npx serve .
```

## Architecture

The site is structured as one HTML file with two companion files:

- `index.html` — all sections in order: Navbar → Hero → Specjalizacje → O nas → Dlaczego my → Polecają nas → CTA Split → Kontakt → Modal → Footer
- `css/style.css` — single stylesheet; sections are delimited by block comments. CSS custom properties (`:root`) define the color palette, fonts, spacing, and layout tokens.
- `js/main.js` — single script handling: navbar scroll effect, hamburger menu, active nav link via `IntersectionObserver`, scroll reveal animations (`.reveal` → `.visible`), specialization modals, and contact form submission.

## Key implementation details

**Formspree integration**: The contact form posts to `FORMSPREE_URL` defined at the top of `main.js`. The placeholder value `'https://formspree.io/f/FORMSPREE_ID'` must be replaced with the actual Formspree form ID before the form works in production.

**Modal content**: Specialization modal copy lives in the `SPEC_DETAILS` object in `main.js` (not in HTML). When editing modal text, update that object — the cards dynamically inject a "Dowiedz się więcej" button and populate the modal from it.

**Local assets**: All images are served locally. Team photos and hero background are in the root folder; logo, card icons, partner logos, and the CTA photo are in `img/`.

**Responsive breakpoints**: `≤1024px` (tablet), `≤768px` (mobile — hamburger activates, grids collapse to 1 column), `≤480px` (small mobile padding adjustments). Mobile navbar is a slide-down panel (`.navbar__nav.open`).

**Scroll reveal**: Add class `reveal` to any element — `IntersectionObserver` adds `visible` on entry. Staggered delays for card/feature/team grids are applied via `data-delay` in JS.
