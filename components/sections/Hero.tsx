"use client";

import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pt-xl px-xl w-full">
      <div className="relative h-[288px] w-full">

        <p
          className="absolute top-0 left-0 font-display text-display-1 whitespace-pre"
          style={{
            backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
            backgroundSize: "250% 250%",
            backgroundPosition: "var(--grad-x, 50%) var(--grad-y, 50%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {t("hero.headline")}
        </p>

        <div className="absolute bottom-0 left-[478px]">
          <ChangingSpan />
        </div>

      </div>
    </section>
  );
}
