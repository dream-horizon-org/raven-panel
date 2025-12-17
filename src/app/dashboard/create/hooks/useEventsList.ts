import { useQuery } from "@tanstack/react-query";
import { getAnalyticsEventsForCTA } from "@/api/services/events.service";

export const useEventsList = () => {
  return useQuery({
    queryKey: ["analyticsEvents"],
    queryFn: ({ signal }) => getAnalyticsEventsForCTA({ signal }),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
