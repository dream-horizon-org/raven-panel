import {
  CreateCtaInput,
  CohortEligibilityInput,
} from "@/api/services/types/createJourney.interface";
import { CreateJourneyFormData } from "../types/journey.interface";
import { buildJourneyRule } from "./journeyRuleBuilder.utils";

export const transformFormDataToApiFormat = (
  formData: CreateJourneyFormData
): CreateCtaInput => {
  const cohortEligibility: CohortEligibilityInput = {
    includes: formData.selectCohort.includedCohorts || [],
    excludes: formData.selectCohort.exculdedCohorts || [],
  };

  const rule = buildJourneyRule(formData);

  let startTime: number | null = null;
  if (formData.schedule.enableImmediateStart === true) {
    startTime = Date.now();
  } else if (formData.schedule.enableScheduledStart === true) {
    if (formData.schedule.startDate && formData.schedule.startTime) {
      const dateTimeString = `${formData.schedule.startDate}T${formData.schedule.startTime}`;
      startTime = new Date(dateTimeString).getTime();
    }
  } else if (formData.schedule.startDateTime) {
    startTime = new Date(formData.schedule.startDateTime).getTime();
  }

  let endTime: number | null = null;
  if (formData.schedule.endDate && formData.schedule.endTime) {
    const dateTimeString = `${formData.schedule.endDate}T${formData.schedule.endTime}`;
    endTime = new Date(dateTimeString).getTime();
  } else if (formData.schedule.endDateTime) {
    endTime = new Date(formData.schedule.endDateTime).getTime();
  }

  const tags =
    formData.ctaMetadata.tags?.map((tag) => tag.label || "").filter(Boolean) ||
    [];

  return {
    name: formData.ctaMetadata.ctaTitle || "",
    description: formData.ctaMetadata.description || "",
    team: formData.ctaMetadata.team || "",
    tags,
    startTime,
    endTime,
    rule: {
      ...rule,
      cohortEligibility,
    },
  };
};
