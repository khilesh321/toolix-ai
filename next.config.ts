import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@thesysai/genui-sdk",
    "@crayonai/react-ui",
    "@crayonai/react-core",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
