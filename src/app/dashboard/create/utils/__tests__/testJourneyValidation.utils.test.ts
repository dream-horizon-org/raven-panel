import {
  validateUserIds,
  validateExpireInMins,
  validateTestJourneyForm,
} from "../testJourneyValidation.utils";

describe("testJourneyValidation.utils", () => {
  describe("validateUserIds", () => {
    it("should return undefined for valid user IDs", () => {
      expect(validateUserIds("123,456,789")).toBeUndefined();
    });

    it("should return undefined for single valid user ID", () => {
      expect(validateUserIds("123")).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      expect(validateUserIds("")).toBeUndefined();
    });

    it("should return undefined for whitespace only", () => {
      expect(validateUserIds("   ")).toBeUndefined();
    });

    it("should return undefined for empty array after parsing", () => {
      expect(validateUserIds(",,,")).toBeUndefined();
    });

    it("should return error message for invalid user IDs", () => {
      const result = validateUserIds("123,abc,789");
      expect(result).toBe("Invalid user IDs: abc");
    });

    it("should return error message for multiple invalid user IDs", () => {
      const result = validateUserIds("123,abc,def,789");
      expect(result).toBe("Invalid user IDs: abc, def");
    });

    it("should handle user IDs with whitespace", () => {
      expect(validateUserIds(" 123 , 456 , 789 ")).toBeUndefined();
    });

    it("should reject user IDs with decimal points", () => {
      const result = validateUserIds("123,45.6,789");
      expect(result).toBe("Invalid user IDs: 45.6");
    });

    it("should reject user IDs with negative numbers", () => {
      const result = validateUserIds("123,-456,789");
      expect(result).toBe("Invalid user IDs: -456");
    });
  });

  describe("validateExpireInMins", () => {
    it("should return undefined for valid expiration time", () => {
      expect(validateExpireInMins("30")).toBeUndefined();
    });

    it("should return undefined for large valid expiration time", () => {
      expect(validateExpireInMins("1440")).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      expect(validateExpireInMins("")).toBeUndefined();
    });

    it("should return undefined for invalid expiration time", () => {
      expect(validateExpireInMins("abc")).toBeUndefined();
    });

    it("should return undefined for zero", () => {
      expect(validateExpireInMins("0")).toBeUndefined();
    });

    it("should return undefined for negative number", () => {
      expect(validateExpireInMins("-10")).toBeUndefined();
    });
  });

  describe("validateTestJourneyForm", () => {
    const errorMessages = {
      userIdsRequired: "User IDs are required",
      atLeastOneUserIdRequired: "At least one user ID is required",
      expireInMinsRequired: "Expiration time must be a positive number",
    };

    it("should return no errors for valid form data", () => {
      const result = validateTestJourneyForm("123,456", "30", errorMessages);

      expect(result).toEqual({});
    });

    it("should return error when userIds is empty", () => {
      const result = validateTestJourneyForm("", "30", errorMessages);

      expect(result).toEqual({
        userIds: "User IDs are required",
      });
    });

    it("should return error when userIds is only whitespace", () => {
      const result = validateTestJourneyForm("   ", "30", errorMessages);

      expect(result).toEqual({
        userIds: "User IDs are required",
      });
    });

    it("should return error when userIds array is empty after parsing", () => {
      const result = validateTestJourneyForm(",,,", "30", errorMessages);

      expect(result).toEqual({
        userIds: "At least one user ID is required",
      });
    });

    it("should return error when userIds contain invalid IDs", () => {
      const result = validateTestJourneyForm("123,abc,789", "30", errorMessages);

      expect(result).toEqual({
        userIds: "Invalid user IDs: abc",
      });
    });

    it("should return error when expireInMins is empty", () => {
      const result = validateTestJourneyForm("123,456", "", errorMessages);

      expect(result).toEqual({
        expireInMins: "Expiration time must be a positive number",
      });
    });

    it("should return error when expireInMins is not a number", () => {
      const result = validateTestJourneyForm("123,456", "abc", errorMessages);

      expect(result).toEqual({
        expireInMins: "Expiration time must be a positive number",
      });
    });

    it("should return error when expireInMins is zero", () => {
      const result = validateTestJourneyForm("123,456", "0", errorMessages);

      expect(result).toEqual({
        expireInMins: "Expiration time must be a positive number",
      });
    });

    it("should return error when expireInMins is negative", () => {
      const result = validateTestJourneyForm("123,456", "-10", errorMessages);

      expect(result).toEqual({
        expireInMins: "Expiration time must be a positive number",
      });
    });

    it("should return multiple errors when both fields are invalid", () => {
      const result = validateTestJourneyForm("", "0", errorMessages);

      expect(result).toEqual({
        userIds: "User IDs are required",
        expireInMins: "Expiration time must be a positive number",
      });
    });

    it("should handle valid userIds with whitespace", () => {
      const result = validateTestJourneyForm(" 123 , 456 ", "30", errorMessages);

      expect(result).toEqual({});
    });
  });
});

