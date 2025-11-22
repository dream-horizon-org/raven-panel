import { Path } from "react-hook-form";
import { CreateJourneyFormData } from "../types/journeyTypes";
import {
  ComponentDefinition,
  getComponentDefinition,
} from "./componentDefinitions";

// Map form template types to component definition types
const getComponentTypeForValidation = (type: string): string => {
  // NUDGE_UI in form maps to BottomSheet in component definitions
  if (type === "NUDGE_UI" || type === "BOTTOMSHEET") {
    return "BottomSheet";
  }
  return type;
};

// Helper to check if a value is empty
export const isEmptyValue = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    const firstItem = value[0];
    if (firstItem && typeof firstItem === "object" && "value" in firstItem) {
      return !firstItem.value || String(firstItem.value).trim() === "";
    }
    return String(value[0] || "").trim() === "";
  }
  return false;
};

// Helper to extract actual value from prop
export const getPropValue = (propValue: any): any => {
  if (Array.isArray(propValue) && propValue.length > 0) {
    const firstItem = propValue[0];
    if (firstItem && typeof firstItem === "object" && "value" in firstItem) {
      return firstItem.value;
    }
    return propValue[0];
  }
  return propValue;
};

// Validate hex color format
export const isValidColor = (color: string): boolean => {
  if (!color || typeof color !== "string") return false;
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color.trim());
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get style type based on style name
export const getStyleType = (
  styleName: string
): "number" | "string" | "color" | "enum" => {
  if (
    styleName === "backgroundColor" ||
    styleName === "color" ||
    styleName === "borderColor"
  ) {
    return "color";
  }
  if (
    styleName === "flexDirection" ||
    styleName === "justifyContent" ||
    styleName === "alignItems" ||
    styleName === "textAlign"
  ) {
    return "enum";
  }
  if (
    styleName === "fontSize" ||
    styleName === "fontWeight" ||
    styleName === "lineHeight"
  ) {
    return "string";
  }
  return "number";
};

// Get enum values for style
export const getStyleEnumValues = (styleName: string): string[] | undefined => {
  if (styleName === "flexDirection") {
    return ["row", "column", "row-reverse", "column-reverse"];
  }
  if (styleName === "justifyContent") {
    return [
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
    ];
  }
  if (styleName === "alignItems") {
    return ["flex-start", "flex-end", "center", "stretch", "baseline"];
  }
  if (styleName === "textAlign") {
    return ["left", "center", "right", "justify"];
  }
  return undefined;
};

// Validate a single prop value
export const validatePropValue = (
  prop: NonNullable<ComponentDefinition["props"]>[number],
  propValue: any
): { isValid: boolean; message?: string } => {
  const actualValue = getPropValue(propValue);

  // Check required
  if (prop.isRequired && isEmptyValue(propValue)) {
    return { isValid: false, message: `${prop.name} is required` };
  }

  // Skip validation if empty and not required
  if (isEmptyValue(propValue)) {
    return { isValid: true };
  }

  // Validate by type
  switch (prop.type) {
    case "color":
      if (typeof actualValue !== "string" || !isValidColor(actualValue)) {
        return {
          isValid: false,
          message: `Invalid color format. Please use hex format (e.g., #FFFFFF)`,
        };
      }
      break;

    case "string":
      if (!prop.isTemplate && typeof actualValue !== "string") {
        return { isValid: false, message: `Expected a string value` };
      }
      break;

    case "number":
      if (typeof actualValue !== "number" || isNaN(actualValue)) {
        return { isValid: false, message: `Expected a number value` };
      }
      break;

    case "enum":
      if (
        prop.acceptedValues &&
        (typeof actualValue !== "string" ||
          !prop.acceptedValues.includes(actualValue))
      ) {
        return {
          isValid: false,
          message: `Must be one of: ${prop.acceptedValues.join(", ")}`,
        };
      }
      break;

    case "url":
      if (typeof actualValue !== "string" || !isValidUrl(actualValue)) {
        return {
          isValid: false,
          message: `Invalid URL format. Please enter a valid URL.`,
        };
      }
      break;
  }

  return { isValid: true };
};

