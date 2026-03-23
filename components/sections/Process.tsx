"use client";

import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";
import SquircleCard from "@/components/ui/SquircleCard";

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

      {/* Shared gradient — both title and sparkle sample from the same
          viewport-relative coordinate space via backgroundAttachment: fixed  */}
      {/* Title */}
      <p
        className="shrink-0 w-[399px] font-display font-medium text-[64px] leading-[72px] bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
          backgroundSize: "70% 70%",
          backgroundPosition: "var(--grad-x, 55%) var(--grad-y, 50%)",
          backgroundAttachment: "fixed",
        }}
      >
        How does
        <br />
        the magic happen
      </p>

      {/* Sparkle decoration — same fixed gradient, masked to sparkle shape */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: 483,
          top: 179,
          width: "55.891px",
          height: "43.18px",
          backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
          backgroundSize: "70% 70%",
          backgroundPosition: "var(--grad-x, 55%) var(--grad-y, 50%)",
          backgroundAttachment: "fixed",
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
