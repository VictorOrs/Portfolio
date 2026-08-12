"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ChevronRightIcon from "@/components/ui/ChevronRightIcon";
import { useWorkExpand } from "@/components/work/WorkExpandContext";
import { useTranslation } from "@/lib/i18n";

// ── Marquee tuning ────────────────────────────────────────────────────────────
// The track animates by -50% of its own width, so a fixed duration would make
// the speed depend on how many logos there are. Deriving both the duration and
// the number of repeats from the count keeps every card scrolling at the same
// pace, and keeps one half wider than the visible strip so the loop has no gap.

/** Seconds per logo — an average logo occupies ~118px, so this holds ~55px/s. */
const LOGO_SECONDS = 2.15;
/** Logos each half needs before it comfortably overflows the widest strip (468px). */
const MIN_PER_HALF = 6;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CardLogo {
  src: string;
  alt: string;
  /** Intrinsic size — only used to keep the aspect ratio while the height is fixed */
  width?: number;
  height?: number;
}

export interface WorkCardProps {
  /** Project slug — enables the shared-element expand animation when set */
  slug?: string;
  /** Card height in px (default 540 — matches Figma) */
  height?: number;
  /** Optional logo above the title — recoloured to text-secondary */
  logo?: CardLogo;
  /** Card title */
  title?: string;
  /** Show scrolling "Worked on" logo marquee */
  showWorkedOn?: boolean;
  /** Client logos filling the marquee, in order */
  workedOnLogos?: CardLogo[];
  /** Scroll those logos; false lays them out as a static row */
  scrollLogos?: boolean;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Full-bleed illustration rendered as absolute background */
  illustration?: React.ReactNode;
  /** Force light theme on the card */
  lightMode?: boolean;
  /** Custom content — replaces the standard bottom content when provided */
  customContent?: React.ReactNode;
  /** Fill the parent's height (height:100%) instead of using a fixed minHeight.
   *  Used by the expand overlay so the card scales with its animated box. */
  fill?: boolean;
  /** When true, the whole card is clickable to open the case study, with a hover stroke. */
  expandable?: boolean;
}

/** Sanity's CDN 403s any request with an Origin header, and mask fetches always
 *  carry one — so mask sources go through the proxy route at /sanity-cdn. */
const maskSrc = (src: string) => src.replace("https://cdn.sanity.io/", "/sanity-cdn/");

/**
 * A logo painted through a mask: the shape comes from the file, the colour from
 * text-secondary. Whatever palette a logo is uploaded in — black included — every
 * logo on the card lands on the same tone, and follows the theme token.
 * inline-block so the fixed height drives the width via aspect-ratio.
 */
