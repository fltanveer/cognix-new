import { defineQuery, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { urlFor } from "@/sanity/image";

/**
 * Insights posts, written in the Studio at /studio.
 * Query errors are not caught on purpose: if Sanity can't be reached, Next.js keeps serving the last good page.
 */

export type PostCard = { slug: string; title: string; date: string; category: string; cover: string; thumb: string; excerpt: string; readMins: number };
export type PostFull = PostCard & {
  cta: "visibility" | "review";
  coverAlt: string;
  seoTitle?: string;
  seoDescription?: string;
  body: PortableTextBlock[];
};

type SanityImage = { asset?: { _ref: string }; alt?: string };
type RawCard = { slug: string; title: string; date: string; category: string; cover: SanityImage; excerpt: string; readMins?: number; chars?: number };
type RawFull = RawCard & { cta?: "visibility" | "review"; seoTitle?: string; seoDescription?: string; body?: PortableTextBlock[] };

const CARD = `"slug": slug.current, title, "date": publishedAt, category, cover, excerpt, readMins, "chars": length(pt::text(body))`;
const LIVE = `_type == "post" && defined(slug.current) && defined(publishedAt)`;
const POSTS_QUERY = defineQuery(`*[${LIVE}] | order(publishedAt desc, _createdAt desc) { ${CARD} }`);
const POST_QUERY = defineQuery(`*[${LIVE} && slug.current == $slug][0] { ${CARD}, cta, seoTitle, seoDescription, body }`);
const SITEMAP_QUERY = defineQuery(`*[${LIVE}] | order(publishedAt desc) { "slug": slug.current, "date": coalesce(_updatedAt, publishedAt) }`);

const minutes = (p: RawCard) => p.readMins || Math.max(1, Math.round((p.chars ?? 0) / 1400));
const img = (i: SanityImage | undefined, w: number) => (i?.asset ? urlFor(i).width(w).url() : "");

const toCard = (p: RawCard): PostCard => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  category: p.category,
  cover: img(p.cover, 1800),
  thumb: img(p.cover, 900),
  excerpt: p.excerpt ?? "",
  readMins: minutes(p),
});

export async function getPosts(): Promise<PostCard[]> {
  const { data } = await sanityFetch({ query: POSTS_QUERY, perspective: "published", stega: false });
  return ((data as RawCard[]) ?? []).map(toCard);
}

export async function getPost(slug: string): Promise<PostFull | null> {
  const { data } = await sanityFetch({ query: POST_QUERY, params: { slug }, perspective: "published", stega: false });
  const p = data as RawFull | null;
  if (!p) return null;
  return { ...toCard(p), cta: p.cta ?? "review", coverAlt: p.cover?.alt || `Cover image for “${p.title}”`, seoTitle: p.seoTitle, seoDescription: p.seoDescription, body: p.body ?? [] };
}

/** For the sitemap: a plain cached fetch, refreshed hourly. */
export async function getSitemapPosts(): Promise<{ slug: string; date: string }[]> {
  return client.fetch<{ slug: string; date: string }[]>(SITEMAP_QUERY, {}, { next: { revalidate: 3600 } });
}
