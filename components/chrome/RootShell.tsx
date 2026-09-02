import type { ReactNode } from "react";
import { UI, type Lang } from "@/content/site";
import { sans } from "@/app/fonts";
import Header from "./Header";
import Footer from "./Footer";
import PrivacyNotice from "./PrivacyNotice";
import ScrollChrome from "./ScrollChrome";
import SectionScroll from "./SectionScroll";

interface RootShellProps {
  lang: Lang;
  children: ReactNode;
}

/**
 * The document. Italian and English each have their own root layout, the only
 * way <html lang> can be right on both, and both defer to this, so the chrome
 * exists once.
 *
 * altHrefs is left to the pages: a case study has to point at its own
 * translation, not at the other language's home page.
 */
export default function RootShell({ lang, children }: RootShellProps) {
  return (
    <html lang={lang} className={sans.variable}>
      {/* eslint-disable-next-line @next/next/no-head-element --
          next/head is the pages-router API; in the App Router a root layout
          renders <head> directly. */}
      <head>
        {/* Without script there is no observer to reveal anything, so the
            scroll animation would leave every section invisible. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="font-[family-name:var(--font-sans)] antialiased">
        <a href="#main" className="skip-link">
          {UI.a11y.skip[lang]}
        </a>

        <SectionScroll />
        <ScrollChrome lang={lang} />
        <PrivacyNotice lang={lang} />
        {children}
      </body>
    </html>
  );
}

/**
 * Header + main + footer, for the pages that want the standard frame.
 * Kept separate from RootShell so a page can pass its own altHrefs.
 */
export function PageFrame({
  lang,
  onHome,
  altHrefs,
  children,
}: {
  lang: Lang;
  onHome: boolean;
  altHrefs: Record<Lang, string>;
  children: ReactNode;
}) {
  return (
    <>
      <Header lang={lang} onHome={onHome} altHrefs={altHrefs} />
      <main id="main" tabIndex={-1}>
        <span id="top" aria-hidden />
        {children}
      </main>
      <Footer lang={lang} onHome={onHome} />
    </>
  );
}
