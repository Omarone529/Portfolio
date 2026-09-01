import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LANGS, SITE, projectPath, type Lang } from "./site";
import {
  PROJECTS,
  getProject,
  projectCard,
  projectSlugs,
  projectTitle,
  type Project,
} from "./projects";

/**
 * Every localized field on a project, flattened, so a language can be checked
 * for gaps without listing the fields at each call site.
 *
 * @param project the project to read
 * @param lang which language to pull
 * @returns every string that language is expected to provide
 */
function localizedStrings(project: Project, lang: Lang): string[] {
  return [
    project.type[lang],
    project.core[lang],
    project.lead[lang],
    ...project.solution[lang],
    ...(project.shots ?? []).flatMap((shot) => [shot.alt[lang], shot.caption[lang]]),
    project.meta.title[lang],
    project.meta.description[lang],
    project.meta.ogDescription[lang],
  ];
}

describe("project data", () => {
  /** Slugs become URLs, so a duplicate would make one case study unreachable. */
  it("has a unique slug per project", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  /** A slug in a URL has to survive being typed, shared and crawled. */
  it("uses url safe slugs", () => {
    for (const project of PROJECTS) {
      expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  /**
   * A missing translation would render an empty heading or an empty meta
   * description rather than failing, so it is checked rather than trusted.
   */
  it.each(LANGS)("has no empty string in %s", (lang) => {
    for (const project of PROJECTS) {
      for (const value of localizedStrings(project, lang)) {
        expect(value.trim(), `${project.slug} in ${lang}`).not.toBe("");
      }
    }
  });

  /** Both halves are rendered separately and joined for plain text uses. */
  it("splits every title into two parts that rejoin", () => {
    for (const project of PROJECTS) {
      expect(project.titleParts).toHaveLength(2);
      expect(projectTitle(project)).toBe(project.titleParts[0] + project.titleParts[1]);
    }
  });

  it("gives every project a non empty stack", () => {
    for (const project of PROJECTS) {
      expect(project.stack.length).toBeGreaterThan(0);
    }
  });
});

describe("project lookup", () => {
  /** generateStaticParams feeds these straight to the router. */
  it("resolves every slug it asks Next to prerender", () => {
    for (const { slug } of projectSlugs()) {
      expect(getProject(slug)?.slug).toBe(slug);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});

describe("project screenshots", () => {
  const shots = PROJECTS.flatMap((project) =>
    (project.shots ?? []).map((shot) => [project.slug, shot] as const),
  );

  /** Every image on this site is a webp served from the same origin. */
  it("serves every shot as a webp from public/assets", () => {
    for (const [slug, shot] of shots) {
      expect(shot.webp, slug).toMatch(/^\/assets\/[a-z0-9-]+\.webp$/);
    }
  });

  /**
   * The pixel size is written into the markup so the browser can hold the
   * space before the image arrives: a shot is a wide block low on the page,
   * and without it every paragraph under it moves when it loads.
   */
  it("declares the pixel size of every shot", () => {
    for (const [slug, shot] of shots) {
      expect(shot.width, slug).toBeGreaterThan(0);
      expect(shot.height, slug).toBeGreaterThan(0);
    }
  });

  /** Two images of the same screen would be a duplicate request, not a gallery. */
  it("never repeats the same file within a project", () => {
    for (const project of PROJECTS) {
      const paths = (project.shots ?? []).map((shot) => shot.webp);
      expect(new Set(paths).size, project.slug).toBe(paths.length);
    }
  });

  /**
   * A caption sits under the image and the alt replaces it, so the two say
   * different things: read together they would be the same line twice.
   */
  it("never repeats the caption as the alt text", () => {
    for (const [slug, shot] of shots) {
      for (const lang of LANGS) {
        expect(shot.alt[lang], slug).not.toBe(shot.caption[lang]);
      }
    }
  });
});

describe("year", () => {
  /** It is read next to the project type, so it has to look like a year. */
  it("is a four digit year, never in the future", () => {
    const thisYear = new Date().getFullYear();

    for (const project of PROJECTS) {
      expect(String(project.year), project.slug).toMatch(/^20\d{2}$/);
      expect(project.year, project.slug).toBeLessThanOrEqual(thisYear);
    }
  });
});

describe("social card", () => {
  /**
   * A case study shared in a message has to show the case study. Every project
   * previewing as the same site card is the one picture the reader has already
   * seen, and it is what this site shipped until the cards were drawn.
   *
   * PNG and not webp: a link preview is drawn by a crawler, and several of
   * them treat a webp as no picture at all.
   */
  it("gives every project a card of its own, in both languages", () => {
    for (const project of PROJECTS) {
      for (const lang of LANGS) {
        const card = projectCard(project, lang);
        expect(card.path, `${project.slug} ${lang}`).toMatch(
          /^\/assets\/[a-z0-9-]+\.png$/,
        );
      }
    }
  });

  /**
   * The card the content layer names has to be a file that exists. This is the
   * invariant the old cards broke: `og-image.png` outlived the design it was a
   * picture of, and three projects pointed at nothing and quietly fell back to
   * it. Nothing can test that a picture is current, but a missing one is a
   * failing test rather than a blank preview six months later.
   */
  it("names a file that is actually in public/assets", () => {
    for (const project of PROJECTS) {
      for (const lang of LANGS) {
        const { path } = projectCard(project, lang);
        expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true);
      }
    }
  });

  /** The card shows the logo and the title, so that is what the alt says. */
  it("describes what the card actually shows", () => {
    for (const lang of LANGS) {
      const card = projectCard(PROJECTS[0], lang);
      expect(card.alt).toContain(projectTitle(PROJECTS[0]));
      expect(card.alt).toContain(PROJECTS[0].type[lang]);
    }
  });

  /** Drawn at the site card's size, and declared at the size it was drawn. */
  it("is the size every card on this site is", () => {
    const card = projectCard(PROJECTS[0], "it");
    expect(card.width).toBe(SITE.ogImageSize.width);
    expect(card.height).toBe(SITE.ogImageSize.height);
  });
});

describe("project routes", () => {
  /**
   * trailingSlash is on, so a path without one costs a redirect hop, and the
   * two languages have to stay on their own prefix.
   */
  it("builds a distinct trailing slash path per language", () => {
    for (const project of PROJECTS) {
      const it = projectPath("it", project.slug);
      const en = projectPath("en", project.slug);

      expect(it).toBe(`/progetti/${project.slug}/`);
      expect(en).toBe(`/en/projects/${project.slug}/`);
      expect(it).not.toBe(en);
    }
  });
});
