import { useSyncExternalStore } from 'react'

/** Dispositivi che si usano solo col dito: niente mouse e niente rotella. La stessa condizione sta in Hero.css. */
export const TOUCH_ONLY = '(hover: none) and (pointer: coarse)'

const subscribe = (onChange) => {
  const query = window.matchMedia(TOUCH_ONLY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** Se il dispositivo si usa solo col dito. Nel prerender vale false. */
export function useTouchOnly() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(TOUCH_ONLY).matches,
    () => false,
  )
}
