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
    // Images are served from la.ecactus.co; skip server-side Sharp optimization
    // to avoid CPU/RAM growth and cache ENOENT errors in standalone Docker.
    unoptimized: true,
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
      {
        protocol: 'https',
        hostname: 'la.ecactus.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
