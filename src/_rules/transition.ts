import type { Rule } from '@unocss/core';
import { transitions as miniTransitions } from '@unocss/preset-mini/rules';
import type { Theme } from '../_theme/types';

/**
 * Transition utilities — `transition`, `duration-*`, `delay-*`, `ease-*`,
 * `property-*`. Re-exports preset-mini's full transition rule set.
 *
 * Theme keys consumed: `theme.duration`, `theme.easing`, `theme.transitionProperty`.
 */
export const transition: Rule<Theme>[] = [...miniTransitions] as Rule<Theme>[];
