import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import { EventsSchemaResponse } from "./types/events.interface";

export const getAnalyticsEventsForCTA = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<EventsSchemaResponse> => {
  const url = API_BASE_URLS.EVENTS;
  if (!url) {
    console.warn(
      "Events API URL is not configured. Please set NEXT_PUBLIC_EVENT_URL_PROD in your environment variables."
    );
  }
  const res = await axiosInstance.get<EventsSchemaResponse>(url as string, {
    signal,
  });
  return res.data;
};
