'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { HERO, SITE } from '@/content'
import { ArrowLink, MaskLines } from '@/components/primitives'
import { useImageReady } from '@/hooks/useImageReady'
import { EASE } from '@/lib/motion'
import Nav from './Nav'
import './Hero.css'

/**
 * Hero a tutto schermo: resta ferma mentre la pagina le scorre sopra.
 * Tutti gli ingressi aspettano che la foto sia scaricata.
 */
export default function Hero() {
  const ready = useImageReady(HERO.photo.src)
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
          initial={{ scale: 1.25, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: EASE }}
        />
      </motion.div>
      <div className="hero__grad" />
      <motion.div className="hero__shade" style={{ opacity: shade }} />

      <Nav play={ready} />

      <h1 className="sr-only">
        {SITE.fullName}, {SITE.role}
      </h1>

      <div className="hero__intro">
        <MaskLines
          as="p"
          className="hero__tagline"
          play={ready}
          delay={0.6}
          lines={[
            ...HERO.tagline,
            <span key="muted" className="dim">
              {HERO.taglineMuted}
            </span>,
          ]}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <ArrowLink href={HERO.cta.href}>{HERO.cta.label}</ArrowLink>
        </motion.div>
      </div>

      <div className="hero__bottom">
        <MaskLines
          as="div"
          className="hero__services"
          play={ready}
          delay={0.9}
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
