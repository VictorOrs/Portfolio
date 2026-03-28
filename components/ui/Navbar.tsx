"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import NavGroup from "@/components/ui/NavGroup";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import ChevronIcon from "@/components/ui/ChevronIcon";
import { useTranslation } from "@/lib/i18n";
import MailIcon from "@/components/ui/MailIcon";

const MENU_LINKS: { key: string; href: string; chevron?: true }[] = [
  { key: "services",  href: "/services" },
  { key: "useCases",  href: "/use-cases", chevron: true },
  { key: "pricing",   href: "/pricing" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { duration: 0.35, ease };

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" aria-hidden className="shrink-0">
      {/* Top bar */}
      <motion.rect
        x="2" y="3.5" width="16" height="2" rx="1"
        animate={{ rotate: open ? 45 : 0, y: open ? 4.5 : 0 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={spring}
      />
      {/* Middle bar */}
      <motion.rect
        x="2" y="8" width="16" height="2" rx="1"
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
        transition={{ duration: 0.2, ease }}
      />
      {/* Bottom bar */}
      <motion.rect
        x="2" y="12.5" width="16" height="2" rx="1"
        animate={{ rotate: open ? -45 : 0, y: open ? -4.5 : 0 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={spring}
      />
    </svg>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScrollY.current || current < 50);
      setScrolled(current > 50);
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 flex items-center justify-between w-full px-6 py-5 md:px-10 md:py-8 nav:px-16 nav:py-10 2xl:px-xl ${scrolled ? "z-[10010]" : "z-50"}`}
    >
      {/* Color gradient overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${scrolled ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to bottom, var(--color-bg-base) 0%, transparent 100%)" }}
      />

      {/* Burger — mobile (icon only) */}
      <Button
        variant="secondary"
        size="lg"
        icon={<BurgerIcon open={menuOpen} />}
        onClick={() => setMenuOpen(p => !p)}
        aria-expanded={menuOpen}
        className="md:hidden relative"
      />

      {/* Burger — tablet (icon + label) */}
      <Button
        variant="secondary"
        size="lg"
        icon={<BurgerIcon open={menuOpen} />}
        onClick={() => setMenuOpen(p => !p)}
        aria-expanded={menuOpen}
        className="hidden md:inline-flex nav:hidden relative"
      >
        {menuOpen ? t("navbar.close") : t("navbar.menu")}
      </Button>

      {/* Logo — desktop */}
      <Logo variant="flat" className="relative shrink-0 hidden nav:block" />

      {/* NavGroup — desktop only */}
      <div className="hidden nav:block absolute left-1/2 top-10 -translate-x-1/2 z-10">
        <NavGroup scrolled={scrolled} />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className="nav:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-[20px] bg-background-surface overflow-hidden"
            style={{ boxShadow: "0px 8px 48px 0px rgba(0,0,0,0.24)" }}
          >
            <nav className="flex flex-col p-2">
              {MENU_LINKS.map(({ key, href, chevron }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl font-display text-s text-text-secondary hover:text-text-primary hover:bg-alpha transition-colors duration-150"
                >
                  {t(`nav.${key}`)}
                  {chevron && <ChevronIcon size={20} />}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 p-4 pt-0">
              <Button variant="secondary" size="lg" icon={<MailIcon />} className="w-full">
                {t("navbar.sendEmail")}
              </Button>
              <Button variant="primary" size="lg" className="w-full">
                {t("navbar.bookCall")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="relative flex items-center gap-3 lg:gap-4 shrink-0">
        <LanguageToggle scrolled={scrolled} />

        {/* Mail icon — sm+ (425px+) */}
        <div className="hidden sm:block">
          <Button variant="secondary" size="lg" icon={<MailIcon />} aria-label={t("navbar.sendEmail")} />
        </div>

        {/* Book a call — mobile */}
        <div className="md:hidden">
          <Button variant="primary" size="md">{t("navbar.bookCall")}</Button>
        </div>

        {/* Book a call — tablet+ */}
        <div className="hidden md:block">
          <Button variant="primary" size="lg" className="w-[144px]">{t("navbar.bookCall")}</Button>
        </div>
      </div>
    </motion.header>
  );
}
