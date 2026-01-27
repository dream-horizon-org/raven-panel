import {
  NudgeType,
  ReactNativeJson,
  NudgeEvent,
} from "@/app/dashboard/create/types/journey.interface";

export interface CreateCtaInput {
  name: string;
  description: string;
  team: string;
  tags: string[];
  startTime: number | null;
  endTime: number | null;
  rule: RuleInput;
}

export interface RuleInput {
  cohortEligibility: CohortEligibilityInput;
  contextParams: string[];
  groupByConfig: CtaGroupByInput;
  priority: number;
  stateMachineTTL: number;
  resetCTAonFirstLaunch: boolean;
  stateTransition: Record<
    string,
    Record<
      string,
      Array<{
        transitionTo: number;
        filters: {
          operator: string;
          filter: Array<{
            propertyName: string;
            propertyType: string;
            comparisonType: string;
            comparisonValue: string;
          }>;
        };
      }>
    >
  >;
  frequency: CtaFrequency;
  stateToAction: Record<string, string>;
  actions: Array<{
    config: {
      triggerDelay: number;
    };
    actionId: string;
    type: NudgeType;
    variant?: string;
    template?: ReactNativeJson | NudgeEvent;
  }>;
  resetStates: Array<string>;
}

export interface CohortEligibilityInput {
  includes: string[];
  excludes: string[];
}

export interface CtaGroupByInput {
  groupByKeys: string[];
  maxActiveStateMachineCount: number | undefined | null;
}

export interface StateTransitionStringified {
  transitions: {
    currentState: string;
    nextStateConditions: {
      condition: string;
      transitionTo: string;
    }[];
  }[];
  event: string;
}

export interface ExposureRuleWindowInput {
  limit: number;
  value: number;
  unit: string;
}

export interface CtaFrequency {
  lifespan: CtaFrequencyMaxCountInput;
  session: CtaFrequencyMaxCountInput;
  window: ExposureRuleWindowInput;
}

export interface CtaFrequencyMaxCountInput {
  limit: number;
}
