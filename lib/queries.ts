import { groq } from "next-sanity";

export const faqQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question_en,
    question_fr,
    answer_en,
    answer_fr
  }
`;
