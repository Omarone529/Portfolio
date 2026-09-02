import type { Metadata } from "next";
import { PRIVACY } from "@/content/privacy";
import { privacyPath } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import PrivacyPage from "@/components/pages/PrivacyPage";

const PATHS = { it: privacyPath("it"), en: privacyPath("en") };

export const metadata: Metadata = buildMetadata({
  lang: "en",
  title: PRIVACY.meta.title.en,
  description: PRIVACY.meta.description.en,
  paths: PATHS,
});

/**
 * The English informativa, at /en/privacy/.
 *
 * @returns the page, in English
 */
export default function Page() {
  return <PrivacyPage lang="en" />;
}
