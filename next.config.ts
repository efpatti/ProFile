import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
 enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
 images: {
  domains: ["logo.dev", "img.logo.dev"],
 },
};

export default withAnalyzer(nextConfig);
