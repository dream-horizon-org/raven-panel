const getBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  if (env === "production") {
    return process.env.NEXT_PUBLIC_BASE_URL_PROD;
  }
  if (env === "uat") {
    return process.env.NEXT_PUBLIC_BASE_URL_UAT;
  }

  return process.env.NEXT_PUBLIC_BASE_URL_PROD;
};

const getEventsApiBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  if (env === "production") {
    return process.env.NEXT_PUBLIC_EVENT_URL_PROD;
  } else if (env === "uat") {
    return process.env.NEXT_PUBLIC_EVENT_URL_UAT;
  }
  return undefined;
};

export const EVENTS_API_BASE_URL = getEventsApiBaseUrl();

const getEventDetailsUrl = (eventName: string): string => {
  if (!EVENTS_API_BASE_URL) {
    return `/v1/events/${eventName}`;
  }

  const baseUrl = EVENTS_API_BASE_URL.replace(/\/+$/, "");

  if (baseUrl.includes("/details/names")) {
    return baseUrl.replace("/details/names", `/${eventName}`);
  }
  if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
    try {
      const url = new URL(baseUrl);
      return `${url.protocol}//${url.host}/v1/events/${eventName}`;
    } catch {
      return `/v1/events/${eventName}`;
    }
  }
  if (baseUrl.endsWith("/v1/events")) {
    return `${baseUrl}/${eventName}`;
  }

  return `/v1/events/${eventName}`;
};

const getBaseUrlForCohorts = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  const baseUrl = getBaseUrl();

  let cohortPath: string | undefined;
  if (env === "production") {
    cohortPath = process.env.NEXT_PUBLIC_COHORT_URL_PROD;
  } else if (env === "uat") {
    cohortPath = process.env.NEXT_PUBLIC_COHORT_URL_UAT;
  } else {
    cohortPath = process.env.NEXT_PUBLIC_COHORT_URL_PROD;
  }

  if (!cohortPath) {
    return;
  }

  if (!baseUrl) {
    return;
  }

  return `${baseUrl}${cohortPath}`;
};

const getBaseUrlForEvents = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  if (env !== "production" && env !== "uat") {
    return "";
  }

  const baseUrl = getBaseUrl();
  const eventUrl = getEventsApiBaseUrl();

  if (!eventUrl) {
    return "";
  }

  if (eventUrl.startsWith("http://") || eventUrl.startsWith("https://")) {
    try {
      const url = new URL(eventUrl);
      return `${url.protocol}//${url.host}`;
    } catch {
      return "";
    }
  }

  return `${eventUrl}`;
};

export const API_BASE_URLS = {
  THUNDER: getBaseUrl(),
  USER_COHORTS: getBaseUrlForCohorts(),
  EVENTS: getBaseUrlForEvents(),
};

export const API_ENDPOINTS = {
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/thunder/ctas`,
  EVENTS_NAMES: EVENTS_API_BASE_URL || "/v1/events/details/names",
  EVENT_DETAILS: (eventName: string) => getEventDetailsUrl(eventName),
  COHORTS_REALTIME: API_BASE_URLS.USER_COHORTS,
};

export const API_AXIOS_CONFIG = {
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    user: "admin@example.com",
  },
};
