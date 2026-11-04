import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { EASE } from '@/lib/motion'

/** Conta da 0 a `target` quando `active` diventa true. */
export function useCountUp(target, active, duration = 1.6) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const controls = animate(0, target, { duration, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [target, active, duration])
  return value
}
