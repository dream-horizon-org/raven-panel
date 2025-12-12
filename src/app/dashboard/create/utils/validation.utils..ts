import { Path } from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
} from "../types/journey.interface";
import { ComponentDefinition } from "../types/journey.interface";
import { getComponentDefinition } from "./componentDefinitions.utils";

const getComponentTypeForValidation = (type: string): string => {
  if (type === "NUDGE_UI" || type === "BOTTOMSHEET") {
    return "BottomSheet";
  }
  return type;
};

export const isEmptyValue = (value: unknown): boolean => {
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

export const getPropValue = (propValue: unknown): unknown => {
  if (Array.isArray(propValue) && propValue.length > 0) {
    const firstItem = propValue[0];
    if (firstItem && typeof firstItem === "object" && "value" in firstItem) {
      return firstItem.value;
    }
    return propValue[0];
  }
  return propValue;
};

export const isValidColor = (color: string): boolean => {
  if (!color || typeof color !== "string") return false;
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color.trim());
};

export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

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
  if (styleName === "fontWeight" || styleName === "lineHeight") {
    return "string";
  }
  return "number";
};

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

export const validatePropValue = (
  prop: NonNullable<ComponentDefinition["props"]>[number],
  propValue: unknown
): { isValid: boolean; message?: string } => {
  const actualValue = getPropValue(propValue);

  if (prop.isRequired && isEmptyValue(propValue)) {
    return { isValid: false, message: `${prop.name} is required` };
  }

  if (isEmptyValue(propValue)) {
    return { isValid: true };
  }

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

export const validateStyleValue = (
  styleName: string,
  styleValue: unknown
): { isValid: boolean; message?: string } => {
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
        if (trimmedValue === "") {
          return { isValid: true };
        }
        if (styleName === "width" || styleName === "height") {
          if (/^\d+(\.\d+)?%$/.test(trimmedValue)) {
            return { isValid: true };
          }
          const numValue = Number(trimmedValue);
          if (!isNaN(numValue)) {
            return { isValid: true };
          }
          return {
            isValid: false,
            message: `Expected a number or percentage value (e.g., 100 or "100%")`,
          };
        }
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

export const validateElementProps = (
  elementProps: Record<string, unknown> | undefined,
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

export const validateElementStyles = (
  elementStyles: Record<string, unknown> | undefined,
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
      setError(stylePath, {
        type: "validation",
        message: validation.message || "Invalid value",
      });
      hasErrors = true;
    }
  }

  return !hasErrors;
};

export const validateElementActions = (
  elementActions: Array<Record<string, unknown>> | undefined,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  if (!elementActions || !Array.isArray(elementActions)) {
    return true;
  }

  let hasErrors = false;

  elementActions.forEach((action, index: number) => {
    if (!action || typeof action !== "object") {
      return;
    }

    if (action.type === "deeplink" && action.params) {
      const params = action.params as Record<string, unknown> & {
        androidUrl?: string | unknown;
        iosUrl?: string | unknown;
      };
      const actionBasePath = `${basePath}.actions.${index}` as Path<
        CreateJourneyFormData
      >;

      if (params.androidUrl !== undefined && params.androidUrl !== null) {
        const androidUrlValue =
          typeof params.androidUrl === "string"
            ? params.androidUrl
            : Array.isArray(params.androidUrl) && params.androidUrl.length > 0
            ? params.androidUrl[0]?.value || params.androidUrl[0]
            : "";

        const androidUrlPath = `${actionBasePath}.params.androidUrl` as Path<
          CreateJourneyFormData
        >;

        if (!androidUrlValue || typeof androidUrlValue !== "string") {
          setError(androidUrlPath, {
            type: "required",
            message: "Android URL is required",
          });
          hasErrors = true;
        } else if (!isValidUrl(androidUrlValue.trim())) {
          setError(androidUrlPath, {
            type: "validation",
            message: "Invalid Android URL format. Please enter a valid URL.",
          });
          hasErrors = true;
        } else {
          clearErrors(androidUrlPath);
        }
      } else {
        const androidUrlPath = `${actionBasePath}.params.androidUrl` as Path<
          CreateJourneyFormData
        >;
        setError(androidUrlPath, {
          type: "required",
          message: "Android URL is required",
        });
        hasErrors = true;
      }

      if (params.iosUrl !== undefined && params.iosUrl !== null) {
        const iosUrlValue =
          typeof params.iosUrl === "string"
            ? params.iosUrl
            : Array.isArray(params.iosUrl) && params.iosUrl.length > 0
            ? params.iosUrl[0]?.value || params.iosUrl[0]
            : "";

        const iosUrlPath = `${actionBasePath}.params.iosUrl` as Path<
          CreateJourneyFormData
        >;

        if (!iosUrlValue || typeof iosUrlValue !== "string") {
          setError(iosUrlPath, {
            type: "required",
            message: "iOS URL is required",
          });
          hasErrors = true;
        } else if (!isValidUrl(iosUrlValue.trim())) {
          setError(iosUrlPath, {
            type: "validation",
            message: "Invalid iOS URL format. Please enter a valid URL.",
          });
          hasErrors = true;
        } else {
          clearErrors(iosUrlPath);
        }
      } else {
        const iosUrlPath = `${actionBasePath}.params.iosUrl` as Path<
          CreateJourneyFormData
        >;
        setError(iosUrlPath, {
          type: "required",
          message: "iOS URL is required",
        });
        hasErrors = true;
      }
    }
  });

  return !hasErrors;
};

export const validateElement = (
  element: ReactNativeJson | undefined,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  if (!element || typeof element !== "object") {
    return true;
  }

  const isContainerType =
    element.type === "NUDGE_UI" ||
    element.type === "POPUP" ||
    element.type === "BOTTOMSHEET" ||
    element.type === "BottomSheet";

  const componentType = getComponentTypeForValidation(element.type);
  const componentDef = getComponentDefinition(componentType);

  let hasErrors = false;

  if (componentDef) {
    const propsValid = validateElementProps(
      element.props,
      componentDef,
      basePath,
      setError,
      clearErrors
    );
    if (!propsValid) {
      hasErrors = true;
    }

    const stylesValid = validateElementStyles(
      element.styles,
      componentDef,
      basePath,
      setError,
      clearErrors
    );
    if (!stylesValid) {
      hasErrors = true;
    }
  } else if (!isContainerType) {
  }

  if (element.actions && Array.isArray(element.actions)) {
    const actionsValid = validateElementActions(
      element.actions,
      basePath,
      setError,
      clearErrors
    );
    if (!actionsValid) {
      hasErrors = true;
    }
  }

  if (element.children && Array.isArray(element.children)) {
    element.children.forEach((child, index: number) => {
      const childBasePath = `${basePath}.children.${index}`;
      const childValid = validateElement(
        child,
        childBasePath,
        setError,
        clearErrors
      );
      if (!childValid) {
        hasErrors = true;
      }
    });
  }

  if (hasErrors) {
    return false;
  }
  return true;

  return !hasErrors;
};

export const validateTemplate = (
  template: ReactNativeJson | undefined,
  basePath: string,
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void,
  clearErrors: (path: Path<CreateJourneyFormData>) => void
): boolean => {
  if (!template) {
    return false;
  }

  const isValid = validateElement(template, basePath, setError, clearErrors);

  return isValid;
};
