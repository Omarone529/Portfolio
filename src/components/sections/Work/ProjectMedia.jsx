import { useRef } from 'react'
import { DEMO_SIZE } from '@/content'
import { useInViewPlayback } from '@/hooks/useInViewPlayback'

/** Il logo del progetto, centrato sul suo fondo (il fondo lo dà il contenitore). */
export function ProjectLogo({ project }) {
  return (
    <img
      className="project-logo"
      src={project.logo}
      alt={project.title}
      width={project.logoSize[0]}
      height={project.logoSize[1]}
      loading="lazy"
      decoding="async"
      style={{ '--logo-scale': project.logoScale ?? 0.62 }}
    />
  )
}

/**
 * La demo registrata del progetto, che gira solo quando è a schermo; senza
 * demo, il logo. Con `playing` a false resta ferma (per esempio in una
 * finestra ridotta nel dock).
 */
export function ProjectDemo({ project, playing = true }) {
  return project.video ? <DemoVideo project={project} playing={playing} /> : <ProjectLogo project={project} />
}

function DemoVideo({ project, playing }) {
  const ref = useRef(null)
  useInViewPlayback(ref, playing)
  return (
    <video
      ref={ref}
      className="project-video"
      src={project.video}
      poster={project.poster}
      width={DEMO_SIZE[0]}
      height={DEMO_SIZE[1]}
      muted
      loop
      playsInline
      preload="none"
      aria-label={`Demo di ${project.title}`}
    />
  )
}
