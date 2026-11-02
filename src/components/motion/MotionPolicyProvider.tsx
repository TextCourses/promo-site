import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useReducedMotion } from 'motion/react'

import { MOTION_POLICY } from '../../data/motionPolicy'

export type MotionProfile = typeof MOTION_POLICY.profile

export interface MotionRuntimePolicy {
  profile: MotionProfile
  intensity: number
  signaturePattern: typeof MOTION_POLICY.signature_pattern
  captureMode: boolean
  reducedMotion: boolean
  mobile: boolean
  mobileDowngraded: boolean
  staticMotion: boolean
  scrollMotion: boolean
  finePointer: boolean
}

const MotionPolicyContext = createContext<MotionRuntimePolicy | null>(null)

function captureModeEnabled(): boolean {
  if (typeof globalThis === 'undefined') return false
  const scope = globalThis as typeof globalThis & {
    __SURGAY_CAPTURE_MODE__?: boolean
    __SG_CAPTURE_MODE__?: boolean
  }
  return scope.__SURGAY_CAPTURE_MODE__ === true || scope.__SG_CAPTURE_MODE__ === true
}

function useMediaQuery(query: string): boolean {
  const read = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(read)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

export function MotionPolicyProvider({ children }: { children: ReactNode }): JSX.Element {
  const systemReducedMotion = useReducedMotion() === true
  const mobile = useMediaQuery('(max-width: 767px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const captureMode = captureModeEnabled()
  const reducedMotion = captureMode || systemReducedMotion
  const staticMotion =
    captureMode ||
    systemReducedMotion ||
    MOTION_POLICY.profile === 'none' ||
    (mobile && MOTION_POLICY.mobile === 'static')
  const scrollMotion =
    !staticMotion &&
    MOTION_POLICY.intensity >= 4 &&
    !MOTION_POLICY.reason_codes.includes('skill-scroll-motion-forbidden')
  const value = useMemo<MotionRuntimePolicy>(
    () => ({
      profile: MOTION_POLICY.profile,
      intensity: MOTION_POLICY.intensity,
      signaturePattern: MOTION_POLICY.signature_pattern,
      captureMode,
      reducedMotion,
      mobile,
      mobileDowngraded: mobile && MOTION_POLICY.mobile === 'downgrade',
      staticMotion,
      scrollMotion,
      finePointer,
    }),
    [captureMode, reducedMotion, mobile, staticMotion, scrollMotion, finePointer],
  )

  return <MotionPolicyContext.Provider value={value}>{children}</MotionPolicyContext.Provider>
}

export function useMotionPolicy(): MotionRuntimePolicy {
  const value = useContext(MotionPolicyContext)
  if (!value) {
    throw new Error('Motion primitives require MotionPolicyProvider')
  }
  return value
}

export default MotionPolicyProvider
