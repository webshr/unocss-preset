import type { Theme } from './types';
import { fluidConfig } from '../_fluid';

const textSteps = [
  'xs',
  'sm', 'sm-to-xs',
  'md', 'md-to-sm', 'md-to-xs',
  'lg', 'lg-to-md', 'lg-to-sm', 'lg-to-xs',
  'xl', 'xl-to-lg', 'xl-to-md', 'xl-to-sm', 'xl-to-xs',
  '2xl', '2xl-to-xl', '2xl-to-lg', '2xl-to-md', '2xl-to-sm', '2xl-to-xs',
] as const;

function buildFontSize(): Theme['fontSize'] {
  const out: Record<string, [string, string]> = {};
  for (const step of textSteps) {
    const base = step.split('-to-')[0] as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    out[step] = [`var(--text-${step})`, `var(--text-${base}--line-height)`];
  }
  return out as unknown as Theme['fontSize'];
}

export const fontFamily = {
  // typology primitives
  sans: 'var(--font-sans)',
  serif: 'var(--font-serif)',
  mono: 'var(--font-mono)',
  // semantic roles (consumer-overridable, default to --font-sans)
  text: 'var(--text-font-family)',
  heading: 'var(--heading-font-family)',
} satisfies Theme['fontFamily'];

export const fontSize = buildFontSize();

export const lineHeight = {
  xs: 'var(--text-xs--line-height)',
  sm: 'var(--text-sm--line-height)',
  md: 'var(--text-md--line-height)',
  lg: 'var(--text-lg--line-height)',
  xl: 'var(--text-xl--line-height)',
  '2xl': 'var(--text-2xl--line-height)',
  text: 'var(--text-line-height)',
  heading: 'var(--heading-line-height)',
} satisfies Theme['lineHeight'];

export const letterSpacing = {
  heading: 'var(--heading-letter-spacing)',
} satisfies Theme['letterSpacing'];

export const fontWeight = {
  heading: 'var(--heading-font-weight)',
} satisfies Theme['fontWeight'];

export { fluidConfig, textSteps };
