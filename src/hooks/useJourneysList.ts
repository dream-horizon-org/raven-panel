import { useQuery } from "@tanstack/react-query";
import { getJourneysList } from "@/api/services/journeys.service";
import { GetListOfCTAsResponse } from "@/api/services/types/journeys.interface";

export const useJourneysList = (
  pageNumber: number,
  pageSize: number,
  name: string,
  status: string
) => {
  return useQuery<GetListOfCTAsResponse, Error>({
    queryKey: ["journeys", { pageNumber, pageSize, name, status }],
    queryFn: () => getJourneysList({ pageNumber, pageSize, name, status }),
  });
};
