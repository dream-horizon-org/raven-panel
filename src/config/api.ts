// ============================================
// Environment Variables Console Logs
// ============================================
console.log("=== Environment Variables ===");
console.log("NEXT_PUBLIC_ENV:", process.env.NEXT_PUBLIC_ENV);
console.log("NODE_ENV:", process.env.NODE_ENV);

// ============================================
// Google OAuth Configuration
// ============================================
console.log(
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID:",
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
);
console.log(
  "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:",
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
);

// ============================================
// Base URL Configuration
// ============================================
console.log(
  "NEXT_PUBLIC_PRODUCTION_URL:",
  process.env.NEXT_PUBLIC_PRODUCTION_URL
);
console.log("NEXT_PUBLIC_UAT_URL:", process.env.NEXT_PUBLIC_UAT_URL);
console.log(
  "NEXT_PUBLIC_BASE_URL_PROD:",
  process.env.NEXT_PUBLIC_BASE_URL_PROD
);
console.log("NEXT_PUBLIC_BASE_URL_UAT:", process.env.NEXT_PUBLIC_BASE_URL_UAT);

// ============================================
// Login Configuration
// ============================================
console.log(
  "NEXT_PUBLIC_IS_LOGIN_ENABLED:",
  process.env.NEXT_PUBLIC_IS_LOGIN_ENABLED
);

// ============================================
// Cohort Configuration (API)
// ============================================
console.log(
  "NEXT_PUBLIC_ENABLE_COHORT:",
  process.env.NEXT_PUBLIC_ENABLE_COHORT
);
console.log(
  "NEXT_PUBLIC_COHORT_URL_PROD:",
  process.env.NEXT_PUBLIC_COHORT_URL_PROD
);
console.log(
  "NEXT_PUBLIC_COHORT_URL_UAT:",
  process.env.NEXT_PUBLIC_COHORT_URL_UAT
);

// ============================================
// Event Configuration (API)
// ============================================
console.log(
  "NEXT_PUBLIC_EVENT_URL_PROD:",
  process.env.NEXT_PUBLIC_EVENT_URL_PROD
);
console.log(
  "NEXT_PUBLIC_EVENT_URL_UAT:",
  process.env.NEXT_PUBLIC_EVENT_URL_UAT
);

// ============================================
// System Properties Configuration (API)
// ============================================
console.log(
  "NEXT_PUBLIC_SYSTEM_PROPERTIES_URL:",
  process.env.NEXT_PUBLIC_SYSTEM_PROPERTIES_URL
);

// ============================================
// Permission Configuration (JSON File)
// ============================================
console.log(
  "NEXT_PUBLIC_ENABLE_PERMISSION:",
  process.env.NEXT_PUBLIC_ENABLE_PERMISSION
);
console.log(
  "NEXT_PUBLIC_PERMISSION_S3_URL:",
  process.env.NEXT_PUBLIC_PERMISSION_S3_URL
);

// ============================================
// Tenant Configuration (Dropdown Options)
// ============================================
console.log(
  "NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT:",
  process.env.NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT
);
console.log(
  "NEXT_PUBLIC_ORGANIZATIONS:",
  process.env.NEXT_PUBLIC_ORGANIZATIONS
);

console.log("=== End Environment Variables ===\n");

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

console.log("baseUrl (getBaseUrl()):", getBaseUrl());
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
};

export const API_AXIOS_CONFIG = {
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    user: "admin@example.com",
  },
};
