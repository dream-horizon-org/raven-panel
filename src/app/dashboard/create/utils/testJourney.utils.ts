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
import { TestJourneyRequest } from "@/api/services/testJourney.service";
import { DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS } from "../constants/journeyConstants";

export const transformFormDataToTestApiFormat = (
  formData: CreateJourneyFormData
): TestJourneyRequest => {
  // Extract test journey values from formData
  const userIdsString = formData.testFeature?.userIds || "";
  const expireInMins = formData.testFeature?.expireInMins || DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS;
  const previousCtaId = formData.testFeature?.prevCtaId
    ? parseInt(formData.testFeature.prevCtaId, 10)
    : null;

  // Validate and convert userIds string to array
  if (!userIdsString.trim()) {
    throw new Error("User IDs are required");
  }

  // Parse comma-separated user IDs
  const userIdsArray = userIdsString
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  if (userIdsArray.length === 0) {
    throw new Error("At least one user ID is required");
  }

  // Convert to numbers and validate
  const userIds = userIdsArray.map(id => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    return numId;
  });

  // Ensure expiresInMinutes is always a valid positive number
  const expiresInMinutesToUse = expireInMins && expireInMins > 0 
    ? expireInMins 
    : DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS;
  // Only extract contextParams - no cohorts needed
  const contextParams: string[] =
    formData.contextParams?.map((param) => param.label).filter(Boolean) || [];

  const priority = formData.schedule.priority || 1;
  const stateMachineTTL = 10800000; // Same as regular journey

  // Build stateTransition (same as regular journey)
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

  // Build actions with nudgeTemplate (not just template)
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
      let templateToStringify: ReactNativeJson = action.template;

      // Extract variant before removing templateVariantId
      let variant: string | undefined = action.variant;
      if (!variant && templateToStringify?.props?.templateVariantId) {
        variant = String(templateToStringify.props.templateVariantId);
      }

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

      // Map template type for template level (NUDGE_UI -> BottomSheet)
      if (templateToStringify?.type) {
        const templateTypeMapping: Record<string, string> = {
          NUDGE_UI: "BottomSheet",
          POPUP: "POPUP",
          TOOLTIP: "TOOLTIP",
        };
        templateToStringify = {
          ...templateToStringify,
          type: templateTypeMapping[templateToStringify.type] || templateToStringify.type,
        };
      }

      templateToStringify = transformDeeplinkParams(templateToStringify);

      // Use original action type for action level (NUDGE_UI, POPUP, TOOLTIP)
      const apiActionType: NudgeType = action.type;

      // Return same format as regular journey
      return {
        config: {
          triggerDelay: action.config?.triggerDelay || 1000,
        },
        actionId,
        type: apiActionType, // "NUDGE_UI", "POPUP", "TOOLTIP"
        variant: variant || undefined,
        template: templateToStringify, // Template with type field (e.g., "BottomSheet")
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
      }
    }
  });

  // Frequency - only session and window (no lifespan)
  // Use 999 as default when frequency options are disabled or values are not set
  const frequency = {
    session: {
      limit: formData.journeyFrequency?.enableTimesInSession 
        ? (formData.journeyFrequency?.timesInSession ?? 999)
        : 999,
    },
    window: {
      limit: formData.journeyFrequency?.enableMaxTimesInPeriod
        ? (formData.journeyFrequency?.maxTimesInPeriod ?? 999)
        : 999,
      unit: formData.journeyFrequency?.periodUnit || "days",
      value: formData.journeyFrequency?.enableMaxTimesInPeriod
        ? (formData.journeyFrequency?.periodValue ?? 999)
        : 999,
    },
  };

  // Calculate ctaValidTill based on expiresInMinutes (always valid number)
  const ctaValidTill = Date.now() + expiresInMinutesToUse * 60 * 1000;

  // Extract groupBy from contextParams or stateMachine (if available)
  // Based on your API spec, it seems groupBy should come from formData
  // You may need to adjust this based on where groupBy is stored in your form
  const groupBy: string[] = []; // Extract from formData if available

  // Extract resetStates - critical for allowing engagement to show multiple times
  // If resetStates are not provided, default to ["1"] to allow state machine to reset
  const resetStates =
    formData.nudgeSelection.resetStates &&
    formData.nudgeSelection.resetStates.length > 0
      ? formData.nudgeSelection.resetStates
      : ["1"];

  // Build request payload
  const requestPayload: TestJourneyRequest = {
    ...(previousCtaId && { previousCtaId }), // Include if exists (for updates)
    expiresInMinutes: expiresInMinutesToUse, // Include in request body
    userIds,
    rule: {
      stateToAction,
      contextParams,
      stateTransition,
      groupBy,
      priority,
      stateMachineTTL,
      ctaValidTill,
      actions,
      frequency,
      resetStates,
    },
  };

  return requestPayload;
};

