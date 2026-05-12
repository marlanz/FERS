import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // port: "",
        // pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // for Google avatars
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub avatar host
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com", // Discord avatar host
      },
    ],
  },
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedEnv: true, //type safe for env variables
    browserDebugInfoInTerminal: true, //show client side log in terminal
  },
};

export default nextConfig;
