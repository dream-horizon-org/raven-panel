/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const isUAT = process.env.NEXT_PUBLIC_ENV === "uat";

    const permissionsRewrite = {
      source: "/raven-permissions.json",
      destination: process.env.NEXT_PUBLIC_PERMISSION_S3_URL,
    };

    const getEventsRewriteDestination = () => {
      if (isProduction) {
        return process.env.NEXT_PUBLIC_EVENT_URL_PROD;
      } else if (isUAT) {
        return process.env.NEXT_PUBLIC_EVENT_URL_UAT;
      }
      const envUrl = process.env.NEXT_PUBLIC_EVENT_URL_UAT;
      if (
        envUrl &&
        (envUrl.startsWith("http://") || envUrl.startsWith("https://"))
      ) {
        return envUrl;
      }
    };

    const eventsRewriteDestination = getEventsRewriteDestination();
    const eventsRewrite = eventsRewriteDestination
      ? {
          source: "/v1/events",
          destination: eventsRewriteDestination,
        }
      : null;

    if (isProduction || isUAT) {
      return [permissionsRewrite];
    }

    const rewrites = [permissionsRewrite];

    if (eventsRewrite) {
      rewrites.push(eventsRewrite);
    } else {
      rewrites.push({
        source: "/v1/events",
        // TODO: Need to remove api and add base url once the api is onboard to kong
        destination: "http://thunder-master-uat.dream11.local/v1/events",
      });
    }

    return rewrites;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
