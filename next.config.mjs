/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // nodemailer uses dynamic requires that Next/Turbopack can't statically
  // bundle, so it must be left as an external module loaded from node_modules
  // at runtime. Without this it ends up missing from .next/standalone.
  serverExternalPackages: ['nodemailer'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

