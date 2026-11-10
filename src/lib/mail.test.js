import { describe, expect, it } from 'vitest'
import { gmailCompose } from './mail'

describe('gmailCompose', () => {
  it('opens a new Gmail message to the address', () => {
    const url = new URL(gmailCompose('omar@example.com'))
    expect(url.origin).toBe('https://mail.google.com')
    expect(url.searchParams.get('view')).toBe('cm')
    expect(url.searchParams.get('to')).toBe('omar@example.com')
  })

  it('fills subject and body when given', () => {
    const url = new URL(gmailCompose('omar@example.com', { subject: 'Ciao & grazie', body: 'Riga 1\nRiga 2' }))
    expect(url.searchParams.get('su')).toBe('Ciao & grazie')
    expect(url.searchParams.get('body')).toBe('Riga 1\nRiga 2')
  })

  it('leaves out empty fields', () => {
    const url = new URL(gmailCompose('omar@example.com', { subject: '', body: '' }))
    expect(url.searchParams.has('su')).toBe(false)
    expect(url.searchParams.has('body')).toBe(false)
  })
})
