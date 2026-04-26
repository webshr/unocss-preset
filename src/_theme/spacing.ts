import type { Theme } from './types';

const spaceSteps = [
  '2xs',
  'xs',
  'sm', 'sm-to-xs',
  'md', 'md-to-sm', 'md-to-xs',
  'lg', 'lg-to-md', 'lg-to-sm', 'lg-to-xs',
  'xl', 'xl-to-lg', 'xl-to-md', 'xl-to-sm', 'xl-to-xs',
  '2xl', '2xl-to-xl', '2xl-to-lg', '2xl-to-md', '2xl-to-sm', '2xl-to-xs',
  '3xl',
] as const;

function buildSpacing(): Theme['spacing'] {
  const out: Record<string, string> = {};
  for (const step of spaceSteps) {
    out[step] = `var(--space-${step})`;
  }
  return out as Theme['spacing'];
}

export const spacing = buildSpacing();

const sectionSteps = [
  '2xs',
  'xs',
  'sm', 'sm-to-xs',
  'md', 'md-to-sm', 'md-to-xs',
  'lg', 'lg-to-md', 'lg-to-sm', 'lg-to-xs',
  'xl', 'xl-to-lg', 'xl-to-md', 'xl-to-sm', 'xl-to-xs',
  '2xl', '2xl-to-xl', '2xl-to-lg', '2xl-to-md', '2xl-to-sm', '2xl-to-xs',
  '3xl',
] as const;

function buildSectionSpace(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const step of sectionSteps) {
    out[step] = `var(--section-space-${step})`;
  }
  return out;
}

export const sectionSpace = buildSectionSpace() satisfies Theme['sectionSpace'];

export { spaceSteps, sectionSteps };
