export interface TestJourneyValidationErrors {
  userIds?: string;
  expireInMins?: string;
}

/**
 * Validates user IDs string (comma-separated)
 * @param userIds - Comma-separated string of user IDs
 * @returns Error message if invalid, undefined if valid
 */
export const validateUserIds = (userIds: string): string | undefined => {
  if (!userIds.trim()) {
    return undefined; // Empty check is handled separately
  }

  // Validate that all IDs are numbers (comma-separated)
  const idArray = userIds.split(',').map(id => id.trim()).filter(Boolean);
  
  if (idArray.length === 0) {
    return undefined; // Empty array check is handled separately
  }

  const invalidIds = idArray.filter(id => !/^\d+$/.test(id));
  if (invalidIds.length > 0) {
    return `Invalid user IDs: ${invalidIds.join(', ')}`;
  }

  return undefined;
};

/**
 * Validates expiration time in minutes
 * @param expireInMins - String representation of expiration time
 * @returns Error message if invalid, undefined if valid
 */
export const validateExpireInMins = (expireInMins: string): string | undefined => {
  const expireInMinsNum = parseInt(expireInMins, 10);
  if (!expireInMins || isNaN(expireInMinsNum) || expireInMinsNum <= 0) {
    return undefined; // Error message is handled in constants
  }
  return undefined;
};

/**
 * Validates all test journey form fields
 * @param userIds - Comma-separated string of user IDs
 * @param expireInMins - String representation of expiration time
 * @param errorMessages - Object containing error message constants
 * @returns Object with validation errors (empty if valid)
 */
export const validateTestJourneyForm = (
  userIds: string,
  expireInMins: string,
  errorMessages: {
    userIdsRequired: string;
    atLeastOneUserIdRequired: string;
    expireInMinsRequired: string;
  }
): TestJourneyValidationErrors => {
  const errors: TestJourneyValidationErrors = {};

  if (!userIds.trim()) {
    errors.userIds = errorMessages.userIdsRequired;
  } else {
    const idArray = userIds.split(',').map(id => id.trim()).filter(Boolean);
    if (idArray.length === 0) {
      errors.userIds = errorMessages.atLeastOneUserIdRequired;
    } else {
      const userIdsError = validateUserIds(userIds);
      if (userIdsError) {
        errors.userIds = userIdsError;
      }
    }
  }

  const expireInMinsNum = parseInt(expireInMins, 10);
  if (!expireInMins || isNaN(expireInMinsNum) || expireInMinsNum <= 0) {
    errors.expireInMins = errorMessages.expireInMinsRequired;
  }

  return errors;
};

