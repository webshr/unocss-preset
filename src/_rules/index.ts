import type { Rule } from '@unocss/core';
import type { Theme } from '../_theme/types';
import { border } from './border';
import { color } from './color';
import { grid } from './grid';
import { heading } from './heading';
import { layer } from './layer';
import { layout } from './layout';
import { radius } from './radius';
import { sectionSpace } from './section-space';
import { shadow } from './shadow';
import { size } from './size';
import { spacing } from './spacing';
import { transition } from './transition';
import { typography } from './typography';

export const rules: Rule<Theme>[] = [
  // section-space rules before spacing — `py-section-md` must match before
  // generic `py-(.+)` consumes it.
  ...sectionSpace,
  // typography before color so `text-md` matches font-size before color fallback
  ...typography,
  ...heading,
  ...color,
  ...spacing,
  ...size,
  ...border,
  ...radius,
  ...shadow,
  ...transition,
  ...layer,
  ...layout,
  ...grid,
];
