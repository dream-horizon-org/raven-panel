import axiosInstance from "@/lib/axios";
import { API_BASE_URLS } from "@/config/api";
import {
  CreateJourneyFormData,
  ReactNativeJson,
} from "@/app/dashboard/create/types/journeyTypes";
import { transformFormDataToApiFormat } from "@/app/dashboard/create/utils/createJourney";
import { UpdateCtaInput } from "./types/updateJourney.interface";

export const updateJourney = async (
  journeyId: number,
  formData: CreateJourneyFormData
): Promise<any> => {
  const apiPayload = transformFormDataToApiFormat(formData);

  const updatePayload: UpdateCtaInput = {
    id: journeyId.toString(),
    description: formData.ctaMetadata.description || "",
    team: formData.ctaMetadata.team || "",
    tags: formData.ctaMetadata.tags.map((tag) => tag.label || ""),
    startTime: formData.schedule.startType === "immediate" ? Date.now() : null,
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
