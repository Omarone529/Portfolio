import { describe, expect, it } from 'vitest'
import { PROFILES, PROJECTS, SERVICES, SITE } from '@/content'
import { absoluteUrl, homeJsonLd, serializeJsonLd } from './seo'

describe('absoluteUrl', () => {
  it('prefixes paths with the site domain', () => {
    expect(absoluteUrl('/')).toBe(`${SITE.url}/`)
    expect(absoluteUrl('/images/hero.webp')).toBe(`${SITE.url}/images/hero.webp`)
  })

  it('keeps fragments, used as structured data ids', () => {
    expect(absoluteUrl('/#person')).toBe(`${SITE.url}/#person`)
  })
})

describe('serializeJsonLd', () => {
  it('cannot close the script tag it is written into', () => {
    const out = serializeJsonLd({ text: '</script><script>alert(1)</script>' })
    expect(out).not.toMatch(/[<>]/)
  })

  it('still parses back to the same data', () => {
    const data = { a: '<b> & </b>', line: 'x y' }
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data)
  })
})

describe('homeJsonLd', () => {
  const graph = homeJsonLd()['@graph']
  const byType = (type) => graph.find((node) => node['@type'] === type)

  it('describes the person, the site, the profile page and the work', () => {
    expect(graph.map((n) => n['@type'])).toEqual(['Person', 'WebSite', 'ProfilePage', 'ItemList'])
  })

  it('links every node to the same person by @id', () => {
    const personId = byType('Person')['@id']
    expect(byType('WebSite').publisher['@id']).toBe(personId)
    expect(byType('ProfilePage').mainEntity['@id']).toBe(personId)
    for (const item of byType('ItemList').itemListElement) {
      expect(item.item.creator['@id']).toBe(personId)
    }
  })

  it('lists every project and every service offered', () => {
    expect(byType('ItemList').itemListElement).toHaveLength(PROJECTS.length)
    expect(byType('Person').makesOffer).toHaveLength(SERVICES.length)
  })

  it('names the public profiles as the same person', () => {
    expect(byType('Person').sameAs).toEqual(PROFILES.map((p) => p.href))
  })

  it('gives the site logo to search engines', () => {
    expect(byType('Person').brand.logo).toBe(absoluteUrl(SITE.logo.src))
  })

  it('uses absolute https urls only', () => {
    const urls = JSON.stringify(graph).match(/"(?:url|image|@id)":"([^"]+)"/g) ?? []
    for (const entry of urls) expect(entry).toMatch(/"https:\/\//)
  })
})
