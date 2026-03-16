"use client";

import ChangingSpan from "@/components/ui/ChangingSpan";
import { useTranslation } from "@/lib/i18n";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pt-xl px-xl w-full">
      {/* Text block — 3 lines at 88px/96px line-height = 288px total */}
      <div className="relative h-[288px] w-full">

        {/* Gradient title */}
        <p className="absolute top-0 left-0 font-display text-display-1 whitespace-pre hero-title-gradient">
          {t("hero.headline")}
        </p>

        {/* Animated pill — sits inline after the last word on line 3 */}
        <div className="absolute bottom-0 left-[478px]">
          <ChangingSpan />
        </div>

      </div>
    </section>
  );
}
