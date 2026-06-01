import { client } from "@/lib/sanity";
import { faqQuery } from "@/lib/queries";
import FAQ, { type FAQData } from "./FAQ";

export default async function FAQServer() {
  let items: FAQData[] = [];
  try {
    items = await client.fetch<FAQData[]>(faqQuery, {}, { next: { revalidate: 60 } });
  } catch {
    // Sanity unavailable — FAQ falls back to i18n
  }
  return <FAQ sanityItems={items} />;
}
