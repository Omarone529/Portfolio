'use client'

import { useState } from 'react'
import { m } from 'framer-motion'
import { WORK } from '@/content'
import { EASE } from '@/lib/motion'
import { ProjectDemo } from './ProjectMedia'

/** Cosa mostra la barra della finestra: il dominio del sito pubblicato, altrimenti il nome del progetto. */
const windowAddress = (project) => (project.href ? new URL(project.href).hostname.replace(/^www\./, '') : project.title)

/** Ingrandita, la finestra copre tutto il desktop sotto la barra dei menu. */
const MAXIMIZED = { left: 0, top: 'var(--menubar)', width: '100%', height: 'calc(100% - var(--menubar))' }

/**
 * Segue il puntatore dal pointerdown al pointerup e passa a `onMove` lo
 * spostamento in percentuale del display; alla fine chiama `onEnd`. Il
 * bersaglio cattura il puntatore, così il trascinamento continua anche
 * uscendo dalla finestra. Restituisce false se non è il tasto principale.
 */
function startPointerDrag(event, screen, onMove, onEnd) {
  if (event.button !== 0) return false
  event.preventDefault()
  const target = event.currentTarget
  target.setPointerCapture(event.pointerId)
  const rect = screen.getBoundingClientRect()
  const { clientX, clientY } = event
  const move = (e) => onMove(((e.clientX - clientX) / rect.width) * 100, ((e.clientY - clientY) / rect.height) * 100)
  const end = () => {
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', end)
    target.removeEventListener('pointercancel', end)
    onEnd()
  }
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', end)
  target.addEventListener('pointercancel', end)
  return true
}

/**
 * La finestra di un progetto nel finto desktop. Si sposta trascinando la
 * barra del titolo, si ridimensiona dall'angolo in basso a destra e si porta
 * in primo piano al clic. I tre pallini chiudono, riducono nel dock e
 * ingrandiscono; il doppio clic sulla barra ingrandisce anche lui. Si apre
 * crescendo dal dock e ci rientra quando è ridotta.
 */
export default function AppWindow({ project, win, z, focused, screenRef, act, id }) {
  // mentre si trascina le transizioni sono spente, così la finestra segue il puntatore senza ritardo
  const [dragging, setDragging] = useState(false)
  const drag = (e, onMove) => {
    if (startPointerDrag(e, screenRef.current, onMove, () => setDragging(false))) setDragging(true)
  }

  const menubarPercent = () => {
    const screen = screenRef.current
    const bar = screen.querySelector('.desktop__menubar')
    return (bar.offsetHeight / screen.offsetHeight) * 100
  }

  const onBarDown = (e) => {
    if (win.max || e.target.closest('button')) return
    const { x, y } = win
    const top = menubarPercent()
    drag(e, (dx, dy) => act('move', id, { x: x + dx, y: y + dy, top }))
  }

  const onResizeDown = (e) => {
    const { w, h } = win
    drag(e, (dx, dy) => act('resize', id, { w: w + dx, h: h + dy }))
  }

  const box = win.max ? MAXIMIZED : { left: `${win.x}%`, top: `${win.y}%`, width: `${win.w}%`, height: `${win.h}%` }

  return (
    <m.div
      className={`app-window ${focused ? 'is-focused' : ''} ${dragging ? 'is-dragging' : ''} ${win.max ? 'is-max' : ''}`}
      style={{ ...box, zIndex: z }}
      onPointerDownCapture={() => act('focus', id)}
      initial={{ opacity: 0, scale: 0.4, y: '35%' }}
      animate={win.min ? { opacity: 0, scale: 0.2, y: '80%' } : { opacity: 1, scale: 1, y: '0%' }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ duration: 0.45, ease: EASE }}
      inert={win.min}
      role="dialog"
      aria-label={project.title}
    >
      <div className="window">
        <div className="window__bar" onPointerDown={onBarDown} onDoubleClick={() => act('maximize', id)}>
          <span className="window__dots">
            <button
              type="button"
              className="window__dot window__dot--close"
              onClick={() => act('close', id)}
              aria-label={`${WORK.windowClose} ${project.title}`}
            />
            <button
              type="button"
              className="window__dot window__dot--min"
              onClick={() => act('minimize', id)}
              aria-label={`${WORK.windowMinimize} ${project.title}`}
            />
            <button
              type="button"
              className="window__dot window__dot--max"
              onClick={() => act('maximize', id)}
              aria-label={`${WORK.windowMaximize} ${project.title}`}
              aria-pressed={win.max}
            />
          </span>
          <span className="window__address" aria-hidden="true">
            {windowAddress(project)}
          </span>
        </div>
        <div className="window__screen" style={{ background: project.tint }}>
          <ProjectDemo project={project} playing={!win.min} />
        </div>
      </div>
      {!win.max && (
        <span className="window__resize" onPointerDown={onResizeDown} aria-hidden="true" title={WORK.windowResize} />
      )}
    </m.div>
  )
}
