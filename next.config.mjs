/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig