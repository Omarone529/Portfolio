'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { WORK } from '@/content'
import { ArrowLink } from '@/components/primitives'
import { pad2 } from '@/lib/format'
import { EASE } from '@/lib/motion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import AppWindow from './AppWindow'
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

  const open = (index) => {
    act('open', index)
    setExplored(true)
  }
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
                  />
                ))}
              </AnimatePresence>

              <nav className="dock" aria-label={WORK.switcher}>
                {projects.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    className={`dock__item ${windows[i] ? 'is-open' : ''}`}
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
