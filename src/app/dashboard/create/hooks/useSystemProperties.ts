import { useQuery } from "@tanstack/react-query";
import { getSystemProperties } from "@/api/services/systemProperties.service";

export const useSystemProperties = () => {
  return useQuery({
    queryKey: ["systemProperties"],
    queryFn: ({ signal }) => getSystemProperties({ signal }),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
