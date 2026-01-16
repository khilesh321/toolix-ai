import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@thesysai/genui-sdk",
    "@crayonai/react-ui",
    "@crayonai/react-core",
  ],
};

export default nextConfig;
