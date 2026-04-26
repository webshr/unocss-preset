import type { Variant } from '@unocss/core';
import {
  variantColorsMediaOrClass,
  variantNegative,
} from '@unocss/preset-mini/variants';
import type { Theme } from '../_theme/types';

/**
 * Variants.
 *
 * `variantNegative` (from preset-mini) enables the `-` prefix on any
 * utility that produces a size value: `-mt-md`, `-ml-lg`, etc. auto-negate
 * their theme value. Ignored for `opacity/color/flex/backdrop-filter/filter/
 * transform` properties.
 *
 * `variantColorsMediaOrClass` (from preset-mini) enables `dark:` and
 * `light:` prefixes. Wired to the preset's theme convention:
 *
 *   html[data-theme='dark']  — triggers `dark:` variant
 *   html[data-theme='light'] — triggers `light:` variant
 *
 * Matches the selector already used by the preset's color-scheme preflight
 * block (`html[data-theme='dark'] { color-scheme: dark }`). Consumers who
 * want a different selector (e.g. `.dark` body class, or media-query-only
 * via `prefers-color-scheme`) can redefine variants in their uno.config.ts.
 *
 * Usage:
 *   <div class="bg-white dark:bg-black">       <!-- flips with theme -->
 *   <div class="bg-canvas">                    <!-- flips via light-dark() -->
 *   <p class="text-base-900 dark:text-neutral-50">
 */
export function variants(): Variant<Theme>[] {
  return [
    variantNegative as Variant<Theme>,
    ...(variantColorsMediaOrClass({
      dark: {
        dark: "html[data-theme='dark']",
        light: "html[data-theme='light']",
      },
    }) as Variant<Theme>[]),
  ];
}
