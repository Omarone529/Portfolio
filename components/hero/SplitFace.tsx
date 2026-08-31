"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { HERO, SITE, type Lang } from "@/content/site";
import styles from "./SplitFace.module.css";

/**
 * The hero, rebuilt from the construction used on adhamdannaway.com.
 *
 * It is not two half faces. It is the same composition rendered twice at full
 * width, painted and photographic, with two windows that slide and resize over
 * them. The windows always tile without a gap, so the seam is simply where
 * they meet, and it travels across the face as the pointer moves, or as a
 * finger drags it: to the left and the painting takes over, to the right and
 * the photograph does.
 *
 * Both windows share one mapping, composition x -> screen x + paintLeft, which
 * is what keeps the face continuous while the seam moves. The numbers, the
 * damping and the easings below are the reference's own.
 *
 * The seam moves once before anyone asks it to. It crosses the figure on load,
 * which is the only account of the composition a visitor who touches nothing
 * would otherwise get.
 *
 * None of this is written in pixels. Every number below is in stage units and
 * goes out to the stylesheet as a bare number; what a unit is worth on the
 * screen at hand is the stylesheet's business, and on the wide layout it is
 * worth exactly 1px. That is what lets a phone run the same hero.
 */

/** The stage, in the reference's units. Everything here derives from these. */
const STAGE = { width: 1040, height: 600 };
/** The composition, and the window that shows part of it at rest. */
const ART = { width: 840, window: 420, inset: 100 };
/** Pointer position that means "centred", and the seam's resting place. */
const CENTRE = STAGE.width / 2;

/**
 * The reference damps the pointer with `xp += (target - xp) / 12` on a 30fps
 * interval. Running that expression on rAF would damp twice as fast on a 60Hz
 * screen and four times on a 120Hz one, so the factor is rewritten against
 * elapsed time: the curve is the reference's, the sampling is smooth.
 */
const DAMPING = 1 / 12;
const REFERENCE_FRAME_MS = 1000 / 30;

/**
 * How far the seam runs, against the travel the reference gives it, and why
 * the two directions do not get the same.
 *
 * At 1 the chosen treatment takes the whole figure and the other stops being
 * in the picture at all, which is what the leaning below is meant to replace:
 * the seam should say which half is being looked at, not delete the other one.
 *
 * The reference can hold his at 1 and scale both directions alike, because his
 * subject is centred and square to the camera. This one is not. He is turned,
 * so the body runs a long way to the left of the nose the composition is
 * centred on and stops almost at once to the right of it: there are some four
 * hundred pixels of picture on one side of the resting seam and barely a
 * hundred on the other. Scaled the same, the seam runs off the edge of him
 * going right long before it has crossed him going left.
 *
 * Both are held well under the reference's travel now that the leaning says
 * which half is chosen. The seam only has to lean the same way; it does not
 * have to carry the whole message.
 */
const REACH = { paint: 0.2, photo: 0.4 };

/**
 * How long the opening takes.
 *
 * The page arrives on the photograph alone, holding the whole composition, and
 * the seam sets off from the figure's left edge towards its resting place at
 * the centre, leaving the painting behind it as it goes. It is the trick the
 * whole hero is built on, shown once to whoever never touches anything.
 *
 * The sweep runs in offsets rather than pointer positions because it has to go
 * past anything a pointer can ask for: REACH holds the seam well inside the
 * figure, and this has to clear the figure entirely.
 */
const ENTRY_MS = 1300;

/**
 * How far a finger travels before a touch counts as a drag on the seam rather
 * than the beginning of a scroll.
 */
const AXIS_LOCK_PX = 8;

/**
 * easeInOutCubic, and not the easeOutExpo everything else here is eased with.
 *
 * That curve is for something that arrives and settles: it spends half its
 * distance in the first tenth of its time, which is right for a card sliding
 * into place and wrong here, where the travelling is the whole point and a
 * seam that has already crossed the face by the time the picture has finished
 * fading in has not been seen at all. This one starts slow, which leaves the
 * photograph alone on screen long enough to be read, and ends slow, which is
 * what lets the seam settle rather than stop.
 */
