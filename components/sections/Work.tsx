"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";
import WorkController from "@/components/ui/WorkController";
import Link from "next/link";
import WorkCard, { type WorkCardProps } from "@/components/ui/WorkCard";
import { buttonVariants } from "@/components/ui/Button";

// ── Enuma illustration ────────────────────────────────────────────────────────

function EnumaIllustration() {
  return (
    <div className="absolute inset-0 top-[-170px] right-[-340px] bottom-0 left-8 max-lg:top-[-96px] max-lg:right-[-160px] max-lg:bottom-[160px] max-lg:left-[40px] max-md:top-[-176px] max-md:right-[-160px] max-md:left-[24px] max-md:bottom-[96px] max-[425px]:top-[-250px] max-[425px]:bottom-[150px] max-[425px]:left-0 max-[425px]:right-0 pointer-events-none" aria-hidden>
      <Image
        src="/img/work/enuma_illustration.png"
        alt=""
        fill
        unoptimized
        className="object-cover opacity-[0.72]"
      />
    </div>
  );
}

// ── Moso illustration ────────────────────────────────────────────────────────

function MosoIllustration() {
  return (
    <div
      className="absolute inset-0 max-md:top-[-90px] max-md:right-[-470px] max-md:left-[-28px] max-[425px]:top-[-60px] max-[425px]:right-[-162px] max-[425px]:left-0 pointer-events-none"
      aria-hidden
    >
      <Image
        src="/img/work/moso_illustration.png"
        alt=""
        fill
        unoptimized
        className="object-cover object-top"
      />
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DURATION = 6000; // ms per slide
const ease        = [0.22, 1, 0.36, 1] as const;

// ── Section ───────────────────────────────────────────────────────────────────

export default function Work({ sliderOnly = false }: { sliderOnly?: boolean }) {
  const { t } = useTranslation();

  const SLIDES: Array<{ id: string; card: WorkCardProps }> = [
    {
      id: "enuma",
      card: {
        logo: { src: "/img/work/enuma_logo.svg", alt: "enuma" },
        title: t("work.enumaTitle"),
        showWorkedOn: true,
        ctaPrimary:   { label: t("work.learnMore"),                href: "/work/enuma" },
        ctaSecondary: { label: t("work.enumaCta"), href: "https://www.enuma-collective.com" },
        illustration: <EnumaIllustration />,
      },
    },
    {
      id: "moso",
      card: {
        logo: { src: "/img/work/moso_logo.svg", alt: "moso" },
        title: t("work.mosoTitle"),
        ctaPrimary:   { label: t("work.learnMore"), href: "/work/moso" },
        ctaSecondary: { label: t("work.mosoCta"), href: "https://www.motionsociety.com" },
        illustration: <MosoIllustration />,
      },
    },
    ...(!sliderOnly ? [{
      id: "see-more",
      card: {
        lightMode: true,
        illustration: (
          <div className="absolute top-0 bottom-0 left-0 right-[-230px] md:right-[-140px] lg:right-0 max-[425px]:left-[-218px] max-[425px]:top-[-172px] max-[425px]:w-[1086px] max-[425px]:h-[540px] max-[425px]:bottom-auto pointer-events-none" aria-hidden>
            <Image
              src="/img/work/more.png"
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ),
        customContent: (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:px-[48px] md:py-[48px] flex flex-col gap-8">
            <h4 className="font-display text-l">
              <span className="text-text-secondary">{t("work.seeMoreLine1")}</span>{" "}
              <span className="text-text-primary">{t("work.seeMoreLine2")}</span>
              <br />
              <span className="text-text-primary">{t("work.seeMoreLine3")}</span>
            </h4>
            <Link
              href="/work"
              className={`${buttonVariants({ variant: "primary", size: "md" })} self-start max-[425px]:self-stretch`}
            >
              <span className="py-0.5 px-1">{t("work.seeAllWork")}</span>
            </Link>
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

  useEffect(() => {
    const update = () => setCardH(window.innerWidth < 768 ? 420 : 540);
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

  // RAF-based timer — only runs when section is visible, not paused, and not sliderOnly
  useEffect(() => {
    if (sliderOnly || paused || !inView) return;

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
  }, [paused, inView, activeIndex]);

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
      <div className="flex flex-col gap-8 md:gap-16 col-span-full xl:col-start-2 xl:col-span-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {!sliderOnly && (
        <motion.div
          className="flex flex-col gap-6 items-center text-center"
          initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
            {t("work.eyebrow")}
          </p>
          <p
            className="font-display text-2xl bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
              backgroundSize: "250% 250%",
              backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
            }}
          >
            {t("work.titlePrefix")} {t("work.titleHighlight")}
          </p>
        </motion.div>
      )}

      {/* ── Horizontal slider ────────────────────────────────────────────── */}
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
          className="flex gap-6"
          animate={{ x: `calc(${-activeIndex * 100}% - ${activeIndex * 24}px)` }}
          transition={{ duration: 0.65, ease }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`w-full shrink-0${i !== activeIndex ? " cursor-pointer" : ""}`}
              onClick={() => i !== activeIndex && goToSlide(i)}
            >
              <WorkCard {...slide.card} height={cardH} />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Sticky controller ─────────────────────────────────────────────── */}
      {!sliderOnly && (
        <motion.div
          className="sticky bottom-6 flex justify-center z-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease, delay: 0.2 }}
        >
          <WorkController
            count={SLIDES.length}
            activeIndex={activeIndex}
            progress={progress}
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            onDotClick={goToSlide}
          />
        </motion.div>
      )}

      </div>
    </section>
  );
}
