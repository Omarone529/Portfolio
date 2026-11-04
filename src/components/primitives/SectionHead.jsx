import { DrawLine } from './DrawLine'
import { MaskLines } from './MaskLines'

/**
 * Intestazione di sezione: riga che si disegna, etichetta a sinistra e, se c'è,
 * un dettaglio a destra. L'etichetta è il titolo h2 della sezione: è ciò che
 * motori e lettori di schermo usano per capire come è divisa la pagina.
 */
export function SectionHead({ label, meta }) {
  return (
    <div className="section-head">
      <DrawLine className="draw-line--top" />
      <MaskLines as="h2" className="section-head__label" lines={[label]} />
      {meta && <MaskLines as="p" className="section-head__meta" lines={[meta]} delay={0.1} />}
    </div>
  )
}
