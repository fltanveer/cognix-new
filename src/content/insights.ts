import { defineQuery, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { projectId } from "@/sanity/env";
import { urlFor } from "@/sanity/image";
import { posts as legacyPosts } from "./posts";

/** Insights posts come from Sanity. Until the first posts are imported, the old WordPress copies are shown. */

export type PostCard = { slug: string; title: string; date: string; category: string; cover: string; thumb: string; excerpt: string; readMins: number };
export type PostFull = PostCard & {
  cta: "visibility" | "review";
  coverAlt: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: PortableTextBlock[];
  html?: string;
};

type SanityImage = { asset?: { _ref: string }; alt?: string };
type RawCard = { slug: string; title: string; date: string; category: string; cover: SanityImage; excerpt: string; readMins?: number; chars?: number };
type RawFull = RawCard & { cta?: "visibility" | "review"; seoTitle?: string; seoDescription?: string; body: PortableTextBlock[] };

const CARD = `"slug": slug.current, title, "date": publishedAt, category, cover, excerpt, readMins, "chars": length(pt::text(body))`;
const LIVE = `_type == "post" && defined(slug.current) && defined(publishedAt)`;
const POSTS_QUERY = defineQuery(`*[${LIVE}] | order(publishedAt desc, _createdAt desc) { ${CARD} }`);
const POST_QUERY = defineQuery(`*[${LIVE} && slug.current == $slug][0] { ${CARD}, cta, seoTitle, seoDescription, body }`);
const SITEMAP_QUERY = defineQuery(`*[${LIVE}] | order(publishedAt desc) { "slug": slug.current, "date": coalesce(_updatedAt, publishedAt) }`);

const configured = projectId !== "unconfigured";
const minutes = (p: RawCard) => p.readMins || Math.max(1, Math.round((p.chars ?? 0) / 1400));
const img = (i: SanityImage | undefined, w: number) => (i?.asset ? urlFor(i).width(w).url() : "");

const toCard = (p: RawCard): PostCard => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  category: p.category,
  cover: img(p.cover, 1800),
  thumb: img(p.cover, 900),
  excerpt: p.excerpt,
  readMins: minutes(p),
});

const legacyCard = (p: (typeof legacyPosts)[number]): PostCard => ({
  slug: p.slug, title: p.title, date: p.date, category: p.category, cover: p.cover, thumb: p.cover, excerpt: p.excerpt, readMins: p.readMins,
});

async function fetchCards(): Promise<RawCard[]> {
  if (!configured) return [];
  try {
    const { data } = await sanityFetch({ query: POSTS_QUERY, perspective: "published", stega: false });
    return (data as RawCard[]) ?? [];
  } catch (e) {
    console.error("Sanity posts query failed", e);
    return [];
  }
}

export async function getPosts(): Promise<PostCard[]> {
  const raw = await fetchCards();
  return raw.length ? raw.map(toCard) : legacyPosts.map(legacyCard);
}

export async function getPost(slug: string): Promise<PostFull | null> {
  if (configured) {
    try {
      const { data } = await sanityFetch({ query: POST_QUERY, params: { slug }, perspective: "published", stega: false });
      const p = data as RawFull | null;
      if (p) return { ...toCard(p), cta: p.cta ?? "review", coverAlt: p.cover?.alt ?? "", seoTitle: p.seoTitle, seoDescription: p.seoDescription, body: p.body };
      if ((await fetchCards()).length) return null;
    } catch (e) {
      console.error("Sanity post query failed", e);
    }
  }
  const l = legacyPosts.find((x) => x.slug === slug);
  return l ? { ...legacyCard(l), cta: l.cta, coverAlt: "", html: l.html } : null;
}

/** For the sitemap: a plain cached fetch, refreshed hourly. */
export async function getSitemapPosts(): Promise<{ slug: string; date: string }[]> {
  if (configured) {
    try {
      const rows = await client.fetch<{ slug: string; date: string }[]>(SITEMAP_QUERY, {}, { next: { revalidate: 3600 } });
      if (rows.length) return rows;
    } catch (e) {
      console.error("Sanity sitemap query failed", e);
    }
  }
  return legacyPosts.map((p) => ({ slug: p.slug, date: p.date }));
}
