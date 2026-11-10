'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { NAV, SECTION, anchor } from '@/content'
import { Logo } from '@/components/layout/Logo'
import { Portal } from '@/components/layout/Portal'
import { RollText } from '@/components/primitives'
import { EASE } from '@/lib/motion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

/** Ritardo dell'ingresso dall'alto, che è solo CSS (vedi .intro-fade in primitives.css). */
const introDelay = (seconds) => ({ '--delay': `${seconds}s` })

/** Barra in alto della hero: logo, link e, sul telefono, il menu a tutto schermo. */
export default function Nav() {
  const [open, setOpen] = useState(false)
  // da dove parte il cerchio che apre il menu: il punto toccato, o il centro del bottone da tastiera
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const { lock, unlock } = useSmoothScroll()

  const openMenu = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const fromPointer = e.clientX > 0 || e.clientY > 0
    setOrigin({
      x: fromPointer ? e.clientX : box.left + box.width / 2,
      y: fromPointer ? e.clientY : box.top + box.height / 2,
    })
    lock()
    setOpen(true)
  }
  // lo sblocco avviene subito, prima che il clic su un link faccia partire lo scroll verso la sezione
  const closeMenu = useCallback(() => {
    unlock()
    setOpen(false)
  }, [unlock])

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

      <button type="button" className="menu-btn" onClick={openMenu} aria-expanded={open}>
        Menu
      </button>

      {/* fuori dalla hero, che è sotto al resto della pagina: il menu deve coprire tutto */}
      <Portal>
        <AnimatePresence>{open && <Menu origin={origin} onClose={closeMenu} />}</AnimatePresence>
      </Portal>
    </header>
  )
}

/** Il cerchio chiuso nel punto d'origine, e aperto abbastanza da coprire l'angolo più lontano dello schermo. */
function circles({ x, y }) {
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  return {
    closed: `circle(0px at ${x}px ${y}px)`,
    open: `circle(${Math.ceil(radius)}px at ${x}px ${y}px)`,
  }
}

/** Il menu a tutto schermo: si apre a cerchio dal punto toccato e ci si richiude. */
function Menu({ origin, onClose }) {
  const [shape] = useState(() => circles(origin))
  const reduced = useReducedMotion()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <m.div
      className="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: shape.closed }}
      animate={{ clipPath: shape.open }}
      exit={{ clipPath: shape.closed }}
      transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
    >
      <button type="button" className="menu__close" onClick={onClose} autoFocus>
        Chiudi
      </button>
      {NAV.map((item) => (
        // il clic chiude il menu; lo scroll verso la sezione lo gestisce SmoothScrollProvider
        <a key={item.href} href={item.href} className="menu__link" onClick={onClose}>
          {item.label}
        </a>
      ))}
    </m.div>
  )
}
