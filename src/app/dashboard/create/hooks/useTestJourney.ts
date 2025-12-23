import { useMutation } from "@tanstack/react-query";
import { 
  createTestJourney, 
  updateTestJourney,
  TestJourneyResponse 
} from "@/api/services/testJourney.service";
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

