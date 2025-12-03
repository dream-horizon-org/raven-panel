import { API_ENDPOINTS } from "@/config/api";
import { CohortsResponse } from "./types/cohorts.interface";
import axiosInstance from "@/lib/axios";

export const getCohortsList = async (
  userId: string = "94056928"
): Promise<CohortsResponse> => {
  const response = await axiosInstance.get<CohortsResponse>(
    API_ENDPOINTS.COHORTS_REALTIME
  );
  return response.data;
};
