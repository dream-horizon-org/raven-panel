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
    groupBy: string[];
    priority: number;
    stateMachineTTL: number;
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
    frequency: {
      session: {
        limit: number;
      };
      window: {
        limit: number;
        unit: string;
        value: number;
      };
    };
    resetStates: string[];
  };
}

export interface TestJourneyResponse {
  data: number; // ctaId
}

