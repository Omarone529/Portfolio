import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PROJECTS, WORK } from '@/content'
import { RollText } from '@/components/primitives'
import { pad2 } from '@/lib/format'
import { EASE } from '@/lib/motion'

const THUMB_INTERVAL = 2200

/** Pulsante laterale "Guarda tutti": la miniatura scorre tra i loghi dei progetti, il clic apre la vista completa. */
export default function SeeAll({ onOpen, ref }) {
  const index = useCycle(PROJECTS.length, THUMB_INTERVAL)
  const project = PROJECTS[index]

  return (
    <motion.button
      ref={ref}
      type="button"
      className="see-all"
      onClick={onOpen}
      aria-haspopup="dialog"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: EASE }}
    >
      <span className="see-all__thumb" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={project.logo}
            alt=""
            style={{ background: project.tint }}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </AnimatePresence>
      </span>
      <span className="see-all__label">
        <RollText>{`${WORK.seeAll} (${pad2(PROJECTS.length)})`}</RollText>
      </span>
    </motion.button>
  )
}

/** Indice che avanza ogni `interval` ms tra 0 e `length - 1`; fermo con le animazioni ridotte. */
function useCycle(length, interval) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % length), interval)
    return () => clearInterval(timer)
  }, [length, interval, reduced])
  return index
}
