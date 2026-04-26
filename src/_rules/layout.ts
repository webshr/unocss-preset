import type { Rule } from '@unocss/core';
import { symbols } from '@unocss/core';
import type { Theme } from '../_theme/types';

/**
 * Layout primitives — `.container` and `.box`.
 *
 * Both are flex-column wrappers that gap their children consistently with
 * the preset's flex-based layout story. Below the `md` breakpoint they
 * also `flex-wrap: wrap`, allowing nested rows to break onto new lines
 * without explicit responsive utilities.
 *
 * `.container` — centered, max-width-capped page container. Width is
 *   `var(--content-width)` (90rem default), clamped to the viewport via
 *   `max-width: 100%`. Spacing comes from `--gutter` / `--container-gap`.
 *
 * `.box` — full-width flex-column wrapper, auto-gapped via `--content-gap`.
 *   Loose nod to Every Layout's `.box` primitive (a styled-container box),
 *   though this variant adds flex-direction + gap rather than padding/border.
 *   Naming intentionally avoids `.block` (left to preset-mini's native
 *   `display: block`) and `.stack` (which lives in `reset.css` as the Every
 *   Layout adjacent-sibling rhythm primitive — see RESET.md §7d).
 *
 * The `md` breakpoint is read from `theme.breakpoints.md` at generation
 * time, so consumer overrides cascade to the wrap threshold without a
 * preset rebuild.
 */

function belowBp(bp: string): string {
  return `(max-width: calc(${bp} - 1px))`;
}

/**
 * Returns base CSSObject + a responsive-wrap CSSObject. The second one uses
 * `symbols.parent` to wrap its output in `@media`. CSSObject direct
 * `@media`-key nesting isn't supported (UnoCSS stringifies nested objects);
 * the array + symbols.parent pattern is the idiomatic fix.
 */
function withResponsiveWrap(base: Record<string, string>, md: string) {
  return [
    base,
    {
      'flex-wrap': 'wrap',
      [symbols.parent]: `@media ${belowBp(md)}`,
    },
  ];
}

function resolveMd(theme: Theme): string {
  return (theme.breakpoints as Record<string, string> | undefined)?.md ?? '768px';
}

export const layout: Rule<Theme>[] = [
  [
    /^container$/,
    (_m, { theme }) =>
      withResponsiveWrap(
        {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'flex-start',
          'margin-inline': 'auto',
          width: 'var(--content-width)',
          'max-width': '100%',
        },
        resolveMd(theme),
      ),
    { autocomplete: 'container' },
  ],
  [
    /^box$/,
    (_m, { theme }) =>
      withResponsiveWrap(
        {
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'flex-start',
          width: '100%',
          gap: 'var(--content-gap)',
        },
        resolveMd(theme),
      ),
    { autocomplete: 'box' },
  ],
];
