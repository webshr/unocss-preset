/**
 * Shorthands — group multiple utilities behind a single class name.
 *
 * `position: ['relative','absolute','fixed','sticky','static']` lets users
 * write `position-relative` (etc.) instead of bare `relative` when they want
 * a more explicit class name. Bare `relative`/`absolute`/`fixed`/`sticky`/
 * `static` still work via preset-mini's static rules.
 */
export const shorthands: Record<string, string | string[]> = {
  position: ['relative', 'absolute', 'fixed', 'sticky', 'static'],
};
