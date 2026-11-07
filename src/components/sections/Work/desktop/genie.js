/**
 * L'effetto "genio" del Mac per ridurre una finestra nel dock.
 *
 * Il CSS può solo scalare o ritagliare un elemento, non piegarlo: così la
 * finestra viene prima ridisegnata su un canvas (barra, pallini, indirizzo e
 * il fotogramma corrente della demo), poi a ogni frame la copia è disegnata
 * riga per riga, ciascuna con la propria larghezza e altezza. Prima il fondo
 * della finestra si stringe verso l'icona e i lati si piegano a imbuto, poi
 * tutto scivola dentro l'icona.
 */

const DURATION = 560

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (t) => Math.min(1, Math.max(0, t))
const smooth = (t) => t * t * (3 - 2 * t)
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/** I colori dei tre pallini: nella copia restano accesi anche se la finestra non è in primo piano. */
const DOT_COLORS = { close: '#ff5f57', min: '#febc2e', max: '#28c840' }

/** Anteprime delle demo già scaricate, per copiare una finestra il cui video non ha ancora un fotogramma. */
const posters = new Map()

/** Scarica in anticipo le anteprime, così sono pronte quando serve copiarle. */
export function preloadPosters(urls) {
  for (const url of urls) {
    const href = new URL(url, window.location.href).href
    if (posters.has(href)) continue
    const img = new Image()
    img.decoding = 'async'
    img.src = href
    posters.set(href, img)
  }
}

/** Cosa disegnare per un media: il video se ha un fotogramma, altrimenti la sua anteprima. */
function drawableFor(media) {
  if (media.tagName !== 'VIDEO') return [media, media.naturalWidth, media.naturalHeight]
  if (media.readyState >= 2) return [media, media.videoWidth, media.videoHeight]
  const poster = posters.get(media.poster)
  return poster?.complete ? [poster, poster.naturalWidth, poster.naturalHeight] : [null, 0, 0]
}

/** Rettangolo di `el` relativo a `origin`, in pixel CSS. */
export function relativeRect(el, origin) {
  const r = el.getBoundingClientRect()
  return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height }
}

/** Dove disegnare un media dentro `box` rispettando object-fit (cover o contain). */
function fitRect(mediaW, mediaH, box, fit) {
  if (!mediaW || !mediaH) return box
  const scale = (fit === 'cover' ? Math.max : Math.min)(box.w / mediaW, box.h / mediaH)
  const w = mediaW * scale
  const h = mediaH * scale
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h }
}

function fill(ctx, color, { x, y, w, h }, radius = 0) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.fill()
}

/**
 * Copia la finestra `windowEl` su un canvas, leggendo misure e colori dal DOM
 * così che la copia coincida con l'originale. Restituisce il canvas e il
 * rettangolo della finestra rispetto al display.
 */
