"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";

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

// ── Section ───────────────────────────────────────────────────────────────
export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <section className="px-6 py-[60px] md:px-10 lg:px-s lg:py-l xl:px-xl 2xl:px-xl w-full max-w-[1440px] mx-auto grid grid-cols-12 gap-4 md:gap-6 lg:gap-10 lg:items-start">

      {/* ── At lg: 8-col wrapper (stacked); at xl: display:contents → children become direct grid items ── */}
      <div className="flex flex-col gap-8 col-span-full md:col-start-2 md:col-span-10 lg:gap-m xl:contents">

        {/* ── Header ────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4 lg:items-center xl:items-start xl:col-span-5"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease }}
        >
          <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary text-center lg:text-left">
            {t("faq.eyebrow")}
          </p>
          <p
            className="font-display text-2xl bg-clip-text text-transparent whitespace-pre-line text-center lg:text-left lg:whitespace-nowrap xl:whitespace-pre-line"
            style={{
              backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
              backgroundSize: "250% 250%",
              backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
            }}
          >
            {t("faq.title")}
          </p>
        </motion.div>

        {/* ── FAQ list ──────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-5 md:gap-8 xl:col-span-7 xl:pt-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
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
