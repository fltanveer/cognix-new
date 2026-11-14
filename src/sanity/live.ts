import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * `sanityFetch` caches by content tag; `<SanityLive />` (in the root layout) refreshes those tags the moment a
 * post is published. The Studio runs inside this site, so publishing from /studio triggers it straight away.
 * The 5-minute revalidate is a safety net for edits made while nobody has the site open.
 */
export const { sanityFetch, SanityLive } = defineLive({ client, fetchOptions: { revalidate: 300 } });
