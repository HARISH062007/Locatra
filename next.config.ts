/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.locatra.app',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.11', '192.168.1.11:3000', 'localhost:3000'],
};

export default nextConfig;
