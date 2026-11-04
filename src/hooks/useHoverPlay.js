import { useEffect } from 'react'

/**
 * Avvia le animazioni di hover di link e pulsanti e le lascia arrivare in fondo:
 * la classe .is-hovering si aggiunge quando il puntatore entra e si toglie solo
 * a fine animazione, non quando esce. `duration` deve coprire l'animazione più
 * lunga definita in primitives.css.
 */
export function useHoverPlay(duration = 1100) {
  useEffect(() => {
    const timers = new WeakMap()
    const onOver = (e) => {
      const el = e.target.closest?.('a, button')
      if (!el || el.contains(e.relatedTarget) || timers.has(el)) return
      el.classList.add('is-hovering')
      timers.set(
        el,
        setTimeout(() => {
          el.classList.remove('is-hovering')
          timers.delete(el)
        }, duration),
      )
    }
    document.addEventListener('mouseover', onOver)
    return () => document.removeEventListener('mouseover', onOver)
  }, [duration])
}
