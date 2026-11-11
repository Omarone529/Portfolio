'use client'

import { m } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

// la finestra sale dal basso e il contenuto scende di altrettanto: l'immagine resta ferma e si scopre.
// `transform` scritto per intero è la forma che il browser anima da solo, senza passare da JavaScript
const curtain = { duration: DURATION.image, ease: EASE }

const clip = {
  hide: { transform: 'translateY(100%)' },
  show: { transform: 'translateY(0%)', transition: curtain },
}

const hold = {
  hide: { transform: 'translateY(-100%)' },
  show: { transform: 'translateY(0%)', transition: curtain },
}

const zoom = {
  hide: { transform: 'scale(1.25)' },
  show: { transform: 'scale(1)', transition: { duration: DURATION.image + 0.3, ease: EASE } },
}

/**
 * Immagine che si apre a tendina dal basso con un leggero zoom-out.
 * Con `tint` l'immagine è un logo: resta intera, centrata su quel colore.
 * `size` ([larghezza, altezza] del file) riserva lo spazio prima che arrivi.
 *
 * L'ingresso lo osserva il contenitore esterno, che resta fermo: la tendina
 * chiusa sta tutta sotto il proprio posto, quindi osservando lei l'apertura
 * partirebbe tardi per un'immagine alta.
 */
export function RevealImage({ src, alt, size, className = '', tint }) {
  return (
    <m.div className={`reveal-img ${className}`} initial="hide" whileInView="show" viewport={IN_VIEW}>
      <m.div
        className={`reveal-img__clip ${tint ? 'reveal-img--logo' : ''}`}
        style={tint ? { background: tint } : undefined}
        variants={clip}
      >
        <m.div className="reveal-img__hold" variants={hold}>
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
    </m.div>
  )
}
