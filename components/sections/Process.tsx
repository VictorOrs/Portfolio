"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { loc, type HomepageData } from "@/lib/queries";
import { useLoading } from "@/lib/loading";
import { GRADIENT_STOPS } from "@/lib/gradient";
import SquircleCard from "@/components/ui/SquircleCard";

// ── Frame sequence ────────────────────────────────────────────────────────────
const DESKTOP_TOTAL = 363;
const MOBILE_TOTAL  = 182;
const MOBILE_BP     = 768;
const STEP_COUNT    = 4;
const STEP_DURATION = 6000; // ms

// ── Mobile choreography (< MOBILE_BP only) ────────────────────────────────────
// The section gets a scroll runway and pins its content; every beat below is a
// position on that runway's progress (0 → 1) rather than a duration.
// Runway length lives in the section's `max-md:h-[400vh]` class — JS reads it
// back off the element, so there is nothing to keep in sync here.
// A single scroll track spans approach + pinned runway. The section is 4× the
// viewport (`max-md:h-[400vh]`), so pinning begins exactly a quarter in; `runwayP`
// remaps the rest to the 0→1 the beats below are written against.
const PIN_START  = 0.25;
// TITLE_IN is on the raw track, i.e. during the approach — otherwise the title only
// starts fading in once the section is already pinned, which reads as late.
const TITLE_IN   = [0.06, 0.20] as const;
// Strictly sequential: the title must be fully gone before the cube starts, or
// it shows through the card while both are mid-fade. TITLE_OUT therefore ends
// exactly where CUBE_IN begins.
const TITLE_OUT  = [0.10, 0.18] as const;
const CUBE_IN    = [0.18, 0.28] as const;
const CUBE_RISE  = 48; // px the cube travels up during its entrance
const STEPS_FROM = 0.36; // steps + frame scrub own the rest of the runway

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 before `a`, 1 after `b`, linear in between. */
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/** Raw track progress → 0–1 across the pinned runway. */
const runwayP = (t: number) => clamp01((t - PIN_START) / (1 - PIN_START));
/** Runway progress → 0–1 across the steps band. */
const stepsProgress = (p: number) => clamp01((p - STEPS_FROM) / (1 - STEPS_FROM));

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
export default function Process({ data }: { data?: HomepageData | null }) {
  const { t, lang } = useTranslation();
  const { setProgress, setLoaded: setGlobalLoaded } = useLoading();

  const steps = data?.process_steps;
  const stepTitle = (i: number) =>
    (steps?.[i]?.[lang === "fr" ? "title_fr" : "title_en"]) || t(`process.step${i + 1}Title`);
  const stepBody = (i: number) =>
    (steps?.[i]?.[lang === "fr" ? "body_fr" : "body_en"]) || t(`process.step${i + 1}Body`);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { amount: 0.3 });
  // Preload the 3D cube frames a bit before the section scrolls into view.
  const nearView   = useInView(sectionRef, { once: true, margin: "800px 0px" });

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

  // ── Mobile: scroll drives everything (no timer, frames scrub continuously) ───
  // `null` until measured: rendering the desktop reveal before the media query
  // lands would register a `whileInView` observer that survives the prop being
  // removed, then fire a WAAPI opacity animation that overrides the scroll one.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Window-level scroll tracking (same as Hero) with the section's own geometry
  // read per tick: `useScroll({ target, offset })` reported a permanent 0 for this
  // pinned section, so the beats never fired.
  // 0 when the section's top reaches the viewport bottom, 1 when its bottom does.
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, () => {
    const el = sectionRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return r.height ? clamp01((window.innerHeight - r.top) / r.height) : 0;
  });

  // `isMobile` is false on the first render (no window during SSR), so framer
  // applies the desktop `initial` as inline style before the media query lands.
  // Dropping the props afterwards does not clear that state — only a MotionValue
  // overrides it — hence these constants rather than plain numbers/strings.
  const zeroY  = useMotionValue(0);
  const noBlur = useMotionValue("blur(0px)");

  // Written as functions, not [input]/[output] ranges: framer compiles range
  // form into scroll-linked WAAPI keyframes, which do not hold their last value
  // past the final offset here — the cube would fade back out after its beat.
  const titleOpacity   = useTransform(scrollYProgress, (t) =>
    Math.min(ramp(t, TITLE_IN[0], TITLE_IN[1]), 1 - ramp(runwayP(t), TITLE_OUT[0], TITLE_OUT[1])));
  const cubeOpacity    = useTransform(scrollYProgress, (t) => ramp(runwayP(t), CUBE_IN[0], CUBE_IN[1]));
  const cubeY          = useTransform(scrollYProgress, (t) => CUBE_RISE * (1 - ramp(runwayP(t), CUBE_IN[0], CUBE_IN[1])));
  const stepsOpacity   = useTransform(scrollYProgress, (t) => ramp(runwayP(t), CUBE_IN[1], STEPS_FROM));
  // Fill of the active step's bar — its position inside its own band.
  const stepFill = useTransform(scrollYProgress, (t) => {
    const local = stepsProgress(runwayP(t)) * STEP_COUNT;
    return clamp01(local - Math.floor(local));
  });

  // Scroll → active step + canvas frame. Writes to the canvas directly instead
  // of through state, so scrubbing never queues a React render per frame.
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    if (!isMobile) return;
    const local = stepsProgress(runwayP(t));

    const idx = Math.min(STEP_COUNT - 1, Math.floor(local * STEP_COUNT));
    setStepIndex((prev) => (prev === idx ? prev : idx));

    const bitmaps = bitmapsRef.current;
    if (!bitmaps.length) return;
    const frame = Math.round(local * (bitmaps.length - 1));
    if (frame !== frameRef.current) {
      frameRef.current = frame;
      const bmp = bitmaps[frame];
      if (ctxRef.current && bmp) drawContained(ctxRef.current, bmp, getCanvasZoom());
    }
  });

  // Sparkle — measured via getClientRects() on the title span
  const lastLineRef  = useRef<HTMLSpanElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const [sparkleLeft, setSparkleLeft] = useState(0);
  const [sparkleTop,  setSparkleTop]  = useState(0);

  const prevWidthRef = useRef(0);

  useLayoutEffect(() => {
    const update = () => {
      const span = lastLineRef.current;
      const wrap = titleWrapRef.current;
      if (!span || !wrap) return;
      const wr = wrap.getBoundingClientRect();
      // Skip if width hasn't changed (avoids unnecessary state updates)
      if (Math.round(wr.width) === prevWidthRef.current) return;
      prevWidthRef.current = Math.round(wr.width);
      const rects = span.getClientRects();
      if (!rects.length) return;
      const last = rects[rects.length - 1];
      setSparkleLeft(last.right - wr.left + 6);
      setSparkleTop(48);
      wrap.style.setProperty("--tw", `${wr.width}px`);
      wrap.style.setProperty("--th", `${wr.height}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (lastLineRef.current) ro.observe(lastLineRef.current);
    return () => ro.disconnect();
  }, [lang]);

  // ── Unblock the page immediately ─────────────────────────────────────────────
  // The intro/loading screen must NOT wait for the 3D cube frames (loaded lazily
  // below). Reveal the site as soon as the app mounts.
  useEffect(() => {
    setProgress(100);
    setGlobalLoaded();
  }, [setProgress, setGlobalLoaded]);

  // ── Lazy-load frames as the section approaches the viewport ───────────────────
  useEffect(() => {
    if (!nearView) return;
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
      });
      return () => { cancelled = true; };
    }

    const arr = new Array<ImageBitmap>(total);
    Promise.all(
      Array.from({ length: total }, (_, i) =>
        fetchBitmap(frameUrl(mobile, i)).then((bmp) => {
          if (cancelled) { bmp.close(); return; }
          arr[i] = bmp;
        })
      )
    ).then(() => {
      if (cancelled) return;
      bitmapsRef.current = arr;
      setFramesLoaded(true);
    });

    return () => {
      cancelled = true;
      bitmapsRef.current.forEach((b) => b?.close());
      bitmapsRef.current = [];
    };
  }, [nearView]);

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
    if (!framesLoaded || isMobile !== false) return; // mobile scrubs from scroll instead
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
  }, [stepIndex, framesLoaded, isMobile]);

  // Reset timerKey (and progress bar) each time the section enters the view
  useEffect(() => {
    if (isInView && isMobile === false) setTimerKey(k => k + 1);
  }, [isInView, isMobile]);

  // ── Auto-advance: desktop only — on mobile the scroll position is the source
  //    of truth, so a timer would fight it on every wheel event ────────────────
  useEffect(() => {
    if (!isInView || isMobile !== false) return;
    const dismissId = setTimeout(() => setTextVisible(false), STEP_DURATION - 300);
    const advanceId = setTimeout(() => {
      setStepIndex(prev => (prev + 1) % STEP_COUNT);
      setTextVisible(true);
    }, STEP_DURATION);
    return () => {
      clearTimeout(dismissId);
      clearTimeout(advanceId);
    };
  }, [timerKey, stepIndex, isInView, isMobile]);

  const handleStepClick = useCallback((i: number) => {
    // Mobile: move the scroll position instead of the state, so the pinned
    // sequence stays the single source of truth and can't desync.
    if (isMobile) {
      const el = sectionRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      const local = (i + 0.5) / STEP_COUNT;        // centre of the step's band
      const p = STEPS_FROM + local * (1 - STEPS_FROM);
      const t = PIN_START + p * (1 - PIN_START);   // runway → raw track
      // Track starts a viewport above the section (offset "start end").
      window.scrollTo({ top: docTop - vh + t * el.offsetHeight, behavior: "smooth" });
      return;
    }
    setStepIndex(i);
    setTextVisible(true);
    setTimerKey(k => k + 1);
  }, [isMobile]);

  // ── Shared styles ────────────────────────────────────────────────────────────
  const gradStyle = {
    backgroundImage:    `linear-gradient(115deg, ${GRADIENT_STOPS})`,
    backgroundSize:     "250% 250%",
    backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  // Desktop keeps the grouped scroll-into-view reveal; on mobile every block's
  // opacity comes from the runway instead, so the two must not both drive it.
  const reveal = (delay = 0) =>
    isMobile !== false
      ? {}
      : {
          initial:     { opacity: 0, y: 32, filter: "blur(4px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport:    { once: true, amount: 0.1 },
          transition:  { duration: 1.2, ease, delay },
        };

  return (
    <section ref={sectionRef} className="relative px-6 md:px-10 lg:px-s grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10 py-[60px] lg:py-l w-full max-w-[1440px] mx-auto max-md:h-[400vh] max-md:py-0">

      {/* 12-col centered wrapper — transparent to grid on lg+.
          Below md it pins for the length of the section's runway. */}
      <div className="col-span-full flex flex-col gap-10 min-[944px]:contents max-md:sticky max-md:top-0 max-md:h-screen max-md:gap-8 max-md:justify-between max-md:pt-[104px] max-md:pb-16">

        {/* ── Left column wrapper — contents on mobile, flex col on desktop ────── */}
        <div className="contents min-[944px]:flex min-[944px]:flex-col min-[944px]:gap-16 min-[944px]:justify-between min-[944px]:h-full min-[944px]:py-12 min-[944px]:col-span-5 min-[1127px]:col-span-4 xl:col-start-2">

          {/* Title + sparkle — order 1 on mobile */}
          <motion.div
            className="order-1 min-[944px]:order-none max-md:absolute max-md:inset-x-0 max-md:top-0 max-md:h-[62vh] max-md:flex max-md:items-center max-md:pointer-events-none"
            {...reveal()}
            style={isMobile ? { opacity: titleOpacity, y: zeroY, filter: noBlur } : undefined}
          >
            <div ref={titleWrapRef} className="relative max-md:w-full">
              <p
                className="font-display text-2xl bg-clip-text text-transparent whitespace-pre-line text-center min-[944px]:text-left"
                style={gradStyle}
              >
                <span ref={lastLineRef}>{loc(data, "process_title", lang) ?? t("process.title")}</span>
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
            className="order-3 min-[944px]:order-none flex flex-col gap-6 max-md:gap-4 max-md:min-h-0"
            {...reveal()}
            style={isMobile ? { opacity: stepsOpacity, y: zeroY, filter: noBlur } : undefined}
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
                    key={isMobile ? "scroll" : `${stepIndex}-${timerKey}`}
                    aria-hidden
                    className="absolute left-[-3px] top-0 w-[3px] pointer-events-none"
                    {...(isMobile
                      ? {}
                      : {
                          initial:    { scaleY: 0 },
                          animate:    { scaleY: 1 },
                          transition: { duration: STEP_DURATION / 1000, ease: "linear" },
                        })}
                    style={{
                      // Mobile: the bar tracks the scroll position inside the
                      // step's band rather than a fixed duration.
                      ...(isMobile ? { scaleY: stepFill } : {}),
                      height:          "100%",
                      transformOrigin: "top",
                      backgroundColor: "white",
                    }}
                  />
                )}

                <p className="font-body text-xxs uppercase text-text-secondary">
                  {String(i + 1).padStart(2, "0")}. {stepTitle(i)}
                </p>

                <motion.div
                  animate={{ gridTemplateRows: i === stepIndex ? "1fr" : "0fr" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "grid" }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <motion.p
                      className="font-body text-s font-medium text-text-primary pt-3"
                      animate={{ opacity: i === stepIndex && textVisible ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {stepBody(i)}
                    </motion.p>
                  </div>
                </motion.div>
              </button>
            ))}
          </motion.div>

        </div>

        {/* ── Right: cube — 5 cols (col 7–11, col 6 = gap) ───────────────────── */}
        <motion.div
          className="aspect-video order-2 min-[944px]:order-none min-[944px]:aspect-auto min-[944px]:h-[570px] min-[944px]:col-start-6 min-[944px]:col-span-5 xl:col-start-7 max-md:aspect-auto max-md:h-[360px] max-md:shrink-0"
          {...reveal(0.1)}
          style={isMobile ? { opacity: cubeOpacity, y: cubeY, filter: noBlur } : undefined}
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
                className="lg:hidden absolute inset-0 pointer-events-none"
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
