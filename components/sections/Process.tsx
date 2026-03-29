"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS_PROCESS } from "@/lib/gradient";
import SquircleCard from "@/components/ui/SquircleCard";

// ── Gradient geometry ────────────────────────────────────────────────────────
// Title box: 399 × 144 px (w-[399px], 2 lines × 72px line-height)
// backgroundSize = 250 % of the title box → same coordinate space for both elements
const TITLE_W  = 399;
const TITLE_H  = 144; // 2 × leading-[72px]
const GRAD_W   = TITLE_W * 3;        // 997.5 px
const GRAD_H   = TITLE_H * 2.5;        // 360 px
// Parallax motion range — total px the gradient travels across the full mouse range
const MOVE_X   = 120;
const MOVE_Y   = 50;
// Shifts that place gradient 0,0 at the title's top-left at the default
// mouse position (grad-x-dec = 0.45, grad-y-dec = 0.5 — GradientTracker init)
const SHIFT_X  = Math.round(MOVE_X * 0.45);
const SHIFT_Y  = Math.round(MOVE_Y * 0.10);

const STEPS = [
  {
    key: "step1",
    img: "/img/process/step-1.png",
    w: "269.85px",
    imgStyle: { left: "-23.04%", top: "0.23%", width: "137.96%", height: "107.08%" },
  },
  {
    key: "step2",
    img: "/img/process/step-2.png",
    w: "269.85px",
    imgStyle: { left: "-37.83%", top: "-3.54%", width: "137.96%", height: "107.08%" },
  },
  {
    key: "step3",
    img: "/img/process/step-3.png",
    w: "269.276px",
    imgStyle: { left: "-38.14%", top: "0%", width: "138.14%", height: "106.99%" },
  },
  {
    key: "step4",
    img: "/img/process/step-4.png",
    w: "269.85px",
    imgStyle: { left: "-24.32%", top: "0%", width: "138.07%", height: "107.17%" },
  },
];

export default function Process() {
  const { t, lang } = useTranslation();
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const lastLineRef = useRef<HTMLSpanElement>(null);
  const [spPos, setSpPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      if (!titleRef.current || !lastLineRef.current) return;
      const titleRect = titleRef.current.getBoundingClientRect();
      const lineRect  = lastLineRef.current.getBoundingClientRect();
      setSpPos({
        x: Math.round(lineRect.right  - titleRect.left),
        y: Math.round(lineRect.top    - titleRect.top),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (lastLineRef.current) ro.observe(lastLineRef.current);
    return () => ro.disconnect();
  }, [lang]);

  const CARD_TOP = 80;

  useEffect(() => {
    const onScroll = () => {
      wrapperRefs.current.forEach((el, i) => {
        if (!el || i === STEPS.length - 1) return;
        const next = wrapperRefs.current[i + 1];
        if (!next) return;

        const elRect = el.getBoundingClientRect();
        const nextTop = next.getBoundingClientRect().top;
        const overlap = elRect.bottom - nextTop;
        const progress = Math.max(0, Math.min(1, overlap / elRect.height));

        if (progress <= 0) {
          el.style.transform = "";
          el.style.opacity = "";
        } else {
          el.style.transform = `scale(${1 - progress * 0.06})`;
          el.style.opacity = `${1 - progress}`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const titleLines = t("process.title").split("\n");
  const lastLine   = titleLines[titleLines.length - 1];
  const otherLines = titleLines.slice(0, -1).join("\n");

  const SP_X = spPos?.x ?? 0;
  const SP_Y = spPos?.y ?? 0;

  return (
    <section className="relative flex gap-xs items-start px-xl py-l w-full max-w-[1440px] mx-auto">

      {/* ── Left column — sticks once it reaches the viewport ─────────────── */}
      <div className="sticky top-[80px] self-start shrink-0 w-[399px] relative">

        {/* Title */}
        <p
          ref={titleRef}
          className="w-full font-display font-medium text-[64px] leading-[72px] bg-clip-text text-transparent whitespace-pre"
          style={{
            backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS_PROCESS})`,
            backgroundSize: `${GRAD_W}px ${GRAD_H}px`,
            backgroundPosition: `calc(${-MOVE_X}px * var(--grad-x-dec, 0.55) + ${SHIFT_X}px) calc(${-MOVE_Y}px * var(--grad-y-dec, 0.5) + ${SHIFT_Y}px)`,
          }}
        >
          {otherLines}{"\n"}<span ref={lastLineRef}>{lastLine}</span>
        </p>

        {/* Sparkle — anchored to top-right of last word (EN: "happen", FR: "opère ?") */}
        {spPos && (
          <div
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: SP_X,
              top: SP_Y,
              width: "55.891px",
              height: "43.18px",
              backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS_PROCESS})`,
              backgroundSize: `${GRAD_W}px ${GRAD_H}px`,
              backgroundPosition: `calc(${-MOVE_X}px * var(--grad-x-dec, 0.55) + ${SHIFT_X}px - ${SP_X}px) calc(${-MOVE_Y}px * var(--grad-y-dec, 0.5) + ${SHIFT_Y}px - ${SP_Y}px)`,
              WebkitMaskImage: "url(/img/process/sparkle.svg)",
              WebkitMaskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskImage: "url(/img/process/sparkle.svg)",
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
            } as React.CSSProperties}
          />
        )}
      </div>

      {/* ── Right column — cards stack on top of each other ────────────────── */}
      <div className="flex flex-col gap-10 shrink-0 w-[620px]">
        {STEPS.map(({ key, img, w, imgStyle }, index) => (
          <div
            key={key}
            ref={(el) => { wrapperRefs.current[index] = el; }}
            className="sticky w-full"
            style={{
              top: `${CARD_TOP}px`,
              zIndex: 10001 + index,
              filter: "drop-shadow(0 -12px 20px var(--color-bg-base))",
              transformOrigin: "top center",
              willChange: "transform, opacity",
            }}
          >
          <SquircleCard
            className="bg-background-surface flex flex-col items-start overflow-hidden pb-10 pt-8 px-10 w-full"
          >
            {/* 3D illustration */}
            <div className="relative h-[140px] shrink-0 overflow-hidden mb-3" style={{ width: w, zIndex: 10000 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                aria-hidden
                className="absolute max-w-none"
                style={imgStyle}
                loading="lazy"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-4 w-full">
              <p className="font-display text-heading-4 text-text-primary">
                {t(`process.${key}Title`)}
              </p>
              <p className="font-body text-body text-text-secondary">
                {t(`process.${key}Body`)}
              </p>
            </div>
          </SquircleCard>
          </div>
        ))}
      </div>

    </section>
  );
}
