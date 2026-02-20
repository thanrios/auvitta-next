import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

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

export default withNextIntl(nextConfig);

