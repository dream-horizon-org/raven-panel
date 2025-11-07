import { useQuery } from "@tanstack/react-query";
import { getFiltersList } from "@/api/services/filterList.service";
import { FilterOptionsResponse } from "@/api/services/types/filterList.interface";

export const useFiltersList = () => {
  return useQuery<FilterOptionsResponse, Error>({
    queryKey: ["filters"],
    queryFn: getFiltersList,
  });
};
