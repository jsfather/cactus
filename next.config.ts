import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit the minimal server bundle used by the production Docker image.
  output: "standalone",
  outputFileTracingIncludes: {
    "/*": ["./drizzle/**/*"],
  },
};

export default nextConfig;
