import type { Metadata } from "next";
import { LANGS, SITE, absolute, type Lang } from "@/content/site";

interface BuildMetadataArgs {
  lang: Lang;
  title: string;
  description: string;
  /** Shorter line for the social cards; falls back to the description. */
  ogDescription?: string;
  /** This page's path in each language. */
  paths: Record<Lang, string>;
  type?: "website" | "article";
  /**
   * The picture this page is shared with. Left out by a page that has none of
   * its own, which falls back to the site card.
   */
  image?: { path: string; width: number; height: number; alt: string };
}

const OG_LOCALE: Record<Lang, string> = {
  it: "it_IT",
  en: "en_US",
};

/**
 * One place where canonical, hreflang, Open Graph and Twitter are derived from
 * the same four strings, so a page cannot end up with a title in one tag and a
 * stale one in another, which is how the hand-maintained version drifted.
 */
export function buildMetadata({
  lang,
  title,
  description,
  ogDescription,
  paths,
  type = "website",
  image,
}: BuildMetadataArgs): Metadata {
  const social = ogDescription ?? description;
  const canonical = absolute(paths[lang]);
  const card = image ?? {
    path: SITE.ogImage[lang],
    width: SITE.ogImageSize.width,
    height: SITE.ogImageSize.height,
    alt: `${SITE.name} · ${SITE.role}`,
  };
  const cardUrl = absolute(card.path);

  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l] = absolute(paths[l]);
  // Italian is the original, so it is what an unmatched locale should land on.
  languages["x-default"] = absolute(paths.it);

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    alternates: { canonical, languages },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE.name,
      title,
      description: social,
      locale: OG_LOCALE[lang],
      images: [
        {
          url: cardUrl,
          width: card.width,
          height: card.height,
          alt: card.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: social,
      images: [cardUrl],
    },
  };
}
