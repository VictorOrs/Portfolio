"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import NavGroup from "@/components/ui/NavGroup";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";
import MailIcon from "@/components/ui/MailIcon";

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
      className={`fixed top-0 left-0 right-0 flex items-center justify-between w-full px-6 py-5 md:px-10 md:py-8 lg:px-16 lg:py-10 2xl:px-xl ${scrolled ? "z-[10010]" : "z-50"}`}
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
        className="hidden md:inline-flex lg:hidden relative"
      >
        {t("navbar.menu")}
      </Button>

      {/* Logo — desktop */}
      <Logo variant="flat" className="relative shrink-0 hidden lg:block" />

      {/* NavGroup — desktop only */}
      <div className="hidden lg:block absolute left-1/2 top-10 -translate-x-1/2 z-10">
        <NavGroup scrolled={scrolled} />
      </div>

      {/* Buttons */}
      <div className="relative flex items-center gap-3 lg:gap-4 shrink-0">
        <LanguageToggle scrolled={scrolled} />

        {/* Mail icon — tablet+ */}
        <div className="hidden md:block">
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
