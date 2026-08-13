import { defineField, defineType } from "sanity";

// Helper — bilingual string/text pair in a given group
const bilingual = (
  name: string,
  title: string,
  group: string,
  type: "string" | "text" = "string"
) => [
  defineField({ name: `${name}_en`, title: `${title} (EN)`, type, group }),
  defineField({ name: `${name}_fr`, title: `${title} (FR)`, type, group }),
];

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "about", title: "About" },
    { name: "work", title: "Work" },
    { name: "process", title: "Process" },
    { name: "faq", title: "FAQ" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO & sharing" },
  ],
  fields: [
    // ── SEO / social ──────────────────────────────────────────────────
    // Not bilingual: Next builds these on the server, before the visitor has
    // picked a language, and the document is served as <html lang="en">.
    defineField({
      name: "seo_title",
      title: "Browser tab & search title",
      type: "string",
      description: "Shown in the tab, in bookmarks, in search results and when the link is shared.",
      group: "seo",
    }),
    defineField({
      name: "seo_description",
      title: "Description",
      type: "text",
      description: "The sentence under the title in search results and link previews. Around 150 characters.",
      group: "seo",
    }),
    defineField({
      name: "seo_ogImage",
      title: "Sharing image (OpenGraph)",
      type: "image",
      description: "The picture shown when the link is posted. 1200 × 630 px.",
      group: "seo",
    }),
    defineField({
      name: "seo_favicon",
      title: "Favicon",
      type: "image",
      description: "The little icon in the browser tab. A square PNG or SVG, 512 × 512 px.",
      group: "seo",
    }),
    defineField({
      name: "seo_webclip",
      title: "Webclip (iOS home screen)",
      type: "image",
      description: "Icon used when the site is added to an iPhone home screen. Square, 180 × 180 px. Falls back to the favicon.",
      group: "seo",
    }),

    // ── Hero ──────────────────────────────────────────────────────────
    ...bilingual("hero_headline", "Headline — desktop", "hero", "text"),
    ...bilingual("hero_headlineTablet", "Headline — tablet", "hero", "text"),
    ...bilingual("hero_headlineMobile", "Headline — mobile", "hero", "text"),
    defineField({
      name: "hero_pills_en",
      title: "Rotating pills (EN)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "hero",
    }),
    defineField({
      name: "hero_pills_fr",
      title: "Rotating pills (FR)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "hero",
    }),

    // ── About / WhoIAm ────────────────────────────────────────────────
    defineField({
      name: "profileImage",
      title: "Profile photo",
      type: "image",
      options: { hotspot: true },
      group: "about",
    }),
    ...bilingual("about_role", "Role / subtitle", "about"),
    defineField({
      name: "about_bio_en",
      title: "Bio (EN)",
      type: "array",
      of: [{ type: "block", marks: { decorators: [{ title: "Bold", value: "strong" }], annotations: [] }, lists: [], styles: [{ title: "Normal", value: "normal" }] }],
      group: "about",
    }),
    defineField({
      name: "about_bio_fr",
      title: "Bio (FR)",
      type: "array",
      of: [{ type: "block", marks: { decorators: [{ title: "Bold", value: "strong" }], annotations: [] }, lists: [], styles: [{ title: "Normal", value: "normal" }] }],
      group: "about",
    }),
    ...bilingual("about_clientsHeading", "Clients heading", "about", "text"),
    defineField({
      name: "about_clientImages",
      title: "Client images",
      type: "array",
      description:
        "Shown in the clients card. The first image sits in the left column, the other two stack in the right one. Three at most — the card has a fixed height and a fourth would be clipped. Falls back to the bundled artwork when empty.",
      group: "about",
      validation: (r) => r.max(3),
      of: [
        {
          type: "image",
          fields: [{ name: "name", title: "Client name", type: "string" }],
          preview: { select: { title: "name", media: "asset" } },
        },
      ],
    }),
    ...bilingual("about_clientsCaption", "Clients caption", "about", "text"),

    // ── Work ──────────────────────────────────────────────────────────
    // The cards themselves live in their own "Project" documents — this group
    // only covers the section header and the white card that closes the slider.
    ...bilingual("work_eyebrow", "Eyebrow", "work"),
    ...bilingual("work_title", "Section title", "work"),
    ...bilingual("work_seeMoreMuted", "See-more — muted part", "work"),
    ...bilingual("work_seeMoreEmphasis", "See-more — emphasis part", "work", "text"),
    ...bilingual("work_seeMoreCta", "See-more — button label", "work"),
    defineField({
      name: "work_seeMoreHref",
      title: "See-more — button URL",
      type: "url",
      group: "work",
    }),
    defineField({
      name: "work_seeMoreImage",
      title: "See-more — image (≥ 426px)",
      type: "image",
      description: "Falls back to the bundled artwork when empty.",
      group: "work",
    }),
    defineField({
      name: "work_seeMoreImageMobile",
      title: "See-more — image (< 426px)",
      type: "image",
      description: "Falls back to the bundled artwork when empty.",
      group: "work",
    }),

    // ── Process ───────────────────────────────────────────────────────
    ...bilingual("process_title", "Section title", "process", "text"),
    defineField({
      name: "process_steps",
      title: "Steps",
      type: "array",
      group: "process",
      of: [
        {
          type: "object",
          fields: [
            { name: "title_en", title: "Title (EN)", type: "string" },
            { name: "title_fr", title: "Title (FR)", type: "string" },
            { name: "body_en", title: "Body (EN)", type: "text" },
            { name: "body_fr", title: "Body (FR)", type: "text" },
          ],
          preview: { select: { title: "title_en" } },
        },
      ],
    }),

    // ── FAQ ───────────────────────────────────────────────────────────
    ...bilingual("faq_eyebrow", "Eyebrow", "faq"),
    ...bilingual("faq_title", "Section title", "faq"),

    // ── CTA (Footer) ──────────────────────────────────────────────────
    ...bilingual("cta_interested", "Muted line", "cta"),
    ...bilingual("cta_getInTouch", "Emphasis line", "cta"),
    ...bilingual("cta_subtitle", "Subtitle", "cta"),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
