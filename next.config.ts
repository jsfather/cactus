import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
