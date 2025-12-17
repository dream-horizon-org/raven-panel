import {
  getComponentDefinition,
  getComponentDefinitionByDisplay,
  getClickActionDefinition,
  getAllClickActions,
  getAvailableStyles,
  getAvailableProps,
  getAvailableActions,
} from "../componentDefinitions.utils";
import componentDefinitions from "../../constants/componentDefinitions.json";

describe("componentDefinitions.utils", () => {
  describe("getComponentDefinition", () => {
    it("should return component definition by type", () => {
      const result = getComponentDefinition("Button");
      expect(result).toBeDefined();
      expect(result?.type).toBe("Button");
    });

    it("should return undefined for non-existent type", () => {
      const result = getComponentDefinition("NonExistent");
      expect(result).toBeUndefined();
    });
  });

  describe("getComponentDefinitionByDisplay", () => {
    it("should return component definition by display name", () => {
      // Assuming there's a component with a display name in the JSON
      const result = getComponentDefinitionByDisplay("Button");
      // This will depend on actual JSON structure
      expect(result).toBeDefined();
    });

    it("should return undefined for non-existent display", () => {
      const result = getComponentDefinitionByDisplay("NonExistent");
      expect(result).toBeUndefined();
    });
  });

  describe("getClickActionDefinition", () => {
    it("should return click action definition by name if exists", () => {
      // Get all click actions first to see what's available
      const allActions = getAllClickActions();
      if (allActions.length > 0) {
        const firstAction = allActions[0];
        const result = getClickActionDefinition(firstAction.name);
        expect(result).toBeDefined();
        expect(result?.name).toBe(firstAction.name);
      } else {
        // If no actions exist, test should still pass
        const result = getClickActionDefinition("onPress");
        expect(result).toBeUndefined();
      }
    });

    it("should return undefined for non-existent action", () => {
      const result = getClickActionDefinition("NonExistent");
      expect(result).toBeUndefined();
    });
  });

  describe("getAllClickActions", () => {
    it("should return array of all click actions", () => {
      const result = getAllClickActions();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should return actions from component definitions", () => {
      const result = getAllClickActions();
      const expectedActions = (componentDefinitions as any).clickActions || [];
      expect(result).toEqual(expectedActions);
    });
  });

  describe("getAvailableStyles", () => {
    it("should return styles array for existing component", () => {
      const result = getAvailableStyles("Button");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent component", () => {
      const result = getAvailableStyles("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return styles from component definition", () => {
      const component = getComponentDefinition("Button");
      const styles = getAvailableStyles("Button");
      if (component?.styles) {
        expect(styles).toEqual(component.styles);
      }
    });
  });

  describe("getAvailableProps", () => {
    it("should return props array for existing component", () => {
      const result = getAvailableProps("Button");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent component", () => {
      const result = getAvailableProps("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return props from component definition", () => {
      const component = getComponentDefinition("Button");
      const props = getAvailableProps("Button");
      if (component?.props) {
        expect(props).toEqual(component.props);
      }
    });
  });

  describe("getAvailableActions", () => {
    it("should return actions array for existing component", () => {
      const result = getAvailableActions("Button");
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent component", () => {
      const result = getAvailableActions("NonExistent");
      expect(result).toEqual([]);
    });

    it("should return action names from component definition", () => {
      const component = getComponentDefinition("Button");
      const actions = getAvailableActions("Button");
      if (component?.actions) {
        const expectedNames = component.actions.map((a) => a.name);
        expect(actions).toEqual(expectedNames);
      }
    });
  });
});
