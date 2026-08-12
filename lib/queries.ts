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

// Resolve an image field to a plain url + intrinsic size, so client components
// can feed next/image without pulling the Sanity client into the browser bundle.
const IMAGE_FIELDS = `
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot
`;
const IMAGE = `{${IMAGE_FIELDS}}`;

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
    about_clientImages[]{ name, ${IMAGE_FIELDS} },
    about_clientsCaption_en, about_clientsCaption_fr,
    work_eyebrow_en, work_eyebrow_fr,
    work_title_en, work_title_fr,
    work_seeMoreMuted_en, work_seeMoreMuted_fr,
    work_seeMoreEmphasis_en, work_seeMoreEmphasis_fr,
    work_seeMoreCta_en, work_seeMoreCta_fr,
    work_seeMoreHref,
    work_seeMoreImage${IMAGE},
    work_seeMoreImageMobile${IMAGE},
    process_title_en, process_title_fr,
    process_steps[]{ title_en, title_fr, body_en, body_fr },
    faq_eyebrow_en, faq_eyebrow_fr,
    faq_title_en, faq_title_fr,
    seo_title,
    seo_description,
    seo_ogImage${IMAGE},
    seo_favicon${IMAGE},
    seo_webclip${IMAGE},
    cta_interested_en, cta_interested_fr,
    cta_getInTouch_en, cta_getInTouch_fr,
    cta_subtitle_en, cta_subtitle_fr
  }
`;

export const projectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(order asc, name asc) {
    "slug": slug.current,
    name,
    logo${IMAGE},
    cardTitle_en, cardTitle_fr,
    showWorkedOn,
    scrollLogos,
    workedOnLogos[]{ name, ${IMAGE_FIELDS} },
    ctaLabel_en, ctaLabel_fr, ctaHref,
    illustrationDesktop${IMAGE},
    illustrationMobile${IMAGE},
    illustrationOpacity,
    posDesktop, posTablet, posMobile,
    stats[]{ label_en, label_fr, value_en, value_fr },
    context{
      eyebrow_en, eyebrow_fr, title_en, title_fr, body_en, body_fr,
      image${IMAGE}
    },
    contributions{
      eyebrow_en, eyebrow_fr, title_en, title_fr,
      items[]{ title_en, title_fr, body_en, body_fr }
    },
    results{
      eyebrow_en, eyebrow_fr, title_en, title_fr, body_en, body_fr,
      ctaLabel_en, ctaLabel_fr, ctaHref, backLabel_en, backLabel_fr
    }
  }
`;

export type SanityImage = {
  url?: string;
  width?: number;
  height?: number;
  hotspot?: { x?: number; y?: number };
} | null;

/** Sanity hotspot → CSS object-position, defaulting to dead centre. */
export const objectPosition = (img?: SanityImage) =>
  `${(img?.hotspot?.x ?? 0.5) * 100}% ${(img?.hotspot?.y ?? 0.5) * 100}%`;

/** One breakpoint's illustration box — raw CSS lengths, or undefined to inherit. */
export type IllustrationPosition = {
  top?: string; right?: string; bottom?: string; left?: string; width?: string;
};

export type ProjectData = {
  slug: string;
  name?: string;
  logo?: SanityImage;
  cardTitle_en?: string; cardTitle_fr?: string;
  showWorkedOn?: boolean;
  scrollLogos?: boolean;
  workedOnLogos?: Array<{ name?: string } & NonNullable<SanityImage>>;
  ctaLabel_en?: string; ctaLabel_fr?: string; ctaHref?: string;
  illustrationDesktop?: SanityImage;
  illustrationMobile?: SanityImage;
  illustrationOpacity?: number;
  posDesktop?: IllustrationPosition;
  posTablet?: IllustrationPosition;
  posMobile?: IllustrationPosition;
  stats?: Array<{ label_en?: string; label_fr?: string; value_en?: string; value_fr?: string }>;
  context?: {
    eyebrow_en?: string; eyebrow_fr?: string;
    title_en?: string; title_fr?: string;
    body_en?: string[]; body_fr?: string[];
    image?: SanityImage;
  };
  contributions?: {
    eyebrow_en?: string; eyebrow_fr?: string;
    title_en?: string; title_fr?: string;
    items?: Array<{ title_en?: string; title_fr?: string; body_en?: string; body_fr?: string }>;
  };
  results?: {
    eyebrow_en?: string; eyebrow_fr?: string;
    title_en?: string; title_fr?: string;
    body_en?: string[]; body_fr?: string[];
    ctaLabel_en?: string; ctaLabel_fr?: string; ctaHref?: string;
    backLabel_en?: string; backLabel_fr?: string;
  };
};

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
  about_clientImages?: Array<{ name?: string } & NonNullable<SanityImage>>;
  about_clientsCaption_en?: string; about_clientsCaption_fr?: string;
  work_eyebrow_en?: string; work_eyebrow_fr?: string;
  work_title_en?: string; work_title_fr?: string;
  work_seeMoreMuted_en?: string; work_seeMoreMuted_fr?: string;
  work_seeMoreEmphasis_en?: string; work_seeMoreEmphasis_fr?: string;
  work_seeMoreCta_en?: string; work_seeMoreCta_fr?: string;
  work_seeMoreHref?: string;
  work_seeMoreImage?: SanityImage;
  work_seeMoreImageMobile?: SanityImage;
  process_title_en?: string; process_title_fr?: string;
  process_steps?: Array<{ title_en?: string; title_fr?: string; body_en?: string; body_fr?: string }>;
  faq_eyebrow_en?: string; faq_eyebrow_fr?: string;
  faq_title_en?: string; faq_title_fr?: string;
  seo_title?: string;
  seo_description?: string;
  seo_ogImage?: SanityImage;
  seo_favicon?: SanityImage;
  seo_webclip?: SanityImage;
  cta_interested_en?: string; cta_interested_fr?: string;
  cta_getInTouch_en?: string; cta_getInTouch_fr?: string;
  cta_subtitle_en?: string; cta_subtitle_fr?: string;
};

const isEmpty = (v: unknown) =>
  v == null ||
  (typeof v === "string" && v.length === 0) ||
  (Array.isArray(v) && v.length === 0);

/**
 * Pick `${base}_${lang}` off any Sanity object, falling back to English.
 * Project content has no i18n backstop, so a half-translated document still
 * has to render something rather than a blank card.
 */
export function pick<T = string>(
  obj: Record<string, unknown> | null | undefined,
  base: string,
  lang: "en" | "fr"
): T | undefined {
  if (!obj) return undefined;
  const own = obj[`${base}_${lang}`];
  if (!isEmpty(own)) return own as T;
  const en = obj[`${base}_en`];
  return isEmpty(en) ? undefined : (en as T);
}

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
