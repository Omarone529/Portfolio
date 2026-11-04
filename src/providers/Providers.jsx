'use client'

import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { useHoverPlay } from '@/hooks/useHoverPlay'
import { resetScrollOnLoad } from '@/lib/scroll'
import { SmoothScrollProvider } from './SmoothScroll'

/**
 * Tutto ciò che vive solo nel browser e vale per l'intera pagina: animazioni
 * ridotte se richieste dal sistema, scroll fluido, hover che si completano e
 * ripartenza dalla hero a ogni caricamento.
 */
export default function Providers({ children }) {
  useHoverPlay()
  useEffect(resetScrollOnLoad, [])

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </MotionConfig>
  )
}
