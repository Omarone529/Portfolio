"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRIVACY } from "@/content/privacy";
import { UI, privacyPath, type Lang } from "@/content/site";

/**
 * Where the dismissal is remembered.
 *
 * The revision date is part of the key on purpose: when the informativa is
 * rewritten the old key stops matching, and the notice comes back once for
 * everyone who had put it away. Nothing else has to be remembered to make
 * that happen.
 */
const STORAGE_KEY = `privacy-notice:${PRIVACY.updated}`;

/** How long the page is left alone before the notice arrives, in ms. */
const DELAY_MS = 400;

/** How long the fade out lasts, which is the .3s the rest of the site uses. */
const FADE_MS = 300;

/**
 * Reads the dismissal without ever throwing.
 *
 * A browser in private mode, or one told to block site data, raises on the
 * first touch of localStorage rather than returning nothing. Treating that as
 * "not dismissed" is the right answer: the notice shows again, which is a
 * repetition and not a failure.
 *
 * @returns true when this revision of the notice has already been put away
 */
function alreadyDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * The notice that opens with the site: no cookie, no tracking, and where to
 * read the rest.
 *
 * It asks for nothing. There is no cookie to consent to here, so a banner with
 * an accept button would be asking permission for something that does not
 * happen, and would teach the reader to dismiss a real request unread. It
 * states a fact and points at the page that carries the detail.
 *
 * Only the button puts it away. Opening the informativa is not a dismissal:
 * the strip is still there on the way back, because reading the page and
 * acknowledging the notice are two different acts.
 *
 * @param lang the language the notice speaks
 * @returns the fixed strip, or nothing once it has been put away
 */
export default function PrivacyNotice({ lang }: { lang: Lang }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alreadyDismissed()) return;
    // The wait lets the page arrive first: the hero opens on an animation of
    // its own, and a strip sliding in over it reads as an interruption.
    const id = window.setTimeout(() => setMounted(true), DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Two frames, not one. The first is where the browser lays the strip out
    // in its starting state; a transition asked for before that has nothing
    // to travel from and is dropped, leaving the notice to appear at once.
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [mounted]);

  if (!mounted) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to do: the notice will simply be shown again next time.
    }
    setOpen(false);
    // Unmounted only once the fade has run, so that focus does not sit inside
    // an element that is on its way out.
    window.setTimeout(() => setMounted(false), FADE_MS);
  };

  return (
    <section
      aria-label={UI.a11y.notice[lang]}
      className={
        // Above the back to top button, which shares this corner but only
        // appears past 400px of scroll, by which point the notice is usually
        // gone. The safe area keeps it clear of the home indicator.
        "fixed inset-x-0 bottom-0 z-50 px-4 " +
        "pb-[max(1rem,env(safe-area-inset-bottom))] " +
        "transition-[opacity,transform] duration-300 " +
        (open
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0")
      }
    >
      <div
        className={
          "mx-auto flex max-w-[40rem] flex-col gap-3 rounded-[var(--radius-card)] " +
          "bg-[var(--color-card)] px-5 py-4 shadow-[var(--shadow-card-hover)] " +
          "sm:flex-row sm:items-center sm:justify-between sm:gap-5"
        }
      >
        <p className="text-[0.9375rem] leading-[1.5] text-[var(--color-muted)]">
          {PRIVACY.notice.text[lang]}
        </p>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={privacyPath(lang)}
            className={
              "link-quiet flex min-h-11 items-center text-[0.9375rem] " +
              "underline underline-offset-4 md:min-h-0"
            }
          >
            {PRIVACY.notice.more[lang]}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="button-solid min-h-11 px-4 text-[0.9375rem] md:min-h-0 md:py-2"
          >
            {PRIVACY.notice.dismiss[lang]}
          </button>
        </div>
      </div>
    </section>
  );
}
