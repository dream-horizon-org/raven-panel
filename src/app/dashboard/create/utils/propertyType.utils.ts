import { NUMERIC_TYPES } from "../constants/journeyConstants";
import { PropertyType } from "../types/journey.interface";

const BOOLEAN_TYPE: PropertyType = "boolean";

const STRING_TYPE: PropertyType = "string";

export const isNumericType = (type: string): boolean => {
  return NUMERIC_TYPES.includes(type.toLowerCase() as PropertyType);
};

export const isBooleanType = (type: string): boolean => {
  return type.toLowerCase() === BOOLEAN_TYPE;
};

export const isStringType = (type: string): boolean => {
  return type.toLowerCase() === STRING_TYPE;
};

export const getInputType = (type: string): "number" | "text" | "select" => {
  if (isNumericType(type)) {
    return "number";
  }
  if (isBooleanType(type)) {
    return "select";
  }
  return "text";
};

export const convertComparisonValue = (
  value: string | number,
  propertyType: string
): string | number => {
  if (isNumericType(propertyType)) {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? value : numValue;
  }
  return typeof value === "number" ? String(value) : value;
};

export const normalizePropertyType = (
  propertyType: string
): "string" | "number" | "boolean" => {
  const lowerType = propertyType.toLowerCase();
  if (isNumericType(lowerType)) {
    return "number";
  }
  if (isBooleanType(lowerType)) {
    return "boolean";
  }
  return "string";
};

export const extractSystemProperties = (
  systemPropertiesData:
    | {
        data?:
          | Array<{ propertyName: string; type?: string }>
          | {
              names?: string[];
              properties?: Array<
                string | { propertyName: string; type?: string }
              >;
              systemProperties?: Array<
                string | { propertyName: string; type?: string }
              >;
            };
      }
    | null
    | undefined
): {
  systemPropertyNames: string[];
  systemPropertyTypes: Map<string, string>;
} => {
  if (!systemPropertiesData) {
    return {
      systemPropertyNames: [],
      systemPropertyTypes: new Map<string, string>(),
    };
  }

  const data = systemPropertiesData.data;
  if (!data) {
    return {
      systemPropertyNames: [],
      systemPropertyTypes: new Map<string, string>(),
    };
  }

  const names: string[] = [];
  const types = new Map<string, string>();

  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (item?.propertyName) {
        names.push(item.propertyName);
        if (item.type) {
          const normalizedType = item.type.toLowerCase();
          types.set(item.propertyName, normalizedType);
        }
      }
    });
  } else if (Array.isArray(data.names)) {
    data.names.forEach((name: string) => {
      names.push(name);
    });
  } else if (Array.isArray(data.properties)) {
    data.properties.forEach(
      (prop: string | { propertyName: string; type?: string }) => {
        if (typeof prop === "string") {
          names.push(prop);
        } else if (prop?.propertyName) {
          names.push(prop.propertyName);
          if (prop.type) {
            const normalizedType = prop.type.toLowerCase();
            types.set(prop.propertyName, normalizedType);
          }
        }
      }
    );
  } else if (Array.isArray(data.systemProperties)) {
    data.systemProperties.forEach(
      (prop: string | { propertyName: string; type?: string }) => {
        if (typeof prop === "string") {
          names.push(prop);
        } else if (prop?.propertyName) {
          names.push(prop.propertyName);
          if (prop.type) {
            const normalizedType = prop.type.toLowerCase();
            types.set(prop.propertyName, normalizedType);
          }
        }
      }
    );
  }

  return { systemPropertyNames: names, systemPropertyTypes: types };
};
