'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
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
  const { lock, unlock } = useSmoothScroll()

  const openMenu = () => {
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
        <AnimatePresence>{open && <Menu onClose={closeMenu} />}</AnimatePresence>
      </Portal>
    </header>
  )
}

function Menu({ onClose }) {
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
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: EASE }}
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
