import { useContext } from 'react'
import { SmoothScrollContext } from '@/providers/smoothScrollContext'

/** Accesso allo scroll fluido della pagina (vedi SmoothScrollProvider). */
export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext)
  if (!ctx) throw new Error('useSmoothScroll va usato dentro <SmoothScrollProvider>')
  return ctx
}
