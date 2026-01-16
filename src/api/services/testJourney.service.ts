import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";
import { CreateJourneyFormData } from "@/app/dashboard/create/types/journey.interface";
import { transformFormDataToTestApiFormat } from "@/app/dashboard/create/utils/testJourney.utils";
import { TestJourneyResponse } from "./types/testJourney.interface";

export const createTestJourney = async (
  formData: CreateJourneyFormData
): Promise<TestJourneyResponse> => {
  const apiPayload = transformFormDataToTestApiFormat(formData);

  const response = await axiosInstance.post<TestJourneyResponse>(
    API_ENDPOINTS.TEST_JOURNEY_CREATE,
    apiPayload
  );

  return response.data;
};

export const updateTestJourney = async (
  ctaId: number,
  formData: CreateJourneyFormData
): Promise<TestJourneyResponse> => {
  // Set previousCtaId in formData before transformation
  const formDataWithCtaId = {
    ...formData,
    testFeature: {
      ...formData.testFeature,
      prevCtaId: String(ctaId),
    },
  };

  const apiPayload = transformFormDataToTestApiFormat(formDataWithCtaId);

  const response = await axiosInstance.post<TestJourneyResponse>(
    API_ENDPOINTS.TEST_JOURNEY_CREATE,
    apiPayload
  );

  return response.data;
};


