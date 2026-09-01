import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { LANGS, SITE, absolute, homePath, projectPath } from "@/content/site";
import { PROJECTS } from "@/content/projects";
import { buildMetadata } from "./seo";

const HOME_PATHS = { it: homePath("it"), en: homePath("en") };

/**
 * The Open Graph image url a page ships, unwrapped from the shapes Next's
 * Metadata type allows it to take.
 *
 * @param meta the metadata to read
 * @returns the first og:image url, as a string
 */
function ogImage(meta: Metadata): string {
  const images = meta.openGraph?.images;
  const first = Array.isArray(images) ? images[0] : images;
  const url = typeof first === "object" && first && "url" in first ? first.url : first;
  return String(url);
}

/**
 * The same, for the Twitter card, which carries its own copy of the image.
 *
 * @param meta the metadata to read
 * @returns the first twitter:image url, as a string
 */
function twitterImage(meta: Metadata): string {
  const images = meta.twitter?.images;
  const first = Array.isArray(images) ? images[0] : images;
  const url = typeof first === "object" && first && "url" in first ? first.url : first;
  return String(url);
}

/**
 * The metadata a page would produce, with the fields these tests care about.
 *
 * @param lang which language the page is in
 * @returns the Metadata object for the home page in that language
 */
function homeMetadata(lang: (typeof LANGS)[number]) {
  return buildMetadata({
    lang,
    title: `title ${lang}`,
    description: `description ${lang}`,
    paths: HOME_PATHS,
  });
}

describe("canonical", () => {
  /** Two pages claiming the same canonical is how a translation gets dropped. */
  it("points each language at its own absolute url", () => {
    expect(homeMetadata("it").alternates?.canonical).toBe(absolute("/"));
    expect(homeMetadata("en").alternates?.canonical).toBe(absolute("/en/"));
  });
});

describe("hreflang", () => {
  /**
   * The whole reason the site moved off ?lang=en. Every page has to declare
   * both languages and agree with its counterpart, or the pair is ambiguous.
   */
  it("declares both languages plus x-default on every page", () => {
    for (const lang of LANGS) {
      const languages = homeMetadata(lang).alternates?.languages ?? {};
      expect(languages.it).toBe(absolute("/"));
      expect(languages.en).toBe(absolute("/en/"));
      expect(languages["x-default"]).toBe(absolute("/"));
    }
  });

  /** Italian is the original, so an unmatched locale belongs there. */
  it("sends x-default to the italian url", () => {
    for (const project of PROJECTS) {
      const paths = {
        it: projectPath("it", project.slug),
        en: projectPath("en", project.slug),
      };
      const languages =
        buildMetadata({
          lang: "en",
          title: project.meta.title.en,
          description: project.meta.description.en,
          paths,
        }).alternates?.languages ?? {};

      expect(languages["x-default"]).toBe(languages.it);
      expect(languages.it).toBe(absolute(paths.it));
      expect(languages.en).toBe(absolute(paths.en));
    }
  });

  /** A page pointing at itself in both slots would hide one translation. */
  it("never gives the two languages the same url", () => {
    for (const project of PROJECTS) {
      expect(projectPath("it", project.slug)).not.toBe(projectPath("en", project.slug));
    }
  });
});

describe("social cards", () => {
  /** og:url disagreeing with the canonical is a mixed signal to a crawler. */
  it("matches og:url to the canonical", () => {
    for (const lang of LANGS) {
      const meta = homeMetadata(lang);
      expect(meta.openGraph?.url).toBe(meta.alternates?.canonical);
    }
  });

  it("sets the locale from the language", () => {
    expect(homeMetadata("it").openGraph?.locale).toBe("it_IT");
    expect(homeMetadata("en").openGraph?.locale).toBe("en_US");
  });

  /** The shorter line is for the cards; without one they reuse the long one. */
  it("prefers ogDescription and falls back to description", () => {
    const withShort = buildMetadata({
      lang: "it",
      title: "t",
      description: "the long one",
      ogDescription: "the short one",
      paths: HOME_PATHS,
    });
    expect(withShort.openGraph?.description).toBe("the short one");
    expect(withShort.twitter?.description).toBe("the short one");

    const withoutShort = homeMetadata("it");
    expect(withoutShort.openGraph?.description).toBe("description it");
  });

  it("ships an absolute image url, which crawlers require", () => {
    expect(ogImage(homeMetadata("it"))).toBe(`${SITE.url}${SITE.ogImage.it}`);
  });

  /**
   * The card carries the hero, and the hero is two words in the language of
   * the page it is on. One card for both would put an Italian sentence into
   * the preview of a page that declares itself en_US.
   */
  it("gives each language the card written in it", () => {
    const cards = LANGS.map((lang) => ogImage(homeMetadata(lang)));
    expect(new Set(cards).size).toBe(LANGS.length);
    for (const lang of LANGS) {
      expect(ogImage(homeMetadata(lang))).toBe(`${SITE.url}${SITE.ogImage[lang]}`);
    }
  });

  /** As with the project cards: a named file that is not there is a blank
      preview nobody sees until someone shares the page. */
  it("names site cards that are actually in public/assets", () => {
    for (const lang of LANGS) {
      const path = SITE.ogImage[lang];
      expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
    }
  });

  /**
   * A case study shared in a message has to show the case study. Without its
   * own picture every project link previews as the same site card, which is
   * the one thing a reader has already seen.
   */
  it("takes the page's own image when it has one", () => {
    const meta = buildMetadata({
      lang: "it",
      title: "t",
      description: "d",
      paths: HOME_PATHS,
      image: { path: "/assets/shot.webp", width: 1600, height: 837, alt: "a shot" },
    });

    expect(ogImage(meta)).toBe(`${SITE.url}/assets/shot.webp`);
    expect(twitterImage(meta)).toBe(`${SITE.url}/assets/shot.webp`);
  });

  /** The site card is what a page without a picture of its own falls back to. */
  it("falls back to the site card", () => {
    expect(twitterImage(homeMetadata("en"))).toBe(`${SITE.url}${SITE.ogImage.en}`);
  });
});

describe("indexing", () => {
  it("leaves every real page indexable", () => {
    const robots = homeMetadata("it").robots;
    expect(typeof robots === "object" && robots?.index).toBe(true);
    expect(typeof robots === "object" && robots?.follow).toBe(true);
  });
});
