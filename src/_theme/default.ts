import type { Theme } from './types';
import { colors } from './colors';
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './fonts';
import { heading } from './heading';
import { spacing, sectionSpace } from './spacing';
import {
  width, height, maxWidth, maxHeight,
  inlineSize, blockSize, maxInlineSize, maxBlockSize,
  containers,
} from './size';
import {
  breakpoints, verticalBreakpoints,
  lineWidth, borderRadius, boxShadow,
  duration, easing, transitionProperty,
  ringWidth, zIndex, media,
  gridTemplateColumns,
} from './misc';
import { preflightBase, preflightRoot } from './preflight';

export const theme = {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  heading,
  spacing,
  sectionSpace,
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth: maxWidth,
  minHeight: maxHeight,
  inlineSize,
  blockSize,
  maxInlineSize,
  maxBlockSize,
  minInlineSize: maxInlineSize,
  minBlockSize: maxBlockSize,
  containers,
  breakpoints,
  verticalBreakpoints,
  lineWidth,
  borderRadius,
  boxShadow,
  duration,
  easing,
  transitionProperty,
  ringWidth,
  zIndex,
  media,
  gridTemplateColumns,
  preflightBase,
  preflightRoot,
} satisfies Theme;
