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
      // Work cards — listed in slider order
      S.listItem()
        .id("project")
        .title("Projects")
        .child(
          S.documentTypeList("project")
            .title("Projects")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      // Remaining document types as regular lists (FAQ)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "homepage" && item.getId() !== "project"
      ),
    ]);
