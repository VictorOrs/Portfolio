"use client";

import { useEffect } from "react";
import { motion, animate, useMotionValue } from "framer-motion";
import Button from "@/components/ui/Button";

// Paths share the same command structure (M L L L Z) for smooth morphing.
//
// PAUSE — two bars rewritten as closed polygons (matches PauseIcon geometry):
//   left bar:  (5.75, 4.5)→(10.25, 4.5)→(10.25, 19.5)→(5.75, 19.5)
//   right bar: (13.75, 4.5)→(18.25, 4.5)→(18.25, 19.5)→(13.75, 19.5)
//
// PLAY — triangle split into two quads so command counts match (matches PlayIcon):
//   left face: (6,4)→(12.5,8)→(12.5,16)→(6,20) — fills left half of ▶
//   right tip: (12.5,8)→(19,12)→(19,12)→(12.5,16) — fills right apex of ▶

const PAUSE = {
  left:  "M 5.75 4.5 L 10.25 4.5 L 10.25 19.5 L 5.75 19.5 Z",
  right: "M 13.75 4.5 L 18.25 4.5 L 18.25 19.5 L 13.75 19.5 Z",
};

const PLAY = {
  left:  "M 6 4 L 12.5 8 L 12.5 16 L 6 20 Z",
  right: "M 12.5 8 L 19 12 L 19 12 L 12.5 16 Z",
};

const SPRING = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;

interface Props {
  paused: boolean;
  onClick: () => void;
}

export default function PlayPauseButton({ paused, onClick }: Props) {
  // Motion values initialised immediately → path renders on first paint, no flash.
  const d1 = useMotionValue(PAUSE.left);
  const d2 = useMotionValue(PAUSE.right);

  useEffect(() => {
    const a1 = animate(d1, paused ? PLAY.left  : PAUSE.left,  SPRING);
    const a2 = animate(d2, paused ? PLAY.right : PAUSE.right, SPRING);
    return () => { a1.stop(); a2.stop(); };
  }, [paused, d1, d2]);

  const icon = (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <motion.path d={d1} />
      <motion.path d={d2} />
    </svg>
  );

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={onClick}
      aria-label={paused ? "Play" : "Pause"}
      icon={icon}
    />
  );
}
