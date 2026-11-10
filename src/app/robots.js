import { absoluteUrl } from '@/lib/seo'

// l'export statico scrive robots.txt solo se la route è dichiarata statica
export const dynamic = 'force-static'

/**
 * Crawler degli assistenti AI, autorizzati per nome: il sito deve poter essere
 * letto e citato nelle loro risposte (GEO). Per escluderne uno basta toglierlo
 * da qui e aggiungerlo con `disallow: '/'`.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
]

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
