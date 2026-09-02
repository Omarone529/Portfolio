# omarbayadi.com

## This is NOT the Next.js you know

This is Next.js 16 with the App Router. It has breaking changes: APIs,
conventions and file structure may all differ from your training data. Read the
relevant guide in `node_modules/next/dist/docs/` before writing any code, and
heed deprecation notices.

Next normally writes that notice into `AGENTS.md` and `CLAUDE.md` on every run.
`agentRules: false` in `next.config.ts` turns that off, so this file is not
overwritten; the notice is reproduced above instead.

## What this is

The personal portfolio at https://omarbayadi.com. It replaces a hand written
static site whose content was good and whose design was not.

The visual language follows https://www.adhamdannaway.com/: a split face hero,
white cards with a shadow that lifts, reveal on scroll. The greys, the 12px/8px
radius pair, the two card shadows and the 0.3s transitions are transcribed from
his stylesheet and live in `app/globals.css`. One value deviates on purpose:
`--color-muted` is six units darker than his, because his grey clears 4.5:1 on
white and this site also puts it on two tinted grounds, where it did not. The
comment above the token carries the measurements.

It is a static export served by Netlify. There is no backend, no database, no
runtime and no secret anywhere in the repo.

## Commands

```bash
npm run dev            # http://localhost:3000
npm run build          # writes out/
npm run cards          # redraws the social cards, needs out/ to be current
npx serve out          # the static site exactly as Netlify serves it
npm test               # vitest
npx eslint .           # must be clean, warnings included
npm run format         # prettier over the tree
```

## Where things live

```
content/projects.ts   the 5 case studies, it+en, single source of truth
content/site.ts       name, hero copy, about, stack, socials, routes, anchors
content/privacy.ts    the informativa and the notice that points at it, it+en
lib/seo.ts            title/description/canonical/hreflang/OG/Twitter, from one input
components/pages/     HomePage and ProjectPage, the body each route renders
components/chrome/    the frame around them: shell, header, footer, banners
components/hero/      SplitFace and its stylesheet, the one animated thing
components/project/   the card and the logo frame a project is drawn with
components/*.tsx      Icons, Reveal, JsonLd: at the root because all four use them
app/(it)/             Italian, at the root       ->  /, /progetti/<slug>/, /privacy/
app/(en)/             English                    ->  /en/, /en/projects/<slug>/, /en/privacy/
app/favicon.ico       the tab icon, and app/icon.svg beside it for the rest
public/assets/        every image, webp only, plus the png social cards
tools/cards.mjs       redraws the social cards from the site in out/
tools/faces.swift     measures the face in a photograph, run before hero.swift
tools/hero.swift      cuts the hero portrait out of a photograph
tools/shoulder.swift  draws the shoulder contour, run after hero.swift
```

Adding a project means adding one entry to `PROJECTS`. Both language pages, the
home card, the JSON-LD, the sitemap and the previous/next navigation follow from
it. There is no second list to update.

## Things that will bite you

These are not preferences. Each one is a trap that has already been hit here.

- **Two root layouts, on purpose.** `app/(it)/layout.tsx` and
  `app/(en)/layout.tsx` each render their own `<html lang>`. That is the only
  way the attribute can be correct in both languages. It also means there is no
  `app/layout.tsx`, so `app/not-found.tsx` renders without a layout and cannot
  set `lang` itself.
- **The site talks to nobody.** There is no analytics, no cookie and no third
  party request of any kind: fonts are self-hosted by next/font at build time
  and every image is served from the same origin. Google Analytics was here and
  was removed with its banner, because a portfolio that measures its visitors
  owes them an informativa, and the numbers were not worth the page. Adding any
  tag back brings that duty with it: it is a legal decision before it is a
  technical one.
- **The informativa says what is left, and it is not a consent banner.**
  `/privacy/` exists because two things are personal data even here: the log
  Netlify writes for every request, and a message that arrives through one of
  the contact links. `PrivacyNotice` states that there are no cookies and
  points at the page; it has no accept button, because there is nothing to
  accept and a banner that asks anyway teaches the reader to dismiss a real
  request unread. Its one piece of storage is the dismissal, in localStorage,
  keyed by `PRIVACY.updated` so a rewritten informativa shows the notice again.
  That key is the only thing this site ever writes to a reader's device, and
  the informativa names it. Anything else written there has to be named there
  too, or the page becomes false.
