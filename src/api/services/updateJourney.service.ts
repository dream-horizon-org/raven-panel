import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import {
  CreateJourneyFormData,
  ReactNativeJson,
} from "@/app/dashboard/create/types/journey.interface";
import { transformFormDataToApiFormat } from "@/app/dashboard/create/utils/createJourney";
import { UpdateCtaInput } from "./types/updateJourney.interface";

export const updateJourney = async (
  journeyId: number,
  formData: CreateJourneyFormData
): Promise<any> => {
  const apiPayload = transformFormDataToApiFormat(formData);

  let startTime: number | null = null;
  if (formData.schedule.enableImmediateStart === true) {
    startTime = Date.now();
  } else if (formData.schedule.enableScheduledStart === true) {
    if (formData.schedule.startDate && formData.schedule.startTime) {
      const dateTimeString = `${formData.schedule.startDate}T${formData.schedule.startTime}`;
      startTime = new Date(dateTimeString).getTime();
    }
  }

  const updatePayload: UpdateCtaInput = {
    id: journeyId.toString(),
    description: formData.ctaMetadata.description || "",
    team: formData.ctaMetadata.team || "",
    tags: formData.ctaMetadata.tags.map((tag) => tag.label || ""),
    startTime: startTime,
    endTime:
      formData.schedule.endDate && formData.schedule.endTime
        ? new Date(
            `${formData.schedule.endDate}T${formData.schedule.endTime}`
          ).getTime()
        : null,
    rule: apiPayload.rule,
  };

  const response = await axiosInstance.put(
    `${API_BASE_URLS.THUNDER}/ctas/${journeyId}`,
    updatePayload
  );

  return response.data;
};
