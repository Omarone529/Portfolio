import { useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { anchorOffset } from '@/lib/scroll'
import { SmoothScrollContext } from './smoothScrollContext'

/**
 * Scroll fluido (Lenis) per tutta la pagina, più la gestione dei link interni:
 * ogni clic su un "#id" scorre fino alla sezione senza scatti del browser e
 * senza lasciare l'ancora nell'indirizzo. Con le animazioni ridotte lo scroll
 * resta quello nativo.
 */
export function SmoothScrollProvider({ children }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef(null)

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, autoRaf: true })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const api = useMemo(
    () => ({
      scrollTo(top) {
        if (lenisRef.current) lenisRef.current.scrollTo(top, { force: true })
        else window.scrollTo({ top })
      },
      lock() {
        lenisRef.current?.stop()
        document.documentElement.style.overflow = 'hidden'
      },
      unlock() {
        lenisRef.current?.start()
        document.documentElement.style.overflow = ''
      },
    }),
    [],
  )

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const link = e.target.closest?.('a[href^="#"]')
      const top = link && anchorOffset(link.getAttribute('href'))
      if (top === null || top === undefined) return
      e.preventDefault()
      api.scrollTo(top)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [api])

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}
