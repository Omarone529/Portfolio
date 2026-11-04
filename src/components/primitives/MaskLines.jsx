import { motion } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

const lineVariants = {
  hide: { y: '110%' },
  show: (delay) => ({ y: '0%', transition: { duration: DURATION.text, ease: EASE, delay } }),
}

/**
 * Righe di testo che salgono da una maschera, una dopo l'altra.
 * Senza `play` partono quando entrano in vista; con `play` partono quando diventa true.
 */
export function MaskLines({ lines, as = 'div', className = '', delay = 0, stagger = 0.08, play }) {
  const Tag = motion[as]
  const trigger = play === undefined ? { whileInView: 'show', viewport: IN_VIEW } : { animate: play ? 'show' : 'hide' }
  return (
    <Tag className={className} initial="hide" {...trigger}>
      {lines.map((line, i) => (
        <span className="mask" key={i}>
          <motion.span className="mask__in" variants={lineVariants} custom={delay + i * stagger}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
