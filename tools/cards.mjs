#!/usr/bin/env node

/*
  Draws the social cards, from the site that is already built.

  A card is the picture a link preview shows, and it is the one part of the
  site nobody ever sees while working on it: it lives in a crawler's cache and
  surfaces months later, in someone else's chat window. The first set was drawn
  by hand and then stayed put through a whole redesign, showing a page that no
  longer existed. This tool exists so that cannot happen twice.

  So nothing here is drawn from scratch. It reads `out/`, cuts the real markup
  and the real strings out of the built pages and links the real compiled
  stylesheets, which is what brings the design tokens, the card rules and the
  self-hosted Figtree along with them. The personal card is the name, the
  page's own `og:description` and the tags the about section lists. A project
  card is that project's logo frame, title and blurb, lifted out of the home
  page with the tint and the accent colours already on them. Change a tint, a
  title or a line of copy and the card carrying it changes with the next run;
  there is no second copy of any of it here.

  What this file does own is the arrangement: what goes where inside a frame
  1500 by 787, which is a shape no page on the site has.

  Usage:

    npm run build && node tools/cards.mjs

  Chrome draws them. It is already on the machines this is run from, it is the
  renderer the cards are eventually looked at through anyway, and it keeps the
  repo at zero image dependencies.
*/

import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const ASSETS = join(ROOT, "public", "assets");
/** Where the pages being photographed are put, inside `out/` so that the
    absolute paths in the markup and the stylesheets resolve as they do live. */
const STAGE = join(OUT, "__cards");

/** The card, in pixels. The ratio every platform crops towards is 1.91:1. */
const CARD = { width: 1500, height: 787 };

/**
 * How long to let a page stand after its fonts have arrived.
 *
 * Nothing on these pages moves: they carry no script, and the only animation
 * in the rules they borrow is a transition waiting for a hover that will never
 * come. This is for the reflow that swapping the fallback face for Figtree
 * costs, which `document.fonts.ready` promises has been decided and not that
 * it has been drawn.
 */
const SETTLE_MS = 400;

/**
 * The home page each language is cut from, and where its case studies live.
 * Every card exists in both, because every card carries a word of the language
 * it belongs to.
 */
const SOURCE = {
  it: { file: "index.html", base: "/progetti/" },
  en: { file: "en/index.html", base: "/en/projects/" },
};

/* -------------------------------------------------------------------------- */
/* Reading the built site                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The class Next puts on `<html>`, which is where next/font declares the
 * `--font-sans` the body is set in. Without it the cards come out in Times.
 *
 * @param html a built page
 * @returns the class attribute's value
 */
function fontClass(html) {
  return html.match(/<html[^>]*class="([^"]*)"/)[1];
}

/**
 * Every stylesheet the built page loads, in the order it loads them.
 *
 * @param html a built page
 * @returns the hrefs, deduplicated
 */
