'use client'

import { m } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

const lineVariants = {
  hide: { y: '110%' },
  show: (delay) => ({ y: '0%', transition: { duration: DURATION.text, ease: EASE, delay } }),
}

/**
 * Righe di testo che salgono da una maschera, una dopo l'altra, quando entrano
 * in vista. Per ciò che si vede al caricamento c'è IntroLines, solo CSS.
 * Gli altri attributi (es. aria-hidden) passano all'elemento.
 */
export function MaskLines({ lines, as = 'div', className = '', delay = 0, stagger = 0.08, ...rest }) {
  const Tag = m[as]
  return (
    <Tag className={className} initial="hide" whileInView="show" viewport={IN_VIEW} {...rest}>
      {lines.map((line, i) => (
        <span className="mask" key={i}>
          <m.span className="mask__in" variants={lineVariants} custom={delay + i * stagger}>
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}
