import type { Rule, VariantHandler } from '@unocss/core';
import { symbols } from '@unocss/core';
import { directionSize, h } from '@unocss/preset-mini/utils';
import type { Theme } from '../_theme/types';

/**
 * Spacing utilities: padding, margin, gap, and space-between-children.
 *
 * All size tokens resolve against `theme.spacing` (fluid 2xs..3xl scale + all
 * `x-to-y` pairs) with fallback to arbitrary bracket values and rem-normalized
 * numeric inputs via preset-mini's `h.bracket.cssvar.global.rem` handler.
 *
 * `directionSize` is preset-mini's factory that maps the first capture group
 * to directional properties (`l|r|t|b|s|e`, `x|y`, `xy`, `block|inline`, bs/be/is/ie).
 */

// --- gap (column-gap, row-gap via directionMap) ---

const gapDirectionMap: Record<string, string> = {
  '': '',
  x: 'column-',
  y: 'row-',
  col: 'column-',
  row: 'row-',
};

function handleGap([, d = '', s]: RegExpMatchArray, { theme }: { theme: Theme }) {
  const value = (theme.spacing as Record<string, string> | undefined)?.[s!] ?? h.bracket.cssvar.global.rem(s!);
  if (value != null) return { [`${gapDirectionMap[d]}gap`]: value };
}

// --- space-x/y (margin between adjacent children, Tailwind-style) ---

/**
 * Variant that rewrites the selector to target all children except the last,
 * emitting `:where(&>:not(:last-child))` — matches Tailwind 4 / preset-wind4
 * semantics (margin-end on each non-last child).
 */
function nonLastChildVariant(matcher: string): VariantHandler {
  return {
    matcher,
    handle: (input, next) =>
      next({
        ...input,
        parent: `${input.parent ? `${input.parent} $$ ` : ''}${input.selector}`,
        selector: ':where(&>:not(:last-child))',
      }),
  };
}

function handleSpaceBetween(
  [m, d, s]: RegExpMatchArray,
  { theme }: { theme: Theme },
) {
  const value = (theme.spacing as Record<string, string> | undefined)?.[s!] ?? h.bracket.cssvar.global.rem(s!);
  if (value == null) return;
  // Tailwind 4 applies margin-end (right/bottom) on non-last children.
  // `--un-space-*-reverse` swaps start/end for `space-x-reverse` utilities.
  const startProp = d === 'x' ? 'margin-inline-start' : 'margin-block-start';
  const endProp = d === 'x' ? 'margin-inline-end' : 'margin-block-end';
  return {
    [symbols.variants]: [nonLastChildVariant(m!)],
    [`--un-space-${d}-reverse`]: '0',
    [startProp]: `calc(${value} * var(--un-space-${d}-reverse))`,
    [endProp]: `calc(${value} * calc(1 - var(--un-space-${d}-reverse)))`,
  };
}

export const spacing: Rule<Theme>[] = [
  // --- padding ---
  [/^pa?()-?(.+)$/, directionSize('padding'), { autocomplete: ['(m|p)<num>', '(m|p)-<num>'] }],
  [/^p-?xy()()$/, directionSize('padding'), { autocomplete: '(m|p)-(xy)' }],
  [/^p-?([xy])(?:-?(.+))?$/, directionSize('padding')],
  [/^p-?([rltbse])(?:-?(.+))?$/, directionSize('padding'), { autocomplete: '(m|p)<directions>-<num>' }],
  [/^p-(block|inline)(?:-(.+))?$/, directionSize('padding'), { autocomplete: '(m|p)-(block|inline)-<num>' }],
  [/^p-?([bi][se])(?:-?(.+))?$/, directionSize('padding'), { autocomplete: '(m|p)-(bs|be|is|ie)-<num>' }],

  // --- margin ---
  [/^ma?()-?(.+)$/, directionSize('margin')],
  [/^m-?xy()()$/, directionSize('margin')],
  [/^m-?([xy])(?:-?(.+))?$/, directionSize('margin')],
  [/^m-?([rltbse])(?:-?(.+))?$/, directionSize('margin')],
  [/^m-(block|inline)(?:-(.+))?$/, directionSize('margin')],
  [/^m-?([bi][se])(?:-?(.+))?$/, directionSize('margin')],

  // --- gap (grid + flex) ---
  [/^(?:flex-|grid-)?gap-?()(.+)$/, handleGap, { autocomplete: ['gap-$spacing', 'gap-<num>'] }],
  [/^(?:flex-|grid-)?gap-([xy])-?(.+)$/, handleGap, { autocomplete: 'gap-(x|y)-$spacing' }],
  [/^(?:flex-|grid-)?gap-(col|row)-?(.+)$/, handleGap, { autocomplete: 'gap-(col|row)-$spacing' }],

  // --- space-between children (Tailwind-style, applied via :where(&>:not(:last-child))) ---
  [/^space-([xy])-(.+)$/, handleSpaceBetween, {
    autocomplete: ['space-(x|y)', 'space-(x|y)-reverse', 'space-(x|y)-$spacing'],
  }],
  [
    /^space-([xy])-reverse$/,
    ([m, d]) => ({
      [symbols.variants]: [nonLastChildVariant(m!)],
      [`--un-space-${d}-reverse`]: '1',
    }),
  ],
];
