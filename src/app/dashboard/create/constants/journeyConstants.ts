import { OperatorType, PropertyType } from "../types/journeyTypes";

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

export const OPERATOR_TYPES: Array<{
  value: OperatorType;
  label: string;
}> = [
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
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
    UI_CONTENT: "UI & Content",
  },
  SECTIONS: {
    COHORT: {
      TITLE: "Segments",
      TOOLTIP: "Segment information",
      DESCRIPTION: "Select whether you want to target all users or segments",
      LABEL: "User Set",
    },
    EVENT_TRIGGER: {
      TITLE: "Trigger",
      TOOLTIP:
        "Event triggered journeys will start when a specific event occurs",
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
      TIMES_IN_SESSION: "Allow user to enter journey up to",
      TIMES_IN_SESSION_SUFFIX: "time(s) in a session",
      MAX_TIMES_IN_PERIOD: "Allow user to enter journey up to",
      MAX_TIMES_IN_PERIOD_MIDDLE: "time(s) in",
      MAX_TIMES_IN_LIFETIME: "Allow user to enter journey up to",
      MAX_TIMES_IN_LIFETIME_SUFFIX: "time(s) in lifetime",
    },
    UI_CONTENT: {
      TITLE: "UI & Content",
      DESCRIPTION: "UI & Content configuration will be available here.",
    },
  },
  FILTERS: {
    BUTTON: "Add Filter",
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
  ctaMetadata: {
    ctaTitle: "",
    description: "",
    tags: [],
    team: "",
  },
  selectCohort: {
    includedCohorts: [],
    exculdedCohorts: [],
    rollout: "",
    maximumUserCount: "",
    pilotUserId: "",
  },
  schedule: {
    startType: "immediate",
    enableImmediateStart: false,
    enableScheduledStart: false,
    startDate: null,
    startTime: null,
    startDateTime: null,
    enableScheduledEnd: false,
    endDate: null,
    endTime: null,
    endDateTime: null,
    priority: null,
  },
  journeyFrequency: {
    enableTimesInSession: false,
    timesInSession: 999,
    enableMaxTimesInPeriod: false,
    maxTimesInPeriod: 999,
    periodValue: 999,
    periodUnit: "days" as const,
    enableMaxTimesInLifetime: false,
    maxTimesInLifetime: 999,
  },
  ruleEngine: {
    currentDropdownSelectedEvent: null,
    eventInfo: [],
  },
  contextParams: [],
  stateMachine: {
    states: [],
    events: [],
  },
  filterFunctionSeleted: {
    filterSelected: "",
  },
  nudgeSelection: {
    actions: [],
    resetStates: [],
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
