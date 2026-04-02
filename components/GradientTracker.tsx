"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

const STORAGE_KEY = "tilt-permission";

type DOEWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

function needsIOSPermission(): boolean {
  if (typeof window === "undefined") return false;
  if (!("ontouchstart" in window)) return false;
  const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
  return typeof DOE.requestPermission === "function";
}

export default function GradientTracker() {
  const targetX = useRef(55);
  const targetY = useRef(50);
  const currentX = useRef(55);
  const currentY = useRef(50);
  const raf = useRef<number>(0);
  const usingOrientation = useRef(false);
  const orientationStarted = useRef(false);

  const [showPrompt, setShowPrompt] = useState(false);

  const startOrientation = useCallback(() => {
    if (orientationStarted.current) return;
    orientationStarted.current = true;

    function onOrientation(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      usingOrientation.current = true;
      targetX.current = clamp(((e.gamma + 45) / 90) * 100, 0, 100);
      targetY.current = clamp(((e.beta + 30) / 60) * 100, 0, 100);
    }

    window.addEventListener("deviceorientation", onOrientation, { passive: true });
  }, []);

  // iOS permission prompt handler
  const handlePermissionTap = useCallback(() => {
    const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
    if (typeof DOE.requestPermission === "function") {
      DOE.requestPermission()
        .then((state) => {
          if (state === "granted") {
            localStorage.setItem(STORAGE_KEY, "granted");
            startOrientation();
          } else {
            localStorage.setItem(STORAGE_KEY, "denied");
          }
        })
        .catch(() => {
          localStorage.setItem(STORAGE_KEY, "denied");
        });
    }
    setShowPrompt(false);
  }, [startOrientation]);

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

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Mobile orientation ────────────────────────────────────────────────
    if ("ontouchstart" in window) {
      if (needsIOSPermission()) {
        // iOS — check localStorage for prior permission
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "granted") {
          startOrientation();
        } else if (stored !== "denied") {
          // First visit — show prompt
          setShowPrompt(true);
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
      cancelAnimationFrame(raf.current);
    };
  }, [startOrientation]);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.button
          key="tilt-prompt"
          onClick={handlePermissionTap}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-4 py-3 rounded-full bg-alpha-revert backdrop-blur-glass outline outline-2 outline-alpha outline-offset-[-2px] font-display text-s text-text-secondary cursor-pointer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="pt-1 px-1">Enable tilt effect</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
