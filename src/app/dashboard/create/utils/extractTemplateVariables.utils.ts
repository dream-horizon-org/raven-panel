import { ReactNativeJson, DynamicTextValueType, NudgeEvent } from "../types/journey.interface";

/**
 * Helper function to extract variables from DynamicTextValueType arrays
 */
function extractVariablesFromDynamicText(dynamicText: DynamicTextValueType): Set<string> {
  const variables = new Set<string>();
  dynamicText.forEach((item) => {
    if (item.isTemplateString && item.variableName) {
      variables.add(item.variableName);
    }
  });
  return variables;
}

/**
 * Extracts template variables from NudgeEvent
 */
function extractVariablesFromNudgeEvent(nudgeEvent: NudgeEvent): Set<string> {
  const variables = new Set<string>();
  
  if (nudgeEvent.eventParams) {
    nudgeEvent.eventParams.forEach((param) => {
      if (param.value && Array.isArray(param.value)) {
        const paramVariables = extractVariablesFromDynamicText(param.value);
        paramVariables.forEach((variable) => variables.add(variable));
      }
    });
  }
  
  return variables;
}

/**
 * Recursively extracts all template variable names from a ReactNativeJson template
 */
export function extractTemplateVariables(template: ReactNativeJson | null | undefined): Set<string> {
  const variables = new Set<string>();

  if (!template) return variables;

  // Extract from props
  if (template.props) {
    Object.values(template.props).forEach((propValue) => {
      if (Array.isArray(propValue)) {
        // Check if it's a DynamicTextValueType array
        const isDynamicTextArray = propValue.length > 0 && 
          typeof propValue[0] === "object" && 
          "isTemplateString" in propValue[0];
        
        if (isDynamicTextArray) {
          const propVariables = extractVariablesFromDynamicText(propValue as DynamicTextValueType);
          propVariables.forEach((variable) => variables.add(variable));
        }
      }
    });
  }

  // Extract from action params
  if (template.actions) {
    template.actions.forEach((action) => {
      if (action.params) {
        Object.values(action.params).forEach((paramValue) => {
          if (Array.isArray(paramValue)) {
            const isDynamicTextArray = paramValue.length > 0 && 
              typeof paramValue[0] === "object" && 
              "isTemplateString" in paramValue[0];
            
            if (isDynamicTextArray) {
              const paramVariables = extractVariablesFromDynamicText(paramValue as DynamicTextValueType);
              paramVariables.forEach((variable) => variables.add(variable));
            }
          }
        });
      }
    });
  }

  // Recursively extract from children
  if (template.children) {
    template.children.forEach((child) => {
      const childVariables = extractTemplateVariables(child);
      childVariables.forEach((variable) => variables.add(variable));
    });
  }

  return variables;
}

/**
 * Extracts all template variables from all actions in the form
 */
export function extractAllTemplateVariables(
  actions: Array<{ template?: ReactNativeJson | NudgeEvent }> | undefined
): Set<string> {
  const allVariables = new Set<string>();

  if (!actions) return allVariables;

  actions.forEach((action) => {
    if (action.template) {
      // Check if it's a NudgeEvent or ReactNativeJson
      if ("eventName" in action.template && "eventParams" in action.template) {
        // It's a NudgeEvent
        const eventVariables = extractVariablesFromNudgeEvent(action.template as NudgeEvent);
        eventVariables.forEach((variable) => allVariables.add(variable));
      } else {
        // It's a ReactNativeJson
        const templateVariables = extractTemplateVariables(action.template as ReactNativeJson);
        templateVariables.forEach((variable) => allVariables.add(variable));
      }
    }
  });

  return allVariables;
}

