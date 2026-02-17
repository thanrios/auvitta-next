import type { NextConfig } from "next";

const allowedOrigins =
  process.env.CORS_ALLOWED_ORIGINS
    ?.split(",")
    .map(origin => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedOrigins,

  devIndicators: {
    position: "bottom-left",
  },
};

export default nextConfig;

