'use client'

import { createPortal } from 'react-dom'
import { useIsClient } from '@/hooks/useIsClient'

/**
 * Rende i figli direttamente in <body>, fuori dai livelli della pagina.
 * Durante il prerender non c'è un body a cui agganciarsi, quindi non rende nulla.
 */
export function Portal({ children }) {
  const isClient = useIsClient()
  return isClient ? createPortal(children, document.body) : null
}
