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

  return (
    process.env.NEXT_PUBLIC_EVENT_URL_UAT ||
    process.env.NEXT_PUBLIC_EVENT_URL_PROD ||
    undefined
  );
};

export const EVENTS_API_BASE_URL = getEventsApiBaseUrl();

const getEventDetailsUrl = (eventName: string): string | undefined => {
  if (!EVENTS_API_BASE_URL) {
    return undefined;
  }

  const eventUrl = EVENTS_API_BASE_URL.replace(/\/+$/, "");

  if (eventUrl.startsWith("http://") || eventUrl.startsWith("https://")) {
    if (eventUrl.includes("/list/names")) {
      return eventUrl.replace("/list/names", `/${eventName}`);
    }
    try {
      const url = new URL(eventUrl);
      return `${url.protocol}//${url.host}/thunder/events/${eventName}`;
    } catch {
      return undefined;
    }
  }

  let eventPath: string;
  if (eventUrl.includes("/list/names")) {
    eventPath = eventUrl.replace("/list/names", `/${eventName}`);
  } else {
    eventPath = `thunder/events/${eventName}`;
  }

  const baseUrl = API_BASE_URLS.THUNDER;
  if (!baseUrl) {
    return undefined;
  }

  const base = baseUrl.replace(/\/+$/, "");
  const path = eventPath.startsWith("/") ? eventPath : `/${eventPath}`;

  return `${base}${path}`;
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

const getEventsNamesUrl = (): string | undefined => {
  const eventUrl = EVENTS_API_BASE_URL;

  if (!eventUrl) {
    return undefined;
  }

  if (eventUrl.startsWith("http://") || eventUrl.startsWith("https://")) {
    return eventUrl;
  }

  const baseUrl = API_BASE_URLS.THUNDER;
  if (!baseUrl) {
    return undefined;
  }

  const base = baseUrl.replace(/\/+$/, "");
  const path = eventUrl.startsWith("/") ? eventUrl : `/${eventUrl}`;

  return `${base}${path}`;
};

export const API_ENDPOINTS = {
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/thunder/ctas`,
  EVENTS_NAMES: getEventsNamesUrl(),
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
