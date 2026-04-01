import { groq } from "next-sanity";

export const faqQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer
  }
`;
