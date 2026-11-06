'use client'

import { useRef, useState } from 'react'
import { DESKTOP } from '@/content'
import { SystemIcon } from './apps'
import { startPointerDrag } from './pointer'

/** Le icone della scrivania, in colonna a destra come su un computer appena acceso. */
const ICONS = [
  { id: 'projects', app: 'finder', icon: 'folder', title: DESKTOP.icons.projects, x: 90, y: 9 },
  { id: 'readme', app: 'notes', icon: 'document', title: DESKTOP.icons.readme, x: 90, y: 25 },
]

/** Sotto questo spostamento (in % del display) è un clic, non un trascinamento. */
const DRAG_THRESHOLD = 0.4

/**
 * La scrivania: icone da selezionare, spostare e aprire col doppio clic (con
 * un tocco su telefono), rettangolo di selezione trascinando sul vuoto e tasto
 * destro. Per rimetterle in ordine basta ricrearla con una nuova `key`.
 */
export default function DesktopIcons({ screenRef, onOpen, onContextMenu, onClearFocus }) {
  const [places, setPlaces] = useState(() => Object.fromEntries(ICONS.map((i) => [i.id, { x: i.x, y: i.y }])))
  const [selected, setSelected] = useState([])
  const [band, setBand] = useState(null)
  const surfaceRef = useRef(null)

  const onSurfaceDown = (e) => {
    if (e.target !== e.currentTarget) return
    setSelected([])
    onClearFocus()
    const box = screenRef.current.getBoundingClientRect()
    const x0 = e.clientX - box.left
    const y0 = e.clientY - box.top
    startPointerDrag(
      e,
      screenRef.current,
      (_dx, _dy, moveEvent) => {
        const x1 = moveEvent.clientX - box.left
        const y1 = moveEvent.clientY - box.top
        const next = { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) }
        setBand(next)
        const hit = [...surfaceRef.current.querySelectorAll('[data-icon]')].filter((el) => {
          const r = el.getBoundingClientRect()
          const [l, t] = [r.left - box.left, r.top - box.top]
          return l < next.x + next.w && l + r.width > next.x && t < next.y + next.h && t + r.height > next.y
        })
        setSelected(hit.map((el) => el.dataset.icon))
      },
      () => setBand(null),
    )
  }

  const onIconDown = (e, icon) => {
    e.stopPropagation()
    setSelected([icon.id])
    const start = places[icon.id]
    let moved = false
    startPointerDrag(
      e,
      screenRef.current,
      (dx, dy) => {
        moved ||= Math.hypot(dx, dy) > DRAG_THRESHOLD
        if (!moved) return
        setPlaces((p) => ({
          ...p,
          [icon.id]: { x: Math.min(92, Math.max(0, start.x + dx)), y: Math.min(80, Math.max(6, start.y + dy)) },
        }))
      },
      () => {
        if (!moved && e.pointerType === 'touch') onOpen(icon.app)
      },
    )
  }

  return (
    <div ref={surfaceRef} className="desktop__surface" onPointerDown={onSurfaceDown} onContextMenu={onContextMenu}>
      {ICONS.map((icon) => (
        <button
          key={icon.id}
          type="button"
          data-icon={icon.id}
          className={`desktop-icon ${selected.includes(icon.id) ? 'is-selected' : ''}`}
          style={{ left: `min(${places[icon.id].x}%, calc(100% - 46px))`, top: `${places[icon.id].y}%` }}
          onPointerDown={(e) => onIconDown(e, icon)}
          onDoubleClick={() => onOpen(icon.app)}
          onKeyDown={(e) => e.key === 'Enter' && onOpen(icon.app)}
        >
          <SystemIcon name={icon.icon} />
          <span>{icon.title}</span>
        </button>
      ))}
      {band && (
        <span
          className="desktop__band"
          style={{ left: band.x, top: band.y, width: band.w, height: band.h }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
