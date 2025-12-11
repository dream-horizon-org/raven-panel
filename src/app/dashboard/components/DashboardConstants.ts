import { CTAStatus } from "@/api/services/types/journeys.interface";
// Status label mappings
export const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: "Draft",
  LIVE: "Live",
  SCHEDULED: "Scheduled",
  PAUSED: "Paused",
  CONCLUDED: "Concluded",
  TERMINATED: "Terminated",
} as const;

// Journey status labels for toast messages
export const JOURNEY_STATUS_LABELS: Record<string, string> = {
  live: "Live",
  schedule: "Scheduled",
  pause: "Paused",
  terminate: "Terminated",
  conclude: "Concluded",
} as const;

// Status to JourneyStatus mapping
export const STATUS_TO_JOURNEY_STATUS_MAP: Record<string, string> = {
  live: "live",
  schedule: "schedule",
  pause: "pause",
  terminate: "terminate",
  conclude: "conclude",
} as const;

// Date formatting options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
} as const;

export const DATE_LOCALE = "en-US" as const;

// Empty state text
export const EMPTY_STATE_TEXT = {
  title: "All quiet on the journeys front.",
  subtext:
    "You don't have any journeys yet. Create a new journey to get started.",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  loadFailed: "Failed to load journeys.",
  copyFailed: "Failed to copy journey ID",
  updateFailed: "Failed to update journey status. Please try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  idCopied: "Journey ID copied to clipboard",
  statusUpdated: (status: string) => `Journey ${status} successfully`,
} as const;

// Tooltip labels
export const TOOLTIP_LABELS = {
  editJourney: "Edit journey",
  cloneJourney: "Clone journey",
  moreOptions: "More options",
} as const;

// Route paths
export const ROUTE_PATHS = {
  edit: (id: number) => `/dashboard/edit/${id}`,
  clone: (id: number) => `/dashboard/clone/${id}`,
} as const;

// Table configuration
export const TABLE_CONFIG = {
  maxHeight: "660px",
  actionsColumnHeader: "Actions",
} as const;

// Empty state illustration dimensions
export const EMPTY_STATE_ILLUSTRATION = {
  width: "280",
  height: "200",
  viewBox: "0 0 280 200",
} as const;

// Pagination text
export const PAGINATION_TEXT = {
  perPage: (size: number) => `${size} / page`,
} as const;

// Default values
export const DEFAULT_VALUES = {
  emptyDate: "—",
  emptyCreator: "—",
  defaultTotalPages: 1,
} as const;

export const STATUSES = [
  "ALL",
  "DRAFT",
  "LIVE",
  "SCHEDULED",
  "PAUSED",
  "CONCLUDED",
  "TERMINATED",
] as const;

export const formatStatusLabel = (status: CTAStatus): string => {
  const statusMap: Record<string, string> = {
    DRAFT: "Draft",
    LIVE: "Live",
    SCHEDULED: "Scheduled",
    PAUSED: "Paused",
    CONCLUDED: "Concluded",
    TERMINATED: "Terminated",
  };
  return statusMap[status.toUpperCase()] || status;
};
