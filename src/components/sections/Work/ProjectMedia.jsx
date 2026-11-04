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

/** La demo registrata del progetto, che gira solo quando è a schermo; senza demo, il logo. */
export function ProjectDemo({ project }) {
  return project.video ? <DemoVideo project={project} /> : <ProjectLogo project={project} />
}

function DemoVideo({ project }) {
  const ref = useRef(null)
  useInViewPlayback(ref)
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
