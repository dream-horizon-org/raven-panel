import { CohortsResponse } from "./types/cohorts.interface";
import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";

export const getCohortsList = async (
  userId: string = "94056928"
): Promise<CohortsResponse> => {
  const url = API_BASE_URLS.USER_COHORTS;
  if (!url) {
    console.warn(
      "Cohort API URL is not configured. Please set NEXT_PUBLIC_COHORT_URL_PROD in your environment variables."
    );
  }
  const response = await axiosInstance.get<CohortsResponse>(url as string);
  return response.data;
};
