import type { CSSProperties } from "react";
import Link from "next/link";
import {
  SECTION_ID,
  SITE,
  SOCIALS,
  UI,
  homePath,
  privacyPath,
  sectionHref,
  type Lang,
} from "@/content/site";
import { SocialIcon } from "../Icons";

interface FooterProps {
  lang: Lang;
  onHome: boolean;
}

export default function Footer({ lang, onHome }: FooterProps) {
  const links = [
    { key: "work", label: UI.nav.works[lang] },
    { key: "about", label: UI.nav.about[lang] },
  ] as const;

  return (
    <footer
      id={SECTION_ID[lang].contact}
      className={
        // The extra room at the bottom is for the back to top button: it is
        // fixed 24px above the fold and 44px tall, so at the end of the page it
        // sat on top of the credit line.
        "bg-[var(--color-footer)] px-6 pt-14 pb-24 text-center " +
        "text-[var(--color-muted)] shadow-[var(--shadow-inset-top)] " +
        "md:px-8 md:pb-14"
      }
    >
      <div className="row">
        <p className="mb-6 text-[0.9375rem] md:mb-8">{UI.footer.reach[lang]}</p>

        {/* Seven 44px buttons need 356px and a phone offers 342, so the row
            wraps. Left alone it breaks six and one; held to four across it
            breaks four and three, which reads as an arrangement. */}
        <ul
          className={
            "mx-auto flex max-w-[12.5rem] flex-wrap items-center " +
            "justify-center gap-2 sm:max-w-none"
          }
        >
          {SOCIALS.map((social) => (
            <li key={social.id}>
              {/* No rel="noopener noreferrer" on the outward links. Some
                  browsers read that rel as a window.open with noopener and
                  hand the link a separate window instead of a tab, and
                  target="_blank" already severs window.opener on its own in
                  every current browser. referrerPolicy keeps the Referer
                  header off without asking for a window. */}
              <a
                href={social.href}
                aria-label={social.label}
                title={social.label}
                {...(social.href.startsWith("http")
                  ? { target: "_blank", referrerPolicy: "no-referrer" as const }
                  : {})}
                className="icon-button hover:-translate-y-0.5"
                style={{ "--social-brand": social.brand } as CSSProperties}
              >
                <SocialIcon id={social.id} className="h-[1.15rem] w-[1.15rem]" />
              </a>
            </li>
          ))}
        </ul>

        <nav
          className={
            "mt-6 flex flex-wrap items-center justify-center " +
            "gap-x-6 text-[0.9375rem] md:mt-8"
          }
        >
          <Link
            href={homePath(lang)}
            className="link-quiet flex min-h-11 items-center md:min-h-0"
          >
            {SITE.name}
          </Link>
          {links.map(({ key, label }) => (
            <Link
              key={key}
              href={sectionHref(lang, key, onHome)}
              className="link-quiet flex min-h-11 items-center md:min-h-0"
            >
              {label}
            </Link>
          ))}
          <Link
            href={privacyPath(lang)}
            className="link-quiet flex min-h-11 items-center md:min-h-0"
          >
            {UI.footer.privacy[lang]}
          </Link>
        </nav>

        <p className="mt-6 text-[0.875rem]">
          © {new Date().getFullYear()} {SITE.name} · {UI.footer.role[lang]}
        </p>
      </div>
    </footer>
  );
}
