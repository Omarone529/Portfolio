import { TopEdge } from '@/components/primitives'
import './layout.css'

/** Sezione della pagina con il suo tono di colore e, se richiesto, il bordo superiore obliquo. */
export function Section({ id, tone = 'light', edge = false, className = '', children }) {
  return (
    <section id={id} className={`section tone-${tone} ${className}`}>
      {edge && <TopEdge tone={tone} />}
      {children}
    </section>
  )
}

/** Colonna centrata con i margini laterali del sito. */
export function Container({ className = '', children }) {
  return <div className={`container ${className}`}>{children}</div>
}
