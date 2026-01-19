import { NudgeType, ReactNativeJson } from "./journey.interface";
import { CtaFrequency, CtaGroupByInput } from "@/api/services/types/createJourney.interface";

export interface JourneyRule {
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
    template: ReactNativeJson;
  }>;
  resetStates: string[];
}