function stylesheets(html) {
  const hrefs = html.match(/\/_next\/static\/[^"]*\.css/g) ?? [];
  return [...new Set(hrefs)];
}

/**
 * The markup of one element, from an opening tag to its matching close.
 *
 * It counts nothing: none of the handful of elements this is asked for holds
 * another of its own kind, so the first closing tag after the opening one is
 * the right one. The day one of them does, this needs a real parser, and
 * needing a real parser would be a sign the file had outgrown the job.
 *
 * @param html a built page
 * @param opening a string that appears inside the opening tag, e.g. a class
 * @param tag the element's tag name
 * @returns the element, opening and closing tags included
 */
function element(html, opening, tag) {
  const at = html.indexOf(opening);
  if (at < 0) throw new Error(`no ${tag} matching ${opening} in the built page`);
  const start = html.lastIndexOf(`<${tag}`, at);
  const end = html.indexOf(`</${tag}>`, at);
  return html.slice(start, end + tag.length + 3);
}

/**
 * Every project on the home page, in the order the grid lists them.
 *
 * The slug is read off the link rather than from `content/projects.ts`, so a
 * project added there appears here on the next build with nothing to update.
 * The title keeps its two spans, which is what carries the accent colours.
 *
 * @param html a built home page
 * @param base where that page's case studies live, e.g. `/progetti/`
 * @returns each project's slug, logo frame, title markup, type and blurb
 */
function projects(html, base) {
  const links = new RegExp(`href="${base}([^"/]+)/"`, "g");
  const slugs = [...html.matchAll(links)].map((match) => match[1]);

  return [...new Set(slugs)].map((slug) => {
    const card = element(html, `href="${base}${slug}/"`, "a");
    const body = element(card, 'class="card-body"', "div");
    // What the card says under the title, in order: the kind of thing it is,
    // then the one-sentence blurb. Read from after the title, because the
    // arrow above it is an svg and the first "<p" in the body is a <path>.
    const lines = [
      ...body.slice(body.indexOf("</h3>")).matchAll(/<p[^>]*>(.*?)<\/p>/g),
    ];

    return {
      slug,
      media: element(card, 'class="card-media"', "div"),
      title: element(card, "<h3", "h3").replace(/<\/?h3[^>]*>/g, ""),
      type: lines[0][1],
      core: lines[1][1],
    };
  });
}

/* -------------------------------------------------------------------------- */
/* The pages that get photographed                                            */
/* -------------------------------------------------------------------------- */

/** The site's own address, shown on every card. Read from the built sitemap so
    it cannot drift from `SITE.url`. */
function siteHost() {
  const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
  return sitemap.match(/<loc>https?:\/\/([^/<]+)/)[1];
}

/**
 * Whose site it is and what they do, off the heading the hero carries for a
 * screen reader. Typed here it would be two more constants to keep in step
 * with `content/site.ts`; read off the page it is the same string the page is.
 *
 * @param html a built page
 * @returns the site's name and the role beside it
 */
function identity(html) {
  const heading = element(html, 'class="sr-only"', "h1")
    .replace(/<!--.*?-->|<[^>]*>/g, "")
    .trim();
  const [name, role] = heading.split(" · ");
  return { name, role };
}

/**
 * The one line the home page introduces itself with, which is the same line
 * the preview prints beside the picture. It is on the card too because a
 * reader scrolling a chat sees the picture before anything under it.
 *
 * @param html a built page
 * @returns the page's og:description
 */
function summary(html) {
  return unescape(html.match(/property="og:description"[^>]*content="([^"]+)"/)[1]);
}

/**
 * Turns the entities a built attribute carries back into text, so a line with
 * an apostrophe in it does not reach the card as `&#x27;`.
 *
 * @param text a value read out of an attribute
 * @returns the same text, readable
 */
function unescape(text) {
  return text
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * The stack, as the about section lists it: three rounded tags naming the
 * tools, which is the one place on the site where technology is written down.
 *
 * @param html a built home page
 * @returns the markup of the tag list
 */
function stack(html) {
  return element(html, 'class="tag"', "ul");
}

/**
 * The file a page has already told the world its card lives in.
 *
 * This is the only thing keeping the pictures and the markup on the same
 * names, and it runs in the one direction that cannot drift: `content/` says
 * where the card is, the page ships that in its `og:image`, and this reads it
 * back and writes the picture exactly there. Nothing here knows how the name
 * is built, so changing the convention is a change to one function in
 * `content/projects.ts` and nothing else.
 *
 * @param html a built page
 * @returns the card's file name, e.g. `synapsi-card-it.png`
 */
function target(html) {
  const declared = html.match(/property="og:image"[^>]*content="([^"]+)"/);
  if (!declared) throw new Error("a built page declares no og:image");
  return declared[1].split("/").pop();
}

/**
 * Wraps a fragment in a document that loads the site's own stylesheets.
 *
 * @param source the built page the fragment came from
 * @param body the markup to draw
 * @param style the arrangement, which is the only CSS this file writes
 * @returns a complete page, sized to the card
 */
function page(source, body, style) {
  const links = stylesheets(source)
    .map((href) => `<link rel="stylesheet" href="${href}">`)
    .join("");

  return `<!DOCTYPE html>
<html class="${fontClass(source)}"><head><meta charset="utf-8">${links}
<style>
  html, body { margin: 0; padding: 0; }
  body {
    width: ${CARD.width}px;
    height: ${CARD.height}px;
    overflow: hidden;
    background: var(--color-page);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
${style}
</style></head><body>${body}</body></html>`;
}

/**
 * The personal card: the name, the line under it and the tools.
 *
 * This is the arrangement the first card had, which was the right one and was
 * only ever wrong in its dressing: it was set in a serif nobody on the site
 * uses, on a cream ground taken from a palette that no longer exists, under a
 * sentence written to impress. What it says now is what the page says, in the
 * page's own type and colours, and every string comes off the built page:
 * `og:description` is the line, and the tags are the ones the about section
 * lists.
 *
 * The band across the top is the site's header, hairline included, and the
 * block under it is the rhythm every section on the site is built to: an
 * eyebrow, a heading, prose, then whatever the section holds.
 *
 * @param source the built home page in the language being drawn
 * @param host the site's address
 * @returns the page to photograph
 */
function personalCard(source, host) {
  const { name, role } = identity(source);

  const body = `<div class="og-bar">
  <span class="og-brand">${name}</span>
  <span class="og-host">${host}</span>
</div>
<div class="og-body">
  <p class="eyebrow og-role">${role}</p>
  <h2 class="og-name">${name}</h2>
  <p class="og-desc">${summary(source)}</p>
  <div class="og-stack">${stack(source)}</div>
</div>`;

  return page(
    source,
    body,
    `  .og-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 104px;
    padding: 0 5rem;
    border-bottom: 1px solid var(--color-rule);
  }
  .og-brand {
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--color-ink);
  }
  .og-host {
    font-size: 1.375rem;
    color: var(--color-muted);
  }
  .og-body {
    height: calc(100% - 104px);
    padding: 0 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  /* The eyebrow's own tracking, at the size the rest of this block is drawn
     at: it is set in 0.2rem, which is a fifth of the letter at 14px and a
     fifteenth of it here, so scaling the type without it loses the spacing
     that makes the line read as an eyebrow at all. */
  .og-role {
    margin: 0;
    font-size: 1.625rem;
    letter-spacing: 0.37rem;
  }
  .og-name {
    margin: 1.75rem 0 0;
    font-size: 9rem;
    line-height: 1.05;
    letter-spacing: -0.06em;
    font-weight: 700;
    color: var(--color-ink);
  }
  .og-desc {
    margin: 2.25rem 0 0;
    max-width: 64rem;
    font-size: 2.25rem;
    line-height: 1.45;
    color: var(--color-muted);
  }
  /* The about section's own tags, let up to the size everything else here is.
     Their padding and type are written in rem, so a font-size on the list
     around them would not have moved either. */
  .og-stack { margin-top: 3rem; }
  .og-stack ul { gap: 0.75rem; }
  .og-stack .tag {
    font-size: 1.5rem;
    padding: 0.55rem 1.6rem;
  }`,
  );
}

/**
 * A project card: the logo in its tinted frame, the title beside it.
 *
 * It says what the home page's own card says, in the same order: the title in
 * its accent colours, the kind of thing it is, then the one sentence that
 * explains it. The blurb is on the picture and not only beside it because a
 * preview is scrolled past before it is read, and half the clients that draw
 * one crop or drop the text under it.
 *
 * The white box, the tint, the radii and the accent colours on the title are
 * the site's own. Only the size is new: the frame is a little over twice the
 * one in the grid, because a card has to survive being shrunk again. The
 * ground is the footer's grey rather than the work section's, which is a step
 * darker: white on #fafafa is a card the eye finds because the page around it
 * moves, and a preview has no page around it.
 *
 * @param source the built home page in the language being drawn
 * @param project one entry from `projects()`
 * @param host the site's address
 * @returns the page to photograph
 */
function projectCard(source, project, host) {
  const body = `<div class="og-card">
  <div class="og-frame">${project.media}</div>
  <div class="og-text">
    <h2 class="og-title">${project.title}</h2>
    <p class="og-type">${project.type}</p>
    <p class="og-core">${project.core}</p>
    <p class="og-host">${host}</p>
  </div>
</div>`;

  return page(
    source,
    body,
    `  body {
    background: var(--color-footer);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .og-card {
    display: flex;
    align-items: center;
    gap: 3rem;
    width: 1340px;
    padding: 2rem;
    background: var(--color-card);
    border-radius: 24px;
    box-shadow: 0 3px 12px 0 rgb(0 0 0 / 0.16);
  }
  .og-frame { width: 620px; flex: none; }
  .og-frame .card-media { border-radius: 16px; }
  .og-text { min-width: 0; }
  .og-title {
    margin: 0;
    font-size: 3.25rem;
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 700;
    color: var(--color-ink);
  }
  .og-type {
    margin: 0.75rem 0 0;
    font-size: 1.625rem;
    line-height: 1.3;
    color: var(--color-muted);
  }
  .og-core {
    margin: 1.5rem 0 0;
    font-size: 1.75rem;
    line-height: 1.45;
    color: var(--color-ink);
  }
  .og-host {
    margin: 2rem 0 0;
    font-size: 1.25rem;
    color: var(--color-muted);
  }`,
  );
}

/* -------------------------------------------------------------------------- */
/* Chrome                                                                     */
/* -------------------------------------------------------------------------- */

/** Where Chrome is, on the platforms this has been run from. */
const CHROME_PATHS = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];

/** @returns the first Chrome that exists, or throws saying none does */
function chromePath() {
  const found = CHROME_PATHS.find((path) => path && existsSync(path));
  if (!found) throw new Error("no Chrome found; set CHROME to its path");
  return found;
}

/** @param ms how long to wait */
function wait(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

/**
 * A DevTools connection to a page, reduced to the two things wanted of it.
 *
 * @param endpoint the websocket URL Chrome advertises for the page
 * @returns send, which resolves with a command's result, and close
 */
async function devtools(endpoint) {
  const socket = new WebSocket(endpoint);
  const pending = new Map();
  let last = 0;

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const waiting = pending.get(message.id);
    if (!waiting) return;
    pending.delete(message.id);
    if (message.error) waiting.fail(new Error(message.error.message));
    else waiting.done(message.result);
  });

  await new Promise((open, fail) => {
    const refused = () => fail(new Error("Chrome refused the connection"));
    socket.addEventListener("open", open, { once: true });
    socket.addEventListener("error", refused, { once: true });
  });

  return {
    send(method, params = {}) {
      return new Promise((done, fail) => {
        const id = ++last;
        pending.set(id, { done, fail });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close: () => socket.close(),
  };
}

/**
 * Starts a headless Chrome and connects to its first page.
 *
 * The port is left to Chrome and read back out of the profile it writes it
 * into, so two runs at once cannot collide on a number chosen here.
 *
 * @returns the browser process and a connection to its page
 */
async function browser() {
  const profile = await mkdtemp(join(tmpdir(), "portfolio-cards-"));
  const chrome = spawn(
    chromePath(),
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  const portFile = join(profile, "DevToolsActivePort");
  let port = "";
  for (let tries = 0; tries < 100 && !port; tries++) {
    await wait(100);
    if (existsSync(portFile)) port = readFileSync(portFile, "utf8").split("\n")[0];
  }
  if (!port) throw new Error("Chrome did not start");

  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = targets.find((target) => target.type === "page");
  return { chrome, page: await devtools(page.webSocketDebuggerUrl) };
}

/**
 * Photographs one page.
 *
 * @param page a DevTools connection
 * @param url what to load
 * @returns the PNG
 */
async function shoot(page, url) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: CARD.width,
    height: CARD.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page.send("Page.navigate", { url });
  // Loaded, lettered and finished moving, in that order. The fonts matter as
  // much as the animations: photographed before they arrive, every card comes
  // out set in the fallback and nothing about it looks wrong enough to notice.
  await page.send("Runtime.evaluate", {
    expression: `new Promise((ready) => {
      if (document.readyState === "complete") ready();
      else addEventListener("load", ready, { once: true });
    }).then(() => document.fonts.ready)`,
    awaitPromise: true,
  });
  await wait(SETTLE_MS);

  const { data } = await page.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: CARD.width, height: CARD.height, scale: 1 },
  });
  return Buffer.from(data, "base64");
}

