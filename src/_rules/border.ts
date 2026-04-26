import type { Rule } from '@unocss/core';
import { borders as miniBorders, rings as miniRings } from '@unocss/preset-mini/rules';
import type { Theme } from '../_theme/types';

/**
 * Border + ring utilities.
 *
 * Re-exports preset-mini's `borders` rule set WITHOUT its radius rules,
 * which are replaced by our `radius-*` rules in `radius.ts` (renamed for
 * naming consistency with the rest of the preset's token→utility mapping:
 * `--radius-{step}` → `radius-{step}`, matching `--space-md` → `p-md`,
 * `--text-md` → `text-md`, etc.).
 *
 * Re-exports preset-mini's `rings` rule set so the full ring API is wired
 * end-to-end:
 *
 *   ring                — base box-shadow composition (reads --un-ring-*)
 *   ring-1, ring-2, ... — ring widths
 *   ring-offset-N       — ring offset width
 *   ring-inset          — inset variant
 *   ring-offset-{color} — ring offset color
 *
 * The `ring-{color}` color rule from preset-mini is FILTERED OUT — it uses
 * preset-mini's rgb opacity machinery which can't compute against
 * `var(--color-*)` references. Our local `ring-(.+)` rule in `color.ts`
 * (using `colorMixResolver`) replaces it so opacity modifiers like
 * `ring-primary-500/50` work via `color-mix(in oklch, …)`.
 *
 * Also filtered: preset-mini's `ring-op(acity)?-(.+)` rule (irrelevant since
 * our color-mix path bakes alpha directly into the color value).
 */

const isRadiusRule = (rule: Rule<Theme>): boolean => {
  const source = (rule[0] as RegExp | string).toString();
  return source.includes('rounded|rd');
};

// Drop preset-mini's `ring-(.+)` color rule and `ring-op*` opacity rule —
// our colorMixResolver-backed version in `color.ts` handles both via the
// `color-mix(...)` opacity path.
const isPresetMiniRingColorOrOpacity = (rule: Rule<Theme>): boolean => {
  const src = (rule[0] as RegExp | string).toString();
  // Match exactly `/^ring-(.+)$/` (color) and `/^ring-op(?:acity)?-?(.+)$/`
  return src === '/^ring-(.+)$/' || src.startsWith('/^ring-op');
};

export const border: Rule<Theme>[] = [
  ...(miniBorders as Rule<Theme>[]).filter((r) => !isRadiusRule(r)),
  ...(miniRings as Rule<Theme>[]).filter((r) => !isPresetMiniRingColorOrOpacity(r)),
];
