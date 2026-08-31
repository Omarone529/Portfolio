import { SECTION_ID, UI, projectPath, type Lang } from "@/content/site";
import { type Project } from "@/content/projects";
import { PageFrame } from "../chrome/RootShell";
import ProjectLogo from "../project/ProjectLogo";
import ProjectShots from "../project/ProjectShots";
import Reveal from "../Reveal";
import JsonLd, { breadcrumbSchema, projectSchema } from "../JsonLd";

/**
 * A case study: what the project is, what it does, what it is built with.
 *
 * The header pairs the title with the same tinted logo frame the home grid
 * shows, so arriving from a card lands on the object you clicked. Under it is
 * the prose with the stack, and then the screens, for a project that has them.
 */
export default function ProjectPage({
  lang,
  project,
}: {
  lang: Lang;
  project: Project;
}) {
  const altHrefs = {
    it: projectPath("it", project.slug),
    en: projectPath("en", project.slug),
  };

  return (
    <PageFrame lang={lang} onHome={false} altHrefs={altHrefs}>
      <JsonLd
        data={[
          projectSchema(lang, project),
          breadcrumbSchema(lang, project, UI.nav.works[lang], SECTION_ID[lang].work),
        ]}
      />

      <article>
        <header className="section section-plain">
          <div className="row">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow mb-4">
                  {project.type[lang]} · {project.year}
                </p>
                <h1>
                  <span style={{ color: project.accentLead }}>
                    {project.titleParts[0]}
                  </span>
                  <span style={{ color: project.accent }}>{project.titleParts[1]}</span>
                </h1>
                <p
                  className={
                    "mt-6 text-[1.375rem] leading-[1.5] " +
                    "text-[var(--color-muted)] md:text-[1.5rem]"
                  }
                >
                  {project.lead[lang]}
                </p>
              </div>

              <Reveal>
                <div
                  className={
                    "rounded-[var(--radius-card)] bg-[var(--color-card)] p-3 " +
                    "shadow-[var(--shadow-card)]"
                  }
                >
                  <ProjectLogo project={project} eager />
                </div>
              </Reveal>
            </div>
          </div>
        </header>

        <section className="section section-alt">
          {/* Held to the row's left edge, not centred in it, so the label lines
              up with the eyebrow and the title above it. */}
          <div className="row">
            <div className="max-w-[46rem] space-y-14">
              <Reveal>
                <h2 className="eyebrow mb-5">{UI.project.solution[lang]}</h2>
                <div className="prose">
                  {project.solution[lang].map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h2 className="eyebrow mb-5">{UI.project.stack[lang]}</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Last on the page, on the white ground, so the pictures are read
            against the same white the cards around them are cut from. */}
        {project.shots && (
          <section className="section">
            <div className="row">
              <Reveal>
                <h2 className="eyebrow mb-5">{UI.project.shots[lang]}</h2>
              </Reveal>
              <ProjectShots shots={project.shots} lang={lang} />
            </div>
          </section>
        )}
      </article>
    </PageFrame>
  );
}
