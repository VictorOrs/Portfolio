"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useLoading } from "@/lib/loading";
import { GRADIENT_STOPS } from "@/lib/gradient";
import SquircleCard from "@/components/ui/SquircleCard";

// ── Frame sequence ────────────────────────────────────────────────────────────
const DESKTOP_TOTAL = 363;
const MOBILE_TOTAL  = 182;
const MOBILE_BP     = 768;
const STEP_COUNT    = 4;
const STEP_DURATION = 4000; // ms

function frameUrl(mobile: boolean, idx: number): string {
  const n = String(idx + 1).padStart(3, "0");
  return `/frames/${mobile ? "mobile" : "desktop"}/frame_${n}.webp`;
}

async function fetchBitmap(url: string): Promise<ImageBitmap> {
  const res  = await fetch(url);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

const CANVAS_ZOOM     = 1.25;
const CANVAS_ZOOM_SM  = 0.9;
const CANVAS_OFFSET_X = 12;

function getCanvasZoom(): number {
  return window.innerWidth >= 1024 || window.innerWidth <= 425 ? CANVAS_ZOOM : CANVAS_ZOOM_SM;
}

function drawContained(ctx: CanvasRenderingContext2D, bmp: ImageBitmap, zoom = CANVAS_ZOOM): void {
  const cw    = ctx.canvas.width;
  const ch    = ctx.canvas.height;
  const scale = Math.min(cw / bmp.width, ch / bmp.height) * zoom;
  const dx    = (cw - bmp.width  * scale) / 2 + CANVAS_OFFSET_X;
  const dy    = (ch - bmp.height * scale) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(bmp, dx, dy, bmp.width * scale, bmp.height * scale);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Process() {
  const { t, lang } = useTranslation();
  const { setProgress, setLoaded: setGlobalLoaded } = useLoading();

  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { amount: 0.3 });

  // Canvas
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const ctxRef       = useRef<CanvasRenderingContext2D | null>(null);
  const bitmapsRef   = useRef<ImageBitmap[]>([]);
  const frameRef     = useRef(0);
  const rafRef       = useRef<number>(0);

  const [framesLoaded,  setFramesLoaded]  = useState(false);
  const [stepIndex,     setStepIndex]     = useState(0);
  const [textVisible,   setTextVisible]   = useState(true);
  // timerKey resets the auto-advance cycle on manual step click
  const [timerKey, setTimerKey] = useState(0);

  // Sparkle — measured via getClientRects() on the title span
  const lastLineRef  = useRef<HTMLSpanElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const [sparkleLeft, setSparkleLeft] = useState(0);
  const [sparkleTop,  setSparkleTop]  = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      const span = lastLineRef.current;
      const wrap = titleWrapRef.current;
      if (!span || !wrap) return;
      // getClientRects() returns one rect per line box for inline elements
      const rects = span.getClientRects();
      if (!rects.length) return;
      const last = rects[rects.length - 1];
      const wr   = wrap.getBoundingClientRect();
      setSparkleLeft(last.right - wr.left + 6);
      setSparkleTop(48);
      // Store parent dimensions as CSS vars for sparkle gradient continuity
      wrap.style.setProperty("--tw", `${wr.width}px`);
      wrap.style.setProperty("--th", `${wr.height}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (lastLineRef.current) ro.observe(lastLineRef.current);
    return () => ro.disconnect();
  }, [lang]);

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

  // ── Canvas sizing ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!framesLoaded) return;
    const canvas    = canvasRef.current;
    const cardInner = cardInnerRef.current;
    if (!canvas || !cardInner) return;

    ctxRef.current = canvas.getContext("2d");

    const sizeCanvas = () => {
      const { width, height } = cardInner.getBoundingClientRect();
      canvas.width  = width;
      canvas.height = height;
      const bmp = bitmapsRef.current[frameRef.current];
      if (ctxRef.current && bmp) drawContained(ctxRef.current, bmp, getCanvasZoom());
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    return () => window.removeEventListener("resize", sizeCanvas);
  }, [framesLoaded]);

  // ── Animate canvas to target frame over 2 s when step changes ───────────────
  useEffect(() => {
    if (!framesLoaded) return;
    const bitmaps    = bitmapsRef.current;
    const total      = bitmaps.length;
    const target     = Math.round((stepIndex / (STEP_COUNT - 1)) * (total - 1));
    const startFrame = frameRef.current;

    cancelAnimationFrame(rafRef.current);

    // Delay so step text + progress bar render first, then cube animates
    const timeoutId = setTimeout(() => {
      const startTime    = performance.now();
      const ANIM_DURATION = 2000; // ms

      const tick = (now: number) => {
        const t      = Math.min(1, (now - startTime) / ANIM_DURATION);
        // Ease in-out quad
        const eased  = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const frame  = Math.round(startFrame + (target - startFrame) * eased);

        if (frame !== frameRef.current) {
          frameRef.current = frame;
          const bmp = bitmaps[frame];
          if (ctxRef.current && bmp) drawContained(ctxRef.current, bmp, getCanvasZoom());
        }

        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafRef.current);
    };
  }, [stepIndex, framesLoaded]);

  // Reset timerKey (and progress bar) each time the section enters the view
  useEffect(() => {
    if (isInView) setTimerKey(k => k + 1);
  }, [isInView]);

  // ── Auto-advance: only when section is in view ───────────────────────────────
  useEffect(() => {
    if (!isInView) return;
    const dismissId = setTimeout(() => setTextVisible(false), STEP_DURATION - 300);
    const advanceId = setTimeout(() => {
      setStepIndex(prev => (prev + 1) % STEP_COUNT);
      setTextVisible(true);
    }, STEP_DURATION);
    return () => {
      clearTimeout(dismissId);
      clearTimeout(advanceId);
    };
  }, [timerKey, stepIndex, isInView]);

  const handleStepClick = useCallback((i: number) => {
    setStepIndex(i);
    setTextVisible(true);
    setTimerKey(k => k + 1);
  }, []);

  // ── Shared styles ────────────────────────────────────────────────────────────
  const gradStyle = {
    backgroundImage:    `linear-gradient(115deg, ${GRADIENT_STOPS})`,
    backgroundSize:     "250% 250%",
    backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section ref={sectionRef} className="relative px-6 md:px-10 lg:px-s grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10 py-[60px] lg:py-l w-full max-w-[1440px] mx-auto">

      {/* 12-col centered wrapper — transparent to grid on lg+ */}
      <div className="col-span-full flex flex-col gap-10 min-[944px]:contents">

        {/* ── Left column wrapper — contents on mobile, flex col on desktop ────── */}
        <div className="contents min-[944px]:flex min-[944px]:flex-col min-[944px]:gap-16 min-[944px]:col-span-5 min-[1127px]:col-span-4 xl:col-start-2">

          {/* Title + sparkle — order 1 on mobile */}
          <motion.div
            className="order-1 min-[944px]:order-none"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease }}
          >
            <div ref={titleWrapRef} className="relative">
              <p
                className="font-display text-2xl bg-clip-text text-transparent whitespace-pre-line text-center min-[944px]:text-left"
                style={gradStyle}
              >
                <span ref={lastLineRef}>{t("process.title")}</span>
              </p>
              {/* Sparkle — fenêtre dans le même gradient que le titre, alignée en px */}
              <div
                aria-hidden
                className="absolute pointer-events-none w-[56px] h-[43px] max-[425px]:w-[40px] max-[425px]:h-[31px]"
                style={{
                  left: sparkleLeft,
                  top:  sparkleTop,
                  backgroundImage:    `linear-gradient(115deg, ${GRADIENT_STOPS})`,
                  backgroundSize:     "calc(var(--tw, 400px) * 2.5) calc(var(--th, 144px) * 2.5)",
                  backgroundPosition: `calc(var(--grad-x-dec, 0.55) * var(--tw, 400px) * -1.5 - ${sparkleLeft}px) calc(var(--grad-y-dec, 0.5) * var(--th, 144px) * -1.5 - 48px)`,
                  WebkitMaskImage:    "url(/img/process/sparkle.svg)",
                  WebkitMaskSize:     "100% 100%",
                  WebkitMaskRepeat:   "no-repeat",
                  maskImage:          "url(/img/process/sparkle.svg)",
                  maskSize:           "100% 100%",
                  maskRepeat:         "no-repeat",
                } as React.CSSProperties}
              />
            </div>
          </motion.div>

          {/* Steps list — order 3 on mobile */}
          <motion.div
            className="order-3 min-[944px]:order-none flex flex-col gap-6"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease }}
          >
            {Array.from({ length: STEP_COUNT }, (_, i) => (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className="relative text-left border-l-[3px] border-solid pl-6 flex flex-col w-full overflow-visible"
                style={{ borderColor: "var(--color-alpha)" }}
              >
                {/* Animated progress bar over active step border */}
                {i === stepIndex && (
                  <motion.div
                    key={`${stepIndex}-${timerKey}`}
                    aria-hidden
                    className="absolute left-[-3px] top-0 w-[3px] pointer-events-none"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
                    style={{
                      height:          "100%",
                      transformOrigin: "top",
                      backgroundColor: "white",
                    }}
                  />
                )}

                <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
                  {String(i + 1).padStart(2, "0")}. {t(`process.step${i + 1}Title`)}
                </p>

                <motion.div
                  animate={{ gridTemplateRows: i === stepIndex ? "1fr" : "0fr" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "grid" }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <motion.p
                      className="font-body text-m text-text-primary pt-3"
                      animate={{ opacity: i === stepIndex && textVisible ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {t(`process.step${i + 1}Body`)}
                    </motion.p>
                  </div>
                </motion.div>
              </button>
            ))}
          </motion.div>

        </div>

        {/* ── Right: cube — 5 cols (col 7–11, col 6 = gap) ───────────────────── */}
        <motion.div
          className="aspect-video order-2 min-[944px]:order-none min-[944px]:aspect-auto min-[944px]:h-[570px] min-[944px]:col-start-6 min-[944px]:col-span-5 xl:col-start-7"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          <SquircleCard className="relative w-full h-full bg-background-surface overflow-hidden">
            <div ref={cardInnerRef} className="absolute inset-0">
              <canvas
                ref={canvasRef}
                aria-hidden
                className="absolute inset-0"
                style={{ opacity: framesLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
              />
              {/* Desktop vignette */}
              <div
                aria-hidden
                className="hidden lg:block absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 107% 50% at center, transparent 43.5%, var(--color-bg-surface) 58.2%)",
                }}
              />
              {/* Mobile vignette */}
              <div
                aria-hidden
                className="max-[425px]:hidden lg:hidden absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 47% 38% at center, transparent 60%, var(--color-bg-surface) 100%)",
                }}
              />
            </div>
          </SquircleCard>
        </motion.div>

      </div>
    </section>
  );
}
