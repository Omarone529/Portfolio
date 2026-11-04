import { MotionConfig } from 'framer-motion'
import { SECTION } from '@/content'
import { SmoothScrollProvider } from '@/providers/SmoothScroll'
import { useHoverPlay } from '@/hooks/useHoverPlay'
import Hero from '@/components/sections/Hero/Hero'
import About from '@/components/sections/About/About'
import Work from '@/components/sections/Work/Work'
import Services from '@/components/sections/Services/Services'
import Footer from '@/components/sections/Footer/Footer'

/**
 * La pagina: la hero resta ferma sotto, le sezioni le scorrono sopra e alla
 * fine scoprono il footer. Per aggiungere una sezione basta inserirla qui e
 * darle un id in `SECTION` (content/site.js).
 */
export default function App() {
  useHoverPlay()

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <main id={SECTION.top} className="page">
          <Hero />
          <div className="page__content">
            <About />
            <Work />
            <Services />
          </div>
        </main>
        <Footer edgeTone="dark" />
      </SmoothScrollProvider>
    </MotionConfig>
  )
}
