"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import MailIcon from "@/components/ui/MailIcon";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import { useTranslation } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full flex flex-col">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="px-6 pt-8 pb-6 md:px-10 md:pt-12 md:pb-8 lg:px-s xl:px-xl 2xl:px-xl lg:pt-l lg:pb-m w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10">

        <div className="flex flex-col gap-8 md:gap-16 col-span-full md:col-start-2 md:col-span-10 lg:col-span-full">

        {/* ── CTA card — forced light mode ─────────────────────────── */}
        <motion.div
          className="light-card flex flex-col gap-5 md:gap-8 items-center p-6 md:p-16 rounded-[20px] md:rounded-[32px] bg-background-surface overflow-hidden"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          {/* Heading — "Interested?" hardcoded #666 per Figma, independent of token */}
          <div className="flex flex-col gap-4 items-center">
            <div className="text-center">
              <p className="font-display text-2xl text-text-secondary">
                {t("footer.interested")}
              </p>
              <p className="font-display text-2xl text-text-primary">
                {t("footer.getInTouch")}
              </p>
            </div>
            <p className="font-body text-s text-text-secondary text-center">
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
          <p className="font-body text-s text-text-secondary">{t("footer.madeWithLove")}</p>
          <div className="flex gap-8 items-center">
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <LinkedInIcon />
            </a>
            <a href="#" className="font-display text-s text-text-secondary hover:text-text-primary transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="font-display text-s text-text-secondary hover:text-text-primary transition-colors">
              {t("footer.legalNotice")}
            </a>
          </div>
        </motion.div>

        </div>
      </div>

      {/* ── Copyright bar ─────────────────────────────────────────────── */}
      <div className="w-full bg-background-surface flex items-center justify-center py-4">
        <p className="font-body text-s text-text-secondary">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
