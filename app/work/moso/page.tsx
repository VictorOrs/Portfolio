"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { buttonVariants } from "@/components/ui/Button";
import SquircleCard from "@/components/ui/SquircleCard";
import { GRADIENT_STOPS } from "@/lib/gradient";

const ease = [0.22, 1, 0.36, 1] as const;

const gradientText = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "250% 250%",
  backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
};

const TAGS = ["Product Design", "Design System", "Internal Tooling"];

const STATS = [
  { label: "Role",          value: "Product Designer"         },
  { label: "Duration",      value: "Ongoing"                  },
  { label: "Collaboration", value: "Embedded designer"        },
  { label: "Industry",      value: "Media · Content"          },
];

const CONTRIBUTIONS = [
  {
    title: "Product Design",
    body: "Shaping Flow, Moso's internal product engine — designing intuitive interfaces for content planning, scheduling and production workflows.",
  },
  {
    title: "Design System",
    body: "Building and maintaining a cohesive design system that keeps the product consistent as features scale across the platform.",
  },
  {
    title: "Internal Tooling",
    body: "Designing tools that streamline day-to-day operations for Moso's teams — reducing friction and improving productivity.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
      {children}
    </p>
  );
}

export default function MosoPage() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px] overflow-x-clip">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full max-w-[1440px] mx-auto overflow-visible"
        style={{ height: "80vh", minHeight: 480 }}
      >
        <div className="absolute top-[-80px] left-0 right-0 bottom-0 overflow-visible">
          <Image
            src="/img/work/moso_illustration.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "300px -200px" }}
          />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "65%",
            background: "linear-gradient(to top, var(--color-bg-base) 0%, transparent 100%)",
          }}
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-10 md:pb-16 lg:px-s xl:px-xl 2xl:px-xl flex flex-col gap-6"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease }}
        >
          <Image
            src="/img/work/moso_logo.svg"
            alt="Moso"
            width={120}
            height={24}
            className="opacity-60"
            unoptimized
          />

          <h1
            className="font-display text-2xl max-w-[720px] whitespace-pre-line"
            style={gradientText}
          >
            {"Continuously shaping Moso's\ninternal product engine"}
          </h1>

          <p className="font-body text-s md:text-m text-text-secondary max-w-[520px] leading-6 md:leading-8">
            Continuously shaping Flow — Moso&apos;s internal product engine for content planning, scheduling and production.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.motionsociety.com"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <span className="pt-1 px-1">Visit motionsociety.com</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          {STATS.map(({ label, value }) => (
            <SquircleCard key={label} className="flex flex-col gap-2 p-6 xl:p-8 bg-background-surface">
              <Eyebrow>{label}</Eyebrow>
              <p className="font-display text-l text-text-primary">{value}</p>
            </SquircleCard>
          ))}
        </motion.div>
      </section>

      {/* ── Context ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10 lg:items-center">
        <motion.div
          className="col-span-full md:col-start-2 md:col-span-10 lg:col-start-1 lg:col-span-5 flex flex-col gap-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          <Eyebrow>Context</Eyebrow>
          <h2
            className="font-display text-xl whitespace-pre-line"
            style={gradientText}
          >
            {"A fast-moving team\nneeding a scalable\nproduct engine"}
          </h2>
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            Moso (Motion Society) is a content production company managing high volumes of creative work. They needed an internal tool — Flow — to orchestrate content planning, scheduling, and production across their teams.
          </p>
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            As their embedded Product Designer, I continuously shape Flow&apos;s interface and design system, making sure the tool scales with the company&apos;s growing needs.
          </p>
        </motion.div>

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
              src="/img/work/moso_illustration.png"
              alt="Moso Flow interface"
              fill
              className="object-cover object-top opacity-80"
              unoptimized
            />
          </SquircleCard>
        </motion.div>
      </section>

      {/* ── Contributions ───────────────────────────────────────────────────── */}
      <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10">
        <motion.div
          className="col-span-full md:col-start-2 md:col-span-10 lg:col-span-full flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease }}
        >
          <Eyebrow>Contributions</Eyebrow>
          <h2 className="font-display text-xl" style={gradientText}>
            What I worked on
          </h2>
        </motion.div>

        {CONTRIBUTIONS.map(({ title, body }, i) => (
          <motion.div
            key={title}
            className="col-span-full md:col-span-6 lg:col-span-4"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease, delay: i * 0.08 }}
          >
            <SquircleCard className="h-full flex flex-col gap-4 p-6 xl:p-8 bg-background-surface">
              <p className="font-display text-l text-text-primary">{title}</p>
              <p className="font-body text-s text-text-secondary leading-6">{body}</p>
            </SquircleCard>
          </motion.div>
        ))}
      </section>

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-8 md:px-10 md:py-12 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10">
        <motion.div
          className="col-span-full md:col-start-2 md:col-span-10 lg:col-start-1 lg:col-span-8 flex flex-col gap-6"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          <Eyebrow>Results</Eyebrow>
          <h2 className="font-display text-2xl" style={gradientText}>
            A product that grows with the team
          </h2>
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            Flow has become the backbone of Moso&apos;s operations — managing content pipelines, team assignments and production workflows. The design system ensures consistency as new features ship, and the team iterates faster thanks to a clear, repeatable design process.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.motionsociety.com"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <span className="pt-1 px-1">Visit motionsociety.com</span>
            </a>
            <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              <span className="pt-1 px-1">Back to portfolio</span>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
