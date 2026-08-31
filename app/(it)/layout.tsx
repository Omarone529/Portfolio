import type { ReactNode } from "react";
import type { Viewport } from "next";
import "../globals.css";
import RootShell from "@/components/chrome/RootShell";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout for the Italian tree, which lives at the bare root. English has
 * its own alongside it. Two root layouts is what lets <html lang> be correct
 * on both without a client-side patch.
 */
export default function ItalianLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="it">{children}</RootShell>;
}
