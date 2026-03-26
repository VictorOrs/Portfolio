"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";
import { useLoading } from "@/lib/loading";
import { GRADIENT_STOPS } from "@/lib/gradient";

// 80px (main pt navbar) + 177px (section pt-xl) = natural viewport y of the title
const FIXED_TOP = 80 + 177;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { t } = useTranslation();
  const { isLoaded } = useLoading();

  // Global scroll in px — more reliable than target-based progress on a fixed-content spacer
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    // Scroll spacer that drives the opacity. WhoIAm (z-10000) slides over the fixed title (z-0).
    <section className="relative h-[55vh]">

      {/* Fixed title — stays at its viewport position, fades as the page scrolls */}
      <motion.div
        className="fixed inset-x-0 max-w-[1440px] mx-auto px-xl"
        style={{ top: FIXED_TOP, zIndex: 0, opacity }}
      >
        {/* Entrance animation */}
        <motion.div
          className="relative h-[312px] w-full"
          initial={{ opacity: 0, y: 28 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease }}
        >
          <p
            className="absolute top-0 left-0 h-full font-display text-display-1 whitespace-pre"
            style={{
              backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
              backgroundSize: "250% 250%",
              backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("hero.headline")}
          </p>

          {/* Inner shadow overlay */}
          <p
            className="absolute top-0 left-0 h-full font-display text-display-1 whitespace-pre pointer-events-none"
            aria-hidden
            style={{
              backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)",
              backgroundSize: "100% 104px",
              backgroundRepeat: "repeat-y",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("hero.headline")}
          </p>

          <motion.div
            className="absolute bottom-0 left-[478px]"
            initial={{ opacity: 0, y: 16 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.4, ease, delay: 0.15 }}
          >
            <ChangingSpan />
          </motion.div>

        </motion.div>
      </motion.div>

    </section>
  );
}
