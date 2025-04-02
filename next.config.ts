import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["assets.aceternity.com"],
    loader: 'custom',
    loaderFile: './supabase-image-loader.ts',
  },
};

export default nextConfig;
