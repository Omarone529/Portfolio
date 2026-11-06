import { useCallback, useReducer } from 'react'

/**
 * Posizione e misure delle finestre, in percentuale del display: così restano
 * proporzionate sia nel portatile sia a schermo intero. La prima finestra
 * occupa quasi tutto il desktop lasciando libere le icone, le altre si aprono un po' più piccole e
 * sfalsate, come in un sistema operativo vero.
 */
const FIRST = { x: 4, y: 9, w: 84, h: 70 }
const NEXT = { w: 76, h: 62 }
const CASCADE = 4

/**
 * In orizzontale le finestre restano tutte dentro il display, così i pallini
 * sono sempre raggiungibili; in basso ne resta a schermo almeno questa parte (in %).
 */
const KEEP = 12
const MIN_SIZE = { w: 30, h: 28 }

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

function placeNew(state, size) {
  if (state.order.length === 0) return { ...FIRST, ...size }
  const step = (state.order.length % 4) * CASCADE
  return { x: 10 + step, y: 11 + step, ...NEXT, ...size }
}

const newWindow = (state, size) => ({ ...placeNew(state, size), min: false, max: false, snap: null })

/** Tutte le finestre passate da `change`. */
const mapWindows = (windows, change) =>
  Object.fromEntries(Object.entries(windows).map(([id, win]) => [id, change(win)]))

export function reducer(state, action) {
  const { windows, order } = state
  const toFront = (id) => [...order.filter((o) => o !== id), id]
  const update = (id, patch) => ({ ...windows, [id]: { ...windows[id], ...patch } })

  switch (action.type) {
    case 'open': {
      const { id, size } = action
      // già aperta: torna in primo piano, e se era nel dock riappare
      if (windows[id]) return { windows: update(id, { min: false, parked: false }), order: toFront(id) }
      return { windows: { ...windows, [id]: newWindow(state, size) }, order: toFront(id) }
    }
    case 'restoreAt': {
      // trascinando una finestra ingrandita o affiancata torna alla sua misura, sotto il puntatore
      const win = windows[action.id]
      return {
        windows: update(action.id, { max: false, snap: null, x: clamp(action.x, 0, 100 - win.w), y: action.y }),
        order: toFront(action.id),
      }
    }
    case 'focus':
      return order.at(-1) === action.id ? state : { ...state, order: toFront(action.id) }
    case 'close': {
      const rest = { ...windows }
      delete rest[action.id]
      return { windows: rest, order: order.filter((o) => o !== action.id) }
    }
    case 'minimize':
      return { ...state, windows: update(action.id, { min: true }) }
    case 'maximize':
      return { windows: update(action.id, { max: !windows[action.id].max, snap: null }), order: toFront(action.id) }
    case 'snap':
      // x, y, w e h restano quelle di prima: togliendo l'aggancio la finestra torna com'era
      return { windows: update(action.id, { snap: action.side, max: false }), order: toFront(action.id) }
    case 'showDesktop':
      // `parked` ricorda quali ha nascosto lui, così le altre ridotte restano nel dock
      return { ...state, windows: mapWindows(windows, (w) => (w.min ? w : { ...w, min: true, parked: true })) }
    case 'restoreAll':
      return { ...state, windows: mapWindows(windows, (w) => (w.parked ? { ...w, min: false, parked: false } : w)) }
    case 'reset':
      return initialState(action.id)
    case 'move': {
      const win = windows[action.id]
      return {
        ...state,
        windows: update(action.id, {
          x: clamp(action.x, 0, 100 - win.w),
          y: clamp(action.y, action.top, 100 - KEEP),
        }),
      }
    }
    case 'resize': {
      // dai lati sinistro e superiore si muove anche l'origine, e il lato opposto resta fermo
      const win = windows[action.id]
      const right = win.x + win.w
      const bottom = win.y + win.h
      const w = action.x === undefined ? clamp(action.w ?? win.w, MIN_SIZE.w, 100 - win.x) : clamp(right - action.x, MIN_SIZE.w, right)
      const top = action.top ?? 0
      const h =
        action.y === undefined ? clamp(action.h ?? win.h, MIN_SIZE.h, 100 - win.y) : clamp(bottom - action.y, MIN_SIZE.h, bottom - top)
      return {
        ...state,
        windows: update(action.id, {
          w,
          h,
          x: action.x === undefined ? win.x : right - w,
          y: action.y === undefined ? win.y : bottom - h,
        }),
      }
    }
    default:
      return state
  }
}

/** Il desktop appena acceso: una sola finestra aperta, `id`. */
export const initialState = (id) => reducer({ windows: {}, order: [] }, { type: 'open', id })

/**
 * Lo stato del finto desktop: quali finestre sono aperte, dove stanno e in
 * che ordine (l'ultima di `order` è quella in primo piano). All'inizio è
 * aperta la finestra `initial`.
 */
export function useDesktop(initial) {
  const [state, dispatch] = useReducer(reducer, initial, initialState)
  const act = useCallback((type, id, extra) => dispatch({ type, id, ...extra }), [])

  // la finestra in primo piano è l'ultima non ridotta nel dock
  const focused = state.order.findLast((id) => !state.windows[id].min) ?? null

  return { ...state, focused, act }
}
