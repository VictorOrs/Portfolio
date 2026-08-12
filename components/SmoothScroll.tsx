"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Module-level handle so the work overlay can pause/resume smooth scroll while open.
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export default function SmoothScroll() {
  const pathname = usePathname();
  // Sanity Studio scrolls inside its own panes. Lenis captures the wheel and
  // drives window scroll instead, which leaves those panes unscrollable — so
  // smooth scroll stays on the site and off the admin app.
  const enabled = !pathname?.startsWith("/studio");

  useEffect(() => {
    if (!enabled) return;

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
  }, [enabled]);

  return null;
}
