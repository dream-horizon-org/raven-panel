import componentDefinitionsData from "../constants/componentDefinitions.json";

export interface ComponentDefinition {
  id: number;
  componentVariant: string;
  type: string;
  display: string;
  description: string;
  maxAllowedChildren: number;
  props?: Array<{
    name: string;
    type: string;
    isTemplate?: boolean;
    isRequired?: boolean;
    default?: string | number | boolean | null;
    acceptedValues?: string[];
  }>;
  styles?: string[];
  actions?: Array<{
    name: string;
  }>;
  config?: Record<string, any>;
}

export interface ClickActionDefinition {
  id: string;
  type: string;
  name: string;
  display: string;
  category: "toggle" | "dropdown";
  executionOrder: number;
  params?: Array<{
    name: string;
    type: string;
    isTemplate?: boolean | null;
    default?: string | number | boolean | null;
    acceptedValues?: string[] | null;
    isRequired?: boolean;
  }>;
}

export interface ComponentDefinitionsData {
  components: ComponentDefinition[];
  clickActions: ClickActionDefinition[];
}

const componentDefinitions = componentDefinitionsData as ComponentDefinitionsData;

export const getComponentDefinition = (
  type: string
): ComponentDefinition | undefined => {
  return componentDefinitions.components.find((comp) => comp.type === type);
};

export const getClickActionDefinition = (
  name: string
): ClickActionDefinition | undefined => {
  return componentDefinitions.clickActions.find((action) => action.name === name);
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

