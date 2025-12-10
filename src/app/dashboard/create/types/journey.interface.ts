import type { Node } from "@xyflow/react";
import type {
  JourneyNodeData,
  Engagement,
} from "./JourneyNode.interface";

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

// New Campaign Form Types
export type OperatorType = "AND" | "OR" | null | string;

export type Metadata = {
  ctaTitle: string;
  description?: string;
  tags: { id: number; label: string | null }[];
  team: string;
};

export type Cohort = {
  includedCohorts: string[];
  exculdedCohorts: string[];
  rollout: string;
  maximumUserCount: string;
  pilotUserId: string;
};

export type Schedule = {
  startType?: "immediate" | "scheduled";
  enableImmediateStart?: boolean;
  enableScheduledStart?: boolean;
  startDate?: string | null;
  startTime?: string | null;
  startDateTime?: string | null;
  enableScheduledEnd?: boolean;
  endDate?: string | null;
  endTime?: string | null;
  endDateTime?: string | null;
  priority: number | null;
};

export type Filter = {
  propertyName: { label: string; isLocal: boolean };
  propertyType: string;
  comparisonType: string;
  comparisonValue: string | boolean | number;
  componentType: string;
};

export type FilterGroup = {
  operator: OperatorType;
  filter: FilterArray;
  componentType: string;
};

export type FilterFunction = {
  funProp2: { label: string; isLocal: boolean };
  functionOperator: OperatorType | null;
  funProp1: { label: string; isLocal: boolean };
  comparisonType: OperatorType | null;
  comparisonValue: number | null;
  componentType: string;
};

export type FilterArray = (Filter | FilterGroup | FilterFunction)[];

export type Filters = {
  operator: OperatorType;
  filter: FilterArray;
};

export type NextState = {
  transitionTo: number;
  filters: Filters;
};

export type CurrentState = {
  currentState: number;
  nextState: NextState[];
};

export type Events = {
  id: string;
  label: string;
};

export type CohortEligibilityInput = {
  includedCohorts: string[];
  excludedCohorts: string[];
  rollout: string;
  maximumUserCount: string;
  pilotUserId: string;
};

export type CtaGroupByInput = {
  groupBy: string[];
};

export type CtaFrequency = {
  timesInSession: number;
  maxTimesInPeriod: number;
  periodValue: number;
  periodUnit: "days" | "hours" | "weeks" | "months";
  maxTimesInLifetime: number;
};

export type StateTransitionStringified = {
  fromState: string;
  toState: string;
  filters: Filters;
};

export enum NudgeType {
  TOOLTIP = "TOOLTIP",
  NUDGE_UI = "NUDGE_UI",
  POPUP = "POPUP",
}

export enum NudgeSelectionPopupMenu {
  DEFAULT = "Default",
  POPUP_WITH_SINGLE_BUTTON = "Popup with single button",
  CUSTOM = "Custom",
}

export enum NudgeSelectionTooltipMenu {
  DEFAULT = "Default",
}

export type EventInfo = {
  eventname: string;
  currentState: CurrentState[];
};

export type RuleEngineType = {
  currentDropdownSelectedEvent: {
    id: number;
    label: string;
  } | null;
  eventInfo: EventInfo[];
};

export type StateMachineType = {
  states: CurrentState[];
  events: Events[];
};

// React Native JSON Template Types
export type DynamicTextStaticType = {
  isTemplateString: false;
  value: string | number | boolean;
};

export type DynamicTextDynamicType = {
  isTemplateString: true;
  variableName: string;
  default: string | number | boolean;
  variableType: DynamicTextDataType;
};

export type DynamicTextValueType = (
  | DynamicTextStaticType
  | DynamicTextDynamicType
)[];

export type DynamicTextDataType = "string" | "number" | "boolean" | "url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DynamicArrayValueType = any; // Define based on your needs

export type ElementDataTypeValues = Record<
  string,
  | string
  | number
  | boolean
  | DynamicTextValueType
  | DynamicArrayValueType
  | null
  | undefined
