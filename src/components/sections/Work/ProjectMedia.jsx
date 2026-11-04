import { useRef } from 'react'
import { useInViewPlayback } from '@/hooks/useInViewPlayback'

/** La demo registrata del progetto se esiste, altrimenti il suo logo. */
export default function ProjectMedia({ project }) {
  return project.video ? <DemoVideo project={project} /> : <Logo project={project} />
}

function DemoVideo({ project }) {
  const ref = useRef(null)
  useInViewPlayback(ref)
  return (
    <video
      ref={ref}
      src={project.video}
      poster={project.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={`Demo di ${project.title}`}
    />
  )
}

function Logo({ project }) {
  return (
    <img
      className="card__logo"
      src={project.logo}
      alt={project.title}
      loading="lazy"
      style={{ '--logo-scale': project.logoScale ?? 0.62 }}
    />
  )
}
