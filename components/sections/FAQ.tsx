"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";
import Button from "@/components/ui/Button";
import MailIcon from "@/components/ui/MailIcon";

const SPRING = { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      className="shrink-0 text-text-primary"
    >
      {/* Horizontal bar — always visible */}
      <path d="M 4 12 L 20 12" />
      {/* Vertical bar — rotates 90° onto the horizontal bar → becomes a minus */}
      <motion.path
        d="M 12 4 L 12 20"
        animate={{ rotate: open ? 90 : 0 }}
        transition={SPRING}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;

function FAQItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-background-surface last:border-b-0 pb-5 md:pb-8 flex flex-col">
      <button
        className="flex gap-6 items-center w-full text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={open}
      >
        <p className="flex-1 font-body font-medium text-s md:text-m text-text-primary">
          {question}
        </p>
        <PlusMinusIcon open={open} />
      </button>

      {/* grid-template-rows évite tout reflow/sursaut lié à la mesure de height:auto */}
      <motion.div
        animate={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        transition={{ duration: 0.4, ease }}
        style={{ display: "grid" }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <motion.p
            className="font-body text-s text-text-secondary pt-3 md:pt-4"
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.25, ease }}
          >
            {answer}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────────────
export type FAQData = { _id: string; question: string; answer: string };

// ── Section ───────────────────────────────────────────────────────────────
export default function FAQ({ sanityItems }: { sanityItems?: FAQData[] }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Use Sanity data if provided, otherwise fall back to i18n
  const items = sanityItems && sanityItems.length > 0
    ? sanityItems.map((item) => ({ q: item.question, a: item.answer }))
    : [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
        { q: t("faq.q4"), a: t("faq.a4") },
        { q: t("faq.q5"), a: t("faq.a5") },
      ];

  return (
    <section className="px-6 md:px-10 lg:px-s py-[60px] lg:py-l w-full max-w-[1440px] mx-auto grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10 lg:items-start">

      {/* ── Below md: full width; md–lg: 10-col centered; lg+: contents → children are direct grid items ── */}
      <div className="flex flex-col gap-8 col-span-full md:contents">

        {/* ── Header ────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4 items-center md:items-start md:col-span-4 xl:col-start-2"
          initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary text-center md:text-left">
            {t("faq.eyebrow")}
          </p>
          <p
            className="font-display text-2xl bg-clip-text text-transparent whitespace-pre-line text-center md:text-left"
            style={{
              backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
              backgroundSize: "250% 250%",
              backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
            }}
          >
            {t("faq.title")}
          </p>
          <div className="hidden md:flex gap-4 mt-4">
            <Button
              href="https://calendly.com/victor-oursin/30min"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
            >
              {t("navbar.bookCall")}
            </Button>
            <Button
              href="mailto:victor.oursin@gmail.com"
              variant="secondary"
              size="md"
              icon={<MailIcon />}
            >
              {t("navbar.sendEmail")}
            </Button>
          </div>
        </motion.div>

        {/* ── FAQ list ──────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-5 md:gap-8 md:col-start-6 md:col-span-5 md:pt-10 xl:col-start-7"
          initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
        >
          {items.map((item, i) => (
            <FAQItem
              key={i}
              question={item.q}
              answer={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
