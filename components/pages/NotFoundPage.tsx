import Link from "next/link";
import { NOT_FOUND, homePath, type Lang } from "@/content/site";
import { ArrowRight } from "@/components/Icons";

/**
 * The body both 404 pages render, so the two files differ only in language.
 *
 * The second button leads to the other side of the site: whoever landed here
 * followed an address that no longer exists, and it may well have been the
 * wrong language rather than the wrong page.
 *
 * @param lang the language this copy of the page speaks
 * @returns the centred 404 block, with no header or footer around it
 */
export default function NotFoundPage({ lang }: { lang: Lang }) {
  const other: Lang = lang === "en" ? "it" : "en";

  return (
    <main
      id="main"
      tabIndex={-1}
      className="section grid min-h-screen place-items-center"
    >
      <div className="row max-w-[38rem] text-center">
        <p className="eyebrow mb-4">404</p>
        <h1>{NOT_FOUND.title[lang]}</h1>
        <p className="mt-6 text-[1.25rem] leading-[1.6] text-[var(--color-muted)]">
          {NOT_FOUND.desc[lang]}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={homePath(lang)}
            className="button-solid min-h-11 px-5 text-[0.9375rem]"
          >
            {NOT_FOUND.home[lang]}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={homePath(other)}
            hrefLang={other}
            lang={other}
            className="button-outline min-h-11 px-5 text-[0.9375rem]"
          >
            {NOT_FOUND.other[other]}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
