import { PageHero } from "@/components/PageHero";

export function LegalPage({ title, lead, updated, children }: { title: string; lead?: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero art="legal" title={title} lead={lead} crumbs={[{ label: "Home", href: "/" }]} />
      <section className="on-paper section">
        <div className="container-x max-w-[860px]">
          <p className="text-[14px] text-[var(--graphite-2)]">Last updated {updated}</p>
          <div className="prose-c mt-8">{children}</div>
        </div>
      </section>
    </>
  );
}
