import { ReactNativeJson, DynamicTextValueType } from "../types/journey.interface";

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
          (propValue as DynamicTextValueType).forEach((item) => {
            if (item.isTemplateString && item.variableName) {
              variables.add(item.variableName);
            }
          });
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
              (paramValue as DynamicTextValueType).forEach((item) => {
                if (item.isTemplateString && item.variableName) {
                  variables.add(item.variableName);
                }
              });
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
  actions: Array<{ template?: ReactNativeJson }> | undefined
): Set<string> {
  const allVariables = new Set<string>();

  if (!actions) return allVariables;

  actions.forEach((action) => {
    if (action.template) {
      const templateVariables = extractTemplateVariables(action.template);
      templateVariables.forEach((variable) => allVariables.add(variable));
    }
  });

  return allVariables;
}