>;

export interface NudgeEvent {
  eventName: string;
  eventParams: Array<{
    name: string;
    type: "string" | "boolean" | "number";
    value?: DynamicTextValueType;
  }>;
}

export type ReactNativeGlobalStyle = Partial<{
  // Text styles
  fontSize: number;
  color: string;
  textAlign: "left" | "center" | "right" | "justify";
  lineHeight: number;

  // Flex styles
  flex: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: number | string;
  flexDirection: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";

  // Border styles
  borderRadius: number;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;

  // Margin
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;

  // Padding
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;

  // Size
  height: number | string;
  width: number | string;
  maxHeight: number | string;
  maxWidth: number | string;
  minWidth: number | string;
  minHeight: number | string;
  aspectRatio: number;
}>;

export interface ReactNativeJson {
  type: string;
  styles?: ReactNativeGlobalStyle;
  props: ElementDataTypeValues & {
    testID: string;
  };
  children?: Array<ReactNativeJson>;
  actions?: Array<
    | {
        type: string;
        name: string;
        params: ElementDataTypeValues;
      }
    | {
        type: "analyticsEvent";
        name: "analyticsEvent";
        params: NudgeEvent;
      }
  >;
}

export interface NudgeSelectionHookForm {
  actions: Array<{
    config: {
      triggerDelay: number;
    };
    onState: string | undefined;
    actionId: string;
    type: NudgeType;
    variant?: NudgeSelectionPopupMenu | NudgeSelectionTooltipMenu;
    template: ReactNativeJson;
    isNudgeValid: boolean;
  }>;
  resetStates: Array<string>;
}

export type ContentElement = {
  id: string;
  type: "view" | "text" | "image";
  componentType: string;
  // View properties
  orientation?: "vertical" | "horizontal";
  children?: ContentElement[];
  // Spacing
  margin?: {
    top: number;
    bottom: number;
    right: number;
    left: number;
  };
  padding?: {
    top: number;
    bottom: number;
    right: number;
    left: number;
  };
  // Text properties
  textContent?: string;
  // Image properties
  imageSource?: string;
  clickAction?: string;
  occupyFullWidth?: boolean;
};

export type JourneyFrequency = {
  enableTimesInSession?: boolean;
  timesInSession: number;
  enableMaxTimesInPeriod?: boolean;
  maxTimesInPeriod: number;
  periodValue: number;
  periodUnit: string;
  enableMaxTimesInLifetime?: boolean;
  maxTimesInLifetime: number;
};

export type CampaignFormType = {
  ctaMetadata: Metadata;
  selectCohort: Cohort;
  schedule: Schedule;
  journeyFrequency?: JourneyFrequency;
  ruleEngine: RuleEngineType;
  contextParams: { id: number; label: string }[];
  stateMachine: StateMachineType;
  filterFunctionSeleted: { filterSelected: string };
  nudgeSelection: NudgeSelectionHookForm;
};

// Alias for backward compatibility
export type CreateJourneyFormData = CampaignFormType;

/**
 * Type definition for syncEngagementToAction function
 * Syncs engagement data from flow nodes to form actions
 */
export type SyncEngagementToActionType = (
  node: Node<JourneyNodeData>,
  engagement: Engagement,
  stateNumber: string,
  currentActions: CreateJourneyFormData["nudgeSelection"]["actions"]
) => CreateJourneyFormData["nudgeSelection"]["actions"];


export type NextStateTransition = {
  transitionTo: string | number;
  filters: {
    operator: string;
    filter: Array<{
      propertyName: string;
      propertyType: string;
      comparisonType: string;
      comparisonValue: string;
    }>;
  };
};

export  interface FilterInput {
  propertyName?: { label: string; isLocal: boolean } | string;
  propertyType?: string;
  comparisonType?: string;
  comparisonValue?: string | boolean | number;
  operator?: string;
  filter?: FilterInput[];
};