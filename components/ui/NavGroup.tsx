"use client";

import NavLink from "@/components/ui/NavLink";
import { useTranslation } from "@/lib/i18n";

type NavGroupProps = {
  scrolled?: boolean;
  className?: string;
};

const NAV_KEYS = [
  { key: "home",    href: "/" },
  { key: "about",   href: "/about" },
  { key: "process", href: "/process" },
  { key: "work",    href: "/work" },
  { key: "faq",     href: "/faq" },
] as const;

export default function NavGroup({ scrolled = false, className }: NavGroupProps) {
  const { t } = useTranslation();

  return (
    <nav
      className={[
        "inline-flex items-center justify-center gap-1 p-1 rounded-full",
        "outline outline-2 outline-alpha outline-offset-[-2px]",
        "backdrop-blur-glass",
        scrolled ? "bg-alpha" : "",
        "transition-all duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {NAV_KEYS.map(({ key, href }) => (
        <NavLink key={href} href={href}>
          {t(`nav.${key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
