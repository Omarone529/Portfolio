'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { HERO, SITE } from '@/content'
import { ArrowLink, IntroLines } from '@/components/primitives'
import { useImageReady } from '@/hooks/useImageReady'
import { EASE } from '@/lib/motion'
import Nav from './Nav'
import './Hero.css'

/**
 * Hero a tutto schermo: resta ferma mentre la pagina le scorre sopra.
 * I testi entrano con animazioni solo CSS, al primo disegno: sono loro che il
 * browser misura come contenuto principale (LCP), perché una foto a tutto
 * schermo viene trattata come sfondo. Solo lo zoom della foto aspetta che sia scaricata.
 */
export default function Hero() {
  const photoReady = useImageReady(HERO.photo.src)
  const { scrollY } = useScroll()
  const mediaScale = useTransform(scrollY, [0, 1000], [1, 1.12])
  const shade = useTransform(scrollY, [0, 900], [0, 0.55])

  return (
    <section className="hero">
      <motion.div className="hero__media" style={{ scale: mediaScale }}>
        <motion.img
          src={HERO.photo.src}
          alt={HERO.photo.alt}
          fetchPriority="high"
          // visibile da subito (solo lo zoom aspetta): è l'elemento più grande, e il browser misura
          // il caricamento (LCP) da quando compare, non da quando finisce di animarsi
          initial={{ scale: 1.25 }}
          animate={photoReady ? { scale: 1 } : {}}
          transition={{ duration: 2, ease: EASE }}
        />
      </motion.div>
      <div className="hero__grad" />
      <motion.div className="hero__shade" style={{ opacity: shade }} />

      <Nav />

      <h1 className="sr-only">
        {SITE.fullName}, {SITE.role}
      </h1>

      <div className="hero__intro">
        <IntroLines
          as="p"
          className="hero__tagline"
          delay={0.2}
          lines={[
            ...HERO.tagline,
            <span key="muted" className="dim">
              {HERO.taglineMuted}
            </span>,
          ]}
        />
        <div className="intro-fade" style={{ '--delay': '0.45s' }}>
          <ArrowLink href={HERO.cta.href}>{HERO.cta.label}</ArrowLink>
        </div>
      </div>

      <div className="hero__bottom">
        <IntroLines
          as="div"
          className="hero__services"
          delay={0.35}
          stagger={0.06}
          lines={HERO.services.map((service, i) =>
            i === 0 ? (
              <span key={service}>
                <span className="dim">01/</span> {service}
              </span>
            ) : (
              service
            ),
          )}
        />
      </div>
    </section>
  )
}
