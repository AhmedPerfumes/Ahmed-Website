/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'phpstack-667016-4904984.cloudwaysapps.com',
            port: '',
          },
        ],
      },
      productionBrowserSourceMaps: true,
};

export default nextConfig;
