import { useQuery } from "@tanstack/react-query";
import { getCohortsList } from "@/api/services/cohorts.service";
import { CohortsResponse } from "@/api/services/types/cohorts.interface";

const isCohortEnabled = () => {
  const enableCohort = process.env.NEXT_PUBLIC_ENABLE_COHORT;
  return enableCohort === "true";
};

const MOCK_COHORT_RESPONSE: CohortsResponse = {
  data: ["all"],
};

export const useCohortsList = (userId?: string) => {
  const enabled = isCohortEnabled();

  return useQuery<CohortsResponse, Error>({
    queryKey: ["cohorts", userId],
    queryFn: () => getCohortsList(userId),
    enabled: enabled,
    placeholderData: enabled ? undefined : MOCK_COHORT_RESPONSE,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
