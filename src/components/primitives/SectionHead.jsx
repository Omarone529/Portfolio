import { DrawLine } from './DrawLine'
import { MaskLines } from './MaskLines'

/** Intestazione di sezione: riga che si disegna, etichetta a sinistra e dettaglio a destra. */
export function SectionHead({ label, meta }) {
  return (
    <div className="section-head">
      <DrawLine className="draw-line--top" />
      <MaskLines as="p" lines={[label]} />
      <MaskLines as="p" className="section-head__meta" lines={[meta]} delay={0.1} />
    </div>
  )
}
