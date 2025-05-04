/** @type {import('next').NextConfig} */
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Chấp nhận tất cả hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Nếu cần hỗ trợ cả HTTP
      }
    ],
  },
  // Disable ESLint during build
  // Configure Turbopack (Next.js 15 stable version)
  turbopack: {
    // Turbo configuration here if needed
  },
  // Environment variables available at build time
  env: {
    // Add a flag to indicate development mode for auth bypass
    NEXT_PUBLIC_DEV_MODE: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
};

export default nextConfig;
