import type { Theme } from './types';

/**
 * Color system — single source of truth.
 *
 * `colorFamilies` drives BOTH:
 *   1. `rawColorValues` — oklch source of truth, emitted as
 *      `--color-{family}-{step}` CSS variables in `preflight.ts`.
 *   2. `colorScales` — `theme.colors[family][step]` mappings to those vars,
 *      generated programmatically below so the two stay in lockstep.
 *
 * To add or remove a family: update `colorFamilies`, add/remove the matching
 * entry in `rawColorValues` and `alphaBaseStep`. Everything else (preflight
 * emission, theme keys, utility class generation) follows automatically.
 */
export const colorFamilies = [
  'primary',
  'secondary',
  'accent',
  'base',
  'neutral',
  'error',
  'warning',
  'success',
  'info',
] as const;

export type ColorFamily = (typeof colorFamilies)[number];

export const colorSteps = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
] as const;

export const alphaVariants = ['faint', 'soft', 'muted'] as const;

export type ColorStep = (typeof colorSteps)[number];
export type AlphaVariant = (typeof alphaVariants)[number];

/**
 * Programmatically build the `theme.colors` shape from `colorFamilies` so
 * adding a family doesn't require duplicating 14 var() references.
 */
function buildColorScales(): Record<ColorFamily, Record<string, string>> {
  const out = {} as Record<ColorFamily, Record<string, string>>;
  for (const family of colorFamilies) {
    const scale: Record<string, string> = {};
    for (const step of colorSteps) {
      scale[step] = `var(--color-${family}-${step})`;
    }
    for (const alpha of alphaVariants) {
      scale[alpha] = `var(--color-${family}-${alpha})`;
    }
    out[family] = scale;
  }
  return out;
}

export const colorScales = buildColorScales();

/**
 * Per-family base step for alpha variants.
 *
 * `faint` / `soft` / `muted` are computed via
 * `color-mix(in oklch, base STEP%, transparent)` in preflight.ts. Cool/dark
 * families (primary, base) anchor at step 900 so washes stay readable on
 * light backgrounds; saturated families anchor at step 500 for balanced
 * visibility on either theme.
 */
export const alphaBaseStep: Record<ColorFamily, ColorStep> = {
  primary: '900',
  secondary: '500',
  accent: '500',
  base: '900',
  neutral: '500',
  error: '500',
  warning: '500',
  success: '500',
  info: '500',
};

/**
 * Alpha percentages for `faint` / `soft` / `muted` variants.
 *   faint  → 10% (subtle background tint)
 *   soft   → 20% (background hover/selected state)
 *   muted  → 80% (semi-transparent foreground)
 */
export const alphaPercent: Record<AlphaVariant, number> = {
  faint: 10,
  soft: 20,
  muted: 80,
};

