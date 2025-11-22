/**
 * Determines the base URL based on the environment.
 */
const getBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  if (env === "production") {
    return "https://thunder-master.dream11.local/thunder";
  }
  if (env === "uat") {
    return "https://thunder-uat.dream11.local/thunder";
  }
  return "/thunder";
};

export const API_BASE_URLS = {
  THUNDER: getBaseUrl(),
  USER_COHORTS: "/user-cohorts",
  CONCORD: "/concord",
};

export const API_ENDPOINTS = {
  FILTERS_LIST: `${API_BASE_URLS.THUNDER}/filters`,
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/ctas`,
  EVENTS_SCHEMA: `${API_BASE_URLS.CONCORD}/schema`,
  SYSTEM_PROPERTIES: `${API_BASE_URLS.CONCORD}/getSystemProperties`,
  COHORTS_REALTIME: `${API_BASE_URLS.USER_COHORTS}/user-cohort/realtime`,
};

export const API_AXIOS_CONFIG = {
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    user: "admin@example.com",
  },
};
