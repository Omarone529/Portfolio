'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Un menu a tendina dentro il display, usato dalla barra dei menu e dal tasto
 * destro. `items` è un elenco di { label, onSelect, disabled, checked, hint }
 * e di 'sep' per le righe di separazione. Resta sempre dentro il display, si
 * usa con le frecce e si chiude con Esc o cliccando fuori.
 */
export default function PopMenu({ x, y, items, screenRef, onClose }) {
  const ref = useRef(null)
  const [shift, setShift] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
    const menu = ref.current.getBoundingClientRect()
    const screen = screenRef.current.getBoundingClientRect()
    setShift({
      x: Math.min(0, screen.right - 6 - menu.right),
      y: Math.min(0, screen.bottom - 6 - menu.bottom),
    })
    ref.current.focus({ preventScroll: true })
  }, [screenRef])

  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current?.contains(e.target) && !e.target.closest?.('[data-menu-trigger]')) onClose()
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [onClose])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      return onClose()
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const buttons = [...ref.current.querySelectorAll('button:not(:disabled)')]
    const step = e.key === 'ArrowDown' ? 1 : -1
    const next = (buttons.indexOf(document.activeElement) + step + buttons.length) % buttons.length
    buttons[next === -1 ? 0 : next]?.focus()
  }

  return (
    <div
      ref={ref}
      className="pop-menu"
      role="menu"
      tabIndex={-1}
      style={{ left: x + shift.x, top: y + shift.y }}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.filter(Boolean).map((item, i) =>
        item === 'sep' ? (
          <hr key={i} />
        ) : (
          <button
            key={item.label}
            type="button"
            role={item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
            aria-checked={item.checked}
            disabled={item.disabled}
            onClick={() => {
              onClose()
              item.onSelect?.()
            }}
          >
            <span className="pop-menu__check">{item.checked ? '✓' : ''}</span>
            {item.label}
            {item.hint && <kbd>{item.hint}</kbd>}
          </button>
        ),
      )}
    </div>
  )
}
