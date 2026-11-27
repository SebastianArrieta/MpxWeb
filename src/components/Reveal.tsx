import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
} & Omit<HTMLMotionProps<'div'>, 'children' | 'initial' | 'whileInView' | 'viewport' | 'transition'>

/** Entra con fundido y desplazamiento corto la primera vez que aparece en pantalla. */
export default function Reveal({ children, delay = 0, y = 16, className, ...rest }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
