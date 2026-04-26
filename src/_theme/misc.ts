import type { Theme } from './types';

export const breakpoints = {
  'sm': '478px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
} satisfies Theme['breakpoints'];

export const verticalBreakpoints = { ...breakpoints } satisfies Theme['breakpoints'];

export const lineWidth = {
  DEFAULT: '1px',
  none: '0',
} satisfies Theme['lineWidth'];

export const borderRadius = {
  'DEFAULT': 'var(--radius-md)',
  'none': '0',
  'xs': 'var(--radius-xs)',
  'sm': 'var(--radius-sm)',
  'md': 'var(--radius-md)',
  'lg': 'var(--radius-lg)',
  'xl': 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  'full': '9999px',
} satisfies Theme['borderRadius'];

export const boxShadow = {
  DEFAULT: 'var(--shadow-md)',
  none: '0 0 rgb(0 0 0 / 0)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
} satisfies Theme['boxShadow'];

// Transition scale — xs/sm/md/lg/xl steps (non-fluid, consistent with
// other preset scales). All values resolve to `var(--*)` tokens emitted
// by preflight.ts, so consumers can retune a step by overriding the var
// without rebuilding. See preflight.ts for actual values and conventions.
export const duration = {
  'DEFAULT': 'var(--duration)',
  'none': '0s',
  'xs': 'var(--duration-xs)',
  'sm': 'var(--duration-sm)',
  'md': 'var(--duration-md)',
  'lg': 'var(--duration-lg)',
  'xl': 'var(--duration-xl)',
} satisfies Theme['duration'];

export const easing = {
  DEFAULT: 'var(--ease)',
  linear: 'var(--ease-linear)',
  in: 'var(--ease-in)',
  out: 'var(--ease-out)',
  'in-out': 'var(--ease-in-out)',
} satisfies Theme['easing'];

export const transitionProperty = {
  none: 'none',
  all: 'all',
  DEFAULT: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
} satisfies Theme['transitionProperty'];

export const ringWidth = {
  DEFAULT: '3px',
  none: '0',
} satisfies Theme['ringWidth'];

export const zIndex = {
  auto: 'auto',
} satisfies Theme['zIndex'];

export const media = {
  mouse: '(hover) and (pointer: fine)',
};

/**
 * Grid template columns — keys for the `grid-{k}` utility.
 *
 * Values resolve to `var(--grid-{k})` so templates are runtime-overridable.
 * Actual template strings live in preflight.ts alongside the CSS var emissions.
 *
 * Auto-fit variants `grid-auto-{2..12}` use a parametric formula that
 * adapts column count based on `--content-width`, `--grid-gap`, and
 * `--auto-grid-aggressiveness`.
 */
const equalGridKeys = ['1','2','3','4','5','6','7','8','9','10','11','12'] as const;
const ratioGridKeys = ['1-2','1-3','2-1','2-3','3-1','3-2'] as const;
const autoGridKeys = ['auto-2','auto-3','auto-4','auto-5','auto-6','auto-7','auto-8','auto-9','auto-10','auto-11','auto-12'] as const;

export const gridTemplateColumns: Record<string, string> = Object.fromEntries([
  ...equalGridKeys.map((k) => [k, `var(--grid-${k})`]),
  ...ratioGridKeys.map((k) => [k, `var(--grid-${k})`]),
  ...autoGridKeys.map((k) => [k, `var(--grid-${k})`]),
]);
