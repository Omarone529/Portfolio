import type { Metadata } from "next";
import { HOME_META, homePath } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import HomePage from "@/components/pages/HomePage";

const PATHS = { it: homePath("it"), en: homePath("en") };

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: HOME_META.title.it,
  description: HOME_META.description.it,
  ogDescription: HOME_META.ogDescription.it,
  paths: PATHS,
});

export default function Page() {
  return <HomePage lang="it" />;
}
