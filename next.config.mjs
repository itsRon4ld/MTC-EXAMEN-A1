/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  serverExternalPackages: ['elysia']
};

export default nextConfig;
