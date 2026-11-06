/**
 * Mission Control: dispone le finestre in una griglia che sta tutta nel
 * display, senza ingrandirle mai. Riceve i rettangoli delle finestre (id, x,
 * y, w, h in pixel), le misure dell'area libera e restituisce per ogni id lo
 * spostamento e la scala da applicare.
 */
export function overviewLayout(rects, area, gap = 16) {
  if (rects.length === 0) return {}
  const cols = Math.ceil(Math.sqrt(rects.length))
  const rows = Math.ceil(rects.length / cols)
  const cellW = (area.w - gap * (cols + 1)) / cols
  const cellH = (area.h - gap * (rows + 1)) / rows

  return Object.fromEntries(
    rects.map((rect, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const s = Math.min(1, cellW / rect.w, cellH / rect.h)
      const cx = area.x + gap + col * (cellW + gap) + cellW / 2
      const cy = area.y + gap + row * (cellH + gap) + cellH / 2
      return [rect.id, { x: cx - (rect.w * s) / 2 - rect.x, y: cy - (rect.h * s) / 2 - rect.y, s }]
    }),
  )
}
