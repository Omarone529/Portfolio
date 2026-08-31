import {
  KNOWS_ABOUT,
  PLACE,
  SITE,
  SOCIALS,
  absolute,
  homePath,
  projectPath,
  type Lang,
} from "@/content/site";
import { projectCard, projectTitle, type Project } from "@/content/projects";

/**
 * One name for the person and one for the site, the same on every page and in
 * both languages. Without them each page states an unrelated Person, and a
 * search engine has no way to tell that they are all the same one.
 */
const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

/**
 * Structured data, carried over from the hand-written pages and now derived
 * from the same content the page renders, so the two cannot disagree.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // A "<" inside a value would otherwise be free to close this script
          // element early. The escape is valid JSON and reads the same.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}

export function personSchema(lang: Lang, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.name,
    url: absolute(homePath(lang)),
    image: absolute(SITE.portrait),
    jobTitle: SITE.role,
    description,
    knowsAbout: KNOWS_ABOUT,
    // The town, then the pair of them the work reaches on foot. `areaServed`
    // would be the word for the second, but schema.org puts that on an
    // Organization and this is a Person, so the two places are stated as
    // `workLocation` instead, which a Person does carry. Only the locality is
    // given: there is no street to publish and no office to visit.
    address: {
      "@type": "PostalAddress",
      addressLocality: PLACE.home,
      addressCountry: PLACE.country,
    },
    workLocation: [PLACE.home, PLACE.nearby].map((name) => ({
      "@type": "Place",
      name,
    })),
    sameAs: SOCIALS.filter((s) => s.sameAs).map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["it", "en"],
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

/** Every case study, in the order the home page shows them. */
export function workListSchema(lang: Lang, projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absolute(projectPath(lang, project.slug)),
      name: projectTitle(project),
    })),
  };
}

export function projectSchema(lang: Lang, project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: projectTitle(project),
    url: absolute(projectPath(lang, project.slug)),
    description: project.meta.ogDescription[lang],
    // The screenshot the page is shared with, so the structured data and the
    // social card name the same picture. The logo is the fallback: it is what
    // a project with no screenshots yet still has.
    image: absolute(projectCard(project, lang)?.path ?? project.image.webp),
    inLanguage: lang,
    dateCreated: String(project.year),
    keywords: project.stack,
    // Enough of a Person to stand on its own on a page that carries no other,
    // and the same @id, so it is read as the one the home page describes.
    creator: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE.name,
      url: absolute(homePath(lang)),
    },
  };
}

export function breadcrumbSchema(
  lang: Lang,
  project: Project,
  workLabel: string,
  workAnchor: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absolute(homePath(lang)),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: workLabel,
        item: absolute(`${homePath(lang)}#${workAnchor}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: projectTitle(project),
        item: absolute(projectPath(lang, project.slug)),
      },
    ],
  };
}
