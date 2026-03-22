# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured yet.

## Architecture

Next.js 14 portfolio site using the **App Router**, TypeScript, Tailwind CSS, and framer-motion.

**Path alias**: `@/*` maps to the project root.

### Key directories

- `app/` — App Router root. `layout.tsx` mounts `<GradientTracker />` and `<I18nProvider>` around all pages.
- `components/sections/` — Full-width page sections (`Hero`, `WhoIAm`).
- `components/ui/` — Reusable primitives (`Button`, `Navbar`, `NavGroup`, `NavLink`, `ChangingSpan`, `Logo`, `LinkedInIcon`, `DribbbleIcon`, `LanguageToggle`).
- `components/GradientTracker.tsx` — Renderless component, single RAF loop. Writes `--grad-x` / `--grad-y` CSS vars to `:root` on mouse move (lerp 0.06). Any component that consumes the mouse-tracked gradient reads those vars rather than running its own RAF.
- `lib/i18n.tsx` — Custom i18n: `I18nProvider` + `useTranslation()` hook. Language persisted in `localStorage`. Supports `en` / `fr`. Keys resolved with dot notation against `messages/{lang}.json`.
- `lib/gradient.ts` — `GRADIENT_STOPS` constant (iridescent rainbow, 3× repeated with `#E0E0E0` separators). Used by `Hero` (text clip) and available for other consumers.
- `messages/` — Translation files (`en.json`, `fr.json`). Add keys to both files when adding copy.

### Design system

Defined in `tailwind.config.ts` and `app/globals.css`. **Never use raw hex values in components** — always use design tokens.

- **Theme switching**: class-based (`darkMode: "class"`). The `<html>` element carries `dark`. `:root` holds light-mode values; `.dark` overrides them.
- **Forced light mode on a single component**: override CSS variables inline on the element's `style` prop (see `WhoIAm` profile card for the pattern). Add `.light-card` class to suppress dark-only styles like the button shimmer.
- **Color tokens**: `bg-background-base`, `bg-background-surface`, `text-text-primary`, `text-text-secondary`, `text-text-accent`, `bg-alpha`.
- **Typography**: `font-display` → Nohemi (headings, buttons, nav); `font-body` → Inter. Scale: `text-display-1`, `text-heading-3`, `text-heading-4`, `text-body`, `text-btn-lg`, `text-link`, `text-label`.
- **Spacing**: named section tokens `px-xl`, `py-l`, etc. defined in `tailwind.config.ts`.

### Button component

`Button` uses CVA (`class-variance-authority`). Variants: `primary` / `secondary`. Sizes: `lg` / `md`. The `icon` prop renders outside the label span. The `.btn-primary` CSS class in `globals.css` owns the shimmer animation (`btn-shimmer` keyframe) and hover glow — do not replicate these in Tailwind classes.

### Navigation pill

`NavGroup` owns `hoveredKey` state and passes `isHovered` + mouse handlers to each `NavLink`. The hover pill is a `motion.div` with `layoutId="nav-pill"` inside `AnimatePresence`, giving a shared-element slide transition across links.

### ChangingSpan

Animated cycling pill in the hero. Uses framer-motion `motion.span` with `layout` prop for width animation, and `AnimatePresence mode="popLayout"` for vertical ticker (exit down, enter from above). Height is fixed at `104px` via inline style (not Tailwind) to prevent framer-motion from interpolating it. `borderRadius` is also inline for the same reason.

### Fonts

- **Nohemi** (display): loaded via `@font-face` in `globals.css` from `/public/fonts/`. Weights: 500, 600.
- **Geist** (body fallback): loaded via `next/font/local` in `app/layout.tsx`.
- Inter is referenced in Tailwind config but loaded from the web by the browser.
