/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orgbling.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
