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
      {
        source: '/md',
        destination: '/compass/meridian',
        permanent: true,
      },
      {
        source: '/md/login',
        destination: '/compass/meridian/login',
        permanent: true,
      },
      {
        source: '/md/:path*',
        destination: '/compass/meridian/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
