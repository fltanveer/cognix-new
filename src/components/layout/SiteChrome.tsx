"use client";

import { usePathname } from "next/navigation";

/** Header, footer and cursor effects for the site; the Sanity Studio at /studio gets the full screen instead. */
export function SiteChrome({ header, footer, extras, children }: { header: React.ReactNode; footer: React.ReactNode; extras: React.ReactNode; children: React.ReactNode }) {
  if (usePathname()?.startsWith("/studio")) return <>{children}</>;
  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
      {extras}
    </>
  );
}
