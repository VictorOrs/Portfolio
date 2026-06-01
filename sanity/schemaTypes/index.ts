import type { SchemaTypeDefinition } from "sanity";
import project from "./project";
import faq from "./faq";
import homepage from "./homepage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homepage, project, faq],
};
