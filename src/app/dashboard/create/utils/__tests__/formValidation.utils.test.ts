import {
  validateJourneyForm,
  hasScheduleErrors,
} from "../formValidation.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";

describe("formValidation.utils", () => {
  describe("hasScheduleErrors", () => {
    it("should return true when startDate has error", () => {
      const errors = {
        schedule: {
          startDate: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return true when startTime has error", () => {
      const errors = {
        schedule: {
          startTime: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return true when endDate has error", () => {
      const errors = {
        schedule: {
          endDate: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return true when endTime has error", () => {
      const errors = {
        schedule: {
          endTime: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return false when no schedule errors", () => {
      const errors = {
        schedule: {},
      };
      expect(hasScheduleErrors(errors)).toBe(false);
    });

    it("should return false when schedule is undefined", () => {
      const errors = {};
      expect(hasScheduleErrors(errors)).toBe(false);
    });
  });

  describe("validateJourneyForm", () => {
    const mockData: CreateJourneyFormData = {
      schedule: {
        enableScheduledStart: false,
        enableScheduledEnd: false,
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
          },
        ],
      },
    } as any;

    it("should return isValid true when all validations pass", () => {
      const mockDataWithValidActions: CreateJourneyFormData = {
        ...mockData,
        schedule: {
          enableScheduledStart: false,
          enableScheduledEnd: false,
        },
        nudgeSelection: {
          actions: [
            {
              actionId: "action1",
              type: "TOOLTIP" as any,
              template: {
                type: "TOOLTIP",
                props: { testID: "test" },
                children: [{ type: "Text", props: { text: "Hello" } }],
                actions: [],
                styles: {},
              },
            },
          ],
        },
      } as any;
      const errors = {};
      const result = validateJourneyForm(mockDataWithValidActions, errors);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return isValid false when schedule has errors", () => {
      const errors = {
        schedule: {
          startDate: { message: "Error" },
        },
      };
      const result = validateJourneyForm(mockData, errors);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should return isValid false when no actions exist", () => {
      const dataWithoutActions: CreateJourneyFormData = {
        ...mockData,
        nudgeSelection: {
          actions: [],
        },
      } as any;
      const errors = {};
      const result = validateJourneyForm(dataWithoutActions, errors);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.type === "actions")).toBe(true);
    });

    it("should return isValid false when actions have no templates", () => {
      const dataWithoutTemplates: CreateJourneyFormData = {
        ...mockData,
        nudgeSelection: {
          actions: [
            {
              actionId: "action1",
              type: "TOOLTIP" as any,
              template: null as any,
            },
          ],
        },
      } as any;
      const errors = {};
      const result = validateJourneyForm(dataWithoutTemplates, errors);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.type === "actions")).toBe(true);
    });

    it("should return isValid false when templates have no content", () => {
      const dataWithEmptyTemplates: CreateJourneyFormData = {
        ...mockData,
        nudgeSelection: {
          actions: [
            {
              actionId: "action1",
              type: "TOOLTIP" as any,
              template: {
                type: "TOOLTIP",
                props: {},
                children: [],
                actions: [],
                styles: {},
              },
            },
          ],
        },
      } as any;
      const errors = {};
      const result = validateJourneyForm(dataWithEmptyTemplates, errors);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.type === "template")).toBe(true);
    });
  });
});
