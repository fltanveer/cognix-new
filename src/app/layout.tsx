import type { Metadata, Viewport } from "next";
import { Onest, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { BookingProvider } from "@/components/booking/Booking";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { ButtonGlow } from "@/components/motion/ButtonGlow";

const onest = Onest({ variable: "--font-onest", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AI Workflow Automation & Custom Software | Cognixlab, Boston & NYC",
    template: "%s | Cognixlab",
  },
  description:
    "Cognixlab connects disconnected tools and automates manual work for growing companies in Boston and New York, starting with a fixed-price workflow assessment.",
  openGraph: { type: "website", siteName: "Cognixlab", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/cognixlab-mark.png" },
};

export const viewport: Viewport = { themeColor: "#10120d", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/brand/cognixlab-logo.webp`,
      email: site.email,
      sameAs: Object.values(site.social),
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#local`,
      name: site.name,
      url: site.url,
      telephone: site.phone,
      email: site.email,
      parentOrganization: { "@id": `${site.url}/#org` },
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        postalCode: site.address.zip,
        addressCountry: site.address.country,
      },
      areaServed: [
        { "@type": "City", name: "Boston" },
        { "@type": "City", name: "New York" },
      ],
    },
  ],
};

// Marks JS as available so reveal targets can start hidden. If hydration never hands them to GSAP, show them anyway.
const bootScript = `document.documentElement.classList.add('js');setTimeout(function(){document.querySelectorAll('[data-pending]').forEach(function(e){e.removeAttribute('data-pending')})},4000);`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${onest.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <SmoothScroll>
          <BookingProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CursorLabel />
            <ButtonGlow />
          </BookingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
