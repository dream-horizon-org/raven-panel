/**
 * Determines the base URL based on the environment.
 */
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://thunder-master.dream11.local/thunder";
  }
  return "/thunder";
};

export const API_BASE_URLS = {
  THUNDER: getBaseUrl(),
};

export const API_ENDPOINTS = {
  FILTERS_LIST: `${API_BASE_URLS.THUNDER}/filters`,
  JOURNEYS_LIST: `${API_BASE_URLS.THUNDER}/ctas`,
};

export const API_AXIOS_CONFIG = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};
