'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { HERO, SITE } from '@/content'
import { IntroLines } from '@/components/primitives'
import { useImageReady } from '@/hooks/useImageReady'
import { useScrollTimeline } from '@/hooks/useScrollTimeline'
import { useTouchOnly } from '@/hooks/useTouchOnly'
import Nav from './Nav'
import './Hero.css'

/** Quanto sale il bordo obliquo rispetto alla larghezza: tan(7°), come --edge-rise in tokens.css. */
const EDGE_RISE = 0.123

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
  const native = useScrollTimeline()
  // sui telefoni la foto resta ferma: lì lo scroll col dito va per conto suo e uno zoom che lo insegue
  // arriva sempre un attimo dopo, cioè la foto scatta. Il velo che la scurisce resta, perché non sposta nulla
  const touchOnly = useTouchOnly()
  // coperta dalla pagina non si vede più: spenta, il telefono non deve più comporre foto e veli sotto il resto
  const heroRef = useRef(null)
  const covered = useTransform(scrollY, (y) => {
    const hero = heroRef.current
    return hero && y > hero.offsetHeight + hero.offsetWidth * EDGE_RISE ? 'hidden' : 'visible'
  })

  return (
    <m.section
      ref={heroRef}
      className={`hero ${native ? 'hero--native' : ''}`}
      style={native ? undefined : { visibility: covered }}
    >
      <m.div className="hero__media" style={native || touchOnly ? undefined : { scale: mediaScale }}>
        <picture>
          {/* su schermi larghi il taglio 16:9 lascia aria intorno alla figura; in verticale resta il 2:3 */}
          <source
            media="(min-aspect-ratio: 1/1)"
            srcSet={HERO.photo.wide.src}
            width={HERO.photo.wide.size[0]}
            height={HERO.photo.wide.size[1]}
          />
          <img
            ref={photoRef}
            // visibile da subito, ingrandita: è l'elemento più grande, e il browser misura il caricamento (LCP)
            // da quando compare. Lo zoom all'indietro parte quando è scaricata ed è un'animazione CSS
            // (.is-ready in Hero.css), che il telefono muove senza passare da JavaScript
            className={photoReady ? 'is-ready' : undefined}
            src={HERO.photo.src}
            alt={HERO.photo.alt}
            width={HERO.photo.size[0]}
            height={HERO.photo.size[1]}
            fetchPriority="high"
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
      </div>

      <div className="hero__bottom">
        <IntroLines as="div" className="hero__services" delay={0.35} stagger={0.06} lines={HERO.services} />
      </div>
    </m.section>
  )
}
