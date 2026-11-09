"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Image inside a frame that drifts against scroll. The frame clips, the image is oversized by `amount`. */
export function ParallaxImage({
  src,
  alt,
  className,
  amount = 12,
  priority,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  amount?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !img.current) return;
      gsap.fromTo(
        img.current,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: frame }
  );

  return (
    <div ref={frame} className={`media-frame ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={img}
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ height: `${100 + amount}%`, marginTop: `-${amount / 2}%` }}
      />
    </div>
  );
}
