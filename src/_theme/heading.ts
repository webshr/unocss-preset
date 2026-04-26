import type { Theme } from './types';

const headingSteps = [
  'h6',
  'h5', 'h5-to-h6',
  'h4', 'h4-to-h5', 'h4-to-h6',
  'h3', 'h3-to-h4', 'h3-to-h5', 'h3-to-h6',
  'h2', 'h2-to-h3', 'h2-to-h4', 'h2-to-h5', 'h2-to-h6',
  'h1', 'h1-to-h2', 'h1-to-h3', 'h1-to-h4', 'h1-to-h5', 'h1-to-h6',
] as const;

function buildHeading(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const step of headingSteps) {
    out[step] = `var(--${step})`;
  }
  return out;
}

export const heading = buildHeading() satisfies Theme['heading'];

export { headingSteps };
