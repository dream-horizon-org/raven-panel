import {
  CreateCtaInput,
  CohortEligibilityInput,
  CtaFrequency,
  CtaGroupByInput,
} from "@/api/services/types/createJourney.interface";
import {
  CreateJourneyFormData,
  Filter,
  FilterFunction,
  FilterGroup,
  NudgeType,
  NudgeSelectionPopupMenu,
  NudgeSelectionTooltipMenu,
  ReactNativeJson,
  NudgeEvent,
} from "../types/journey.interface";

export const transformFormDataToApiFormat = (
  formData: CreateJourneyFormData
): CreateCtaInput => {
  const cohortEligibility: CohortEligibilityInput = {
    includes: formData.selectCohort.includedCohorts || [],
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
        const transformFilter = (
          filter: Filter | FilterGroup | FilterFunction | null | undefined
        ):
          | {
              propertyName: string;
              propertyType: string;
              comparisonType: string;
              comparisonValue: string;
            }
          | {
              operator: string;
              filter: Array<{
                propertyName: string;
                propertyType: string;
                comparisonType: string;
                comparisonValue: string;
              }>;
            }
          | null => {
          if (!filter) return null;

          if ("propertyName" in filter && "comparisonType" in filter) {
            return {
              propertyName:
                typeof filter.propertyName === "object"
                  ? filter.propertyName.label
                  : String(filter.propertyName || ""),
              propertyType: filter.propertyType || "string",
              comparisonType: filter.comparisonType || "=",
              comparisonValue: String(filter.comparisonValue || ""),
            };
          }

          if ("operator" in filter && "filter" in filter) {
            return {
              operator: (filter.operator || "AND") as string,
              filter:
                filter.filter?.map(transformFilter).filter(
                  (
                    f
                  ): f is {
                    propertyName: string;
                    propertyType: string;
                    comparisonType: string;
                    comparisonValue: string;
                  } => f !== null && "propertyName" in f
                ) || [],
            };
          }

          return null;
        };

        const filters = nextState.filters || {};
        const transformedFilters =
          filters.filter?.map(transformFilter).filter(
            (
              f
            ): f is {
              propertyName: string;
              propertyType: string;
              comparisonType: string;
              comparisonValue: string;
            } => f !== null && "propertyName" in f
          ) || [];

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
      limit:
        formData.journeyFrequency?.enableMaxTimesInLifetime &&
        formData.journeyFrequency?.maxTimesInLifetime !== null &&
        formData.journeyFrequency?.maxTimesInLifetime !== undefined
          ? formData.journeyFrequency.maxTimesInLifetime
          : 999,
    },
    session: {
      limit:
        formData.journeyFrequency?.enableTimesInSession &&
        formData.journeyFrequency?.timesInSession !== null &&
        formData.journeyFrequency?.timesInSession !== undefined
          ? formData.journeyFrequency.timesInSession
          : 999,
    },
    window: {
      limit:
        formData.journeyFrequency?.enableMaxTimesInPeriod &&
        formData.journeyFrequency?.maxTimesInPeriod !== null &&
        formData.journeyFrequency?.maxTimesInPeriod !== undefined
          ? formData.journeyFrequency.maxTimesInPeriod
          : 999,
      value:
        formData.journeyFrequency?.enableMaxTimesInPeriod &&
        formData.journeyFrequency?.periodValue !== null &&
        formData.journeyFrequency?.periodValue !== undefined
          ? formData.journeyFrequency.periodValue
          : 999,
      unit: formData.journeyFrequency?.periodUnit || "days",
    },
  };

  const baseTimestamp = Date.now();
  const actionIds =
    formData.nudgeSelection.actions?.map(
      (action, index) => action.actionId || `${index}_${baseTimestamp}`
    ) || [];

  const transformDeeplinkParams = (node: ReactNativeJson): ReactNativeJson => {
    if (!node || typeof node !== "object") {
      return node;
    }

    if (Array.isArray(node.actions)) {
      node.actions = node.actions.map((action) => {
        if (
          action.type === "deeplink" &&
          action.params &&
          typeof action.params === "object"
        ) {
          const params = { ...action.params };

          if (params.androidUrl && typeof params.androidUrl === "string") {
            params.androidUrl = [
              {
                value: params.androidUrl,
                isTemplateString: false,
              },
            ];
          }

          if (params.iosUrl && typeof params.iosUrl === "string") {
            params.iosUrl = [
              {
                value: params.iosUrl,
                isTemplateString: false,
              },
            ];
          }

          return {
            ...action,
            params,
          };
        }
        return action;
      });
    }

    if (Array.isArray(node.children)) {
      node.children = node.children.map(transformDeeplinkParams);
    }

    return node;
  };

  const actions =
    formData.nudgeSelection.actions?.map((action, index) => {
      const actionId = actionIds[index];
      const apiActionType: NudgeType = action.type;

      // Handle NUDGE_ACTION (Native Event Emitter) - use template as-is
      if (action.type === NudgeType.NUDGE_ACTION) {
        return {
          config: {
            triggerDelay: action.config?.triggerDelay || 1000,
          },
          actionId,
          type: apiActionType,
          template: action.template, // NudgeEvent - use as-is
        };
      }

      // Handle UI engagements (POPUP, TOOLTIP, NUDGE_UI) - transform template
      let templateToStringify: ReactNativeJson = action.template as ReactNativeJson;

      // Remove templateVariantId from props
      if (templateToStringify?.props?.templateVariantId) {
        // Remove templateVariantId from props by destructuring
        const {
          templateVariantId: _removed,
          ...restProps
        } = templateToStringify.props;
        templateToStringify = {
          ...templateToStringify,
          props: restProps,
        };
        // Explicitly reference to avoid unused variable warning
        void _removed;
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

      templateToStringify = transformDeeplinkParams(templateToStringify);

      let variant:
        | NudgeSelectionPopupMenu
        | NudgeSelectionTooltipMenu
        | undefined = action.variant;
      if (!variant && templateToStringify?.props?.templateVariantId) {
        const templateVariantIdValue =
          typeof templateToStringify.props.templateVariantId === "string"
            ? templateToStringify.props.templateVariantId
            : String(templateToStringify.props.templateVariantId || "");

        // Cast to appropriate variant type based on action type
        // Check if the value matches any enum value
        if (action.type === NudgeType.POPUP) {
          if (
            Object.values(NudgeSelectionPopupMenu).includes(
              templateVariantIdValue as NudgeSelectionPopupMenu
            )
          ) {
            variant = templateVariantIdValue as NudgeSelectionPopupMenu;
          }
        } else if (action.type === NudgeType.TOOLTIP) {
          if (
            Object.values(NudgeSelectionTooltipMenu).includes(
              templateVariantIdValue as NudgeSelectionTooltipMenu
            )
          ) {
            variant = templateVariantIdValue as NudgeSelectionTooltipMenu;
          }
        }
      }
      const apiVariant = variant || undefined;

      return {
        config: {
          triggerDelay: action.config?.triggerDelay || 1000,
        },
        actionId,
        type: apiActionType,
        variant: apiVariant,
        template: templateToStringify,
      };
    }) || [];

  const stateToAction: Record<string, string> = {};
  formData.nudgeSelection.actions?.forEach((action, index) => {
    const nextState = action.onState || "1";
    const actionId = actionIds[index];
    if (nextState && actionId) {
      if (!stateToAction[nextState]) {
        stateToAction[nextState] = actionId;
      } else {
        console.warn(
          `[createJourney] Multiple actions found for state ${nextState}. Keeping first action: ${stateToAction[nextState]}, skipping: ${actionId}`
        );
      }
    }
  });

  const resetStates =
    formData.nudgeSelection.resetStates &&
    formData.nudgeSelection.resetStates.length > 0
      ? formData.nudgeSelection.resetStates
      : ["1"];

  let startTime: number | null = null;
  if (formData.schedule.enableImmediateStart === true) {
    startTime = Date.now();
  } else if (formData.schedule.enableScheduledStart === true) {
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
