import { FilterOperator } from "../constants/journeyConstants";

export interface Comparison {
  propertyName: string;
  propertyType: "string" | "number" | "boolean"; // Normalized to simplified types
  comparisonType: FilterOperator;
  comparisonValue: string | number;
}

export interface ConditionData {
  operator: "AND" | "OR";
  comparisons: Comparison[];
}

export interface CreateJourneyFormData {
  name: string;
  cohort: string;
  event: string;
  condition: ConditionData;
  schedule: {
    startType: "immediate" | "scheduled";
    startDate: string;
    startTime: string;
    endType: "scheduled";
    endDate: string;
    endTime: string;
  };
  journeyFrequency: {
    timesInSession: number;
    maxTimesInPeriod: number;
    periodValue: number;
    periodUnit: "days" | "hours" | "weeks" | "months";
    maxTimesInLifetime: number;
  };
}

/**
 * Property type utilities for filter value inputs
 */

export type PropertyType =
  | "integer"
  | "long"
  | "double"
  | "decimal"
  | "float"
  | "string"
  | "boolean";

export interface PropertyTypeInfo {
  name: string;
  type: PropertyType;
}


export type ConditionComparisonsPath = `condition.comparisons.${number}.${keyof Comparison}`;
