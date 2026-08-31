import Link from "next/link";
import { UI, type Lang } from "@/content/site";
import { FlagEn, FlagIt } from "../Icons";

interface LangToggleProps {
  lang: Lang;
  /** Where each language lives for the page currently being rendered. */
  hrefs: Record<Lang, string>;
}

/**
 * Two real links rather than a JS toggle: each language is a separate page now,
 * so switching is a navigation, and crawlers can follow it the same way people do.
 */
export default function LangToggle({ lang, hrefs }: LangToggleProps) {
  const options: { code: Lang; label: string; Flag: typeof FlagIt }[] = [
    { code: "it", label: "Italiano", Flag: FlagIt },
    { code: "en", label: "English", Flag: FlagEn },
  ];

  return (
    <div
      role="group"
      aria-label={UI.a11y.langGroup[lang]}
      className={
        "flex items-center gap-1 rounded-full " +
        "border border-[var(--color-rule)] bg-white p-1"
      }
    >
      {options.map(({ code, label, Flag }) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={hrefs[code]}
            hrefLang={code}
            title={label}
            aria-label={label}
            aria-current={active ? "true" : undefined}
            className={
              // A finger needs the 44px the rest of the site gives it; a
              // pointer does not, and the pill is tidier small.
              "flex h-11 w-10 items-center justify-center rounded-full " +
              "transition-opacity duration-300 md:h-6 md:w-8 " +
              (active ? "opacity-100" : "opacity-40 hover:opacity-80")
            }
          >
            <Flag className="h-4 w-6 rounded-[2px] md:h-3.5 md:w-5" />
          </Link>
        );
      })}
    </div>
  );
}