function MaskedLogo({
  logo,
  height,
  className = "",
}: {
  logo: CardLogo;
  height: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={logo.alt}
      className={`inline-block align-bottom bg-text-secondary ${className}`}
      style={{
        height,
        aspectRatio: `${logo.width ?? 110} / ${logo.height ?? 20}`,
        WebkitMaskImage: `url("${maskSrc(logo.src)}")`,
        maskImage: `url("${maskSrc(logo.src)}")`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
  );
}

/** One client logo in the scrolling strip. */
function MarqueeLogo({ logo }: { logo: CardLogo }) {
  return (
    <div className="flex items-center justify-center shrink-0" style={{ height: 32 }}>
      <MaskedLogo logo={logo} height={40} />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkCard({
  slug,
  height = 420,
  logo,
  title,
  showWorkedOn = false,
  workedOnLogos = [],
  scrollLogos = true,
  ctaPrimary,
  ctaSecondary,
  illustration,
  lightMode = false,
  customContent,
  fill = false,
  expandable = false,
}: WorkCardProps) {
  const uid = useId();
  const { t } = useTranslation();
  const gradId = `card-grad-${uid.replace(/:/g, "")}`;

  // Below md the strip is only as wide as the card, so a static row runs off the
  // edge — mobile keeps scrolling whatever the document asks for. The animation
  // is driven in JS, so the breakpoint has to be read in JS too.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const scrolling = scrollLogos || narrow;

  // One half of the scrolling track — repeated so a short list still overflows.
  const repeats = workedOnLogos.length
    ? Math.max(1, Math.ceil(MIN_PER_HALF / workedOnLogos.length))
    : 1;
  const half = Array.from({ length: repeats }, () => workedOnLogos).flat();
  const marqueeDuration = half.length * LOGO_SECONDS;
  const { open } = useWorkExpand();
  const rootRef = useRef<HTMLDivElement>(null);
  const hasContent = !!(logo || title || ctaPrimary || ctaSecondary || showWorkedOn);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!expandable || !slug) return;
    // Let inner links (e.g. "Visit website") do their own thing.
    if ((e.target as HTMLElement).closest("a")) return;
    const rect = rootRef.current?.getBoundingClientRect();
    open(
      slug,
      rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : undefined,
      { logo, title, illustration, ctaSecondary, showWorkedOn, workedOnLogos, scrollLogos }
    );
  };

  return (
    <div
      ref={rootRef}
      data-work-card={slug || undefined}
      onClick={handleCardClick}
      className={`group relative w-full ${fill ? "h-full" : ""} rounded-[40px] overflow-hidden ${lightMode ? "light-card light-card-border" : "bg-background-surface"}${
        expandable
          ? " cursor-pointer transition-[outline-color] duration-200 outline outline-2 outline-transparent outline-offset-[-2px] hover:outline-alpha"
          : ""
      }`}
      style={{
        ...(fill ? { height: "100%" } : { minHeight: height }),
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
      {!lightMode && <svg
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
            <stop offset="0.46989" stopColor="rgba(28,28,28,0)" />
            <stop offset="0.93503" stopColor="rgba(28,28,28,0.32)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradId})`} />
      </svg>}

      {/* Custom content — replaces standard layout */}
      {customContent}

      {/* Chevron CTA — top-right, opens the case study. Always visible on mobile
          (no hover there); hover-gated from md up.
          Opacity lives on the button, never on this wrapper: an ancestor with
          opacity < 1 becomes a backdrop root, which starves the button's
          backdrop-blur and makes it pop in only once opacity hits 1. */}
      {ctaSecondary && !fill && (
        <div className="absolute top-8 right-8 md:top-[48px] md:right-[48px] z-10 pointer-events-none group-hover:pointer-events-auto">
          <Button
            variant="secondary"
            size="md"
            icon={<ChevronRightIcon size={24} />}
            type="button"
            tabIndex={-1}
            aria-hidden
            className="ease-out md:opacity-0 md:scale-90 md:group-hover:opacity-100 md:group-hover:scale-100"
          />
        </div>
      )}

      {/* Content — pinned to bottom, matching Figma px-[48px] py-[48px] */}
      {!customContent && hasContent && (
        <div className="absolute bottom-0 left-0 right-0 p-8 md:px-[48px] md:py-[48px] flex flex-col gap-4 md:gap-8">

          {/* Logo + Title + Worked on */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-6 md:gap-8 items-start w-full md:w-[575px]">
              {logo && (
                <MaskedLogo logo={logo} height={20} className="max-[425px]:!h-[18px]" />
              )}
              {title && (
                <p className="font-display text-l text-white whitespace-pre-line max-[425px]:whitespace-normal">
                  {title}
                </p>
              )}
            </div>

            {/* "Worked on" marquee */}
            {showWorkedOn && workedOnLogos.length > 0 && (
              <div
                className="relative overflow-hidden w-full md:w-[575px]"
                style={{ height: 40 }}
              >
                {/* Logo strip — offset 107px on desktop to leave room for the label.
                    Scrolling edges fade via a transparency mask so logos blend over
                    any background; a static row starts flush instead. */}
                <div
                  className="absolute inset-y-0 left-0 right-0 md:left-[107px]"
                  style={
                    scrolling
                      ? {
                          WebkitMaskImage:
                            "linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)",
                          maskImage:
                            "linear-gradient(to right, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)",
                        }
                      : undefined
                  }
                >
                  {scrolling ? (
                    <motion.div
                      className="flex items-center gap-8 h-full w-max"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ duration: marqueeDuration, ease: "linear", repeat: Infinity }}
                    >
                      {/* Doubled so the -50% loop is seamless */}
                      {[...half, ...half].map((client, i) => (
                        <MarqueeLogo key={i} logo={client} />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-8 h-full">
                      {workedOnLogos.map((client, i) => (
                        <MarqueeLogo key={i} logo={client} />
                      ))}
                    </div>
                  )}
                </div>

                {/* "Worked on" label — sits left of the masked logo track */}
                <p className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 font-body text-s text-text-secondary whitespace-nowrap">
                  {t("work.workedOn")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
