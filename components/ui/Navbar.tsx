"use client";

import Button from "@/components/ui/Button";
import NavGroup from "@/components/ui/NavGroup";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";

type NavbarProps = {
  scrolled?: boolean;
};

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Navbar({ scrolled = false }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <header className="relative flex items-center justify-between w-full px-20 py-10">

      {/* Logo — left */}
      <Logo variant="flat" className="shrink-0" />

      {/* NavGroup — absolutely centered so it doesn't depend on side column widths */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2">
        <NavGroup scrolled={scrolled} />
      </div>

      {/* CTA buttons — right */}
      <div className="flex items-center gap-4 shrink-0">
        <LanguageToggle />
        <Button variant="secondary" size="lg" icon={<MailIcon />} aria-label={t("navbar.sendEmail")} />
        <Button variant="primary" size="lg">
          {t("navbar.bookCall")}
        </Button>
      </div>

    </header>
  );
}
