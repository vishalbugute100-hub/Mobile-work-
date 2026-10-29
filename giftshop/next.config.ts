import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  output: "standalone", // small self-contained server for Docker / VPS hosting (ignored on Vercel)
  images: { formats: ["image/avif", "image/webp"] },
  // Local data lives in ./.data; don't let the dev file-watcher react to it.
  webpack(config) {
    config.watchOptions = { ...config.watchOptions, ignored: ["**/node_modules/**", "**/.git/**", "**/.data/**"] };
    return config;
  },
};

export default config;
