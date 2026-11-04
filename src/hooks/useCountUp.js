import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { EASE } from '@/lib/motion'

/**
 * Conta da 0 a `target` ogni volta che `active` diventa true. Prima vale già
 * `target`: l'HTML prerenderizzato, i crawler e chi non ha JavaScript leggono il
 * numero vero, e il blocco non è ancora a schermo quando il conteggio riparte da 0.
 */
export function useCountUp(target, active, duration = 1.6) {
  const [value, setValue] = useState(target)
  useEffect(() => {
    if (!active) return
    const controls = animate(0, target, { duration, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [target, active, duration])
  return value
}
