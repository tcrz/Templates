import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent lockfile.
  turbopack: {
    root: path.resolve(__dirname),
  },
  compiler: {
      removeConsole: process.env.NODE_ENV === "production" ? {
        exclude: ["error", "warn"],
      } : false,
    },
    // images: {
    //   formats: ['image/avif', 'image/webp'],
    //   deviceSizes: [640, 750, 828, 1080, 1200],
    //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    //   remotePatterns: [
    //     {
    //       protocol: 'https',
    //       hostname: 'nyc3.digitaloceanspaces.com',
    //       pathname: '/recruit.disk/photo/**',
    //     },
    //   ],
    // },
};

export default nextConfig;
