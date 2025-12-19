import { JOURNEY_ICONS } from "@/lib/mockData";
import {
  STATUS_LABEL_MAP,
  DATE_FORMAT_OPTIONS,
  DATE_LOCALE,
  DEFAULT_VALUES,
} from "./DashboardConstants";

export const getJourneyIcon = (journeyId: number): string => {
  const index = journeyId % JOURNEY_ICONS.length;
  return JOURNEY_ICONS[index];
};

export const formatStatusLabel = (status: string): string => {
  return STATUS_LABEL_MAP[status.toUpperCase()] || status;
};

export const formatDate = (timestamp: number): string => {
  if (!timestamp) return DEFAULT_VALUES.emptyDate;
  const date = new Date(timestamp);
  return date.toLocaleDateString(DATE_LOCALE, DATE_FORMAT_OPTIONS);
};
