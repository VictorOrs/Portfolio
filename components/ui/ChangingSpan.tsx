"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

const TYPES: Record<"en" | "fr", string[]> = {
  en: ["Product", "Branding", "System", "Visuals"],
  fr: ["Produit", "Branding", "Système", "Visuels"],
};

type ChangingSpanProps = {
  interval?: number;
  /** Fluid font-size (e.g. "calc((100vw - 3rem) / 10.5)"). When set, all internal
   *  dimensions use em units relative to this value instead of hardcoded px. */
  fontSize?: string;
  /** Controls reveal animation — bg transitions from #090909 to #B0B0B0 */
  revealed?: boolean;
  /** Sanity-driven words — falls back to the built-in TYPES when absent/empty. */
  words?: string[];
};

export default function ChangingSpan({ interval = 3000, fontSize, revealed = true, words }: ChangingSpanProps) {
  const { lang } = useTranslation();
  const types = words && words.length > 0 ? words : TYPES[lang];
  const [index, setIndex] = useState(0);

  // Reset index and restart interval when the word list or interval changes
  useEffect(() => {
    setIndex(0);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % types.length);
    }, interval);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, interval, words]);

  const fluid = !!fontSize;

  return (
    <motion.span
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`inline-flex items-center justify-center overflow-hidden backdrop-blur-[12px] hero-span-reveal${revealed ? " revealed" : ""}`}
      style={{
        fontSize: fluid ? fontSize : undefined,
        height:       fluid ? "1.3em"   : "104px",
        paddingLeft:  fluid ? "0.36em"  : "24px",
        paddingRight: fluid ? "0.36em"  : "24px",
        paddingTop:   fluid ? "0.03em"  : "2px",
        paddingBottom: fluid ? "0.03em" : "2px",
        borderRadius: "9999px",
        mixBlendMode: "color-dodge" as const,
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={`${lang}-${types[index]}`}
          className={`font-display whitespace-nowrap${fluid ? "" : " text-3xl"}`}
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            y: { duration: 0.5, ease: "easeInOut" },
            opacity: { duration: 0.65, ease: "easeInOut" },
          }}
          style={{
            display: "block",
            lineHeight: "inherit",
            color: "var(--hero-span-text, #1a1a1a)",
            ...(fluid ? { fontSize: "1em" } : {}),
          }}
        >
          {types[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
