'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { DESKTOP, WORK } from '@/content'
import { ArrowLink } from '@/components/primitives'
import { pad2 } from '@/lib/format'
import { EASE } from '@/lib/motion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import AppWindow from './AppWindow'
import { ABOUT_APP, buildApps } from './desktop/apps'
import DesktopIcons from './desktop/DesktopIcons'
import Dock from './desktop/Dock'
import MenuBar, { ControlCenter } from './desktop/MenuBar'
import { overviewLayout } from './desktop/overview'
import PopMenu from './desktop/PopMenu'
import PowerScreen from './desktop/PowerScreen'
import Spotlight from './desktop/Spotlight'
import SystemApp, { startingNotes } from './desktop/SystemApps'
import './desktop/Desktop.css'
import { playGenie, preloadPosters, relativeRect, snapshotWindow } from './genie'
import { ProjectDemo } from './ProjectMedia'
import { useDesktop } from './useDesktop'

const M = DESKTOP.menus

/** Dopo quanto dal clic la finestra compare: al primo atterraggio dell'icona che rimbalza. */
const LAUNCH_MS = 420
const BOUNCE_MS = 900

const START_SETTINGS = { wallpaper: 0, dark: false, lens: true, autohide: false, brightness: 100 }

/** Da stop e blocco si torna al desktop; dallo spegnimento si riparte dall'avvio. */
const NEXT_POWER = { sleep: 'locked', locked: 'on', off: 'boot', boot: 'on' }

/**
 * Un portatile da usare come un computer vero: dock con un'app per progetto e
 * le app di sistema, barra dei menu, tasto destro, scrivania, Spotlight,
 * Mission Control, blocco e spegnimento. All'inizio è aperto il primo progetto
 * e un'icona chiede attenzione finché non lo si prova. Su telefono, dove il
 * dock è piccolo, sotto il portatile ci sono anche i nomi dei progetti.
 */
