"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import DribbbleIcon from "@/components/ui/DribbbleIcon";
import MailIcon from "@/components/ui/MailIcon";
import SquircleCard from "@/components/ui/SquircleCard";
import { useTranslation } from "@/lib/i18n";

export default function WhoIAm() {
  const { t } = useTranslation();

  return (
    <section
      className="relative px-xl py-l w-full max-w-[1440px] mx-auto"
      style={{
        zIndex: 10000,
        background: "linear-gradient(to bottom, transparent 0px, var(--color-bg-base) 200px)",
      }}
    >
      <div className="flex gap-10 items-start">

        {/* ── Profile Card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
        <SquircleCard
          className="light-card relative flex flex-col justify-between p-8 overflow-hidden shrink-0 w-[399px] h-[556px]"
          style={{ zIndex: 10000,
            "--color-bg-base":              "#F5F5F5",
            "--color-bg-surface":           "#E0E0E0",
            "--color-text-primary":         "#383C48",
            "--color-text-secondary":       "#abacb2",
            "--color-alpha":                "#09090914",
            "--color-alpha-revert":         "#ffffff14",
            "--color-btn-primary-bg":       "#090909",
            "--color-btn-primary-bg-hover": "#202020",
            "--color-btn-primary-text":     "#f5f5f5",
            "--shadow-btn-glow":            "0px 0px 20px 0px rgba(0,0,0,0.48)",
            background:                     "#E0E0E0",
          } as React.CSSProperties}
        >
          {/* Decorative badge — Figma: left 263.59px, top 2.9px, 132.856×132.856, rotate 15deg *<Image
            src="/img/SVG export logo enuma.svg"
            alt=""
            aria-hidden
            width={104}
            height={104}
            unoptimized
            className="absolute pointer-events-none"
            style={{
              left: "279px",
              top: "16px",
              transform: "rotate(15deg)",
            }}
          />

          {/* Profile info */}
          <div className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="relative w-[72px] h-[72px] shrink-0">
              <Image
                src="/img/profil_pic.jpg"
                alt="Victor Oursin"
                width={72}
                height={72}
                className="rounded-full object-cover"
              />
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-success border-4 border-[#E0E0E0]" />
            </div>

            <div className="flex flex-col gap-1">
              {/* Name + social icons */}
              <div className="flex items-center gap-3">
                <span className="font-display text-heading-4 text-[#202020] whitespace-nowrap">
                  Victor Oursin
                </span>
                <div className="flex items-center gap-1.5">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#666] hover:text-[#202020] transition-colors">
                    <LinkedInIcon />
                  </a>
                </div>
              </div>

              {/* Role */}
              <p className="text-label tracking-[1.12px] uppercase text-[#666]">
                {t("whoiam.role")}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="font-body text-body text-[#666] leading-8">
            {t("whoiam.bioPrefix")}{" "}
            <strong className="font-medium text-[#202020]">{t("whoiam.bioYears")}</strong>
            {t("whoiam.bioMid")}{" "}
            <strong className="font-medium text-[#202020]">{t("whoiam.bioSpeciality")}</strong>
            {" "}{t("whoiam.bioSuffix")}{" "}
            <strong className="font-medium text-[#202020]">{t("whoiam.bioMarkets")}</strong>
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4">
            <Button variant="secondary" size="lg" icon={<MailIcon />} aria-label={t("navbar.sendEmail")} />
            <Button variant="primary" size="lg" className="flex-1">
              {t("navbar.bookCall")}
            </Button>
          </div>
        </SquircleCard>
        </motion.div>

        {/* ── Clients Section ───────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-12 shrink-0 w-[621px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >

          {/* Client logos card */}
          <SquircleCard className="relative bg-background-surface h-[414px] w-full overflow-hidden" style={{ zIndex: 10000 }}>

            {/* Heading — centré à 88px du haut (Figma: top-[88px] -translate-y-1/2) */}
            <h2 className="absolute left-8 top-[88px] -translate-y-1/2 font-display text-heading-4 text-text-primary leading-10 whitespace-pre">
              {`Trusted by \ntop-tier clients`}
            </h2>

            {/* Moso — top right, partially above fold */}
            <Image
              src="/img/moso.svg" alt="Moso" width={296} height={261} unoptimized
              className="absolute rounded-[16px]"
              style={{ left: 352, top: -57, boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.48)" }}
            />

            {/* Enuma — bottom left */}
            <Image
              src="/img/enuma.svg" alt="Enuma" width={296} height={261} unoptimized
              className="absolute rounded-[16px]"
              style={{ left: 32, top: 166, boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.72)" }}
            />

            {/* Dialog — bottom right */}
            <Image
              src="/img/dialog.svg" alt="Dialog" width={296} height={261} unoptimized
              className="absolute rounded-[16px]"
              style={{ left: 352, top: 228, boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.48)" }}
            />
          </SquircleCard>

          {/* Caption */}
          <p className="font-body text-body text-text-secondary pl-8">
            {t("whoiam.clientsCaption")}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
