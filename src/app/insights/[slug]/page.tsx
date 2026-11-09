import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/content/posts";
import { site } from "@/content/site";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import { BookButton } from "@/components/booking/Booking";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt.slice(0, 155),
    alternates: { canonical: `/insights/${p.slug}` },
    openGraph: { type: "article", images: [p.cover], publishedTime: p.date },
  };
}

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    datePublished: p.date,
    image: `${site.url}${p.cover}`,
    author: { "@type": "Organization", name: "Cognixlab" },
    publisher: { "@id": `${site.url}/#org` },
  };

  return (
    <article>
      <ReadingProgress />
      <header className="pb-12 pt-36 md:pt-44">
        <div className="container-x max-w-[980px]">
          <Reveal as="nav" variant="fade" aria-label="Breadcrumb" className="mb-8 text-[14px] text-[var(--ink-3)]">
            <Link href="/insights" className="link-u hover:text-[var(--ink)]">
              ← Insights
            </Link>
          </Reveal>
          <div className="text-[14px] text-[var(--ink-3)]">
            {p.category} · <time dateTime={p.date}>{fmt(p.date)}</time> · {p.readMins} min read
          </div>
          <SplitHeading as="h1" trigger="load" delay={0.1} stagger={0.03} text={p.title} className="t-d2 mt-4" />
        </div>
      </header>
      <div className="container-x max-w-[1180px]">
        <Reveal variant="clip" className="media-frame aspect-[16/8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt="" />
        </Reveal>
      </div>

      <div className="on-paper mt-[-120px] pb-[var(--section)] pt-[200px]">
        <div className="container-x grid max-w-[1180px] gap-14 lg:grid-cols-[1fr_280px]">
          <div className="prose-c max-w-[68ch]" dangerouslySetInnerHTML={{ __html: p.html }} />
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--r-card)] border border-[var(--paper-line)] bg-[var(--paper-2)] p-6">
              {p.cta === "visibility" ? (
                <>
                  <p className="text-[19px] leading-snug tracking-[-0.015em]">Want to know where you’re invisible?</p>
                  <p className="mt-2 text-[15px] text-[var(--graphite-2)]">We’ll check your search and Maps visibility for free and send you the gaps.</p>
                  <Link href="/contact?intent=visibility" className="btn btn-ghost btn-sm mt-5">
                    Get a visibility check
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-[19px] leading-snug tracking-[-0.015em]">Wondering where AI fits in your operations?</p>
                  <p className="mt-2 text-[15px] text-[var(--graphite-2)]">One call, one workflow, an honest answer.</p>
                  <div className="mt-5">
                    <BookButton className="btn btn-primary btn-sm" source={`post-${p.slug}`} />
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <section className="section" aria-labelledby="more-title">
        <div className="container-x">
          <h2 id="more-title" className="t-d3">
            Keep reading
          </h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/insights/${m.slug}`} className="group block">
                  <div className="media-frame aspect-[16/10]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.cover} alt="" loading="lazy" className="transition-transform duration-700 group-hover:scale-[1.05]" />
                  </div>
                  <h3 className="mt-4 text-[19px] leading-snug tracking-[-0.015em]">
                    <span className="link-u">{m.title}</span>
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
