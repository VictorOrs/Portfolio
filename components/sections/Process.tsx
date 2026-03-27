"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useLoading } from "@/lib/loading";
import { GRADIENT_STOPS_PROCESS } from "@/lib/gradient";
import SquircleCard from "@/components/ui/SquircleCard";

// ── Gradient geometry ─────────────────────────────────────────────────────────
const TITLE_W = 399;
const TITLE_H = 144;
const GRAD_W  = TITLE_W * 3;
const GRAD_H  = TITLE_H * 2.5;
const MOVE_X  = 120;
const MOVE_Y  = 50;
const SHIFT_X = Math.round(MOVE_X * 0.45);
const SHIFT_Y = Math.round(MOVE_Y * 0.10);
// Sparkle offsets — EN default / FR (next to "magie")
const SP_X_EN = 306;
const SP_Y_EN = 59;
const SP_X_FR = 258;
const SP_Y_FR = 70;

// ── Frame sequence ────────────────────────────────────────────────────────────
const DESKTOP_TOTAL = 363;
const MOBILE_TOTAL  = 182;
const MOBILE_BP     = 768;

function frameUrl(mobile: boolean, idx: number): string {
  const n = String(idx + 1).padStart(3, "0");
  return `/frames/${mobile ? "mobile" : "desktop"}/frame_${n}.webp`;
}

