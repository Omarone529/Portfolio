import { SITE } from '@/content'
import './logo.css'

const { src, size } = SITE.logo
/** Il file fa da maschera: il colore è quello del testo intorno, chiaro sulla hero e scuro sulle pagine chiare. */
const MARK = { aspectRatio: `${size[0]} / ${size[1]}`, maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }

/** Il logo: il monogramma, sempre un link alla home, alto quanto un dito. */
export function Logo({ href = '/', className = '', style }) {
  return (
    <a href={href} aria-label={`${SITE.fullName}, home`} className={`logo ${className}`} style={style}>
      <span className="logo__mark" style={MARK} aria-hidden="true" />
    </a>
  )
}
