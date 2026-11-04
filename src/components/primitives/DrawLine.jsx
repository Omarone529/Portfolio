import { motion } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

/** Riga sottile che si disegna da sinistra quando entra in vista. Di default sta sul bordo inferiore. */
export function DrawLine({ className = '', delay = 0 }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`draw-line ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={IN_VIEW}
      transition={{ duration: DURATION.line, ease: EASE, delay }}
    />
  )
}
