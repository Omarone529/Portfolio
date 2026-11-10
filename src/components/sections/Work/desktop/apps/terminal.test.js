import { describe, expect, it } from 'vitest'
import { DESKTOP, PROJECTS, SITE } from '@/content'
import { runCommand } from './terminal'

describe('terminal', () => {
  it('lists every project', () => {
    expect(runCommand('ls').lines).toEqual(PROJECTS.map((p) => p.title))
  })

  it('finds a project ignoring case and spaces', () => {
    expect(runCommand('cat mbmmeccanica').lines[0]).toContain('MBM Meccanica')
  })

  it('opens the window of a project with a demo', () => {
    expect(runCommand('open synapsi').open).toBe('Synapsi')
  })

  it('never links a project without a public site', () => {
    expect(runCommand('open apexgps').url).toBeUndefined()
  })

  it('shows the email in contact', () => {
    expect(runCommand('contact').lines).toContain(SITE.email)
  })

  it('reports unknown commands', () => {
    expect(runCommand('rm -rf /').lines[0]).toContain(DESKTOP.terminal.unknown)
  })

  it('asks to clear and to exit', () => {
    expect(runCommand('clear').clear).toBe(true)
    expect(runCommand('exit').exit).toBe(true)
  })

  it('does nothing on an empty line', () => {
    expect(runCommand('   ').lines).toEqual([])
  })
})
