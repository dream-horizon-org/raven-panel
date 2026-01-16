import { useQuery } from "@tanstack/react-query";
import { getEventNames, getEventDetails } from "@/api/services/events.service";
import { EventListItem } from "@/api/services/types/events.interface";

export const useEventsList = () => {
  return useQuery({
    queryKey: ["eventNames"],
    queryFn: ({ signal }) => getEventNames({ signal }),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => {
      const eventList: EventListItem[] = data.data.eventNames.map(
        (eventName) => ({
          eventName,
          properties: [],
        })
      );
      return { data: { eventList } };
    },
  });
};

export const useEventDetails = (eventName: string | null) => {
  return useQuery({
    queryKey: ["eventDetails", eventName],
    queryFn: ({ signal }) => {
      if (!eventName) {
        throw new Error("Event name is required");
      }
      return getEventDetails({ eventName, signal });
    },
    enabled: !!eventName,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
