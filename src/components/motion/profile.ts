import type { MotionProfile } from './MotionPolicyProvider'

export interface MotionTiming {
  duration: number
  y: number
  stagger: number
  staggerLimit: number
  pressScale: number
}

const PROFILE_TIMINGS: Record<MotionProfile, MotionTiming> = {
  none: { duration: 0, y: 0, stagger: 0, staggerLimit: 0, pressScale: 1 },
  'calm-editorial': {
    duration: 0.52,
    y: 12,
    stagger: 0.06,
    staggerLimit: 3,
    pressScale: 0.99,
  },
  'warm-premium': {
    duration: 0.58,
    y: 14,
    stagger: 0.07,
    staggerLimit: 4,
    pressScale: 0.985,
  },
  'tech-precise': {
    duration: 0.38,
    y: 10,
    stagger: 0.04,
    staggerLimit: 4,
    pressScale: 0.985,
  },
  'luxury-slow': {
    duration: 0.7,
    y: 16,
    stagger: 0.08,
    staggerLimit: 2,
    pressScale: 0.99,
  },
  playful: {
    duration: 0.42,
    y: 16,
    stagger: 0.05,
    staggerLimit: 6,
    pressScale: 0.97,
  },
}

export function motionTiming(profile: MotionProfile, downgraded: boolean): MotionTiming {
  const timing = PROFILE_TIMINGS[profile]
  if (!downgraded) return timing
  return {
    ...timing,
    duration: Math.min(timing.duration, 0.4),
    y: Math.min(timing.y, 8),
    stagger: Math.min(timing.stagger, 0.04),
    staggerLimit: Math.min(timing.staggerLimit, 3),
    pressScale: Math.max(timing.pressScale, 0.99),
  }
}
