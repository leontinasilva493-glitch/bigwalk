/** @type {import('next').NextConfig} */
import('@opennextjs/cloudflare').then((module) => module.initOpenNextCloudflareForDev());

const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
