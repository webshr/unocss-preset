import type { Rule } from '@unocss/core';
import { h } from '@unocss/preset-mini/utils';
import type { Theme } from '../_theme/types';

/**
 * Shadow utilities.
 *
 * Resolves against `theme.boxShadow` (sm | md | lg | none + DEFAULT) which
 * points at preflight tokens `--shadow-sm|md|lg`. Falls back to bracket
 * arbitrary and CSS variable references.
 *
 * Note: this preset does NOT ship preset-mini's ring-offset shadow machinery
 * (`--un-ring-offset-shadow`, `--un-shadow-inset`, etc). If you need ring
 * stacking, add it via consumer config or swap to preset-mini's `boxShadows`
 * rule export.
 */
export const shadow: Rule<Theme>[] = [
  [
    /^shadow(?:-(.+))?$/,
    ([, d], { theme }) => {
      const value =
        (theme.boxShadow as Record<string, string> | undefined)?.[d || 'DEFAULT'] ??
        h.bracket.cssvar(d ?? '');
      if (value != null) return { 'box-shadow': value };
    },
    { autocomplete: ['shadow', 'shadow-$boxShadow'] },
  ],
];
