/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  transpilePackages: ["@love-letter/shared"],
};
