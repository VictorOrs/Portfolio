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

const TAGS = ["Product Design", "Design System", "Brand Identity", "Webflow"];

const STATS = [
  { label: "Role",          value: "Product & Brand Designer" },
  { label: "Duration",      value: "2+ years"                 },
  { label: "Collaboration", value: "Long-term partnership"    },
  { label: "Industries",    value: "Fintech · Data · Web3"    },
];

const CONTRIBUTIONS = [
  {
    title: "Product Design",
    body:  "End-to-end design of web and mobile interfaces — from early wireframes to polished, production-ready components.",
  },
  {
    title: "Design System",
    body:  "Built and maintained a scalable design system used across all Enuma products, enabling faster iteration and visual consistency.",
  },
  {
    title: "Brand Identity",
    body:  "Shaped the visual identity of Enuma Collective — logo refinement, colour system, typography and brand guidelines.",
  },
];

// ── Eyebrow — reused pattern across sections ──────────────────────────────────
function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
      {children}
    </p>
  );
}

export default function EnumaPage() {
  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px]">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full max-w-[1440px] mx-auto overflow-hidden"
        style={{ height: "80vh", minHeight: 480 }}
      >
        {/* Illustration */}
        <div className="absolute inset-0">
          <Image
            src="/img/work/enuma_illustration.png"
            alt=""
            fill
            priority
            className="object-cover object-right opacity-[0.72]"
          />
        </div>

        {/* Bottom-to-top fade */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "65%",
            background: "linear-gradient(to top, var(--color-bg-base) 0%, transparent 100%)",
          }}
        />

        {/* Content pinned to bottom */}
        <motion.div
          className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-10 md:pb-16 lg:px-s xl:px-xl 2xl:px-xl flex flex-col gap-6"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease }}
        >
          <Image
            src="/img/work/enuma_logo.svg"
            alt="Enuma Collective"
            width={120}
            height={24}
            className="opacity-60"
            unoptimized
          />

          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="font-display text-s text-text-secondary px-4 py-1.5 rounded-full outline outline-2 outline-alpha"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="font-display text-2xl xl:text-3xl max-w-[720px]"
            style={gradientText}
          >
            Lasting partnership
          </h1>

          <p className="font-body text-s md:text-m text-text-secondary max-w-[520px] leading-6 md:leading-8">
            Two years designing the product and brand identity of Enuma Collective — a creative agency at the intersection of design and technology.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.enuma-collective.com"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <span className="pt-1 px-1">Visit enuma-collective.com</span>
            </a>
            <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              <span className="pt-1 px-1">Back to portfolio</span>
            </Link>
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
            {"A growing agency\nneeding a coherent\ndesign vision"}
          </h2>
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            Enuma Collective was scaling fast — bringing on new clients across fintech, data and web3. They needed a consistent design language that could flex across projects without losing its identity.
          </p>
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            As their embedded Product & Brand Designer, I helped build the foundations: a solid design system, a refined brand, and the product design processes that let the team ship faster and more confidently.
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
              src="/img/work/enuma_illustration.png"
              alt="Enuma product interface"
              fill
              className="object-cover object-center opacity-80"
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
            A design foundation that scales
          </h2>
          <p className="font-body text-s md:text-m text-text-secondary leading-6 md:leading-8">
            Two years in, Enuma Collective ships with a consistent voice. The design system has been adopted across all client projects, reducing design-to-dev friction significantly. The brand identity stands out clearly in a crowded market.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.enuma-collective.com"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <span className="pt-1 px-1">Visit enuma-collective.com</span>
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