- **`.reveal` starts at opacity 0.** With no script there is no observer, so a
  `<noscript>` rule in `RootShell.tsx` pins it open. Do not remove it. The
  observer in `Reveal.tsx` also carries a 10000px top `rootMargin`, and that is
  not a cue either: an observer only reports a threshold being crossed, and a
  thumb can flick a phone past a whole card between two frames, so the card
  goes from below the fold to above the screen without one sampled frame in
  between and stays blank for the rest of the visit. Reaching the root up the
  page makes "already scrolled past" count as intersecting. Shrink that margin
  and the sections start disappearing again, on phones only.
- **The hero cannot be tracked through `style.opacity`.** Every layer in
  `SplitFace` has an entry animation that fills forwards, and a CSS animation
  beats an inline style in the cascade, so a keyframed property stays at
  whatever the keyframe left it and the assignment is thrown away without an
  error. The pointer tracking writes `filter: opacity()` instead: the entry
  owns `opacity` and `transform` on the halves, the pointer owns `filter`.
- **`sitemap.ts` and `robots.ts` need `export const dynamic = "force-static"`.**
  The export build fails without it.
- **Anchors differ per language** and the Italian ones are inherited
  (`#lavori`, `#chi-sono`). The Italian home URL has not moved, so links out
  there still point at them. `SECTION_ID` in `content/site.ts` is the map.
- **The hash never stays in the address bar.** `SectionScroll` scrolls in-page
  links itself and drops the hash, and a reload starts at the top. An anchor
  arriving from outside is still honoured first, which is what keeps those
  inherited links working. Any new in-page link goes through it automatically,
  so do not expect `location.hash` to hold anything.
- **Images ship as webp only.** The png twins were deleted: 2.6 MB of files
  that only a browser older than Safari 14 would ever have asked for. There is
  no `<picture>` left anywhere, `Project.image` has one path, and
  `@next/next/no-img-element` is off in `eslint.config.mjs` because a static
  export has no optimizer for `next/image` to use. The social cards stay png:
  a link preview is drawn by a crawler, and several of them show a webp as no
  picture at all.
- **The social cards are drawn, not kept.** Every `*-card-*.png` and both
  `og-image-*.png` are output of `tools/cards.mjs`; nothing in `public/assets/`
  is edited by hand. The tool reads `out/`, cuts the real markup and the real
  strings out of the built pages and links the compiled stylesheets, so a tint,
  a title or a line of copy changes the cards on the next run. The personal
  card is the name, the home page's own `og:description` and the tags the about
  section lists; a project card is its logo frame, title, type and blurb. It
  also reads each page's own `og:image` to learn where to write, which means
  the file name is decided in `content/` and nowhere else: `projectCard()`
  derives it from the slug, so a project has a card without declaring one.
  This is why the first set went stale through an entire redesign, and why
  `npm run build && npm run cards` belongs in any change to a logo, a tint, a
  title or a blurb. The tests only check that the named files exist; that they
  are current is what running the tool is for.
- **`netlify.toml` carries 301s from the old URLs** (`/progetti/synapsi.html`,
  `/?lang=en` and the rest). They are what keeps the ranking those pages
  earned. Do not drop them when editing that file.
- **The hero speaks to clients, not developers.** The two sides say what gets
  built, not what it is built with: sites and templates on the left, desktop
  applications, management software and mobile apps on the right. The stack
  belongs further down the page, in `ABOUT`. The reference's block of code
  fragments opposite the brush strokes was removed for the same reason.

## Development principles

**KISS** Prefer the simplest solution that works. Avoid abstractions, layers or
generalization unless the complexity is already present and repeated.

**DRY** Extract duplicated logic into a shared function or module. If the same
pattern appears twice, it belongs in one place. Pure helpers go in `lib/`, data
in `content/`, anything rendered in `components/`. A component used by both
languages takes `lang` as a prop; it is never duplicated per language.

**Single responsibility** Every function does exactly one thing. Prefer many
small focused functions over one function that handles several concerns.

**TDD** When adding a feature, write the test first, then the implementation.
Tests define the expected behaviour; code satisfies them. The runner is Vitest
(`npm test`), and `lib/seo.test.ts` and `content/projects.test.ts` cover the
invariants worth guarding: canonical and hreflang agreeing across languages,
every project resolving in both, previous/next wrapping around. Layout and
animation are not tested; they are checked by eye in `npm run dev`.

