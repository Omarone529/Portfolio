import Link from "next/link";
import { projectPath, type Lang } from "@/content/site";
import { type Project } from "@/content/projects";
import ProjectLogo from "./ProjectLogo";
import { ArrowRight } from "../Icons";

interface ProjectCardProps {
  project: Project;
  lang: Lang;
}

/**
 * The card from adhamdannaway.com, rebuilt: white, 12px corners, a thin frame
 * around an 8px-rounded image, a soft shadow that deepens on hover, and an
 * arrow in the top-right that only appears once you are on it.
 *
 * Every card is the same height: the grid stretches them to the tallest row
 * (auto-rows-fr in HomePage plus height: 100% on .card), and the blurb is
 * clamped to two lines so the tallest cannot exceed that budget.
 */
export default function ProjectCard({ project, lang }: ProjectCardProps) {
  return (
    <Link href={projectPath(lang, project.slug)} className="card group">
      <ProjectLogo project={project} />

      <div className="card-body">
        <ArrowRight className="card-arrow" />
        <h3 className="text-[1.125rem] leading-snug font-semibold">
          <span style={{ color: project.accentLead }}>{project.titleParts[0]}</span>
          <span style={{ color: project.accent }}>{project.titleParts[1]}</span>
        </h3>
        <p className="mt-1 text-[1rem] leading-snug text-[var(--color-muted)]">
          {project.type[lang]}
        </p>
        <p
          className={
            "mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed " +
            "text-[var(--color-muted)]"
          }
        >
          {project.core[lang]}
        </p>
      </div>
    </Link>
  );
}
