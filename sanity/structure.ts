import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Homepage — singleton (one editable document)
      S.listItem()
        .id("homepage")
        .title("Homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.divider(),
      // Remaining document types as regular lists (FAQ, Project)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "homepage"
      ),
    ]);
