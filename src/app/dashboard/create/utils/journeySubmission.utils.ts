import { CreateJourneyFormData } from "../types/journey.interface";
import { Path } from "react-hook-form";
import { validateSchedule } from "./scheduleValidation.utils";
import { validateTemplates } from "./templateValidation.utils";
import { createOrUpdateJourney } from "./journeyOperations.utils";
import { updateJourneyStatusBasedOnSchedule } from "./journeyStatus.utils";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface JourneySubmissionParams {
  data: CreateJourneyFormData;
  errors: {
    schedule?: {
      startDate?: { message?: string };
      startTime?: { message?: string };
      endDate?: { message?: string };
      endTime?: { message?: string };
      enableScheduledStart?: { message?: string };
      enableScheduledEnd?: { message?: string };
    };
  };
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void;
  clearErrors: (path: Path<CreateJourneyFormData>) => void;
  journeyId?: string;
  isCloneMode?: boolean;
  searchParams?: URLSearchParams | null;
  setIsSubmitting: (value: boolean) => void;
  onSuccess: (statusParam: string | null) => void;
}

export const submitJourney = async ({
  data,
  errors,
  setError,
  clearErrors,
  journeyId,
  isCloneMode = false,
  searchParams,
  setIsSubmitting,
  onSuccess,
}: JourneySubmissionParams): Promise<void> => {
  if (!validateSchedule({ data, errors, setError })) {
    return;
  }

  if (!validateTemplates({ data, setError, clearErrors })) {
    return;
  }

  try {
    setIsSubmitting(true);

    const createdOrUpdatedJourneyId = await createOrUpdateJourney({
      data,
      journeyId,
      isCloneMode,
    });

    if (createdOrUpdatedJourneyId) {
      const statusUpdateSuccess = await updateJourneyStatusBasedOnSchedule({
        journeyId: createdOrUpdatedJourneyId,
        data,
      });

      if (statusUpdateSuccess) {
        const statusParam = searchParams?.get("status") || null;
        onSuccess(statusParam);
      }
    } else {
      console.error("No journey ID available for status update");
      const statusParam = searchParams?.get("status") || null;
      onSuccess(statusParam);
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ error: { message: string } }>;
    console.error(
      `Error ${journeyId && !isCloneMode ? "updating" : "creating"} journey:`,
      axiosError
    );
    const errorMessage =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      `Failed to ${
        journeyId && !isCloneMode ? "update" : "create"
      } journey. Please try again.`;
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
