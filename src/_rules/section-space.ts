import type { Rule } from '@unocss/core';
import type { Theme } from '../_theme/types';

/**
 * Section-space utilities — vertical rhythm between page sections.
 *
 * Resolves against `theme.sectionSpace` (fluid 2xs..3xl scale + all `x-to-y`
 * pairs, derived from `theme.spacing` via desktop ×3 / mobile ×2 multipliers).
 *
 * Naming convention: `py-section-{step}` for vertical padding (the canonical
 * form), with `pt-section-{step}` and `pb-section-{step}` for asymmetric
 * cases. Margin counterparts (`my-`, `mt-`, `mb-`) follow the same pattern.
 *
 * Horizontal (`px-`, `mx-`) is intentionally omitted — section-space is a
 * vertical-rhythm token, not a generic spacing token. For horizontal page
 * gutters, use the regular spacing scale (`px-md`, `px-xl`) or layout
 * primitives in your consumer project.
 *
 * Underlying tokens remain available for direct CSS use:
 * `padding-block: var(--section-space-md);`
 */

function resolveSection(step: string, theme: Theme): string | undefined {
  return (theme.sectionSpace as Record<string, string> | undefined)?.[step];
}

export const sectionSpace: Rule<Theme>[] = [
  // padding (all four sides) — full-bleed section padding
  [
    /^p-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { padding: v };
    },
    { autocomplete: 'p-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],

  // padding-block (top + bottom) — canonical "vertical section spacing"
  [
    /^py-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { 'padding-top': v, 'padding-bottom': v };
    },
    { autocomplete: 'py-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],

  // asymmetric padding
  [
    /^pt-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { 'padding-top': v };
    },
    { autocomplete: 'pt-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],
  [
    /^pb-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { 'padding-bottom': v };
    },
    { autocomplete: 'pb-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],

  // margin counterparts
  [
    /^my-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { 'margin-top': v, 'margin-bottom': v };
    },
    { autocomplete: 'my-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],
  [
    /^mt-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { 'margin-top': v };
    },
    { autocomplete: 'mt-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],
  [
    /^mb-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { 'margin-bottom': v };
    },
    { autocomplete: 'mb-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],

  // gap counterpart (for stacked sections inside a flex/grid container)
  [
    /^gap-section-(.+)$/,
    ([, step], { theme }) => {
      const v = resolveSection(step!, theme);
      if (v != null) return { gap: v };
    },
    { autocomplete: 'gap-section-(2xs|xs|sm|md|lg|xl|2xl|3xl)' },
  ],
];
