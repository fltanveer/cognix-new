import type { MetadataRoute } from "next";
import { site, services, cases, industries } from "@/content/site";
import { posts } from "@/content/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const stat = ["", "/services", "/work", "/industries", "/pricing", "/about", "/insights", "/contact", "/privacy", "/terms", "/data-handling", "/accessibility"];
  return [
    ...stat.map((p) => ({ url: u(p), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: u(`/services/${s.slug}`), priority: 0.8 })),
    ...industries.map((s) => ({ url: u(`/industries/${s.slug}`), priority: 0.7 })),
    ...cases.map((c) => ({ url: u(`/work/${c.slug}`), priority: c.flagship ? 0.8 : 0.5 })),
    ...posts.map((p) => ({ url: u(`/insights/${p.slug}`), lastModified: p.date, priority: 0.6 })),
  ];
}
