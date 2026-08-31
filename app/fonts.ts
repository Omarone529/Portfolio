import { Figtree } from "next/font/google";

/**
 * Adham's site is set in Proxima Nova, which is licensed. Figtree is the
 * closest open substitute: same humanist-geometric build, same tall x-height,
 * so headings hold their shape at the sizes his layout uses.
 *
 * Self-hosted by next/font at build time. No request to Google, no preconnect,
 * no flash of fallback text.
 */
export const sans = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});
