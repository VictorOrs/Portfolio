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
};

export default function ChangingSpan({ interval = 3000, fontSize }: ChangingSpanProps) {
  const { lang } = useTranslation();
  const types = TYPES[lang];
  const [index, setIndex] = useState(0);

  // Reset index and restart interval when language or interval changes
  useEffect(() => {
    setIndex(0);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TYPES[lang].length);
    }, interval);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, interval]);

  const fluid = !!fontSize;

  return (
    <motion.span
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="inline-flex items-center justify-center overflow-hidden"
      style={{
        fontSize: fluid ? fontSize : undefined,
        height:       fluid ? "1.3em"   : "114px",
        paddingLeft:  fluid ? "0.36em"  : "2rem",
        paddingRight: fluid ? "0.36em"  : "2rem",
        paddingTop:   fluid ? "0.11em"  : "10px",
        borderRadius: "9999px",
        backgroundColor: "var(--color-btn-primary-bg)",
        boxShadow: "0 8px 48px 0 rgba(0,0,0,0.85)",
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
            color: "var(--color-bg-base)",
            ...(fluid ? { fontSize: "1em" } : {}),
          }}
        >
          {types[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
