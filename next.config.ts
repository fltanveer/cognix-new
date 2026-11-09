import type { NextConfig } from "next";
import { posts } from "./src/content/posts";

// 301s from the old WordPress URLs so existing links and rankings carry over.
const caseMap: Record<string, string> = {
  "auto-inspect": "auto-inspect",
  "mind-care": "mindcare",
  "muscle-locker": "muscle-locker",
  "jvs-management": "jvs-management",
  "google-rankings-in-4-months": "dr-kibria-seo",
  "social-media-visibility-growth": "phc-aesthetic",
};

const nextConfig: NextConfig = {
  // Lets a production build run beside `next dev` without overwriting its .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/projects", destination: "/case-studies", permanent: true },
      ...Object.entries(caseMap).flatMap(([from, to]) => [
        { source: `/projects/${from}`, destination: `/case-studies/${to}`, permanent: true },
        { source: `/project/${from}`, destination: `/case-studies/${to}`, permanent: true },
      ]),
      { source: "/ai-transformation", destination: "/pricing", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      ...posts.map((p) => ({ source: `/${p.oldSlug}`, destination: `/insights/${p.slug}`, permanent: true })),
      { source: "/category/:path*", destination: "/insights", permanent: true },
      { source: "/tag/:path*", destination: "/insights", permanent: true },
      { source: "/author/:path*", destination: "/about", permanent: true },
      { source: "/all-services/:path*", destination: "/services", permanent: true },
      { source: "/all-services", destination: "/services", permanent: true },
      { source: "/landing-page", destination: "/", permanent: true },
      { source: "/home-cloned-28", destination: "/", permanent: true },
      { source: "/thank-you", destination: "/contact", permanent: true },
      { source: "/wp-content/uploads/2026/03/Agentic_Enterprise_Blueprint.pdf", destination: "/guides/agentic-enterprise-blueprint.pdf", permanent: true },
    ];
  },
};

export default nextConfig;
