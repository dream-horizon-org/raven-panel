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
import {
  CtaFrequency,
  CtaGroupByInput,
} from "@/api/services/types/createJourney.interface";
import { JourneyRule } from "../types/journeyRule.interface";
import { extractAllTemplateVariables } from "./extractTemplateVariables.utils";

const transformDeeplinkParams = (node: ReactNativeJson): ReactNativeJson => {
  if (!node || typeof node !== "object") {
    return node;
  }

  if (Array.isArray(node.actions)) {
    node.actions = node.actions.map((action) => {
      // Handle deeplink params
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

      // Handle analyticsEvent and emitNativeEvent params - ensure value is in array format
      if (
        (action.type === "analyticsEvent" &&
          action.name === "analyticsEvent") ||
        (action.type === "emitNativeEvent" && action.name === "emitNativeEvent")
      ) {
        if (
          action.params &&
          typeof action.params === "object" &&
          "eventParams" in action.params
        ) {
          const eventParams = action.params as {
            eventName?: string;
            eventParams?: Array<{
              name: string;
              type: string;
              value?:
                | string
                | number
                | boolean
                | Array<{
                    value: string | number | boolean;
                    isTemplateString: boolean;
                  }>;
            }>;
          };

          const transformedEventParams =
            eventParams.eventParams?.map((param) => {
              // If value is already an array, convert boolean strings to actual booleans if needed
              if (Array.isArray(param.value)) {
                // For emitNativeEvent, ensure boolean strings are converted to actual booleans
                if (
                  action.type === "emitNativeEvent" &&
                  param.type === "boolean"
                ) {
                  const firstItem = param.value[0];
                  if (
                    typeof firstItem === "object" &&
                    firstItem !== null &&
                    "value" in firstItem
                  ) {
                    let convertedValue = firstItem.value;
                    if (typeof firstItem.value === "string") {
                      const lowerValue = firstItem.value.toLowerCase().trim();
                      convertedValue = lowerValue === "true";
                    }
                    return {
                      ...param,
                      value: [
                        {
                          value: convertedValue,
                          isTemplateString: false,
                        },
                      ],
                    };
                  }
                }
                return param;
              }

              // If value is a primitive, convert to array format
              if (
                param.value !== undefined &&
                param.value !== null &&
                (typeof param.value === "string" ||
                  typeof param.value === "number" ||
                  typeof param.value === "boolean")
              ) {
                // For emitNativeEvent, convert boolean strings to actual booleans
                let finalValue = param.value;
                if (
                  action.type === "emitNativeEvent" &&
                  param.type === "boolean" &&
                  typeof param.value === "string"
                ) {
                  const lowerValue = param.value.toLowerCase().trim();
                  finalValue = lowerValue === "true";
                }

                return {
                  ...param,
                  value: [
                    {
                      value: finalValue,
                      isTemplateString: false,
                    },
                  ],
                };
              }

              return param;
            }) || [];

          return {
            ...action,
            params: {
              eventName: eventParams.eventName || "",
              eventParams: transformedEventParams,
            },
          };
        }
      }

      return action;
    });
  }

  if (Array.isArray(node.children)) {
    node.children = node.children.map(transformDeeplinkParams);
  }

  return node;
};

export function buildJourneyRule(
  formData: CreateJourneyFormData
): JourneyRule {
  // Get manually added context params
  const manualContextParams: string[] =
    formData.contextParams?.map((param) => param.label).filter(Boolean) || [];

  // Extract template variables from all actions
  const templateVariables = extractAllTemplateVariables(
    formData.nudgeSelection.actions
  );

  // Combine both, removing duplicates
  const allContextParams = new Set([
    ...manualContextParams,
    ...Array.from(templateVariables),
  ]);

  const contextParams: string[] = Array.from(allContextParams);

  const groupByConfig: CtaGroupByInput = {
    groupByKeys: [],
    maxActiveStateMachineCount: 20,
  };

  const priority = formData.schedule.priority || 1;
  const stateMachineTTL = 10800000;
  const resetCTAonFirstLaunch = true;

  // Build stateTransition
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

  // Build frequency - same logic as normal journey (no enable flag checks)
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

  // Build actions
  const baseTimestamp = Date.now();
  const actionIds =
    formData.nudgeSelection.actions?.map(
      (action, index) => action.actionId || `${index}_${baseTimestamp}`
    ) || [];

  const actions =
    formData.nudgeSelection.actions?.map((action, index) => {
      const actionId = actionIds[index];
      const apiActionType: NudgeType = action.type;

      // Handle NUDGE_ACTION (Native Event Emitter) - transform template to ensure boolean values
      if (action.type === NudgeType.NUDGE_ACTION) {
        const nudgeEventTemplate = action.template as NudgeEvent;

        // Transform eventParams to convert boolean strings to actual booleans
        const transformedTemplate: NudgeEvent = {
          eventName: nudgeEventTemplate.eventName || "",
          eventParams: (nudgeEventTemplate.eventParams || []).map((param) => {
            if (param.type === "boolean" && param.value && Array.isArray(param.value) && param.value.length > 0) {
              const firstItem = param.value[0];
              
              if (
                firstItem &&
                !firstItem.isTemplateString &&
                "value" in firstItem &&
                typeof firstItem.value === "string"
              ) {
                const lowerValue = firstItem.value.toLowerCase().trim();
                const convertedValue = lowerValue === "true";
                return {
                  ...param,
                  value: [
                    {
                      ...firstItem,
                      value: convertedValue,
                    },
                  ],
                };
              }
            }
            return param;
          }),
        };

        return {
          config: {
            triggerDelay: action.config?.triggerDelay || 1000,
          },
          actionId,
          type: apiActionType,
          template: transformedTemplate,
        };
      }

      // Handle UI engagements (POPUP, TOOLTIP, NUDGE_UI) - transform template
      let templateToStringify: ReactNativeJson = action.template as ReactNativeJson;

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
        template: templateToStringify || ({} as ReactNativeJson),
      };
    }) || [];

  // Build stateToAction
  const stateToAction: Record<string, string> = {};
  formData.nudgeSelection.actions?.forEach((action, index) => {
    const nextState = action.onState || "1";
    const actionId = actionIds[index];
    if (nextState && actionId) {
      if (!stateToAction[nextState]) {
        stateToAction[nextState] = actionId;
      } else {
        console.warn(
          `[buildJourneyRule] Multiple actions found for state ${nextState}. Keeping first action: ${stateToAction[nextState]}, skipping: ${actionId}`
        );
      }
    }
  });

  // Extract resetStates
  const resetStates =
    formData.nudgeSelection.resetStates &&
    formData.nudgeSelection.resetStates.length > 0
      ? formData.nudgeSelection.resetStates
      : ["1"];

  return {
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
  };
}
