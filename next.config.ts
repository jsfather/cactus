import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript 5 provides the compiler API; using it also keeps local builds
  // stable on Node versions whose detached CLI output is not captured reliably.
  experimental: {
    useTypeScriptCli: false,
  },
  // Emit the minimal server bundle used by the production Docker image.
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./drizzle/**/*"],
  },
  // Runtime media belongs to the persistent Dokploy volume, never the image.
  outputFileTracingExcludes: {
    "/*": ["./.data/uploads/**/*"],
  },
};

export default nextConfig;
