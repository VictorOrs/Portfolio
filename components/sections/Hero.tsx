"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";
import { useLoading } from "@/lib/loading";
import { loc, type HomepageData } from "@/lib/queries";

// 80px (main pt navbar) + 177px (section pt-xl) = natural viewport y of the title
const FIXED_TOP = 80 + 177;

export default function Hero({ data }: { data?: HomepageData | null }) {
  const { t, lang } = useTranslation();
  const { isLoaded } = useLoading();

  const pills = lang === "fr" ? data?.hero_pills_fr : data?.hero_pills_en;
  const [revealed, setRevealed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Start from the still, not from the video. iOS draws its native play button as
  // soon as a video is on screen without playing, so showing the video first meant
  // the button flashed for as long as detection took. The video only appears once
  // playback is confirmed; the still is a frame of it, so the swap does not show.
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.5;
    // iOS refuses autoplay in Low Power Mode even when muted + playsInline, but the
    // play() promise is not a usable signal there — it can stay pending instead of
    // rejecting. Judge on whether the video actually advanced.
    v.play().catch(() => {});
    const id = setTimeout(() => setVideoPlaying(!v.paused && v.currentTime > 0), 1500);
    return () => clearTimeout(id);
  }, []);

  const { scrollY } = useScroll();
  const scrollOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  // The entrance fade has to live on the container too, for the same reason as the
  // scroll fade: an opacity < 1 between the backdrop and the title is a group
  // boundary, and WebKit drops the blend across it. Kept on the background alone, it
  // left the title unblended for the whole entrance. The two fades multiply.
  const entranceOpacity = useMotionValue(0);
  const opacity = useTransform(
    [scrollOpacity, entranceOpacity],
    ([s, e]: number[]) => s * e
  );

  useEffect(() => {
    if (!isLoaded) return;
    const controls = animate(entranceOpacity, 1, {
      duration: 4,
      ease: [0.12, 0.8, 0.2, 1],
      delay: 0.6,
    });
    return () => controls.stop();
  }, [isLoaded, entranceOpacity]);
  const bgScale = useTransform(scrollY, [0, 800], [1, 0.82]);

  // Trigger text reveal after loading with delay
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // 3-line split for xs+ (≥ 686px, < lg)
  const headlineMobile = loc(data, "hero_headlineTablet", lang) ?? t("hero.headlineMobile");
  const headlineMobileLines = headlineMobile.split("\n");
  const prevLinesMobile = headlineMobileLines.slice(0, -1).join("\n");
  const lastLineMobile  = headlineMobileLines[headlineMobileLines.length - 1];

  // 4-line split for < xs (< 686px)
  const headlineMobileXs = loc(data, "hero_headlineMobile", lang) ?? t("hero.headlineMobileXs");
  const headlineMobileXsLines = headlineMobileXs.split("\n");
  const prevLinesMobileXs = headlineMobileXsLines.slice(0, -1).join("\n");
  const lastLineMobileXs  = headlineMobileXsLines[headlineMobileXsLines.length - 1];

  return (
    <section className="relative h-[540px] xs:h-[390px] lg:h-[440px] xl:h-[55vh] 2xl:h-[55vh] min-[1920px]:h-[35vh]">

      {/* Fixed container — isolation: isolate keeps blend context.
          The scroll fade lives here, not on the background alone: WebKit refuses to
          blend across a group boundary, so any opacity < 1 between the backdrop and
          the title kills the color-dodge. Fading both together keeps them in one
          group, where the blend resolves before the group opacity applies. */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0, isolation: "isolate", opacity }}
      >

        {/* Background image */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          {/* Entrance animation wrapper */}
          <motion.div
            className="absolute inset-0 origin-top"
            initial={{ filter: "blur(4px)", scale: 0.9 }}
            animate={isLoaded ? { filter: "blur(0px)", scale: 1 } : {}}
            transition={{ duration: 4, ease: [0.12, 0.8, 0.2, 1], delay: 0.6 }}
          >
            {/* Painted still — shown first, and kept whenever playback never starts
                (iOS refuses autoplay in Low Power Mode). Same frame, same geometry and
                blur as the video, so handing over to it does not read as a change. */}
            <motion.div
              aria-hidden
              className="hero-still origin-top"
              animate={{ opacity: videoPlaying ? 0 : 0.8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                scale: bgScale,
                position: "absolute",
                top: -104,
                left: "50%",
                x: "-50%",
                width: "min(140vw, 2016px)",
                minWidth: "1800px",
                aspectRatio: "1908 / 1084",
                opacity: 0.8,
                backgroundImage: "url(/img/background_poster.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "blur(4px)",
              }}
            />

            {/* Scroll dezoom directly on video — min-width ensures no crop on small screens */}
            <motion.video
              ref={videoRef}
              src="/img/background.mp4"
              poster="/img/background_poster.webp"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onPlaying={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              className="hero-video origin-top object-cover"
              // Revealed only once playback is confirmed. iOS draws its native play
              // button inside the element, so an element kept hidden until then can
              // never flash that button.
              animate={{ opacity: videoPlaying ? 0.8 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                scale: bgScale,
                position: "absolute",
                top: -104,
                left: "50%",
                x: "-50%",
                width: "min(140vw, 2016px)",
                minWidth: "1800px",
                height: "auto",
                opacity: 0,
                filter: "blur(4px)",
              }}
            />
          </motion.div>
          <div
            className="absolute top-0 left-0 right-0 h-[270px]"
            style={{
              backgroundImage: "linear-gradient(180deg, rgb(9,9,9) 0%, rgba(9,9,9,0.44) 33%, rgba(9,9,9,0.19) 62%, rgba(9,9,9,0) 100%)",
            }}
          />
          <div
            className="hero-bottom-blur absolute bottom-0 left-0 right-0 h-[400px] backdrop-blur-[12px]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
            }}
          />
        </div>

        {/* Mobile / tablet title (< lg) */}
        <div className="lg:hidden absolute inset-x-0 top-[260px]">
          <div className="px-6 md:px-10 lg:px-s grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 max-w-[1440px] mx-auto w-full">
            <div className="col-span-full xl:col-start-2 xl:col-span-10">
              <p className={`xs:hidden font-display text-3xl whitespace-pre hero-text-reveal${revealed ? " revealed" : ""}`}>
                {prevLinesMobileXs}{"\n"}{lastLineMobileXs}
              </p>
              <div className="xs:hidden mt-3">
                <ChangingSpan fontSize="var(--hero-font-mobile)" revealed={revealed} words={pills} />
              </div>
              <p className={`hidden xs:block font-display text-2xl whitespace-pre hero-text-reveal${revealed ? " revealed" : ""}`}>
                {prevLinesMobile}{"\n"}{lastLineMobile}<ChangingSpan fontSize="var(--font-size-2xl)" revealed={revealed} words={pills} />
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
              className={`absolute top-0 left-0 h-full font-display text-3xl whitespace-pre hero-text-reveal${revealed ? " revealed" : ""}`}
            >
              {loc(data, "hero_headline", lang) ?? t("hero.headline")}
            </p>

            <div className="absolute bottom-0 left-[458px]">
              <ChangingSpan revealed={revealed} words={pills} />
            </div>
          </div>
        </div>

      </motion.div>

    </section>
  );
}
