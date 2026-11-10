import { ArrowLink } from '@/components/primitives'
import { NOT_FOUND } from '@/content'
import './not-found.css'

// il layout dichiara index, follow per tutto il sito: qui va ribaltato, altrimenti i due tag si contraddicono
export const metadata = {
  title: NOT_FOUND.title,
  robots: { index: false, follow: true },
}

/** Pagina 404: l'export la scrive come 404.html, che gli hosting statici servono per ogni indirizzo inesistente. */
export default function NotFound() {
  return (
    <main className="not-found tone-dark">
      <p className="muted">404</p>
      <h1 className="h2">{NOT_FOUND.title}</h1>
      <ArrowLink href="/">{NOT_FOUND.cta}</ArrowLink>
    </main>
  )
}
