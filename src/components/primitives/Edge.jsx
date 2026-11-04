import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Triangolo del colore della sezione che rende obliquo un bordo dritto.
 * `scale` (motion value 0..1) è la pendenza: 1 = piena, 0 = bordo dritto e
 * triangolo sparito, quindi a fine corsa non copre mai il contenuto vicino.
 * La pendenza piena è `--edge-rise` (tokens.css).
 */
export function EdgeWedge({ tone, side, scale }) {
  return <motion.div aria-hidden="true" className={`edge edge--${side} tone-${tone}`} style={{ scaleY: scale }} />
}

/** Bordo superiore obliquo di una sezione: si raddrizza mentre la sezione sale nello schermo. */
export function TopEdge({ tone }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0])
  return (
    <div ref={ref} className="edge-anchor">
      <EdgeWedge tone={tone} side="top" scale={scale} />
    </div>
  )
}
