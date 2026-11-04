import { describe, expect, it } from 'vitest'
import { PROFILES, PROJECTS, SERVICES, SITE } from '@/content'
import { llmsTxt } from './llms'

describe('llmsTxt', () => {
  const text = llmsTxt()

  it('opens with the name as title and a quoted summary, as llmstxt.org asks', () => {
    const [title, , summary] = text.split('\n')
    expect(title).toBe(`# ${SITE.fullName}`)
    expect(summary.startsWith('> ')).toBe(true)
  })

  it('names every service, project and profile the site shows', () => {
    for (const s of SERVICES) expect(text).toContain(s.title)
    for (const p of PROJECTS) expect(text).toContain(p.title)
    for (const p of PROFILES) expect(text).toContain(p.href)
  })

  it('links published projects to their live site', () => {
    for (const p of PROJECTS.filter((p) => p.href)) expect(text).toContain(`[${p.title}](${p.href})`)
  })
})
