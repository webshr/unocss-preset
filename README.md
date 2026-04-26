# @webshore/unocss-preset

UnoCSS preset with fluid type/space/heading scales, a 9-family color system
(with alpha variants), a full suite of utility rules, and an opt-in
sane-defaults reset. Tokens are CSS-variable-first — every theme value
resolves to `var(--token)`, overridable at any scope without a rebuild.

## Install

```bash
pnpm add -D @webshore/unocss-preset @unocss/core @unocss/preset-mini
# Plus the UnoCSS engine in your project:
pnpm add -D unocss
```

`@unocss/core` and `@unocss/preset-mini` are declared as peer deps; install
them in your project alongside `unocss` (the runtime).

## Usage

```ts
// uno.config.ts
import { defineConfig } from 'unocss';
import { presetWebshore } from '@webshore/unocss-preset';

export default defineConfig({
  presets: [presetWebshore()],
  // Recommended: emit internal layers as real CSS cascade @layer at-rules.
  // Combined with a consumer `@layer preflights, base, components, default, utilities;`
  // declaration, this makes layer precedence explicit and injection-order-proof.
  outputToCssLayers: { allLayers: true },
});
```

### Optional reset

```css
/* your global CSS */
@layer preflights, base, components, default, utilities;
@import '@webshore/unocss-preset/reset.css';
```

