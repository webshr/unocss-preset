import { definePreset } from '@unocss/core';
import type { Theme } from './_theme/types';
import { theme } from './_theme';
import { preflights, type PreflightOptions } from './preflights';
import { rules } from './rules';
import { shorthands } from './shorthands';
import { variants } from './variants';

export interface PresetOptions extends PreflightOptions {}

export const presetWebshore = definePreset<PresetOptions, Theme>((options = {}) => ({
  name: '@webshore/unocss-preset',
  theme,
  rules,
  shorthands,
  variants: variants(),
  preflights: preflights(options),
}));

export default presetWebshore;
export type { Theme, PreflightOptions };
