import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import { JourneyStatus } from "./types/updateJourneyStatus.interface";

export const updateJourneyStatus = async (
  journeyId: number,
  status: JourneyStatus
): Promise<any> => {
  const response = await axiosInstance.put(
    `${API_BASE_URLS.THUNDER}/ctas/${journeyId}/${status}`
  );

  return response.data;
};
