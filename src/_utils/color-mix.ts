import type { DynamicMatcher } from '@unocss/core';
import { colorResolver, h, parseColor } from '@unocss/preset-mini/utils';
import type { Theme } from '../_theme/types';

/**
 * Normalize the opacity modifier value extracted by parseColor (e.g. `50` from
 * `bg-primary-500/50`, or `0.3`, or `$myvar`, or `[0.75]`) into a CSS alpha
 * expression suitable for the second argument of `color-mix(in oklch, COLOR
 * ALPHA, transparent)`.
 *
 * - integer 1-100        → "50%"
 * - decimal 0-1          → "75%"
 * - $var                 → "calc(var(--var) * 1%)" via h.cssvar
 * - [arbitrary]          → literal bracket body
 *
 * Empty string and non-numeric inputs return undefined so the caller can
 * fall through to preset-mini's standard handling.
 */
function normalizeAlpha(opacity: string): string | undefined {
  if (!opacity) return undefined;

  // Already a percentage literal
  if (opacity.endsWith('%')) return opacity;

  // CSS variable reference: $my-var  →  calc(var(--my-var) * 1%)
  const cssvar = h.cssvar(opacity);
  if (cssvar) return `calc(${cssvar} * 1%)`;

  // Bracket arbitrary value: [0.75]  or  [75%]  or  [var(--a)]
  const bracket = h.bracket(opacity);
  if (bracket) {
    if (bracket.endsWith('%')) return bracket;
    const n = Number(bracket);
    if (Number.isFinite(n)) {
      if (n > 1 && n <= 100) return `${n}%`;
      if (n >= 0 && n <= 1) return `${n * 100}%`;
    }
    return `calc(${bracket} * 1%)`;
  }

  // Plain numeric token
  const n = Number(opacity);
  if (Number.isFinite(n) && n !== 0) {
    if (n > 1 && n <= 100) return `${n}%`;
    if (n > 0 && n <= 1) return `${n * 100}%`;
  }
  return undefined;
}

/**
 * Color resolver that handles opacity modifiers against var-ref colors.
 *
 * When a theme color resolves to a `var(--*)` reference (as this preset does),
 * preset-mini's built-in opacity machinery (`--un-*-opacity` with rgb channel
 * splitting) can't operate on it. This wraps the var reference in
 * `color-mix(in oklch, VAR ALPHA%, transparent)` so opacity modifiers apply
 * uniformly.
 *
 * When the color is a literal (hex, rgb, named color), delegates to
 * preset-mini's `colorResolver` unchanged so standard handling applies.
 *
 * Usage:
 *   [/^bg-(.+)$/, colorMixResolver('background-color', 'bg', 'backgroundColor')]
 */
export function colorMixResolver(
  property: string,
  varName: string,
  themeKey?: string,
): DynamicMatcher<Theme> {
  const fallback = colorResolver(property, varName, themeKey as never) as DynamicMatcher<Theme>;
  return (match, ctx) => {
    const body = match[1] ?? '';
    const data = parseColor(body, ctx.theme as never, themeKey as never);
    if (data && data.color && !data.cssColor && data.opacity) {
      const alpha = normalizeAlpha(data.opacity);
      if (alpha) {
        return {
          [property]: `color-mix(in oklch, ${data.color} ${alpha}, transparent)`,
        } as never;
      }
    }
    return fallback(match, ctx);
  };
}
