import {
  CreateJourneyFormData,
} from "../types/journey.interface";
import { TestJourneyRequest } from "@/api/services/types/testJourney.interface";
import { DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS } from "../constants/journeyConstants";
import { buildJourneyRule } from "./journeyRuleBuilder.utils";

export const transformFormDataToTestApiFormat = (
  formData: CreateJourneyFormData
): TestJourneyRequest => {
  // Extract test journey values from formData
  const userIdsString = formData.testFeature?.userIds || "";
  const expireInMins = formData.testFeature?.expireInMins || DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS;
  const previousCtaId = formData.testFeature?.prevCtaId
    ? parseInt(formData.testFeature.prevCtaId, 10)
    : null;

  // Validate and convert userIds string to array
  if (!userIdsString.trim()) {
    throw new Error("User IDs are required");
  }

  // Parse comma-separated user IDs
  const userIdsArray = userIdsString
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  if (userIdsArray.length === 0) {
    throw new Error("At least one user ID is required");
  }

  // Convert to numbers and validate
  const userIds = userIdsArray.map(id => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    return numId;
  });

  // Ensure expiresInMinutes is always a valid positive number
  const expiresInMinutesToUse = expireInMins && expireInMins > 0 
    ? expireInMins 
    : DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS;

  // Build rule using shared function
  const rule = buildJourneyRule(formData);

  // Calculate ctaValidTill based on expiresInMinutes
  const ctaValidTill = Date.now() + expiresInMinutesToUse * 60 * 1000;

  // Build request payload
  const requestPayload: TestJourneyRequest = {
    ...(previousCtaId && { previousCtaId }),
    expiresInMinutes: expiresInMinutesToUse,
    userIds,
    rule: {
      ...rule,
      ctaValidTill,
    },
  };

  return requestPayload;
};

