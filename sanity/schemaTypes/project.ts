import { defineField, defineType } from "sanity";

// Helper — bilingual string/text pair
const bilingual = (
  name: string,
  title: string,
  type: "string" | "text" = "string",
  group?: string
) => [
  defineField({ name: `${name}_en`, title: `${title} (EN)`, type, group }),
  defineField({ name: `${name}_fr`, title: `${title} (FR)`, type, group }),
];

// Helper — bilingual array of paragraphs
const paragraphs = (name: string, title: string, group?: string) =>
  (["en", "fr"] as const).map((l) =>
    defineField({
      name: `${name}_${l}`,
      title: `${title} (${l.toUpperCase()})`,
      type: "array",
      of: [{ type: "text" }],
      group,
    })
  );

const POSITION_HINT =
  'CSS length — e.g. "-170px", "0", "48px", "auto", "100%". Leave empty to inherit the next larger breakpoint (desktop defaults to 0, width to auto).';

// Helper — illustration box offsets for one breakpoint
const position = (name: string, title: string, group: string) =>
  defineField({
    name,
    title,
    type: "object",
    group,
    options: { collapsible: true, collapsed: true, columns: 5 },
    fields: ["top", "right", "bottom", "left", "width"].map((side) =>
      defineField({
        name: side,
        title: side[0].toUpperCase() + side.slice(1),
        type: "string",
        description: POSITION_HINT,
      })
    ),
  });

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "illustration", title: "Illustration" },
    { name: "study", title: "Case study" },
  ],
  fields: [
    // ── Identity ──────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name — also used as the logo's alt text.",
      validation: (r) => r.required(),
      group: "card",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Drives the /work/… URL pushed when the card expands.",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
      group: "card",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Slider position — lowest first. The white card always stays last.",
      group: "card",
    }),

    // ── Card ──────────────────────────────────────────────────────────
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Shown above the card title, at 20px tall.",
      group: "card",
    }),
    ...bilingual("cardTitle", "Card title", "text", "card"),
    defineField({
      name: "showWorkedOn",
      title: "Show the “Worked on” logo marquee",
      type: "boolean",
      initialValue: false,
      group: "card",
    }),
    defineField({
      name: "scrollLogos",
      title: "Scroll the “Worked on” logos",
      type: "boolean",
      description: "Off lays them out as a static row — better when there are only a few.",
      initialValue: true,
      group: "card",
      hidden: ({ document }) => !(document as { showWorkedOn?: boolean })?.showWorkedOn,
    }),
    defineField({
      name: "workedOnLogos",
      title: "“Worked on” logos",
      type: "array",
      description: "Client logos scrolling in the marquee, in order. Any colour works — they are recoloured to match the card.",
      group: "card",
      hidden: ({ document }) => !(document as { showWorkedOn?: boolean })?.showWorkedOn,
      // List, not grid: Sanity's grid item menu renders unkeyed children and
      // trips React's key warning — and the list shows each client's name.
      of: [
        {
          type: "image",
          fields: [{ name: "name", title: "Client name", type: "string" }],
          preview: { select: { title: "name", media: "asset" } },
        },
      ],
    }),
    ...bilingual("ctaLabel", "Website button label", "string", "card"),
    defineField({
      name: "ctaHref",
      title: "Website URL",
      type: "url",
      group: "card",
    }),

    // ── Illustration ──────────────────────────────────────────────────
    defineField({
      name: "illustrationDesktop",
      title: "Illustration — desktop / tablet (≥ 768px)",
      type: "image",
      options: { hotspot: true },
      group: "illustration",
    }),
    defineField({
      name: "illustrationMobile",
      title: "Illustration — mobile (< 768px)",
      type: "image",
      options: { hotspot: true },
      group: "illustration",
    }),
    defineField({
      name: "illustrationOpacity",
      title: "Illustration opacity",
      type: "number",
      initialValue: 1,
      validation: (r) => r.min(0).max(1),
      group: "illustration",
    }),
    position("posDesktop", "Position — desktop (≥ 1024px)", "illustration"),
    position("posTablet", "Position — tablet (768 – 1023px)", "illustration"),
    position("posMobile", "Position — mobile (< 768px)", "illustration"),

    // ── Case study — stats strip ──────────────────────────────────────
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "study",
      of: [
        {
          type: "object",
          fields: [
            { name: "label_en", title: "Label (EN)", type: "string" },
            { name: "label_fr", title: "Label (FR)", type: "string" },
            { name: "value_en", title: "Value (EN)", type: "string" },
            { name: "value_fr", title: "Value (FR)", type: "string" },
          ],
          preview: { select: { title: "label_en", subtitle: "value_en" } },
        },
      ],
    }),

    // ── Case study — context ──────────────────────────────────────────
    defineField({
      name: "context",
      title: "Context section",
      type: "object",
      group: "study",
      options: { collapsible: true, collapsed: true },
      fields: [
        ...bilingual("eyebrow", "Eyebrow"),
        ...bilingual("title", "Title", "text"),
        ...paragraphs("body", "Paragraphs"),
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
      ],
    }),

    // ── Case study — contributions ────────────────────────────────────
    defineField({
      name: "contributions",
      title: "Contributions section",
      type: "object",
      group: "study",
      options: { collapsible: true, collapsed: true },
      fields: [
        ...bilingual("eyebrow", "Eyebrow"),
        ...bilingual("title", "Title", "text"),
        defineField({
          name: "items",
          title: "Cards",
          type: "array",
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
      ],
    }),

    // ── Case study — results ──────────────────────────────────────────
    defineField({
      name: "results",
      title: "Results section",
      type: "object",
      group: "study",
      options: { collapsible: true, collapsed: true },
      fields: [
        ...bilingual("eyebrow", "Eyebrow"),
        ...bilingual("title", "Title", "text"),
        ...paragraphs("body", "Paragraphs"),
        ...bilingual("ctaLabel", "Primary button label"),
        defineField({ name: "ctaHref", title: "Primary button URL", type: "url" }),
        ...bilingual("backLabel", "Secondary button label"),
      ],
    }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current", media: "illustrationDesktop" },
  },
});
