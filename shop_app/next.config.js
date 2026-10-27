/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  // Разрешаем доступ к dev-ресурсам (HMR) с другого IP в локальной сети
  allowedDevOrigins: ['192.168.1.5'],
  // sassOptions: {
  //   includePaths: [path.join(__dirname, "styles")],
  //   additionalData: `@use "./base.scss" as *;`, // вместо prependData/@import
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;