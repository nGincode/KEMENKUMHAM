/** @type {import('next').NextConfig} */

const dotenv = require("dotenv").config();
const hostname = dotenv.parsed.HOSTNAME;
const port = dotenv.parsed.PORT;
const URL = dotenv.parsed.URL;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // images: {
  //   domains: ["app.easyrubero.com"],
  // },
  env: {
    HOSTNAME: hostname,
    PORT: port,
    URL: URL,
  },
};

module.exports = nextConfig;
