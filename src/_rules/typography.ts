import type { Rule } from '@unocss/core';
import { toArray } from '@unocss/core';
import {
  globalKeywords,
  h,
  isCSSMathFn,
  splitShorthand,
} from '@unocss/preset-mini/utils';
import type { Theme } from '../_theme/types';
import { colorMixResolver } from '../_utils/color-mix';

/**
 * Typography utilities.
 *
 * `text-*` is dual-purpose: it resolves to `font-size` (+ paired line-height)
 * when the value matches a `theme.fontSize` key, otherwise falls through to
 * color. This mirrors preset-mini's handling so behavior is consistent across
 * the UnoCSS ecosystem.
 *
 * `font-*` resolves font-family from `theme.fontFamily` (typology keys
 * `sans|serif|mono` and role keys `text|heading`), with fallback to bracket
 * literals (`font-['Inter']`) and CSS variables (`font-$my-var`). Tailwind 4's
 * `font-(family-name:--my-var)` syntax is equivalent to `font-$my-var` here.
 *
 * `font-{weight}` resolves font-weight from `theme.fontWeight`; numeric values
 * (`font-100..900`) and keywords (`font-bold`, `font-light`) are supported.
 */

// --- text-* font-size (with paired line-height from theme.fontSize tuples) ---

function handleText([, raw = '']: RegExpMatchArray, { theme }: { theme: Theme }) {
  const split = splitShorthand(raw, 'length');
  if (!split) return;
  const [size, leading] = split;
  const sizePairs = toArray(theme.fontSize?.[size]);
  const lineHeight = leading
    ? (theme.lineHeight as Record<string, string> | undefined)?.[leading] ?? h.bracket.cssvar.rem(leading)
    : undefined;
  if (sizePairs?.[0]) {
    const [fontSize, height] = sizePairs as [string, string | undefined];
    return {
      'font-size': fontSize,
      'line-height': lineHeight ?? height ?? '1',
    };
  }
}

function handleTextColorOrSize(match: RegExpMatchArray, ctx: { theme: Theme; generator: any }) {
  if (isCSSMathFn(h.bracket(match[1]!))) {
    return { 'font-size': h.bracket.cssvar.rem(match[1]!) };
  }
  return colorMixResolver('color', 'text', 'textColor')(match, ctx as any);
}

// --- font-weight keyword map ---

const fontWeightKeywords: Record<string, string> = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

export const typography: Rule<Theme>[] = [
  // text-{size}  →  font-size + paired line-height from fontSize tuples
  [/^text-(.+)$/, handleText, { autocomplete: 'text-$fontSize' }],

  // text-{color} | text-[arbitrary]  →  color (fallback after font-size misses)
  [/^text-(.+)$/, handleTextColorOrSize, { autocomplete: 'text-$colors' }],

  // text-{global-keyword}  →  color: inherit|initial|...
  [
    /^text-(.+)$/,
    ([, v]) => (globalKeywords.includes(v!) ? { color: v } : undefined),
    { autocomplete: `text-(${globalKeywords.join('|')})` },
  ],

  // font-family (typology + role + arbitrary + cssvar)
  [
    /^font-(.+)$/,
    ([, d], { theme }) => {
      const family = (theme.fontFamily as Record<string, string> | undefined)?.[d!];
      if (family) return { 'font-family': family };
      const weight = fontWeightKeywords[d!] ?? (theme.fontWeight as Record<string, string> | undefined)?.[d!];
      if (weight) return { 'font-weight': weight };
      // arbitrary: font-['Inter','sans-serif']  or  font-$my-var
      const value = h.bracket.cssvar(d!);
      if (value) return { 'font-family': value };
    },
    { autocomplete: 'font-(sans|serif|mono|text|heading|thin|light|normal|medium|semibold|bold|black)' },
  ],

  // font-{numeric-weight}  e.g. font-500, font-700
  [
    /^font-(\d+)$/,
    ([, w]) => ({ 'font-weight': w }),
    { autocomplete: 'font-(100|200|300|400|500|600|700|800|900)' },
  ],

  // leading-{line-height}
  [
    /^(?:leading|lh|line-height)-(.+)$/,
    ([, d], { theme }) => {
      const value =
        (theme.lineHeight as Record<string, string> | undefined)?.[d!] ??
        h.bracket.cssvar.global.number.rem(d!);
      if (value != null) return { 'line-height': value };
    },
    { autocomplete: '(leading|lh|line-height)-$lineHeight' },
  ],

  // tracking-{letter-spacing}
  [
    /^(?:tracking|letter-spacing)-(.+)$/,
    ([, d], { theme }) => {
      const value =
        (theme.letterSpacing as Record<string, string> | undefined)?.[d!] ??
        h.bracket.cssvar.global.rem(d!);
      if (value != null) return { 'letter-spacing': value };
    },
    { autocomplete: '(tracking|letter-spacing)-$letterSpacing' },
  ],
];
