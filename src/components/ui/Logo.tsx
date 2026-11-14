import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className ?? ""}`} aria-label="Cognixlab home">
      {/* White and dark versions stacked; the header shows the one that suits the section beneath it. */}
      <span className="logo-swap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/cognixlab-logo.webp" alt="" width={1000} height={202} className="logo-light h-[22px] w-auto md:h-[24px]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/cognixlab-logo-dark.webp" alt="" width={1000} height={201} className="logo-dark h-[22px] w-auto md:h-[24px]" />
      </span>
    </Link>
  );
}
