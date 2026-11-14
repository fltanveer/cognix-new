"use client";

/** Sanity Studio, served by the site itself at /studio. */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { legacyImportTool } from "./src/sanity/legacy/importTool";

export default defineConfig({
  name: "cognixlab",
  title: "Cognixlab",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([S.documentTypeListItem("post").title("Blog posts")]),
    }),
    legacyImportTool({ apiVersion }),
  ],
  document: {
    // Posts are the only document type, so "Create" goes straight to a new post.
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId === "post"),
  },
});
