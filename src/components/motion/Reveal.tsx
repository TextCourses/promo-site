import type { HTMLMotionProps, Variants } from 'motion/react'
import { motion } from 'motion/react'

import { useMotionPolicy } from './MotionPolicyProvider'
import { motionTiming } from './profile'

export interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
}

export function Reveal({ children, delay = 0, ...props }: RevealProps): JSX.Element {
  const policy = useMotionPolicy()
  const timing = motionTiming(policy.profile, policy.mobileDowngraded)
  const boundedDelay = Math.max(0, Math.min(delay, 0.4))
  const variants: Variants = {
    hidden: { opacity: 0, y: Math.min(24, timing.y) },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: timing.duration,
        delay: boundedDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      {...props}
      initial={policy.scrollMotion ? 'hidden' : false}
      animate={policy.scrollMotion ? undefined : 'visible'}
      whileInView={policy.scrollMotion ? 'visible' : undefined}
      viewport={policy.scrollMotion ? { once: true, amount: 0.18 } : undefined}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