function eased(progress: number) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

/**
 * What the pointer does to a half besides moving the seam.
 *
 * Colour is the main lever, and it has to be, because the two halves are not
 * the same kind of image. Draining a photograph and draining a page of brush
 * marks both read as stepping back. Darkening does not: the painted half is
 * marks on a transparent ground, so taking its brightness down pushes those
 * marks harder against the white page rather than settling them into it.
 *
 * A tenth of the brightness on top of a heavy drain is still worth having.
 * It is what makes the photographic half read as being in shadow when it is
 * the one passed over, and by then the painted half has so little colour left
 * that the same tenth does nothing visible to it either way.
 */
const LEAN = {
  /** Saturation added to the chosen half. */
  gained: 0.22,
  /** Saturation taken from the other one. */
  drained: 0.7,
  /** And some of its brightness and its presence with it. */
  darkened: 0.1,
  faded: 0.22,
};

/** How far a side is the one being pointed at, and how far it is not. */
function share(lean: number) {
  return { chosen: Math.max(0, lean), passed: Math.max(0, -lean) };
}

/**
 * The filter one half of the composition wears.
 *
 * It has to be a filter and not `opacity`, because the entry animations fill
 * forwards and an animation beats an inline style in the cascade, so anything
 * written to a property a keyframe touches is silently ignored.
 *
 * @param lean 1 where the pointer is over this half, -1 over the other
 * @returns the value for `filter`
 */
function tone(lean: number) {
  const { chosen, passed } = share(lean);
  const colour = 1 + LEAN.gained * chosen - LEAN.drained * passed;
  return (
    `saturate(${colour})` +
    ` brightness(${1 - LEAN.darkened * passed})` +
    ` opacity(${1 - LEAN.faded * passed})`
  );
}

/**
 * Leans the words to match the half they belong to.
 *
 * Only the two numbers are written here. What they mean is in the stylesheet,
 * because the two sides do not answer them the same way: one word is ink and
 * the other is lettered in the paint, and paint faded is simply gone.
 *
 * @param words the description block
 * @param lean 1 where the pointer is over its half, -1 over the other
 */
function emphasise(words: HTMLElement, lean: number) {
  const { chosen, passed } = share(lean);
  words.style.setProperty("--chosen", `${chosen}`);
  words.style.setProperty("--passed", `${passed}`);
}

