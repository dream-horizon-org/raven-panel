import { CTAStatus } from "@/api/services/types/journeys.interface";

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
