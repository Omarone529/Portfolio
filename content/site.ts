export type Lang = "it" | "en";

export const LANGS: Lang[] = ["it", "en"];

/** Every string that differs between the two languages is shaped like this. */
export type L10n<T = string> = Record<Lang, T>;

export const SITE = {
  url: "https://omarbayadi.com",
  name: "Omar Bayadi",
  role: "Full-stack Developer",
  /** Written out in the footer, and the address the Gmail link opens on. */
  email: "omar.bayadi.lavoro@gmail.com",
  /**
   * The picture a link to the home page previews as: the hero, standing still,
   * under the name. One per language, because the hero is two words and they
   * are not the same two words. Drawn by `tools/cards.mjs` from the built
   * site, which is what keeps them from outliving the design they show.
   */
  ogImage: {
    it: "/assets/og-image-it.png",
    en: "/assets/og-image-en.png",
  } as L10n,
  /** Every card on this site, the projects' included, is drawn at this size. */
  ogImageSize: { width: 1500, height: 787 },
  /** The hero photograph, and what the Person schema points at as the face. */
  portrait: "/assets/omar-face.webp",
  /**
   * The two halves the hero is actually drawn from. They are named here as
   * well as in `SplitFace.module.css`, which is the one duplication there is no
   * way around: a stylesheet cannot be imported and a preload has to be markup.
   * The hero opens on the photograph, so that is the one worth the priority.
   */
  heroArt: {
    photo: "/assets/omar-photo.webp",
    paint: "/assets/omar-paint.webp",
  },
} as const;

/**
 * Where the work is done from, and the other half of the ground the on-site
 * photography covers. Two readers want these: `ABOUT` says them in prose, the
 * Person schema states them as an address. Naming them once is what keeps a
 * move from leaving the page and its structured data in different towns, and
 * `site.test.ts` holds the prose to them.
 */
export const PLACE = {
  home: "Reggio Emilia",
  nearby: "Modena",
  /** ISO 3166 country, which is the form `PostalAddress` wants. */
  country: "IT",
} as const;

/**
 * Home routes per language. Italian keeps the bare root it has always had, so
 * the canonical URL that is already indexed does not move.
 */
export function homePath(lang: Lang): string {
  return lang === "en" ? "/en/" : "/";
}

/** Project routes: /progetti/<slug>/ in Italian, /en/projects/<slug>/ in English. */
export function projectPath(lang: Lang, slug: string): string {
  return lang === "en" ? `/en/projects/${slug}/` : `/progetti/${slug}/`;
}

/** Absolute URL, for canonical tags, hreflang, JSON-LD and the sitemap. */
export function absolute(path: string): string {
  return `${SITE.url}${path}`;
}

/**
 * In-page anchors. The Italian ones are kept from the previous site: its home
 * URL has not moved, so links out there pointing at #lavori still land right.
 */
export const SECTION_ID: Record<
  Lang,
  { work: string; about: string; contact: string }
> = {
  it: { work: "lavori", about: "chi-sono", contact: "contatti" },
  en: { work: "work", about: "about", contact: "contact" },
};

/** Anchor href that works from a case study as well as from the home page. */
export function sectionHref(
  lang: Lang,
  key: "work" | "about" | "contact",
  onHome: boolean,
): string {
  const hash = `#${SECTION_ID[lang][key]}`;
  return onHome ? hash : `${homePath(lang)}${hash}`;
}

/* -------------------------------------------------------------------------- */
/* UI strings                                                                 */
/* -------------------------------------------------------------------------- */

