import type { Rule } from '@unocss/core';
import type { Theme } from '../_theme/types';

/**
 * Heading utilities — `h1..h6` and fluid-pair variants (`h1-to-h3`,
 * `h2-to-h6`, etc.).
 *
 * Class names match the theme step names directly (no `heading-` prefix),
 * consistent with the preset's token→utility naming convention (`--h1`
 * → `.h1`, `--h1-to-h3` → `.h1-to-h3`).
 *
 * Emits `font-size` from `theme.heading` and `line-height` from
 * `--heading-line-height` (a role token, distinct from `--text-line-height`,
 * intentionally tighter for headings).
 *
 * Regex is bounded (`^h[1-6](?:-to-h[1-6])?$`) to avoid swallowing
 * unrelated class names that happen to start with `h`.
 *
 * Other heading-role styling (`font-family`, `font-weight`, `letter-spacing`,
 * `text-wrap: balance`) is NOT bundled here — apply via `font-heading` and
 * complementary utilities so consumers can compose freely. The role tokens
 * (`--heading-font-family`, `--heading-letter-spacing`, etc.) remain
 * available for direct CSS use.
 */
export const heading: Rule<Theme>[] = [
  [
    /^(h[1-6](?:-to-h[1-6])?)$/,
    ([, step], { theme }) => {
      const value = (theme.heading as Record<string, string> | undefined)?.[step!];
      if (value == null) return;
      return {
        'font-size': value,
        'line-height': 'var(--heading-line-height)',
      };
    },
    { autocomplete: '(h1|h2|h3|h4|h5|h6)(-to-(h1|h2|h3|h4|h5|h6))?' },
  ],
];
