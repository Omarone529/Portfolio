import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { COOKIES, FOOTER, NAV, PRIVACY, PROJECTS, SECTION, SEO, SERVICES, SITE, WORK } from '@/content'

const publicFile = (path) => existsSync(join(process.cwd(), 'public', path))

describe('navigation', () => {
  it('points only at sections that exist', () => {
    const ids = Object.values(SECTION)
    for (const item of NAV) expect(ids).toContain(item.href.slice(1))
  })

  it('uses unique section ids', () => {
    const ids = Object.values(SECTION)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('projects', () => {
  it('have unique titles', () => {
    const titles = PROJECTS.map((p) => p.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it.each(PROJECTS)('$title has the fields the stack and the panel need', (project) => {
    expect(project.tag).toBeTruthy()
    expect(project.description).toBeTruthy()
    expect(project.tint).toMatch(/^#[0-9a-f]{6}$/i)
    expect(publicFile(project.logo)).toBe(true)
  })

  it.each(PROJECTS.filter((p) => p.video))('$title ships its demo and poster', (project) => {
    expect(publicFile(project.video)).toBe(true)
    expect(publicFile(project.poster)).toBe(true)
  })

  it('opens external sites over https only', () => {
    for (const p of PROJECTS.filter((p) => p.href)) expect(p.href).toMatch(/^https:\/\//)
  })

  it('features no more projects than exist', () => {
    expect(WORK.featured).toBeLessThanOrEqual(PROJECTS.length)
  })
})

describe('services', () => {
  it.each(SERVICES)('$title has a picture on disk', (service) => {
    expect(publicFile(service.image)).toBe(true)
  })
})

describe('search copy', () => {
  it('fits the lengths search results show without cutting', () => {
    expect(SEO.title.length).toBeLessThanOrEqual(60)
    expect(SEO.description.length).toBeLessThanOrEqual(160)
  })
})

describe('legal documents', () => {
  it.each([PRIVACY, COOKIES])('$title has a path, an ISO date and complete sections', (doc) => {
    expect(doc.path).toMatch(/^\/[a-z-]+\/$/)
    expect(Number.isNaN(Date.parse(doc.updated))).toBe(false)
    for (const section of doc.sections) {
      expect(section.heading).toBeTruthy()
      expect(section.body.length).toBeGreaterThan(0)
    }
  })

  it('give a way to reach the controller', () => {
    expect(JSON.stringify(PRIVACY)).toContain(`mailto:${SITE.email}`)
    expect(JSON.stringify(COOKIES)).toContain(`mailto:${SITE.email}`)
  })

  it('are linked from the footer', () => {
    const hrefs = FOOTER.links.map((l) => l.href)
    expect(hrefs).toEqual(expect.arrayContaining([PRIVACY.path, COOKIES.path]))
  })
})
