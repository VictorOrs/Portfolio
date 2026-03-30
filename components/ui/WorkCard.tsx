"use client";

import React, { useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";

// ── All client logos for the "Worked on" marquee ──────────────────────────────

const MARQUEE_LOGOS = [
  { name: "Google",               src: "/img/work/logo/Google.svg",               h: 22  },
  { name: "dynamic",              src: "/img/work/logo/dynamic.svg",              h: 14  },
  { name: "Seam",                 src: "/img/work/logo/Seam.svg",                 h: 15  },
  { name: "FoodFlow",             src: "/img/work/logo/fuse.svg",                 h: 23  },
  { name: "Flutter",              src: "/img/work/logo/flutter.svg",              h: 18  },
  { name: "CHANEL",               src: "/img/work/logo/CHANEL.svg",              h: 14  },
  { name: "JUUL",                 src: "/img/work/logo/JUUL.svg",                h: 20  },
  { name: "Silna",                src: "/img/work/logo/Silna.svg",               h: 15  },
  { name: "Ultimate",             src: "/img/work/logo/utlimate.svg",            h: 11  },
  { name: "OPENLYTICS",           src: "/img/work/logo/OPENLYTICS.svg",          h: 15  },
  { name: "Carma",                src: "/img/work/logo/carma.svg",               h: 20  },
  { name: "probably-something",   src: "/img/work/logo/probably-something.svg",  h: 24  },
  { name: "unstoppable-finance",  src: "/img/work/logo/unstoppable-finance.svg", h: 32  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WorkCardProps {
  /** Card height in px (default 540 — matches Figma) */
  height?: number;
  /** Optional logo above the title */
  logo?: { src: string; alt: string };
  /** Card title */
  title?: string;
  /** Show scrolling "Worked on" logo marquee */
  showWorkedOn?: boolean;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Full-bleed illustration rendered as absolute background */
  illustration?: React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkCard({
  height = 420,
  logo,
  title,
  showWorkedOn = false,
  ctaPrimary,
  ctaSecondary,
  illustration,
}: WorkCardProps) {
  const uid = useId();
  const gradId = `card-grad-${uid.replace(/:/g, "")}`;
  const hasContent = !!(logo || title || ctaPrimary || ctaSecondary || showWorkedOn);

  return (
    <div
      className="relative w-full rounded-[40px] overflow-hidden bg-background-surface"
      style={{
        minHeight: height,
        boxShadow: "0px -3.648px 29.184px 0px rgba(0,0,0,0.72)",
      }}
    >
      {/* Illustration — fills the card */}
      {illustration && (
        <div className="absolute inset-0 pointer-events-none">
          {illustration}
        </div>
      )}


      {/* Gradient overlay — radial gradient Figma node 1723:1770 */}
      <svg
        aria-hidden
        className="absolute inset-0 pointer-events-none w-full h-full"
        viewBox="0 0 1060 540"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            cx="0" cy="0" r="10"
            gradientTransform="matrix(-16.8 46.823 -87.5 -29.81 817 -0.000073145)"
          >
            <stop offset="0.46989" stopColor="rgba(32,32,32,0)" />
            <stop offset="0.93503" stopColor="rgba(32,32,32,0.32)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradId})`} />
      </svg>

      {/* Content — pinned to bottom, matching Figma px-[48px] py-[48px] */}
      {hasContent && (
        <div className="absolute bottom-0 left-0 right-0 p-6 md:px-[48px] md:py-[48px] flex flex-col gap-4 md:gap-8">

          {/* Logo + Title + Worked on */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-6 md:gap-8 items-start w-full md:w-[575px]">
              {logo && (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={110}
                  height={20}
                  unoptimized
                  style={{
                    height: 20,
                    width: "auto",
                    opacity: 0.5,
                    display: "block",
                  }}
                />
              )}
              {title && (
                <p className="font-display text-l text-white whitespace-normal md:whitespace-pre-line">
                  {title}
                </p>
              )}
            </div>

            {/* "Worked on" marquee */}
            {showWorkedOn && (
              <div
                className="relative overflow-hidden w-full md:w-[575px]"
                style={{ height: 40 }}
              >
                {/* Scrolling logos — offset 107px on desktop to leave room for "Worked on" label */}
                <div className="absolute inset-y-0 left-0 md:left-[107px]">
                  <motion.div
                    className="flex items-center gap-8 h-full w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 28, ease: "linear", repeat: Infinity }}
                  >
                    {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((logo, i) => (
                      <div key={i} className="flex items-center justify-center shrink-0" style={{ height: 32 }}>
                        <Image
                          src={logo.src}
                          alt={logo.name}
                          width={80}
                          height={32}
                          unoptimized
                          style={{
                            height: 40,
                            width: "auto",
                            filter: "brightness(0) invert(1)",
                            opacity: 0.5,
                          }}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Left fade + "Worked on" label */}
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 pointer-events-none w-[90px] md:w-[320px]"
                  style={{ background: "linear-gradient(to right, var(--color-bg-surface) 31%, transparent 100%)" }}
                />
                <p className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 font-body text-s text-text-secondary whitespace-nowrap">
                  Worked on
                </p>

                {/* Right fade */}
                <div
                  aria-hidden
                  className="absolute inset-y-0 right-0 pointer-events-none"
                  style={{
                    width: 90,
                    background:
                      "linear-gradient(to left, var(--color-bg-surface) 31%, transparent 100%)",
                  }}
                />
              </div>
            )}
          </div>

          {/* CTAs */}
          {(ctaPrimary || ctaSecondary) && (
            <div className="flex gap-4">
              {ctaPrimary && (
                <Link
                  href={ctaPrimary.href}
                  className={`${buttonVariants({ variant: "primary", size: "md" })} flex-1 md:flex-none`}
                >
                  <span className="pt-1 px-1">{ctaPrimary.label}</span>
                </Link>
              )}
              {ctaSecondary && (
                <a
                  href={ctaSecondary.href}
                  target={ctaSecondary.href.startsWith("http") ? "_blank" : undefined}
                  rel={ctaSecondary.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`${buttonVariants({ variant: "secondary", size: "md" })} flex-1 md:flex-none`}
                >
                  <span className="pt-1 px-1">{ctaSecondary.label}</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
