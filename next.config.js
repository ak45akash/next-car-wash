/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'upload.wikimedia.org', 'ytxfzihqancpeseyznpa.supabase.co'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  trailingSlash: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard',
      },
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
      },
      {
        source: '/login',
        destination: '/login',
      },
      {
        source: '/signup',
        destination: '/signup',
      },
      {
        source: '/forgot-password',
        destination: '/forgot-password',
      },
      {
        source: '/reset-password',
        destination: '/reset-password',
      },
    ];
  },
};

module.exports = nextConfig;
