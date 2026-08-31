import type { ReactNode } from "react";
import type { Viewport } from "next";
import "../globals.css";
import RootShell from "@/components/chrome/RootShell";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/** Root layout for everything under /en. See the Italian one for the why. */
export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
