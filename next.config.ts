/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const isUAT = process.env.NEXT_PUBLIC_ENV === "uat";

    const getThunderBaseUrl = () => {
      const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
      if (env === "production") {
        return process.env.NEXT_PUBLIC_BASE_URL_PROD;
      }
      if (env === "uat") {
        return process.env.NEXT_PUBLIC_BASE_URL_UAT;
      }
      return process.env.NEXT_PUBLIC_BASE_URL_PROD;
    };

    const thunderBaseUrl = getThunderBaseUrl();
    let normalizedThunderDestination = null;
    if (thunderBaseUrl) {
      if (
        thunderBaseUrl.startsWith("http://") ||
        thunderBaseUrl.startsWith("https://")
      ) {
        try {
          const url = new URL(thunderBaseUrl);
          normalizedThunderDestination = `${url.protocol}//${url.host}`;
        } catch {
          normalizedThunderDestination = null;
        }
      }
    }

    const rewrites = [];

    if (normalizedThunderDestination) {
      rewrites.push({
        source: "/thunder/events/:path*",
        destination: `${normalizedThunderDestination}/thunder/events/:path*`,
      });
    }

    return rewrites;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
