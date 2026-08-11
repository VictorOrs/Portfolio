"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { loc, type HomepageData } from "@/lib/queries";
import { GRADIENT_STOPS } from "@/lib/gradient";
import WorkController from "@/components/ui/WorkController";
import WorkCard, { type WorkCardProps } from "@/components/ui/WorkCard";
import { buttonVariants } from "@/components/ui/Button";
import { EnumaIllustration, MosoIllustration } from "@/components/work/illustrations";
import { useWorkExpand } from "@/components/work/WorkExpandContext";

// ── Constants ─────────────────────────────────────────────────────────────────

const DURATION = 6000; // ms per slide
const ease        = [0.22, 1, 0.36, 1] as const;

// ── Section ───────────────────────────────────────────────────────────────────

export default function Work({ sliderOnly = false, data }: { sliderOnly?: boolean; data?: HomepageData | null }) {
  const { t, lang } = useTranslation();
  const { openSlug } = useWorkExpand();

  const SLIDES: Array<{ id: string; card: WorkCardProps }> = [
    {
      id: "enuma",
      card: {
        slug: "enuma",
        logo: { src: "/img/work/enuma_logo.svg", alt: "enuma" },
        title: loc(data, "work_enumaTitle", lang) ?? t("work.enumaTitle"),
        showWorkedOn: true,
        ctaSecondary: { label: t("work.enumaCta"), href: "https://www.enuma-collective.com" },
        illustration: <EnumaIllustration />,
      },
    },
    {
      id: "moso",
      card: {
        slug: "moso",
        logo: { src: "/img/work/moso_logo.svg", alt: "moso" },
        title: loc(data, "work_mosoTitle", lang) ?? t("work.mosoTitle"),
        ctaSecondary: { label: t("work.mosoCta"), href: "https://www.motionsociety.com" },
        illustration: <MosoIllustration />,
      },
    },
    ...(!sliderOnly ? [{
      id: "see-more",
      card: {
        lightMode: true,
        illustration: (
          <>
          {/* Light gradient — sits behind the (transparent) illustration as the card background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(245, 245, 245, 0.88) 0%, rgba(245, 245, 245, 0.72) 100%)" }}
            aria-hidden
          />
          <div
            className="absolute pointer-events-none max-[425px]:w-full min-[426px]:top-[-112px] min-[426px]:left-[-128px] min-[426px]:w-[1086px] md:top-[-2px] md:left-0"
            aria-hidden
          >
            {/* Default asset (≥ 426px) */}
            <Image
              src="/img/work/more.webp"
              alt=""
              width={1672}
              height={946}
              sizes="(max-width: 1024px) 100vw, 1086px"
              className="w-full object-cover max-[425px]:hidden"
            />
            {/* Mobile asset (< 426px) */}
            <Image
              src="/img/work/more_mobile.webp"
              alt=""
              width={328}
              height={420}
              sizes="100vw"
              className="w-full object-cover hidden max-[425px]:block"
            />
          </div>
          </>
        ),
        customContent: (
          <div className="absolute bottom-0 left-0 right-0 p-8 md:px-[48px] md:py-[48px] flex flex-col gap-4 md:gap-8">
            <h4 className="font-display text-l">
              <span className="text-text-secondary">
                {loc(data, "work_seeMoreMuted", lang) ?? t("work.seeMoreLine1")}
              </span>{" "}
              <span className="text-text-primary whitespace-pre-line">
                {loc(data, "work_seeMoreEmphasis", lang) ?? `${t("work.seeMoreLine2")}\n${t("work.seeMoreLine3")}`}
              </span>
            </h4>
            {/* href will be replaced with a Figma portfolio link when ready */}
            <a href="#" className={`${buttonVariants({ variant: "primary", size: "md" })} self-start max-[425px]:self-stretch`}>
              <span className="py-0.5 px-1">{t("work.seeAllWork")}</span>
            </a>
          </div>
        ),
      } as WorkCardProps,
    }] : []),
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { amount: 0.3 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress]       = useState(0);
  const [paused, setPaused]           = useState(false);
  const [cardH, setCardH]             = useState(540);
  const [cardGap, setCardGap]         = useState(24);

  // ── Controller reveal — observed while still in normal flow, so its geometry
  //    is real. Dot morph / autoplay timer / sticky fire on their own short
  //    delay once visible, instead of waiting for the whole pill fade to end.
  const controllerRef    = useRef<HTMLDivElement>(null);
  const controllerInView = useInView(controllerRef, { once: true, amount: 1 });
  const [revealDone, setRevealDone] = useState(false);

  useEffect(() => {
    if (!controllerInView) return;
    const timer = setTimeout(() => setRevealDone(true), 400);
    return () => clearTimeout(timer);
  }, [controllerInView]);

  useEffect(() => {
    const update = () => {
      setCardH(window.innerWidth < 768 ? 420 : 540);
      setCardGap(window.innerWidth < 768 ? 16 : 24);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const progressRef = useRef(0);
  const rafRef      = useRef<number>(0);

  // Reset progress when section leaves the viewport
  useEffect(() => {
    if (!inView) {
      cancelAnimationFrame(rafRef.current);
      progressRef.current = 0;
      setProgress(0);
    }
  }, [inView]);

  // RAF-based timer — only runs when section is visible, not paused, not sliderOnly,
  // and not while a project overlay is open (avoids the slide moving under the morph).
  useEffect(() => {
    if (sliderOnly || paused || !inView || !revealDone || openSlug) return;

    const startP = progressRef.current; // resume from current position when unpausing
    let t0: number | null = null;

    const tick = (now: number) => {
      if (t0 === null) t0 = now - startP * DURATION;
      const p = Math.min(1, (now - t0) / DURATION);
      progressRef.current = p;
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        progressRef.current = 0;
        setProgress(0);
        setActiveIndex((prev) => (prev + 1) % SLIDES.length);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, inView, revealDone, activeIndex, openSlug]);

  const transitionLock = useRef(false);

  const goToSlide = useCallback((i: number) => {
    if (transitionLock.current) return;
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, i));
    if (clamped === activeIndex) return;
    transitionLock.current = true;
    cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    setProgress(0);
    setActiveIndex(clamped);
    setTimeout(() => { transitionLock.current = false; }, 700);
  }, [activeIndex]);

  // ── Swipe / drag detection ──────────────────────────────────────────────────
  const sliderRef    = useRef<HTMLDivElement>(null);
  const dragStartX   = useRef(0);
  const isDragging   = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (delta < -50)      goToSlide(activeIndex + 1);
    else if (delta > 50)  goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // ── Trackpad horizontal wheel ───────────────────────────────────────────────
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let locked = false;
    let lockTimer: number;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (locked) return;

      if (e.deltaX > 30)       { goToSlide(activeIndex + 1); locked = true; }
      else if (e.deltaX < -30) { goToSlide(activeIndex - 1); locked = true; }

      clearTimeout(lockTimer);
      lockTimer = window.setTimeout(() => { locked = false; }, 500);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(lockTimer); };
  }, [activeIndex, goToSlide]);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-10 lg:px-s py-[60px] lg:py-l w-full max-w-[1440px] mx-auto grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10"
      style={{ zIndex: 10000 }}
    >
      <div className="flex flex-col gap-10 md:gap-16 col-span-full xl:col-start-2 xl:col-span-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {!sliderOnly && (
        <motion.div
          className="flex flex-col gap-3 items-center text-center"
          initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          <p className="font-body text-xs uppercase text-text-secondary">
            {loc(data, "work_eyebrow", lang) ?? t("work.eyebrow")}
          </p>
          <p
            className="font-display text-2xl bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
              backgroundSize: "250% 250%",
              backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
            }}
          >
            {loc(data, "work_title", lang) ?? `${t("work.titlePrefix")} ${t("work.titleHighlight")}`}
          </p>
        </motion.div>
      )}

      {/* ── Carousel + controller — own wrapper so the sticky controller is
           scoped to the carousel's scroll height, not the whole section. ── */}
      <div className="flex flex-col gap-10 md:gap-16">

        {/* ── Horizontal slider ────────────────────────────────────────── */}
        <motion.div
          ref={sliderRef}
          className="overflow-visible touch-pan-y"
          initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { isDragging.current = false; }}
        >
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{ x: `calc(${-activeIndex * 100}% - ${activeIndex * (typeof window !== "undefined" && window.innerWidth < 768 ? 16 : 24)}px)` }}
            transition={{ duration: 0.65, ease }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={`w-full shrink-0${i !== activeIndex ? " cursor-pointer" : ""}`}
                onClick={() => i !== activeIndex && goToSlide(i)}
              >
                <WorkCard {...slide.card} height={cardH} expandable={!sliderOnly && i === activeIndex} />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Controller — stays in normal flow while it reveals (so the fade +
             slide is actually on screen when it plays), then turns sticky. ── */}
        {!sliderOnly && (
          <motion.div
            ref={controllerRef}
            className={`flex justify-center z-10${revealDone ? " sticky bottom-6" : ""}`}
            initial={{ opacity: 0, y: 16 }}
            animate={controllerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease, delay: 0.2 }}
          >
            <WorkController
              count={SLIDES.length}
              activeIndex={activeIndex}
              progress={progress}
              paused={paused}
              onTogglePause={() => setPaused((p) => !p)}
              onDotClick={goToSlide}
              revealed={revealDone}
            />
          </motion.div>
        )}
      </div>

      </div>
    </section>
  );
}
