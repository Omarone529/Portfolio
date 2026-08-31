import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pure static export: Netlify only ever serves files from out/, so there is
  // no runtime that can fail and nothing to cold-start.
  output: "export",
  // Trailing slashes keep the exported directory structure and the live URLs
  // in agreement, so /progetti/synapsi/ resolves without a redirect hop.
  trailingSlash: true,
  images: {
    // next/image's optimizer needs a server; the assets are already sized and
    // shipped as webp, so it has nothing to add here.
    unoptimized: true,
  },
  // The dev server refuses /_next/* to any origin but the one it was started
  // on, so opening it from a phone on the LAN serves the markup and then 403s
  // every chunk: nothing hydrates, and everything the client draws (the reveal
  // on scroll, the hero tracking) is simply absent. Mobile is where this site
  // is read, so it has to be openable from a phone. Development only; the
  // export has no server to configure.
  allowedDevOrigins: ["192.168.*.*"],
  // Next otherwise rewrites AGENTS.md and CLAUDE.md on every run, which would
  // overwrite the project rules kept there. The Next 16 notice it wants to add
  // is reproduced at the top of CLAUDE.md instead.
  agentRules: false,
};

export default nextConfig;
