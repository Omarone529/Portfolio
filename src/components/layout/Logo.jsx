import { SITE } from '@/content'
import './logo.css'

/** Il logo: il mezzo cerchio e il nome. È sempre un link alla home, alto quanto un dito. */
export function Logo({ href = '/', className = '', style }) {
  return (
    <a href={href} aria-label={`${SITE.fullName}, home`} className={`logo ${className}`} style={style}>
      <span className="logo__mark" aria-hidden="true" />
      {SITE.fullName.toUpperCase()}
    </a>
  )
}
