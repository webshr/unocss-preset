import { rawColorValues, alphaBaseStep, alphaPercent, alphaVariants, colorFamilies } from './colors';
import { fluidConfig } from '../_fluid/config';
import { generateFluidScale, generateSectionSpace } from '../_fluid/generate';

function buildColorEntries(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const family of colorFamilies) {
    const scale = rawColorValues[family];
    for (const [step, value] of Object.entries(scale)) {
      out[`--color-${family}-${step}`] = value;
    }
    const baseStep = alphaBaseStep[family];
    for (const alpha of alphaVariants) {
      const pct = alphaPercent[alpha];
      out[`--color-${family}-${alpha}`] =
        `color-mix(in oklch, var(--color-${family}-${baseStep}) ${pct}%, transparent)`;
    }
  }
  return out;
}

function prefixKeys(vars: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(vars)) {
    out[`--${k}`] = v;
  }
  return out;
}

const absolutes: Record<string, string> = {
  '--color-white': '#ffffff',
  '--color-black': '#000000',
};

// Per-step line-heights paired with `theme.fontSize` so `text-md` etc. emit
// `font-size + line-height`. Step `xs` → `2xl` matches the fluid text scale.
const lineHeights: Record<string, string> = {
  '--text-xs--line-height': '1.5',
  '--text-sm--line-height': '1.5',
  '--text-md--line-height': '1.6',
  '--text-lg--line-height': '1.5',
  '--text-xl--line-height': '1.35',
  '--text-2xl--line-height': '1.5',
};

const radii: Record<string, string> = {
  '--radius-none': '0',
  '--radius-xs': '0.125rem',
  '--radius-sm': '0.25rem',
  '--radius-md': '0.375rem',
  '--radius-lg': '0.5rem',
  '--radius-xl': '0.75rem',
  '--radius-2xl': '1rem',
  '--radius-full': '9999px',
};

