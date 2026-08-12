"use client";

import { motion } from "framer-motion";
import { useLoading } from "@/lib/loading";
import Image from "next/image";
import Button from "@/components/ui/Button";
import LinkedInIcon from "@/components/ui/LinkedInIcon";
import MailIcon from "@/components/ui/MailIcon";
import SquircleCard from "@/components/ui/SquircleCard";
import { PortableText } from "@portabletext/react";
import { useTranslation } from "@/lib/i18n";
import { loc, type HomepageData } from "@/lib/queries";

type ClientImage = { src: string; alt: string; width: number; height: number };

// Used until the Sanity field is filled — same artwork the section shipped with.
const FALLBACK_CLIENTS: ClientImage[] = [
  { src: "/img/enuma.webp", alt: "Enuma", width: 640, height: 565 },
  { src: "/img/moso.svg",   alt: "Moso",  width: 296, height: 261 },
  { src: "/img/gemos.webp", alt: "Gemos", width: 592, height: 522 },
];

function ClientCardImage({ image, shadow }: { image: ClientImage; shadow: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      // Next's optimiser rejects remote SVGs; these are served as-is instead.
      unoptimized={image.src.endsWith(".svg")}
      className="w-full h-auto rounded-[16px]"
      style={{ boxShadow: shadow }}
    />
  );
}

export default function WhoIAm({
  data,
  profileImageUrl,
}: {
  data?: HomepageData | null;
  profileImageUrl?: string | null;
}) {
  const { t, lang } = useTranslation();
  const { isLoaded } = useLoading();

  const bio = lang === "fr" ? data?.about_bio_fr : data?.about_bio_en;

  // First image leads the left column, the rest stack on the right.
  const fromSanity = (data?.about_clientImages ?? [])
    .filter((img) => !!img.url)
    .map((img) => ({
      src: img.url as string,
      alt: img.name ?? "",
      width: img.width ?? 296,
      height: img.height ?? 261,
    }));
  const [lead, ...stacked] = fromSanity.length > 0 ? fromSanity : FALLBACK_CLIENTS;

  return (
    <motion.section
      className="relative w-full"
      style={{
        zIndex: 10000,
        background: "linear-gradient(to bottom, transparent 0px, var(--color-bg-base) 200px)",
      }}
      initial={{ y: 60 }}
      animate={isLoaded ? { y: 0 } : {}}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
    >
      <div className="px-6 md:px-10 lg:px-s py-[60px] lg:py-l w-full max-w-[1440px] mx-auto grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10">
      <div className="grid grid-cols-1 gap-6 col-span-full min-[900px]:grid-cols-10 min-[900px]:gap-10 xl:col-start-2 xl:col-span-10">

        {/* ── Profile Card ─────────────────────────────────────── */}
        <motion.div
          className="min-[900px]:col-span-4 h-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
        <div
          className="light-card light-card-border relative flex flex-col gap-6 p-8 overflow-hidden w-full h-full min-[900px]:justify-between min-[900px]:gap-0 backdrop-blur-glass rounded-[40px]"
          style={{ zIndex: 10000, background: "var(--gradient-surface)" }}
        >
          {/* Profile info */}
          <div className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="relative w-14 h-14 md:w-[72px] md:h-[72px] shrink-0">
              <Image
                src={profileImageUrl ?? "/img/profil_pic.jpg"}
                alt="Victor Oursin"
                width={72}
                height={72}
                priority
                className="rounded-full object-cover w-14 h-14 md:w-[72px] md:h-[72px]"
              />
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
              <p className="font-body text-xxs md:text-xs uppercase text-text-secondary">
                {loc(data, "about_role", lang) ?? t("whoiam.role")}
              </p>
            </div>
          </div>

          {/* Bio — Sanity Portable Text when present, else segmented i18n fallback */}
          <div className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            {bio && bio.length > 0 ? (
              <PortableText
                value={bio}
                components={{
                  block: { normal: ({ children }) => <p>{children}</p> },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-medium text-text-primary">{children}</strong>
                    ),
                  },
                }}
              />
            ) : (
              <p>
                {t("whoiam.bioPrefix")}{" "}
                <strong className="font-medium text-text-primary">{t("whoiam.bioYears")}</strong>
                {t("whoiam.bioMid")}{" "}
                <strong className="font-medium text-text-primary">{t("whoiam.bioSpeciality")}</strong>
                {" "}{t("whoiam.bioSuffix")}{" "}
                <strong className="font-medium text-text-primary">{t("whoiam.bioMarkets")}</strong>
              </p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4">
            <Button href="mailto:victor.oursin@gmail.com" variant="secondary" size="lg" icon={<MailIcon />} aria-label={t("navbar.sendEmail")} />
            <Button href="https://calendly.com/victor-oursin/30min" target="_blank" rel="noopener noreferrer" variant="primary" size="lg" className="flex-1">
              {t("navbar.bookCall")}
            </Button>
          </div>
        </div>
        </motion.div>

        {/* ── Clients Section ───────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-8 md:gap-12 w-full min-[900px]:col-span-6"
          initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >

          {/* Client logos card */}
          <SquircleCard className="relative bg-background-surface max-[425px]:h-[240px] min-[426px]:min-h-[492px] min-[900px]:min-h-[372px] lg:min-h-0 lg:h-[414px] w-full overflow-hidden" style={{ zIndex: 10000 }}>

            {/* Heading */}
            <h2 className="absolute left-8 top-10 max-[425px]:left-6 max-[425px]:top-6 font-display text-l max-[425px]:text-sm text-text-primary leading-10 whitespace-pre">
              {loc(data, "about_clientsHeading", lang) ?? t("whoiam.clientsHeading")}
            </h2>

            {/* Logo group */}
            <div className="absolute left-6 md:left-8 right-[-16px] bottom-[-72px] max-[425px]:bottom-[-48px] flex gap-4 items-end">

              {/* Left — leading image, offset via padding-bottom */}
              {lead && (
                <div className="flex-1 min-w-0 pb-16 max-[425px]:pb-8">
                  <ClientCardImage image={lead} shadow="0px -3.65px 29.18px 0px rgba(0,0,0,0.72)" />
                </div>
              )}

              {/* Right — the rest, stacked. Lighter shadow keeps them behind. */}
              {stacked.length > 0 && (
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                  {stacked.map((image, i) => (
                    <ClientCardImage
                      key={i}
                      image={image}
                      shadow="0px -3.65px 29.18px 0px rgba(0,0,0,0.48)"
                    />
                  ))}
                </div>
              )}

            </div>
          </SquircleCard>

          {/* Caption */}
          <p className="font-body text-m text-text-secondary lg:pl-8">
            {loc(data, "about_clientsCaption", lang) ?? t("whoiam.clientsCaption")}
          </p>
        </motion.div>

      </div>
      </div>
    </motion.section>
  );
}
