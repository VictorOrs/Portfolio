"use client";

import { useEffect, useRef } from "react";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

const STORAGE_KEY = "tilt-permission";

type DOEWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

export default function GradientTracker() {
  const targetX = useRef(55);
  const targetY = useRef(50);
  const currentX = useRef(55);
  const currentY = useRef(50);
  const raf = useRef<number>(0);
  const usingOrientation = useRef(false);
  const orientationStarted = useRef(false);

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

    // ── Device orientation handler ────────────────────────────────────────
    function onOrientation(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      usingOrientation.current = true;
      targetX.current = clamp(((e.gamma + 45) / 90) * 100, 0, 100);
      targetY.current = clamp(((e.beta + 30) / 60) * 100, 0, 100);
    }

    function startOrientation() {
      if (orientationStarted.current) return;
      // On iOS, don't listen until permission is confirmed in localStorage
      const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
      if (typeof DOE.requestPermission === "function") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== "granted") {
          return;
        }
      }
      orientationStarted.current = true;
      window.addEventListener("deviceorientation", onOrientation, { passive: true });
    }

    // ── iOS: request permission on first touch ────────────────────────────
    function onFirstTouch() {
      const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
      if (typeof DOE.requestPermission !== "function") return;
      DOE.requestPermission()
        .then((state) => {
          if (state === "granted") {
            localStorage.setItem(STORAGE_KEY, "granted");
            startOrientation();
          }
        })
        .catch((err) => {
        });
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Mobile orientation setup ──────────────────────────────────────────
    if ("ontouchstart" in window) {
      const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
      if (typeof DOE.requestPermission === "function") {
        // iOS — check prior permission
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "granted") {
          startOrientation();
        } else {
          // First visit — request on first touch
          document.body.addEventListener("touchend", onFirstTouch, { once: true });
        }
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
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return null;
}
