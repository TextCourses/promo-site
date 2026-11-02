import { createContext, useContext, type ReactNode } from 'react'
import type { HTMLMotionProps, Variants } from 'motion/react'
import { motion } from 'motion/react'

import { useMotionPolicy } from './MotionPolicyProvider'
import { motionTiming } from './profile'

interface StaggerRuntime {
  enabled: boolean
  limit: number
  y: number
  duration: number
}

const StaggerContext = createContext<StaggerRuntime>({
  enabled: false,
  limit: 0,
  y: 0,
  duration: 0,
})

export interface StaggerProps extends HTMLMotionProps<'div'> {
  trigger?: 'load' | 'scroll'
}

export function Stagger({ children, trigger = 'scroll', ...props }: StaggerProps): JSX.Element {
  const policy = useMotionPolicy()
  const timing = motionTiming(policy.profile, policy.mobileDowngraded)
  const enabled =
    !policy.staticMotion &&
    policy.intensity >= 4 &&
    timing.staggerLimit > 0 &&
    (trigger === 'load' || policy.scrollMotion)
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: timing.stagger,
        delayChildren: 0,
      },
    },
  }
  const activation = !enabled
    ? { animate: 'visible' as const }
    : trigger === 'load'
      ? { animate: 'visible' as const }
      : {
          whileInView: 'visible' as const,
          viewport: { once: true, amount: 0.18 },
        }

  return (
    <StaggerContext.Provider
      value={{
        enabled,
        limit: timing.staggerLimit,
        y: Math.min(24, timing.y),
        duration: timing.duration,
      }}
    >
      <motion.div
        {...props}
        initial={enabled ? 'hidden' : false}
        variants={variants}
        {...activation}
      >
        {children}
      </motion.div>
    </StaggerContext.Provider>
  )
}

export interface StaggerItemProps extends HTMLMotionProps<'div'> {
  index: number
  children?: ReactNode
}

export function StaggerItem({ index, children, ...props }: StaggerItemProps): JSX.Element {
  const runtime = useContext(StaggerContext)
  const enabled = runtime.enabled && index >= 0 && index < runtime.limit
  const variants: Variants = {
    hidden: enabled ? { opacity: 0, y: runtime.y } : { opacity: 1, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: enabled ? runtime.duration : 0, ease: [0.22, 1, 0.36, 1] },
    },
  }
  return (
    <motion.div {...props} variants={variants}>
      {children}
    </motion.div>
  )
}

export default Stagger
