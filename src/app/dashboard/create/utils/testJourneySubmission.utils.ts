import { CreateJourneyFormData } from "../types/journey.interface";
import { Path } from "react-hook-form";
import { transformFormDataToTestApiFormat } from "./testJourney.utils";
import { UseMutationResult } from "@tanstack/react-query";
import { TestJourneyResponse } from "@/api/services/testJourney.service";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface SubmitTestJourneyParams {
  formData: CreateJourneyFormData;
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void;
  clearErrors: (path?: Path<CreateJourneyFormData>) => void;
  setValue: <T extends Path<CreateJourneyFormData>>(
    path: T,
    value: any,
    options?: { shouldValidate?: boolean; shouldDirty?: boolean }
  ) => void;
  mutation: UseMutationResult<
    TestJourneyResponse,
    Error,
    { formData: CreateJourneyFormData; ctaId?: number }
  >;
  onSuccess?: () => void;
}

export const submitTestJourney = async ({
  formData,
  setError,
  clearErrors,
  setValue,
  mutation,
  onSuccess,
}: SubmitTestJourneyParams): Promise<void> => {
  try {
    // Clear any previous errors
    clearErrors();

    // Transform form data to API format (this will throw if validation fails)
    transformFormDataToTestApiFormat(formData);

    // Get the previous CTA ID if it exists (for updates)
    const previousCtaId = formData.testFeature?.prevCtaId
      ? parseInt(formData.testFeature.prevCtaId, 10)
      : undefined;

    // Call the mutation
    const response = await mutation.mutateAsync({
      formData,
      ctaId: previousCtaId,
    });

    // If we got a response with a CTA ID, store it for potential updates
    if (response?.data) {
      setValue("testFeature.prevCtaId", String(response.data), {
        shouldValidate: false,
      });
    }

    // Show success message
    toast.success(
      previousCtaId
        ? "Test journey updated successfully"
        : "Test journey created successfully"
    );

    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Error submitting test journey:", error);

    // Handle validation errors from transformFormDataToTestApiFormat
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Check if it's a validation error for user IDs
      if (
        errorMessage.includes("User ID") ||
        errorMessage.includes("user ID")
      ) {
        setError("testFeature.userIds" as Path<CreateJourneyFormData>, {
          type: "validation",
          message: errorMessage,
        });
        toast.error(errorMessage);
        return;
      }

      // Check if it's a general validation error
      if (
        errorMessage.includes("required") ||
        errorMessage.includes("Invalid")
      ) {
        toast.error(errorMessage);
        return;
      }
    }

    // Handle API errors
    const axiosError = error as AxiosError<{ error: { message: string } }>;
    const errorMessage =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "Failed to create test journey. Please try again.";

    toast.error(errorMessage);

    // Set a general error on the form if needed
    setError("testFeature" as Path<CreateJourneyFormData>, {
      type: "server",
      message: errorMessage,
    });
  }
};
