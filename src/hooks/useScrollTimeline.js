import { useSyncExternalStore } from 'react'

const subscribeNothing = () => () => {}

/**
 * Se il browser sa legare un'animazione CSS allo scroll. In quel caso gli
 * effetti che seguono lo scroll li fa lui, sullo stesso canale dello scroll: su
 * un telefono restano attaccati al dito, mentre calcolati in JavaScript arrivano
 * un fotogramma dopo e scattano. Nel prerender vale false, come nei browser che
 * non lo supportano, dove resta useScroll.
 */
export function useScrollTimeline() {
  return useSyncExternalStore(
    subscribeNothing,
    () => CSS.supports('animation-timeline: scroll()'),
    () => false,
  )
}
