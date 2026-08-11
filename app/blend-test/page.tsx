"use client";

import { useTranslation } from "@/lib/i18n";
import ChangingSpan from "@/components/ui/ChangingSpan";

/**
 * Isolated blend test — the real title over the real background video, stripped of
 * the entrance animation, the scroll fade and the still fallback.
 *
 * Kept around as the reproduction case for the WebKit blend bug: `.hero-text-reveal`
 * carries `transform: translateZ(0)`, which is what makes the color-dodge survive
 * over a composited video layer. Drop that one declaration and the title goes flat
 * grey in Safari and on iOS while staying correct in Blink.
 */
export default function BlendTestPage() {
  const { t } = useTranslation();

  return (
    <main className="relative min-h-screen bg-background-base">
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ zIndex: 0, isolation: "isolate" }}
      >
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
