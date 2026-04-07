"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import MailIcon from "@/components/ui/MailIcon";
import Logo from "@/components/ui/Logo";
import { useTranslation } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const LOCATIONS = ["Paris", "Bordeaux", "Bali"];
const TYPE_SPEED = 100;
const DELETE_SPEED = 60;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

function TypingLocation() {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [locIndex, setLocIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Only animate when visible in viewport
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const current = LOCATIONS[locIndex];

    if (!deleting) {
      if (text.length < current.length) {
        const id = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(id);
    }

    if (text.length > 0) {
      const id = setTimeout(() => setText(text.slice(0, -1)), DELETE_SPEED);
      return () => clearTimeout(id);
    }

    const id = setTimeout(() => {
      setDeleting(false);
      setLocIndex((locIndex + 1) % LOCATIONS.length);
    }, PAUSE_AFTER_DELETE);
    return () => clearTimeout(id);
  }, [text, deleting, locIndex, visible]);

  return (
    <span ref={spanRef}>
      {text}
      <motion.span
        className="inline-block w-[2px] h-[14px] bg-text-secondary ml-[2px] align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full flex flex-col">
      {/* ── Main content — 12-col grid ───────────────────────────────── */}
      <div className="px-6 md:px-10 lg:px-s py-[60px] lg:py-l w-full max-w-[1440px] mx-auto grid grid-cols-10 xl:grid-cols-12 gap-x-4 md:gap-x-6 lg:gap-x-10 gap-y-[60px] lg:gap-y-[120px]">

        {/* Wrapper — 10 cols centered, stacked vertically with 120px gap */}
        <div className="col-span-full xl:col-start-2 xl:col-span-10 flex flex-col gap-[60px] xl:gap-[120px]">

          {/* ── CTA card — forced light mode ───────────────────────── */}
          <motion.div
            className="light-card flex flex-col gap-8 items-center p-6 md:p-16 rounded-[40px] bg-background-surface overflow-hidden"
            initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease }}
          >
            <div className="flex flex-col gap-4 items-center">
              <div className="text-center">
                <h2 className="font-display text-2xl md:text-[64px] md:leading-[72px]">
                  <span className="text-text-secondary">{t("footer.interested")}</span>
                  <br />
                  <span className="text-text-primary">{t("footer.getInTouch")}</span>
                </h2>
              </div>
              <p className="font-body text-m text-text-secondary text-center">
                {t("footer.subtitle")}
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:gap-4 items-center w-full md:w-auto">
              <Button href="mailto:victor.oursin@gmail.com" variant="secondary" size="lg" icon={<MailIcon />} className="w-full md:w-auto">
                {t("navbar.sendEmail")}
              </Button>
              <Button href="https://calendly.com/victor-oursin/30min" target="_blank" rel="noopener noreferrer" variant="primary" size="lg" className="w-full md:w-auto">
                {t("navbar.bookCall")}
              </Button>
            </div>
          </motion.div>

        </div>

        {/* ── Footer info — grid: logo 3 cols | gap 1 col | links 6 cols ── */}
        <motion.div
          className="col-span-full md:contents"
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease, delay: 0.1 }}
        >
          {/* Left — logo mark + made with love */}
          <div className="flex flex-col gap-8 md:col-span-3 xl:col-start-2 pt-[60px] md:pt-0">
            <Logo variant="flat" className="w-8 h-8" />
            <p className="font-body text-s text-text-secondary">
              {t("footer.madeWithLove")}<TypingLocation />
            </p>
          </div>

          {/* Right — three link columns */}
          <div className="grid grid-cols-1 gap-10 min-[426px]:grid-cols-3 min-[426px]:gap-6 md:gap-10 md:col-start-5 md:col-span-6 xl:col-start-6 pt-10 min-[426px]:pt-6 md:pt-4">
            {/* The Good */}
            <div className="flex flex-col gap-6">
              <p className="font-body font-medium text-s text-text-primary">
                {t("footer.theGood")}
              </p>
              <div className="flex flex-col gap-4">
                <Link href="/" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  {t("footer.home")}
                </Link>
                <Link href="/work" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  Work
                </Link>
                <Link href="/services" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  Services
                </Link>
                <Link href="/manifesto" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  Manifesto
                </Link>
              </div>
            </div>

            {/* The Boring */}
            <div className="flex flex-col gap-6">
              <p className="font-body font-medium text-s text-text-primary">
                {t("footer.theBoring")}
              </p>
              <div className="flex flex-col gap-4">
                <a href="#" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  {t("footer.privacy")}
                </a>
                <a href="#" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  {t("footer.legalNotice")}
                </a>
                <a href="#" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  {t("footer.help")}
                </a>
              </div>
            </div>

            {/* The Cool */}
            <div className="flex flex-col gap-6">
              <p className="font-body font-medium text-s text-text-primary">
                {t("footer.theCool")}
              </p>
              <div className="flex flex-col gap-4">
                <a href="https://www.linkedin.com/in/victoroursin/" target="_blank" rel="noopener noreferrer" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/victoroursin/" target="_blank" rel="noopener noreferrer" className="font-body font-medium text-s text-text-secondary hover:text-text-primary transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Copyright bar ─────────────────────────────────────────────── */}
      <div className="w-full bg-background-surface flex items-center justify-center py-4">
        <p className="font-body text-s text-text-secondary">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