export const UI = {
  nav: {
    works: { it: "progetti", en: "work" },
    about: { it: "chi sono", en: "about" },
    contact: { it: "contatti", en: "contact" },
  },
  home: {
    workHeading: { it: "I miei lavori", en: "My work" },
    aboutLabel: { it: "Chi sono", en: "About me" },
    stackLabel: {
      it: "Gli strumenti che mi piacciono di più",
      en: "The tools I enjoy most",
    },
  },
  project: {
    solution: { it: "Il progetto", en: "The project" },
    stack: { it: "Stack tecnologico", en: "Tech stack" },
    shots: { it: "Schermate", en: "Screens" },
  },
  a11y: {
    backToTop: { it: "Torna su", en: "Back to top" },
    nav: { it: "Navigazione principale", en: "Main navigation" },
    langGroup: { it: "Lingua / Language", en: "Language / Lingua" },
    skip: { it: "Vai al contenuto", en: "Skip to content" },
  },
  footer: {
    role: { it: "Full-stack developer", en: "Full-stack developer" },
    /** Labels the row of marks, which is seven guesses without it. */
    reach: {
      it: "Dove trovarmi",
      en: "Where to find me",
    },
  },
} satisfies Record<string, Record<string, L10n>>;

/* -------------------------------------------------------------------------- */
/* 404                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The 404, in both languages. There are two exported files, not one bilingual
 * page: /en/404/ answers for anything missing under /en/, and out/404.html for
 * everything else, so a reader is never handed a language they did not ask for.
 *
 * `other` is keyed by the language it points at, since the link to the other
 * side has to be written in the language it leads to.
 */
