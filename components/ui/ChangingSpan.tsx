"use client";

import { useState, useEffect } from "react";

const TYPES = [
  "Product",
  "Branding",
  "System",
  "No-Coding",
  "Vibe-Coding",
  "Visuals",
] as const;

type SpanType = (typeof TYPES)[number];

type ChangingSpanProps = {
  interval?: number; // ms between changes, default 2000
};

export default function ChangingSpan({ interval = 2000 }: ChangingSpanProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TYPES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <span className="inline-flex items-center justify-center px-8 pt-2.5 pb-0.5 rounded-full changing-span">
      <span className="font-display text-display-1 whitespace-nowrap">
        {TYPES[index]}
      </span>
    </span>
  );
}
