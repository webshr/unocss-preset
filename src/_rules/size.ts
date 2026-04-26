import type { Rule } from '@unocss/core';
import { h } from '@unocss/preset-mini/utils';
import type { Theme } from '../_theme/types';

/**
 * Size utilities — width, height, max/min, plus logical-property counterparts
 * (`inline-size`, `block-size`).
 *
 * Resolves against `theme.width|height|maxWidth|maxHeight|minWidth|minHeight|
 * inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize`.
 *
 * Static `baseSize` scale (`xs..7xl`, `prose`) and decile scale (`10..90`,
 * `full` → `var(--content-width)` proportions) coexist in the same theme keys.
 *
 * Falls back to bracket arbitrary, css var, `fit|min|max|stretch` keywords,
 * `auto`, fractions, and rem-normalized numerics via preset-mini's handler chain.
 *
 * Pattern lifted from preset-mini's `_rules/size.ts` and adapted for our theme
 * shape.
 */

const sizeMapping = {
  h: 'height',
  w: 'width',
  inline: 'inline-size',
  block: 'block-size',
} as const;

type SizeKey = keyof typeof sizeMapping;

function getPropName(minmax: string | undefined, hw: SizeKey): string {
  return `${minmax || ''}${sizeMapping[hw]}`;
}

function themeKeyFor(minmax: string | undefined, hw: SizeKey): string {
  // "min-w" → "minWidth", "max-block" → "maxBlockSize"
  return getPropName(minmax, hw).replace(/-(\w)/g, (_, c) => c.toUpperCase());
}

function getSizeValue(
  minmax: string | undefined,
  hw: SizeKey,
  theme: Theme,
  prop: string,
): string | undefined {
  const tk = themeKeyFor(minmax, hw) as keyof Theme;
  const v = (theme[tk] as Record<string, string> | undefined)?.[prop];
  if (v != null) return v;
  switch (prop) {
    case 'fit':
    case 'max':
    case 'min':
      return `${prop}-content`;
    case 'stretch':
      return 'stretch';
  }
  return h.bracket.cssvar.global.auto.fraction.rem(prop);
}

export const size: Rule<Theme>[] = [
  // size-* (sets both width and height)
  [
    /^size-(min-|max-)?(.+)$/,
    ([, m, s], { theme }) => ({
      [getPropName(m, 'w')]: getSizeValue(m, 'w', theme, s!),
      [getPropName(m, 'h')]: getSizeValue(m, 'h', theme, s!),
    }),
    { autocomplete: 'size-$width' },
  ],

  // w-*, h-*, min-w-*, max-h-* etc.
  // Hyphen is REQUIRED between w|h and the value. Preset-mini allows
  // compact form (`w1`, `h6` without hyphen); we reject it to avoid
  // collision with the heading utilities (`h1..h6`). Use `w-1`, `h-6`
  // (with hyphen) for numeric sizes instead.
  [
    /^(?:size-)?(min-|max-)?([wh])-(.+)$/,
    ([, m, w, s], { theme }) => ({
      [getPropName(m, w as SizeKey)]: getSizeValue(m, w as SizeKey, theme, s!),
    }),
    {
      autocomplete: [
        '(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight',
        '(max|min)-(w|h)',
        '(max|min)-(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight',
        '(w|h)-full',
        '(w|h)-(10|20|30|40|50|60|70|80|90|full)',
      ],
    },
  ],

  // logical-property counterparts: inline-*, block-*, min-inline-*, max-block-*
  [
    /^(?:size-)?(min-|max-)?(block|inline)-(.+)$/,
    ([, m, w, s], { theme }) => ({
      [getPropName(m, w as SizeKey)]: getSizeValue(m, w as SizeKey, theme, s!),
    }),
    {
      autocomplete: [
        '(block|inline)-$inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize',
        '(max|min)-(block|inline)',
        '(max|min)-(block|inline)-$inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize',
      ],
    },
  ],
];
