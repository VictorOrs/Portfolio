"use client";

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
const SPAN_X   = GRAD_W - TITLE_W;     // 598.5 px  (panning range)
const SPAN_Y   = GRAD_H - TITLE_H;     // 216 px
// Parallax motion range — total px the gradient travels across the full mouse range
const MOVE_X   = 120;
const MOVE_Y   = 50;
// Shifts that place gradient 0,0 at the title's top-left at the default
// mouse position (grad-x-dec = 0.45, grad-y-dec = 0.5 — GradientTracker init)
const SHIFT_X  = Math.round(MOVE_X * 0.45);
const SHIFT_Y  = Math.round(MOVE_Y * 0.10);
// Sparkle offset from the title's top-left corner
// left:483 − px-xl:177 = 306 px;  top:179 − py-l:120 = 59 px
const SP_X = 306;
const SP_Y = 59;

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
  const { t } = useTranslation();

  return (
    <section className="relative flex gap-xs items-start px-xl py-l w-full max-w-[1440px] mx-auto">

      {/* Title — gradient in absolute-px coordinates so the sparkle can
          share the exact same raster at its offset within the title block */}
      <p
        className="shrink-0 w-[399px] font-display font-medium text-[64px] leading-[72px] bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS_PROCESS})`,
          backgroundSize: `${GRAD_W}px ${GRAD_H}px`,
          backgroundPosition: `calc(${-MOVE_X}px * var(--grad-x-dec, 0.55) + ${SHIFT_X}px) calc(${-MOVE_Y}px * var(--grad-y-dec, 0.5) + ${SHIFT_Y}px)`,
        }}
      >
        How does
        <br />
        the magic happen
      </p>

      {/* Sparkle — exact same gradient shifted by the sparkle's offset (SP_X, SP_Y)
          from the title's origin, giving pixel-perfect continuity */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: 483,
          top: 179,
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

      {/* Cards */}
      <div className="flex flex-col gap-xs shrink-0 w-[620px]">
        {STEPS.map(({ key, img, w, imgStyle }) => (
          <SquircleCard
            key={key}
            className="bg-background-surface flex flex-col items-start overflow-hidden pb-10 pt-8 px-10 w-full"
          >
            {/* 3D illustration */}
            <div className="relative h-[140px] shrink-0 overflow-hidden mb-3" style={{ width: w }}>
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
        ))}
      </div>

    </section>
  );
}
