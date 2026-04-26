import type { Preflight } from '@unocss/core';
import { entriesToCss, toArray } from '@unocss/core';
import type { Theme } from './_theme/types';

/**
 * Preflights
 *
 *   1. `:root { ... }` CSS-variable block (always-on token layer).
 *   2. `color-scheme: light/dark` declarations so `light-dark()` is theme-aware.
 *   3. Always-on layout-mode classes (currently `body.boxed`) that
 *      need to work without requiring the opt-in reset.css import.
 *
 * Element-level defaults (section auto-layout, div auto-gap, link
 * reset, etc.) live in the separate opt-in `reset.css`, following
 * UnoCSS convention of keeping element resets out of preflights
 * (https://unocss.dev/guide/style-reset).
 */
export interface PreflightOptions {
  /**
   * Emit the `:root` token block, color-scheme declarations, and layout-mode
   * classes. Disable to bring your own. Default: `true`.
   *
   * Note: many utilities reference tokens emitted here (e.g. `--space-*`,
   * `--text-*`, `--color-*`). Disabling preflight requires the consumer to
   * provide equivalent vars in their own CSS or layouts will break.
   */
  preflight?: boolean;
}

/**
 * Always-on class-scoped layout modes emitted directly into the
 * preflights layer (no import required). These are JS-driven or
 * site-config classes that need to be available whenever the preset
 * is active.
 */
const layoutModes = `\
body.boxed{margin:0 auto;min-height:100vh;}
`;

const colorSchemeDecl = `:root{color-scheme:light;}
html[data-theme='dark']{color-scheme:dark;}
`;

export function preflights(options: PreflightOptions = {}): Preflight<Theme>[] | undefined {
  const preflight = options.preflight ?? true;
  if (!preflight) return undefined;

  return [
    {
      layer: 'preflights',
      getCSS({ theme }) {
        if (!theme.preflightBase) return;

        const entries = Object.entries(theme.preflightBase);
        if (entries.length === 0) return;

        const css = entriesToCss(entries);
        const roots = toArray(theme.preflightRoot ?? [':root']);

        return (
          colorSchemeDecl +
          roots.map((root) => `${root}{${css}}`).join('') +
          '\n' +
          layoutModes
        );
      },
    },
  ];
}
