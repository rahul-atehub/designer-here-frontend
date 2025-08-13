/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary
      },
      {
        protocol: "https",
        hostname: "www.bigfootdigital.co.uk", // Your other domain
      },
    ],
  },
};

export default nextConfig;
