/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'upload.wikimedia.org'],
  },
};

module.exports = nextConfig;
