import type { Lang } from "@/content/site";
import type { Shot } from "@/content/projects";
import Reveal from "../Reveal";

interface ProjectShotsProps {
  shots: Shot[];
  lang: Lang;
}

/**
 * The screenshots of a project, two across from the large breakpoint.
 *
 * They pair up only there. These are dense desktop interfaces, and below
 * 64rem two of them side by side would each be narrower than a phone, so
 * under that width they take the whole row one at a time.
 *
 * The pair is aligned at the top and left to end where it ends. Stretching
 * both cards to the taller one squares the grid off, but the shots do not
 * share a shape, so the shorter card is squared off by adding empty white
 * under its caption, which is worse than a ragged edge.
 *
 * @param shots the pictures to draw, in the order they are read
 * @param lang which language to pull the caption and the alt text in
 * @returns the grid of figures, each fading up as it arrives
 */
export default function ProjectShots({ shots, lang }: ProjectShotsProps) {
  return (
    <ul className="grid items-start gap-8 lg:grid-cols-2">
      {shots.map((shot, i) => (
        <Reveal as="li" key={shot.webp} delay={(i % 2) * 60}>
          <figure className="shot">
            <img
              src={shot.webp}
              alt={shot.alt[lang]}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{shot.caption[lang]}</figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
