import { useMutation } from "@tanstack/react-query";
import { 
  createTestJourney, 
  updateTestJourney
} from "@/api/services/testJourney.service";
import { TestJourneyResponse } from "@/api/services/types/testJourney.interface";
import { CreateJourneyFormData } from "../types/journey.interface";

export interface UseTestJourneyParams {
  formData: CreateJourneyFormData;
  ctaId?: number; // If provided, it's an update
}

export const useTestJourney = () => {
  return useMutation<TestJourneyResponse, Error, UseTestJourneyParams>({
    mutationFn: async ({ formData, ctaId }) => {
      if (ctaId) {
        return await updateTestJourney(ctaId, formData);
      } else {
        return await createTestJourney(formData);
      }
    },
  });
};

