import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Class-based dark mode — add/remove `dark` on <html> to switch themes
  darkMode: "class",
  theme: {
    extend: {
      // ─── Breakpoints ─────────────────────────────────────────────────────
      screens: {
        xs:  "480px",   // hero 3-line → 4-line transition
        nav: "1200px",  // burger → NavGroup transition
      },

      // ─── Colors ─────────────────────────────────────────────────────────
      // All values reference CSS variables defined in globals.css.
      // Semantic tokens change between :root (light) and .dark.
      // Invariant tokens are defined once in :root and never overridden.
      colors: {
        // Backgrounds
        background: {
          base:    "var(--color-bg-base)",    // main canvas
          surface: "var(--color-bg-surface)", // cards, panels
        },

        // Text hierarchy
        text: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          accent:    "var(--color-text-accent)",
        },

        // Overlays / glass
        alpha:        "var(--color-alpha)",        // 10% overlay, adapts per mode
        "alpha-revert": "var(--color-alpha-revert)", // scrolled state bg

        // Accent / brand (invariant)
        accent: {
          purple: {
            DEFAULT: "var(--color-accent-purple)",      // #725FEB
            dark:    "var(--color-accent-purple-dark)", // #5A3A88
            light:   "var(--color-accent-purple-light)",// #F4EBFF
          },
          brand: "var(--color-brand)", // #4779FF
        },

        // Semantic status (invariant)
        success: "var(--color-success)", // #0ebe6a
        error:   "var(--color-error)",   // #DF2626
        green:   "var(--color-green)",   // #319463

        // Utility
        white: "var(--color-white)", // #FCFFFE

        // Button
        btn: {
          primary: {
            bg:    "var(--color-btn-primary-bg)",
            hover: "var(--color-btn-primary-bg-hover)",
            text:  "var(--color-btn-primary-text)",
          },
        },
      },

      // ─── Fonts ──────────────────────────────────────────────────────────
      fontFamily: {
        display: ["Nohemi", "sans-serif"],                            // headings, buttons, nav
        body:    ["Inter", "var(--font-geist-sans)", "sans-serif"],// body, labels
      },

      // ─── Font sizes — responsive via CSS vars (see globals.css) ────────
      // Desktop values in :root, mobile overrides in @media (max-width: 768px).
      fontSize: {
        "3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-3xl)", fontWeight: "500" }], // H1
        "2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-2xl)", fontWeight: "500" }], // H2
        "xl":  ["var(--font-size-xl)",  { lineHeight: "var(--line-height-xl)",  fontWeight: "500" }], // H3
        "l":   ["var(--font-size-l)",   { lineHeight: "var(--line-height-l)",   fontWeight: "500" }], // H4
        "m":   ["var(--font-size-m)",   { lineHeight: "var(--line-height-m)",   fontWeight: "400", letterSpacing: "-0.5px" }], // Paragraph/L
        "sm":  ["var(--font-size-sm)",  { lineHeight: "var(--line-height-sm)",  fontWeight: "600" }], // Button/L
        "s":   ["var(--font-size-s)",   { lineHeight: "var(--line-height-s)",   fontWeight: "400", letterSpacing: "-0.5px" }], // Paragraph/M · Link · Button/M
        "xs":  ["var(--font-size-xs)",  { lineHeight: "var(--line-height-xs)",  fontWeight: "600" }], // Uppercase/Label
      },

      // ─── Spacing (4 px base unit) ────────────────────────────────────────
      // Numeric tokens match Tailwind's built-in scale (1 = 4px).
      // Named tokens are section/layout-level additions.
      spacing: {
        1:    "4px",
        1.5:  "6px",   // LanguageToggleItem inner padding
        2:    "8px",
        2.5:  "10px",  // WorkController gap
        3:    "12px",
        4:    "16px",
        6:    "24px",
        8:    "32px",
        10:   "40px",
        12:   "48px",
        16:   "64px",
        20:   "80px",
        // Section spacing
        xs:  "40px",
        s:   "64px",
        m:   "80px",
        l:   "120px",
        xl:  "177px",
        xxl: "289px",
      },

      // ─── Effects ─────────────────────────────────────────────────────────
      backdropBlur: {
        glass: "24px", // Blur token — BACKGROUND_BLUR radius: 24
      },
      boxShadow: {
        "btn-glow": "var(--shadow-btn-glow)", // Primary button hover — adapts per theme (globals.css)
      },
      dropShadow: {
        illustration: "0 -3.65px 29.18px rgba(0,0,0,0.72)", // Illustration token
      },
    },
  },
  plugins: [],
};

export default config;
