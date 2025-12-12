import { CreateJourneyFormData } from "../types/journey.interface";
import { updateJourneyStatus } from "@/api/services/journeyStatus.service";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateJourneyStatusParams {
  journeyId: number;
  data: CreateJourneyFormData;
}

export const updateJourneyStatusBasedOnSchedule = async ({
  journeyId,
  data,
}: UpdateJourneyStatusParams): Promise<boolean> => {
  if (data.schedule?.enableImmediateStart === true) {
    try {
      await updateJourneyStatus(journeyId, "live");
      toast.success("Journey is now live!");
      return true;
    } catch (statusError) {
      const error = statusError as AxiosError<{
        error: { message: string };
      }>;
      console.error("Error updating journey status to live:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to set status to live";
      toast.error(errorMessage);
      return false;
    }
  } else if (data.schedule?.enableScheduledStart === true) {
    try {
      await updateJourneyStatus(journeyId, "schedule");
      toast.success("Journey is now scheduled!");
      return true;
    } catch (statusError) {
      const error = statusError as AxiosError<{
        error: { message: string };
      }>;
      console.error("Error updating journey status to scheduled:", error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to set status to scheduled";
      toast.error(errorMessage);
      return false;
    }
  } else {
    return true;
  }
};

