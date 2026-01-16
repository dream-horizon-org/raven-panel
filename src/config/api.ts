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
  const baseUrl = getBaseUrl();

  let eventPath: string | undefined;
  if (env === "production") {
    eventPath = process.env.NEXT_PUBLIC_EVENT_URL_PROD;
  } else if (env === "uat") {
    eventPath = process.env.NEXT_PUBLIC_EVENT_URL_UAT;
  } else {
    eventPath = process.env.NEXT_PUBLIC_EVENT_URL_PROD;
  }

  if (!eventPath) {
    return;
  }

  if (!baseUrl) {
    return;
  }

  return `${baseUrl}${eventPath}`;
};

export const API_BASE_URLS = {
  THUNDER: getBaseUrl(),
  USER_COHORTS: getBaseUrlForCohorts(),
  EVENTS: getBaseUrlForEvents(),
  CONCORD: getBaseUrl(),
};

export const API_ENDPOINTS = {
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/thunder/ctas`,
  EVENTS_SCHEMA: API_BASE_URLS.EVENTS,
  SYSTEM_PROPERTIES: `${API_BASE_URLS.THUNDER}/${process.env.NEXT_PUBLIC_SYSTEM_PROPERTIES_URL}`,
  COHORTS_REALTIME: API_BASE_URLS.USER_COHORTS,
  TEST_JOURNEY_CREATE: `${API_BASE_URLS.THUNDER}/thunder/ctas/test/create`,
};

export const API_AXIOS_CONFIG = {
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    user: "admin@example.com",
  },
};
