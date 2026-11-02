import type { HTMLMotionProps } from 'motion/react'
import { motion } from 'motion/react'

import { useMotionPolicy } from './MotionPolicyProvider'
import { motionTiming } from './profile'

export function Pressable({ children, type = 'button', ...props }: HTMLMotionProps<'button'>): JSX.Element {
  const policy = useMotionPolicy()
  const timing = motionTiming(policy.profile, policy.mobileDowngraded)
  const spatialFeedback = policy.staticMotion ? undefined : { scale: timing.pressScale }
  const hoverFeedback =
    policy.staticMotion || !policy.finePointer ? undefined : { scale: Math.max(timing.pressScale, 0.99) }

  return (
    <motion.button
      {...props}
      type={type}
      whileTap={spatialFeedback}
      whileHover={hoverFeedback}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  )
}

export default Pressable
