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

const getEventsNamesUrl = (): string | undefined => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return undefined;
  }

  const base = baseUrl.replace(/\/+$/, "");
  return `${base}/thunder/events/list/names`;
};

const getEventDetailsUrl = (eventName: string): string | undefined => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return undefined;
  }

  const base = baseUrl.replace(/\/+$/, "");
  return `${base}/thunder/events/${eventName}`;
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

export const API_BASE_URLS = {
  THUNDER: getBaseUrl(),
  USER_COHORTS: getBaseUrlForCohorts(),
};

export const API_ENDPOINTS = {
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/thunder/ctas`,
  EVENTS_NAMES: getEventsNamesUrl(),
  EVENT_DETAILS: (eventName: string) => getEventDetailsUrl(eventName),
  COHORTS_REALTIME: API_BASE_URLS.USER_COHORTS,
  TEST_JOURNEY_CREATE: `${API_BASE_URLS.THUNDER}/thunder/ctas/test/create`,
};

export const API_AXIOS_CONFIG = {
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
};
