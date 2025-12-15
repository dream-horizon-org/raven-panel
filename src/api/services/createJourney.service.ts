import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import {
  CreateJourneyFormData,
  NudgeType,
} from "@/app/dashboard/create/types/journey.interface";
import { transformFormDataToApiFormat } from "@/app/dashboard/create/utils/createJourney.utils";

export const createJourney = async (
  formData: CreateJourneyFormData
): Promise<any> => {
  const apiPayload = transformFormDataToApiFormat(formData);

  const response = await axiosInstance.post(
    `${API_BASE_URLS.THUNDER}/ctas/`,
    apiPayload
  );

  return response.data;
};