/* -------------------------------------------------------------------------- */
/* Serving `out/`                                                             */
/* -------------------------------------------------------------------------- */

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
};

/**
 * Serves `out/` on a port of the system's choosing.
 *
 * The pages have to be fetched over http rather than opened as files: the
 * stylesheets and the images they name are all absolute, and a file:// page
 * resolves those against the drive's root.
 *
 * @returns the server and the address it answers on
 */
async function serve() {
  const server = createServer(async (request, response) => {
    const path = join(OUT, decodeURIComponent(request.url.split("?")[0]));
    try {
      response.writeHead(200, { "content-type": TYPES[extname(path)] ?? "" });
      response.end(await readFile(path));
    } catch {
      response.writeHead(404).end();
    }
  });

  await new Promise((listening) => server.listen(0, "127.0.0.1", listening));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

/* -------------------------------------------------------------------------- */

/** Draws every card and writes it into `public/assets/`. */
async function main() {
  if (!existsSync(join(OUT, "index.html"))) {
    throw new Error("no built site in out/; run npm run build first");
  }

  const host = siteHost();
  const cards = [];

  for (const { file, base } of Object.values(SOURCE)) {
    const source = readFileSync(join(OUT, file), "utf8");
    cards.push({ file: target(source), html: personalCard(source, host) });

    for (const project of projects(source, base)) {
      const study = readFileSync(join(OUT, base, project.slug, "index.html"), "utf8");
      cards.push({ file: target(study), html: projectCard(source, project, host) });
    }
  }

  rmSync(STAGE, { recursive: true, force: true });
  mkdirSync(STAGE, { recursive: true });
  for (const card of cards) writeFileSync(join(STAGE, `${card.file}.html`), card.html);

  const { server, origin } = await serve();
  const { chrome, page } = await browser();

  try {
    for (const card of cards) {
      const png = await shoot(page, `${origin}/__cards/${card.file}.html`);
      writeFileSync(join(ASSETS, card.file), png);
      console.log(`${card.file}  ${(png.length / 1024).toFixed(0)} KB`);
    }
  } finally {
    page.close();
    chrome.kill();
    server.close();
    rmSync(STAGE, { recursive: true, force: true });
  }
}

await main();
