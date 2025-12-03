import { ReactNativeJson } from "@/app/dashboard/create/types/journeyTypes";

export interface GetJourneyResponse {
  data: {
    id: number;
    rule: {
      cohortEligibility: {
        includes: string[];
        excludes: string[];
      };
      stateToAction: Record<string, string>;
      resetStates: string[];
      resetCTAonFirstLaunch: boolean;
      contextParams: string[];
      stateTransition: Record<
        string,
        Record<
          string,
          Array<{
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
          }>
        >
      >;
      groupByConfig: {
        maxActiveStateMachineCount: number;
        groupByKeys: string[];
      };
      priority: number;
      stateMachineTTL: number;
      actions: Array<{
        config: {
          triggerDelay: number;
        };
        actionId: string;
        type: string;
        variant?: string;
        template: ReactNativeJson;
      }>;
      frequency: {
        session: {
          limit: number;
        };
        lifespan: {
          limit: number;
        };
        window: {
          limit: number;
          unit: string;
          value: number;
        };
      };
    };
    ctaStatus: string;
    name: string;
    description: string;
    tags: string[];
    team: string;
    behaviourTags: string[];
    startTime: number;
    endTime: number;
    createdAt: number;
    createdBy: string;
    lastUpdatedAt: number;
    lastUpdatedBy: string;
    tenantId: string;
  };
}
