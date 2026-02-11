/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "app.easyrubero.com" }],
  },
  env: {
    HOSTNAME: process.env.HOSTNAME,
    PORT: process.env.PORT,
    URL: process.env.URL,
  },
};

export default nextConfig;
