import { FilterOperator } from "../constants/journeyConstants";

export interface CreateJourneyFormData {
  name: string;
  cohort: string;
  event: string;
  filters: {
    property: string;
    operator: FilterOperator;
    value: string;
  }[];
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
