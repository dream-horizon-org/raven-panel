import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import {
  EventNamesResponse,
  EventDetailsResponse,
  EventListItem,
} from "./types/events.interface";

export const getEventNames = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<EventNamesResponse> => {
  const url = API_ENDPOINTS.EVENTS_NAMES;
  if (!url) {
    console.warn(
      "Events API URL is not configured. Please check your environment configuration."
    );
    return { data: { eventNames: [] } };
  }

  const res = await axiosInstance.get<EventNamesResponse>(url, {
    signal,
  });
  return res.data;
};

export const getEventDetails = async ({
  eventName,
  signal,
}: {
  eventName: string;
  signal?: AbortSignal;
}): Promise<EventDetailsResponse> => {
  const url = API_ENDPOINTS.EVENT_DETAILS(eventName);
  if (!url) {
    throw new Error(
      "Events API URL is not configured. Please check your environment configuration."
    );
  }

  const res = await axiosInstance.get<EventDetailsResponse>(url, {
    signal,
  });
  return res.data;
};
