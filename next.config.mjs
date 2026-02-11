/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    // Disarankan menggunakan remotePatterns daripada domains (deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.easyrubero.com",
      },
    ],
  },

  env: {
    HOSTNAME: process.env.HOSTNAME,
    PORT: process.env.PORT,
    URL: process.env.URL,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "some-ui-library"],
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
    );
    return config;
  },
};

export default nextConfig;
