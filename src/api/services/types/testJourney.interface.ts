import { NudgeType, ReactNativeJson } from "@/app/dashboard/create/types/journey.interface";

export interface TestJourneyRequest {
  previousCtaId?: number | null;
  expiresInMinutes?: number;
  userIds: number[];
  rule: {
    stateToAction: Record<string, string>;
    contextParams: string[];
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
    groupByConfig: CtaGroupByInput;
    priority: number;
    stateMachineTTL: number;
    resetCTAonFirstLaunch: boolean;
    ctaValidTill: number;
    actions: Array<{
      config: {
        triggerDelay: number;
      };
      actionId: string;
      type: NudgeType; 
      variant?: string;
      template: ReactNativeJson; 
    }>;
    frequency: CtaFrequency;
    resetStates: string[];
  };
}

export interface CtaGroupByInput {
  groupByKeys: string[];
  maxActiveStateMachineCount: number | undefined | null;
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

export interface TestJourneyResponse {
  data: number; // ctaId
}

