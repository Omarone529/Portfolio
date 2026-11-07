'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { DESKTOP, WORK } from '@/content'
import AppWindow from './desktop/AppWindow'
import { ABOUT_APP, buildApps } from './desktop/registry'
import DesktopIcons from './desktop/DesktopIcons'
import Dock from './desktop/Dock'
import MenuBar, { ControlCenter } from './desktop/MenuBar'
import { overviewLayout } from './desktop/overview'
import PopMenu from './desktop/PopMenu'
import PowerScreen from './desktop/PowerScreen'
import Spotlight from './desktop/Spotlight'
import SystemApp, { startingNotes } from './desktop/apps'
import './desktop/Desktop.css'
import { preloadPosters, relativeRect } from './desktop/genie'
import { useFullscreen, useGenie, useLaunch, usePersistentState, useShortcuts, useSize } from './desktop/hooks'
import LaptopCaption from './LaptopCaption'
import LaptopControls from './LaptopControls'
import { ProjectDemo } from './ProjectMedia'
import { useDesktop } from './desktop/useDesktop'

const M = DESKTOP.menus

const START_SETTINGS = { wallpaper: 0, dark: false, lens: true, autohide: false, brightness: 100 }

/** Da stop e blocco si torna al desktop; dallo spegnimento si riparte dall'avvio. */
const NEXT_POWER = { sleep: 'locked', locked: 'on', off: 'boot', boot: 'on' }

/** Sotto questa larghezza (in px) il display è un'anteprima: niente comandi da toccare, solo il tocco che lo apre. */
const COMPACT_WIDTH = 560
/** Sotto questa larghezza o questa altezza (in px) il display a schermo intero è un telefono: le finestre lo riempiono. */
const PHONE_WIDTH = 600
const PHONE_HEIGHT = 500

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
  const slotRef = useRef(null)
  const slot = useSize(slotRef)
  const screen = useSize(screenRef)
  const compact = slot.width > 0 && slot.width < COMPACT_WIDTH && !full
  // a schermo intero su un telefono, in verticale o in orizzontale, ogni app occupa tutto lo schermo come su iPhone
  const phone = full && (screen.width < PHONE_WIDTH || screen.height < PHONE_HEIGHT)
  // sfondo, aspetto e note restano a chi torna sul sito, solo nel suo browser
  const [settings, setSettings] = usePersistentState('laptop:settings', START_SETTINGS)
  const [notes, setNotes] = usePersistentState('laptop:notes', startingNotes)
  const [noteId, setNoteId] = useState(null)
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
  // sfondo e anteprime pesano: arrivano quando il portatile è a meno di uno schermo, non al primo caricamento
  const near = useInView(slotRef, { once: true, margin: '0px 0px 100% 0px' })
  useEffect(() => {
    if (near) preloadPosters(projects.map((p) => p.poster).filter(Boolean))
  }, [near, projects])

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
      {
        label: M.snapLeft,
        hint: '⌥←',
        checked: win.snap === 'left',
        onSelect: () => act('snap', id, { side: 'left' }),
      },
      {
        label: M.snapRight,
        hint: '⌥→',
        checked: win.snap === 'right',
        onSelect: () => act('snap', id, { side: 'right' }),
      },
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
    noteId,
    setNoteId,
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
  const wallpaper = DESKTOP.settings.wallpapers[settings.wallpaper]
  const screenClass = [
    'laptop__screen',
    wallpaper.dark ? 'is-dark-wall' : '',
    full ? 'is-full' : '',
    settings.dark ? 'is-dark' : '',
    overview ? 'is-overview' : '',
    compact ? 'is-compact' : '',
    phone ? 'is-phone' : '',
  ].join(' ')

  return (
    <div className="laptop-stage">
      <div className="laptop">
        <div className="laptop__lid">
          {/* lo spazio del display resta riservato anche quando lui va a schermo intero */}
          <div ref={slotRef} className="laptop__slot">
            <div
              ref={screenRef}
              className={screenClass}
              style={{ backgroundColor: wallpaper.color, backgroundImage: near ? `url(${wallpaper.src})` : undefined }}
            >
              {/* piccolo, il computer è un'anteprima: i suoi comandi sarebbero troppo piccoli da toccare, quindi
                  restano fermi e un tocco lo apre a schermo intero, dove tutto ha la misura giusta */}
              <div className="desktop" inert={compact}>
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
                        fill={phone}
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
                {overview && (
                  <button
                    type="button"
                    className="desktop__exit"
                    aria-label={M.missionControl}
                    onClick={toggleOverview}
                  />
                )}

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
                {menu && (
                  <PopMenu
                    key={`${menu.x}-${menu.y}`}
                    x={menu.x}
                    y={menu.y}
                    items={menu.items}
                    screenRef={screenRef}
                    onClose={closeMenu}
                  />
                )}
                <span className="desktop__dim" style={{ opacity: 1 - settings.brightness / 100 }} aria-hidden="true" />
                {power !== 'on' && <PowerScreen power={power} onNext={advancePower} />}
              </div>
              {compact && (
                <button type="button" className="laptop__open" onClick={() => setFull(true)}>
                  <span className="sr-only">{WORK.fullscreen}</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="laptop__base" aria-hidden="true" />
      </div>

      <LaptopControls
        apps={apps.filter((a) => a.project)}
        focused={focused}
        onOpen={openApp}
        onFullscreen={() => setFull(!full)}
      />
      <LaptopCaption project={project} projects={projects} />
    </div>
  )
}
