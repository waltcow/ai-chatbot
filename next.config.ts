import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      // Add your own image domains here if needed
    ],
  },
  output: 'standalone',
};

export default nextConfig;
