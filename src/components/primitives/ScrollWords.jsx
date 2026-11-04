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
        <Word key={i} progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length} muted={i >= firstMuted}>
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, from, to, muted }) {
  const opacity = useTransform(progress, [from, to], [0.15, 1])
  return (
    <span className={muted ? 'word--muted' : undefined}>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </span>
  )
}
