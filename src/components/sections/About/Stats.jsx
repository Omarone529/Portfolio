import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { DrawLine } from '@/components/primitives'
import { useCountUp } from '@/hooks/useCountUp'
import { IN_VIEW } from '@/lib/motion'

/** Righe "etichetta / numero": il numero conta da zero (seguito dal suo `suffix`, es. "+") e la riga sotto si disegna. */
export default function Stats({ items }) {
  return (
    <dl className="stats">
      {items.map((item) => (
        <Stat key={item.label} {...item} />
      ))}
    </dl>
  )
}

function Stat({ label, value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, IN_VIEW)
  const count = useCountUp(value, inView)
  return (
    <div className="stat" ref={ref}>
      <dt>{label}</dt>
      <dd className="muted" aria-label={`${value}${suffix}`}>
        {count}
        {suffix}
      </dd>
      <DrawLine />
    </div>
  )
}
