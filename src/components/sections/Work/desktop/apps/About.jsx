import { DESKTOP, SITE } from '@/content'
import { SystemIcon } from '../registry'

/** Informazioni su questo computer: chi lo usa e di cosa è fatto. */
export default function About() {
  return (
    <div className="about-pc">
      <span className="about-pc__icon">
        <SystemIcon name="about" />
      </span>
      <strong>{SITE.fullName}</strong>
      <small>{SITE.role}</small>
      <dl>
        {DESKTOP.settings.specs.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
