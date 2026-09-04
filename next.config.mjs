/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // Vercel: Prisma needs output: 'standalone' for edge compatibility
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;
