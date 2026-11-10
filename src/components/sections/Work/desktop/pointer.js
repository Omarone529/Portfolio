/**
 * Segue il puntatore dal pointerdown al pointerup e passa a `onMove` lo
 * spostamento in percentuale del display (più l'evento); alla fine chiama
 * `onEnd`. Il bersaglio cattura il puntatore, così il trascinamento continua
 * anche uscendo dall'elemento. Restituisce false se non è il tasto principale.
 */
export function startPointerDrag(event, screen, onMove, onEnd) {
  if (event.button !== 0) return false
  event.preventDefault()
  const target = event.currentTarget
  target.setPointerCapture(event.pointerId)
  const rect = screen.getBoundingClientRect()
  const { clientX, clientY } = event
  const move = (e) => onMove(((e.clientX - clientX) / rect.width) * 100, ((e.clientY - clientY) / rect.height) * 100, e)
  const end = () => {
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', end)
    target.removeEventListener('pointercancel', end)
    onEnd()
  }
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', end)
  target.addEventListener('pointercancel', end)
  return true
}