export function snapshotWindow(windowEl, screenEl) {
  const dpr = window.devicePixelRatio || 1
  const frame = windowEl.querySelector('.window')
  const origin = frame.getBoundingClientRect()
  const rect = relativeRect(frame, screenEl.getBoundingClientRect())
  const local = (el) => relativeRect(el, origin)

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(rect.w * dpr))
  canvas.height = Math.max(1, Math.round(rect.h * dpr))
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const frameStyle = getComputedStyle(frame)
  ctx.beginPath()
  ctx.roundRect(0, 0, rect.w, rect.h, parseFloat(frameStyle.borderTopLeftRadius) || 0)
  ctx.clip()
  fill(ctx, frameStyle.backgroundColor, { x: 0, y: 0, w: rect.w, h: rect.h })

  // barra del titolo: fondo, riga sotto, pallini e indirizzo
  const bar = frame.querySelector('.window__bar')
  const barBox = local(bar)
  fill(ctx, getComputedStyle(bar).borderBottomColor, { x: 0, y: barBox.h - 1, w: rect.w, h: 1 })
  frame.querySelectorAll('.window__dot').forEach((dot) => {
    const b = local(dot)
    const kind = Object.keys(DOT_COLORS).find((k) => dot.classList.contains(`window__dot--${k}`))
    fill(ctx, DOT_COLORS[kind], b, b.w / 2)
  })
  const address = frame.querySelector('.window__address')
  if (address) {
    const a = local(address)
    const style = getComputedStyle(address)
    fill(ctx, style.backgroundColor, a, parseFloat(style.borderTopLeftRadius) || 0)
    ctx.fillStyle = style.color
    ctx.font = `${style.fontSize} ${style.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(address.textContent, a.x + a.w / 2, a.y + a.h / 2, a.w)
  }

  // contenuto: il fondo del progetto, poi il fotogramma della demo o il logo
  const screen = frame.querySelector('.window__screen')
  const screenBox = local(screen)
  fill(ctx, getComputedStyle(screen).backgroundColor, screenBox)
  // solo la demo di un progetto: le app di sistema hanno immagini loro, che qui non c'entrano
  const media = screen.querySelector(':scope > video, :scope > img')
  if (media) {
    const box = local(media)
    const fit = getComputedStyle(media).objectFit
    const [source, mw, mh] = drawableFor(media)
    const target = fitRect(mw, mh, box, fit)
    ctx.save()
    ctx.beginPath()
    ctx.rect(screenBox.x, screenBox.y, screenBox.w, screenBox.h)
    ctx.clip()
    try {
      if (source) ctx.drawImage(source, target.x, target.y, target.w, target.h)
    } catch {
      // un video non ancora caricato non ha fotogrammi: resta il fondo del progetto
    }
    ctx.restore()
  }

  return { canvas, rect }
}

/**
 * Disegna la copia `source` (da `from`, la finestra) che entra in `to`
 * (l'icona del dock) all'avanzamento `t` (0 = finestra intera, 1 = nell'icona).
 */
function drawFrame(ctx, source, from, to, t) {
  // fase 1: il fondo scende verso l'icona e i lati si piegano; fase 2: tutto scivola dentro
  const squeeze = easeInOut(clamp01(t / 0.55))
  const slide = easeInOut(clamp01((t - 0.35) / 0.65))

  const top = lerp(from.y, to.y, slide)
  const bottom = lerp(from.y + from.h, to.y + to.h, squeeze)
  const height = Math.max(1, bottom - top)
  // la curva va dalla cima della finestra al fondo dell'icona: più una riga è in basso, più è stretta
  const span = Math.max(1, to.y + to.h - from.y)
  // una riga per pixel: con righe più alte i bordi dell'imbuto escono a scalini
  const step = 1

  for (let y = top; y < bottom; y += step) {
    const along = clamp01((y - from.y) / span)
    const pull = Math.max(squeeze * smooth(along), slide)
    const left = lerp(from.x, to.x, pull)
    const right = lerp(from.x + from.w, to.x + to.w, pull)
    const v = (y - top) / height
    const srcY = v * source.height
    const srcH = Math.max(1, (step / height) * source.height)
    ctx.drawImage(source, 0, srcY, source.width, srcH, left, y, Math.max(1, right - left), step + 0.5)
  }
}

/**
 * Esegue l'animazione su `canvas` (grande quanto il display). `reverse` la fa
 * al contrario, dall'icona alla finestra. Restituisce una funzione che la
 * interrompe; `onDone` arriva alla fine.
 */
export function playGenie(canvas, { source, from, to, reverse = false, onDone }) {
  const dpr = window.devicePixelRatio || 1
  const ctx = canvas.getContext('2d')
  let frame = 0
  let start = 0

  const tick = (now) => {
    if (!start) start = now
    const p = clamp01((now - start) / DURATION)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawFrame(ctx, source, from, to, reverse ? 1 - p : p)
    if (p < 1) frame = requestAnimationFrame(tick)
    else onDone?.()
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}
