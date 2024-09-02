/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      // bodySizeLimit: '300kb',
    },
  },
};

export default nextConfig;