// Validate a single style value
export const validateStyleValue = (
  styleName: string,
  styleValue: any
): { isValid: boolean; message?: string } => {
  // Skip if null/undefined or empty string (styles are optional)
  if (styleValue === null || styleValue === undefined || styleValue === "") {
    return { isValid: true };
  }

  const styleType = getStyleType(styleName);

  switch (styleType) {
    case "color": {
      const trimmedValue =
        typeof styleValue === "string" ? styleValue.trim() : String(styleValue);
      // If trimmed value is empty, treat as optional
      if (trimmedValue === "") {
        return { isValid: true };
      }
      if (typeof styleValue !== "string" || !isValidColor(trimmedValue)) {
        return {
          isValid: false,
          message: `Invalid color format. Please use hex format (e.g., #FFFFFF)`,
        };
      }
      break;
    }

    case "enum": {
      const enumValues = getStyleEnumValues(styleName);
      if (
        enumValues &&
        (typeof styleValue !== "string" || !enumValues.includes(styleValue))
      ) {
        return {
          isValid: false,
          message: `Must be one of: ${enumValues.join(", ")}`,
        };
      }
      break;
    }

    case "number": {
      if (typeof styleValue === "string") {
        const trimmedValue = styleValue.trim();
        // If empty string, treat as optional
        if (trimmedValue === "") {
          return { isValid: true };
        }
        // For width/height, allow percentage strings like "100%"
        if (styleName === "width" || styleName === "height") {
          // Check if it's a percentage string (e.g., "100%", "50%")
          if (/^\d+(\.\d+)?%$/.test(trimmedValue)) {
            return { isValid: true };
          }
          // Check if it's a valid number string
          const numValue = Number(trimmedValue);
          if (!isNaN(numValue)) {
            return { isValid: true };
          }
          return {
            isValid: false,
            message: `Expected a number or percentage value (e.g., 100 or "100%")`,
          };
        }
        // For other number styles, only accept numeric strings
        const numValue = Number(trimmedValue);
        if (isNaN(numValue)) {
          return { isValid: false, message: `Expected a number value` };
        }
      } else if (typeof styleValue !== "number" || isNaN(styleValue)) {
        return { isValid: false, message: `Expected a number value` };
      }
      break;
    }

    case "string": {
      if (typeof styleValue !== "string") {
        return { isValid: false, message: `Expected a string value` };
      }
      break;
    }
  }

  return { isValid: true };
};

// Validate props for an element
export const validateElementProps = (
  elementProps: Record<string, any> | undefined,
  componentDef: ComponentDefinition | undefined,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  if (!componentDef?.props) return true;

  let hasErrors = false;

  for (const prop of componentDef.props) {
    const propValue = elementProps?.[prop.name];
    const fieldPath = `${basePath}.props.${prop.name}` as Path<
      CreateJourneyFormData
    >;

    const validation = validatePropValue(prop, propValue);

    if (validation.isValid) {
      clearErrors(fieldPath);
    } else {
      console.log(`[Validation] Prop error at ${fieldPath}:`, {
        propName: prop.name,
        propValue,
        error: validation.message,
        basePath,
      });
      setError(fieldPath, {
        type: validation.message?.includes("required")
          ? "required"
          : "validation",
        message: validation.message || "Invalid value",
      });
      hasErrors = true;
    }
  }

  return !hasErrors;
};

