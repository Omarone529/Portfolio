"use client";

import { useEffect, useRef } from "react";
import type { Demo } from "@/content/projects";
import type { Lang } from "@/content/site";

interface ProjectDemoProps {
  demo: Demo;
  lang: Lang;
}

/**
 * The recording of a project, muted and looping in the same 16:9 frame the
 * logo sits in. It has no controls: it stands where a picture would, and is
 * read as one.
 *
 * It is started from script rather than by an autoplay attribute, because
 * autoplay would begin before hydration and could not be held back for a
 * reader who asked for reduced motion. With no button to stop it, that reader
 * gets the poster and nothing that moves.
 */
export default function ProjectDemo({ demo, lang }: ProjectDemoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A browser that refuses muted autoplay (Low Power Mode on iOS) rejects
    // here; the poster is then the right thing to leave in the frame.
    video.play().catch(() => {});
  }, []);

  return (
    <div className="card-media">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={demo.mp4}
        poster={demo.poster}
        aria-label={demo.label[lang]}
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}
