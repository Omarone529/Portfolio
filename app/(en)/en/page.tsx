import type { Metadata } from "next";
import { HOME_META, homePath } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import HomePage from "@/components/pages/HomePage";

const PATHS = { it: homePath("it"), en: homePath("en") };

export const metadata: Metadata = buildMetadata({
  lang: "en",
  title: HOME_META.title.en,
  description: HOME_META.description.en,
  ogDescription: HOME_META.ogDescription.en,
  paths: PATHS,
});

export default function Page() {
  return <HomePage lang="en" />;
}
