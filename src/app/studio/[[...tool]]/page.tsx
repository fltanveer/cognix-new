import type { Metadata } from "next";
import { NextStudio, metadata as studioMetadata } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { viewport } from "next-sanity/studio";
// Keeps the tab titled after the site refreshes itself on publish.
export const metadata: Metadata = { ...studioMetadata, title: { absolute: "Cognixlab Studio" } };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
