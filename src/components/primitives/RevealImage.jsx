'use client'

import { m } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

/**
 * Immagine che si apre a tendina dal basso con un leggero zoom-out.
 * Con `tint` l'immagine è un logo: resta intera, centrata su quel colore.
 * `size` ([larghezza, altezza] del file) riserva lo spazio prima che arrivi.
 */
export function RevealImage({ src, alt, size, className = '', tint }) {
  return (
    <m.div
      className={`reveal-img ${tint ? 'reveal-img--logo' : ''} ${className}`}
      style={tint ? { background: tint } : undefined}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={IN_VIEW}
      transition={{ duration: DURATION.image, ease: EASE }}
    >
      <m.img
        src={src}
        alt={alt}
        width={size?.[0]}
        height={size?.[1]}
        loading="lazy"
        decoding="async"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={IN_VIEW}
        transition={{ duration: DURATION.image + 0.3, ease: EASE }}
      />
    </m.div>
  )
}
