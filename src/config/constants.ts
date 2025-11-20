// App-wide constants
export const APP_NAME = "Raven Panel";
export const FOOTER_TEXT = `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`;

// Page titles
export const PAGE_TITLES = {
  JOURNEYS: "Journeys",
  JOURNEYS_LISTING: "Journeys listing page",
  LANDING_WELCOME: `Welcome to ${APP_NAME}`,
};

// Button and action text
export const BUTTON_TEXT = {
  LOGIN: "Login",
  GO_TO_DASHBOARD: "Go to Dashboard",
  CREATE_JOURNEY: "Create journey",
};

// Labels and placeholders
export const LABELS = {
  SEARCH_HERE: "Search journeys by name",
  TOTAL_JOURNEYS: "Total journeys",
  LIVE_JOURNEYS: "Live journeys",
};

// Journey action menu items
export const JOURNEY_MENU_ACTIONS = [
  {
    id: "copy",
    label: "Copy journey ID",
    icon: "FileCopyOutlined",
    hasAction: true,
  },
  {
    id: "live",
    label: "Live",
    icon: "PlayCircleOutline",
    hasAction: false,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: "Schedule",
    hasAction: false,
  },
  {
    id: "pause",
    label: "Pause",
    icon: "PauseCircleOutline",
    hasAction: false,
  },
  {
    id: "terminate",
    label: "Terminate",
    icon: "StopCircle",
    hasAction: false,
  },
  {
    id: "conclude",
    label: "Conclude",
    icon: "CheckCircleOutline",
    hasAction: false,
  },
] as const;

// Static data for mapping
export const FILTERS = [
  "Starting event",
  "Comms",
  "Created on",
  "Status",
  "Created by",
];

export const JOURNEY_TABLE_HEADERS = [
  "Title",
  "Status",
  "Created by",
  "Created on",
  "Actions",
];

// Pagination options
export const PAGE_SIZES = [10, 20, 50, 100];

export const SIDEBAR_TOOLTIPS = {
  JOURNEYS: "Journeys",
  SETTINGS: "Settings",
  EXPAND: "Expand",
  TOGGLE_THEME: (mode: "light" | "dark") =>
    `Switch to ${mode === "light" ? "dark" : "light"} mode`,
};

// Data for Metric Cards in Body.tsx
export const METRIC_CARDS_DATA = [
  {
    label: LABELS.TOTAL_JOURNEYS,
    value: 24,
    iconColor: "purple" as const,
  },
  {
    label: LABELS.LIVE_JOURNEYS,
    value: 24,
    iconColor: "green" as const,
  },
];
