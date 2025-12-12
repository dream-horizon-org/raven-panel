import { CreateJourneyFormData } from "../types/journey.interface";
import { createJourney } from "@/api/services/createJourney.service";
import { updateJourney } from "@/api/services/updateJourney.service";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface CreateOrUpdateJourneyParams {
  data: CreateJourneyFormData;
  journeyId?: string;
  isCloneMode?: boolean;
}

export const createOrUpdateJourney = async ({
  data,
  journeyId,
  isCloneMode = false,
}: CreateOrUpdateJourneyParams): Promise<number | null> => {
  if (journeyId && !isCloneMode) {
    try {
      await updateJourney(Number(journeyId), data);
      toast.success("Journey updated successfully!");
      return Number(journeyId);
    } catch (updateError) {
      const error = updateError as AxiosError<{
        error: { message: string };
      }>;
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to update journey";
      toast.error(errorMessage);
      throw updateError;
    }
  } else {
    try {
      const response = await createJourney(data);

      let journeyId: number | null = null;

      if (typeof response === "number") {
        journeyId = response;
      } else if (response?.data) {
        if (typeof response.data === "number") {
          journeyId = response.data;
        } else if (response.data?.id) {
          journeyId = response.data.id;
        }
      } else if (response?.id) {
        journeyId = response.id;
      }

      toast.success(
        isCloneMode
          ? "Journey cloned successfully!"
          : "Journey created successfully!"
      );

      return journeyId;
    } catch (createError) {
      const error = createError as AxiosError<{
        error: { message: string };
      }>;
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to create journey";
      toast.error(errorMessage);
      throw createError;
    }
  }
};

