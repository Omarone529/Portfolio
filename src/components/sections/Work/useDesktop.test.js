import { describe, expect, it } from 'vitest'
import { initialState, reducer } from './useDesktop'

const start = (id = 'a') => initialState(id)
const run = (state, ...actions) => actions.reduce(reducer, state)

describe('desktop windows', () => {
  it('opens the first window and focuses it', () => {
    const state = start()
    expect(state.order).toEqual(['a'])
    expect(state.windows.a.min).toBe(false)
  })

  it('cascades new windows instead of stacking them', () => {
    const state = run(start(), { type: 'open', id: 'b' }, { type: 'open', id: 'c' })
    expect(state.windows.c.x).toBeGreaterThan(state.windows.b.x)
  })

  it('closes a window and forgets it', () => {
    const state = run(start(), { type: 'close', id: 'a' })
    expect(state.windows.a).toBeUndefined()
    expect(state.order).toEqual([])
  })

  it('restores a minimized window to the front', () => {
    const state = run(start(), { type: 'open', id: 'b' }, { type: 'minimize', id: 'a' }, { type: 'open', id: 'a' })
    expect(state.windows.a.min).toBe(false)
    expect(state.order.at(-1)).toBe('a')
  })

  it('snaps to half of the desktop and remembers the size to come back to', () => {
    const before = start().windows.a
    const snapped = run(start(), { type: 'snap', id: 'a', side: 'left' })
    expect(snapped.windows.a.snap).toBe('left')
    const restored = run(snapped, { type: 'snap', id: 'a', side: null })
    expect(restored.windows.a.snap).toBeNull()
    expect(restored.windows.a.w).toBe(before.w)
  })

  it('clears the snap when a window is maximized', () => {
    const state = run(start(), { type: 'snap', id: 'a', side: 'right' }, { type: 'maximize', id: 'a' })
    expect(state.windows.a.snap).toBeNull()
    expect(state.windows.a.max).toBe(true)
  })

  it('resizes from the left edge keeping the right edge still', () => {
    const { x, w } = start().windows.a
    const state = run(start(), { type: 'resize', id: 'a', x: x + 10, w: w - 10 })
    expect(state.windows.a.x + state.windows.a.w).toBeCloseTo(x + w)
  })

  it('does not move the opposite edge when the minimum size is reached', () => {
    const { x, w } = start().windows.a
    const state = run(start(), { type: 'resize', id: 'a', x: x + 500, w: w - 500 })
    expect(state.windows.a.w).toBeGreaterThan(0)
    expect(state.windows.a.x + state.windows.a.w).toBeCloseTo(x + w)
  })

  it('minimizes everything and shows it back', () => {
    const hidden = run(start(), { type: 'open', id: 'b' }, { type: 'showDesktop' })
    expect(Object.values(hidden.windows).every((w) => w.min)).toBe(true)
    const shown = run(hidden, { type: 'restoreAll' })
    expect(Object.values(shown.windows).every((w) => !w.min)).toBe(true)
  })

  it('restores only the windows that show desktop had hidden', () => {
    const state = run(
      start(),
      { type: 'open', id: 'b' },
      { type: 'minimize', id: 'b' },
      { type: 'showDesktop' },
      { type: 'restoreAll' },
    )
    expect(state.windows.a.min).toBe(false)
    expect(state.windows.b.min).toBe(true)
  })

  it('goes back to one window on restart', () => {
    const state = run(start(), { type: 'open', id: 'b' }, { type: 'reset', id: 'a' })
    expect(state.order).toEqual(['a'])
  })
})
