import { ABOUT, PROFILES, PROJECTS, SEO, SERVICES, SITE, WORK } from '@/content'
import { absoluteUrl } from './seo'

/**
 * Il sito riassunto in Markdown secondo la convenzione llms.txt (llmstxt.org):
 * un titolo, una sintesi citabile, poi sezioni di elenchi con link. Gli
 * assistenti AI lo leggono al posto della pagina animata, e siccome nasce
 * dagli stessi contenuti dice esattamente ciò che dice il sito.
 */
export function llmsTxt() {
  const stats = ABOUT.results.stats.map((s) => `${s.label}: ${s.value}${s.suffix ?? ''}`).join(', ')
  return [
    `# ${SITE.fullName}`,
    '',
    `> ${SEO.description}`,
    '',
    `${SEO.summary} ${stats}.`,
    '',
    '## Come lavora',
    '',
    ...ABOUT.rows.map((row) => `- ${row.label}: ${row.text}`),
    '',
    '## Servizi',
    '',
    ...SERVICES.map((s) => `- ${s.title} (${s.kicker}): ${s.text}`),
    '',
    `## ${WORK.head}`,
    '',
    ...PROJECTS.map((p) =>
      p.href ? `- [${p.title}](${p.href}): ${p.tag}. ${p.description}` : `- ${p.title}: ${p.tag}. ${p.description}`,
    ),
    '',
    '## Contatti',
    '',
    `- [Sito](${absoluteUrl('/')})`,
    `- [Email](mailto:${SITE.email})`,
    ...PROFILES.map((p) => `- [${p.label}](${p.href})`),
    '',
  ].join('\n')
}
