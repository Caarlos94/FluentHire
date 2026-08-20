import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "0" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://accounts.google.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'} https://*.sentry.io wss://api.openai.com https://accounts.google.com https://accounts.googleapis.com`,
              "img-src 'self' data:",
              "font-src 'self' data:",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-src https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "fluenthire",
  project: "fluenthire-web",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
