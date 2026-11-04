import { ABOUT, STACK } from '@/content'

/** Fascia infinita delle tecnologie: la lista è ripetuta due volte per chiudere il giro senza salti. */
export default function Marquee() {
  return (
    <div className="marquee" role="region" aria-label={ABOUT.stackLabel}>
      <ul className="marquee__track">
        {[...STACK, ...STACK].map((tech, i) => (
          <li key={i} className="marquee__item" aria-hidden={i >= STACK.length || undefined}>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  )
}
