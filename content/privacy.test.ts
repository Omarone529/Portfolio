import { describe, expect, it } from "vitest";
import { LANGS, SITE, privacyPath, type Lang } from "./site";
import { PRIVACY } from "./privacy";

/**
 * Every string of the informativa in one language, flattened, so a gap can be
 * found without naming each field at the call site.
 *
 * Link labels are in here too: they are read, so they have to be written.
 *
 * @param lang which language to pull
 * @returns every string that language is expected to provide
 */
function privacyStrings(lang: Lang): string[] {
  const lines = [
    PRIVACY.meta.title[lang],
    PRIVACY.meta.description[lang],
    PRIVACY.title[lang],
    PRIVACY.intro[lang],
    PRIVACY.updatedLabel[lang],
    PRIVACY.notice.text[lang],
    PRIVACY.notice.more[lang],
    PRIVACY.notice.dismiss[lang],
  ];
  for (const section of PRIVACY.sections) {
    lines.push(section.heading[lang], ...section.body[lang]);
    if (section.link) lines.push(section.link.label[lang]);
  }
  return lines;
}

/**
 * The prose alone: the headings and the paragraphs, with the link labels left
 * out. An email address is the same word in both languages and a difference
 * check would fail on it for the wrong reason.
 *
 * @param lang which language to pull
 * @returns every heading and paragraph in that language
 */
function privacyProse(lang: Lang): string[] {
  const lines: string[] = [];
  for (const section of PRIVACY.sections) {
    lines.push(section.heading[lang], ...section.body[lang]);
  }
  return lines;
}

describe("the privacy copy", () => {
  /**
   * A missing line here is not a blank paragraph, it is a duty left
   * unfulfilled: the page exists to say these things, in the language the
   * reader arrived in.
   */
  it("fills every string in both languages", () => {
    for (const lang of LANGS) {
      for (const line of privacyStrings(lang)) {
        expect(line.trim().length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Both trees render the same object, so an untranslated paragraph would ship
   * silently and leave an English reader on an Italian informativa.
   */
  it("says it differently in each language", () => {
    const italian = privacyProse("it");
    const english = privacyProse("en");
    expect(english.length).toBe(italian.length);
    for (let i = 0; i < italian.length; i += 1) {
      expect(english[i]).not.toBe(italian[i]);
    }
  });

  /**
   * An informativa that names no address is not one: the rights it lists are
   * exercised by writing somewhere, and that somewhere is the site's own
   * address rather than a second one typed here.
   */
  it("hands the reader the address the site already publishes", () => {
    for (const lang of LANGS) {
      expect(privacyStrings(lang).join(" ")).toContain(SITE.email);
    }
  });

  /**
   * The date is rendered through Intl and carried by a <time dateTime>, both
   * of which want the ISO form. A hand-written "2 settembre" would be shown
   * to an English reader untranslated and to a machine as nothing at all.
   */
  it("dates the last revision in ISO form", () => {
    expect(PRIVACY.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(PRIVACY.updated))).toBe(false);
  });
});

describe("the privacy route", () => {
  /**
   * The page is linked from the footer of every page in both trees, and the
   * two languages are separate exports: one shared address would put an
   * Italian informativa under the English footer.
   */
  it("gives each language its own address", () => {
    expect(privacyPath("it")).toBe("/privacy/");
    expect(privacyPath("en")).toBe("/en/privacy/");
  });
});
