import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import { EventsSchemaResponse } from "./types/events.interface";

export const getAnalyticsEventsForCTA = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<EventsSchemaResponse> => {
  const url = API_BASE_URLS.EVENTS;
  if (!url) {
    console.warn(
      "Events API URL is not configured. Please check your environment configuration."
    );
    return { data: { eventList: [] } };
  }

  const res = await axiosInstance.get<EventsSchemaResponse>(url, {
    signal,
  });
  return res.data;
};
