import type { SchemaTypeDefinition } from "sanity";
import project from "./project";
import faq from "./faq";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, faq],
};
