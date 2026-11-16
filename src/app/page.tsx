import type { Metadata } from "next";
import LandingView from "@/components/LandingView";
import { LANDING_CONTENT } from "@/content/landing";
import { SITE_URL } from "@/lib/base-path";
import { listarTipos } from "@/lib/contabiliClient";
import { fotosDeTipo } from "@/lib/bookingService";

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
    canonical: SITE_URL,
  },
};

export default async function LandingPage() {
  // Fotos de las habitaciones desde el sistema (Hotel › Tipos). Si el sistema
  // no responde, la portada sale igual, con el ícono en lugar de la foto.
  const tipos = await listarTipos().catch(() => []);
  const rooms = tipos.map((t) => ({ id: t.id, code: t.codigo, images: fotosDeTipo(t) }));

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
    url: SITE_URL,
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
      <LandingView initialContent={LANDING_CONTENT} rooms={rooms} />
    </>
  );
}
