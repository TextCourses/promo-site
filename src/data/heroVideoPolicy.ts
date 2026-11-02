// Safe packaged fallback. generation_v4 replaces this protected file from GenerationSpecV1.
export const HERO_VIDEO_POLICY = {"fulfillment":"slot-only","mobile":"poster-only","mode":"forbid","reason_codes":["packaged-video-disabled"],"source":"fallback","version":1} as const

export const heroVideoPolicy = HERO_VIDEO_POLICY
export type HeroVideoPolicy = typeof HERO_VIDEO_POLICY
