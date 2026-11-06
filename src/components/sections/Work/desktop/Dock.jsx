'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { WORK } from '@/content'
import { AppIcon } from './apps'

/** Quanto cresce l'icona sotto il puntatore, e fin dove arriva l'effetto (in icone). */
const LENS = 0.32
const REACH = 2.4
/** Tempo con cui le icone inseguono il puntatore: più è basso, più sono scattanti. */
const SMOOTHING_MS = 42

/**
 * La lente del dock: col mouse sopra, le icone crescono davvero (non solo a
 * vista), quindi spingono le vicine e il ripiano si allarga. Le distanze si
 * misurano sulle posizioni a riposo: usare quelle ingrandite farebbe tremare le
 * icone, perché la misura cambierebbe insieme all'effetto. Ogni fotogramma
 * ogni icona si avvicina al suo obiettivo e --mag lo porta alla larghezza nel CSS.
 */
function useLens(enabled) {
  const reduced = useReducedMotion()
  const anim = useRef({ frame: 0, last: 0, rest: null, targets: [], sizes: [] })

  const step = useCallback((items) => {
    const state = anim.current
    const tick = (now) => {
      const blend = 1 - Math.exp(-(now - state.last) / SMOOTHING_MS)
      state.last = now
      let moving = false
      items.forEach((item, i) => {
        const size = state.sizes[i] + (state.targets[i] - state.sizes[i]) * blend
        const settled = Math.abs(size - state.targets[i]) < 0.001
        state.sizes[i] = settled ? state.targets[i] : size
        moving ||= !settled
        item.style.setProperty('--mag', state.sizes[i].toFixed(4))
      })
      state.frame = moving ? requestAnimationFrame(tick) : 0
    }
    if (!state.frame) {
      state.last = performance.now()
      state.frame = requestAnimationFrame(tick)
    }
  }, [])

  useEffect(() => () => cancelAnimationFrame(anim.current.frame), [])

  const itemsOf = (dock) => [...dock.querySelectorAll('.dock__item')]

  const onPointerMove = useCallback(
    (e) => {
      if (!enabled || reduced || e.pointerType !== 'mouse') return
      const dock = e.currentTarget
      const items = itemsOf(dock)
      const state = anim.current
      const idle = state.sizes.every((s) => s === 1)
      if (!state.rest || state.sizes.length !== items.length || idle) {
        // a riposo le posizioni sono quelle vere: restano il riferimento finché la lente è attiva
        state.rest = items.map((item) => item.offsetLeft + item.offsetWidth / 2 - dock.offsetWidth / 2)
        state.base = items[0].offsetWidth
        state.sizes = items.map(() => 1)
      }
      const box = dock.getBoundingClientRect()
      const pointer = e.clientX - (box.left + box.width / 2)
      state.targets = state.rest.map((center) => {
        const distance = Math.abs(pointer - center) / (state.base * REACH)
        return distance >= 1 ? 1 : 1 + (LENS * (Math.cos(Math.PI * distance) + 1)) / 2
      })
      step(items)
    },
    [enabled, reduced, step],
  )

  const onPointerLeave = useCallback(
    (e) => {
      const items = itemsOf(e.currentTarget)
      const state = anim.current
      if (state.sizes.length !== items.length) return
      state.targets = items.map(() => 1)
      step(items)
    },
    [step],
  )

  return { onPointerMove, onPointerLeave }
}

/**
 * Il dock: le app sul ripiano di vetro, il puntino sotto quelle aperte (il
 * Finder lo è sempre, come sul Mac) e il Cestino oltre la riga. L'icona rimbalza da sola, dentro un bottone che resta
 * fermo: il bersaglio del clic non scappa da sotto il puntatore.
 */
export default function Dock({ apps, windows, focused, launching, calling, lens, hidden, onOpen, onContextMenu }) {
  const handlers = useLens(lens)

  return (
    <nav className={`dock ${hidden ? 'is-autohide' : ''}`} aria-label={WORK.switcher} {...handlers}>
      {apps.map((app) => (
        <span key={app.id} className="dock__slot" data-trailing={app.id === 'trash' || undefined}>
          {app.id === 'trash' && <span className="dock__sep" aria-hidden="true" />}
          <button
            type="button"
            data-app={app.id}
            className={[
              'dock__item',
              windows[app.id] || app.id === 'finder' ? 'is-open' : '',
              launching === app.id ? 'is-launching' : '',
              calling === app.id ? 'is-calling' : '',
            ].join(' ')}
            onClick={() => onOpen(app.id)}
            onContextMenu={(e) => onContextMenu(e, app)}
            aria-pressed={app.id === focused}
            aria-label={app.title}
          >
            <span className="dock__icon">
              <AppIcon app={app} />
            </span>
            <span className="dock__label" aria-hidden="true">
              {app.title}
            </span>
          </button>
        </span>
      ))}
    </nav>
  )
}
