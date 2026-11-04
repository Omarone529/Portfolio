import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  ABOUT,
  COOKIES,
  FOOTER,
  HERO,
  NAV,
  PRIVACY,
  PROJECTS,
  SECTION,
  SEO,
  SERVICES,
  SERVICES_INTRO,
  SITE,
  WORK,
} from '@/content'

const publicFile = (path) => existsSync(join(process.cwd(), 'public', path))

/** Larghezza e altezza di un file webp, lette dall'intestazione (VP8, VP8L o VP8X). */
function webpSize(path) {
  const b = readFileSync(join(process.cwd(), 'public', path))
  const chunk = b.toString('ascii', 12, 16)
  if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21)
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)]
  }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
}

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

describe('image sizes', () => {
  // le misure dichiarate riservano lo spazio prima che il file arrivi: se non coincidono la pagina salta
  const images = [
    [HERO.photo.src, HERO.photo.size],
    [ABOUT.portrait.src, ABOUT.portrait.size],
    [SERVICES_INTRO.image.src, SERVICES_INTRO.image.size],
    ...SERVICES.map((s) => [s.image, s.imageSize]),
    ...PROJECTS.map((p) => [p.logo, p.logoSize]),
  ]

  it.each(images)('%s is declared at its real size', (src, size) => {
    expect(webpSize(src)).toEqual(size)
  })
})
