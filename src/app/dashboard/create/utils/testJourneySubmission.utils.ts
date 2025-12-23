import { CreateJourneyFormData } from "../types/journey.interface";
import { Path } from "react-hook-form";
import { validateTemplates } from "./templateValidation.utils";
import { TestJourneyResponse } from "@/api/services/testJourney.service";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { UseTestJourneyParams } from "../hooks/useTestJourney";

interface TestJourneySubmissionParams {
  formData: CreateJourneyFormData;
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void;
  clearErrors: (path: Path<CreateJourneyFormData>) => void;
  setValue: (path: Path<CreateJourneyFormData>, value: any) => void;
  mutation: UseMutationResult<TestJourneyResponse, Error, UseTestJourneyParams>;
  onSuccess: () => void;
}

export const submitTestJourney = async ({
  formData,
  setError,
  clearErrors,
  setValue,
  mutation,
  onSuccess,
}: TestJourneySubmissionParams): Promise<void> => {
  // Only validate templates - no schedule validation needed for test
  if (!validateTemplates({ data: formData, setError, clearErrors })) {
    return;
  }

  // Read all test journey values from formData for validation
  const userIdsString = formData.testFeature?.userIds || "";
  const expireInMins = formData.testFeature?.expireInMins || 30;
  const previousCtaId = formData.testFeature?.prevCtaId
    ? parseInt(formData.testFeature.prevCtaId, 10)
    : null;

  // Validate userIds
  if (!userIdsString.trim()) {
    toast.error("User IDs are required");
    return;
  }

  // Parse and validate user IDs
  const userIdsArray = userIdsString
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  if (userIdsArray.length === 0) {
    toast.error("At least one user ID is required");
    return;
  }

  const invalidIds = userIdsArray.filter(id => isNaN(parseInt(id, 10)));
  if (invalidIds.length > 0) {
    toast.error(`Invalid user IDs: ${invalidIds.join(', ')}`);
    return;
  }

  // Validate expireInMins
  if (!expireInMins || expireInMins <= 0) {
    toast.error("Invalid expiration time");
    return;
  }

  // Check if this is an update (has valid previousCtaId)
  const isUpdate = previousCtaId && !isNaN(previousCtaId);
  const ctaIdToUse = isUpdate ? previousCtaId : undefined;

  try {
    // Pass formData and ctaId (if updating) to the mutation
    const response = await mutation.mutateAsync({
      formData,
      ctaId: ctaIdToUse,
    });

    if (response?.data) {
      // Store the created CTA ID in the form for future updates
      setValue("testFeature.prevCtaId", String(response.data));
      setValue("testFeature.isTestFeatureEnabled", true);
      // userId and expireInMins are already stored in formData, no need to set again

      toast.success(
        `Test journey ${isUpdate ? "updated" : "created"} successfully! CTA ID: ${response.data}. It will expire in ${expireInMins} minutes.`
      );
      onSuccess();
    } else {
      toast.error("Failed to create test journey");
    }
  } catch (error: any) {
    console.error("Error creating test journey:", error);
    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Failed to create test journey. Please try again.";
    toast.error(errorMessage);
  }
};

