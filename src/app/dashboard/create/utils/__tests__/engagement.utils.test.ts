import { findTargetAction, getInitialTemplate } from "../engagement.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { ReactNativeJson } from "../../types/journey.interface";

describe("engagement.utils", () => {
  const mockActions: CreateJourneyFormData["nudgeSelection"]["actions"] = [
    {
      actionId: "action1_1234567890",
      type: "TOOLTIP" as any,
      config: { triggerDelay: 0 },
      onState: "1",
      isNudgeValid: true,
      template: {
        type: "TOOLTIP",
        props: { testID: "test1" },
        children: [],
        actions: [],
        styles: {},
      },
    },
    {
      actionId: "action2_1234567891",
      type: "POPUP" as any,
      config: { triggerDelay: 0 },
      onState: "1",
      isNudgeValid: true,
      template: {
        type: "POPUP",
        props: { testID: "test2" },
        children: [],
        actions: [],
        styles: {},
      },
    },
  ];

  describe("findTargetAction", () => {
    it("should return first action when engagementId is not provided", () => {
      const result = findTargetAction(mockActions);
      expect(result).toBe(mockActions[0]);
    });

    it("should return first action when actions array is empty", () => {
      const result = findTargetAction([]);
      expect(result).toBeUndefined();
    });

    it("should return first action when actions is undefined", () => {
      const result = findTargetAction(undefined as any);
      expect(result).toBeUndefined();
    });

    it("should find action by engagementId prefix", () => {
      const result = findTargetAction(mockActions, "action1");
      expect(result).toBe(mockActions[0]);
    });

    it("should find action by engagementId when actionId matches exactly", () => {
      const result = findTargetAction(mockActions, "action2");
      expect(result).toBe(mockActions[1]);
    });

    it("should return first action when engagementId does not match", () => {
      const result = findTargetAction(mockActions, "nonexistent");
      expect(result).toBe(mockActions[0]);
    });

    it("should handle actionId without underscore", () => {
      const actions = [
        {
          ...mockActions[0],
          actionId: "action1",
        },
      ];
      const result = findTargetAction(actions, "action1");
      expect(result).toBe(actions[0]);
    });
  });

  describe("getInitialTemplate", () => {
    it("should return template from first action when engagementId is not provided", () => {
      const result = getInitialTemplate(mockActions);
      expect(result).toEqual(mockActions[0].template);
      expect(result).not.toBe(mockActions[0].template); // Should be a copy
    });

    it("should return template from matching action by engagementId", () => {
      const result = getInitialTemplate(mockActions, "action2");
      expect(result).toEqual(mockActions[1].template);
      expect(result).not.toBe(mockActions[1].template); // Should be a copy
    });

    it("should return null when actions array is empty", () => {
      const result = getInitialTemplate([]);
      expect(result).toBeNull();
    });

    it("should return null when actions is undefined", () => {
      const result = getInitialTemplate(undefined as any);
      expect(result).toBeNull();
    });

    it("should return null when action has no template", () => {
      const actions = [
        {
          ...mockActions[0],
          template: null as any,
        },
      ];
      const result = getInitialTemplate(actions);
      expect(result).toBeNull();
    });

    it("should return deep copy of template", () => {
      const template: ReactNativeJson = {
        type: "TOOLTIP",
        props: { testID: "test", nested: { value: 1 } },
        children: [],
        actions: [],
        styles: {},
      };
      const actions = [
        {
          ...mockActions[0],
          template,
        },
      ];
      const result = getInitialTemplate(actions);
      expect(result).toEqual(template);
      expect(result).not.toBe(template);
      if (result && template.props) {
        expect(result.props).not.toBe(template.props);
      }
    });
  });
});