export const rawColorValues = {
  primary: {
    50: 'oklch(0.97 0.008 75)',
    100: 'oklch(0.95 0.008 75)',
    200: 'oklch(0.9 0.009 75)',
    300: 'oklch(0.82 0.01 75)',
    400: 'oklch(0.68 0.012 72)',
    500: 'oklch(0.55 0.014 72)',
    600: 'oklch(0.42 0.014 70)',
    700: 'oklch(0.32 0.012 68)',
    800: 'oklch(0.22 0.01 65)',
    900: 'oklch(0.15 0.008 60)',
    950: 'oklch(0.08 0.006 60)',
  },
  secondary: {
    50: 'oklch(0.96 0.008 78)',
    100: 'oklch(0.92 0.01 78)',
    200: 'oklch(0.85 0.012 78)',
    300: 'oklch(0.75 0.014 78)',
    400: 'oklch(0.65 0.015 78)',
    500: 'oklch(0.55 0.016 78)',
    600: 'oklch(0.45 0.015 75)',
    700: 'oklch(0.35 0.013 72)',
    800: 'oklch(0.25 0.011 70)',
    900: 'oklch(0.18 0.009 65)',
    950: 'oklch(0.1 0.007 60)',
  },
  accent: {
    50: 'oklch(0.97 0.02 35)',
    100: 'oklch(0.95 0.045 35)',
    200: 'oklch(0.88 0.08 35)',
    300: 'oklch(0.76 0.128 35)',
    400: 'oklch(0.65 0.145 35)',
    500: 'oklch(0.51 0.156 35)',
    600: 'oklch(0.46 0.162 35)',
    700: 'oklch(0.38 0.14 35)',
    800: 'oklch(0.3 0.118 35)',
    900: 'oklch(0.22 0.09 35)',
    950: 'oklch(0.13 0.055 35)',
  },
  base: {
    50: 'oklch(0.97 0.018 75)',
    100: 'oklch(0.95 0.018 75)',
    200: 'oklch(0.9 0.018 75)',
    300: 'oklch(0.82 0.018 75)',
    400: 'oklch(0.65 0.02 72)',
    500: 'oklch(0.5 0.02 72)',
    600: 'oklch(0.4 0.02 70)',
    700: 'oklch(0.32 0.02 70)',
    800: 'oklch(0.25 0.02 79)',
    900: 'oklch(0.21 0.012 60)',
    950: 'oklch(0.1 0.015 60)',
  },
  neutral: {
    50: 'oklch(0.97 0.008 75)',
    100: 'oklch(0.95 0.008 75)',
    200: 'oklch(0.92 0.008 75)',
    300: 'oklch(0.85 0.008 75)',
    400: 'oklch(0.68 0.008 75)',
    500: 'oklch(0.55 0.008 75)',
    600: 'oklch(0.42 0.008 75)',
    700: 'oklch(0.32 0.008 75)',
    800: 'oklch(0.22 0.008 75)',
    900: 'oklch(0.15 0.008 75)',
    950: 'oklch(0.08 0.008 75)',
  },
  error: {
    50: 'oklch(0.97 0.02 30)',
    100: 'oklch(0.95 0.033 30)',
    200: 'oklch(0.88 0.06 30)',
    300: 'oklch(0.78 0.1 30)',
    400: 'oklch(0.65 0.16 30)',
    500: 'oklch(0.51 0.175 30)',
    600: 'oklch(0.42 0.155 30)',
    700: 'oklch(0.33 0.12 30)',
    800: 'oklch(0.25 0.085 30)',
    900: 'oklch(0.18 0.06 30)',
    950: 'oklch(0.1 0.035 30)',
  },
  warning: {
    50: 'oklch(0.97 0.025 80)',
    100: 'oklch(0.95 0.04 80)',
    200: 'oklch(0.88 0.07 80)',
    300: 'oklch(0.8 0.1 80)',
    400: 'oklch(0.72 0.125 80)',
    500: 'oklch(0.65 0.13 80)',
    600: 'oklch(0.55 0.12 80)',
    700: 'oklch(0.42 0.1 80)',
    800: 'oklch(0.3 0.075 80)',
    900: 'oklch(0.2 0.05 80)',
    950: 'oklch(0.12 0.03 80)',
  },
  success: {
    50: 'oklch(0.97 0.025 125)',
    100: 'oklch(0.95 0.04 125)',
    200: 'oklch(0.88 0.06 125)',
    300: 'oklch(0.78 0.08 125)',
    400: 'oklch(0.65 0.095 125)',
    500: 'oklch(0.54 0.09 125)',
    600: 'oklch(0.44 0.08 125)',
    700: 'oklch(0.35 0.065 125)',
    800: 'oklch(0.26 0.05 125)',
    900: 'oklch(0.18 0.035 125)',
    950: 'oklch(0.1 0.022 125)',
  },
  info: {
    50: 'oklch(0.97 0.025 212)',
    100: 'oklch(0.95 0.045 212)',
    200: 'oklch(0.88 0.075 212)',
    300: 'oklch(0.78 0.1 212)',
    400: 'oklch(0.72 0.11 212)',
    500: 'oklch(0.65 0.11 212)',
    600: 'oklch(0.52 0.095 212)',
    700: 'oklch(0.4 0.08 212)',
    800: 'oklch(0.28 0.06 212)',
    900: 'oklch(0.18 0.04 212)',
    950: 'oklch(0.1 0.023 212)',
  },
} as const satisfies Record<ColorFamily, Record<ColorStep, string>>;

export const colors = {
  inherit: 'inherit',
  current: 'currentColor',
  transparent: 'transparent',
  black: 'var(--color-black)',
  white: 'var(--color-white)',
  ...colorScales,
} satisfies Theme['colors'];

/**
 * Convenience aliases applied as a one-pass mutation on the scale objects:
 *   1. `DEFAULT` step → step `400` (so `bg-primary` = `bg-primary-400`).
 *   2. Numeric short forms — `5` → `500`, `1` → `100`, etc.
 *      (`bg-primary-5` resolves the same as `bg-primary-500`.)
 *
 * Module-level mutation: `package.json` declares `sideEffects: false`, but
 * theme objects are imported eagerly by `definePreset`, so this runs before
 * any utility is generated and tree-shaking is unaffected (the mutation
 * targets values local to this module).
 */
Object.values(colors as Required<Theme>['colors']).forEach((color) => {
  if (typeof color !== 'string' && color !== undefined) {
    const c = color as Record<string, string>;
    c.DEFAULT = c.DEFAULT || c[400];
    Object.keys(c).forEach((key) => {
      const short = +key / 100;
      if (short === Math.round(short)) c[String(short)] = c[key];
    });
  }
});