Opt-in reset (element-level sane defaults in `@layer base`). Follows the
UnoCSS [style-reset convention](https://unocss.dev/guide/style-reset). See
[`RESET.md`](./RESET.md) for usage docs, token inventories, and per-section
examples. The preset emits sensible defaults for every token `reset.css`
references (semantic colors, typography rhythm, card / icon / flow / focus /
overlay primitives), so the reset works out of the box — override via
`theme.preflightBase` to retheme.

## What ships

| Concern | Details |
|---|---|
| **Colors** | 9 families (`primary, secondary, accent, base, neutral, success, info, warning, error`) × 11 steps (`50..950`) + `faint` / `soft` / `muted` alpha variants (color-mix) + absolutes (`white`, `black`, `transparent`, `currentColor`, `inherit`) |
| **Color shortcuts** | `bg-primary` (= `bg-primary-400` via DEFAULT step), `bg-primary-5` (= `bg-primary-500` numeric short form), `bg-primary/50` (opacity via `color-mix(in oklch, …)`) |
| **Pure color alias** | `c-{color}` and `color-{color}` set `color` without colliding with the `text-*` font-size namespace |
| **Fluid scales** | `text-xs..2xl` + `x-to-y` pairs, `space-2xs..3xl` + pairs, `section-space-*` + pairs, `h1..h6` + pairs — all clamped between 360px and 1440px viewports |
| **Radii** | `radius-{none\|xs\|sm\|md\|lg\|xl\|2xl\|full}` + corner specifiers (`radius-tl-md`, `radius-bs-lg`, etc.) |
| **Shadows** | `shadow-{none\|sm\|md\|lg}` |
| **Transitions** | `duration-{xs..xl}` (75–700ms), `ease-{linear\|in\|out\|in-out\|bouncy\|elastic}`, `transition-{xs..xl}` shorthand |
| **Grids** | `grid-{1..12}`, ratio templates (`grid-1-2`, `grid-2-3`, …), auto-fit templates (`grid-auto-2..grid-auto-12`) |
| **Widths** | static `w-xs..w-7xl` rem scale, decile scale (`w-10..w-90`, `w-full`) computed as `calc(var(--content-width) * 0.N)` |
| **Breakpoints** | `sm (478), md (768), lg (1024), xl (1280), 2xl (1536)` + responsive utility prefixes |
| **Layout primitives** | `.container` (centered, `--content-width`-capped), `.box` (vertical flex with `--content-gap`). Both wrap below `md` via `flex-wrap`. `.block` is left to preset-mini's native `display: block`; `.stack` (Every Layout adjacent-sibling rhythm) lives in opt-in `reset.css` §7d. |
| **Variants** | `dark:` / `light:` scoped to `html[data-theme='dark'\|'light']` (NOT `prefers-color-scheme` — see below), negative-margin prefix (`-mt-md`), all standard preset-mini variants |
| **Rings** | `ring`, `ring-{N}`, `ring-{color}` (with opacity modifier), `ring-offset-{N}`, `ring-inset` — full preset-mini ring stack wired with var-ref color rule that supports opacity (e.g. `ring-primary-500/50`). |
| **Typology fonts** | `--font-sans`, `--font-serif`, `--font-mono` typology + `--text-font-family`, `--heading-font-family` role vars |
| **Color scheme** | `color-scheme: light` on `:root`, `dark` on `html[data-theme='dark']` — makes `light-dark(lightVal, darkVal)` theme-aware out of the box |

### Color shortcuts in detail

```html
<!-- DEFAULT step (= step 400) -->
<div class="bg-primary">                  <!-- bg-primary-400 -->

<!-- Numeric short form (1 → 100, 5 → 500, 95 → 950) -->
<div class="bg-primary-5 text-base-9">    <!-- bg-primary-500 + text-base-900 -->

<!-- Opacity via color-mix(in oklch) -->
<div class="bg-primary-500/50">           <!-- color-mix(..., var(--color-primary-500) 50%, transparent) -->
<div class="bg-accent/[0.75]">            <!-- arbitrary opacity value -->
<div class="text-info-700/$myAlpha">      <!-- via CSS var -->

<!-- Pure-color alias (no text-* font-size collision) -->
<p class="c-warning-700">                 <!-- color: var(--color-warning-700) -->
<p class="color-base-900">                <!-- same -->

<!-- Alpha variants (per-family base step) -->
<div class="bg-success-soft">             <!-- 20% mix of step 500 → transparent -->
<div class="bg-primary-soft">             <!-- 20% mix of step 900 → transparent -->
```

`alphaBaseStep` differs by family: cool/dark families (`primary`, `base`)
anchor `faint`/`soft`/`muted` at step `900` so washes stay readable on light
backgrounds; saturated families (`accent`, `success`, etc.) anchor at step
`500` for balanced visibility on either theme.

### Dark / light variants

```html
<div class="bg-white dark:bg-black">                  <!-- toggles via data-theme -->
<p class="text-base-900 dark:text-neutral-50">
```

`dark:` matches `html[data-theme='dark']` and `light:` matches
`html[data-theme='light']`. Set the attribute on `<html>` from your theme
script — neither variant uses `prefers-color-scheme` directly. The preflight
emits matching `color-scheme` declarations so `light-dark()` works alongside
the variant.

If you'd rather use `prefers-color-scheme` or a `.dark` body class, override
the variants in your `uno.config.ts`.

## What does NOT ship

Brand-specific dark-mode color values (the `light-dark()` defaults are
generic — override `--color-*` to retheme), specific icon assets, brand
typography stacks. Site-layout values (`--content-width`, `--gutter`, etc.)
ship with sensible defaults; override via `theme.preflightBase` to tune.

## Structure

```
src/
├── _theme/         Theme modules (colors, fonts, heading, spacing, size, misc, preflight) + composed default
├── _rules/         Utility rule definitions per concern (color, typography, heading, spacing, size, border,
│                   radius, shadow, transition, layer, section-space, grid, layout)
├── _variants/      Variant definitions (negative, dark:/light:)
├── _utils/         Shared rule-factory helpers (color-mix opacity resolver)
├── _fluid/         Parameterized fluid-scale generators + FluidConfig
├── preflights.ts   :root token block + color-scheme decls + body.boxed layout mode
├── reset.css       Opt-in element-level sane defaults + class-based helpers (.stack, .card, .icon-*,
│                   .content-grid, .sticky, .overlay, .is-bg, .sr-only, .skip-link, .clickable-parent)
├── shorthands.ts   Preset shorthands (position)
├── index.ts        definePreset entry — presetWebshore
├── rules.ts        Barrel (per _rules/*)
├── variants.ts     Barrel (per _variants/*)
└── utils.ts        Barrel (per _utils/*)
```

## Font families: typology vs. roles

- **Typology primitives** — `--font-sans`, `--font-serif`, `--font-mono`. Usable directly or via `font-sans|serif|mono`.
- **Semantic roles** — `--text-font-family`, `--heading-font-family`. Point at a typology by default; override a role to change body/heading text without touching the typology.

```css
/* Swap the sans stack project-wide */
:root { --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif; }

/* Keep sans body, use serif for headings only */
:root { --heading-font-family: var(--font-serif); }
```

## Extending

```ts
// uno.config.ts
export default defineConfig({
  presets: [presetWebshore()],
  theme: {
    // Semantic aliases — available as utilities (bg-canvas, text-fg, border-line, …)
    colors: {
      canvas: 'var(--bg-canvas)',
      fg: 'var(--text-color)',
      line: 'var(--border-default)',
    },
    // Consumer tokens — merged into preset's preflightBase → emitted in :root
    preflightBase: {
      // Override the preset's defaults (e.g. branded primary)
      '--color-primary-500': 'oklch(0.55 0.18 250)',
      '--gutter': 'clamp(1rem, 2vw, 2rem)',
      // …project tokens
    },
  },
});
```

## Override tokens without a rebuild

Every value resolves to a CSS var:

```css
[data-theme='brand-x'] {
  --color-accent-500: oklch(0.7 0.2 240);
  --content-width: 80rem;
}

/* Or via inline style on a single element */
<div style="--color-primary-500: hotpink">
  <button class="bg-primary-500">…</button>
</div>
```

## Preset options

```ts
presetWebshore({
  preflight: true,            // false to disable :root token emit (advanced)
});
```

## License

[MIT](./LICENSE)
