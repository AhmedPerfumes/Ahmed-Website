/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'phpstack-667016-4904984.cloudwaysapps.com',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
          }
        ],
      },
      productionBrowserSourceMaps: true
};

export default nextConfig;
