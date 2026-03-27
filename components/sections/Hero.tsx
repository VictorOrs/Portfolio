"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";
import { useLoading } from "@/lib/loading";
import { GRADIENT_STOPS } from "@/lib/gradient";

// 80px (main pt navbar) + 177px (section pt-xl) = natural viewport y of the title
const FIXED_TOP = 80 + 177;

const ease = [0.22, 1, 0.36, 1] as const;

const gradientTextStyle = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "250% 250%",
  backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export default function Hero() {
  const { t } = useTranslation();
  const { isLoaded } = useLoading();

  // Global scroll in px — more reliable than target-based progress on a fixed-content spacer
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);

  // Split headline so the ChangingSpan sits inline on the last line
  const headline = t("hero.headline");
  const headlineLines = headline.split("\n");
  const prevLines = headlineLines.slice(0, -1).join("\n");
  const lastLine  = headlineLines[headlineLines.length - 1];
  const fluidSize = "calc((100vw - 3rem) / 6)";

  return (
    // Scroll spacer that drives the opacity. WhoIAm (z-10000) slides over the fixed title (z-0).
    <section className="relative lg:h-[55vh]">

      {/* ── Mobile / tablet layout (< lg) — in normal flow, fades on scroll ── */}
      <motion.div
        className="lg:hidden pointer-events-none px-6 py-10 md:px-10 md:py-16 grid grid-cols-12 gap-4 md:gap-6"
        style={{ opacity }}
      >
        <motion.div
          className="col-span-full md:col-start-2 md:col-span-10"
          initial={{ opacity: 0, y: 28 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease }}
        >
          {/* Full headline — mobile-specific 4-line split */}
          <p
            className="font-display whitespace-pre"
            style={{ ...gradientTextStyle, fontSize: fluidSize, lineHeight: "1.2" }}
          >
            {t("hero.headlineMobile")}
          </p>

          {/* ChangingSpan — own line below the title */}
          <ChangingSpan fontSize={fluidSize} />
        </motion.div>
      </motion.div>

      {/* ── Desktop layout (≥ lg) — fixed, stays at viewport position ── */}
      <motion.div
        className="hidden lg:block fixed inset-x-0 max-w-[1440px] mx-auto px-s xl:px-xl 2xl:px-xl pointer-events-none"
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
            style={gradientTextStyle}
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
