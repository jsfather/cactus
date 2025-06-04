import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // 🚫 Skip type checking during build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
    ],
  }
};

export default nextConfig;
