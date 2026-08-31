import type { Metadata } from "next";
import { NOT_FOUND } from "@/content/site";
import NotFoundPage from "@/components/pages/NotFoundPage";

export const metadata: Metadata = {
  title: NOT_FOUND.meta.title.en,
  description: NOT_FOUND.meta.description.en,
  robots: { index: false, follow: true },
};

/**
 * The English 404, exported to /en/404/. It is a page and not a not-found.tsx
 * because a static export writes one 404.html only, from the root one, and a
 * second file is the only way /en/ can answer in its own language.
 *
 * Being inside the English route group, it inherits <html lang="en"> from that
 * layout, so unlike the Italian one it needs no script to set the attribute.
 *
 * @returns the 404 body, in English
 */
export default function Page() {
  return <NotFoundPage lang="en" />;
}
