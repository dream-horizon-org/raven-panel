import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { EventsSchemaResponse } from "./types/events.interface";

export const getAnalyticsEventsForCTA = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<EventsSchemaResponse> => {
  const res = await axiosInstance.get<EventsSchemaResponse>(
    API_ENDPOINTS.EVENTS_SCHEMA,
    {
      params: { limit: 10000, companyName: "dream11", branchId: 0 },
      headers: { "x-tenant-id": "dream11", "x-skip-validation": "false" },
      signal,
    }
  );
  return res.data;
};
