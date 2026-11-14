import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";
import { urlFor } from "@/sanity/image";

type ImageValue = { asset?: { _ref: string }; alt?: string; caption?: string };

// Dimensions are encoded in Sanity image ids: image-<hash>-<w>x<h>-<ext>
const size = (ref = "") => {
  const m = ref.match(/-(\d+)x(\d+)-/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : {};
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;
      const { width, height } = size(value.asset._ref);
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlFor(value).width(1400).url()} alt={value.alt ?? ""} width={width} height={height} loading="lazy" />
          {value.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?cognixlab\.co/.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

/** Renders a Sanity post body with the same tags the .prose-c styles already cover. */
export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
