import type { CSSProperties } from "react";
import { projectTitle, type Project } from "@/content/projects";

interface ProjectLogoProps {
  project: Project;
  /** Eager above the fold, lazy in the grid further down the home page. */
  eager?: boolean;
}

/**
 * A logo centred in its tinted 16:9 frame, shared by the home card and the
 * case study header so a project reads the same size and shape in both.
 *
 * The frame carries --logo-scale, read by .card-media img in globals.css. It
 * is left unset when the project declares no scale of its own, so the default
 * there is the one that applies.
 */
export default function ProjectLogo({ project, eager = false }: ProjectLogoProps) {
  const frame = {
    background: project.tint,
    ...(project.image.scale !== undefined && {
      "--logo-scale": project.image.scale,
    }),
  } as CSSProperties;

  return (
    <div className="card-media" style={frame}>
      <img
        src={project.image.webp}
        alt={projectTitle(project)}
        width={project.image.width}
        height={project.image.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}
