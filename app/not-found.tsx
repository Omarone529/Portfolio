import type { Metadata } from "next";
import "./globals.css";
import { sans } from "./fonts";
import { NOT_FOUND } from "@/content/site";
import NotFoundPage from "@/components/pages/NotFoundPage";

export const metadata: Metadata = {
  title: NOT_FOUND.meta.title.it,
  description: NOT_FOUND.meta.description.it,
  robots: { index: false, follow: true },
};

/**
 * The Italian 404. Next writes it to out/404.html, the file Netlify serves for
 * any address that does not exist and is not under /en/, where a rule in
 * netlify.toml sends the English one instead.
 *
 * With two root layouts there is none this page can inherit, so Next wraps it
 * in a bare document of its own, which is why the font class goes on a wrapper
 * here, and why <html lang> has to be set from a one-line script.
 */
export default function NotFound() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: `document.documentElement.lang='it'` }}
      />
      <div
        className={`${sans.variable} font-[family-name:var(--font-sans)] antialiased`}
      >
        <NotFoundPage lang="it" />
      </div>
    </>
  );
}
