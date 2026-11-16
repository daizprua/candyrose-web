import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // La web vive en https://hotelcandyrose.devstack.agency/web (ver src/lib/base-path.ts).
  basePath: "/web",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.hotelcandyrose.contabili.app" },
      { protocol: "https", hostname: "s3.hotelcandyrose.devstack.agency" },
    ],
  },
};

export default nextConfig;
