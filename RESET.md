# reset.css — reference

Opt-in element-level reset shipped with `@webshore/unocss-preset`. Imported via:

```css
@layer preflights, base, components, default, utilities;
@import '@webshore/unocss-preset/reset.css';
```

All properties resolve through CSS variables (`--bg-canvas`, `--text-color`, `--border-default`, `--card-*`, `--icon-*`, `--stack-spacing`, …). Every token referenced by the reset is emitted by the preset's preflight with a sensible default, so the reset works out of the box. Override any token in `theme.preflightBase` (or in your own `:root` block) to retheme without editing the reset itself.

Everything lives in `@layer base`, keeping specificity at 0 wherever `:where()` is used.

## Structure

| # | Section | What it covers |
|---|---------|---------------|
| 1 | Document hygiene | box-sizing, text-rendering, tap behavior |
| 2 | Root typography | font-family, color, line-height defaults |
| 3 | Landmarks | body, main reset |
| 4 | Auto-layout | section/div sane-defaults (auto-pad sections, auto-gap children) |
| 5 | Embedded content | img / svg / video / iframe |
| 6 | Figure | zero margin, muted figcaption |
| 7 | Typography | zero-margin reset, fluid h1..h6, inline semantics, blockquote, code, `.stack` rhythm container |
| 7e | Icons | `[data-icon]` attribute API + `.icon--{size\|style}` BEM modifiers |
| 7f | Content Grid | `.content-grid` full-bleed layout with opt-in break-out zones |
| 7g | Card | `.card` structural skeleton (tokens, no brand decisions) |
| 7h | Utilities | `.sticky`, `.overlay`, `.content-width`, `.is-bg` |
| 8a | Table | `<table>`, th/td, `.striped` |
| 8b | Forms | cross-browser normalization |
| 8c | Native HTML5 | `<details>`, `[aria-busy]`, `<dialog>`, `<progress>` |
| 9 | Accessibility | cursors, RTL, `:focus-visible`, `.sr-only`, `.skip-link`, `.clickable-parent`, `body.no-scroll` |
| 10 | Reduced motion | respects `prefers-reduced-motion` |

---

## Auto-layout primitives (§4)

Every `<section>`, `<header>`, `<footer>` is `flex-direction: column` with `align-items: center` and `margin-inline: auto`. Top-level sections (not nested inside another section) auto-pad (`padding-block: var(--section-padding-block)`, `padding-inline: var(--gutter)`) and auto-gap (`gap: var(--container-gap)`). Their direct block children (`div`, `ul`, `ol`) auto-gap with `--content-gap`, and every `<div>` inherits `gap: var(--content-gap)` (no effect unless the div is flex/grid).

This pairs with the typography margin-reset: element margins are zeroed, so spacing centralizes at the parent `gap` layer rather than double-stacking with flex/grid gap.

---

## Typography reset (§7)

Every typography element under `<body>` has `margin-block: 0`:

```
body :where(p, h1..h6, ul, ol, li, dl, blockquote, pre, table, address, figure, hgroup) { margin-block: 0 }
```

**Why zero margins?** Avoids the double-spacing problem when an element's intrinsic margin stacks with a flex/grid `gap` from its parent. Spacing is authored once, at the container.

**Why `:where()`?** Keeps specificity at `0,0,1` so utility classes and component overrides always win. The body-scope prevents resetting margins on elements outside the document flow (shadow DOM, detached fragments).

**Opt back in per-element** when you need it: `<p style="margin-block: 1em">` or a utility class — the reset is not `!important`.

Headings inherit role tokens (`--heading-font-family`, `--heading-font-weight`, `--heading-line-height`, `--heading-letter-spacing`, `--heading-text-wrap`, `--heading-color`) + per-level fluid size from `--h1..--h6`.

`hgroup`'s non-first last-child (the subtitle) gets muted treatment via `--text-muted` and `--text-md`.

---

## `.stack` — rich-text rhythm container (§7 / 7d)

Apply `.stack` to any wrapper that contains semantic rich-text (articles, blog posts, CMS output, long-form copy). Direct children gain rhythmic vertical spacing via adjacent-sibling selectors — margin appears **only between siblings**, never before the first or after the last. Each element type has a tunable spacing token so headings breathe more than paragraphs, figures more than lists, nested lists stack tighter than top-level, etc.

