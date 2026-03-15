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

Next.js 14 portfolio site using the **App Router** (not Pages Router), TypeScript, and Tailwind CSS.

- `app/` — All routes and layouts via App Router
  - `layout.tsx` — Root layout: metadata, Geist font loading, global CSS
  - `page.tsx` — Home page
  - `globals.css` — Tailwind base imports + CSS custom properties for theming
- `public/` — Static assets

**Path alias**: `@/*` maps to the project root (configured in `tsconfig.json`).

**Theming**: CSS variables (`--background`, `--foreground`) with automatic dark mode via `prefers-color-scheme`.

**Fonts**: Geist Sans and Geist Mono loaded locally via `next/font/local`.
