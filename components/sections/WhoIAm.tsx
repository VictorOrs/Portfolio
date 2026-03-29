"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import MailIcon from "@/components/ui/MailIcon";
import SquircleCard from "@/components/ui/SquircleCard";
import { useTranslation } from "@/lib/i18n";

export default function WhoIAm() {
  const { t } = useTranslation();

  return (
    <section
      className="relative px-6 py-[60px] md:px-10 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10"
      style={{
        zIndex: 10000,
        background: "linear-gradient(to bottom, transparent 0px, var(--color-bg-base) 200px)",
      }}
    >
      <div className="grid grid-cols-1 gap-6 col-span-full md:col-start-2 md:col-span-10 lg:col-span-full lg:grid-cols-12 lg:gap-10">

        {/* ── Profile Card ─────────────────────────────────────── */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
        <SquircleCard
          className="light-card relative flex flex-col gap-6 p-6 xl:p-8 overflow-hidden w-full lg:h-full lg:justify-between lg:gap-0"
          style={{ zIndex: 10000, background: "var(--color-bg-surface)" }}
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
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-success border-4 border-background-surface" />
            </div>

            <div className="flex flex-col gap-1">
              {/* Name + social icons */}
              <div className="flex items-center gap-3">
                <span className="font-display text-l text-text-primary whitespace-nowrap">
                  Victor Oursin
                </span>
                <div className="flex items-center gap-1.5">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-secondary hover:text-text-primary transition-colors">
                    <LinkedInIcon />
                  </a>
                </div>
              </div>

              {/* Role */}
              <p className="text-xs tracking-[1.12px] uppercase text-text-secondary">
                {t("whoiam.role")}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            {t("whoiam.bioPrefix")}{" "}
            <strong className="font-medium text-text-primary">{t("whoiam.bioYears")}</strong>
            {t("whoiam.bioMid")}{" "}
            <strong className="font-medium text-text-primary">{t("whoiam.bioSpeciality")}</strong>
            {" "}{t("whoiam.bioSuffix")}{" "}
            <strong className="font-medium text-text-primary">{t("whoiam.bioMarkets")}</strong>
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
          className="flex flex-col gap-8 md:gap-12 w-full lg:col-span-7"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >

          {/* Client logos card */}
          <SquircleCard className="relative bg-background-surface h-[280px] md:h-[414px] w-full overflow-hidden max-[425px]:h-[220px] min-[426px]:max-md:min-h-[422px] md:max-lg:min-h-[472px]" style={{ zIndex: 10000 }}>

            {/* Heading */}
            <h2 className="absolute left-8 top-[88px] -translate-y-1/2 max-[425px]:top-8 max-[425px]:translate-y-0 font-display text-l max-[425px]:text-sm text-text-primary leading-10 whitespace-pre">
              {t("whoiam.clientsHeading")}
            </h2>

            {/* Logo group */}
            <div className="absolute left-8 right-[-16px] bottom-[-72px] max-[425px]:bottom-[-44px] flex gap-6 items-end">

              {/* Left — Enuma, offset via padding-bottom */}
              <div className="flex-1 min-w-0 pb-16 max-[425px]:pb-8">
                <Image
                  src="/img/enuma.svg" alt="Enuma" width={296} height={261} unoptimized
                  className="w-full h-auto rounded-[16px]"
                  style={{ boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.72)" }}
                />
              </div>

              {/* Right — Moso (top) + Dialog (bottom), stacked */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <Image
                  src="/img/moso.svg" alt="Moso" width={296} height={261} unoptimized
                  className="w-full h-auto rounded-[16px]"
                  style={{ boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.48)" }}
                />
                <Image
                  src="/img/dialog.svg" alt="Dialog" width={296} height={261} unoptimized
                  className="w-full h-auto rounded-[16px]"
                  style={{ boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.48)" }}
                />
              </div>

            </div>
          </SquircleCard>

          {/* Caption */}
          <p className="font-body text-m text-text-secondary lg:pl-8">
            {t("whoiam.clientsCaption")}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
