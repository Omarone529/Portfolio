import { DrawLine } from './DrawLine'
import { MaskLines } from './MaskLines'

/**
 * Intestazione di sezione: riga che si disegna, etichetta a sinistra e, se c'è,
 * un dettaglio a destra. Di default l'etichetta è il titolo h2 della sezione: è
 * ciò che motori e lettori di schermo usano per capire come è divisa la pagina.
 * Dove la sezione ha già un suo titolo grande, `as="p"` la lascia semplice testo.
 */
export function SectionHead({ label, meta, as = 'h2' }) {
  return (
    <div className="section-head">
      <DrawLine className="draw-line--top" />
      <MaskLines as={as} className="section-head__label" lines={[label]} />
      {meta && <MaskLines as="p" className="section-head__meta" lines={[meta]} delay={0.1} />}
    </div>
  )
}
