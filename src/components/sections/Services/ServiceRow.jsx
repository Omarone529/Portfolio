import { DrawLine, FadeUp, MaskLines, RevealImage } from '@/components/primitives'
import { pad2 } from '@/lib/format'

/** Una riga dei servizi: numero grande, immagine, titolo e descrizione. */
export default function ServiceRow({ service, index }) {
  return (
    <li className="service">
      <MaskLines as="p" className="service__num" lines={[pad2(index + 1)]} />
      <RevealImage
        className="service__img"
        src={service.image}
        size={service.imageSize}
        alt={service.title}
        tint={service.tint}
      />
      <div className="service__body">
        <MaskLines as="h3" className="h3" lines={[service.title]} />
        <FadeUp className="service__text" delay={0.15}>
          <p>{service.kicker}</p>
          <p className="muted">{service.text}</p>
        </FadeUp>
      </div>
      <DrawLine />
    </li>
  )
}
