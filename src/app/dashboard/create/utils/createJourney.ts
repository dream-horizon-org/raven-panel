import {
  CreateCtaInput,
  CohortEligibilityInput,
  CtaFrequency,
  CtaGroupByInput,
} from "@/api/services/types/createJourney.interface";
import {
  CreateJourneyFormData,
  NudgeType,
  ReactNativeJson,
} from "../types/journeyTypes";

export const transformFormDataToApiFormat = (
  formData: CreateJourneyFormData
): CreateCtaInput => {
  const cohortEligibility: CohortEligibilityInput = {
    includes: ["real_time_nudge_internal"],
    excludes: formData.selectCohort.exculdedCohorts || [],
  };

  const contextParams: string[] =
    formData.contextParams?.map((param) => param.label).filter(Boolean) || [];

  const groupByConfig: CtaGroupByInput = {
    groupByKeys: [],
    maxActiveStateMachineCount: 20,
  };

  const priority = formData.schedule.priority || 1;

  const stateMachineTTL = 10800000;

  const resetCTAonFirstLaunch = true;

  const stateTransition: Record<
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
  > = {};

  formData.ruleEngine.eventInfo?.forEach((eventInfo) => {
    const eventName = eventInfo.eventname;
    if (!eventName) return;

    stateTransition[eventName] = {};

    eventInfo.currentState?.forEach((state) => {
      const currentState = String(state.currentState);
      if (!currentState) return;

      stateTransition[eventName][currentState] = [];

      state.nextState?.forEach((nextState) => {
        const transformFilter = (filter: any): any => {
          if (!filter) return null;

          if ("propertyName" in filter && "comparisonType" in filter) {
            return {
              propertyName:
                typeof filter.propertyName === "object"
                  ? filter.propertyName.label
                  : filter.propertyName,
              propertyType: filter.propertyType || "string",
              comparisonType: filter.comparisonType || "=",
              comparisonValue: filter.comparisonValue,
            };
          }

          if ("operator" in filter && "filter" in filter) {
            return {
              operator: filter.operator || "AND",
              filter: filter.filter?.map(transformFilter).filter(Boolean) || [],
            };
          }

          return null;
        };

        const filters = nextState.filters || {};
        const transformedFilters =
          filters.filter?.map(transformFilter).filter(Boolean) || [];

        stateTransition[eventName][currentState].push({
          transitionTo: Number(nextState.transitionTo),
          filters: {
            operator: filters.operator || "AND",
            filter: transformedFilters,
          },
        });
      });
    });
  });

  const frequency: CtaFrequency = {
    lifespan: {
      limit: formData.journeyFrequency?.maxTimesInLifetime || 1000,
    },
    session: {
      limit: formData.journeyFrequency?.timesInSession || 1000,
    },
    window: {
      limit: formData.journeyFrequency?.maxTimesInPeriod || 1000,
      value: formData.journeyFrequency?.periodValue || 1000,
      unit: formData.journeyFrequency?.periodUnit || "days",
    },
  };

  const baseTimestamp = Date.now();
  const actionIds =
    formData.nudgeSelection.actions?.map(
      (action, index) => action.actionId || `${index}_${baseTimestamp}`
    ) || [];

  const actions =
    formData.nudgeSelection.actions?.map((action, index) => {
      const actionId = actionIds[index];
      let templateToStringify: ReactNativeJson = action.template;

      // Remove templateVariantId from props
      if (templateToStringify?.props?.templateVariantId) {
        const { templateVariantId, ...restProps } = templateToStringify.props;
        templateToStringify = {
          ...templateToStringify,
          props: restProps,
        };
      }

      if (templateToStringify?.type) {
        const templateTypeMapping: Record<string, string> = {
          NUDGE_UI: "BottomSheet",
          POPUP: "POPUP",
          TOOLTIP: "TOOLTIP",
        };
        templateToStringify = {
          ...templateToStringify,
          type:
            templateTypeMapping[templateToStringify.type] ||
            templateToStringify.type,
        };
      }

      templateToStringify;

      const apiActionType: NudgeType = action.type;

      return {
        config: {
          triggerDelay: action.config?.triggerDelay || 1000,
        },
        actionId,
        type: apiActionType,
        variant: action.variant || "Default",
        template: templateToStringify,
      };
    }) || [];

  const stateToAction: Record<string, string> = {};
  formData.nudgeSelection.actions?.forEach((action, index) => {
    const nextState = action.onState || "1";
    const actionId = actionIds[index];
    if (nextState && actionId) {
      stateToAction[nextState] = actionId;
    }
  });

  const resetStates =
    formData.nudgeSelection.resetStates &&
    formData.nudgeSelection.resetStates.length > 0
      ? formData.nudgeSelection.resetStates
      : ["1"];

  let startTime: number | null = null;
  if (formData.schedule.startType === "immediate") {
    startTime = Date.now();
  } else if (formData.schedule.startType === "scheduled") {
    if (formData.schedule.startDate && formData.schedule.startTime) {
      const dateTimeString = `${formData.schedule.startDate}T${formData.schedule.startTime}`;
      startTime = new Date(dateTimeString).getTime();
    }
  } else if (formData.schedule.startDateTime) {
    startTime = new Date(formData.schedule.startDateTime).getTime();
  }

  let endTime: number | null = null;
  if (formData.schedule.endDate && formData.schedule.endTime) {
    const dateTimeString = `${formData.schedule.endDate}T${formData.schedule.endTime}`;
    endTime = new Date(dateTimeString).getTime();
  } else if (formData.schedule.endDateTime) {
    endTime = new Date(formData.schedule.endDateTime).getTime();
  }

  const tags =
    formData.ctaMetadata.tags?.map((tag) => tag.label || "").filter(Boolean) ||
    [];

  return {
    name: formData.ctaMetadata.ctaTitle || "",
    description: formData.ctaMetadata.description || "",
    team: formData.ctaMetadata.team || "",
    tags,
    startTime,
    endTime,
    rule: {
      cohortEligibility,
      contextParams,
      groupByConfig,
      priority,
      stateMachineTTL,
      resetCTAonFirstLaunch,
      stateTransition,
      frequency,
      stateToAction,
      actions,
      resetStates,
    },
  };
};
