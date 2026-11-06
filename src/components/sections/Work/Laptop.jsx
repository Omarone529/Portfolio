'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { WORK } from '@/content'
import { ArrowLink } from '@/components/primitives'
import { pad2 } from '@/lib/format'
import { EASE } from '@/lib/motion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import AppWindow from './AppWindow'
import { playGenie, preloadPosters, relativeRect, snapshotWindow } from './genie'
import { useDesktop } from './useDesktop'

/**
 * Un portatile da usare come un computer vero: nel dock c'è un'app per
 * progetto, cliccandola si apre la sua finestra con la demo. Le finestre si
 * spostano, si ridimensionano, si riducono nel dock e si ingrandiscono, e
 * tutto il desktop può andare a schermo intero. All'inizio è aperto il primo
 * progetto e il dock pulsa finché non lo si prova. Su
 * telefono, dove il dock è piccolo, sotto il portatile ci sono anche i nomi.
 */
export default function Laptop({ projects }) {
  const screenRef = useRef(null)
  const { windows, order, focused, act } = useDesktop(0)
  const [explored, setExplored] = useState(false)
  const [full, setFull] = useFullscreen(screenRef)
  const project = focused === null ? null : projects[focused]
  const openIds = projects.map((_, i) => i).filter((i) => windows[i])

  const { canvasRef: genieRef, play: playGenieFor } = useGenie(screenRef)
  const [launching, bounce] = useBounce()
  const dock = useDockMagnification()

  // le anteprime servono al genio quando una demo non ha ancora caricato il primo fotogramma
  useEffect(() => preloadPosters(projects.map((p) => p.poster).filter(Boolean)), [projects])

  const open = (index) => {
    setExplored(true)
    const win = windows[index]
    // riaprire una finestra ridotta: esce dall'icona del dock, poi torna vera
    if (win?.min) {
      if (!playGenieFor(index, true, () => act('open', index))) act('open', index)
      return
    }
    // già aperta: torna in primo piano
    if (win) return act('open', index)
    // nuova: l'icona rimbalza, la finestra nasce nascosta al suo posto e il genio la fa uscire dal dock
    bounce(index)
    act('launch', index)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!playGenieFor(index, true, () => act('open', index))) act('open', index)
      }),
    )
  }
  const minimize = useCallback(
    (index) => {
      setExplored(true)
      playGenieFor(index, false)
      act('minimize', index)
    },
    [act, playGenieFor],
  )
  const actAndExplore = useCallback(
    (type, id, extra) => {
      act(type, id, extra)
      if (type !== 'move' && type !== 'resize' && type !== 'focus') setExplored(true)
    },
    [act],
  )

  return (
    <div className="laptop-stage">
      <div className="laptop">
        <div className="laptop__lid">
          {/* lo spazio del display resta riservato anche quando lui va a schermo intero */}
          <div className="laptop__slot">
            <div ref={screenRef} className={`laptop__screen ${explored ? '' : 'is-new'} ${full ? 'is-full' : ''}`}>
              <div className="desktop__menubar">
                <span className="desktop__app">{project?.title}</span>
                <span className="desktop__status">
                  {/* a schermo intero serve un modo per uscire anche dove non c'è Esc (iPhone) */}
                  {full && (
                    <button
                      type="button"
                      className="desktop__full"
                      onClick={() => setFull(false)}
                      aria-label={WORK.exitFullscreen}
                    >
                      <FullscreenIcon exit />
                    </button>
                  )}
                  <Clock />
                </span>
              </div>

              {/*
                le finestre restano sempre nello stesso ordine nella pagina e il primo piano lo decide lo z-index:
                se React le spostasse al clic, il browser annullerebbe il clic stesso
              */}
              <AnimatePresence>
                {openIds.map((id) => (
                  <AppWindow
                    key={id}
                    id={id}
                    project={projects[id]}
                    win={windows[id]}
                    z={order.indexOf(id) + 1}
                    focused={id === focused}
                    screenRef={screenRef}
                    act={actAndExplore}
                    onMinimize={minimize}
                  />
                ))}
              </AnimatePresence>

              <canvas ref={genieRef} className="genie" aria-hidden="true" />

              <nav className="dock" aria-label={WORK.switcher} {...dock}>
                {projects.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    className={`dock__item ${windows[i] ? 'is-open' : ''} ${launching === i ? 'is-launching' : ''}`}
                    style={{ background: p.tint }}
                    onClick={() => open(i)}
                    aria-pressed={i === focused}
                  >
                    <img
                      src={p.logo}
                      alt=""
                      width={p.logoSize[0]}
                      height={p.logoSize[1]}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="dock__label">{p.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="laptop__base" aria-hidden="true" />
      </div>

      <div className="laptop__controls">
        {/* su telefono il dock è piccolo: qui gli stessi progetti, a misura di dito */}
        <div className="laptop__switcher" role="group" aria-label={WORK.switcher}>
          {projects.map((p, i) => (
            <button key={p.title} type="button" onClick={() => open(i)} aria-pressed={i === focused}>
              {p.title}
            </button>
          ))}
        </div>
        <button type="button" className="laptop__full" onClick={() => setFull(true)}>
          <FullscreenIcon />
          {WORK.fullscreen}
        </button>
      </div>

      <div className="laptop__caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {project && (
            <m.div
              key={project.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h3 className="laptop__title">
                <span className="laptop__count muted">
                  {pad2(focused + 1)} / {pad2(projects.length)}
                </span>
                {project.title} <span className="muted">· {project.tag}</span>
              </h3>
              <p className="laptop__description muted">{project.description}</p>
              {project.href && (
                <ArrowLink href={project.href} target="_blank" rel="noreferrer">
                  {WORK.visit}
                </ArrowLink>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** L'icona che rimbalza mentre la sua app si apre, come nel dock del Mac. */
function useBounce() {
  const [launching, setLaunching] = useState(null)
  const timer = useRef(0)
  const bounce = useCallback((index) => {
    clearTimeout(timer.current)
    setLaunching(index)
    timer.current = setTimeout(() => setLaunching(null), 900)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return [launching, bounce]
}

/**
 * La lente del dock: col mouse sopra, le icone si ingrandiscono tanto più
 * quanto sono vicine al puntatore. Scrive su ogni icona la variabile --mag,
 * che il CSS usa per scala e sollevamento. Solo col mouse: al tocco no.
 */
function useDockMagnification() {
  const onPointerMove = useCallback((e) => {
    if (e.pointerType !== 'mouse') return
    for (const item of e.currentTarget.children) {
      const r = item.getBoundingClientRect()
      const distance = Math.abs(e.clientX - (r.left + r.width / 2)) / r.width
      item.style.setProperty('--mag', String(1 + 0.32 * Math.max(0, 1 - distance / 2.2) ** 1.6))
    }
  }, [])
  const onPointerLeave = useCallback((e) => {
    for (const item of e.currentTarget.children) item.style.removeProperty('--mag')
  }, [])
  return { onPointerMove, onPointerLeave }
}

/**
 * L'effetto genio tra una finestra e la sua icona nel dock, disegnato su un
 * canvas grande quanto il display. `play(index, reverse, onDone)` copia la
 * finestra e la fa entrare nell'icona (o uscirne con `reverse`); restituisce
 * false, senza animare, con le animazioni ridotte o se un'altra è in corso.
 */
function useGenie(screenRef) {
  const canvasRef = useRef(null)
  const running = useRef(false)
  const reduced = useReducedMotion()

  const play = useCallback(
    (index, reverse, onDone) => {
      const screen = screenRef.current
      const canvas = canvasRef.current
      const windowEl = screen?.querySelector(`[data-window="${index}"]`)
      const icon = screen?.querySelectorAll('.dock__item')[index]
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

/**
 * Schermo intero per il display: usa quello del browser dove c'è, altrimenti
 * (iPhone) il display copre comunque la finestra. Esc ne esce in entrambi i
 * casi, e intanto la pagina sotto non scorre.
 */
function useFullscreen(ref) {
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

function FullscreenIcon({ exit = false }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d={exit ? 'M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4' : 'M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4'}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

/* ---------- orologio della barra dei menu ---------- */

const formatTime = () => new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })

const subscribeClock = (onChange) => {
  const timer = setInterval(onChange, 10_000)
  return () => clearInterval(timer)
}

/** L'ora corrente, aggiornata ogni pochi secondi; durante il prerender è vuota. */
function Clock() {
  const time = useSyncExternalStore(subscribeClock, formatTime, () => '')
  return <time className="desktop__clock">{time}</time>
}
