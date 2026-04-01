import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question_en",
      title: "Question (EN)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "question_fr",
      title: "Question (FR)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer_en",
      title: "Answer (EN)",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer_fr",
      title: "Answer (FR)",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question_en" },
  },
});