This is Every Layout's canonical [Stack primitive](https://every-layout.dev/layouts/stack/) (Heydon Pickering). `--stack-spacing` is the catch-all sibling gap; per-element-type tokens cascade on top of it.

Complements — doesn't conflict with — the flex-gap-based auto-layout in §4. Use `.box` / `.container` / `<section>` for uniform flex-gap stacking; use `.stack` when you want authored HTML to flow with natural typographic rhythm that varies per element.

### Tokens

Defaults live in the preset's preflight (`src/_theme/preflight.ts`); override any of them in your consumer config:

| Token | Purpose |
|---|---|
| `--stack-spacing` | default gap between any two siblings |
| `--heading-spacing` | gap before any heading |
| `--h2-spacing` … `--h6-spacing` | per-level heading overrides |
| `--paragraph-spacing` | gap before a paragraph |
| `--list-spacing` | gap around a list |
| `--list-indent-spacing` | `padding-inline-start` on lists |
| `--list-item-spacing` | gap between `<li>` siblings |
| `--nested-list-spacing` | `margin-block` on nested lists |
| `--nested-list-indent-spacing` | `padding-inline-start` on nested lists |
| `--nested-list-item-spacing` | gap between items in nested lists |
| `--figure-spacing` | gap around figure/picture |
| `--figcaption-spacing` | margin around figcaption |
| `--blockquote-spacing` | gap around blockquote |

### Escape hatch

