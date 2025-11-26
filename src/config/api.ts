/**
 * Determines the base URL based on the environment.
 */
const getBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  if (env === "production") {
    return "https://kong.dream11.com/thunder";
  }
  if (env === "uat") {
    return "https://kong-uat.dream11.com/thunder";
  }
  console.log(
    "env::: ",
    env,
    process.env.NEXT_PUBLIC_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_UAT_URL
  );
  return "/thunder";
};

const getBaseUrlForCohorts = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
  if (process.env.NODE_ENV === "development") {
    return "https://kong.dream11.com/v1/destinations/UserCohortService/cohorts";
  }
  if (env === "uat") {
    return "https://kong-uat.dream11.com/v1/destinations/UserCohortService/cohorts";
  }

  return "https://kong.dream11.com/v1/destinations/UserCohortService/cohorts";
};

/**

 * Gets the base URL for Concord service
 */
const getConcordBaseUrl = () => {
  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  if (env === "production") {
    return "https://kong.dream11.com";
  }
  if (env === "uat") {
    return "https://kong-uat.dream11.com";
  }
  // Development: use local kong
  return "https://kong.dream11.com";
};

export const API_BASE_URLS = {
  THUNDER: getBaseUrl(),
  USER_COHORTS: getBaseUrlForCohorts(),
  CONCORD: getConcordBaseUrl(),
};

export const API_ENDPOINTS = {
  FILTERS_LIST: `${API_BASE_URLS.THUNDER}/filters`,
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/ctas`,
  EVENTS_SCHEMA: `${API_BASE_URLS.CONCORD}/schema`,
  SYSTEM_PROPERTIES: `${API_BASE_URLS.CONCORD}/getSystemProperties`,
  COHORTS_REALTIME: `${API_BASE_URLS.USER_COHORTS}?pageSize=999999`,
};
export const API_AXIOS_CONFIG = {
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    user: "admin@example.com",
  },
};
