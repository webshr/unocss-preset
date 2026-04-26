import type { Rule } from '@unocss/core';
import type { Theme } from '../_theme/types';

/**
 * Grid template column utilities.
 *
 * Matches against `theme.gridTemplateColumns` keys:
 *   - Equal columns:    grid-1 .. grid-12
 *   - Asymmetric 2-col: grid-1-2, grid-1-3, grid-2-1, grid-2-3, grid-3-1, grid-3-2
 *   - Auto-fit:         grid-auto-2 .. grid-auto-12
 *
 * Emits `grid-template-columns: var(--grid-{k})` (not the literal value),
 * so templates are runtime-overridable. The underlying `--grid-*` CSS vars
 * are emitted into `:root` via preflight.ts.
 *
 * Consumer can extend the theme to add more template keys:
 *
 *   theme: {
 *     gridTemplateColumns: {
 *       hero: 'minmax(0, 2fr) minmax(0, 3fr) minmax(0, 1fr)',
 *     },
 *   }
 *
 * Then `.grid-hero` resolves via the same rule (the consumer must also
 * emit `--grid-hero` in their preflightBase for the var indirection to
 * work, OR the rule falls back to the literal value for consumer extensions).
 */
export const grid: Rule<Theme>[] = [
  [
    /^grid-(.+)$/,
    ([, k], { theme }) => {
      const v = (theme.gridTemplateColumns as Record<string, string> | undefined)?.[k!];
      if (v != null) return { display: 'grid', 'grid-template-columns': v };
    },
    { autocomplete: 'grid-(1|2|3|4|5|6|7|8|9|10|11|12|1-2|1-3|2-1|2-3|3-1|3-2|auto-2|auto-3|auto-4|auto-5|auto-6|auto-7|auto-8|auto-9|auto-10|auto-11|auto-12)' },
  ],
];
