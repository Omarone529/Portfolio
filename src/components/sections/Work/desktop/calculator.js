/** La logica della calcolatrice: un tasto alla volta, come quelle vere. */

export const CALC_START = { display: '0', stored: null, op: null, fresh: true }

const OPS = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => (b === 0 ? NaN : a / b),
}

/** Niente code di decimali da virgola mobile, né numeri troppo lunghi per il display. */
function format(value) {
  if (!Number.isFinite(value)) return 'Errore'
  return String(Number(value.toPrecision(10)))
}

const compute = ({ stored, op, display }) => OPS[op](stored, Number(display))

export function pressKey(state, key) {
  if (key === 'C') return CALC_START
  if (state.display === 'Errore') state = CALC_START

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
