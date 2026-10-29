import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  output: "standalone", // small self-contained server for Docker / VPS hosting (ignored on Vercel)
  images: { formats: ["image/avif", "image/webp"] },
};

export default config;
