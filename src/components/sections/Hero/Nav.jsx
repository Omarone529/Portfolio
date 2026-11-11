'use client'

import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { NAV, SECTION, anchor } from '@/content'
import { Logo } from '@/components/layout/Logo'
import { Portal } from '@/components/layout/Portal'
import { RollText } from '@/components/primitives'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

/** Ritardo dell'ingresso dall'alto, che è solo CSS (vedi .intro-fade in primitives.css). */
const introDelay = (seconds) => ({ '--delay': `${seconds}s` })

/** Quanto dura la chiusura del menu: ritardo più durata del cerchio in .menu.is-closing (Hero.css). */
const CLOSE_MS = 880

/** Barra in alto della hero: logo, link e, sul telefono, il menu a tutto schermo. */
export default function Nav() {
  // null = chiuso; altrimenti il cerchio da cui si è aperto e se si sta richiudendo
  const [menu, setMenu] = useState(null)
  const reduced = useReducedMotion()
  const { lock, unlock } = useSmoothScroll()

  // il cerchio parte dal punto toccato, o dal centro del bottone se aperto da tastiera
  const openMenu = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const fromPointer = e.clientX > 0 || e.clientY > 0
    const x = fromPointer ? e.clientX : box.left + box.width / 2
    const y = fromPointer ? e.clientY : box.top + box.height / 2
    lock()
    setMenu({ circle: circleFrom(x, y), closing: false })
  }
  // lo sblocco avviene subito, prima che il clic su un link faccia partire lo scroll verso la sezione
  const closeMenu = useCallback(() => {
    unlock()
    setMenu((current) => (current && !reduced ? { ...current, closing: true } : null))
  }, [unlock, reduced])
  const removeMenu = useCallback(() => setMenu(null), [])

  return (
    <header className="nav-bar">
      <Logo href={anchor(SECTION.top)} className="intro-fade" style={introDelay(0)} />

      <nav className="nav" aria-label="Principale">
        {NAV.map((item, i) => (
          <a key={item.href} href={item.href} className="nav__link intro-fade" style={introDelay(0.05 + i * 0.05)}>
            <RollText>{item.label}</RollText>
          </a>
        ))}
      </nav>

      <button type="button" className="menu-btn" onClick={openMenu} aria-expanded={Boolean(menu) && !menu.closing}>
        Menu
      </button>

      {/* fuori dalla hero, che è sotto al resto della pagina: il menu deve coprire tutto */}
      <Portal>{menu && <Menu {...menu} onClose={closeMenu} onClosed={removeMenu} />}</Portal>
    </header>
  )
}

/** Il cerchio che apre il menu: il suo centro e il raggio che arriva all'angolo più lontano dello schermo. */
function circleFrom(x, y) {
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  return { '--x': `${x}px`, '--y': `${y}px`, '--r': `${Math.ceil(radius)}px` }
}

/**
 * Il menu a tutto schermo: si apre a cerchio dal punto toccato e ci si richiude.
 * Le animazioni sono solo CSS (vedi .menu in Hero.css); qui si aspetta soltanto
 * che la chiusura finisca prima di toglierlo dalla pagina.
 */
function Menu({ circle, closing, onClose, onClosed }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(onClosed, CLOSE_MS)
    return () => clearTimeout(timer)
  }, [closing, onClosed])

  return (
    <div
      className={`menu ${closing ? 'is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      style={{ ...circle, '--n': NAV.length }}
    >
      <span className="menu__bg" aria-hidden="true" />
      <button type="button" className="menu__close" onClick={onClose} autoFocus>
        Chiudi
      </button>
      {NAV.map((item, i) => (
        // il clic chiude il menu; lo scroll verso la sezione lo gestisce SmoothScrollProvider
        <a key={item.href} href={item.href} className="menu__link" style={{ '--i': i + 1 }} onClick={onClose}>
          {item.label}
        </a>
      ))}
    </div>
  )
}
