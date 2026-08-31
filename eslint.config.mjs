import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /*
       * The same 88 columns Prettier wraps at, enforced here because Prettier
       * cannot reach the lines that actually run long: it never breaks a
       * string literal, so a paragraph of copy or a list of Tailwind classes
       * stays on one line however wide it gets. This rule is what says so.
       *
       * SVG path data is exempt. It is coordinates, and no way of breaking it
       * makes it readable.
       */
      "max-len": ["error", { code: 88, ignorePattern: '\\bd="[Mm]' }],

      /*
       * next/image wants a server to optimise on, and a static export has
       * none: that is why images.unoptimized is set in next.config.ts. The
       * assets here are already cut to size and shipped as webp, so what
       * <Image /> would emit is the <img> that is written by hand.
       */
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
