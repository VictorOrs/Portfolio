"use client";

import { useEffect, useRef, useState } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const DESKTOP_TOTAL = 363;
const MOBILE_TOTAL  = 182;
const MOBILE_BP     = 768;

// ── Pure helpers ───────────────────────────────────────────────────────────────
function frameUrl(mobile: boolean, idx: number): string {
  const n = String(idx + 1).padStart(3, "0");
  return `/frames/${mobile ? "mobile" : "desktop"}/frame_${n}.webp`;
}

async function fetchBitmap(url: string): Promise<ImageBitmap> {
  const res  = await fetch(url);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

/** Draw bitmap centered with object-fit: contain behavior. */
function drawContained(ctx: CanvasRenderingContext2D, bmp: ImageBitmap): void {
  const cw    = ctx.canvas.width;
  const ch    = ctx.canvas.height;
  const scale = Math.min(cw / bmp.width, ch / bmp.height);
  const dx    = (cw - bmp.width  * scale) / 2;
  const dy    = (ch - bmp.height * scale) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(bmp, dx, dy, bmp.width * scale, bmp.height * scale);
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function CubeScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const ctxRef       = useRef<CanvasRenderingContext2D | null>(null);
  const bitmapsRef   = useRef<ImageBitmap[]>([]);
  const frameRef     = useRef(0);     // index of the frame currently on canvas
  const progressRef  = useRef(0);     // scroll progress [0, 1] written by scroll, read by RAF

  const rafRef       = useRef<number>(0);

  const [loaded,  setLoaded]  = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  // ── 1. Preload frames ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const mobile   = window.innerWidth < MOBILE_BP;
    const total    = mobile ? MOBILE_TOTAL : DESKTOP_TOTAL;
    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Only need the single middle frame
      const mid = Math.floor(total / 2);
      fetchBitmap(frameUrl(mobile, mid)).then((bmp) => {
        if (cancelled) { bmp.close(); return; }
        const arr    = new Array<ImageBitmap>(total);
        arr[mid]     = bmp;
        bitmapsRef.current = arr;
        frameRef.current   = mid;
        setLoaded(true);
      });
      return () => { cancelled = true; };
    }

    let done = 0;
    const arr = new Array<ImageBitmap>(total);

    const promises = Array.from({ length: total }, (_, i) =>
      fetchBitmap(frameUrl(mobile, i)).then((bmp) => {
        if (cancelled) { bmp.close(); return; }
        arr[i] = bmp;
        setLoadPct(Math.round((++done / total) * 100));
      })
    );

    Promise.all(promises).then(() => {
      if (cancelled) return;
      bitmapsRef.current = arr;
      setLoaded(true);
    });

    return () => {
      cancelled = true;
      bitmapsRef.current.forEach((b) => b?.close());
      bitmapsRef.current = [];
    };
  }, []); // intentional: runs once on mount

  // ── 2. RAF loop + scroll listener + resize ───────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Size canvas to viewport and redraw current frame
    const sizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = ctxRef.current;
      const bmp = bitmapsRef.current[frameRef.current];
      if (ctx && bmp) drawContained(ctx, bmp);
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // Static middle frame for reduced motion — no scroll / RAF needed
    if (reduced) {
      return () => window.removeEventListener("resize", sizeCanvas);
    }

    // Scroll handler — only writes to a ref, never touches the DOM
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const top   = el.getBoundingClientRect().top;
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      progressRef.current = Math.max(0, Math.min(1, -top / range));
    };

    // RAF loop — reads progress ref, updates canvas only when frame changes
    const tick = () => {
      const bitmaps = bitmapsRef.current;
      const target  = Math.round(progressRef.current * (bitmaps.length - 1));
      const clamped = Math.max(0, Math.min(bitmaps.length - 1, target));

      if (clamped !== frameRef.current) {
        frameRef.current = clamped;
        const ctx = ctxRef.current;
        const bmp = bitmaps[clamped];
        if (ctx && bmp) drawContained(ctx, bmp);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [loaded]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Loading indicator */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-text-secondary"
              style={{ borderTopColor: "var(--color-text-primary)" }}
            />
            <p className="font-body text-label text-text-secondary tabular-nums">
              {loadPct}%
            </p>
          </div>
        )}

        {/* Canvas — fades in once frames are ready */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
        />

      </div>
    </div>
  );
}
