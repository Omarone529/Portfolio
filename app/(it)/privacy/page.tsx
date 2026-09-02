import type { Metadata } from "next";
import { PRIVACY } from "@/content/privacy";
import { privacyPath } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import PrivacyPage from "@/components/pages/PrivacyPage";

const PATHS = { it: privacyPath("it"), en: privacyPath("en") };

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: PRIVACY.meta.title.it,
  description: PRIVACY.meta.description.it,
  paths: PATHS,
});

/**
 * The Italian informativa, at /privacy/.
 *
 * @returns the page, in Italian
 */
export default function Page() {
  return <PrivacyPage lang="it" />;
}