export const NOT_FOUND = {
  title: { it: "Pagina non trovata", en: "Page not found" },
  desc: {
    it: "Questo indirizzo non porta da nessuna parte.",
    en: "This address does not lead anywhere.",
  },
  home: { it: "Torna alla home", en: "Back to the home page" },
  other: { it: "Versione italiana", en: "English version" },
  meta: {
    title: {
      it: "Pagina non trovata · Omar Bayadi",
      en: "Page not found · Omar Bayadi",
    },
    description: {
      it: "Questo indirizzo non esiste su omarbayadi.com.",
      en: "This address does not exist on omarbayadi.com.",
    },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Hero: the split face                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Two halves of the same portrait, one per side of the work. The claim the
 * site leads with, "dalla logica al design", is the wording these two pick up,
 * and `HOME_META` carries the same words.
 *
 * Design on the left, logic on the right, so the two read in the order the
 * claim states them. The left word was "interfaccia" until it was read aloud
 * to a client: it named a part of a program to someone who was asking for a
 * website. This one names what the work is, and being the same word in both
 * languages it also lets the pair balance, six letters against six.
 *
 * Both descriptions are noun phrases rather than sentences: one comma to
 * separate what is on offer, no full stop at the end. They sit either side of
 * the same face and are read as a pair, so they are punctuated as a pair.
 */
export const HERO = {
  /** Left half: the surface people actually touch. */
  interface: {
    title: { it: "design", en: "design" },
    desc: {
      it: "Template e siti web su misura, SEO e assistenza",
      en: "Templates and websites made to measure, SEO and support",
    },
  },
  /** Right half: the code side. */
  logic: {
    title: { it: "logica", en: "logic" },
    desc: {
      it: "Applicazioni desktop, gestionali e app mobile",
      en: "Desktop applications, management software and mobile apps",
    },
  },
  /** Read by screen readers in place of the two decorative half-portraits. */
  photoAlt: {
    it: "Omar Bayadi, full-stack developer",
    en: "Omar Bayadi, full-stack developer",
  },
} as const;

/**
 * The about section: prose plus the stack.
 *
 * The prose speaks to the same reader as the hero, someone who has a business
 * and not a repository, so it names no framework. The technical names all live
 * in `stack` below, where a reader who wants them knows to look.
 *
 * Three plain sentences: the job title, what gets built, and the one habit the
 * hero has no room for, the photographs and video shot at a nearby business.
 * Nothing is said about how any of it turns out.
 *
 * The city stands next to the job title rather than in its own sentence: it is
 * a fact about the work, not an announcement. `site.test.ts` holds the prose
 * to `PLACE.home`, so a move cannot leave the page and the address in the
 * Person schema naming different towns.
 *
 * The last sentence says "in zona" and names no second town. It used to name
 * Modena, so that a reader could tell whether the sentence meant them, and
 * that was dropped on purpose: the shorter phrase is the one Omar wants read.
 * `PLACE.nearby` is still the second `workLocation` in the Person schema,
 * which is now the only place the site states it.
 *
 * Written impersonally: the reader is never addressed as "tu", here or
 * anywhere else on the site.
 */
export const ABOUT = {
  desc: {
    it:
      "Sono uno sviluppatore full-stack di Reggio Emilia. Realizzo siti web, " +
      "gestionali, app desktop e mobile curando ogni aspetto " +
      "dell'applicazione, dal database all'interfaccia. Per le attività in " +
      "zona, solitamente dopo una prima chiacchierata, mi occupo anche delle " +
      "riprese, del montaggio video e delle fotografie per la realizzazione " +
      "dei siti vetrina.",
    en:
      "I am a full-stack developer from Reggio Emilia. I build websites, " +
      "management software, desktop and mobile apps, looking after every " +
      "part of the application, from the database to the interface. For " +
      "businesses in the area, usually after a first conversation, I also " +
      "take care of the filming, the video editing and the photographs that " +
      "go into the showcase site.",
  },
  stack: ["Python / Django", "React", "Flutter"],
} as const;

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export type SocialId =
  "whatsapp" | "instagram" | "discord" | "email" | "github" | "gitlab" | "linkedin";

export interface Social {
  id: SocialId;
  label: string;
  href: string;
  /** Listed in the Person schema so search engines can tie the profiles together. */
  sameAs: boolean;
  /**
   * The colour the mark carries in its own brand, worn on hover in the footer.
   * Gmail has none here: its envelope wears four at once, so that one hover is
   * written per part in `globals.css` instead.
   */
  brand?: string;
}

export const SOCIALS: Social[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/393519498296",
    sameAs: false,
    brand: "#25D366",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/omar_bayadi/",
    sameAs: true,
    brand: "#E4405F",
  },
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.com/users/434084025410519050",
    sameAs: false,
    brand: "#5865F2",
  },
  {
    id: "email",
    label: "Email",
    /**
     * Gmail's compose window rather than a mailto:, which on a machine with no
     * mail client configured opens nothing at all. The link carries no subject
     * or body: what the message says is the reader's business.
     */
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}`,
    sameAs: false,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Omarone529",
    sameAs: true,
    brand: "#181717",
  },
  {
    id: "gitlab",
    label: "GitLab",
    href: "https://gitlab.com/Omar_Bayadi",
    sameAs: true,
    brand: "#FC6D26",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/omar-bayadi-287453238",
    sameAs: true,
    brand: "#0A66C2",
  },
];

/* -------------------------------------------------------------------------- */
/* Home metadata                                                              */
/* -------------------------------------------------------------------------- */

/**
 * What a search result and a shared link say about the home page.
 *
 * These are read outside the site, by people who have not seen it yet, so they
 * name the work plainly and stop. The description carries the words someone
 * would actually type; the shorter one is the social card, and doubles as the
 * description in the Person schema.
 */
export const HOME_META = {
  title: {
    it: "Omar Bayadi · Full-stack Developer · Reggio Emilia",
    en: "Omar Bayadi · Full-stack Developer · Reggio Emilia",
  },
  description: {
    it:
      "Omar Bayadi, sviluppatore full-stack di Reggio Emilia. Siti, " +
      "gestionali, app desktop e mobile, dal database all'interfaccia. " +
      "Python, Django, React, Flutter.",
    en:
      "Omar Bayadi, full-stack developer from Reggio Emilia. Websites, " +
      "management software, desktop and mobile apps. Python, Django, React, " +
      "Flutter.",
  },
  ogDescription: {
    it: "Siti, gestionali, app desktop e mobile, dal database " + "all'interfaccia.",
    en:
      "Websites, management software, desktop and mobile apps, from the " +
      "database to the interface.",
  },
} as const;

/**
 * Fed to the Person schema on the home page. Every name here is one a case
 * study actually lists, so the claim can be checked against the work.
 */
export const KNOWS_ABOUT = [
  "Python",
  "Django",
  "Django REST framework",
  "FastAPI",
  "React",
  "TypeScript",
  "Flutter",
  "Electron",
  "Docker",
  "PostgreSQL",
  "Three.js",
];
