/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone output for Docker
  async rewrites() {
    // Only use rewrites for local development
    // In production, use direct API URLs via NEXT_PUBLIC_PRODUCTION_URL
    const isProduction = process.env.NODE_ENV === "production";
    const isUAT = process.env.NEXT_PUBLIC_ENV === "uat";

    // Permissions rewrite should work in all environments to avoid CORS
    const permissionsRewrite = {
      source: "/raven-permissions.json",
      destination: "https://raven.horizonos.in/raven-permissions.json",
    };

    if (isProduction || isUAT) {
      // In production/UAT, only return permissions rewrite
      return [permissionsRewrite];
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
      permissionsRewrite,
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
