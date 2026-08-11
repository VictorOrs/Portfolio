"use client";

import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";

/**
 * Isolated blend test — background video, title, pill. Nothing else.
 *
 * No entrance animation, no scroll fade, no painted-still fallback, and the video
 * deliberately does NOT carry the `hero-video` class, so the WebKit override that
 * swaps it for a still does not apply here. What you see is the raw behaviour.
 */
export default function BlendTestPage() {
  const { t } = useTranslation();

  return (
    <main className="relative min-h-screen bg-background-base">
      {/* Same blend context as the hero */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 0, isolation: "isolate" }}
      >
        {/* Background video — same geometry, blur and opacity as the hero */}
        <video
          src="/img/background.mp4"
          poster="/img/background_poster.webp"
          autoPlay
          loop
          muted
          playsInline
          className="object-cover"
          style={{
            position: "absolute",
            top: -104,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(140vw, 2016px)",
            minWidth: "1800px",
            height: "auto",
            opacity: 0.8,
            filter: "blur(4px)",
          }}
        />

        {/* Title — gradient clipped to text + color-dodge */}
        <div className="absolute inset-x-0 top-[200px] px-6 md:px-10 lg:px-s">
          <p className="font-display text-3xl whitespace-pre hero-text-reveal revealed">
            {t("hero.headlineMobileXs")}
          </p>

          <div className="mt-6">
            <ChangingSpan
              fontSize="var(--hero-font-mobile)"
              revealed
              words={["Product"]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
