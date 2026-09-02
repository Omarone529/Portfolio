import { PRIVACY } from "@/content/privacy";
import { privacyPath, type Lang } from "@/content/site";
import { PageFrame } from "../chrome/RootShell";
import Reveal from "../Reveal";

/** The locale each language's date is written in. */
const DATE_LOCALE: Record<Lang, string> = { it: "it-IT", en: "en-GB" };

/**
 * The revision date, spelled out in the language of the page.
 *
 * UTC, because the date is a fact about the text and not about the machine
 * that renders it: without it a build run late in the evening would write the
 * day before.
 *
 * @param lang the language to write the month in
 * @returns the date in long form, e.g. "2 settembre 2026"
 */
function writtenDate(lang: Lang): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${PRIVACY.updated}T00:00:00Z`));
}

/**
 * The informativa. One column of prose, in the same measure a case study
 * gives its own, because it is read the same way: from the top, once.
 *
 * @param lang the language this copy of the page speaks
 * @returns the page, inside the standard header and footer
 */
export default function PrivacyPage({ lang }: { lang: Lang }) {
  const altHrefs = { it: privacyPath("it"), en: privacyPath("en") };

  return (
    <PageFrame lang={lang} onHome={false} altHrefs={altHrefs}>
      <article>
        <header className="section section-plain">
          <div className="row max-w-[46rem]">
            <p className="eyebrow mb-4">
              {PRIVACY.updatedLabel[lang]} ·{" "}
              <time dateTime={PRIVACY.updated}>{writtenDate(lang)}</time>
            </p>
            <h1>{PRIVACY.title[lang]}</h1>
            <p
              className={
                "mt-6 text-[1.375rem] leading-[1.5] " +
                "text-[var(--color-muted)] md:text-[1.5rem]"
              }
            >
              {PRIVACY.intro[lang]}
            </p>
          </div>
        </header>

        <section className="section section-alt">
          <div className="row">
            <div className="max-w-[42rem] space-y-10">
              {PRIVACY.sections.map((section, index) => (
                <Reveal key={section.heading.en}>
                  {/* Numbered as they are drawn, so that a section added to
                      the middle does not leave the rest renumbered by hand,
                      and small: ten of them at the page's h2 size would be
                      ten more titles than a document of this kind wants. */}
                  <h2
                    className={
                      "mb-5 text-[1.375rem] leading-[1.35] font-semibold " +
                      "tracking-normal"
                    }
                  >
                    {index + 1}. {section.heading[lang]}
                  </h2>
                  <div className="prose prose-legal">
                    {section.body[lang].map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.link ? (
                    <p className="mt-6">
                      <a
                        href={section.link.href}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className={
                          "link-quiet inline-flex min-h-11 items-center " +
                          "text-[1.125rem] underline underline-offset-4 " +
                          "md:min-h-0"
                        }
                      >
                        {section.link.label[lang]}
                      </a>
                    </p>
                  ) : null}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </article>
    </PageFrame>
  );
}
