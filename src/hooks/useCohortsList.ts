import { useQuery } from "@tanstack/react-query";
import { getCohortsList } from "@/api/services/cohorts.service";
import { CohortsResponse } from "@/api/services/types/cohorts.interface";

export const useCohortsList = (userId?: string) => {
  return useQuery<CohortsResponse, Error>({
    queryKey: ["cohorts", userId],
    queryFn: () => getCohortsList(userId),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
