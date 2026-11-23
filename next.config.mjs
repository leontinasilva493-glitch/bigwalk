import { prunedRedirects } from './lib/pruned-redirects.mjs';

/** @type {import('next').NextConfig} */
import('@opennextjs/cloudflare').then((module) => module.initOpenNextCloudflareForDev());

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return prunedRedirects;
  },
};

export default nextConfig;
