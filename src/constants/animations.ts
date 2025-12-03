// Animation constants for React components

export const ANIMATION_DURATIONS = {
  FAST: 200,
  BASE: 270,
  NORMAL: 300,
  REVEAL: 600,
  SLOW: 1220,
  PULSE: 1600,
  FLOAT: 6000,
  SLIDE: 30000,
  SPIN: 3000,
  THEME_TOGGLE: 320,
} as const;

export const ANIMATION_DELAYS = {
  INITIAL: 0,
  STAGGER_STEP: 40,
} as const;

export const ANIMATION_DISTANCES = {
  REVEAL: 16,
  MENU: -8,
  FLOAT: -8,
  HOVER: -2,
} as const;

/**
 * Calculates staggered animation delay for a given index
 * @param index - The index of the item (0-based)
 * @param step - The delay step in milliseconds (default: ANIMATION_DELAYS.STAGGER_STEP)
 * @param initial - The initial delay in milliseconds (default: ANIMATION_DELAYS.INITIAL)
 * @returns The delay value as a string with "ms" unit
 */
export function getStaggeredDelay(
  index: number,
  step: number = ANIMATION_DELAYS.STAGGER_STEP,
  initial: number = ANIMATION_DELAYS.INITIAL
): string {
  return `${initial + index * step}ms`;
}

