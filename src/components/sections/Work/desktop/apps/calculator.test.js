import { describe, expect, it } from 'vitest'
import { CALC_START, displayText, pressKey } from './calculator'

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
  it('clears only the entry the first time', () => expect(type('8 + 5 C 2 =')).toBe('10'))
  it('clears everything the second time', () => expect(type('8 + 5 C C 2 =')).toBe('2'))
  it('deletes the last digit', () => expect(type('1 2 3 back')).toBe('12'))
  it('goes back to zero deleting the only digit', () => expect(type('7 back')).toBe('0'))
  it('does not delete a result', () => expect(type('2 + 3 = back')).toBe('5'))
  it('writes huge results in scientific notation', () => {
    expect(type('9 9 9 9 9 9 9 9 9 9 × 9 9 9 9 9 9 9 9 9 9 =')).toBe('1e+20')
  })
  it('writes tiny results in scientific notation', () => {
    expect(type('1 ÷ 3 = ÷ 1 0 0 0 0 0 0 0 0 0 =')).toBe('3.3333e-10')
  })
  it('keeps calculating from scientific notation', () => {
    expect(type('9 9 9 9 9 9 9 9 9 9 × 9 9 9 9 9 9 9 9 9 9 = ÷ 1 0 0 0 0 0 0 0 0 0 =')).toBe('1e+11')
  })
})

describe('displayText', () => {
  it('groups thousands the Italian way', () => expect(displayText('1234567')).toBe('1.234.567'))
  it('uses a decimal comma', () => expect(displayText('1234.5')).toBe('1.234,5'))
  it('keeps a trailing comma while typing', () => expect(displayText('12.')).toBe('12,'))
  it('keeps zeros typed after the comma', () => expect(displayText('1.50')).toBe('1,50'))
  it('keeps the sign', () => expect(displayText('-1000')).toBe('-1.000'))
  it('leaves errors alone', () => expect(displayText('Errore')).toBe('Errore'))
  it('writes the exponent compactly', () => expect(displayText('1e+20')).toBe('1e20'))
})
