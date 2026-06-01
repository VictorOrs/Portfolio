import type { ComponentType } from "react";
import EnumaCaseStudy, { EnumaCaseStudyBody } from "./EnumaCaseStudy";
import MosoCaseStudy, { MosoCaseStudyBody } from "./MosoCaseStudy";
import { EnumaIllustration, MosoIllustration } from "./illustrations";

type ProjectEntry = {
  /** Full case study (hero + body) for the standalone /work/[slug] page. */
  CaseStudy: ComponentType;
  /** Case study body only (hero supplied by the overlay's morphing card). */
  Body: ComponentType;
  /** Hero grey-card data, reused from the slider card. */
  logo: { src: string; alt: string };
  illustration: ComponentType;
  titleKey: string;
  external: { labelKey: string; href: string };
};

export const PROJECTS: Record<string, ProjectEntry> = {
  enuma: {
    CaseStudy: EnumaCaseStudy,
    Body: EnumaCaseStudyBody,
    logo: { src: "/img/work/enuma_logo.svg", alt: "enuma" },
    illustration: EnumaIllustration,
    titleKey: "work.enumaTitle",
    external: { labelKey: "work.enumaCta", href: "https://www.enuma-collective.com" },
  },
  moso: {
    CaseStudy: MosoCaseStudy,
    Body: MosoCaseStudyBody,
    logo: { src: "/img/work/moso_logo.svg", alt: "moso" },
    illustration: MosoIllustration,
    titleKey: "work.mosoTitle",
    external: { labelKey: "work.mosoCta", href: "https://www.motionsociety.com" },
  },
};
