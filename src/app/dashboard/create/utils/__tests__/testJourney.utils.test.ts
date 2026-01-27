import { transformFormDataToTestApiFormat } from "../testJourney.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS } from "../../constants/journeyConstants";

describe("testJourney.utils", () => {
  describe("transformFormDataToTestApiFormat", () => {
    const baseFormData: CreateJourneyFormData = {
      testFeature: {
        isTestFeatureEnabled: true,
        userIds: "123,456,789",
        expireInMins: 60,
        prevCtaId: "",
      },
      ctaMetadata: {
        ctaTitle: "Test Journey",
      },
      contextParams: [{ id: 1, label: "param1" }],
      schedule: {
        priority: 5,
      },
      journeyFrequency: {
        enableMaxTimesInLifetime: true,
        maxTimesInLifetime: 10,
        enableTimesInSession: true,
        timesInSession: 5,
        enableMaxTimesInPeriod: true,
        maxTimesInPeriod: 3,
        periodValue: 7,
        periodUnit: "days",
      },
      ruleEngine: {
        eventInfo: [],
      },
      nudgeSelection: {
        actions: [
          {
            actionId: "action1",
            type: "TOOLTIP" as any,
            template: {
              type: "TOOLTIP",
              props: { testID: "test" },
              children: [],
              actions: [],
              styles: {},
            },
            onState: "1",
          },
        ],
        resetStates: ["1"],
      },
    } as any;

    it("should transform basic form data to test API format", () => {
      const result = transformFormDataToTestApiFormat(baseFormData);

      expect(result.userIds).toEqual([123, 456, 789]);
      expect(result.expiresInMinutes).toBe(60);
      expect(result.rule.contextParams).toEqual(["param1"]);
      expect(result.rule.priority).toBe(5);
      expect(result.rule.resetCTAonFirstLaunch).toBe(true);
      expect(result.rule.ctaValidTill).toBeDefined();
      expect(result.rule.frequency.lifespan.limit).toBe(10);
      expect(result.rule.frequency.session.limit).toBe(5);
      expect(result.rule.frequency.window.limit).toBe(3);
      expect(result.rule.actions).toHaveLength(1);
      expect(result.rule.resetStates).toEqual(["1"]);
    });

    it("should use default expiration time when not provided", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          expireInMins: 0,
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.expiresInMinutes).toBe(DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS);
    });

    it("should include previousCtaId when provided", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          prevCtaId: "999",
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.previousCtaId).toBe(999);
    });

    it("should not include previousCtaId when not provided", () => {
      const result = transformFormDataToTestApiFormat(baseFormData);

      expect(result.previousCtaId).toBeUndefined();
    });

    it("should calculate ctaValidTill correctly", () => {
      const beforeTime = Date.now();
      const result = transformFormDataToTestApiFormat(baseFormData);
      const afterTime = Date.now();

      const expectedMin = beforeTime + 60 * 60 * 1000;
      const expectedMax = afterTime + 60 * 60 * 1000;

      expect(result.rule.ctaValidTill).toBeGreaterThanOrEqual(expectedMin);
      expect(result.rule.ctaValidTill).toBeLessThanOrEqual(expectedMax);
    });

    it("should handle single user ID", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          userIds: "123",
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.userIds).toEqual([123]);
    });

    it("should trim whitespace from user IDs", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          userIds: " 123 , 456 , 789 ",
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.userIds).toEqual([123, 456, 789]);
    });

    it("should throw error when user IDs are empty", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          userIds: "",
        },
      };

      expect(() => transformFormDataToTestApiFormat(formData)).toThrow(
        "User IDs are required"
      );
    });

    it("should throw error when user IDs are only whitespace", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          userIds: "   ",
        },
      };

      expect(() => transformFormDataToTestApiFormat(formData)).toThrow(
        "User IDs are required"
      );
    });

    it("should throw error when no valid user IDs after parsing", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          userIds: ",,,",
        },
      };

      expect(() => transformFormDataToTestApiFormat(formData)).toThrow(
        "At least one user ID is required"
      );
    });

    it("should throw error when user ID is invalid (not a number)", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          userIds: "123,abc,789",
        },
      };

      expect(() => transformFormDataToTestApiFormat(formData)).toThrow(
        "Invalid user ID: abc"
      );
    });

    it("should use default expiration when expireInMins is 0", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          expireInMins: 0,
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.expiresInMinutes).toBe(DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS);
    });

    it("should use default expiration when expireInMins is negative", () => {
      const formData = {
        ...baseFormData,
        testFeature: {
          ...baseFormData.testFeature,
          expireInMins: -10,
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.expiresInMinutes).toBe(DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS);
    });

    it("should handle empty actions array", () => {
      const formData = {
        ...baseFormData,
        nudgeSelection: {
          actions: [],
          resetStates: ["1"],
        },
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.rule.actions).toEqual([]);
      expect(result.rule.stateToAction).toEqual({});
    });

    it("should handle missing journeyFrequency with defaults", () => {
      const formData = {
        ...baseFormData,
        journeyFrequency: undefined,
      };

      const result = transformFormDataToTestApiFormat(formData);

      expect(result.rule.frequency.lifespan.limit).toBe(999);
      expect(result.rule.frequency.session.limit).toBe(999);
      expect(result.rule.frequency.window.limit).toBe(999);
    });
  });
});
