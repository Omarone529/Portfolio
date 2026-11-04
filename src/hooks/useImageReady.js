import { useEffect, useState } from 'react'

/** true quando l'immagine è scaricata (o ha fallito), per far partire l'ingresso senza buchi. */
export function useImageReady(src) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const img = new Image()
    const done = () => setReady(true)
    img.onload = done
    img.onerror = done
    img.src = src
    if (img.complete) done()
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])
  return ready
}
