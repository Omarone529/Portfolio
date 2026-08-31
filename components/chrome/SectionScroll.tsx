"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** The hash points at something on this page and the click was a plain left click. */
function isInPageAnchor(event: MouseEvent): HTMLElement | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const anchor = (event.target as Element | null)?.closest("a");
  if (!anchor || anchor.target === "_blank") return null;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname !== window.location.pathname || !url.hash) return null;

  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

/** Drops the hash, leaving the path and any query string where they are. */
function dropHash(): void {
  if (!window.location.hash) return;
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

/**
 * Keeps section anchors out of the address bar, so that reloading returns to
 * the top of the page rather than to the middle of it.
 *
 * The anchors themselves stay: they are what the old site's inbound links
 * point at, and without script they are the only thing that works. What
 * changes is that the hash is acted on and then forgotten, in three places.
 *
 * A click scrolls from here instead of navigating, so the hash is never
 * written. Arriving with one (an old link, a shared address) still scrolls to
 * the section, and the hash goes once the page has settled. A reload starts at
 * the top, which needs the browser's own scroll restoration turned off for
 * that one load: left on, it would put the reader back where they were and
 * undo the point of all this.
 *
 * Scrolling is left to `scroll-behavior` in globals.css, which is already
 * turned off under prefers-reduced-motion. There is nothing to decide here.
 */
export default function SectionScroll() {
  const pathname = usePathname();

  // Runs again after a navigation between pages, which can arrive with a hash
  // of its own: a case study links back to "/#lavori".
  useEffect(() => {
    let frame = 0;
    const settle = () => {
      frame = window.requestAnimationFrame(dropHash);
    };

    if (document.readyState === "complete") {
      settle();
      return () => window.cancelAnimationFrame(frame);
    }

    // Before load the browser may still be adjusting for images it has not
    // measured yet, and it needs the hash to do it.
    window.addEventListener("load", settle, { once: true });
    return () => {
      window.removeEventListener("load", settle);
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const navigation = window.performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;

    if (navigation?.type === "reload") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      // Restoration only ever runs for the load that is happening now. Handing
      // it back afterwards leaves back and forward behaving as they should.
      window.addEventListener(
        "load",
        () => {
          window.requestAnimationFrame(() => {
            window.history.scrollRestoration = "auto";
          });
        },
        { once: true },
      );
    }

    const onClick = (event: MouseEvent) => {
      const target = isInPageAnchor(event);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView();

      // Native anchors move the keyboard focus as well as the view. Sections
      // are not focusable on their own, so they are made focusable for as long
      // as they hold it. Decorative targets are skipped: #top is an empty span.
      if (target.getAttribute("aria-hidden") === "true") return;
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
          once: true,
        });
      }
      target.focus({ preventScroll: true });
    };

    // Capture, so that preventDefault lands before next/link reads it: its own
    // handler sits on the React root, which is inside the document and would
    // otherwise have written the hash already.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
