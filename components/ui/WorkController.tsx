"use client";

import { motion } from "framer-motion";
import PlayPauseButton from "./PlayPauseButton";

interface Props {
  count: number;
  activeIndex: number;
  progress: number; // 0–1
  paused: boolean;
  onTogglePause: () => void;
  onDotClick: (index: number) => void;
}

const spring = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

export default function WorkController({
  count,
  activeIndex,
  progress,
  paused,
  onTogglePause,
  onDotClick,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      {/* Progress pill — dark-mode: alpha-revert bg + alpha outline */}
      <div className="flex items-center gap-[10px] p-5 rounded-[30px] bg-alpha-revert outline outline-2 outline-alpha outline-offset-[-2px]">
        {Array.from({ length: count }).map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.button
              key={i}
              onClick={() => onDotClick(i)}
              className="h-2 rounded-full overflow-hidden shrink-0 cursor-pointer bg-alpha"
              animate={{ width: isActive ? 80 : 8 }}
              transition={spring}
            >
              {isActive && (
                <div
                  className="h-full rounded-full bg-text-primary"
                  style={{ width: `${progress * 100}%` }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <PlayPauseButton paused={paused} onClick={onTogglePause} />
    </div>
  );
}