export default function SplitFace({ lang }: { lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<HTMLDivElement>(null);
  const interfaceDescRef = useRef<HTMLDivElement>(null);
  const logicDescRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let target = CENTRE;
    let xp = CENTRE;
    let frame = 0;
    let last = 0;
    let begun = 0;
    let inside = false;
    let entering = !still.matches;

    /**
     * Writes one position. Every geometric value here is the reference's
     * formula; the colour and the words are ours.
     *
     * Nothing is written in pixels. The numbers go out as they are, in stage
     * units, and the stylesheet multiplies each one by whatever a stage unit is
     * worth on the screen it is drawing on. That is what lets the same
     * arithmetic serve a 1040px stage and a phone.
     *
     * @param offset how far the seam has left its resting place, in stage units
     * @param lean 1 where the painted half is the one being looked at, -1 the
     *   photographic one
     */
    function draw(offset: number, lean: number) {
      const paint = paintRef.current;
      const photo = photoRef.current;
      const strokes = strokesRef.current;
      const interfaceDesc = interfaceDescRef.current;
      const logicDesc = logicDescRef.current;
      if (!paint || !photo || !strokes || !interfaceDesc || !logicDesc) return;

      // How far the composition itself has slid, which the crop on a narrow
      // screen follows so that the figure is never cut.
      //
      // On the stage, and it has to be the stage: --crop is declared there, and
      // a custom property is substituted on the element that declares it, not
      // on the one that reads the result. Written on the frame inside it, where
      // the layers that move actually live, this lands below the rule that
      // wants it, the fallback is used instead and the crop quietly never
      // moves.
      stage!.style.setProperty("--shift", `${offset * 0.1}`);

      paint.style.setProperty("--w", `${ART.window + offset * 0.5}`);
      paint.style.setProperty("--x", `${ART.inset + offset * 0.1}`);
      paint.style.filter = tone(lean);

      photo.style.setProperty("--w", `${ART.window - offset * 0.5}`);
      photo.style.setProperty("--x", `${ART.inset - offset * 0.1}`);
      photo.style.filter = tone(-lean);

      // The strokes belong to the painted side and lean with it.
      strokes.style.setProperty("--x", `${ART.inset + offset * 0.05}`);
      strokes.style.filter = tone(lean);

      emphasise(interfaceDesc, lean);
      emphasise(logicDesc, -lean);
    }

    /**
     * Writes the position the pointer is asking for.
     *
     * The seam answers a fraction of the pointer, the colour answers all of it:
     * the halves lean fully towards whichever one is being looked at while
     * still both being there to see.
     */
    function place(at: number) {
      const pull = CENTRE - at;
      draw(pull * (pull > 0 ? REACH.paint : REACH.photo), (CENTRE - at) / CENTRE);
    }

    function settle(on: boolean) {
      for (const ref of [
        paintRef,
        photoRef,
        strokesRef,
        interfaceDescRef,
        logicDescRef,
      ]) {
        ref.current?.classList.toggle(styles.settling, on);
      }
    }

    function tick(now: number) {
      const elapsed = last ? now - last : REFERENCE_FRAME_MS;
      last = now;
      // Zeno's paradox, sampled against real time rather than a fixed frame.
      xp += (target - xp) * (1 - (1 - DAMPING) ** (elapsed / REFERENCE_FRAME_MS));
      place(xp);
      frame = requestAnimationFrame(tick);
    }

    /** Starts following the pointer from wherever the face currently stands. */
    function track() {
      last = 0;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    }

    /** One frame of the opening. */
    function sweep(now: number) {
      if (!begun) begun = now;
      const progress = Math.min(1, (now - begun) / ENTRY_MS);
      const done = eased(progress);

      // At 0 the painted window has no width at all and the photograph holds
      // the whole composition; at 1 both are back where the stylesheet puts
      // them, which is where the pointer tracking expects to find them.
      draw(-ART.width * (1 - done), -(1 - done));

      if (progress < 1) {
        frame = requestAnimationFrame(sweep);
        return;
      }

      entering = false;
      frame = 0;
      // The sweep ends at the centre, which is where the damping starts, so a
      // pointer that arrived while it was running is picked up without a jump.
      if (inside) track();
    }

    /** Lets go: the picture glides back to the resting split. */
    function release() {
      cancelAnimationFrame(frame);
      frame = 0;
      xp = CENTRE;
      target = CENTRE;
      settle(true);
      place(CENTRE);
    }

    /**
     * Where a screen x falls on the stage, in stage units.
     *
     * Read off the visible window rather than the stage itself, so the whole
     * travel is reachable wherever it is being touched: on a phone the window
     * holds 580 of the 1040 units and a finger has only that much to work with.
     * On the wide layout the window is the stage, 1040px across, and this is
     * the subtraction it has always been.
     *
     * Held inside the stage, because the section runs the full width of the
     * page and a pointer spends most of its time in the gutters beside it.
     * Unheld, the lean runs past 1 out there and the filters it builds go out
     * of range, which drops them entirely.
     */
    function relative(clientX: number) {
      const box = stage!.getBoundingClientRect();
      const at = ((clientX - box.left) / box.width) * STAGE.width;
      return Math.min(STAGE.width, Math.max(0, at));
    }

    /** Takes the picture over, from wherever the opening has left it. */
    function grab(clientX: number) {
      inside = true;
      // The transition exists only for the glide back, so it is cleared before
      // the loop starts writing a value every frame.
      settle(false);
      target = relative(clientX);
      // Arriving mid opening is remembered, not obeyed: the sweep owns the
      // picture until it lands, and hands it over on the way out.
      if (entering) return;
      track();
    }

    function onMove(event: MouseEvent) {
      target = relative(event.clientX);
    }

    function onEnter(event: MouseEvent) {
      if (still.matches) return;
      grab(event.clientX);
    }

    function onLeave() {
      inside = false;
      if (entering) return;
      release();
    }

    // A finger, which has no equivalent of hovering: the seam follows a drag
    // across the picture and lets go when the finger does.
    let began: { x: number; y: number } | null = null;
    let dragging = false;

    function onTouchStart(event: TouchEvent) {
      if (still.matches) return;
      began = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      dragging = false;
    }

    /**
     * The first few pixels of a touch decide what it is. Sideways is a drag on
     * the seam; anything else is the page being scrolled and is left alone, or
     * the picture would twitch every time someone read past it.
     */
    function onTouchMove(event: TouchEvent) {
      if (!began) return;
      const touch = event.touches[0];

      if (!dragging) {
        const sideways = Math.abs(touch.clientX - began.x);
        const along = Math.abs(touch.clientY - began.y);
        if (sideways < AXIS_LOCK_PX && along < AXIS_LOCK_PX) return;
        if (along >= sideways) {
          began = null;
          return;
        }
        dragging = true;
        grab(touch.clientX);
        return;
      }

      target = relative(touch.clientX);
    }

    function onTouchEnd() {
      began = null;
      if (!dragging) return;
      dragging = false;
      inside = false;
      if (entering) return;
      release();
    }

    if (entering) {
      draw(-ART.width, -1);
      frame = requestAnimationFrame(sweep);
    }

    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: true });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("touchcancel", onTouchEnd);

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <section className={styles.hero} ref={sectionRef}>
      {/* Both halves are background images, which a browser cannot know about
          until it has read the stylesheet: on a slow connection that was 300ms
          of doing nothing before the hero even started arriving. React hoists
          these into the head, where the preload scanner finds them with the
          markup. The photograph is what the opening shows first, so it is the
          one that asks for the priority. */}
      <link rel="preload" as="image" href={SITE.heroArt.photo} fetchPriority="high" />
      <link rel="preload" as="image" href={SITE.heroArt.paint} />

      {/* The name and the role are no longer drawn: the face and the two words
          are the hero. The heading stays in the markup because the page still
          needs exactly one h1, and it is what the page is about. */}
      <h1 className="sr-only">
        {SITE.name} · {SITE.role}
      </h1>

      <div className={styles.face}>
        {/* However many layers it is made of, it is one picture to whoever
            cannot see it, so the description sits here and the layers inside
            are a drawing rather than content. The flat composite that used to
            stand in for all this on narrow screens is gone: the construction
            itself is what runs there now. */}
        <div
          className={styles.stage}
          ref={stageRef}
          role="img"
          aria-label={HERO.photoAlt[lang]}
        >
          <div className={styles.frame}>
            <div className={`${styles.art} ${styles.paint}`} ref={paintRef} />
            <div className={`${styles.art} ${styles.photo}`} ref={photoRef} />
            <div className={`${styles.block} ${styles.strokes}`} ref={strokesRef} />
          </div>
        </div>

        {/* The two sides carry the words and nothing else. They used to be
            anchors into the work section; the hero now leads nowhere, so they
            are plain blocks and the pointer stays an arrow over them. */}
        <div className={`${styles.side} ${styles.sideInterface}`}>
          <div className={styles.description} ref={interfaceDescRef}>
            {/* One span per letter, so the stylesheet can letter the word in
                the paint and bring the letters in one at a time. The markup
                only says where a letter begins and which one it is; what
                colour it takes and when it arrives are questions about how the
                thing looks, and live with the rest of them. Spread rather than
                split, so a character outside the basic plane cannot be torn in
                half. */}
            <h2>
              {[...HERO.interface.title[lang]].map((letter, at) => (
                <span key={at} style={{ "--at": at } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </h2>
            <p>{HERO.interface.desc[lang]}</p>
          </div>
        </div>

        <div className={`${styles.side} ${styles.sideLogic}`}>
          <div className={styles.description} ref={logicDescRef}>
            <h2>{HERO.logic.title[lang]}</h2>
            <p>{HERO.logic.desc[lang]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
