import { PropertyType } from "../types/journeyTypes";

export type FilterOperator = "=" | ">" | "<" | ">=" | "<=";

export const OPERATORS: Array<{
  value: FilterOperator;
  label: string;
}> = [
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: ">=" },
  { value: "<=", label: "<=" },
];

export const EVENT_OPTIONS = [
  { value: "app_open", label: "App Open" },
  { value: "purchase", label: "Purchase" },
  { value: "signup", label: "Sign Up" },
  { value: "login", label: "Login" },
  { value: "page_view", label: "Page View" },
] as const;

export const COHORT_OPTIONS = [{ value: "all", label: "All" }] as const;

export const JOURNEY_TEXT = {
  HEADER: {
    PLACEHOLDER: "Journey Setup",
    TOOLTIP: "Journey info",
  },
  TABS: {
    SETUP: "Journey Setup",
    UI_CONTENT: "Content",
  },
  SECTIONS: {
    COHORT: {
      TITLE: "Cohort",
      TOOLTIP: "Cohort information",
      DESCRIPTION: "Select whether you want to target all users or segments",
      LABEL: "User Set",
    },
    EVENT_TRIGGER: {
      TITLE: "Event Trigger",
      TOOLTIP: "Event Trigger information",
      DESCRIPTION: "Select the event that will trigger this journey",
      LABEL: "Event",
    },
    SCHEDULE: {
      TITLE: "Schedule",
      START_DATE_TIME: {
        TITLE: "Start date/time",
        DESCRIPTION: "Specify when the journey starts.",
        IMMEDIATE: "As soon as journey is published",
        SCHEDULED: "At specific date/time",
        DATE_LABEL: "beginning on",
        TIME_LABEL: "ending on",
      },
      END_DATE_TIME: {
        TITLE: "End date/time",
        DESCRIPTION: "Specify when the journey ends.",
        PAUSED: "Till the journey is paused",
        SCHEDULED: "At specific date/time",
        DATE_LABEL: "ending on",
      },
    },
    JOURNEY_FREQUENCY: {
      TITLE: "Journey Frequency",
      TOOLTIP: "Journey Frequency information",
      TIMES_IN_SESSION: "Show Journey",
      TIMES_IN_SESSION_SUFFIX: "time(s) in a session",
      MAX_TIMES_IN_PERIOD: "Show Journey a maximum of",
      MAX_TIMES_IN_PERIOD_MIDDLE: "time(s) in",
      MAX_TIMES_IN_LIFETIME: "Show Journey a maximum of",
      MAX_TIMES_IN_LIFETIME_SUFFIX: "time(s) in lifetime",
    },
    UI_CONTENT: {
      TITLE: "UI & Content",
      DESCRIPTION: "UI & Content configuration will be available here.",
    },
  },
  FILTERS: {
    BUTTON: "Filter property",
    PROPERTY: "Property",
    OPERATOR: "Operator",
    VALUE: "Value",
    PLACEHOLDER: "Enter value",
  },
  VALIDATION: {
    NAME_REQUIRED: "Journey name is required",
    EVENT_REQUIRED: "Event is required",
    PROPERTY_REQUIRED: "Property is required",
    VALUE_REQUIRED: "Value is required",
  },
  ACTIONS: {
    CANCEL: "Cancel",
    NEXT: "Next",
    CREATE_JOURNEY: "Create Journey",
  },
} as const;

export const getJourneyFormDefaults = () => ({
  name: "",
  cohort: "",
  event: "",
  condition: {
    operator: "AND" as const,
    comparisons: [
      {
        propertyName: "",
        propertyType: "string" as const,
        comparisonType: "=" as const,
        comparisonValue: "",
      },
    ],
  },
  schedule: {
    startType: "immediate" as const,
    startDate: "",
    startTime: "",
    endType: "scheduled" as const,
    endDate: "",
    endTime: "",
  },
  journeyFrequency: {
    timesInSession: 1,
    maxTimesInPeriod: 1,
    periodValue: 1,
    periodUnit: "days" as const,
    maxTimesInLifetime: 1,
  },
});

/**
 * Numeric types that should render as number inputs
 */
export const NUMERIC_TYPES: PropertyType[] = [
  "integer",
  "long",
  "double",
  "decimal",
  "float",
];
