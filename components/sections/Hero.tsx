"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";
import { useLoading } from "@/lib/loading";

// 80px (main pt navbar) + 177px (section pt-xl) = natural viewport y of the title
const FIXED_TOP = 80 + 177;

const heroTextStyle = {
  color: "#B3B3B3",
  mixBlendMode: "color-dodge" as const,
};

export default function Hero() {
  const { t } = useTranslation();
  const { isLoaded } = useLoading();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);
  const bgScale = useTransform(scrollY, [0, 800], [1, 0.82]);

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
    <section className="relative h-[540px] xs:h-[390px] lg:h-[440px] xl:h-[55vh]">

      {/* Fixed container — isolation: isolate keeps blend context */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, isolation: "isolate" }}>

        {/* Background image — scroll opacity wrapper */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{ opacity }}
        >
          {/* Entrance animation wrapper */}
          <motion.div
            className="absolute inset-0 origin-top"
            initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
            transition={{ duration: 2.5, ease: [0.12, 0.8, 0.2, 1], delay: 1.3 }}
          >
          <motion.div className="absolute inset-0 origin-top" style={{ scale: bgScale }}>
            <Image
              src="/img/background.png"
              alt=""
              fill
              priority
              className="object-cover object-top opacity-70"
            />
          </motion.div>
          <div
            className="absolute top-0 left-0 right-0 h-[270px]"
            style={{
              backgroundImage: "linear-gradient(180deg, rgb(9,9,9) 0%, rgba(9,9,9,0.44) 33%, rgba(9,9,9,0.19) 62%, rgba(9,9,9,0) 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[400px] backdrop-blur-[12px]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
            }}
          />
          </motion.div>
        </motion.div>

        {/* Mobile / tablet title (< lg) */}
        <div className="lg:hidden absolute inset-x-0 top-[260px]">
          <div className="px-6 md:px-10 lg:px-s grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 max-w-[1440px] mx-auto w-full">
            <div className="col-span-full xl:col-start-2 xl:col-span-10">
              <p className="xs:hidden font-display text-3xl whitespace-pre" style={heroTextStyle}>
                {prevLinesMobileXs}{"\n"}{lastLineMobileXs}
              </p>
              <div className="xs:hidden mt-3">
                <ChangingSpan fontSize="var(--hero-font-mobile)" />
              </div>
              <p className="hidden xs:block font-display text-2xl whitespace-pre" style={heroTextStyle}>
                {prevLinesMobile}{"\n"}{lastLineMobile}<ChangingSpan fontSize="var(--font-size-2xl)" />
              </p>
            </div>
          </div>
        </div>

        {/* Desktop title (≥ lg) */}
        <div
          className="hidden lg:block absolute inset-x-0 max-w-[1440px] mx-auto px-s xl:px-xl 2xl:px-xl"
          style={{ top: FIXED_TOP }}
        >
          <div className="relative h-[288px] w-full">
            <p
              className="absolute top-0 left-0 h-full font-display text-3xl whitespace-pre"
              style={heroTextStyle}
            >
              {t("hero.headline")}
            </p>

            <div className="absolute bottom-0 left-[458px]">
              <ChangingSpan />
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
