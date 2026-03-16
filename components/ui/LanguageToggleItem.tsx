"use client";

import Country from "@/components/ui/Country";

type LanguageToggleItemProps = {
  country: "FR" | "UK";
  active?: boolean;
  onClick?: () => void;
};

export default function LanguageToggleItem({ country, active = false, onClick }: LanguageToggleItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center justify-center p-[6px] rounded-full transition-colors",
        active
          ? "outline outline-2 outline-btn-primary-bg outline-offset-[-2px]"
          : "hover:bg-alpha",
      ].join(" ")}
      aria-pressed={active}
      aria-label={country === "FR" ? "Switch to French" : "Switch to English"}
    >
      <Country country={country} />
    </button>
  );
}
