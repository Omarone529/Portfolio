'use client'

import { useEffect, useRef, useState } from 'react'
import { DESKTOP } from '@/content'
import { CALC_START, displayText, pressKey } from './calculator'
import './Calculator.css'

const CALC_KEYS = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '=']
const KEYBOARD = { '*': '×', '/': '÷', '-': '−', Enter: '=', ',': '.', Escape: 'C', c: 'C', Backspace: 'back' }
const PRESS_FLASH_MS = 120

const keyClass = (key) => {
  if (/[÷×−+=]/.test(key)) return 'is-op'
  if (/[C±%]/.test(key)) return 'is-fn'
  return key === '0' ? 'is-wide' : ''
}

export default function Calculator({ os, id }) {
  const [state, setState] = useState(CALC_START)
  const [flash, setFlash] = useState(null)
  const rootRef = useRef(null)
  const flashTimer = useRef(0)
  const inFront = os.focusedApp?.id === id
  const text = displayText(state.display)

  // in primo piano la tastiera è sua, senza dover cliccare dentro
  useEffect(() => {
    if (inFront) rootRef.current?.focus({ preventScroll: true })
  }, [inFront])
  useEffect(() => () => clearTimeout(flashTimer.current), [])

  const press = (key) => setState((s) => pressKey(s, key))

  const onKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const key = KEYBOARD[e.key] ?? e.key
    if (key !== 'back' && !CALC_KEYS.includes(key)) return
    e.preventDefault()
    press(key)
    // anche dalla tastiera il tasto a schermo si illumina
    setFlash(key)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), PRESS_FLASH_MS)
  }

  return (
    <div ref={rootRef} className="calculator" tabIndex={0} onKeyDown={onKeyDown}>
      <output aria-live="polite" style={{ '--chars': text.length }}>
        {text}
      </output>
      <div className="calculator__keys">
        {CALC_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            tabIndex={-1}
            aria-label={key === 'C' && state.fresh ? DESKTOP.calculator.clearAll : undefined}
            className={[
              keyClass(key),
              flash === key ? 'is-pressed' : '',
              state.op === key && state.fresh ? 'is-armed' : '',
            ].join(' ')}
            onClick={() => press(key)}
          >
            {key === '.' ? ',' : key === 'C' && state.fresh ? 'AC' : key}
          </button>
        ))}
      </div>
    </div>
  )
}
