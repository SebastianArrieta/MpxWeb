import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
} & Omit<HTMLMotionProps<'div'>, 'children' | 'initial' | 'whileInView' | 'viewport' | 'transition'>

/** Entra con fundido y desplazamiento la primera vez que aparece en pantalla. */
export default function Reveal({ children, delay = 0, y = 22, className, ...rest }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
