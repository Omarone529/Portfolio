/**
 * Ogni caricamento riparte dall'inizio della pagina: il browser non ripristina
 * lo scroll e un'eventuale #ancora viene tolta dall'indirizzo.
 */
export function resetScrollOnLoad() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
  window.scrollTo(0, 0)
}

/**
 * Posizione di scroll di un'ancora interna ("#id"), o null se non esiste.
 * Si misura il punto in cui l'elemento sta nel flusso della pagina, per questo
 * le ancore puntano sempre a elementi non fissi.
 */
export function anchorOffset(hash) {
  const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  return el ? el.getBoundingClientRect().top + window.scrollY : null
}
