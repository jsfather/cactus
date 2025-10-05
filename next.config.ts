import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
        pathname: '/user_files/**',
      },
      {
        protocol: 'https',
        hostname: 'kaktos.kanoonbartarha.ir',
        pathname: '/user_files/**',
      },
      {
        protocol: 'http',
        hostname: 'kaktos.kanoonbartarha.ir',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'kaktos.kanoonbartarha.ir',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
