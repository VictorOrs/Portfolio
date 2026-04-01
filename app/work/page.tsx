"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import Work from "@/components/sections/Work";
import SquircleCard from "@/components/ui/SquircleCard";
import { GRADIENT_STOPS } from "@/lib/gradient";

const ease = [0.22, 1, 0.36, 1] as const;

const gradientText = {
  backgroundImage: `linear-gradient(115deg, ${GRADIENT_STOPS})`,
  backgroundSize: "250% 250%",
  backgroundPosition: "var(--grad-x, -50%) var(--grad-y, 50%)",
};

const CATEGORIES = ["All", "Product Design", "Design System", "Brand Identity", "Internal Tooling"];

type ProjectType = "desktop" | "mobile";

const PROJECTS: {
  slug: string;
  title: string;
  description: string;
  image: string;
  type: ProjectType;
  categories: string[];
}[] = [
  {
    slug: "enuma",
    title: "Enuma Collective",
    description: "Lasting partnership as Product & Brand Designer",
    image: "/img/work/enuma_illustration.png",
    type: "desktop",
    categories: ["Product Design", "Design System", "Brand Identity"],
  },
  {
    slug: "moso",
    title: "Moso",
    description: "Continuously shaping Moso's internal product engine",
    image: "/img/work/moso_illustration.png",
    type: "desktop",
    categories: ["Product Design", "Design System", "Internal Tooling"],
  },
];

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.categories.includes(activeFilter));

  return (
    <main className="min-h-screen bg-background-base flex flex-col pt-[80px] overflow-x-clip">
      <Navbar />

      {/* ── Title + slider ───────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 lg:px-s pt-[60px] lg:pt-l w-full max-w-[1440px] mx-auto grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10">
        <div className="col-span-full xl:col-start-2 xl:col-span-10 flex flex-col gap-10 md:gap-16">
          <motion.h1
            className="font-display text-2xl bg-clip-text text-transparent"
            style={gradientText}
            initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease }}
          >
            Our work
          </motion.h1>
        </div>
      </section>

      <Work sliderOnly />

      {/* ── Filters + masonry wall ────────────────────────────────────────── */}
      <section className="px-6 md:px-10 lg:px-s py-[60px] lg:py-l w-full max-w-[1440px] mx-auto grid grid-cols-10 xl:grid-cols-12 gap-4 md:gap-6 lg:gap-10">
        <div className="col-span-full xl:col-start-2 xl:col-span-10 flex flex-col gap-10 md:gap-16">

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.0, ease }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`font-display text-s px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                  activeFilter === cat
                    ? "bg-btn-primary-bg text-btn-primary-text"
                    : "outline outline-2 outline-alpha outline-offset-[-2px] text-text-secondary hover:text-text-primary hover:bg-alpha"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Masonry wall */}
          <div
            className="[columns:1] md:[columns:2] lg:[columns:3] [column-gap:24px] lg:[column-gap:40px]"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                className="mb-6 lg:mb-10 break-inside-avoid"
                initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              >
                <Link href={`/work/${project.slug}`}>
                  <SquircleCard
                    className="relative overflow-hidden bg-background-surface group cursor-pointer"
                    style={{ aspectRatio: project.type === "mobile" ? "3 / 4" : "16 / 10" }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      unoptimized
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-2">
                      <p className="font-display text-l text-white">{project.title}</p>
                      <p className="font-body text-s text-text-secondary">{project.description}</p>
                    </div>
                  </SquircleCard>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
