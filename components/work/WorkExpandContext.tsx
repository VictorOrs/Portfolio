"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ProjectOverlay from "./ProjectOverlay";
import { PROJECTS } from "./registry";
import { getLenis } from "@/components/SmoothScroll";
import type { WorkCardProps } from "@/components/ui/WorkCard";

export type CardRect = { top: number; left: number; width: number; height: number };

/** The exact slider-card props, so the overlay hero renders identical content. */
export type HeroCardProps = Pick<
  WorkCardProps,
  "logo" | "title" | "illustration" | "ctaPrimary" | "ctaSecondary" | "showWorkedOn"
>;

type WorkExpandValue = {
  /** Open the overlay for a slug, with the clicked card's rect + props for the morph. */
  open: (slug: string, rect?: CardRect, card?: HeroCardProps) => void;
  close: () => void;
  /** Slug of the open project, or null — lets the slider pause while expanded. */
  openSlug: string | null;
};

const WorkExpandContext = createContext<WorkExpandValue | null>(null);

export function WorkExpandProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [openRect, setOpenRect] = useState<CardRect | undefined>(undefined);
  const [cardProps, setCardProps] = useState<HeroCardProps | undefined>(undefined);

  const open = useCallback((next: string, rect?: CardRect, card?: HeroCardProps) => {
    if (!PROJECTS[next]) return;
    setOpenRect(rect);
    setCardProps(card);
    setSlug(next);
    window.history.pushState({ workSlug: next }, "", `/work/${next}`);
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.workSlug) window.history.back();
    else setSlug(null);
  }, []);

  // Own scroll restoration so the browser doesn't reapply its remembered position
  // on history.back().
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      return () => { history.scrollRestoration = prev; };
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      const s = window.history.state?.workSlug;
      setSlug(s && PROJECTS[s] ? s : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Lock background scroll with overflow:hidden on <html> — freezes the page at its
  // current position without collapsing height (so close leaves scroll untouched).
  // Pause Lenis too (its RAF loop would otherwise keep driving the window scroll),
  // and compensate the removed scrollbar width to avoid a horizontal layout shift.
  useEffect(() => {
    const html = document.documentElement;
    const lenis = getLenis();
    if (slug) {
      const sbw = window.innerWidth - html.clientWidth;
      lenis?.stop();
      html.style.overflow = "hidden";
      if (sbw > 0) html.style.paddingRight = `${sbw}px`;
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";
      lenis?.start();
    }
    return () => {
      html.style.overflow = "";
      html.style.paddingRight = "";
    };
  }, [slug]);

  return (
    <WorkExpandContext.Provider value={{ open, close, openSlug: slug }}>
      {children}
      {slug && (
        <ProjectOverlay key={slug} slug={slug} openRect={openRect} cardProps={cardProps} onClose={close} />
      )}
    </WorkExpandContext.Provider>
  );
}

export function useWorkExpand() {
  const ctx = useContext(WorkExpandContext);
  if (!ctx) throw new Error("useWorkExpand must be used inside <WorkExpandProvider>");
  return ctx;
}
