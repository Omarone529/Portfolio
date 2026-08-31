"use client";

import { useEffect, useState } from "react";
import { UI, type Lang } from "@/content/site";
import { ArrowUp } from "../Icons";

/**
 * Reading-progress bar and back-to-top button. Both are driven by one scroll
 * listener behind a rAF gate, so they cost a single layout read per frame
 * rather than two, the same arrangement the previous site used.
 */
export default function ScrollChrome({ lang }: { lang: Lang }) {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const read = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
      setShowTop(scrolled > 400);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(read);
      }
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      >
        <span
          className={
            "block h-full bg-[var(--color-muted)] " +
            "transition-[width] duration-150 ease-out"
          }
          style={{ width: `${progress}%` }}
        />
      </div>

      <a
        href="#top"
        aria-label={UI.a11y.backToTop[lang]}
        title={UI.a11y.backToTop[lang]}
        className={`icon-button fixed bottom-6 right-6 z-40 ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="h-[1.15rem] w-[1.15rem]" />
      </a>
    </>
  );
}
