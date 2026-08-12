"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import SquircleCard from "@/components/ui/SquircleCard";
import { GRADIENT_STOPS } from "@/lib/gradient";
import { useTranslation } from "@/lib/i18n";
import { objectPosition, pick, type ProjectData } from "@/lib/queries";

const ease = [0.22, 1, 0.36, 1] as const;

const gradientText = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "250% 250%",
  backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

function Eyebrow({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="font-body text-xs uppercase text-text-secondary">{children}</p>
  );
}

function Paragraphs({ items }: { items?: string[] }) {
  return (
    <>
      {(items ?? []).map((text, i) => (
        <p
          key={i}
          className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8 whitespace-pre-line"
        >
          {text}
        </p>
      ))}
    </>
  );
}

/**
 * Case-study body (everything below the hero card) — one template, filled from
 * the project's Sanity document. Shared by the expand overlay, which supplies
 * its own hero: the morphing grey card.
 */
export default function CaseStudyBody({ project }: { project: ProjectData }) {
  const { lang } = useTranslation();

  const stats = project.stats ?? [];
  const context = project.context;
  const contributions = project.contributions;
  const results = project.results;

  const contextBody = pick<string[]>(context, "body", lang);
  const contextTitle = pick(context, "title", lang);
  const contextImage = context?.image;

  const contributionItems = contributions?.items ?? [];

  const resultsBody = pick<string[]>(results, "body", lang);
  const resultsTitle = pick(results, "title", lang);
  const resultsCta = pick(results, "ctaLabel", lang);
  const resultsBack = pick(results, "backLabel", lang);

  return (
    <>
      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease }}
          >
            {stats.map((stat, i) => (
              <SquircleCard key={i} className="flex flex-col gap-2 p-6 xl:p-8 bg-background-surface">
                <Eyebrow>{pick(stat, "label", lang)}</Eyebrow>
                <p className="font-display text-l text-text-primary">
                  {pick(stat, "value", lang)}
                </p>
              </SquircleCard>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Context ─────────────────────────────────────────────────────────── */}
      {(contextTitle || contextBody?.length || contextImage?.url) && (
        <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10 lg:items-center">

          <motion.div
            className="col-span-full md:col-start-2 md:col-span-10 lg:col-start-1 lg:col-span-5 flex flex-col gap-6"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease }}
          >
            <Eyebrow>{pick(context, "eyebrow", lang)}</Eyebrow>
            {contextTitle && (
              <h2 className="font-display text-xl whitespace-pre-line" style={gradientText}>
                {contextTitle}
              </h2>
            )}
            <Paragraphs items={contextBody} />
          </motion.div>

          {contextImage?.url && (
            <motion.div
              className="col-span-full md:col-start-2 md:col-span-10 lg:col-start-6 lg:col-span-7"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease, delay: 0.1 }}
            >
              <SquircleCard
                className="relative w-full overflow-hidden bg-background-surface"
                style={{ aspectRatio: "16 / 10" }}
              >
                <Image
                  src={contextImage.url}
                  alt={project.name ? `${project.name} — interface` : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover opacity-80"
                  style={{ objectPosition: objectPosition(contextImage) }}
                />
              </SquircleCard>
            </motion.div>
          )}

        </section>
      )}

      {/* ── Contributions ───────────────────────────────────────────────────── */}
      {contributionItems.length > 0 && (
        <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10">

          <motion.div
            className="col-span-full md:col-start-2 md:col-span-10 lg:col-span-full flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease }}
          >
            <Eyebrow>{pick(contributions, "eyebrow", lang)}</Eyebrow>
            <h2 className="font-display text-xl whitespace-pre-line" style={gradientText}>
              {pick(contributions, "title", lang)}
            </h2>
          </motion.div>

          {contributionItems.map((item, i) => (
            <motion.div
              key={i}
              className="col-span-full md:col-span-6 lg:col-span-4"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease, delay: i * 0.08 }}
            >
              <SquircleCard className="h-full flex flex-col gap-4 p-6 xl:p-8 bg-background-surface">
                <p className="font-display text-l text-text-primary">
                  {pick(item, "title", lang)}
                </p>
                <p className="font-body text-s text-text-secondary leading-6">
                  {pick(item, "body", lang)}
                </p>
              </SquircleCard>
            </motion.div>
          ))}

        </section>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {(resultsTitle || resultsBody?.length) && (
        <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10">
          <motion.div
            className="col-span-full md:col-start-2 md:col-span-10 lg:col-start-1 lg:col-span-8 flex flex-col gap-6"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease }}
          >
            <Eyebrow>{pick(results, "eyebrow", lang)}</Eyebrow>
            {resultsTitle && (
              <h2 className="font-display text-2xl whitespace-pre-line" style={gradientText}>
                {resultsTitle}
              </h2>
            )}
            <Paragraphs items={resultsBody} />
            {(resultsCta || resultsBack) && (
              <div className="flex flex-wrap gap-3">
                {resultsCta && results?.ctaHref && (
                  <a
                    href={results.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "primary", size: "lg" })}
                  >
                    <span className="py-0.5 px-1">{resultsCta}</span>
                  </a>
                )}
                {resultsBack && (
                  <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                    <span className="py-0.5 px-1">{resultsBack}</span>
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </section>
      )}
    </>
  );
}
