import { useSyncExternalStore } from 'react'

const subscribe = (onChange) => {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

/** Altezza della finestra, aggiornata al resize. Durante il prerender vale 0. */
export function useViewportHeight() {
  return useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => 0,
  )
}