**Mobile matters here** This is the opposite of the rule inherited from the
desktop app. A portfolio is read on phones, often from a link in a message, and
that is the visit that decides whether anyone reads further. Every layout is
built for a narrow screen first and widened with `md:` and `lg:`. Touch targets
stay at 44px, and the code block scrolls inside itself so the page never
scrolls sideways.

The hero is the same construction at every width, not a flat image below a
breakpoint: `SplitFace.module.css` writes its geometry in stage units and
multiplies each one by `--u`, which is what a stage unit is worth on the screen
at hand and resolves to exactly 1px once the stage is its full 1040px. The
component writes those units into custom properties and never touches a pixel.
What changes with the width is only the arrangement around it: the two words
take the row under the picture on a phone, stand either side of it from 48rem,
and move over the stage itself from 71.25rem. A finger drags the seam where a
pointer moves it, with an axis lock so that scrolling past does not.

**No placeholders** The site shows real content only. The hero portrait was a
grey silhouette during the build and is now the real photograph; nothing
fictional ships. If content for a section does not exist yet, the section does
not exist yet.

**The copy does not sell** Every visible string is written to interest the
reader, never to impress them. State what a thing is and stop. No promises, no
reassurance the reader did not ask for, no phrase that only works by implying
someone else does it worse ("without starting over", "unlike the usual"). If a
sentence would sound like boasting read aloud to a client, it is wrong, however
true it is. A short flat sentence that leaves a question open beats a long one
that closes every door.

The tone goes further than not selling: it must not come anywhere near showing
off. Nothing on this site says how good the work is, how much of it there has
been, or how much the writer enjoys it. No superlative, no count of years or
clients, no adjective applied to one's own work, no declaration of passion. Even
a true boast is out, and so is the modest phrasing of one.

What the copy is for is curiosity. A line has earned its place when the reader
finishes it wanting to ask something. That comes from being specific and from
stopping early: name a real detail of how the work actually goes, then leave the
outcome unsaid rather than spelling it out. Concrete and unfinished, never
impressive and complete. If a sentence could be pasted onto anyone else's site
without changing a word, it says nothing and is wrong, however well it reads.

The reader is never addressed directly. No "tu", no "la tua attività", no "you"
in the English either. A portfolio is read by someone who has not spoken to
anyone yet, and second person puts them in a conversation they did not agree to
have. Write the same sentence impersonally, or about the work rather than about
the reader. The generic "you" that describes how a product behaves in a case
study ("a portfolio you leaf through") is not this, and stays.

**No hardcoded scattered constants** There are no secrets in this repo and
nothing to put in an environment variable: the site is static and speaks to no
service at all. What the rule means here is that public constants still live in
one place, `content/site.ts`, and are never retyped in a component. A URL
literal inside a component is a bug.

**No emojis in code** Never in source, comments, docstrings or commit messages.

**No em-dashes** Never write the em-dash character, anywhere: not in UI copy,
not in comments, not in Markdown. Use a colon, a comma, parentheses or a full
stop, whichever the sentence actually calls for.

**No dashes in UI text either** A hyphen is not the way out of an em-dash. In
anything a reader sees, write the sentence instead. A missing value renders as
nothing at all, never as `-`. A qualifier goes in parentheses. Hyphens inside
words (`full-stack`, `self-hosted`) and in code are spelling, not punctuation,
and stay.

**Language** All code is written in English: variable names, function names,
comments, docstrings. The exception is the content layer. This site is bilingual,
so every visible string exists in both Italian and English and lives in
`content/`, typed as `L10n`. A visible string hardcoded in a component is a bug,
because it can only ever be in one language.

**Documentation** Every exported function, component and test carries a JSDoc
comment saying what it does, what it takes and what it returns. Tests document
the behaviour they verify. Comments explain why, not what; the code already says
what.

**Clean imports and no dead code** Before finishing a change, check that every
import is used and every function has a caller. Remove what does not; never
comment it out. This applies to files touched during a change, not only new
ones. The same goes for CSS: an unused class in a module is dead code.

**Format before committing** `.githooks/pre-commit` runs Prettier over staged
files and re-stages what it rewrote. Enable it once per clone:

```bash
git config core.hooksPath .githooks
```
