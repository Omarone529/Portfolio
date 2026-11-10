'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { playGenie, relativeRect, snapshotWindow } from './genie'

/** Gli hook del portatile: rimbalzo, scorciatoie, effetto genio, misure, schermo intero e dati da ricordare. */

/** Dopo quanto dal clic la finestra compare: al primo atterraggio dell'icona che rimbalza. */
const LAUNCH_MS = 420
const BOUNCE_MS = 900

/**
 * Il rimbalzo dell'icona mentre la sua app si apre: `launch(id, onReady)` lo
 * fa partire e chiama `onReady` quando l'icona tocca terra la prima volta.
 */
export function useLaunch() {
  const [launching, setLaunching] = useState(null)
  const timers = useRef([])
  const launch = useCallback((id, onReady) => {
    timers.current.forEach(clearTimeout)
    setLaunching(id)
    timers.current = [setTimeout(onReady, LAUNCH_MS), setTimeout(() => setLaunching(null), BOUNCE_MS)]
  }, [])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  return [launching, launch]
}

/**
 * Le scorciatoie del computer, attive solo dopo averlo cliccato: fuori dal
 * portatile la tastiera resta della pagina. Usano ⌥ perché ⌘W, ⌘M e ⌘Q
 * appartengono al browser e al sistema vero, e nessuna pagina può intercettarli.
 */
export function useShortcuts(screenRef, handlers) {
  const latest = useRef(handlers)
  useEffect(() => {
    latest.current = handlers
  })

  useEffect(() => {
    let active = false
    const onPointerDown = (e) => {
      active = Boolean(screenRef.current?.contains(e.target))
    }
    const onKey = (e) => {
      if (!active) return
      const on = latest.current
      if (e.key === 'Escape') return on.close()
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        return on.spotlight()
      }
      if (!e.altKey || e.target.closest?.('input, textarea')) return
      const action = {
        KeyW: on.closeWindow,
        KeyM: on.minimize,
        KeyF: on.zoom,
        ArrowUp: on.overview,
        ArrowLeft: () => on.snap('left'),
        ArrowRight: () => on.snap('right'),
      }[e.code]
      if (!action) return
      e.preventDefault()
      action()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [screenRef])
}

/**
 * L'effetto genio tra una finestra e la sua icona nel dock, disegnato su un
 * canvas grande quanto il display. `play(id, reverse, onDone)` copia la
 * finestra e la fa entrare nell'icona (o uscirne con `reverse`); restituisce
 * false, senza animare, con le animazioni ridotte o se un'altra è in corso.
 */
export function useGenie(screenRef) {
  const canvasRef = useRef(null)
  const running = useRef(false)
  const reduced = useReducedMotion()

  const play = useCallback(
    (id, reverse, onDone) => {
      const screen = screenRef.current
      const canvas = canvasRef.current
      const windowEl = screen?.querySelector(`[data-window="${id}"]`)
      const icon = screen?.querySelector(`.dock__item[data-app="${id}"]`)
      if (reduced || running.current || !canvas || !windowEl || !icon) return false

      const { canvas: source, rect: from } = snapshotWindow(windowEl, screen)
      const to = relativeRect(icon, screen.getBoundingClientRect())
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(screen.clientWidth * dpr)
      canvas.height = Math.round(screen.clientHeight * dpr)

      running.current = true
      playGenie(canvas, {
        source,
        from,
        to,
        reverse,
        onDone: () => {
          onDone?.()
          // l'ultimo fotogramma resta un istante, il tempo che la finestra vera riappaia
          setTimeout(() => {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            running.current = false
          }, 140)
        },
      })
      return true
    },
    [screenRef, reduced],
  )

  return { canvasRef, play }
}

/** Larghezza e altezza di un elemento in px, aggiornate a ogni ridimensionamento (0 prima di misurarlo). */
export function useSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => setSize({ width: el.offsetWidth, height: el.offsetHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/**
 * Schermo intero per il display: usa quello del browser dove c'è, altrimenti
 * (iPhone) il display copre comunque la finestra. Esc ne esce in entrambi i
 * casi, e intanto la pagina sotto non scorre.
 */
export function useFullscreen(ref) {
  const [full, setFullState] = useState(false)
  const { lock, unlock } = useSmoothScroll()

  const setFull = useCallback(
    (next) => {
      if (next) {
        ref.current.requestFullscreen?.().catch(() => {})
        lock()
      } else {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
        unlock()
      }
      setFullState(next)
    },
    [ref, lock, unlock],
  )

  useEffect(() => {
    if (!full) return
    // uscendo con Esc dallo schermo intero del browser, il display torna nel portatile
    const onChange = () => {
      if (!document.fullscreenElement) setFull(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setFull(false)
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('keydown', onKey)
    }
  }, [full, setFull])

  return [full, setFull]
}

/**
 * Uno stato che chi guarda ritrova tornando sul sito, salvato nel browser con
 * `key`. Al primo disegno vale sempre `initial`, come nel prerender, e il
 * valore salvato arriva subito dopo: così la pagina non cambia tra server e
 * browser. Si salva solo quando il valore cambia davvero, mai al montaggio,
 * così il valore iniziale non può coprire quello salvato. Se il browser non
 * lascia salvare (navigazione privata) resta solo in memoria.
 */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- il valore salvato si legge solo dopo il montaggio
      if (saved !== null) setValue(JSON.parse(saved))
    } catch {
      // niente da recuperare: resta il valore iniziale
    }
  }, [key])

  const update = useCallback(
    (next) =>
      setValue((previous) => {
        const value = typeof next === 'function' ? next(previous) : next
        try {
          localStorage.setItem(key, JSON.stringify(value))
        } catch {
          // spazio esaurito o salvataggio vietato: il valore resta in memoria
        }
        return value
      }),
    [key],
  )

  return [value, update]
}
