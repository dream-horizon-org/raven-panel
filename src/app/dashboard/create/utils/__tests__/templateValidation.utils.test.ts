import {
  hasTemplate,
  validateActionsExist,
  validateAllActionsHaveTemplates,
  validateEngagementsBeforeTabChange,
  getEngagementsWithoutTemplates,
} from "../templateValidation.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("templateValidation.utils", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("hasTemplate", () => {
    it("should return true when actions have templates with type", () => {
      const actions = [
        {
          template: {
            type: "TOOLTIP",
          },
        },
      ];
      expect(hasTemplate(actions)).toBe(true);
    });

    it("should return false when actions array is empty", () => {
      expect(hasTemplate([])).toBe(false);
    });

    it("should return false when actions is undefined", () => {
      expect(hasTemplate(undefined)).toBe(false);
    });

    it("should return false when no actions have templates", () => {
      const actions = [{}, {}];
      expect(hasTemplate(actions)).toBe(false);
    });

    it("should return false when template has no type", () => {
      const actions = [
        {
          template: {},
        },
      ];
      expect(hasTemplate(actions)).toBe(false);
    });
  });

  describe("validateActionsExist", () => {
    it("should return true when actions exist", () => {
      const data: CreateJourneyFormData = {
        nudgeSelection: {
          actions: [
            {
              actionId: "action1",
              type: "TOOLTIP" as any,
            },
          ],
        },
      } as any;
      expect(validateActionsExist(data)).toBe(true);
    });

    it("should return false when actions array is empty", () => {
      const data: CreateJourneyFormData = {
        nudgeSelection: {
          actions: [],
        },
      } as any;
      expect(validateActionsExist(data)).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });

    it("should return false when actions is undefined", () => {
      const data: CreateJourneyFormData = {
        nudgeSelection: {},
      } as any;
      expect(validateActionsExist(data)).toBe(false);
    });
  });

  describe("validateAllActionsHaveTemplates", () => {
    it("should return true when all actions have templates", () => {
      const data: CreateJourneyFormData = {
        nudgeSelection: {
          actions: [
            {
              actionId: "action1",
              type: "TOOLTIP" as any,
              template: {
                type: "TOOLTIP",
              },
            },
          ],
        },
      } as any;
      expect(validateAllActionsHaveTemplates(data)).toBe(true);
    });

    it("should return false when some actions lack templates", () => {
      const data: CreateJourneyFormData = {
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
      expect(validateAllActionsHaveTemplates(data)).toBe(false);
      expect(toast.error).toHaveBeenCalled();
    });

    it("should return true when actions is undefined", () => {
      const data: CreateJourneyFormData = {
        nudgeSelection: {},
      } as any;
      expect(validateAllActionsHaveTemplates(data)).toBe(true);
    });
  });

  describe("getEngagementsWithoutTemplates", () => {
    it("should return empty array when all actions have templates with content", () => {
      const actions = [
        {
          template: {
            children: [{ type: "Text" }],
          },
        },
      ];
      expect(getEngagementsWithoutTemplates(actions)).toEqual([]);
    });

    it("should return actions without templates", () => {
      const actions = [
        {
          template: null,
        },
        {
          template: {
            children: [{ type: "Text" }],
          },
        },
      ];
      const result = getEngagementsWithoutTemplates(actions);
      expect(result).toHaveLength(1);
      expect(result[0].template).toBeNull();
    });

    it("should return actions with empty templates", () => {
      const actions = [
        {
          template: {
            props: {},
            children: [],
            styles: {},
          },
        },
      ];
      const result = getEngagementsWithoutTemplates(actions);
      expect(result).toHaveLength(1);
    });

    it("should return empty array when actions is undefined", () => {
      expect(getEngagementsWithoutTemplates(undefined)).toEqual([]);
    });
  });

  describe("validateEngagementsBeforeTabChange", () => {
    it("should return isValid true when all engagements have templates", () => {
      const actions = [
        {
          template: {
            children: [{ type: "Text" }],
          },
        },
      ];
      const result = validateEngagementsBeforeTabChange(actions);
      expect(result.isValid).toBe(true);
    });

    it("should return isValid false when some engagements lack templates", () => {
      const actions = [
        {
          template: null,
        },
      ];
      const result = validateEngagementsBeforeTabChange(actions);
      expect(result.isValid).toBe(false);
      expect(result.message).toBeDefined();
    });

    it("should return isValid true when actions is undefined", () => {
      const result = validateEngagementsBeforeTabChange(undefined);
      expect(result.isValid).toBe(true);
    });
  });
});
