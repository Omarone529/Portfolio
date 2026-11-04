/** Curva e preset condivisi da tutte le animazioni, così il movimento resta coerente. */

export const EASE = [0.22, 1, 0.36, 1]

/**
 * Un'animazione d'ingresso parte una sola volta, quando l'elemento sale oltre il
 * 10% inferiore dello schermo. Il margine superiore enorme fa contare come
 * "visto" anche ciò che è già sopra lo schermo: una passata veloce col pollice,
 * o un salto a un'ancora, possono portare un elemento da sotto a sopra senza
 * nessun fotogramma in mezzo, e senza questo resterebbe nascosto per sempre.
 */
export const IN_VIEW = { once: true, margin: '10000px 0px -10% 0px' }

export const DURATION = {
  line: 1.2,
  text: 1,
  image: 1.3,
}
