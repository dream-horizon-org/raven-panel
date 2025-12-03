import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import { GetJourneyResponse } from "./types/getJourney.interface";

export const getJourneyById = async (
  journeyId: number
): Promise<GetJourneyResponse> => {
  const response = await axiosInstance.get<GetJourneyResponse>(
    `${API_BASE_URLS.THUNDER}/ctas/${journeyId}`
  );

  return response.data;
};
