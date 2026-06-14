import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data:; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
