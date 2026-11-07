/** La logica della calcolatrice: un tasto alla volta, come quelle vere. */

export const CALC_START = { display: '0', stored: null, op: null, fresh: true }

const OPS = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? NaN : a / b),
}

/** Oltre queste soglie il numero non sta nel display: passa alla notazione scientifica. */
const MAX_PLAIN = 1e10
const MIN_PLAIN = 1e-6

/** Niente code di decimali da virgola mobile, né numeri troppo lunghi per il display. */
function format(value) {
  if (!Number.isFinite(value)) return 'Errore'
  const size = Math.abs(value)
  if (size >= MAX_PLAIN || (size !== 0 && size < MIN_PLAIN)) return value.toExponential(4).replace(/\.?0+e/, 'e')
  return String(Number(value.toPrecision(10)))
}

/** Il numero come si legge in italiano: punti per le migliaia e virgola per i decimali. */
export function displayText(display) {
  if (display === 'Errore') return display
  if (display.includes('e')) return display.replace('.', ',').replace('e+', 'e')
  const [whole, decimals] = display.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+$)/g, '.')
  return decimals === undefined ? grouped : `${grouped},${decimals}`
}

const compute = ({ stored, op, display }) => OPS[op](stored, Number(display))

export function pressKey(state, key) {
  if (key === 'C') {
    // la prima volta cancella solo il numero in corso, la seconda tutto
    return state.fresh ? CALC_START : { ...state, display: '0', fresh: true }
  }
  if (state.display === 'Errore') state = CALC_START
  if (key === 'back') {
    if (state.fresh) return state
    const display = state.display.slice(0, -1)
    return { ...state, display: display === '' || display === '-' ? '0' : display }
  }

  if (/^\d$/.test(key)) {
    if (state.fresh) return { ...state, display: key, fresh: false }
    if (state.display.replace(/\D/g, '').length >= 10) return state
    return { ...state, display: state.display === '0' ? key : state.display + key }
  }
  if (key === '.') {
    if (state.fresh) return { ...state, display: '0.', fresh: false }
    return state.display.includes('.') ? state : { ...state, display: `${state.display}.` }
  }
  if (key === '±') return { ...state, display: format(-Number(state.display)) }
  if (key === '%') return { ...state, display: format(Number(state.display) / 100) }
  if (key === '=') {
    if (state.op === null) return { ...state, fresh: true }
    return { display: format(compute(state)), stored: null, op: null, fresh: true }
  }
  if (key in OPS) {
    // un secondo operatore subito dopo il primo lo sostituisce soltanto
    if (state.op === null || state.fresh) {
      return { ...state, stored: state.op === null ? Number(state.display) : state.stored, op: key, fresh: true }
    }
    const result = format(compute(state))
    return { display: result, stored: Number(result), op: key, fresh: true }
  }
  return state
}
