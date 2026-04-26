import type { Rule } from '@unocss/core';
import { zIndexes as miniZIndexes } from '@unocss/preset-mini/rules';
import type { Theme } from '../_theme/types';

/**
 * Layer / stacking utilities — `z-*`, `pos-z-*`. Re-exports preset-mini's
 * z-index rules. Theme key consumed: `theme.zIndex`.
 */
export const layer: Rule<Theme>[] = [...miniZIndexes] as Rule<Theme>[];
