import {
  CreateJourneyFormData,
  Filter,
  FilterFunction,
  FilterGroup,
  NudgeType,
  NudgeSelectionPopupMenu,
  NudgeSelectionTooltipMenu,
  ReactNativeJson,
} from "../types/journey.interface";
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

export function buildJourneyRule(
  formData: CreateJourneyFormData
): JourneyRule {
  const contextParams: string[] =
    formData.contextParams?.map((param) => param.label).filter(Boolean) || [];

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

  // Build actions
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
        const {
          templateVariantId: _removed,
          ...restProps
        } = templateToStringify.props;
        templateToStringify = {
          ...templateToStringify,
          props: restProps,
        };
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

      const apiActionType: NudgeType = action.type;

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

