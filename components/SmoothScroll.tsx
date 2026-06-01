"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Module-level handle so the work overlay can pause/resume smooth scroll while open.
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
