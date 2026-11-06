import { describe, expect, it } from 'vitest'
import { overviewLayout } from './overview'

const area = { x: 0, y: 20, w: 800, h: 460 }
const win = (id, w = 600, h = 400) => ({ id, x: 40, y: 40, w, h })

describe('overviewLayout', () => {
  it('returns nothing without windows', () => {
    expect(overviewLayout([], area)).toEqual({})
  })

  it('never enlarges a small window', () => {
    expect(overviewLayout([win('a', 100, 100)], area).a.s).toBe(1)
  })

  it('keeps every window inside the area', () => {
    const rects = ['a', 'b', 'c', 'd', 'e'].map((id) => win(id))
    const layout = overviewLayout(rects, area)
    for (const r of rects) {
      const { x, y, s } = layout[r.id]
      expect(r.x + x).toBeGreaterThanOrEqual(area.x)
      expect(r.y + y).toBeGreaterThanOrEqual(area.y)
      expect(r.x + x + r.w * s).toBeLessThanOrEqual(area.x + area.w)
      expect(r.y + y + r.h * s).toBeLessThanOrEqual(area.y + area.h)
    }
  })

  it('gives each window its own cell', () => {
    const layout = overviewLayout([win('a'), win('b')], area)
    expect(layout.a.x).not.toBe(layout.b.x)
  })
})