export default function Laptop({ projects }) {
  const screenRef = useRef(null)
  const apps = useMemo(() => buildApps(projects), [projects])
  const allApps = useMemo(() => [...apps, ABOUT_APP], [apps])
  const firstId = apps.find((a) => a.project).id

  const { windows, order, focused, act } = useDesktop(firstId)
  const [explored, setExplored] = useState(false)
  const [full, setFull] = useFullscreen(screenRef)
  const [settings, setSettings] = useState(START_SETTINGS)
  const [notes, setNotes] = useState(startingNotes)
  const [power, setPowerState] = useState('on')
  const [menu, setMenu] = useState(null)
  const [controlOpen, setControlOpen] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [overview, setOverview] = useState(null)
  const [snapHint, setSnapHint] = useState(null)
  const [tidied, setTidied] = useState(0)

  const focusedApp = allApps.find((a) => a.id === focused) ?? null
  const project = focusedApp?.project ?? null
  const parked = Object.values(windows).some((w) => w.parked)

  const { canvasRef: genieRef, play: playGenieFor } = useGenie(screenRef)
  const reduced = useReducedMotion()
  const [launching, launch] = useLaunch()

  // le anteprime servono al genio quando una demo non ha ancora caricato il primo fotogramma
  useEffect(() => preloadPosters(projects.map((p) => p.poster).filter(Boolean)), [projects])

  const openApp = (id) => {
    setExplored(true)
    setOverview(null)
    const win = windows[id]
    // riaprire una finestra ridotta: esce dall'icona del dock, poi torna vera
    if (win?.min) {
      if (!playGenieFor(id, true, () => act('open', id))) act('open', id)
      return
    }
    // già aperta: torna in primo piano
    if (win) return act('open', id)
    if (launching === id) return
    // nuova: l'icona rimbalza e la finestra compare quando atterra, come sul Mac
    const { size } = allApps.find((a) => a.id === id)
    if (reduced) act('open', id, { size })
    else launch(id, () => act('open', id, { size }))
  }
  const minimize = useCallback(
    (id) => {
      setExplored(true)
      playGenieFor(id, false)
      act('minimize', id)
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

  const openUrl = (url) => url && window.open(url, '_blank', 'noreferrer')
  const closeMenu = useCallback(() => setMenu(null), [])

  /** Mostra un menu dove si è cliccato col tasto destro. */
  const contextMenu = (e, items) => {
    e.preventDefault()
    const box = screenRef.current.getBoundingClientRect()
    setControlOpen(false)
    setMenu({ x: e.clientX - box.left, y: e.clientY - box.top, items })
  }

  const windowItems = (id) => {
    const win = windows[id]
    return [
      { label: M.minimize, hint: '⌥M', onSelect: () => minimize(id) },
      { label: M.zoom, hint: '⌥F', checked: win.max, onSelect: () => actAndExplore('maximize', id) },
      'sep',
      { label: M.snapLeft, hint: '⌥←', checked: win.snap === 'left', onSelect: () => act('snap', id, { side: 'left' }) },
      { label: M.snapRight, hint: '⌥→', checked: win.snap === 'right', onSelect: () => act('snap', id, { side: 'right' }) },
    ]
  }

  const toggleOverview = () => {
    if (overview) return setOverview(null)
    const screen = screenRef.current
    const box = screen.getBoundingClientRect()
    const rects = order
      .filter((id) => !windows[id].min)
      .map((id) => ({ id, ...relativeRect(screen.querySelector(`[data-window="${id}"]`), box) }))
    if (rects.length === 0) return
    const top = screen.querySelector('.desktop__menubar').offsetHeight
    const dockTop = screen.querySelector('.dock').offsetTop
    setExplored(true)
    setOverview(overviewLayout(rects, { x: 0, y: top, w: box.width, h: dockTop - top }))
  }

  const toggleDesktop = () => act(parked ? 'restoreAll' : 'showDesktop')

  const setPower = (next) => {
    closeMenu()
    setControlOpen(false)
    setOverview(null)
    if (next === 'restart') setPowerState('boot')
    else setPowerState(next)
    if (next === 'off' || next === 'restart') {
      act('reset', firstId)
      setExplored(true)
    }
  }
  const advancePower = useCallback(() => setPowerState((p) => NEXT_POWER[p]), [])

  const os = {
    apps,
    windows,
    settings,
    set: (key, value) => setSettings((s) => ({ ...s, [key]: value })),
    notes,
    setNotes,
    focusedApp,
    focusedWin: focused === null ? null : windows[focused],
    parked,
    full,
    setFull,
    controlOpen,
    openApp,
    openUrl,
    openByName: (name) => {
      const app = apps.find((a) => a.title.toLowerCase() === name.toLowerCase())
      if (app) openApp(app.id)
      return Boolean(app)
    },
    closeApp: (id) => actAndExplore('close', id),
    setPower,
    toggleOverview,
    toggleDesktop,
    tidyIcons: () => setTidied((n) => n + 1),
    openSpotlight: () => setSpotlight(true),
    toggleControl: () => setControlOpen((open) => !open),
    closeMenu,
    windowItems,
  }

  useShortcuts(screenRef, {
    spotlight: () => setSpotlight(true),
    close: () => {
      setSpotlight(false)
      setOverview(null)
      setControlOpen(false)
    },
    closeWindow: () => focused !== null && os.closeApp(focused),
    minimize: () => focused !== null && minimize(focused),
    zoom: () => focused !== null && actAndExplore('maximize', focused),
    snap: (side) => focused !== null && act('snap', focused, { side }),
    overview: toggleOverview,
  })

  const dockMenu = (e, app) => {
    const win = windows[app.id]
    contextMenu(e, [
      { label: win ? M.show : M.open, onSelect: () => openApp(app.id) },
      app.project?.href && { label: WORK.visit, onSelect: () => openUrl(app.project.href) },
      win && !win.min && { label: M.minimize, onSelect: () => minimize(app.id) },
      win && 'sep',
      win && { label: M.quit, onSelect: () => os.closeApp(app.id) },
    ])
  }

  const desktopMenu = (e) =>
    contextMenu(e, [
      { label: M.wallpaper, onSelect: () => openApp('settings') },
      { label: M.tidy, onSelect: os.tidyIcons },
      'sep',
      { label: parked ? M.showWindows : M.showDesktop, onSelect: toggleDesktop },
      { label: M.missionControl, onSelect: toggleOverview },
    ])

  const windowMenu = (e, id) =>
    contextMenu(e, [...windowItems(id), 'sep', { label: M.closeWindow, onSelect: () => os.closeApp(id) }])

  const pickResult = (result) => {
    setSpotlight(false)
    if (!result.file) return openApp(result.id)
    if (result.project.href) openUrl(result.project.href)
    else openApp('finder')
  }

  const openIds = allApps.map((a) => a.id).filter((id) => windows[id])
  const calling = explored ? null : apps.find((a) => a.project && !windows[a.id])?.id
  const screenClass = [
    'laptop__screen',
    `wall-${settings.wallpaper}`,
    full ? 'is-full' : '',
    settings.dark ? 'is-dark' : '',
    overview ? 'is-overview' : '',
  ].join(' ')

  return (
    <div className="laptop-stage">
      <div className="laptop">
        <div className="laptop__lid">
          {/* lo spazio del display resta riservato anche quando lui va a schermo intero */}
          <div className="laptop__slot">
            <div ref={screenRef} className={screenClass}>
              <MenuBar
                os={os}
                title={focusedApp?.title ?? DESKTOP.appNames.finder}
                screenRef={screenRef}
                active={menu?.key}
                openMenu={setMenu}
              />

              <DesktopIcons
                key={tidied}
                screenRef={screenRef}
                onOpen={openApp}
                onContextMenu={desktopMenu}
                onClearFocus={() => setOverview(null)}
              />

              {/*
                le finestre restano sempre nello stesso ordine nella pagina e il primo piano lo decide lo z-index:
                se React le spostasse al clic, il browser annullerebbe il clic stesso
              */}
              <AnimatePresence>
                {openIds.map((id) => {
                  const app = allApps.find((a) => a.id === id)
                  return (
                    <AppWindow
                      key={id}
                      app={app}
                      win={windows[id]}
                      z={order.indexOf(id) + 1}
                      focused={id === focused}
                      screenRef={screenRef}
                      act={actAndExplore}
                      onMinimize={minimize}
                      onSnapHint={setSnapHint}
                      onContextMenu={windowMenu}
                      overview={overview}
                      onPick={openApp}
                    >
                      {app.project ? (
                        <ProjectDemo project={app.project} playing={!windows[id].min && power === 'on'} />
                      ) : (
                        <SystemApp app={app} os={os} />
                      )}
                    </AppWindow>
                  )
                })}
              </AnimatePresence>

              {snapHint && <span className={`desktop__snap desktop__snap--${snapHint}`} aria-hidden="true" />}
              {overview && <button type="button" className="desktop__exit" aria-label={M.missionControl} onClick={toggleOverview} />}

              <canvas ref={genieRef} className="genie" aria-hidden="true" />

              <Dock
                apps={apps}
                windows={windows}
                focused={focused}
                launching={launching}
                calling={calling}
                lens={settings.lens}
                hidden={settings.autohide}
                onOpen={openApp}
                onContextMenu={dockMenu}
              />

              {controlOpen && <ControlCenter os={os} onClose={() => setControlOpen(false)} />}
              {spotlight && <Spotlight apps={apps} onPick={pickResult} onClose={() => setSpotlight(false)} />}
              {menu && <PopMenu key={`${menu.x}-${menu.y}`} x={menu.x} y={menu.y} items={menu.items} screenRef={screenRef} onClose={closeMenu} />}
              <span className="desktop__dim" style={{ opacity: 1 - settings.brightness / 100 }} aria-hidden="true" />
              {power !== 'on' && <PowerScreen power={power} onNext={advancePower} />}
            </div>
          </div>
        </div>
        <div className="laptop__base" aria-hidden="true" />
      </div>

      <div className="laptop__controls">
        {/* su telefono il dock è piccolo: qui gli stessi progetti, a misura di dito */}
        <div className="laptop__switcher" role="group" aria-label={WORK.switcher}>
          {apps
            .filter((a) => a.project)
            .map((a) => (
              <button key={a.id} type="button" onClick={() => openApp(a.id)} aria-pressed={a.id === focused}>
                {a.title}
              </button>
            ))}
        </div>
        <button type="button" className="laptop__full" onClick={() => setFull(!full)}>
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
                  {pad2(projects.indexOf(project) + 1)} / {pad2(projects.length)}
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
 * Il rimbalzo dell'icona mentre la sua app si apre: `launch(id, onReady)` lo
 * fa partire e chiama `onReady` quando l'icona tocca terra la prima volta.
 */
function useLaunch() {
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
function useShortcuts(screenRef, handlers) {
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
function useGenie(screenRef) {
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

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
