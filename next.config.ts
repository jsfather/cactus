import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Production images are built on a small VPS. Keeping the worker count low
    // prevents `next build` from exhausting RAM and spending hours swapping.
    cpus: 1,
    // Available since Next.js 15; trades a little build speed for a lower peak
    // Webpack heap, which is preferable for constrained Docker builders.
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    // Avoid an extra TypeScript CLI subprocess when build-time type checking
    // is intentionally disabled below.
    useTypeScriptCli: false,
  },
  typescript: {
    ignoreBuildErrors: true,
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
      {
        protocol: 'https',
        hostname: 'la.ecactus.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
