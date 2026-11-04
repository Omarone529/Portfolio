'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV, SECTION, SITE, anchor } from '@/content'
import { Portal } from '@/components/layout/Portal'
import { RollText } from '@/components/primitives'
import { EASE } from '@/lib/motion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

const fadeDown = (play, delay) => ({
  initial: { opacity: 0, y: -10 },
  animate: play ? { opacity: 1, y: 0 } : {},
  transition: { duration: 1, ease: EASE, delay },
})

/** Barra in alto della hero: logo, link numerati e, sotto gli 860px, il menu a tutto schermo. */
export default function Nav({ play }) {
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
      <motion.a
        href={anchor(SECTION.top)}
        className="logo"
        aria-label={`${SITE.fullName}, home`}
        {...fadeDown(play, 0.3)}
      >
        <span className="logo__mark" aria-hidden="true" />
        {SITE.fullName.toUpperCase()}
      </motion.a>

      <nav className="nav" aria-label="Principale">
        {NAV.map((item, i) => (
          <motion.a key={item.href} href={item.href} className="nav__link" {...fadeDown(play, 0.35 + i * 0.06)}>
            <RollText>{item.label}</RollText>
          </motion.a>
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
    <motion.div
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
    </motion.div>
  )
}
