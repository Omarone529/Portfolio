import type { SVGProps } from "react";
import type { SocialId } from "@/content/site";

/**
 * Inline SVGs in place of the Font Awesome stylesheet the old site pulled from
 * a CDN: the same marks, ~70 kB less on the critical path and one fewer origin
 * to connect to.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
} as const;

export function ArrowRight(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

function WhatsApp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43l-.47-.01c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

/**
 * The one mark drawn with strokes rather than as a filled silhouette: the
 * Instagram logo is an outline camera, so a solid shape would not be it.
 */
function Instagram(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Discord(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.54 5.34A16.2 16.2 0 0 0 15.5 4.1a.06.06 0 0 0-.06.03c-.17.31-.37.71-.5 1.03a15 15 0 0 0-4.48 0c-.14-.33-.34-.72-.51-1.03a.06.06 0 0 0-.06-.03c-1.4.24-2.75.66-4.03 1.24a.05.05 0 0 0-.03.02C2.28 9.18 1.5 12.9 1.88 16.58c0 .02.01.03.03.04a16.3 16.3 0 0 0 4.94 2.5.06.06 0 0 0 .07-.02c.38-.52.72-1.07 1.01-1.64a.06.06 0 0 0-.03-.08 10.7 10.7 0 0 1-1.54-.73.06.06 0 0 1 0-.1l.3-.24a.06.06 0 0 1 .06 0 11.6 11.6 0 0 0 9.88 0 .06.06 0 0 1 .06 0l.31.24a.06.06 0 0 1 0 .1c-.5.29-1.01.53-1.55.73a.06.06 0 0 0-.03.08c.3.57.63 1.12 1.01 1.64a.06.06 0 0 0 .07.02 16.25 16.25 0 0 0 4.95-2.5.06.06 0 0 0 .02-.04c.46-4.25-.76-7.94-3.22-11.22a.05.05 0 0 0-.02-.02ZM8.35 14.34c-.97 0-1.77-.89-1.77-1.99 0-1.1.79-1.99 1.77-1.99.99 0 1.78.9 1.77 1.99 0 1.1-.79 1.99-1.77 1.99Zm6.55 0c-.97 0-1.77-.89-1.77-1.99 0-1.1.78-1.99 1.77-1.99.99 0 1.78.9 1.77 1.99 0 1.1-.78 1.99-1.77 1.99Z" />
    </svg>
  );
}

/**
 * Gmail's envelope, kept in the five pieces its own logo is drawn in so each
 * can take its own colour on hover. Everything inherits currentColor until
 * then, which is what leaves the mark grey in the row like the others.
 *
 * The geometry is the 2020 mark, whose own viewBox is 88 by 66. The transform
 * sets it into the 24 grid the rest of the set uses, at the size and place the
 * drawn envelope it replaces occupied.
 */
function Gmail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <g transform="translate(2.5 4.87) scale(0.2159) translate(-52 -42)">
        <path className="gmail-left" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
        <path className="gmail-right" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
        <path
          className="gmail-top-right"
          d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"
        />
        <path className="gmail-fold" d="M72 74V48l24 18 24-18v26L96 92" />
        <path
          className="gmail-top-left"
          d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"
        />
      </g>
    </svg>
  );
}

function GitHub(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 6.84 9.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}

function GitLab(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m21.94 13.11-1.12-3.44-2.22-6.83a.38.38 0 0 0-.72 0l-2.22 6.83H8.34L6.12 2.84a.38.38 0 0 0-.72 0L3.18 9.67l-1.12 3.44a.77.77 0 0 0 .28.86l9.66 7.02 9.66-7.02a.77.77 0 0 0 .28-.86Z" />
    </svg>
  );
}

function LinkedIn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialId, (p: IconProps) => React.ReactElement> = {
  whatsapp: WhatsApp,
  instagram: Instagram,
  discord: Discord,
  email: Gmail,
  github: GitHub,
  gitlab: GitLab,
  linkedin: LinkedIn,
};

export function SocialIcon({ id, ...props }: { id: SocialId } & IconProps) {
  const Icon = SOCIAL_ICONS[id];
  return <Icon {...props} />;
}

export function FlagIt(props: IconProps) {
  return (
    <svg viewBox="0 0 21 14" aria-hidden focusable={false} {...props}>
      <rect width="7" height="14" fill="#009246" />
      <rect x="7" width="7" height="14" fill="#F4F5F0" />
      <rect x="14" width="7" height="14" fill="#CE2B37" />
    </svg>
  );
}

export function FlagEn(props: IconProps) {
  return (
    <svg viewBox="0 0 21 14" aria-hidden focusable={false} {...props}>
      <rect width="21" height="14" fill="#B22234" />
      <path
        stroke="#FFFFFF"
        strokeWidth={1.08}
        d="M0 1.62h21M0 3.77h21M0 5.92h21M0 8.08h21M0 10.23h21M0 12.38h21"
      />
      <rect width="8.4" height="7.54" fill="#3C3B6E" />
    </svg>
  );
}
