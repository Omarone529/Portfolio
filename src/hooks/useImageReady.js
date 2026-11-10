import { useEffect, useState } from 'react'

/**
 * true quando l'immagine nel ref è scaricata (o ha fallito), per far partire l'ingresso senza buchi.
 * Guarda l'elemento e non un indirizzo: dentro un <picture> è il browser a scegliere quale file scaricare.
 */
export function useImageReady(ref) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const img = ref.current
    if (!img) return
    const done = () => setReady(true)
    // può aver finito prima che React si agganciasse alla pagina
    if (img.complete) {
      done()
      return
    }
    img.addEventListener('load', done)
    img.addEventListener('error', done)
    return () => {
      img.removeEventListener('load', done)
      img.removeEventListener('error', done)
    }
  }, [ref])
  return ready
}
