'use client'

import { useEffect, useRef } from 'react'
import { DESKTOP, SITE } from '@/content'

const T = DESKTOP.power
const BOOT_MS = 1800

/**
 * Quello che copre il desktop quando non è acceso: spento, in avvio, in stop o
 * bloccato. Dallo stop basta un clic o un tasto; il blocco non chiede una
 * password, è un portfolio. `onNext` passa allo stato successivo.
 */
export default function PowerScreen({ power, onNext }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    if (power !== 'boot') return
    const timer = setTimeout(onNext, BOOT_MS)
    return () => clearTimeout(timer)
  }, [power, onNext])

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [power])

  if (power === 'boot') {
    return (
      <div className="power power--dark" role="status" aria-label={T.booting}>
        <span className="desktop__mark desktop__mark--large" />
        <span className="power__bar" />
      </div>
    )
  }
  if (power === 'locked') {
    return (
      <div className="power power--locked">
        <span className="power__name">{SITE.fullName}</span>
        <button ref={buttonRef} type="button" onClick={onNext}>
          {T.unlock}
        </button>
      </div>
    )
  }
  return (
    <button
      ref={buttonRef}
      type="button"
      className="power power--dark power--whole"
      onClick={onNext}
      aria-label={power === 'off' ? T.on : T.wake}
    >
      <span className="power__hint">{power === 'off' ? T.on : T.wake}</span>
    </button>
  )
}
