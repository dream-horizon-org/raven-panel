import axiosInstance from "@/lib/axios";
// import { API_BASE_URLS } from "@/config/api";
import { CreateJourneyFormData } from "@/app/dashboard/create/types/journey.interface";
import { transformFormDataToTestApiFormat } from "@/app/dashboard/create/utils/testJourney.utils";

export interface TestJourneyRequest {
  previousCtaId?: number | null;
  expiresInMinutes: number; // Required - test journey must have expiration time
  userIds: number[];
  rule: {
    stateToAction: Record<string, string>;
    contextParams: string[];
    stateTransition: Record<
      string,
      Record<
        string,
        Array<{
          transitionTo: number;
          filters: {
            operator: string;
            filter: Array<{
              propertyName: string;
              propertyType: string;
              comparisonType: string;
              comparisonValue: string;
            }>;
          };
        }>
      >
    >;
    groupBy: string[];
    priority: number;
    stateMachineTTL: number;
    ctaValidTill: number;
    actions: Array<{
      [actionId: string]: {
        type: string;
        nudgeId: string;
        nudgeTemplate: any; // ReactNativeJson template with config.triggerDelay
      };
    }>;
    frequency: {
      session: {
        limit: number;
      };
      window: {
        limit: number;
        unit: string;
        value: number;
      };
    };
  };
}

export interface TestJourneyResponse {
  data: number; // ctaId
}

// Use existing thunder rewrite to thunder-master.dream11.local - use Next.js rewrite to avoid CORS
const TEST_JOURNEY_BASE_URL = "/thunder-master-uat";

export const createTestJourney = async (
  formData: CreateJourneyFormData
): Promise<TestJourneyResponse> => {
  const apiPayload = transformFormDataToTestApiFormat(formData);

  const endpoint = `${TEST_JOURNEY_BASE_URL}/ctas/test`; // Rewrites to http://thunder-master.dream11.local/thunder/ctas/test

  const response = await axiosInstance.post<TestJourneyResponse>(
    endpoint,
    apiPayload
  );

  return response.data;
};

export const updateTestJourney = async (
  ctaId: number,
  formData: CreateJourneyFormData
): Promise<TestJourneyResponse> => {
  const apiPayload = transformFormDataToTestApiFormat(formData);

  // const endpoint = `${API_BASE_URLS.THUNDER}/thunder/ctas/test/${ctaId}`;
  const endpoint = `${TEST_JOURNEY_BASE_URL}/ctas/test/${ctaId}`; // Rewrites to http://thunder-master.dream11.local/thunder/ctas/test/${ctaId}

  const response = await axiosInstance.put<TestJourneyResponse>(
    endpoint,
    apiPayload
  );

  return response.data;
};

export const deleteTestJourney = async (
  ctaId: number
): Promise<void> => {
  // await axiosInstance.delete(`${API_BASE_URLS.THUNDER}/thunder/ctas/test`, {
  await axiosInstance.delete(`${TEST_JOURNEY_BASE_URL}/ctas/test`, { // Rewrites to http://thunder-master.dream11.local/thunder/ctas/test
    headers: {
      ctaId: ctaId.toString(),
    },
  });
};

