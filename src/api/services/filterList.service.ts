import axiosInstance from "@/lib/axios";
import { API_BASE_URLS, API_ENDPOINTS } from "@/config/api";
import { FilterOptionsResponse } from "./types/filterList.interface";

export const getFiltersList = async (): Promise<FilterOptionsResponse> => {
  const response = await axiosInstance.get<FilterOptionsResponse>(
    API_ENDPOINTS.FILTERS_LIST
  );
  return response.data;
};
