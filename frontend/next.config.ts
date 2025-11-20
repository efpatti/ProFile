import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Polyfill localStorage para SSR
import "./src/lib/localStorage-polyfill";

const withAnalyzer = withBundleAnalyzer({
 enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
 // Docker: standalone output para otimizar imagem
 output: "standalone",

 images: {
  domains: ["logo.dev", "img.logo.dev"],
  remotePatterns: [
   {
    protocol: "http",
    hostname: "localhost",
    port: "9000",
    pathname: "/**",
   },
   {
    protocol: "https",
    hostname: "*.amazonaws.com",
    pathname: "/**",
   },
  ],
 },

 // Experimental features
 experimental: {
  serverActions: {
   bodySizeLimit: "10mb",
  },
 },

 // Webpack config para ignorar avisos de node
 webpack: (config, { isServer }) => {
  if (isServer) {
   // Polyfill localStorage no servidor
   config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
   };
  }
  return config;
 },
};

export default withAnalyzer(nextConfig);