async function fetchBitmap(url: string): Promise<ImageBitmap> {
  const res  = await fetch(url);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

const CANVAS_ZOOM    = 1.25;
const CANVAS_OFFSET_X = 12; // px shift to the right

function drawContained(ctx: CanvasRenderingContext2D, bmp: ImageBitmap): void {
  const cw    = ctx.canvas.width;
  const ch    = ctx.canvas.height;
  const scale = Math.min(cw / bmp.width, ch / bmp.height) * CANVAS_ZOOM;
  const dx    = (cw - bmp.width  * scale) / 2 + CANVAS_OFFSET_X;
  const dy    = (ch - bmp.height * scale) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(bmp, dx, dy, bmp.width * scale, bmp.height * scale);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Process() {
  const { t, lang } = useTranslation();
  const { setProgress, setLoaded: setGlobalLoaded } = useLoading();

  const SP_X = lang === "fr" ? SP_X_FR : SP_X_EN;
  const SP_Y = lang === "fr" ? SP_Y_FR : SP_Y_EN;

  // Scroll zone
  const containerRef   = useRef<HTMLDivElement>(null);

  // Canvas
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const cardInnerRef   = useRef<HTMLDivElement>(null);
  const ctxRef         = useRef<CanvasRenderingContext2D | null>(null);
  const bitmapsRef     = useRef<ImageBitmap[]>([]);
  const frameRef       = useRef(0);
  const progressRef    = useRef(0);
  const stepIndexRef   = useRef(0);
  const rafRef         = useRef<number>(0);

  const [framesLoaded, setFramesLoaded] = useState(false);
  const [stepIndex,    setStepIndex]    = useState(0);

  // ── Load frames ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const mobile  = window.innerWidth < MOBILE_BP;
    const total   = mobile ? MOBILE_TOTAL : DESKTOP_TOTAL;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const mid = Math.floor(total / 2);
      fetchBitmap(frameUrl(mobile, mid)).then((bmp) => {
        if (cancelled) { bmp.close(); return; }
        const arr = new Array<ImageBitmap>(total);
        arr[mid] = bmp;
        bitmapsRef.current = arr;
        frameRef.current   = mid;
        setFramesLoaded(true);
        setGlobalLoaded();
      });
      return () => { cancelled = true; };
    }

    let done = 0;
    const arr = new Array<ImageBitmap>(total);

    Promise.all(
      Array.from({ length: total }, (_, i) =>
        fetchBitmap(frameUrl(mobile, i)).then((bmp) => {
          if (cancelled) { bmp.close(); return; }
          arr[i] = bmp;
          setProgress(Math.round((++done / total) * 100));
        })
      )
    ).then(() => {
      if (cancelled) return;
      bitmapsRef.current = arr;
      setFramesLoaded(true);
      setGlobalLoaded();
    });

    return () => {
      cancelled = true;
      bitmapsRef.current.forEach((b) => b?.close());
      bitmapsRef.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Canvas sizing + scroll + RAF ─────────────────────────────────────────────
  useEffect(() => {
    if (!framesLoaded) return;

    const canvas    = canvasRef.current;
    const cardInner = cardInnerRef.current;
    if (!canvas || !cardInner) return;

    ctxRef.current = canvas.getContext("2d");
    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sizeCanvas = () => {
      const { width, height } = cardInner.getBoundingClientRect();
      canvas.width  = width;
      canvas.height = height;
      const ctx = ctxRef.current;
      const bmp = bitmapsRef.current[frameRef.current];
      if (ctx && bmp) drawContained(ctx, bmp);
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    if (reduced) {
      return () => window.removeEventListener("resize", sizeCanvas);
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const top   = el.getBoundingClientRect().top;
      const range = el.offsetHeight - window.innerHeight;
      if (range <= 0) return;
      const p = Math.max(0, Math.min(1, -top / range));
      progressRef.current = p;

      // Step cycling — 4 equal segments
      const next = Math.min(3, Math.floor(p * 4));
      if (next !== stepIndexRef.current) {
        stepIndexRef.current = next;
        setStepIndex(next);
      }
    };

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
  }, [framesLoaded]);

  return (
    <section ref={containerRef} className="relative h-[300vh]">

      <div className="sticky top-0 h-screen flex flex-col justify-center gap-6 px-6 py-8 md:flex-row md:items-center md:gap-m md:px-10 md:py-l lg:px-s xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto z-[10000] relative overflow-hidden">

        {/* ── Left column ────────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-8 md:gap-[80px] w-full md:w-[400px] md:shrink-0"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* Title + sparkle */}
          <div className="relative">
            <p
              className="font-display text-heading-4 md:text-heading-2 bg-clip-text text-transparent whitespace-pre"
              style={{
                backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS_PROCESS})`,
                backgroundSize: `${GRAD_W}px ${GRAD_H}px`,
                backgroundPosition: `calc(${-MOVE_X}px * var(--grad-x-dec, 0.55) + ${SHIFT_X}px) calc(${-MOVE_Y}px * var(--grad-y-dec, 0.5) + ${SHIFT_Y}px)`,
              }}
            >
              {t("process.title")}
            </p>

            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                left: SP_X,
                top:  SP_Y,
                width:  "55.891px",
                height: "43.18px",
                backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS_PROCESS})`,
                backgroundSize: `${GRAD_W}px ${GRAD_H}px`,
                backgroundPosition: `calc(${-MOVE_X}px * var(--grad-x-dec, 0.55) + ${SHIFT_X}px - ${SP_X}px) calc(${-MOVE_Y}px * var(--grad-y-dec, 0.5) + ${SHIFT_Y}px - ${SP_Y}px)`,
                WebkitMaskImage:  "url(/img/process/sparkle.svg)",
                WebkitMaskSize:   "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskImage:        "url(/img/process/sparkle.svg)",
                maskSize:         "100% 100%",
                maskRepeat:       "no-repeat",
              } as React.CSSProperties}
            />
          </div>

          {/* Step info — fixed height prevents layout jump between steps */}
          <div className="h-[110px] md:h-[200px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
                {String(stepIndex + 1).padStart(2, "0")}. {t(`process.step${stepIndex + 1}Title`)}
              </p>
              <p className="font-body text-body-m md:text-body text-text-primary">
                {t(`process.step${stepIndex + 1}Body`)}
              </p>
            </motion.div>
          </AnimatePresence>
          </div>

        </motion.div>

        {/* ── Right column — cube animation ───────────────────────────────────── */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
        <SquircleCard className="relative w-full bg-background-surface overflow-hidden h-[160px] md:h-[400px] lg:h-[636px]" style={{ zIndex: 10000 }}>

          <div ref={cardInnerRef} className="absolute inset-0">

            <canvas
              ref={canvasRef}
              aria-hidden
              className="absolute inset-0"
              style={{ opacity: framesLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            />

            {/* Vignette overlay — fades edges to bg-surface */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 107% 50% at center, transparent 43.5%, var(--color-bg-surface) 58.2%)",
              }}
            />

          </div>
        </SquircleCard>
        </motion.div>

      </div>
    </section>
  );
}
