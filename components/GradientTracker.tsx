"use client";

import { useEffect, useRef } from "react";

export default function GradientTracker() {
  const targetX = useRef(55);
  const targetY = useRef(50);
  const currentX = useRef(55);
  const currentY = useRef(50);
  const raf = useRef<number>(0);

  useEffect(() => {
    // Prevent the browser from restoring a previous scroll position on page load
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      targetX.current = (e.clientX / window.innerWidth) * 100;
      targetY.current = (e.clientY / window.innerHeight) * 100;
    }

    function tick() {
      const lerp = 0.06;
      currentX.current += (targetX.current - currentX.current) * lerp;
      currentY.current += (targetY.current - currentY.current) * lerp;

      document.documentElement.style.setProperty("--grad-x", `${currentX.current}%`);
      document.documentElement.style.setProperty("--grad-y", `${currentY.current}%`);
      document.documentElement.style.setProperty("--grad-x-dec", `${currentX.current / 100}`);
      document.documentElement.style.setProperty("--grad-y-dec", `${currentY.current / 100}`);

      raf.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return null;
}
