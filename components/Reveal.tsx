"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger, in milliseconds, applied as a transition-delay. */
  delay?: number;
  /** The element to render, when a div would be wrong: a grid item is an li. */
  as?: ElementType;
}

/**
 * Fades content up the first time it enters the viewport, then stops watching.
 * Same thresholds the previous site used, so the pacing is unchanged.
 *
 * The markup is server-rendered either way (only the data-visible flag is
 * client-side), so crawlers get the full text. The two ways this could leave
 * content stuck at opacity 0 are both handled in CSS rather than here: reduced
 * motion drops the whole transition, and a <noscript> rule in RootShell pins
 * .reveal open when no script will ever run. That keeps this effect to a plain
 * subscription, with setState only ever called from the observer's callback.
 */
export default function Reveal({ children, delay = 0, as }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      // The bottom margin is the entry cue: 12% of the block has to be 60px
      // clear of the fold before it fades up, which is the pacing the previous
      // site had.
      //
      // The top one is not a cue, it is the safety net, and it has to be there.
      // An observer only reports a threshold being crossed, and a thumb can
      // flick the page past a whole card between two frames: the card goes from
      // below the fold to above the screen without one sampled frame in
      // between, no callback is ever sent, and it stays at opacity 0 for the
      // rest of the visit while the reader scrolls on. Reaching the root up the
      // page makes "already scrolled past" intersecting too, so whatever was
      // skipped is caught on the next callback instead of being lost. The value
      // only has to be taller than the longest page here, which is 3600px.
      { threshold: 0.12, rootMargin: "10000px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className="reveal"
      data-visible={visible ? "true" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
