'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'

/**
 * Paragrafo le cui parole si accendono una alla volta con lo scroll. L'ultima
 * parola è accesa quando la fine del paragrafo arriva a metà schermo, un punto
 * che ogni testo della pagina raggiunge: così l'animazione si completa sempre.
 */
export function ScrollWords({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length}>
          {word}
        </Word>
      ))}
    </p>
  )
}

// 0.42 è la soglia minima perché anche la parola ancora spenta resti leggibile (contrasto 3:1 per testi grandi)
const UNLIT_OPACITY = 0.42

function Word({ children, progress, from, to }) {
  const opacity = useTransform(progress, [from, to], [UNLIT_OPACITY, 1])
  return (
    <span>
      <m.span style={{ opacity }}>{children}</m.span>{' '}
    </span>
  )
}
