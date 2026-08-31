import Link from "next/link";
import { SITE, UI, homePath, sectionHref, type Lang } from "@/content/site";
import LangToggle from "./LangToggle";

interface HeaderProps {
  lang: Lang;
  /** True on the home page, where the nav links are plain in-page anchors. */
  onHome: boolean;
  /** This same page in each language, for the toggle. */
  altHrefs: Record<Lang, string>;
}

export default function Header({ lang, onHome, altHrefs }: HeaderProps) {
  const links = [
    { key: "work", label: UI.nav.works[lang] },
    { key: "about", label: UI.nav.about[lang] },
    { key: "contact", label: UI.nav.contact[lang] },
  ] as const;

  return (
    <header className="border-b border-[var(--color-rule)] bg-white">
      {/* Two rows on a phone and one from md. The name, three links and the
          flags do not fit across 390px: held on one row they broke both the
          name and the longest link across two lines each. The name and the
          flags keep the first row, the links take the second whole, and the
          order puts them back between the two from md. */}
      <div
        className={
          "row flex flex-wrap items-center justify-between gap-x-4 px-6 " +
          "py-2 md:flex-nowrap md:px-8 md:py-4"
        }
      >
        <Link
          href={homePath(lang)}
          className={
            "order-1 flex min-h-11 items-center text-[1.0625rem] " +
            "font-semibold tracking-tight whitespace-nowrap " +
            "text-[var(--color-ink)] no-underline transition-opacity " +
            "duration-300 hover:opacity-70 md:min-h-0"
          }
        >
          {SITE.name}
        </Link>

        <div className="order-2 md:order-3">
          <LangToggle lang={lang} hrefs={altHrefs} />
        </div>

        <nav
          aria-label={UI.a11y.nav[lang]}
          className="order-3 w-full md:order-2 md:ml-auto md:w-auto"
        >
          <ul className="flex items-center gap-6 md:gap-7">
            {links.map(({ key, label }) => (
              <li key={key}>
                <Link
                  href={sectionHref(lang, key, onHome)}
                  className={
                    "link-quiet flex min-h-11 items-center text-[0.9375rem] " +
                    "md:min-h-0 md:text-base"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
