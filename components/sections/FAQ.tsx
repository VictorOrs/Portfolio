"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { GRADIENT_STOPS } from "@/lib/gradient";

// ── Plus / Minus morph paths ───────────────────────────────────────────────
// Same M L command structure → clean framer-motion interpolation
const PLUS_H = "M 4 12 L 20 12"; // horizontal bar (always present)
const PLUS_V = "M 12 4 L 12 20"; // vertical bar   (plus state)
const MINUS_V = "M 12 12 L 12 12"; // collapsed      (minus state)

const SPRING = { duration: 0.35, ease: [0.22, 1, 0.36, 1] } as const;

function PlusMinusIcon({ open }: { open: boolean }) {
  const dH = useMotionValue(PLUS_H);
  const dV = useMotionValue(open ? MINUS_V : PLUS_V);

  useEffect(() => {
    const a = animate(dV, open ? MINUS_V : PLUS_V, SPRING);
    return () => a.stop();
  }, [open, dV]);

  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
      className="shrink-0 text-text-primary"
    >
      <motion.path d={dH} />
      <motion.path d={dV} />
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
    <div className="border-b border-alpha pb-6 flex flex-col gap-4">
      <button
        className="flex gap-6 items-start w-full text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={open}
      >
        <p className="flex-1 font-display text-[24px] leading-8 text-text-primary">
          {question}
        </p>
        <PlusMinusIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            style={{ overflow: "hidden" }}
          >
            <p className="font-body text-body text-text-secondary">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
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
    <section className="relative px-xl py-l w-full max-w-[1440px] mx-auto flex justify-between">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col gap-4 shrink-0"
        style={{ width: 399 }}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease }}
      >
        <p className="font-body font-semibold text-[14px] leading-5 tracking-[1.12px] uppercase text-text-secondary">
          {t("faq.eyebrow")}
        </p>
        <p
          className="font-display text-heading-2 bg-clip-text text-transparent whitespace-pre-line"
          style={{
            backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
            backgroundSize: "250% 250%",
            backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
          }}
        >
          {t("faq.title")}
        </p>
      </motion.div>

      {/* ── FAQ list ────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col gap-8 shrink-0"
        style={{ width: 510 }}
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
    </section>
  );
}
