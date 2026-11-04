import { motion } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

/** Blocco che sale e compare quando entra in vista. */
export function FadeUp({ as = 'div', className, delay = 0, children }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: DURATION.text, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}
