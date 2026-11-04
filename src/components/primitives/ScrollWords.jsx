'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/** Paragrafo le cui parole si accendono una alla volta con lo scroll; le ultime `mutedTail` restano tenui. */
export function ScrollWords({ text, mutedTail = 0, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  const firstMuted = words.length - mutedTail
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          from={i / words.length}
          to={(i + 1) / words.length}
          muted={i >= firstMuted}
        >
          {word}
        </Word>
      ))}
    </p>
  )
}

// 0.42 è la soglia minima perché anche la parola ancora spenta resti leggibile (contrasto 3:1 per testi grandi)
const UNLIT_OPACITY = 0.42

function Word({ children, progress, from, to, muted }) {
  const opacity = useTransform(progress, [from, to], [UNLIT_OPACITY, 1])
  // le parole tenui sono già "spente" per scelta: sopra il loro colore attenuato non si accendono
  if (muted) return <span className="word--muted">{children} </span>
  return (
    <span>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </span>
  )
}
