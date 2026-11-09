import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className ?? ""}`} aria-label="Cognixlab home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/cognixlab-logo.webp" alt="" width={1000} height={202} className="h-[22px] w-auto md:h-[24px]" />
    </Link>
  );
}
