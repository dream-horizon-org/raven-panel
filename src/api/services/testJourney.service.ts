import axiosInstance from "@/lib/axios";
// import { API_BASE_URLS } from "@/config/api";
import { CreateJourneyFormData } from "@/app/dashboard/create/types/journey.interface";
import { transformFormDataToTestApiFormat } from "@/app/dashboard/create/utils/testJourney.utils";

export interface TestJourneyRequest {
  previousCtaId?: number | null;
  expiresInMinutes?: number;
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
      config: {
        triggerDelay: number;
      };
      actionId: string;
      type: string; // "NUDGE_UI", "POPUP", "TOOLTIP"
      variant?: string;
      template: any; // ReactNativeJson with type field (e.g., "BottomSheet", "POPUP", "TOOLTIP")
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
    resetStates: string[];
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

  const endpoint = `${TEST_JOURNEY_BASE_URL}/ctas/test/create`; // Rewrites to http://thunder-master.dream11.local/thunder/ctas/test

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
  // Set previousCtaId in formData before transformation
  const formDataWithCtaId = {
    ...formData,
    testFeature: {
      ...formData.testFeature,
      prevCtaId: String(ctaId),
    },
  };

  const apiPayload = transformFormDataToTestApiFormat(formDataWithCtaId);

  const endpoint = `${TEST_JOURNEY_BASE_URL}/ctas/test/create`; // Same endpoint as create

  const response = await axiosInstance.post<TestJourneyResponse>(
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

