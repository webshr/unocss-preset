import type { Rule } from '@unocss/core';
import { cornerMap, h } from '@unocss/preset-mini/utils';
import type { Theme } from '../_theme/types';

/**
 * Border-radius utilities — `radius-*`.
 *
 * Named consistently with the preset's token convention (`--radius-{step}`
 * → `radius-{step}`) rather than the Tailwind `rounded-*` legacy. Every
 * other scale in this preset preserves its step name in the utility (space
 * → p-md, text-md, shadow-md, duration-md, etc.); radius follows the same
 * rule instead of being the lone outlier.
 *
 * Resolves from `theme.borderRadius` (which points at `var(--radius-{step})`),
 * so tokens are runtime-overridable.
 *
 * Corner specifiers (adapted from preset-mini's cornerMap):
 *
 *   radius              → all four corners
 *   radius-md           → all four, step md
 *   radius-t            → top two corners (top-left, top-right)
 *   radius-r / l / b    → one side's two corners
 *   radius-tl           → top-left corner only
 *   radius-tr / bl / br → single corner variants
 *   radius-s / e        → logical inline-start / inline-end (two corners each)
 *   radius-bs / be      → logical block-start / block-end
 *   radius-is / ie      → logical inline-start / inline-end
 *   radius-bs-is        → logical single corner (block-start inline-start)
 *
 * Arbitrary values: `radius-[12px]`, `radius-$my-var` via preset-mini's
 * bracket/cssvar/fraction/rem chain.
 */

function handlerRadius(
  [, corner = '', size]: RegExpMatchArray,
  { theme }: { theme: Theme },
) {
  const v =
    (theme.borderRadius as Record<string, string> | undefined)?.[size || 'DEFAULT'] ||
    h.bracket.cssvar.global.fraction.rem(size || '1');
  if (corner in (cornerMap as Record<string, string[]>) && v != null) {
    return (cornerMap as Record<string, string[]>)[corner]!.map(
      (i): [string, string] => [`border${i}-radius`, v],
    );
  }
}

export const radius: Rule<Theme>[] = [
  // All four corners
  [
    /^radius()(?:-(.+))?$/,
    handlerRadius,
    { autocomplete: ['radius', 'radius-$borderRadius'] },
  ],
  // Side (r|l|t|b|s|e) — two corners
  [/^radius-([rltbse])(?:-(.+))?$/, handlerRadius],
  // Corner pair (tl|tr|bl|br)
  [/^radius-([rltb]{2})(?:-(.+))?$/, handlerRadius],
  // Logical pair (bs|be|is|ie)
  [/^radius-([bise][se])(?:-(.+))?$/, handlerRadius],
  // Logical single corner (bs-is, be-ie, etc.)
  [/^radius-([bi][se]-[bi][se])(?:-(.+))?$/, handlerRadius],
];
