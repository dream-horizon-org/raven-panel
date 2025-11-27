/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only use rewrites for local development
    // In production, use direct API URLs via NEXT_PUBLIC_PRODUCTION_URL
    const isProduction = process.env.NODE_ENV === "production";
    const isUAT = process.env.NEXT_PUBLIC_ENV === "uat";

    if (isProduction || isUAT) {
      // In production/UAT, don't use rewrites - use direct API URLs
      return [];
    }

    // Development rewrites to local/internal services
    return [
      {
        source: "/thunder/:path*",
        destination: "http://thunder-master.dream11.local/thunder/:path*",
      },
      {
        source: "/thunder-master-uat/:path*",
        destination: "http://thunder-master-uat.dream11.local/thunder/:path*",
      },
      {
        source: "/concord/:path*",
        destination: "http://concord.dream11.local/:path*",
      },
      {
        source: "/user-cohorts/:path*",
        destination: "http://user-cohorts.dream11.local/:path*",
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
