'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FOOTER, NAV, SECTION, SITE } from '@/content'
import { ArrowLink, DrawLine, EdgeWedge, MaskLines, RollText } from '@/components/primitives'
import { useElementHeight } from '@/hooks/useElementHeight'
import { useViewportHeight } from '@/hooks/useViewportHeight'
import './Footer.css'

/**
 * Footer "scoperto": sta fisso sotto la pagina e uno spazio vuoto alto quanto
 * lui (lo slot) lo lascia apparire mentre l'ultima sezione scorre via. Il bordo
 * obliquo di quella sezione si raddrizza esattamente a fine pagina, quando il
 * footer è tutto visibile. Se il footer è più alto dello schermo (telefoni)
 * resta nel flusso normale, altrimenti la sua parte alta non si vedrebbe mai.
 *
 * `edgeTone` è il tono della sezione che lo precede.
 */
export default function Footer({ edgeTone }) {
  const slotRef = useRef(null)
  const footerRef = useRef(null)
  const height = useElementHeight(footerRef)
  const viewportHeight = useViewportHeight()
  const reveal = height > 0 && height <= viewportHeight

  const { scrollYProgress } = useScroll({ target: slotRef, offset: ['start end', 'end end'] })
  // dritto un po' prima della fine: uno scroll che si ferma a una frazione di pixel non lascia una scheggia
  const edgeScale = useTransform(scrollYProgress, [0, 0.9], [1, 0])
  const innerY = useTransform(scrollYProgress, [0, 1], ['-30%', '0%'])

  return (
    <div id={SECTION.contact} ref={slotRef} className="footer-slot" style={reveal ? { height } : undefined}>
      {reveal && <EdgeWedge tone={edgeTone} side="bottom" scale={edgeScale} />}

      <footer ref={footerRef} className={`footer tone-dark ${reveal ? 'footer--reveal' : ''}`}>
        <motion.div className="footer__inner" style={reveal ? { y: innerY } : undefined}>
          <span className="footer__rule" />
          <div className="footer__grid">
            <div>
              <MaskLines as="h2" className="footer__title muted" lines={[FOOTER.title]} />
              <a href={`mailto:${SITE.email}`} className="footer__mail">
                <RollText>{SITE.email}</RollText>
              </a>
              <ArrowLink href={`mailto:${SITE.email}`}>{FOOTER.cta}</ArrowLink>
            </div>

            <nav className="footer__nav" aria-label="Footer">
              {NAV.map((item, i) => (
                <a key={item.href} href={item.href} className="footer__link">
                  <RollText>{item.label}</RollText>
                  <DrawLine delay={i * 0.06} />
                </a>
              ))}
            </nav>
          </div>

          <span className="footer__rule" />
          <div className="footer__bottom">
            <p className="footer__name" aria-hidden="true">
              {SITE.name}
            </p>
            <div className="footer__legal">
              <p>{FOOTER.legal}</p>
              <p className="muted">{FOOTER.credit}</p>
              <ul className="footer__policies">
                {FOOTER.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      <RollText>{link.label}</RollText>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        <div className="footer__glow" aria-hidden="true" />
      </footer>
    </div>
  )
}
