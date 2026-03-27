"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";
import WorkController from "@/components/ui/WorkController";
import WorkCard, { type WorkCardProps } from "@/components/ui/WorkCard";

// ── Enuma illustration ────────────────────────────────────────────────────────

function EnumaIllustration() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Image
        src="/img/work/enuma_illustration.png"
        alt=""
        fill
        unoptimized
        className="object-cover object-right"
      />
    </div>
  );
}

// ── Slide definitions ─────────────────────────────────────────────────────────

// ── Constants ─────────────────────────────────────────────────────────────────

const DURATION    = 6000; // ms per slide
const SLIDE_COUNT = 3;
const ease        = [0.22, 1, 0.36, 1] as const;

// ── Section ───────────────────────────────────────────────────────────────────

export default function Work() {
  const { t } = useTranslation();

  const SLIDES: Array<{ id: string; card: WorkCardProps }> = [
    {
      id: "enuma",
      card: {
        logo: { src: "/img/work/enuma_logo.svg", alt: "enuma" },
        title: t("work.enumaTitle"),
        showWorkedOn: true,
        ctaPrimary:   { label: t("work.learnMore"),                href: "#" },
        ctaSecondary: { label: t("work.enumaCta"), href: "https://www.enuma-collective.com" },
        illustration: <EnumaIllustration />,
      },
    },
    {
      id: "slide-2",
      card: {},
    },
    {
      id: "slide-3",
      card: {},
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress]       = useState(0);
  const [paused, setPaused]           = useState(false);
  const [cardH, setCardH]             = useState(540);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setCardH(380);
      else if (window.innerWidth < 1024) setCardH(460);
      else setCardH(540);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const progressRef = useRef(0);
  const rafRef      = useRef<number>(0);

  // RAF-based timer — re-runs on pause toggle or slide change
  useEffect(() => {
    if (paused) return;

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
        setActiveIndex((prev) => (prev + 1) % SLIDE_COUNT);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, activeIndex]);

  const handleDotClick = useCallback((i: number) => {
    cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    setProgress(0);
    setActiveIndex(i);
  }, []);

  const nextIndex = (activeIndex + 1) % SLIDE_COUNT;

  return (
    <section
      className="relative px-6 py-12 md:px-10 md:py-16 lg:px-xl lg:py-l w-full max-w-[1440px] mx-auto flex flex-col gap-12 md:gap-16"
      style={{ zIndex: 10000 }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col gap-6 items-center text-center"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease }}
      >
        <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
          {t("work.eyebrow")}
        </p>
        <p
          className="font-display text-heading-3 md:text-heading-2 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
            backgroundSize: "250% 250%",
            backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
          }}
        >
          {t("work.titlePrefix")} {t("work.titleHighlight")}
        </p>
      </motion.div>

      {/* ── Card carousel ──────────────────────────────────────────────────── */}
      <motion.div
        className="relative"
        style={{ height: cardH + 30 }}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 1.2, ease, delay: 0.1 }}
      >
        {/* Behind card — next slide peeking from bottom */}
        <div
          aria-hidden
          className="absolute inset-x-4 bottom-0 pointer-events-none overflow-hidden rounded-[40px]"
          style={{
            height: cardH,
            zIndex: 1,
            opacity: 0.4,
            transform: "scaleX(0.97)",
            transformOrigin: "center bottom",
          }}
        >
          <WorkCard {...SLIDES[nextIndex].card} height={cardH} />
        </div>

        {/* Active card */}
        <div className="absolute inset-x-0 top-0" style={{ zIndex: 2 }}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.65, ease }}
            >
              <WorkCard {...SLIDES[activeIndex].card} height={cardH} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Controller ─────────────────────────────────────────────────────── */}
      <motion.div
        className="flex justify-center"
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
          onDotClick={handleDotClick}
        />
      </motion.div>
    </section>
  );
}
