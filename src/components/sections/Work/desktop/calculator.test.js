import { describe, expect, it } from 'vitest'
import { CALC_START, pressKey } from './calculator'

const type = (keys) => keys.split(' ').reduce(pressKey, CALC_START).display

describe('calculator', () => {
  it('adds', () => expect(type('1 2 + 3 =')).toBe('15'))
  it('chains operations left to right', () => expect(type('2 + 3 × 4 =')).toBe('20'))
  it('hides floating point noise', () => expect(type('0 . 1 + 0 . 2 =')).toBe('0.3'))
  it('shows an error dividing by zero', () => expect(type('5 ÷ 0 =')).toBe('Errore'))
  it('starts over after an error', () => expect(type('5 ÷ 0 = 7')).toBe('7'))
  it('replaces an operator pressed twice', () => expect(type('6 + × 2 =')).toBe('12'))
  it('accepts one decimal point', () => expect(type('1 . 5 . 2')).toBe('1.52'))
  it('flips the sign', () => expect(type('8 ±')).toBe('-8'))
  it('turns a number into a percentage', () => expect(type('5 0 %')).toBe('0.5'))
  it('clears', () => expect(type('9 C')).toBe('0'))
})
