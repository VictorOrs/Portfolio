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
  ],
  fields: [
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
    ...bilingual("about_clientsCaption", "Clients caption", "about", "text"),

    // ── Work ──────────────────────────────────────────────────────────
    ...bilingual("work_eyebrow", "Eyebrow", "work"),
    ...bilingual("work_title", "Section title", "work"),
    ...bilingual("work_enumaTitle", "Enuma card title", "work", "text"),
    ...bilingual("work_mosoTitle", "Moso card title", "work", "text"),
    ...bilingual("work_seeMoreMuted", "See-more — muted part", "work"),
    ...bilingual("work_seeMoreEmphasis", "See-more — emphasis part", "work", "text"),

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
