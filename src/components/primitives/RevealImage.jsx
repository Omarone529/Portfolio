'use client'

import { m } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

const clip = {
  hide: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: DURATION.image, ease: EASE } },
}

const zoom = {
  hide: { scale: 1.25 },
  show: { scale: 1, transition: { duration: DURATION.image + 0.3, ease: EASE } },
}

/**
 * Immagine che si apre a tendina dal basso con un leggero zoom-out.
 * Con `tint` l'immagine è un logo: resta intera, centrata su quel colore.
 * `size` ([larghezza, altezza] del file) riserva lo spazio prima che arrivi.
 *
 * L'ingresso lo osserva il contenitore esterno, che non ha la tendina: il
 * browser considera visibile solo la parte non ritagliata, quindi osservando
 * l'elemento chiuso l'apertura partirebbe solo quando il suo bordo inferiore
 * entra nello schermo, tardi per un'immagine alta.
 */
export function RevealImage({ src, alt, size, className = '', tint }) {
  return (
    <m.div className={`reveal-img ${className}`} initial="hide" whileInView="show" viewport={IN_VIEW}>
      <m.div
        className={`reveal-img__clip ${tint ? 'reveal-img--logo' : ''}`}
        style={tint ? { background: tint } : undefined}
        variants={clip}
      >
        <m.img
          src={src}
          alt={alt}
          width={size?.[0]}
          height={size?.[1]}
          loading="lazy"
          decoding="async"
          variants={zoom}
        />
      </m.div>
    </m.div>
  )
}
