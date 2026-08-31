import { describe, expect, it } from "vitest";
import { ABOUT, LANGS, NOT_FOUND, PLACE, SOCIALS, type Lang } from "./site";

/**
 * Every localized string the 404 renders, flattened, so a language can be
 * checked for gaps without listing the fields at each call site.
 *
 * @param lang which language to pull
 * @returns every string that language is expected to provide
 */
function notFoundStrings(lang: Lang): string[] {
  return [
    NOT_FOUND.title[lang],
    NOT_FOUND.desc[lang],
    NOT_FOUND.home[lang],
    NOT_FOUND.other[lang],
    NOT_FOUND.meta.title[lang],
    NOT_FOUND.meta.description[lang],
  ];
}

describe("the 404 copy", () => {
  /**
   * Each language serves its own file, so a gap would ship a page with a
   * heading and nothing under it rather than fall back to the other language.
   */
  it("fills every string in both languages", () => {
    for (const lang of LANGS) {
      for (const line of notFoundStrings(lang)) {
        expect(line.trim().length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Two files that read the same in both would defeat the point of having
   * two, and would leave whoever landed on the English one reading Italian.
   */
  it("says it differently in each language", () => {
    const it = notFoundStrings("it");
    const en = notFoundStrings("en");
    for (let i = 0; i < it.length; i += 1) {
      expect(en[i]).not.toBe(it[i]);
    }
  });
});

describe("the about copy", () => {
  /**
   * The home city is stated twice over: as prose here and as an address in the
   * Person schema, which reads `PLACE`. A move that touched only one of the
   * two would leave the page and its structured data in different towns, and
   * nothing else on the site would notice.
   *
   * Only `home` is held. The prose says "in zona" and names no second town, so
   * `PLACE.nearby` reaches the reader through the Person schema alone.
   */
  it("names the home city in both languages", () => {
    for (const lang of LANGS) {
      expect(ABOUT.desc[lang]).toContain(PLACE.home);
    }
  });
});

describe("the social brand colours", () => {
  /**
   * The footer writes `brand` straight into the custom property the hover rule
   * reads, so anything that is not a colour would leave the icon grey with no
   * error raised anywhere.
   */
  it("are six digit hex, where a mark has one", () => {
    for (const social of SOCIALS) {
      if (social.brand === undefined) continue;
      expect(social.brand).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  /**
   * Gmail is the one mark whose logo is not a single colour, so it is the one
   * left out here and painted part by part in the stylesheet instead.
   */
  it("cover every mark except Gmail", () => {
    for (const social of SOCIALS) {
      if (social.id === "email") {
        expect(social.brand).toBeUndefined();
      } else {
        expect(social.brand).toBeDefined();
      }
    }
  });
});
