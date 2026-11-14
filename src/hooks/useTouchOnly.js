import { useSyncExternalStore } from 'react'

/** Dispositivi che si usano solo col dito: niente mouse e niente rotella. La stessa condizione sta in Hero.css. */
export const TOUCH_ONLY = '(hover: none) and (pointer: coarse)'

/** Se la media query è soddisfatta, aggiornato quando cambia. Nel prerender vale false. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Se il dispositivo si usa solo col dito. Nel prerender vale false. */
export function useTouchOnly() {
  return useMediaQuery(TOUCH_ONLY)
}
