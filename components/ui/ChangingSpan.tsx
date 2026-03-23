"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TYPES = [
  "Product",
  "Branding",
  "System",
  "Visuals",
] as const;

type ChangingSpanProps = {
  interval?: number;
};

export default function ChangingSpan({ interval = 3000 }: ChangingSpanProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TYPES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <motion.span
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="inline-flex items-center justify-center px-8 overflow-hidden"
      style={{
        height: "114px",
        borderRadius: "9999px",
        paddingTop: "10px",
        backgroundColor: "var(--color-btn-primary-bg)",
        boxShadow: "0 8px 48px 0 rgba(0,0,0,0.85)",
      }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={TYPES[index]}
          className="font-display text-display-1 whitespace-nowrap"
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            y: { duration: 0.5, ease: "easeInOut" },
            opacity: { duration: 0.65, ease: "easeInOut" },
          }}
          style={{ display: "block", lineHeight: "inherit", color: "var(--color-bg-base)" }}
        >
          {TYPES[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
