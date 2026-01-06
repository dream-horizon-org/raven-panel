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

export const transformFormDataToTestApiFormat = (
  formData: CreateJourneyFormData
): TestJourneyRequest => {
  // Extract test journey values from formData
  const userIdsString = formData.testFeature?.userIds || "";
  const expireInMins = formData.testFeature?.expireInMins || 30;

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

  // Ensure expiresInMinutes is always a valid positive number (default 30)
  const expiresInMinutesToUse = expireInMins && expireInMins > 0 
    ? expireInMins 
    : 30;
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

      // Extract type for action level, but remove it from nudgeTemplate
      // The API contract requires type at action level, NOT in nudgeTemplate
      let actionTypeString: string;
      if (templateToStringify?.type) {
        const templateTypeMapping: Record<string, string> = {
          NUDGE_UI: "BottomSheet",
          POPUP: "POPUP",
          TOOLTIP: "TOOLTIP",
        };
        // Extract type for action level
        actionTypeString = 
          templateTypeMapping[templateToStringify.type] ||
          templateToStringify.type;
        
        // Remove type from template (it should NOT be in nudgeTemplate per API contract)
        const { type: _removedType, ...restTemplate } = templateToStringify;
        templateToStringify = restTemplate as ReactNativeJson;
        void _removedType;
      } else {
        // If no type in template, derive from action.type
        const apiActionType: NudgeType = action.type;
        const typeMapping: Record<string, string> = {
          NUDGE_UI: "BottomSheet",
          POPUP: "POPUP",
          TOOLTIP: "TOOLTIP",
        };
        actionTypeString = typeMapping[apiActionType] || String(apiActionType);
      }

      templateToStringify = transformDeeplinkParams(templateToStringify);

      // Add triggerDelay to nudgeTemplate.config if not present
      const templateWithConfig = templateToStringify as any;
      if (!templateWithConfig.config) {
        templateToStringify = {
          ...templateToStringify,
          config: {
            triggerDelay: action.config?.triggerDelay || 1000,
          },
        } as ReactNativeJson;
      } else if (!templateWithConfig.config.triggerDelay) {
        templateToStringify = {
          ...templateToStringify,
          config: {
            ...templateWithConfig.config,
            triggerDelay: action.config?.triggerDelay || 1000,
          },
        } as ReactNativeJson;
      }

      // Transform to API contract format: { actionId: { type, nudgeId, nudgeTemplate } }
      // Note: nudgeId might be optional or derived from actionId - using actionId as nudgeId for now
      // nudgeTemplate should NOT contain type field (type is only at action level)
      return {
        [actionId]: {
          type: actionTypeString,
          nudgeId: actionId, // Using actionId as nudgeId - adjust if you have a different source
          nudgeTemplate: templateToStringify, // No type field in nudgeTemplate
        },
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
  const frequency = {
    session: {
      limit: formData.journeyFrequency?.timesInSession || 1,
    },
    window: {
      limit: formData.journeyFrequency?.maxTimesInPeriod || 1,
      unit: formData.journeyFrequency?.periodUnit || "days",
      value: formData.journeyFrequency?.periodValue || 2,
    },
  };

  // Calculate ctaValidTill based on expiresInMinutes (always valid number)
  const ctaValidTill = Date.now() + expiresInMinutesToUse * 60 * 1000;

  // Extract groupBy from contextParams or stateMachine (if available)
  // Based on your API spec, it seems groupBy should come from formData
  // You may need to adjust this based on where groupBy is stored in your form
  const groupBy: string[] = []; // Extract from formData if available

  // Build request payload - previousCtaId is not included in body
  // For updates, it's in the URL path; for creates, it's not needed
  // Note: expiresInMinutes is NOT in the request body per API contract
  // It's only used internally to calculate ctaValidTill
  const requestPayload: TestJourneyRequest = {
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
    },
  };

  return requestPayload;
};

