/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double useEffect invocations (chat duplicate message bug)
  swcMinify: true,        // Faster JS minification via SWC
  compress: true,         // Enable gzip/brotli HTTP compression
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    RESTART_COUNT: "1",
  },
  images: {
    formats: ['image/avif', 'image/webp'], // Modern image formats for faster loading
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '**.supabase.co' }, // Allow Supabase storage images
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  experimental: {
    optimizeCss: true, // Inline critical CSS for faster FCP
  },
};

module.exports = nextConfig;
