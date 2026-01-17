import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@thesysai/genui-sdk",
    "@crayonai/react-ui",
    "@crayonai/react-core",
  ],
  images: {
    domains: ['res.cloudinary.com']
  }
};

export default nextConfig;
