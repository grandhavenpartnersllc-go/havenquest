import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  async redirects() {
    return [
      {
        source: '/texas/market-profiles',
        destination: '/texas/texas-insider',
        permanent: true,
      },
      {
        source: '/texas/market-profiles/:path*',
        destination: '/texas/texas-insider/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
