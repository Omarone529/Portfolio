import { useEffect } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/** Fa girare un <video> solo mentre è a schermo; con le animazioni ridotte resta fermo sul poster. */
export function useInViewPlayback(ref) {
  const inView = useInView(ref, { margin: '-10% 0px' })
  const reduced = useReducedMotion()
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (inView && !reduced) video.play().catch(() => {})
    else video.pause()
  }, [ref, inView, reduced])
}
