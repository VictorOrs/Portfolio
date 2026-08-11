"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import WorkCard from "@/components/ui/WorkCard";
import Button from "@/components/ui/Button";
import CloseIcon from "@/components/ui/CloseIcon";
import { useTranslation } from "@/lib/i18n";
import { PROJECTS } from "./registry";
import type { CardRect, HeroCardProps } from "./WorkExpandContext";

const MORPH_MS = 600;
// Pre-morph hold: the background goes opaque (surrounding elements fade out) while the
// clone sits still on the source card, THEN the box morphs — so nothing shows behind it.
const OPEN_DELAY_MS = 240;
// On close the ease-out lands the card visually before the morph technically ends, so we
// start revealing the surroundings this many ms early — less dead time before they reappear.
const EXIT_REVEAL_LEAD = 160;
const EASING = "cubic-bezier(0.22,1,0.36,1)";

const rectOf = (el: Element): CardRect => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};
const kf = (r: CardRect) => ({
  top: `${r.top}px`,
  left: `${r.left}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
});

/**
 * Case-study overlay. A fixed clone of the slider card animates its BOX
 * (position + size) from the slider card to a navbar-aligned hero — so the card
 * and its illustration scale while the text content keeps its base size, anchored
 * bottom-left. The background goes opaque immediately so the home isn't seen behind.
 */
export default function ProjectOverlay({
  slug,
  openRect,
  cardProps,
  onClose,
}: {
  slug: string;
  openRect?: CardRect;
  cardProps?: HeroCardProps;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const [mode, setMode] = useState<"opening" | "open" | "closing">(openRect ? "opening" : "open");
  const [cloneFrom, setCloneFrom] = useState<CardRect | undefined>(openRect);
  const [target, setTarget] = useState<CardRect | null>(null);
  const [heroH, setHeroH] = useState<number>(openRect?.height ?? 540);
  const [visible, setVisible] = useState(false);
  // Backdrop opacity, decoupled from `mode` so it stays opaque while the clone morphs
  // back on close — the surroundings only reappear once the card is home.
  const [bgOn, setBgOn] = useState(true);

  const entry = PROJECTS[slug];

  // Measure the in-flow hero slot → final height (keeps the card's aspect) + clone destination.
  useLayoutEffect(() => {
    if (!openRect || !slotRef.current) {
      setVisible(true);
      return;
    }
    const r = slotRef.current.getBoundingClientRect();
    const h = (r.width * openRect.height) / openRect.width;
    setHeroH(h);
    setTarget({ top: r.top, left: r.left, width: r.width, height: h });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open morph: clone box animates slider-card → hero slot.
  useLayoutEffect(() => {
    if (mode !== "opening" || !target || !openRect || !cloneRef.current) return;
    const anim = cloneRef.current.animate([kf(openRect), kf(target)], {
      duration: MORPH_MS,
      delay: OPEN_DELAY_MS,
      easing: EASING,
      fill: "forwards",
    });
    anim.onfinish = () => setMode("open");
    const id = window.setTimeout(() => setVisible(true), OPEN_DELAY_MS + 60);
    return () => {
      anim.cancel();
      window.clearTimeout(id);
    };
  }, [mode, target, openRect]);

  // Close morph: clone box animates hero → live slider card, then unmount.
  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (!openRect || !slotRef.current) return onClose();
    scrollRef.current?.scrollTo({ top: 0 });
    setCloneFrom(rectOf(slotRef.current));
    setVisible(false);
    setMode("closing");
  };

  // Backdrop click — anything that isn't the hero card or the case-study body.
  // Guarded on "open" so a click can't interrupt the opening morph.
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (mode !== "open") return;
    const target = e.target as Node;
    if (slotRef.current?.contains(target)) return;
    if (bodyRef.current?.contains(target)) return;
    handleClose();
  };

  useLayoutEffect(() => {
    if (mode !== "closing" || !cloneRef.current || !cloneFrom) return;
    const live = document.querySelector(`[data-work-card="${slug}"]`);
    const dest = live ? rectOf(live) : (openRect as CardRect);
    const anim = cloneRef.current.animate([kf(cloneFrom), kf(dest)], {
      duration: MORPH_MS,
      easing: EASING,
      fill: "forwards",
    });
    // Reveal the surroundings slightly before the morph technically ends (card is already
    // visually home via the ease-out), then unmount once the backdrop has faded out.
    const revealAt = Math.max(0, MORPH_MS - EXIT_REVEAL_LEAD);
    const tReveal = window.setTimeout(() => setBgOn(false), revealAt);
    const tClose = window.setTimeout(onClose, revealAt + 250);
    return () => {
      anim.cancel();
      window.clearTimeout(tReveal);
      window.clearTimeout(tClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!entry) return null;
  const { Body, logo, illustration: Illustration, titleKey, external } = entry;

  // Identical card content — prefer live slider props, fall back to the registry.
  const hero: HeroCardProps = cardProps ?? {
    logo,
    title: t(titleKey),
    illustration: <Illustration />,
    ctaSecondary: { label: t(external.labelKey), href: external.href },
  };

  const showClone = mode === "opening" || mode === "closing";

  return (
    <motion.div
      ref={scrollRef}
      data-lenis-prevent
      className="fixed inset-0 z-[10020] overflow-y-auto overflow-x-hidden"
      onClick={handleBackdropClick}
      initial={{ backgroundColor: "rgba(0,1,3,0)" }}
      animate={{ backgroundColor: bgOn ? "rgba(0,1,3,1)" : "rgba(0,1,3,0)" }}
      transition={{ duration: bgOn ? 0.2 : 0.25, ease: "linear" }}
    >
      {/* Hero slot — aligned to the navbar's horizontal padding. Reserves the final
          card box; the real card shows once the clone morph settles. */}
      <div className="px-6 md:px-10 lg:px-16 w-full max-w-[1568px] mx-auto pt-6 md:pt-8">
        <div ref={slotRef} className="relative" style={{ height: heroH }}>
          <div className="absolute inset-0" style={{ opacity: mode === "open" ? 1 : 0 }}>
            <WorkCard {...hero} fill />
          </div>

          {/* Close button — same top-right offset (48px) as the card's chevron CTA,
              so the morph between the two reads as one continuous element. */}
          <div
            className="absolute top-8 right-8 md:top-[48px] md:right-[48px] z-10"
            style={{ pointerEvents: mode === "open" ? "auto" : "none" }}
          >
            <Button
              variant="secondary"
              size="md"
              icon={<CloseIcon />}
              onClick={handleClose}
              aria-label="Close"
              className={`ease-out ${mode === "open" ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            />
          </div>
        </div>
      </div>

      {/* Case-study body — keeps its own grid; fades in once the morph settles */}
      <div
        ref={bodyRef}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}
      >
        <Body />
      </div>

      {/* Morphing clone — fixed, animates its box between card and hero */}
      {showClone && cloneFrom && (
        <div
          ref={cloneRef}
          className="fixed z-[10025] overflow-hidden rounded-[40px] will-change-[top,left,width,height]"
          style={{ top: cloneFrom.top, left: cloneFrom.left, width: cloneFrom.width, height: cloneFrom.height }}
        >
          <WorkCard {...hero} fill />
        </div>
      )}
    </motion.div>
  );
}
