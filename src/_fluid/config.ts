export interface FluidScaleParams {
  base: number;
  ratio: number;
}

export interface FluidScaleConfig {
  desktop: FluidScaleParams;
  mobile: FluidScaleParams;
  steps: readonly string[];
  baseStep?: string;
  cssPrefix?: string;
}

export interface FluidSectionConfig {
  desktopMultiplier: number;
  mobileMultiplier: number;
  steps?: readonly string[];
  baseStep?: string;
  cssPrefix?: string;
}

export interface FluidConfig {
  viewport: { min: number; max: number };
  text: FluidScaleConfig;
  heading: FluidScaleConfig;
  space: FluidScaleConfig;
  sectionSpace: FluidSectionConfig;
}

export const fluidConfig: FluidConfig = {
  viewport: { min: 360, max: 1440 },

  text: {
    desktop: { base: 17, ratio: 1.25 },
    mobile: { base: 17, ratio: 1.2 },
    steps: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    baseStep: 'md',
    cssPrefix: 'text',
  },

  heading: {
    desktop: { base: 24, ratio: 1.25 },
    mobile: { base: 20, ratio: 1.2 },
    steps: ['h6', 'h5', 'h4', 'h3', 'h2', 'h1'],
    baseStep: 'h4',
    cssPrefix: '',
  },

  space: {
    desktop: { base: 30, ratio: 1.5 },
    mobile: { base: 24, ratio: 1.333 },
    steps: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    baseStep: 'md',
    cssPrefix: 'space',
  },

  sectionSpace: {
    desktopMultiplier: 3,
    mobileMultiplier: 2,
    cssPrefix: 'section-space',
  },
};
