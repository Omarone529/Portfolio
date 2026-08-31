import type { MetadataRoute } from "next";
import { LANGS, absolute, homePath, projectPath, type Lang } from "@/content/site";
import { PROJECTS } from "@/content/projects";

// The file is written once at build time; there is no server to regenerate it.
export const dynamic = "force-static";

/**
 * Generated from the same data the pages render, so adding a project to
 * content/projects.ts is enough. There is no second list to remember.
 * Each entry declares its counterpart in the other language.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const alternates = (paths: Record<Lang, string>) => ({
    languages: Object.fromEntries(LANGS.map((l) => [l, absolute(paths[l])])) as Record<
      string,
      string
    >,
  });

  const homePaths = { it: homePath("it"), en: homePath("en") };

  const entries: MetadataRoute.Sitemap = LANGS.map((lang) => ({
    url: absolute(homePaths[lang]),
    lastModified,
    changeFrequency: "monthly",
    priority: 1,
    alternates: alternates(homePaths),
  }));

  for (const project of PROJECTS) {
    const paths = {
      it: projectPath("it", project.slug),
      en: projectPath("en", project.slug),
    };
    for (const lang of LANGS) {
      entries.push({
        url: absolute(paths[lang]),
        lastModified,
        changeFrequency: "yearly",
        priority: 0.8,
        alternates: alternates(paths),
      });
    }
  }

  return entries;
}
