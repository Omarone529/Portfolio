import { useCallback, useReducer } from 'react'

/**
 * Posizione e misure delle finestre, in percentuale del display: così restano
 * proporzionate sia nel portatile sia a schermo intero. La prima finestra
 * occupa quasi tutto il desktop, le altre si aprono un po' più piccole e
 * sfalsate, come in un sistema operativo vero.
 */
const FIRST = { x: 6, y: 9, w: 88, h: 70 }
const NEXT = { w: 76, h: 62 }
const CASCADE = 4

/**
 * In orizzontale le finestre restano tutte dentro il display, così i pallini
 * sono sempre raggiungibili; in basso ne resta a schermo almeno questa parte (in %).
 */
const KEEP = 12
const MIN_SIZE = { w: 30, h: 28 }

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

function placeNew(state) {
  if (state.order.length === 0) return FIRST
  const step = (state.order.length % 4) * CASCADE
  return { x: 10 + step, y: 11 + step, ...NEXT }
}

function reducer(state, action) {
  const { windows, order } = state
  const toFront = (id) => [...order.filter((o) => o !== id), id]
  const update = (id, patch) => ({ ...windows, [id]: { ...windows[id], ...patch } })

  switch (action.type) {
    case 'open': {
      const { id } = action
      // già aperta: torna in primo piano, e se era nel dock riappare
      if (windows[id]) return { windows: update(id, { min: false }), order: toFront(id) }
      return { windows: { ...windows, [id]: { ...placeNew(state), min: false, max: false } }, order: toFront(id) }
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
      return { windows: update(action.id, { max: !windows[action.id].max }), order: toFront(action.id) }
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
      const win = windows[action.id]
      return {
        ...state,
        windows: update(action.id, {
          w: clamp(action.w, MIN_SIZE.w, 100 - win.x),
          h: clamp(action.h, MIN_SIZE.h, 100 - win.y),
        }),
      }
    }
    default:
      return state
  }
}

/**
 * Lo stato del finto desktop: quali finestre sono aperte, dove stanno e in
 * che ordine (l'ultima di `order` è quella in primo piano). All'inizio è
 * aperta la finestra `initial`.
 */
export function useDesktop(initial) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    reducer({ windows: {}, order: [] }, { type: 'open', id: initial }),
  )
  const act = useCallback((type, id, extra) => dispatch({ type, id, ...extra }), [])

  // la finestra in primo piano è l'ultima non ridotta nel dock
  const focused = state.order.findLast((id) => !state.windows[id].min) ?? null

  return { ...state, focused, act }
}
