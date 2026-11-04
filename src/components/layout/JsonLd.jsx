import { serializeJsonLd } from '@/lib/seo'

/** Blocco di dati strutturati, reso nell'HTML statico. */
export function JsonLd({ data }) {
  // serializeJsonLd fa l'escape di tutto ciò che potrebbe chiudere il tag
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
