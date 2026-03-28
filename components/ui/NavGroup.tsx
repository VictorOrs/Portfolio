"use client";

import { useState } from "react";
import NavLink from "@/components/ui/NavLink";
import ChevronIcon from "@/components/ui/ChevronIcon";
import { useTranslation } from "@/lib/i18n";

type NavGroupProps = {
  scrolled?: boolean;
  className?: string;
};

const NAV_KEYS: { key: string; href: string; chevron?: true }[] = [
  { key: "services",  href: "/services" },
  { key: "useCases",  href: "/use-cases", chevron: true },
  { key: "pricing",   href: "/pricing" },
];

export default function NavGroup({ scrolled = false, className }: NavGroupProps) {
  const { t } = useTranslation();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <nav
      className={`relative inline-flex items-center justify-center gap-1 p-2 rounded-full outline outline-2 outline-alpha outline-offset-[-2px] backdrop-blur-glass transition-all duration-200${scrolled ? " bg-alpha-revert" : ""}${className ? ` ${className}` : ""}`}
    >
      {NAV_KEYS.map(({ key, href, chevron }) => (
        <NavLink
          key={href}
          href={href}
          isHovered={hoveredKey === key}
          onMouseEnter={() => setHoveredKey(key)}
          onMouseLeave={() => setHoveredKey(null)}
        >
          {t(`nav.${key}`)}
          {chevron && <ChevronIcon size={16} className="ml-0.5" />}
        </NavLink>
      ))}
    </nav>
  );
}
