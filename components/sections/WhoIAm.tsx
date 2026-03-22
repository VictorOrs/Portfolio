"use client";

import Button from "@/components/ui/Button";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import DribbbleIcon from "@/components/ui/DribbbleIcon";
import { useTranslation } from "@/lib/i18n";

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function WhoIAm() {
  const { t } = useTranslation();

  return (
    <section className="px-xl py-l w-full">
      <div className="flex gap-10 items-start">

        {/* ── Profile Card ─────────────────────────────────────── */}
        <div
          className="light-card relative flex flex-col justify-between rounded-[32px] p-8 overflow-hidden shrink-0 w-[399px] h-[556px]"
          style={{
            "--color-bg-base":              "#F5F5F5",
            "--color-bg-surface":           "#E0E0E0",
            "--color-text-primary":         "#383C48",
            "--color-text-secondary":       "#abacb2",
            "--color-alpha":                "#0000001a",
            "--color-btn-primary-bg":       "#090909",
            "--color-btn-primary-bg-hover": "#202020",
            "--color-btn-primary-text":     "#f5f5f5",
            "--shadow-btn-glow":            "0px 0px 20px 0px rgba(0,0,0,0.48)",
            background:                     "#E0E0E0",
          } as React.CSSProperties}
        >
          {/* Decorative badge — Figma: left 263.59px, top 2.9px, 132.856×132.856, rotate 15deg */}
          <img
            src="/img/SVG export logo enuma.svg"
            alt=""
            aria-hidden
            className="absolute pointer-events-none"
            style={{
              left: "279px",
              top: "16px",
              width: "104px",
              height: "104px",
              transform: "rotate(15deg)",
            }}
          />

          {/* Profile info */}
          <div className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="relative w-[72px] h-[72px] shrink-0">
              <img
                src="/img/profil_pic.jpg"
                alt="Victor Oursin"
                className="w-[72px] h-[72px] rounded-full object-cover"
              />
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-success border-2 border-[#E0E0E0]" />
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
                  <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" aria-label="Dribbble" className="text-[#666] hover:text-[#202020] transition-colors">
                    <DribbbleIcon />
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
        </div>

        {/* ── Clients Section ───────────────────────────────────── */}
        <div className="flex flex-col gap-12 shrink-0 w-[621px]">

          {/* Client logos card */}
          <div className="relative bg-background-surface rounded-[32px] h-[414px] w-full overflow-hidden">

            {/* Heading — centré à 88px du haut (Figma: top-[88px] -translate-y-1/2) */}
            <h2 className="absolute left-8 top-[88px] -translate-y-1/2 font-display text-heading-4 text-text-primary leading-10 whitespace-pre">
              {`Trusted by \ntop-tier clients`}
            </h2>

            {/* MyPal — top right, partially above fold */}
            <div
              className="absolute rounded-[14.6px] overflow-hidden"
              style={{ width: 296, height: 273, left: 352, top: -69, boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.48)" }}
            >
              <img src="/img/mypal.svg" alt="MyPal" className="w-full h-full object-cover" />
            </div>

            {/* Enuma — bottom left */}
            <div
              className="absolute rounded-[14.6px] overflow-hidden"
              style={{
                width: 296, height: 261, left: 32, top: 160,
                boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.72)",
              }}
            >
              <img src="/img/enuma.svg" alt="Enuma" className="w-full h-full object-cover" />
            </div>

            {/* Betclic — bottom right */}
            <div
              className="absolute rounded-[14.6px] overflow-hidden"
              style={{
                width: 296, height: 261, left: 352, top: 228,
                boxShadow: "0px -3.65px 29.18px 0px rgba(0,0,0,0.48)",
              }}
            >
              <img src="/img/betclic.svg" alt="Betclic" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Caption */}
          <p className="font-body text-body text-text-secondary pl-8">
            {t("whoiam.clientsCaption")}
          </p>
        </div>

      </div>
    </section>
  );
}