const shadows: Record<string, string> = {
  '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

const fontFamilies: Record<string, string> = {
  '--font-sans':
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  '--font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  '--font-mono':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const typographyDefaults: Record<string, string> = {
  '--text-font-family': 'var(--font-sans)',
  '--text-color': 'currentColor',
  '--text-line-height': 'calc(8px + 2ex)',
  '--text-text-wrap': 'pretty',
  '--heading-font-family': 'var(--font-sans)',
  '--heading-color': 'inherit',
  '--heading-line-height': 'calc(4px + 2ex)',
  '--heading-font-weight': '500',
  '--heading-text-wrap': 'balance',
  '--heading-letter-spacing': '-0.02em',
};

/**
 * Transition scale — xs/sm/md/lg/xl steps (non-fluid).
 *
 * Values track web de-facto convention:
 *   75ms  — flicker / micro-interaction
 *   150ms — quick UI feedback (default hover)
 *   250ms — state change, reveal (scale default)
 *   400ms — deliberate transitions, cards entering
 *   700ms — dramatic, full-screen changes
 *
 * `ease-out` is the default easing (enters quickly, settles gently)
 * per Material / Apple HIG UI conventions.
 *
 * Consumers override any step or the singular `--transition` /
 * `--duration` / `--ease` alias to retune without redefining the full
 * scale.
 */
const transitions: Record<string, string> = {
  // Duration steps
  '--duration-xs': '75ms',
  '--duration-sm': '150ms',
  '--duration-md': '250ms',
  '--duration-lg': '400ms',
  '--duration-xl': '700ms',
  '--duration': 'var(--duration-md)',

  // Easing functions
  '--ease-linear': 'linear',
  '--ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  '--ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Playful motion primitives — overshoot/spring feel for UI affordances.
  '--ease-bouncy': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  '--ease-elastic':
    'linear(0, 0.029 1.6%, 0.123 3.5%, 0.651 10.6%, 0.862 14.1%, 1.002 17.7%, 1.046 19.6%, 1.074 21.6%, 1.087 23.9%, 1.086 26.6%, 1.014 38.5%, 0.994 46.3%, 1)',
  '--ease': 'var(--ease-out)',

  // Combined shorthand (duration + easing)
  '--transition-xs': 'var(--duration-xs) var(--ease)',
  '--transition-sm': 'var(--duration-sm) var(--ease)',
  '--transition-md': 'var(--duration-md) var(--ease)',
  '--transition-lg': 'var(--duration-lg) var(--ease)',
  '--transition-xl': 'var(--duration-xl) var(--ease)',
  '--transition': 'var(--transition-md)',
};

/**
 * Grid templates — shipped vars for `grid-N`, `grid-N-M`, and `grid-auto-N`.
 *
 * `--auto-grid-aggressiveness` controls the column-collapse threshold for
 * auto-fit grids:
 *   - Default `0.7` — columns shrink to 70% of nominal width before wrapping.
 *   - Lower (e.g. `0.5`) — columns shrink further; more fit per row at narrow
 *                          viewports (aggressive packing, wraps later).
 *   - Higher (e.g. `1.0`) — columns must keep more space; wraps earlier
 *                            (conservative).
 *
 * Auto-grid formulas reference:
 *   - `--content-width` (preset-level, `90rem` default)
 *   - `--grid-gap` (consumer-level, fallback to `--space-md`)
 *   - `--auto-grid-aggressiveness` (preset default `0.7`)
 */
const gridTemplates: Record<string, string> = {
  // Equal-column grids (1..12)
  '--grid-1': 'repeat(1, minmax(0, 1fr))',
  '--grid-2': 'repeat(2, minmax(0, 1fr))',
  '--grid-3': 'repeat(3, minmax(0, 1fr))',
  '--grid-4': 'repeat(4, minmax(0, 1fr))',
  '--grid-5': 'repeat(5, minmax(0, 1fr))',
  '--grid-6': 'repeat(6, minmax(0, 1fr))',
  '--grid-7': 'repeat(7, minmax(0, 1fr))',
  '--grid-8': 'repeat(8, minmax(0, 1fr))',
  '--grid-9': 'repeat(9, minmax(0, 1fr))',
  '--grid-10': 'repeat(10, minmax(0, 1fr))',
  '--grid-11': 'repeat(11, minmax(0, 1fr))',
  '--grid-12': 'repeat(12, minmax(0, 1fr))',

  // Asymmetric 2-col ratios
  '--grid-1-2': 'minmax(0, 1fr) minmax(0, 2fr)',
  '--grid-1-3': 'minmax(0, 1fr) minmax(0, 3fr)',
  '--grid-2-1': 'minmax(0, 2fr) minmax(0, 1fr)',
  '--grid-2-3': 'minmax(0, 2fr) minmax(0, 3fr)',
  '--grid-3-1': 'minmax(0, 3fr) minmax(0, 1fr)',
  '--grid-3-2': 'minmax(0, 3fr) minmax(0, 2fr)',

  '--auto-grid-aggressiveness': '0.7',
};

// Auto-grid (auto-fit) templates generated from a parametric formula. Each
// step's per-column minimum is the nominal column width (content-width minus
// gaps, divided by N) scaled by `--auto-grid-aggressiveness`. The `min(100%,
// ...)` clamp prevents the minimum exceeding the viewport, keeping the grid
// usable on very narrow screens.
function buildAutoGrid(maxCols: number): Record<string, string> {
  const out: Record<string, string> = {};
  const gap = 'var(--grid-gap, var(--space-md))';
  const contentWidth = 'var(--content-width)';
  const aggression = 'var(--auto-grid-aggressiveness)';
  for (let n = 2; n <= maxCols; n++) {
    out[`--grid-auto-${n}`] =
      `repeat(auto-fit, minmax(min(100%, ` +
      `calc((${contentWidth} - ((${n} - 1) * ${gap})) * ${aggression} / ${n})), 1fr))`;
  }
  return out;
}

/**
 * Layout primitives shipped as defaults — consumer-overridable. `.container`
 * and `.stack` utilities read these directly. `.is-bg`, sticky scroll-margin,
 * and section auto-layout in reset.css also depend on these.
 */
const layoutDefaults: Record<string, string> = {
  '--content-width': '90rem',
  '--content-width-safe': '100%',
  '--feature-width': '80%',
  '--feature-max-width': '65rem',
  '--full': '100%',
  '--gutter': 'var(--space-md)',
  '--container-gap': 'var(--space-lg)',
  '--content-gap': 'var(--space-md)',
  '--section-padding-block': 'var(--section-space-md)',
  '--offset': '0',
  '--sticky-offset': '0',
  '--scrollbar-width': '0',
};

/**
 * Semantic color aliases — minimal set used by reset.css. Routed through
 * `light-dark()` so themes flip via `color-scheme` (set on `:root` and
 * `html[data-theme='dark']` in preflights). Override any of these in the
 * consumer's `theme.preflightBase` to retheme.
 */
const semanticColors: Record<string, string> = {
  '--bg-canvas': 'light-dark(var(--color-neutral-50), var(--color-base-900))',
  '--bg-surface': 'light-dark(var(--color-neutral-50), var(--color-base-800))',
  '--bg-inverse': 'light-dark(var(--color-base-900), var(--color-neutral-50))',
  '--text-color': 'light-dark(var(--color-base-900), var(--color-neutral-50))',
  '--text-muted': 'light-dark(var(--color-base-700), var(--color-neutral-300))',
  '--text-inverse': 'light-dark(var(--color-neutral-50), var(--color-base-900))',
  '--text-primary': 'var(--color-primary-500)',
  '--border-default': 'light-dark(var(--color-base-200), var(--color-base-700))',
};

/**
 * Typography rhythm tokens — consumed by reset.css typography section.
 * All map to the fluid space scale by default.
 */
const typographyRhythm: Record<string, string> = {
  '--paragraph-spacing': 'var(--space-md)',
  '--heading-spacing': 'var(--space-md)',
  '--h2-spacing': 'var(--space-lg)',
  '--h3-spacing': 'var(--space-md)',
  '--h4-spacing': 'var(--space-md)',
  '--h5-spacing': 'var(--space-sm)',
  '--h6-spacing': 'var(--space-sm)',
  '--blockquote-spacing': 'var(--space-md)',
  '--figure-spacing': 'var(--space-md)',
  '--figcaption-spacing': 'var(--space-sm)',
  '--list-spacing': 'var(--space-md)',
  '--list-item-spacing': 'var(--space-xs)',
  '--list-indent-spacing': 'var(--space-md)',
  '--nested-list-spacing': 'var(--space-sm)',
  '--nested-list-item-spacing': 'var(--space-xs)',
  '--nested-list-indent-spacing': 'var(--space-md)',
  '--stack-spacing': 'var(--space-md)',
};

/**
 * `.is-bg` background-helper tokens (consumed by reset.css §7h Utilities).
 */
const bgHelper: Record<string, string> = {
  '--bg-height': '100%',
  '--bg-width': '100%',
  '--bg-inset': '0',
  '--bg-position': 'center',
  '--bg-radius': '0',
  '--bg-z-index': '-1',
  '--bg-object-fit': 'cover',
  '--bg-object-position': 'center',
};

/**
 * Card primitive tokens (.card in reset.css §7g). Consumer override-friendly.
 */
const cardTokens: Record<string, string> = {
  '--card-display': 'flex',
  '--card-flex-direction': 'column',
  '--card-background': 'var(--bg-surface)',
  '--card-text-color': 'var(--text-color)',
  '--card-border-color': 'var(--border-default)',
  '--card-border-style': 'solid',
  '--card-border-width': '1px',
  '--card-radius': 'var(--radius-md)',
  '--card-padding': 'var(--space-md)',
  '--card-gap': 'var(--space-sm)',
  '--card-shadow': 'var(--shadow-sm)',
  '--card-transition': 'var(--transition)',
  '--card-overflow': 'hidden',
};

/**
 * Icon primitive tokens ([data-icon] in reset.css §7e). Override individual
 * sizes/paddings or the singular `--icon-size`/`--icon-padding` aliases.
 */
const iconTokens: Record<string, string> = {
  '--icon-background': 'transparent',
  '--icon-background-hover': 'var(--color-neutral-100)',
  '--icon-color': 'currentColor',
  '--icon-color-hover': 'currentColor',
  '--icon-border-color': 'transparent',
  '--icon-border-color-hover': 'var(--border-default)',
  '--icon-border-style': 'solid',
  '--icon-border-width': '0',
  '--icon-radius': 'var(--radius-sm)',
  '--icon-shadow': 'none',
  '--icon-transition': 'var(--transition)',
  '--icon-scheme': 'normal',
  '--icon-size-xs': '1rem',
  '--icon-size-sm': '1.25rem',
  '--icon-size-md': '1.5rem',
  '--icon-size-lg': '2rem',
  '--icon-size-xl': '2.5rem',
  '--icon-size-2xl': '3rem',
  '--icon-size': 'var(--icon-size-md)',
  '--icon-padding-xs': '0.25rem',
  '--icon-padding-sm': '0.375rem',
  '--icon-padding-md': '0.5rem',
  '--icon-padding-lg': '0.75rem',
  '--icon-padding-xl': '1rem',
  '--icon-padding-2xl': '1.25rem',
  '--icon-padding': 'var(--icon-padding-md)',
  '--icon-block-offset': '0',
  '--icon-inline-offset': '0',
  '--icon-height': 'var(--icon-size)',
  '--icon-width': 'var(--icon-size)',
  '--icon-list-gap': 'var(--space-sm)',
  '--icon-list-icon-size': 'var(--icon-size-md)',
};

/**
 * Focus ring tokens (reset.css §9 Accessibility).
 */
const focusTokens: Record<string, string> = {
  '--focus-ring': 'var(--color-primary-500)',
  '--focus-offset': '2px',
  '--focus-width': '2px',
};

/**
 * Overlay / modal tokens (reset.css §7h `.overlay`).
 */
const overlayTokens: Record<string, string> = {
  '--overlay-color': 'color-mix(in oklch, var(--color-base-900) 60%, transparent)',
  '--overlay-z-index': '100',
  '--modal-overlay-backdrop-filter': 'blur(4px)',
};

/**
 * Ring base — initial values for preset-mini's ring composition. Wired here
 * (not via `ringBase` import) so the var defaults always exist regardless
 * of whether any `ring-*` utility is generated.
 */
const ringBaseTokens: Record<string, string> = {
  '--un-ring-inset': ' ',
  '--un-ring-offset-width': '0px',
  '--un-ring-offset-color': '#fff',
  '--un-ring-width': '0px',
  '--un-ring-color': 'rgb(147 197 253 / 0.5)',
  '--un-ring-offset-shadow': '0 0 rgb(0 0 0 / 0)',
  '--un-ring-shadow': '0 0 rgb(0 0 0 / 0)',
  '--un-shadow': '0 0 rgb(0 0 0 / 0)',
};

function buildFluidEntries(): Record<string, string> {
  const text = generateFluidScale(fluidConfig.text, fluidConfig.viewport);
  const heading = generateFluidScale(fluidConfig.heading, fluidConfig.viewport);
  const space = generateFluidScale(fluidConfig.space, fluidConfig.viewport);
  const sectionSpace = generateSectionSpace(
    fluidConfig.sectionSpace,
    fluidConfig.space,
    fluidConfig.viewport,
  );
  return {
    ...prefixKeys(text),
    ...prefixKeys(heading),
    ...prefixKeys(space),
    ...prefixKeys(sectionSpace),
  };
}

export const preflightBase: Record<string, string> = {
  ...buildColorEntries(),
  ...absolutes,
  ...buildFluidEntries(),
  ...lineHeights,
  ...radii,
  ...shadows,
  ...fontFamilies,
  ...typographyDefaults,
  ...transitions,
  ...gridTemplates,
  ...buildAutoGrid(12),
  ...layoutDefaults,
  ...semanticColors,
  ...typographyRhythm,
  ...bgHelper,
  ...cardTokens,
  ...iconTokens,
  ...focusTokens,
  ...overlayTokens,
  ...ringBaseTokens,
};

export const preflightRoot: string[] = [':root'];
