/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We use App Router only, pages directory is for FSD layer, not Next.js Pages Router
  experimental: {
    // Ensure we're using App Router
  },
}

module.exports = nextConfig

