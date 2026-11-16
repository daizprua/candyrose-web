import type { NextConfig } from "next";

// Cabeceras de seguridad para toda la web pública.
//
// CSP: solo directivas que no restringen contenido (frame-ancestors, base-uri,
// object-src). Una CSP de contenido (img-src/script-src) podría romper
// imágenes que el CMS apunte a otros dominios (Unsplash, MinIO viejo/nuevo) y
// los scripts inline que Next inyecta sin nonce; se deja para cuando se pueda
// probar primero en modo Report-Only.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // La web vive en https://hotelcandyrose.devstack.agency/web (ver src/lib/base-path.ts).
  basePath: "/web",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.hotelcandyrose.contabili.app" },
      { protocol: "https", hostname: "s3.hotelcandyrose.devstack.agency" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
