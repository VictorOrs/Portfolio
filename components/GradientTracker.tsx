"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

type DOEWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  if (!("ontouchstart" in window)) return false;
  const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
  return typeof DOE.requestPermission === "function";
}

function GyroIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
      <circle cx={12} cy={12} r={3} />
      <ellipse cx={12} cy={12} rx={10} ry={4} />
      <ellipse cx={12} cy={12} rx={4} ry={10} />
    </svg>
  );
}

export default function GradientTracker() {
  const targetX = useRef(55);
  const targetY = useRef(50);
  const currentX = useRef(55);
  const currentY = useRef(50);
  const raf = useRef<number>(0);
  const usingOrientation = useRef(false);
  const orientationStarted = useRef(false);

  const [showBanner, setShowBanner] = useState(false);

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

  const handleBannerTap = useCallback(() => {
    setShowBanner(false);
    const DOE = DeviceOrientationEvent as unknown as DOEWithPermission;
    if (typeof DOE.requestPermission !== "function") return;
    DOE.requestPermission()
      .then((state) => {
        if (state === "granted") startOrientation();
      })
      .catch(() => {});
  }, [startOrientation]);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Show banner after 2s on iOS, dismiss on scroll
  useEffect(() => {
    if (!isIOS()) return;

    const timer = setTimeout(() => setShowBanner(true), 2000);

    function onScroll() {
      setShowBanner(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true, once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // ── Mouse tracking (desktop) ──────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      if (usingOrientation.current) return;
      targetX.current = (e.clientX / window.innerWidth) * 100;
      targetY.current = (e.clientY / window.innerHeight) * 100;
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Mobile orientation setup (Android only — iOS uses banner) ────────
    if ("ontouchstart" in window && !isIOS() && "DeviceOrientationEvent" in window) {
      startOrientation();
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
      {showBanner && (
        <motion.div
          key="tilt-banner"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            variant="secondary"
            size="md"
            icon={<GyroIcon />}
            onClick={handleBannerTap}
          >
            Enable tilt effect
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
