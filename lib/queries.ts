import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

export const faqQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question_en,
    question_fr,
    answer_en,
    answer_fr
  }
`;

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    hero_headline_en, hero_headline_fr,
    hero_headlineTablet_en, hero_headlineTablet_fr,
    hero_headlineMobile_en, hero_headlineMobile_fr,
    hero_pills_en, hero_pills_fr,
    profileImage,
    about_role_en, about_role_fr,
    about_bio_en, about_bio_fr,
    about_clientsHeading_en, about_clientsHeading_fr,
    about_clientsCaption_en, about_clientsCaption_fr,
    work_eyebrow_en, work_eyebrow_fr,
    work_title_en, work_title_fr,
    work_enumaTitle_en, work_enumaTitle_fr,
    work_mosoTitle_en, work_mosoTitle_fr,
    work_seeMoreMuted_en, work_seeMoreMuted_fr,
    work_seeMoreEmphasis_en, work_seeMoreEmphasis_fr,
    process_title_en, process_title_fr,
    process_steps[]{ title_en, title_fr, body_en, body_fr },
    faq_eyebrow_en, faq_eyebrow_fr,
    faq_title_en, faq_title_fr,
    cta_interested_en, cta_interested_fr,
    cta_getInTouch_en, cta_getInTouch_fr,
    cta_subtitle_en, cta_subtitle_fr
  }
`;

// Localised string accessor — pick `${field}_${lang}` at the call site
export type HomepageData = {
  hero_headline_en?: string; hero_headline_fr?: string;
  hero_headlineTablet_en?: string; hero_headlineTablet_fr?: string;
  hero_headlineMobile_en?: string; hero_headlineMobile_fr?: string;
  hero_pills_en?: string[]; hero_pills_fr?: string[];
  profileImage?: SanityImageSource;
  about_role_en?: string; about_role_fr?: string;
  about_bio_en?: PortableTextBlock[]; about_bio_fr?: PortableTextBlock[];
  about_clientsHeading_en?: string; about_clientsHeading_fr?: string;
  about_clientsCaption_en?: string; about_clientsCaption_fr?: string;
  work_eyebrow_en?: string; work_eyebrow_fr?: string;
  work_title_en?: string; work_title_fr?: string;
  work_enumaTitle_en?: string; work_enumaTitle_fr?: string;
  work_mosoTitle_en?: string; work_mosoTitle_fr?: string;
  work_seeMoreMuted_en?: string; work_seeMoreMuted_fr?: string;
  work_seeMoreEmphasis_en?: string; work_seeMoreEmphasis_fr?: string;
  process_title_en?: string; process_title_fr?: string;
  process_steps?: Array<{ title_en?: string; title_fr?: string; body_en?: string; body_fr?: string }>;
  faq_eyebrow_en?: string; faq_eyebrow_fr?: string;
  faq_title_en?: string; faq_title_fr?: string;
  cta_interested_en?: string; cta_interested_fr?: string;
  cta_getInTouch_en?: string; cta_getInTouch_fr?: string;
  cta_subtitle_en?: string; cta_subtitle_fr?: string;
};

// Pick the localised value `${base}_${lang}` from a homepage doc, or undefined.
export function loc(
  data: HomepageData | null | undefined,
  base: string,
  lang: "en" | "fr"
): string | undefined {
  if (!data) return undefined;
  const v = (data as Record<string, unknown>)[`${base}_${lang}`];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
