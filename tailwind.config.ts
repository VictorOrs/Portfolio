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

      // ─── Font sizes (with paired line-heights & weights) ────────────────
      fontSize: {
        "display-1": ["88px", { lineHeight: "104px", letterSpacing: "0", fontWeight: "500" }], // Title/H1
        "heading-2": ["64px", { lineHeight: "72px",  letterSpacing: "0",  fontWeight: "500" }], // Title/H2
        "heading-3": ["48px", { lineHeight: "56px", letterSpacing: "0",  fontWeight: "500" }], // Title/H3
        "heading-4": ["32px", { lineHeight: "40px", letterSpacing: "0",  fontWeight: "500" }], // Title/H4
        "body":      ["20px", { lineHeight: "32px", letterSpacing: "0",  fontWeight: "400" }], // Paragraph/L — R
        "body-m":   ["16px", { lineHeight: "24px", letterSpacing: "0",  fontWeight: "400" }], // Paragraph/M — R (use font-medium for M variant)
        "btn-lg":    ["18px", { lineHeight: "20px", letterSpacing: "0",  fontWeight: "600" }], // Button/L
        "btn-md":    ["16px", { lineHeight: "20px", letterSpacing: "0",  fontWeight: "600" }], // Button/M
        "link":      ["16px", { lineHeight: "20px", letterSpacing: "0",  fontWeight: "500" }], // Link
        "label":     ["14px", { lineHeight: "20px", letterSpacing: "8px",fontWeight: "600" }], // Uppercase
      },

      // ─── Spacing (4 px base unit) ────────────────────────────────────────
      // Numeric tokens match Tailwind's built-in scale (1 = 4px).
      // Named tokens are section/layout-level additions.
      spacing: {
        "4.5": "18px", // py for primary/lg → 18+20+18 = 56px
        1:  "4px",
        2:  "8px",
        3:  "12px",
        4:  "16px",
        6:  "24px",
        8:  "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
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
        "btn-glow": "0px 0px 20px 0px rgba(255,255,255,0.48)", // Primary button hover — white glow
      },
      dropShadow: {
        illustration: "0 -3.65px 29.18px rgba(0,0,0,0.72)", // Illustration token
      },
    },
  },
  plugins: [],
};

export default config;
