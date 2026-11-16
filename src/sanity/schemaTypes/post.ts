import { defineArrayMember, defineField, defineType } from "sanity";

export const CATEGORIES = ["AI & Automation", "Product & UX", "SEO & Growth", "Software & Engineering", "Company news"];

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required().max(120) }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      description: "The address of the post: cognixlab.co/insights/…",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "date",
      group: "content",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "content",
      options: { list: CATEGORIES },
      initialValue: "AI & Automation",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe what the image shows, for screen readers and search.", validation: (r) => r.warning("Add alt text so the image is described for screen readers and Google.").required() })],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "One or two sentences shown on the Insights page and in search results.",
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                title: "Link",
                fields: [defineField({ name: "href", type: "url", validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }) })],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", description: "Describe what the image shows, for screen readers and search.", validation: (r) => r.warning("Add alt text so the image is described for screen readers and Google.").required() }),
            defineField({ name: "caption", type: "string" }),
          ],
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cta",
      title: "Sidebar call to action",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Free visibility check (SEO posts)", value: "visibility" },
          { title: "Book a call (AI & operations posts)", value: "review" },
        ],
        layout: "radio",
      },
      initialValue: "review",
    }),
    defineField({
      name: "readMins",
      title: "Reading time (minutes)",
      type: "number",
      group: "content",
      description: "Leave empty to work it out from the text.",
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo", description: "Defaults to the post title.", validation: (r) => r.max(70) }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3, group: "seo", description: "Defaults to the excerpt.", validation: (r) => r.max(160) }),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "publishedAt", category: "category", media: "cover" },
    prepare: ({ title, date, category, media }) => ({ title, subtitle: [category, date].filter(Boolean).join(" · "), media }),
  },
});
