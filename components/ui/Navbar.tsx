"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import NavGroup from "@/components/ui/NavGroup";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";
import MailIcon from "@/components/ui/MailIcon";


export default function Navbar() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
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
      className={`fixed top-0 left-0 right-0 flex items-center justify-between w-full px-16 py-10 ${scrolled ? "z-[10010]" : "z-50"}`}
    >
      {/* Color gradient overlay — bg-base fades to transparent, CSS transition only */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out ${scrolled ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to bottom, var(--color-bg-base) 0%, transparent 100%)" }}
      />

      {/* Logo — left */}
      <Logo variant="flat" className="relative shrink-0" />

      {/* NavGroup — absolutely centered */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 z-10">
        <NavGroup scrolled={scrolled} />
      </div>

      {/* CTA buttons — right */}
      <div className="relative flex items-center gap-4 shrink-0">
        <LanguageToggle scrolled={scrolled} />
        <Button variant="secondary" size="lg" icon={<MailIcon />} aria-label={t("navbar.sendEmail")} />
        <Button variant="primary" size="lg" className="w-[144px]">
          {t("navbar.bookCall")}
        </Button>
      </div>
    </motion.header>
  );
}
