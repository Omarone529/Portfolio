/** Curva e preset condivisi da tutte le animazioni, così il movimento resta coerente. */

export const EASE = [0.22, 1, 0.36, 1]

/**
 * Le animazioni d'ingresso partono ogni volta che l'elemento entra nello
 * schermo, da sotto o da sopra, e tornano allo stato iniziale quando ne esce.
 * Il margine fa partire l'ingresso quando l'elemento supera il 10% inferiore.
 * Un elemento saltato da una passata veloce resta nascosto solo finché è fuori
 * schermo: rientrando si apre.
 */
export const IN_VIEW = { once: false, margin: '0px 0px -10% 0px' }

export const DURATION = {
  line: 1.2,
  text: 1,
  image: 1.3,
}
