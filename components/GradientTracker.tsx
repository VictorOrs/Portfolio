"use client";

import { useEffect, useRef } from "react";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function GradientTracker() {
  const targetX = useRef(55);
  const targetY = useRef(50);
  const currentX = useRef(55);
  const currentY = useRef(50);
  const raf = useRef<number>(0);
  const usingOrientation = useRef(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // ── Mouse tracking (desktop) ──────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      if (usingOrientation.current) return;
      targetX.current = (e.clientX / window.innerWidth) * 100;
      targetY.current = (e.clientY / window.innerHeight) * 100;
    }

    // ── Device orientation (mobile) ───────────────────────────────────────
    function onOrientation(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      usingOrientation.current = true;
      // gamma: -45..45 → 0..100,  beta: -30..30 → 0..100
      targetX.current = clamp(((e.gamma + 45) / 90) * 100, 0, 100);
      targetY.current = clamp(((e.beta + 30) / 60) * 100, 0, 100);
    }

    function startOrientation() {
      window.addEventListener("deviceorientation", onOrientation, { passive: true });
    }

    // iOS 13+ requires permission from a user gesture
    function requestOrientationPermission() {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
        DOE.requestPermission().then((state) => {
          if (state === "granted") startOrientation();
        }).catch(() => {});
      }
    }

    // Try to enable orientation on first touch (user gesture for iOS)
    function onFirstTouch() {
      window.removeEventListener("touchstart", onFirstTouch);
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
        requestOrientationPermission();
      } else if ("DeviceOrientationEvent" in window) {
        startOrientation();
      }
    }

    // Desktop: always listen to mouse
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Mobile: check orientation support
    if ("ontouchstart" in window) {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
        // iOS — needs user gesture
        window.addEventListener("touchstart", onFirstTouch, { passive: true, once: true });
      } else if ("DeviceOrientationEvent" in window) {
        // Android — no permission needed
        startOrientation();
      }
    }

    // ── RAF loop ──────────────────────────────────────────────────────────
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
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("touchstart", onFirstTouch);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return null;
}
