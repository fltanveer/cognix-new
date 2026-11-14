import Link from "next/link";
import { BookButton } from "@/components/booking/Booking";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-end overflow-hidden pb-20 pt-40">
      <div className="pointer-events-none absolute inset-0 blueprint" aria-hidden="true" />
      <div className="container-x relative">
        <p className="font-mono text-[13px] text-[var(--ink-3)]">404 · route not connected</p>
        <h1 className="t-d1 mt-4 max-w-[14ch]">This page isn’t wired to anything.</h1>
        <p className="t-lead mt-6 max-w-[48ch] text-[var(--ink-2)]">It may have moved when we rebuilt the site. These will get you back on track.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ghost">
            Home
          </Link>
          <Link href="/work" className="btn btn-ghost">
            Our work
          </Link>
          <BookButton source="404" />
        </div>
      </div>
    </section>
  );
}
