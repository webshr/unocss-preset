import type { Rule } from '@unocss/core';
import type { Theme } from '../_theme/types';
import { colorMixResolver } from '../_utils/color-mix';

/**
 * Color utilities.
 *
 * Resolves against `theme.colors` (9 families × 11 numeric steps + `faint`,
 * `soft`, `muted` alpha variants + `DEFAULT` + `white`, `black`, `transparent`,
 * `inherit`, `currentColor`).
 *
 * Uses `colorMixResolver` (a wrapper around preset-mini's `colorResolver`) so
 * opacity modifiers work against CSS-variable-backed theme colors via
 * `color-mix(in oklch, var(--color-*) N%, transparent)`, while literal color
 * inputs (hex, rgb, named) keep preset-mini's standard opacity machinery.
 *
 * Note: `text-*` is handled in typography.ts (dual-namespace with font-size).
 * The `c-*` / `color-*` alias here is pure color (no font-size collision).
 *
 * Note: `ring-{color}` here writes `--un-ring-color` because preset-mini's
 * `rings` ruleset (re-exported from border.ts) reads that var when composing
 * the ring `box-shadow`. Our rule replaces preset-mini's own `ring-{color}`
 * (filtered out in border.ts) so opacity modifiers like `ring-primary-500/50`
 * resolve via `color-mix` instead of preset-mini's rgb path.
 */
export const color: Rule<Theme>[] = [
  // Background
  [/^bg-(.+)$/, colorMixResolver('background-color', 'bg', 'backgroundColor'), {
    autocomplete: 'bg-$colors',
  }],

  // Color alias (pure color, no font-size collision with `text-*`)
  [/^(?:color|c)-(.+)$/, colorMixResolver('color', 'text', 'textColor'), {
    autocomplete: '(color|c)-$colors',
  }],

  // Outline color (border.ts ships preset-mini's outline width/style rules;
  // this one wraps the color in color-mix for opacity-modifier support).
  [/^outline-(.+)$/, colorMixResolver('outline-color', 'outline-color', 'borderColor'), {
    autocomplete: 'outline-$colors',
  }],

  // Ring color — sets the var that preset-mini's `rings` composition reads.
  [/^ring-(.+)$/, colorMixResolver('--un-ring-color', 'ring', 'borderColor'), {
    autocomplete: 'ring-$colors',
  }],

  // SVG fill
  [/^fill-(.+)$/, colorMixResolver('fill', 'fill', 'backgroundColor'), {
    autocomplete: 'fill-$colors',
  }],

  // SVG stroke
  [/^stroke-(.+)$/, colorMixResolver('stroke', 'stroke', 'borderColor'), {
    autocomplete: 'stroke-$colors',
  }],

  // Caret color
  [/^caret-(.+)$/, colorMixResolver('caret-color', 'caret', 'borderColor'), {
    autocomplete: 'caret-$colors',
  }],

  // Accent color (form controls)
  [/^accent-(.+)$/, colorMixResolver('accent-color', 'accent', 'borderColor'), {
    autocomplete: 'accent-$colors',
  }],
];
