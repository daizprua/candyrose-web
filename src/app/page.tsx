import type { Metadata } from "next";
import LandingView from "@/components/LandingView";
import { LANDING_CONTENT } from "@/content/landing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: LANDING_CONTENT.seoTitle_es,
  description: LANDING_CONTENT.seoDesc_es,
  openGraph: {
    title: LANDING_CONTENT.seoTitle_es,
    description: LANDING_CONTENT.seoDesc_es,
    images: [LANDING_CONTENT.gallery[0]],
  },
  alternates: {
    canonical: "https://hotelcandyrose.com",
  },
};

export default async function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Hotel Candy Rose",
    description: LANDING_CONTENT.seoDesc_es,
    image: LANDING_CONTENT.gallery[0],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Isla Grande",
      addressRegion: "Colón",
      addressCountry: "PA",
    },
    priceRange: "$$",
    telephone: LANDING_CONTENT.contactPhone,
    url: "https://hotelcandyrose.com",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Piscina", value: true },
      { "@type": "LocationFeatureSpecification", name: "Playa", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wifi Gratis", value: true },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingView initialContent={LANDING_CONTENT} rooms={[]} />
    </>
  );
}
