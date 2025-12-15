import {
  ClickActionDefinition,
  ComponentDefinition,
} from "../types/journey.interface";
import { ComponentDefinitionsData } from "../types/journey.interface";
import componentDefinitionsData from "../constants/componentDefinitions.json";

const componentDefinitions = componentDefinitionsData as ComponentDefinitionsData;

export const getComponentDefinition = (
  type: string
): ComponentDefinition | undefined => {
  return componentDefinitions.components.find((comp) => comp.type === type);
};

export const getComponentDefinitionByDisplay = (
  display: string
): ComponentDefinition | undefined => {
  return componentDefinitions.components.find(
    (comp) => comp.display === display
  );
};

export const getClickActionDefinition = (
  name: string
): ClickActionDefinition | undefined => {
  return componentDefinitions.clickActions.find(
    (action) => action.name === name
  );
};

export const getAllClickActions = (): ClickActionDefinition[] => {
  return componentDefinitions.clickActions;
};

export const getAvailableStyles = (type: string): string[] => {
  const component = getComponentDefinition(type);
  return component?.styles || [];
};

export const getAvailableProps = (type: string) => {
  const component = getComponentDefinition(type);
  return component?.props || [];
};

export const getAvailableActions = (type: string): string[] => {
  const component = getComponentDefinition(type);
  return component?.actions?.map((a) => a.name) || [];
};

export default componentDefinitions;
