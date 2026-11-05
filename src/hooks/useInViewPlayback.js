import { useEffect } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Fa girare un <video> solo mentre è a schermo e `enabled` è vero; con le
 * animazioni ridotte resta fermo sul poster.
 */
export function useInViewPlayback(ref, enabled = true) {
  const inView = useInView(ref, { margin: '-10% 0px' })
  const reduced = useReducedMotion()
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (inView && enabled && !reduced) video.play().catch(() => {})
    else video.pause()
  }, [ref, inView, enabled, reduced])
}
