import { motion } from 'framer-motion'
import { DURATION, EASE, IN_VIEW } from '@/lib/motion'

/**
 * Immagine che si apre a tendina dal basso con un leggero zoom-out.
 * Con `tint` l'immagine è un logo: resta intera, centrata su quel colore.
 */
export function RevealImage({ src, alt, className = '', tint }) {
  return (
    <motion.div
      className={`reveal-img ${tint ? 'reveal-img--logo' : ''} ${className}`}
      style={tint ? { background: tint } : undefined}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={IN_VIEW}
      transition={{ duration: DURATION.image, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={IN_VIEW}
        transition={{ duration: DURATION.image + 0.3, ease: EASE }}
      />
    </motion.div>
  )
}
