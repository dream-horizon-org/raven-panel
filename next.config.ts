/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const isUAT = process.env.NEXT_PUBLIC_ENV === "uat";

    const permissionsUrl =
      process.env.NEXT_PUBLIC_PERMISSIONS_URL ||
      `${process.env.NEXT_PUBLIC_BASE_URL_PROD}/raven-permissions.json`;
    const permissionsRewrite = {
      source: "/raven-permissions.json",
      destination: permissionsUrl,
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
    const thunderBaseUrl =
      process.env.NEXT_PUBLIC_THUNDER_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL_PROD;

    if (eventsRewrite) {
      rewrites.push(eventsRewrite);
    } else {
      rewrites.push({
        source: "/v1/events",
        // TODO: Need to remove api and add base url once the api is onboard to kong
        destination: "http://thunder-master-uat.dream11.local/v1/events",
      });
    }

    if (thunderBaseUrl) {
      rewrites.push({
        source: "/thunder/:path*",
        destination: `${thunderBaseUrl}/thunder/:path*`,
      });
    }

    const cohortsBaseUrl = process.env.NEXT_PUBLIC_COHORTS_BASE_URL;
    if (cohortsBaseUrl) {
      rewrites.push({
        source: "/user-cohorts/:path*",
        destination: `${cohortsBaseUrl}/:path*`,
      });
    }

    return rewrites;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
