import { ABOUT, HOME_META, SECTION_ID, UI, homePath, type Lang } from "@/content/site";
import { PROJECTS } from "@/content/projects";
import { PageFrame } from "../chrome/RootShell";
import SplitFace from "../hero/SplitFace";
import ProjectCard from "../project/ProjectCard";
import Reveal from "../Reveal";
import JsonLd, { personSchema, websiteSchema, workListSchema } from "../JsonLd";

const ALT_HREFS = { it: homePath("it"), en: homePath("en") };

export default function HomePage({ lang }: { lang: Lang }) {
  const ids = SECTION_ID[lang];

  return (
    <PageFrame lang={lang} onHome altHrefs={ALT_HREFS}>
      <JsonLd
        data={[
          personSchema(lang, HOME_META.ogDescription[lang]),
          websiteSchema(),
          workListSchema(lang, PROJECTS),
        ]}
      />

      <SplitFace lang={lang} />

      <section id={ids.work} className="section section-alt scroll-mt-8">
        <div className="row">
          <h2 className="eyebrow mb-12 text-center">{UI.home.workHeading[lang]}</h2>

          <ul className="grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <Reveal as="li" key={project.slug} delay={i * 80}>
                <ProjectCard project={project} lang={lang} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id={ids.about} className="section scroll-mt-8">
        <div className="row max-w-[46rem]">
          <Reveal>
            <h2 className="eyebrow mb-4">{UI.home.aboutLabel[lang]}</h2>
            <p className="text-[1.25rem] leading-[1.7] md:text-[1.375rem]">
              {ABOUT.desc[lang]}
            </p>

            <p className="mt-10 text-[0.9375rem] font-medium text-[var(--color-muted)]">
              {UI.home.stackLabel[lang]}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {ABOUT.stack.map((tool) => (
                <li key={tool} className="tag">
                  {tool}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </PageFrame>
  );
}