Add `.no-stack` to a descendant scope to re-zero margins (useful for tight widgets embedded in stack content that shouldn't inherit rhythmic spacing).

### Overriding per scope

All tokens are CSS variables, so tune stack rhythm inline or per component class:

```html
<div class="stack" style="--stack-spacing: 0.5em">  <!-- tight -->
<div class="stack" style="--stack-spacing: 2em">    <!-- loose -->
```

---

## Icons — `[data-icon]` API (§7e)

Attribute-driven + class-driven icon framework. Works on any `<svg>`, `<i>` (icon font), or `<a>` element marked with `data-icon`. Size, style, and hover states are controlled via CSS vars that cascade from parent scopes — no JS, no utility class required.

### Usage

```html
<svg data-icon="star" data-icon-size="md">...</svg>
<i data-icon="heart" class="icon--boxed icon--lg"></i>
<a data-icon href="...">link with icon</a>

<ul class="icon-list">
  <li><svg>...</svg> Item</li>
  <li><svg>...</svg> Item</li>
</ul>
```

### Size modifiers

`.icon--xs` / `.icon--sm` / `.icon--md` / `.icon--lg` / `.icon--xl` / `.icon--2xl`, or the attribute form `[data-icon-size='xs'…'2xl']`. Aligned with the preset's xs/sm/md/lg/xl/2xl scale convention (matches `--radius-*`, `--shadow-*`, `--text-*`).

### Style modifiers

- `.icon--boxed` / `[data-icon-style='boxed']` — padded with background + radius.
- `.icon--plain` / `[data-icon-style='plain']` — bare glyph, zero padding.

### Hover

Anchor-wrapped icons (`a:hover > svg`, `a:hover > i`) and explicit `[data-icon-hover]` markers swap to `--icon-*-hover` tokens automatically.

### Icon list

`.icon-list` / `[data-icon-list]` container — vertical flex stack, common for feature lists, credentials, nav menus with leading icons. Inside the list, nested `svg` / `i` pick up `--icon-list-icon-size` and are `translate()`d by `--icon-inline-offset` / `--icon-block-offset` for optical alignment.

### Tokens

All ship from preset preflight defaults: `--icon-size`, `--icon-padding`, `--icon-color`, `--icon-background`, `--icon-border-{color,width,style}`, `--icon-radius`, `--icon-transition`, `--icon-shadow`, `--icon-{color,background,border-color}-hover`, `--icon-size-{xs..2xl}` + `--icon-padding-{xs..2xl}`, `--icon-list-gap`, `--icon-list-icon-size`, `--icon-scheme`, `--icon-inline-offset`, `--icon-block-offset`.

---

## `.content-grid` — full-bleed layout (§7f)

Based on Josh Comeau's [CSS-grid full-bleed pattern](https://www.joshwcomeau.com/css/full-bleed/). A `.content-grid` container defines **7 named columns** from edge to edge:

```
[full-start]
  [feature-max-start]
    [feature-start]
      [content-start] ← default readable column (--content-width)
      [content-end]
    [feature-end]
  [feature-max-end]
[full-end]
```

Children default to the `content` zone. Opt into progressively wider zones with break-out classes:

```html
<article class="content-grid">
  <p>Narrow reading width (default).</p>
  <figure class="content--feature">Slightly wider callout.</figure>
  <img class="content--feature-max" src="...">
  <section class="content--full">Edge-to-edge hero.</section>
  <section class="content--full-safe">Edge-to-edge, but with gutter padding.</section>
</article>
```

### Escape hatch

Wrap in `.content-grid--off` to neutralize the `width: 100% !important` override on break-out children — useful for embedded widgets that manage their own sizing.

### Tokens

| Token | Purpose |
|---|---|
| `--content-width` | central readable column width (preset default: 90rem) |
| `--gutter` | edge padding |
| `--feature-width` | additional width outside content on each side |
| `--feature-max-width` | additional width outside feature on each side |

### Pairing with `.stack`

Put `.stack` on the container, or on any individual break-out child to manage rhythm within its zone:

```html
<article class="content-grid stack">...</article>

<article class="content-grid">
  <section class="content--feature stack">...</section>
</article>
```

### `.is-bg` inside `.content-grid`

A `.is-bg` child spans the full zone (edge-to-edge) automatically — `.content-grid > .is-bg { grid-column: full }`.

---

## `.card` — structural skeleton (§7g)

Minimal card primitive — **structural only**. No brand decisions: no forced button colors, no forced link colors, no BEM sub-element selectors for `__media` / `__avatar`, no font-size overrides, no light/dark variant classes. Those live in consumer `components/card.css`.

What you get: flex-column container with padding, gap, border, radius, background, shadow, and transition — all CSS-var-driven with sane fallbacks. Consumers layer nested-element styling, button/link overrides, media/avatar treatments, and theme variants on top.

### Tokens

All ship from preset preflight defaults (override in `theme.preflightBase`):

| Token | Default |
|---|---|
| `--card-display` | `flex` |
| `--card-flex-direction` | `column` |
| `--card-overflow` | `clip` |
| `--card-transition` | `var(--transition)` |
| `--card-padding` | `var(--space-md)` |
| `--card-gap` | `calc(var(--content-gap) / 2)` |
| `--card-border-width` / `-style` / `-color` | `0` / `solid` / `transparent` |
| `--card-radius` | `var(--radius-md)` |
| `--card-background` | `var(--bg-surface)` (theme-aware) |
| `--card-text-color` | `inherit` (theme-aware via body) |
| `--card-shadow` | `none` |

### Minimal card

```html
<article class="card">
  <h2>Title</h2>
  <p>Body text.</p>
</article>
```

### Extending in consumer CSS

```css
@layer components {
  .card :where([class*='__media'])  { aspect-ratio: 16/9; ... }
  .card :where([class*='__avatar']) { border-radius: 50%; ... }
  .card--promo                      { --card-background: var(--color-accent-faint); }
}
```

---

## Utilities (§7h)

Small opt-in class helpers that didn't fit elsewhere.

### `.sticky`

`position: sticky` anchored to `--sticky-offset` (default `0`). Works with `inset-block-start`, so RTL-safe.

### `.overlay` / `.overlay--*`

Pseudo-element dim layer under the content. `isolation: isolate` creates a stacking context so the `::before` layer sits behind content but above the element's own background.

Wildcard `[class*='overlay--']` matches your themed variants (e.g. `.overlay--dark`, `.overlay--accent`, etc.) — define those in consumer CSS by overriding `--overlay-color`.

**Figure gotcha**: when the overlay element is a `<figure>` containing media (`img`, `picture`, `svg`, `video`, `iframe`), the overlay needs to sit on TOP of the media, not behind it. The reset handles this automatically by switching `--overlay-z-index` from `-1` to `0` for figures with media children.

### `.content-width` / `.content-width--safe`

Centers + caps at `--content-width`. Useful for pages that aren't using `.content-grid` but still want main content at a readable width. `--safe` uses `--content-width-safe`, which is clamped with gutter for overflow safety.

### `.is-bg` — background-layer primitive

Absolute-positions an element as a background inside its parent. Common for hero sections, card backgrounds, and image-overlay scenes.

```html
<section>
  <img class="is-bg" src="hero.jpg" alt="">
  <div>Content on top of the bg.</div>
</section>
```

The parent `:has(> .is-bg)` gets `position: relative` + `isolation: isolate` automatically so the `.is-bg` layer is scoped locally. Tunable via `--bg-position`, `--bg-inset`, `--bg-{width,height,radius,object-fit,object-position,z-index}`.

---

## Native HTML5 controls (§8c)

Baseline styling for universal HTML primitives so `<details>`, `<dialog>`, `<progress>`, and `[aria-busy]` render sensibly out of the box across browsers.

### `<details>` / `<summary>`

- `list-style-type: none` + native marker stripped (`::marker`, `::-webkit-details-marker`, `::-moz-list-bullet`).
- Chevron rendered via UTF character `▾` in `summary::after`, rotated on `[open]` — **no icon-token dependency**.
- Focus-visible ring uses `--focus-ring` + `--focus-width`.
- RTL-aware: `[dir='rtl']` flips summary text-align and chevron float.

### `[aria-busy='true']` spinner

Pure-CSS spinner (no icon-token dep). Applies to any non-form element with `aria-busy='true'`. Animated via `@keyframes loading-spin`. Busy buttons/links become `pointer-events: none` automatically.

### `<dialog>` modal

Styled backdrop via `color-mix(in oklch, var(--bg-inverse) 50%, transparent)` + optional blur. Two flagged tokens the reset does NOT ship but respects:

| Flagged token | Default fallback | Purpose |
|---|---|---|
| `--scrollbar-width` | `0px` | Consumer sets via JS to offset scrollbar compensation when `.modal-is-open` locks body scroll. |
| `--modal-overlay-backdrop-filter` | `blur(0.375rem)` | Override to `none` or a different blur amount. |

Close button uses `✕` UTF character (no icon-token dep) via `.close` class or `[rel='prev']`.

**Body lock**: `.modal-is-open` locks body scroll + adds `--scrollbar-width` padding-right to compensate for the vanished scrollbar. Complements `.no-scroll`.

**Open/close animations**: `.modal-is-opening` / `.modal-is-closing` classes — apply via JS on open/close for the fade+slide animation.

### `<progress>`

Appearance-normalized across browsers. Indeterminate state animated via `@keyframes progress-indeterminate` when the user has not opted into reduced motion. RTL-aware.

---

## Accessibility helpers (§9)

### `body.no-scroll`

Typical modal / offcanvas / menu body scroll-lock pattern. Toggle via JS when opening an overlay; remove to restore scrolling. Complements `aria-hidden` management in your overlay code.

### `.sr-only`

Screen-reader-only helper. Visually hidden but accessible to assistive tech. Standard 1px-clip pattern.

### `.skip-link`

WCAG 2.4.1 [Bypass Blocks](https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html) pattern. Positioned off-screen until keyboard-focused, then slides into view. Ships with safe fallback visuals (preset tokens only); consumer CSS can restyle freely by redefining `.skip-link` at the base or components layer.

### `.clickable-parent`

Expands an inner anchor's hit target to fill its parent via an absolutely-positioned `::after`. Classic "entire card is clickable" a11y pattern (WCAG 2.5.5 Target Size friendly).

```html
<div class="clickable-parent">
  <h3>Title</h3>
  <p>Description</p>
  <a href="/link">Read more</a>
</div>
```

The parent gets relative positioning implicitly via the inner `<a>`'s `::after` filling `inset: 0`.

### Focus ring

Baseline `:where(:focus-visible)` outline uses `--focus-width` + `--focus-ring`. Falls back to `:focus` on browsers without `:focus-visible` support (Safari <15.4) via `@supports not selector(:focus-visible)`.

### Touch + cursors

- `[aria-controls]` → `cursor: pointer`
- `[aria-disabled='true']`, `[disabled]` → `cursor: not-allowed`
- Interactive elements (`a`, `button`, `label`, `[tabindex]`, etc.) → `touch-action: manipulation` (kills the 300ms tap delay + double-tap zoom on iOS).

---

## Reduced motion (§10)

`@media (prefers-reduced-motion: reduce)` reduces animation-duration / transition-duration / animation-delay on everything **except** `[aria-busy='true']` (which relies on its spinner loop to communicate loading state). Also disables `background-attachment: fixed` + `scroll-behavior: smooth`.
