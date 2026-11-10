'use client'

import { useState } from 'react'
import { m } from 'framer-motion'
import { WORK } from '@/content'
import { EASE } from '@/lib/motion'
import { startPointerDrag } from './pointer'

/** Il dominio del sito pubblicato, da mostrare nella barra della finestra. */
const hostOf = (href) => new URL(href).hostname.replace(/^www\./, '')

/** Ingrandita, la finestra copre tutto il desktop sotto la barra dei menu; agganciata, la metà di un lato. */
const FILL = { top: 'var(--menubar)', height: 'calc(100% - var(--menubar))' }
const BOXES = {
  max: { ...FILL, left: 0, width: '100%' },
  left: { ...FILL, left: 0, width: '50%' },
  right: { ...FILL, left: '50%', width: '50%' },
}

/** I bordi e gli angoli da cui si ridimensiona: ogni lettera è un lato che si muove. */
const EDGES = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']

/** Quanti pixel dal bordo del display fanno scattare l'aggancio. */
const SNAP_ZONE = 14

function snapAt(e, screen) {
  const box = screen.getBoundingClientRect()
  if (e.clientX - box.left < SNAP_ZONE) return 'left'
  if (box.right - e.clientX < SNAP_ZONE) return 'right'
  if (e.clientY - box.top < SNAP_ZONE) return 'max'
  return null
}

/**
 * La finestra di un'app nel finto desktop. Si sposta trascinando la barra del
 * titolo (anche da ingrandita o affiancata: torna alla sua misura), si
 * ridimensiona da tutti i bordi e gli angoli, e si porta in primo piano al
 * clic. Portata contro un lato si affianca, contro l'alto si ingrandisce. I
 * tre pallini chiudono, riducono nel dock e ingrandiscono. Riaprirla da ridotta
 * passa dall'effetto genio (vedi genie.js). In Mission Control diventa una
 * miniatura: `overview` dice dove sta, il clic la sceglie.
 */
export default function AppWindow({
  app,
  win,
  z,
  focused,
  screenRef,
  act,
  onMinimize,
  onSnapHint,
  onContextMenu,
  overview,
  onPick,
  fill = false,
  children,
}) {
  const { id, project } = app
  // mentre si trascina le transizioni sono spente, così la finestra segue il puntatore senza ritardo
  const [dragging, setDragging] = useState(false)
  const drag = (e, onMove, onEnd) => {
    const done = () => {
      setDragging(false)
      onEnd?.()
    }
    if (startPointerDrag(e, screenRef.current, onMove, done)) setDragging(true)
  }

  const menubarPercent = () => {
    const screen = screenRef.current
    const bar = screen.querySelector('.desktop__menubar')
    return (bar.offsetHeight / screen.offsetHeight) * 100
  }

  const onBarDown = (e) => {
    // sul telefono la finestra riempie lo schermo e non si sposta: trascinare la barra non fa niente
    if (fill || e.target.closest('button, a')) return
    const top = menubarPercent()
    let { x, y } = win
    let detached = !(win.max || win.snap)
    if (!detached) {
      // da agganciata torna alla sua misura, tenendo il punto afferrato sotto il puntatore
      const screen = screenRef.current.getBoundingClientRect()
      const bar = e.currentTarget.getBoundingClientRect()
      const grabbed = (e.clientX - bar.left) / bar.width
      x = Math.min(100 - win.w, Math.max(0, ((e.clientX - screen.left) / screen.width) * 100 - grabbed * win.w))
      y = top
    }
    let hint = null
    drag(
      e,
      (dx, dy, moveEvent) => {
        // solo al primo movimento: un clic o un doppio clic sulla barra non la staccano
        if (!detached) {
          detached = true
          act('restoreAt', id, { x, y })
        }
        act('move', id, { x: x + dx, y: y + dy, top })
        hint = snapAt(moveEvent, screenRef.current)
        onSnapHint(hint)
      },
      () => {
        onSnapHint(null)
        if (hint === 'max') act('maximize', id)
        else if (hint) act('snap', id, { side: hint })
      },
    )
  }

  /** Il bordo afferrato dice cosa cambia: 'e' e 's' tirano, 'w' e 'n' muovono anche l'origine. */
  const onResizeDown = (e) => {
    const edge = e.currentTarget.dataset.edge
    const { x, y, w, h } = win
    const top = menubarPercent()
    drag(e, (dx, dy) =>
      act('resize', id, {
        ...(edge.includes('e') && { w: w + dx }),
        ...(edge.includes('s') && { h: h + dy }),
        ...(edge.includes('w') && { x: x + dx }),
        ...(edge.includes('n') && { y: y + dy, top }),
      }),
    )
  }

  const docked = win.max || fill ? 'max' : win.snap
  const box = docked ? BOXES[docked] : { left: `${win.x}%`, top: `${win.y}%`, width: `${win.w}%`, height: `${win.h}%` }
  const thumbnail = overview?.[id]
  const place = thumbnail ? { translate: `${thumbnail.x}px ${thumbnail.y}px`, scale: thumbnail.s } : null

  return (
    <m.div
      className={[
        'app-window',
        focused ? 'is-focused' : '',
        dragging ? 'is-dragging' : '',
        docked === 'max' ? 'is-max' : '',
        thumbnail ? 'is-thumbnail' : '',
      ].join(' ')}
      style={{ ...box, ...place, zIndex: z }}
      onPointerDownCapture={() => act('focus', id)}
      onClick={thumbnail ? () => onPick(id) : undefined}
      initial={{ opacity: 0, y: 8 }}
      // aprirla è un attimo; ridurla e riaprirla li anima l'effetto genio, qui la finestra sparisce e riappare di colpo
      animate={{ opacity: win.min ? 0 : 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.16 } }}
      transition={{ duration: 0.28, ease: EASE, opacity: { duration: win.min ? 0 : 0.14 } }}
      data-window={id}
      inert={win.min}
      role="dialog"
      aria-label={app.title}
    >
      <div className="window">
        <div
          className="window__bar"
          onPointerDown={onBarDown}
          onDoubleClick={(e) => !fill && !e.target.closest('button, a') && act('maximize', id)}
          onContextMenu={(e) => onContextMenu(e, id)}
        >
          <span className="window__dots">
            <button
              type="button"
              className="window__dot window__dot--close"
              onClick={() => act('close', id)}
              aria-label={`${WORK.windowClose} ${app.title}`}
            />
            <button
              type="button"
              className="window__dot window__dot--min"
              onClick={() => onMinimize(id)}
              aria-label={`${WORK.windowMinimize} ${app.title}`}
            />
            <button
              type="button"
              className="window__dot window__dot--max"
              onClick={() => act('maximize', id)}
              aria-label={`${WORK.windowMaximize} ${app.title}`}
              aria-pressed={win.max}
            />
          </span>
          {project?.href ? (
            <a className="window__address" href={project.href} target="_blank" rel="noreferrer">
              {hostOf(project.href)}
            </a>
          ) : (
            <span className="window__address" aria-hidden="true">
              {app.title}
            </span>
          )}
        </div>
        <div className="window__screen" style={project ? { background: project.tint } : undefined}>
          {children}
        </div>
      </div>
      {!docked &&
        EDGES.map((edge) => (
          <span
            key={edge}
            className={`window__edge window__edge--${edge}`}
            data-edge={edge}
            onPointerDown={onResizeDown}
            aria-hidden="true"
          />
        ))}
      {thumbnail && <span className="window__caption">{app.title}</span>}
    </m.div>
  )
}
