import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import {
  GetListOfCTAsResponse,
  CTA,
} from "@/api/services/types/journeys.interface";

interface GetJourneysParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
}

export const getJourneysList = async ({
  pageNumber,
  pageSize,
  name,
  status,
}: GetJourneysParams): Promise<GetListOfCTAsResponse> => {
  try {
    const response = await axiosInstance.get<GetListOfCTAsResponse>(
      API_ENDPOINTS.JOURNEYS_LIST,
      {
        params: {
          pageNumber,
          pageSize,
          ...(name && { name }),
          ...(status && status !== "ALL" && { status }),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching journeys list:", error);
    throw error;
  }
};
