import {
  DynamicTextValueType,
  DynamicTextStaticType,
  DynamicTextDynamicType,
} from "../types/journey.interface";

/**
 * Parses a string with {{}} syntax into DynamicTextValueType
 * @param str - String with template variables like "Hello {{name;default:\"Guest\"}}"
 * @returns Array of static and dynamic text parts
 * @example
 * parseTemplateString("Hello {{name}}!") 
 * // Returns: [
 * //   { isTemplateString: false, value: "Hello " },
 * //   { isTemplateString: true, variableName: "name", default: "", variableType: "string" },
 * //   { isTemplateString: false, value: "!" }
 * // ]
 */
export function parseTemplateString(str: string): DynamicTextValueType {
  if (!str) return [];
  
  const result: DynamicTextValueType = [];
  const regex = /\{\{([^}]*)\}\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    // Add static text before the template
    if (match.index > lastIndex) {
      const staticText = str.substring(lastIndex, match.index);
      if (staticText.length > 0) {
        result.push({
          isTemplateString: false,
          value: staticText,
        } as DynamicTextStaticType);
      }
    }

    // Parse template variable with optional default value
    // Format: {{propertyName;default:"value"}} or {{propertyName;default:value}}
    const content = match[1];
    let variableName = "";
    let defaultValue: string | number | boolean = "";
    
    if (content.includes(";default:")) {
      const [varPart, defaultPart] = content.split(";default:");
      variableName = varPart.trim();
      
      // Parse default value
      const parsedDefault = defaultPart.trim();
      
      // Check if value is quoted (string literal)
      if ((parsedDefault.startsWith('"') && parsedDefault.endsWith('"')) ||
          (parsedDefault.startsWith("'") && parsedDefault.endsWith("'"))) {
        // Remove quotes - it's explicitly a string
        defaultValue = parsedDefault.slice(1, -1);
      } else {
        // No quotes - keep as-is (will be treated as string in storage)
        // This ensures {{prop;default:1}} stays as "1" (string)
        defaultValue = parsedDefault;
      }
    } else {
      variableName = content.trim();
    }
    
    result.push({
      isTemplateString: true,
      variableName: variableName,
      default: defaultValue,
      variableType: "string",
    } as DynamicTextDynamicType);

    lastIndex = regex.lastIndex;
  }

  // Add remaining static text
  if (lastIndex < str.length) {
    const staticText = str.substring(lastIndex);
    if (staticText.length > 0) {
      result.push({
        isTemplateString: false,
        value: staticText,
      } as DynamicTextStaticType);
    }
  }

  // Only filter out truly empty strings (length 0), keep spaces
  const filteredResult = result.filter((item) => {
    if (item.isTemplateString) {
      return true;
    }
    return String(item.value).length > 0;
  });

  return filteredResult.length > 0 ? filteredResult : [{ isTemplateString: false, value: str } as DynamicTextStaticType];
}

/**
 * Converts DynamicTextValueType back to string with {{}} syntax
 * @param value - Array of static and dynamic text parts
 * @returns String with template variables formatted as {{variableName;default:"value"}}
 * @example
 * stringifyTemplate([
 *   { isTemplateString: false, value: "Hello " },
 *   { isTemplateString: true, variableName: "name", default: "Guest", variableType: "string" }
 * ])
 * // Returns: "Hello {{name;default:\"Guest\"}}"
 */
export function stringifyTemplate(value: DynamicTextValueType | undefined): string {
  if (!value || value.length === 0) return "";
  
  return value
    .map((item) => {
      if (item.isTemplateString) {
        // Always include default value syntax
        // Convert default value to string (always use quotes for consistency)
        const defaultStr = item.default !== undefined && item.default !== null 
          ? String(item.default) 
          : "";
        return `{{${item.variableName};default:"${defaultStr}"}}`;
      }
      return String(item.value);
    })
    .join("");
}

