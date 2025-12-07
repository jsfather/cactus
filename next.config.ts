import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'http',
        hostname: 'kaktos.kanoonbartarha.ir',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kaktos.kanoonbartarha.ir',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
