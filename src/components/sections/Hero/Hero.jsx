'use client'

import { useRef, useSyncExternalStore } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
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
  const photoRef = useRef(null)
  const photoReady = useImageReady(photoRef)
  const { scrollY } = useScroll()
  const mediaScale = useTransform(scrollY, [0, 1000], [1, 1.12])
  const shade = useTransform(scrollY, [0, 900], [0, 0.55])
  // "su misura." resta tenue finché la pagina è ferma e si accende con i primi pixel di scroll
  const taglineLight = useTransform(scrollY, [0, 200], [0.5, 1])
  const native = useNativeScrollEffects()

  return (
    <section className={`hero ${native ? 'hero--native' : ''}`}>
      <m.div className="hero__media" style={native ? undefined : { scale: mediaScale }}>
        <picture>
          {/* su schermi larghi il taglio 16:9 lascia aria intorno alla figura; in verticale resta il 2:3 */}
          <source
            media="(min-aspect-ratio: 1/1)"
            srcSet={HERO.photo.wide.src}
            width={HERO.photo.wide.size[0]}
            height={HERO.photo.wide.size[1]}
          />
          <m.img
            ref={photoRef}
            src={HERO.photo.src}
            alt={HERO.photo.alt}
            width={HERO.photo.size[0]}
            height={HERO.photo.size[1]}
            fetchPriority="high"
            // visibile da subito (solo lo zoom aspetta): è l'elemento più grande, e il browser misura
            // il caricamento (LCP) da quando compare, non da quando finisce di animarsi
            initial={{ scale: 1.25 }}
            animate={photoReady ? { scale: 1 } : {}}
            transition={{ duration: 2, ease: EASE }}
          />
        </picture>
      </m.div>
      <div className="hero__grad" />
      <m.div className="hero__shade" style={native ? undefined : { opacity: shade }} />

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
            <m.span key="muted" className="dim" style={native ? undefined : { opacity: taglineLight }}>
              {HERO.taglineMuted}
            </m.span>,
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
          lines={HERO.services}
        />
      </div>
    </section>
  )
}

const subscribeNothing = () => () => {}

/**
 * Se il browser sa legare un'animazione CSS allo scroll. In quel caso zoom e
 * velo li fa lui (vedi .hero--native), sullo stesso canale dello scroll: su un
 * telefono restano attaccati al dito, mentre calcolati in JavaScript arrivano
 * un fotogramma dopo e scattano. Nel prerender vale false, come nei browser che
 * non lo supportano, dove resta useScroll.
 */
function useNativeScrollEffects() {
  return useSyncExternalStore(
    subscribeNothing,
    () => CSS.supports('animation-timeline: scroll()'),
    () => false,
  )
}
