"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLoading } from "@/lib/loading";

export default function LoadingScreen() {
  const { isLoaded, progress } = useLoading();

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 bg-background-base overflow-hidden"
          style={{ zIndex: 99999 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
        >
          {/* Large percentage — anchored bottom-right, partially cropped */}
          <p
            className="absolute tabular-nums font-display font-medium text-text-primary select-none"
            style={{
              fontSize: "302.5px",
              lineHeight: "330px",
              right: 0,
              bottom: "-60px",
              opacity: 0.08,
            }}
          >
            {progress}%
          </p>

          {/* Bottom gradient fade */}
          <div
            aria-hidden
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{
              height: "230px",
              background: "linear-gradient(to bottom, transparent, var(--color-bg-base))",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
