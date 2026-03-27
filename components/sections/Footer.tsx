"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import MailIcon from "@/components/ui/MailIcon";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import { useTranslation } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

// Figma tokens for the CTA card (light mode):
// background/#1 → #E0E0E0  |  text/primary → #202020  |  text/secondary → #666
const LIGHT_VARS = {
  "--color-bg-base":              "#F5F5F5",
  "--color-bg-surface":           "#E0E0E0",
  "--color-text-primary":         "#202020",
  "--color-text-secondary":       "#666666",
  "--color-alpha":                "#09090914",
  "--color-alpha-revert":         "#ffffff14",
  "--color-btn-primary-bg":       "#090909",
  "--color-btn-primary-bg-hover": "#202020",
  "--color-btn-primary-text":     "#f5f5f5",
  "--shadow-btn-glow":            "0px 0px 20px 0px rgba(0, 0, 0, 0.48)",
} as React.CSSProperties;

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full flex flex-col">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="px-6 pt-12 pb-8 md:px-10 md:pt-16 md:pb-12 lg:px-xl lg:pt-l lg:pb-m w-full max-w-[1440px] mx-auto flex flex-col gap-10 md:gap-16">

        {/* ── CTA card — forced light mode ─────────────────────────── */}
        <motion.div
          className="light-card flex flex-col gap-6 md:gap-8 items-center p-8 md:p-16 rounded-[24px] md:rounded-[32px] bg-background-surface overflow-hidden"
          style={LIGHT_VARS}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          {/* Heading — "Interested?" hardcoded #666 per Figma, independent of token */}
          <div className="flex flex-col gap-4 items-center">
            <div className="text-center">
              <p className="font-display text-heading-3 md:text-heading-2" style={{ color: "#666666" }}>
                {t("footer.interested")}
              </p>
              <p className="font-display text-heading-3 md:text-heading-2 text-text-primary">
                {t("footer.getInTouch")}
              </p>
            </div>
            <p className="font-body text-body text-text-secondary text-center">
              {t("footer.subtitle")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 items-center w-full md:w-auto">
            <Button variant="secondary" size="lg" icon={<MailIcon />} className="w-full md:w-auto">
              {t("navbar.sendEmail")}
            </Button>
            <Button variant="primary" size="lg" className="w-full md:w-auto">
              {t("navbar.bookCall")}
            </Button>
          </div>
        </motion.div>

        {/* ── Footer info row ───────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease, delay: 0.1 }}
        >
          <p className="font-body text-body-m text-text-secondary">{t("footer.madeWithLove")}</p>
          <div className="flex gap-8 items-center">
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <LinkedInIcon />
            </a>
            <a href="#" className="font-display text-link text-text-secondary hover:text-text-primary transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="font-display text-link text-text-secondary hover:text-text-primary transition-colors">
              {t("footer.legalNotice")}
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Copyright bar ─────────────────────────────────────────────── */}
      <div className="w-full bg-background-surface flex items-center justify-center py-4">
        <p className="font-body text-body-m text-text-secondary">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