// Validate styles for an element
export const validateElementStyles = (
  elementStyles: Record<string, any> | undefined,
  componentDef: ComponentDefinition | undefined,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  if (!componentDef?.styles) return true;

  const stylesToValidate = elementStyles || {};
  let hasErrors = false;

  for (const styleName of componentDef.styles) {
    const styleValue = stylesToValidate[styleName];
    const stylePath = `${basePath}.styles.${styleName}` as Path<
      CreateJourneyFormData
    >;

    // Skip if not present or empty (styles are optional)
    // Also check for empty string after trimming if it's a string
    if (
      styleValue === undefined ||
      styleValue === null ||
      styleValue === "" ||
      (typeof styleValue === "string" && styleValue.trim() === "")
    ) {
      clearErrors(stylePath);
      continue;
    }

    const validation = validateStyleValue(styleName, styleValue);

    if (validation.isValid) {
      clearErrors(stylePath);
    } else {
      console.log(`[Validation] Style error at ${stylePath}:`, {
        styleName,
        styleValue,
        error: validation.message,
        basePath,
      });
      setError(stylePath, {
        type: "validation",
        message: validation.message || "Invalid value",
      });
      hasErrors = true;
    }
  }

  return !hasErrors;
};

// Validate an element (props + styles) recursively
export const validateElement = (
  element: any,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  if (!element || typeof element !== "object") {
    console.log(`[Validation] Skipping invalid element at ${basePath}`);
    return true;
  }

  // NUDGE_UI (bottomsheet) and POPUP are container types without component definitions
  // TOOLTIP has props/styles at template level, so it has a component definition
  // Note: In form data, bottomsheet is stored as "NUDGE_UI", but in component definitions it's "BottomSheet"
  const isContainerType =
    element.type === "NUDGE_UI" ||
    element.type === "POPUP" ||
    element.type === "BOTTOMSHEET" ||
    element.type === "BottomSheet";

  // Map form type to component definition type (NUDGE_UI -> BottomSheet)
  const componentType = getComponentTypeForValidation(element.type);
  const componentDef = getComponentDefinition(componentType);

  console.log(`[Validation] Validating element at ${basePath}:`, {
    type: element.type,
    componentType,
    isContainerType,
    hasComponentDef: !!componentDef,
    hasProps: !!element.props,
    hasStyles: !!element.styles,
    childrenCount: element.children?.length || 0,
  });

  let hasErrors = false;

  // Only validate props/styles if we have a component definition
  // Template containers (NUDGE_UI, POPUP) don't have component definitions
  if (componentDef) {
    // Validate props
    const propsValid = validateElementProps(
      element.props,
      componentDef,
      basePath,
      setError,
      clearErrors
    );
    if (!propsValid) {
      console.log(`[Validation] Props validation failed at ${basePath}`);
      hasErrors = true;
    }

    // Validate styles
    const stylesValid = validateElementStyles(
      element.styles,
      componentDef,
      basePath,
      setError,
      clearErrors
    );
    if (!stylesValid) {
      console.log(`[Validation] Styles validation failed at ${basePath}`);
      hasErrors = true;
    }
  } else if (!isContainerType) {
    // If no component def and it's not a known container type, log a warning
    console.log(
      `[Validation] No component definition found for type "${element.type}" at ${basePath}`
    );
  }

  // Always validate children recursively (even for container types like NUDGE_UI/POPUP)
  if (element.children && Array.isArray(element.children)) {
    console.log(
      `[Validation] Validating ${element.children.length} children at ${basePath}`
    );
    element.children.forEach((child: any, index: number) => {
      const childBasePath = `${basePath}.children.${index}`;
      const childValid = validateElement(
        child,
        childBasePath,
        setError,
        clearErrors
      );
      if (!childValid) {
        console.log(`[Validation] Child validation failed at ${childBasePath}`);
        hasErrors = true;
      }
    });
  }

  if (hasErrors) {
    console.log(`[Validation] Element validation FAILED at ${basePath}`);
  } else {
    console.log(`[Validation] Element validation PASSED at ${basePath}`);
  }

  return !hasErrors;
};

// Validate entire template
export const validateTemplate = (
  template: any,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  console.log(`[Validation] Starting template validation at ${basePath}:`, {
    templateType: template?.type,
    hasChildren: !!template?.children,
    childrenCount: template?.children?.length || 0,
  });

  const isValid = validateElement(template, basePath, setError, clearErrors);

  console.log(
    `[Validation] Template validation ${
      isValid ? "PASSED" : "FAILED"
    } at ${basePath}`
  );

  return isValid;
};
