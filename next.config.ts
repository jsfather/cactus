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
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://kaktos.kanoonbartarha.ir/api',
    NEXT_PUBLIC_PASSWORD_AUTH_ENABLED:
      process.env.NEXT_PUBLIC_PASSWORD_AUTH_ENABLED || 'true',
  },
};

export default nextConfig;
