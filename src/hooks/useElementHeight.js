import { useLayoutEffect, useState } from 'react'

/** Altezza di un elemento, aggiornata a ogni ridimensionamento. */
export function useElementHeight(ref) {
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return height
}
