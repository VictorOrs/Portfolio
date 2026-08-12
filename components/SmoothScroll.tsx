"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Module-level handle so the work overlay can pause/resume smooth scroll while open.
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

// Mounted by SiteChrome, which keeps it off /studio — Lenis captures the wheel
// and drives window scroll, leaving the Studio's own panes unscrollable.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
