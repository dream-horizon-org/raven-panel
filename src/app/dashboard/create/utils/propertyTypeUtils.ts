import { NUMERIC_TYPES } from "../constants/journeyConstants";
import { PropertyType } from "../types/journeyTypes";

/**
 * Boolean type that should render as dropdown
 */
const BOOLEAN_TYPE: PropertyType = "boolean";

/**
 * String type that should render as text input
 */
const STRING_TYPE: PropertyType = "string";

/**
 * Check if a property type is numeric
 */
export const isNumericType = (type: string): boolean => {
  return NUMERIC_TYPES.includes(type.toLowerCase() as PropertyType);
};

/**
 * Check if a property type is boolean
 */
export const isBooleanType = (type: string): boolean => {
  return type.toLowerCase() === BOOLEAN_TYPE;
};

/**
 * Check if a property type is string
 */
export const isStringType = (type: string): boolean => {
  return type.toLowerCase() === STRING_TYPE;
};

/**
 * Get the input type for a property type
 */
export const getInputType = (type: string): "number" | "text" | "select" => {
  if (isNumericType(type)) {
    return "number";
  }
  if (isBooleanType(type)) {
    return "select";
  }
  return "text";
};

/**
 * Convert comparison value to appropriate type based on property type
 */
export const convertComparisonValue = (
  value: string | number,
  propertyType: string
): string | number => {
  if (isNumericType(propertyType)) {
    // Convert to number for numeric types
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? value : numValue;
  }
  // Keep as string for non-numeric types
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
