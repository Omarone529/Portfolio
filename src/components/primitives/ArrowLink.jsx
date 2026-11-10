import { RollText } from './RollText'

function Arrow() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
      <path d="M2 12 12 2M4.5 2H12v7.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

/** Link sottolineato con freccia ↗: in hover il testo rotola, la freccia si scambia e la riga lo attraversa. */
export function ArrowLink({ href, children, className = '', ...rest }) {
  return (
    <a href={href} className={`arrow-link ${className}`} {...rest}>
      <RollText>{children}</RollText>
      <span className="arrow-link__icon" aria-hidden="true">
        <Arrow />
        <Arrow />
      </span>
      <span className="arrow-link__line" />
    </a>
  )
}
