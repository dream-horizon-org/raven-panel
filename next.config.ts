const getEventsApiBasePath = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  let eventUrl;

  if (env === "production") {
    eventUrl = process.env.NEXT_PUBLIC_EVENT_URL_PROD;
  } else if (env === "uat") {
    eventUrl = process.env.NEXT_PUBLIC_EVENT_URL_UAT;
  } else {
    eventUrl =
      process.env.NEXT_PUBLIC_EVENT_URL_UAT ||
      process.env.NEXT_PUBLIC_EVENT_URL_PROD;
  }

  if (eventUrl) {
    if (eventUrl.startsWith("http://") || eventUrl.startsWith("https://")) {
      try {
        const url = new URL(eventUrl);
        const pathname = url.pathname.replace(/\/+$/, "");
        if (pathname.includes("/v1/events")) {
          const v1EventsIndex = pathname.indexOf("/v1/events");
          return pathname.substring(0, v1EventsIndex + 10);
        }
        return "/v1/events";
      } catch {
        return "/v1/events";
      }
    } else if (eventUrl.startsWith("/")) {
      const path = eventUrl.replace(/\/+$/, "");
      if (path.includes("/v1/events")) {
        const v1EventsIndex = path.indexOf("/v1/events");
        return path.substring(0, v1EventsIndex + 10);
      }
      return "/v1/events";
    }
  }

  return "/v1/events";
};

const EVENTS_API_BASE_PATH = getEventsApiBasePath();

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
    let normalizedDestination = null;
    if (eventsRewriteDestination) {
      if (
        eventsRewriteDestination.startsWith("http://") ||
        eventsRewriteDestination.startsWith("https://")
      ) {
        try {
          const url = new URL(eventsRewriteDestination);
          normalizedDestination = `${url.protocol}//${url.host}`;
        } catch {
          normalizedDestination = null;
        }
      }
    }

    const eventsRewrite = normalizedDestination
      ? {
          source: `${EVENTS_API_BASE_PATH}/:path*`,
          destination: `${normalizedDestination}${EVENTS_API_BASE_PATH}/:path*`,
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
        source: "/v1/events/:path*",
        // change this to kong once api is onboarded
        destination: "http://thunder-master-uat.dream11.local/v1/events/:path*",
      });
    }

    return rewrites;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
