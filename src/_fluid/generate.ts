import type { FluidScaleConfig, FluidSectionConfig } from './config';

function resolveBaseStep(steps: readonly string[], provided?: string): string {
  if (provided) {
    if (!steps.includes(provided)) {
      throw new Error(
        `fluid: baseStep "${provided}" not found in steps [${steps.join(', ')}]`,
      );
    }
    return provided;
  }
  return steps[Math.floor((steps.length - 1) / 2)];
}

function stepValue(
  scale: Pick<FluidScaleConfig, 'desktop' | 'mobile' | 'steps' | 'baseStep'>,
  step: string,
  which: 'desktop' | 'mobile',
): number {
  const baseStep = resolveBaseStep(scale.steps, scale.baseStep);
  const baseIdx = scale.steps.indexOf(baseStep);
  const stepIdx = scale.steps.indexOf(step);
  if (stepIdx === -1) {
    throw new Error(`fluid: step "${step}" not found in scale steps`);
  }
  const delta = stepIdx - baseIdx;
  const { base, ratio } = scale[which];
  return base * Math.pow(ratio, delta);
}

function round(n: number): number {
  return Number(n.toFixed(10));
}

function fluidClamp(
  mobilePx: number,
  desktopPx: number,
  vpMinPx: number,
  vpMaxPx: number,
): string {
  const slopeVw = (100 * (desktopPx - mobilePx)) / (vpMaxPx - vpMinPx);
  const interceptPx = mobilePx - (slopeVw * vpMinPx) / 100;
  const loPx = Math.min(mobilePx, desktopPx);
  const hiPx = Math.max(mobilePx, desktopPx);
  return `clamp(${round(loPx / 16)}rem, calc(${round(slopeVw)}vw + ${round(interceptPx / 16)}rem), ${round(hiPx / 16)}rem)`;
}

function buildKey(prefix: string | undefined, suffix: string): string {
  return prefix ? `${prefix}-${suffix}` : suffix;
}

export function generateFluidScale(
  config: FluidScaleConfig,
  viewport: { min: number; max: number },
): Record<string, string> {
  const out: Record<string, string> = {};
  const { steps } = config;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const mobileVal = stepValue(config, step, 'mobile');
    const desktopVal = stepValue(config, step, 'desktop');
    out[buildKey(config.cssPrefix, step)] = fluidClamp(
      mobileVal,
      desktopVal,
      viewport.min,
      viewport.max,
    );

    for (let j = 0; j < i; j++) {
      const smaller = steps[j];
      const mobileTo = stepValue(config, smaller, 'mobile');
      const desktopTo = stepValue(config, step, 'desktop');
      const key = buildKey(config.cssPrefix, `${step}-to-${smaller}`);
      out[key] = fluidClamp(mobileTo, desktopTo, viewport.min, viewport.max);
    }
  }

  return out;
}

export function generateSectionSpace(
  section: FluidSectionConfig,
  space: FluidScaleConfig,
  viewport: { min: number; max: number },
): Record<string, string> {
  const derived: FluidScaleConfig = {
    desktop: {
      base: space.desktop.base * section.desktopMultiplier,
      ratio: space.desktop.ratio,
    },
    mobile: {
      base: space.mobile.base * section.mobileMultiplier,
      ratio: space.mobile.ratio,
    },
    steps: section.steps ?? space.steps,
    baseStep: section.baseStep ?? space.baseStep,
    cssPrefix: section.cssPrefix,
  };
  return generateFluidScale(derived, viewport);
}
