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

  // 3-line split for xs+ (≥ 686px, < lg)
  const headlineMobile = t("hero.headlineMobile");
  const headlineMobileLines = headlineMobile.split("\n");
  const prevLinesMobile = headlineMobileLines.slice(0, -1).join("\n");
  const lastLineMobile  = headlineMobileLines[headlineMobileLines.length - 1];

  // 4-line split for < xs (< 686px)
  const headlineMobileXs = t("hero.headlineMobileXs");
  const headlineMobileXsLines = headlineMobileXs.split("\n");
  const prevLinesMobileXs = headlineMobileXsLines.slice(0, -1).join("\n");
  const lastLineMobileXs  = headlineMobileXsLines[headlineMobileXsLines.length - 1];

  return (
    // Scroll spacer that drives the opacity. WhoIAm (z-10000) slides over the fixed title (z-0).
    <section className="relative h-[540px] xs:h-[390px] lg:h-[440px] xl:h-[55vh]">

      {/* ── Mobile / tablet layout (< lg) — fixed, same mechanism as desktop ── */}
      <motion.div
        className="lg:hidden fixed inset-x-0 pointer-events-none top-[260px]"
        style={{ zIndex: 0, opacity }}
      >
        <motion.div
          className="px-6 md:px-10 lg:px-s grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 max-w-[1440px] mx-auto w-full"
          initial={{ opacity: 0, y: 28 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease }}
        >
          <div className="col-span-full xl:col-start-2 xl:col-span-10">
            {/* < 686px: 4 lines de texte dans un seul <p> pour un gradient continu, span en dessous */}
            <p
              className="xs:hidden font-display text-3xl whitespace-pre"
              style={gradientTextStyle}
            >
              {prevLinesMobileXs}{"\n"}{lastLineMobileXs}
            </p>
            <div className="xs:hidden mt-3">
              <ChangingSpan fontSize="var(--hero-font-mobile)" />
            </div>

            {/* ≥ 686px: 3 lignes + span inline — tout dans un seul <p> pour un gradient continu */}
            <p
              className="hidden xs:block font-display text-2xl whitespace-pre"
              style={gradientTextStyle}
            >
              {prevLinesMobile}{"\n"}{lastLineMobile}<ChangingSpan fontSize="var(--font-size-2xl)" />
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Desktop layout (≥ lg) — fixed, stays at viewport position ── */}
      <motion.div
        className="hidden lg:block fixed inset-x-0 max-w-[1440px] mx-auto px-s xl:px-xl 2xl:px-xl pointer-events-none"
        style={{ top: FIXED_TOP, zIndex: 0, opacity }}
      >
        {/* Entrance animation */}
        <motion.div
          className="relative h-[288px] w-full"
          initial={{ opacity: 0, y: 28 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease }}
        >
          <p
            className="absolute top-0 left-0 h-full font-display text-3xl whitespace-pre"
            style={gradientTextStyle}
          >
            {t("hero.headline")}
          </p>

          {/* Inner shadow overlay */}
          <p
            className="absolute top-0 left-0 h-full font-display text-3xl whitespace-pre pointer-events-none"
            aria-hidden
            style={{
              backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)",
              backgroundSize: "100% 96px",
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
