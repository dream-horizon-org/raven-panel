import { CreateJourneyFormData } from "../types/journeyTypes";
import { NudgeType } from "../types/journeyTypes";
import { GetJourneyResponse } from "@/api/services/types/getJourney.interface";

export const parseJourneyDataToFormData = (
  apiResponse: GetJourneyResponse
): CreateJourneyFormData => {
  const apiData = apiResponse.data;
  const rule = apiData.rule || {};

  const cohortEligibility = rule.cohortEligibility || {
    includes: [],
    excludes: [],
  };

  const startTime = apiData.startTime || null;
  const endTime = apiData.endTime || null;
  const startType: "immediate" | "scheduled" = startTime
    ? "scheduled"
    : "immediate";

  let startDate: string | null = null;
  let startTimeStr: string | null = null;
  if (startTime) {
    const startDateObj = new Date(startTime);
    startDate = startDateObj.toISOString().split("T")[0];
    startTimeStr = startDateObj.toTimeString().slice(0, 5);
  }

  let endDate: string | null = null;
  let endTimeStr: string | null = null;
  if (endTime) {
    const endDateObj = new Date(endTime);
    endDate = endDateObj.toISOString().split("T")[0];
    endTimeStr = endDateObj.toTimeString().slice(0, 5);
  }

  const frequency = rule.frequency || {};
  const journeyFrequency = {
    enableTimesInSession: !!frequency.session?.limit,
    timesInSession: frequency.session?.limit || 999,
    enableMaxTimesInPeriod: !!frequency.window?.limit,
    maxTimesInPeriod: frequency.window?.limit || 999,
    periodValue: frequency.window?.value || 999,
    periodUnit: frequency.window?.unit || "days",
    enableMaxTimesInLifetime: !!frequency.lifespan?.limit,
    maxTimesInLifetime: frequency.lifespan?.limit || 999,
  };

  const stateTransition = rule.stateTransition || {};
  const eventInfo = Object.entries(stateTransition).map(
    ([eventName, transitions]: [string, any]) => {
      const currentStates = Object.entries(transitions).map(
        ([currentState, nextStates]: [string, any]) => {
          const nextStateArray = Array.isArray(nextStates) ? nextStates : [];
          const nextState = nextStateArray.map((ns: any) => {
            const filters = ns.filters || {};
            const filterArray = filters.filter || [];

            return {
              transitionTo: Number(ns.transitionTo),
              filters: {
                operator: filters.operator || "AND",
                filter: filterArray.map((f: any) => ({
                  propertyName: { label: f.propertyName, isLocal: false },
                  propertyType: f.propertyType || "string",
                  comparisonType: f.comparisonType || "=",
                  comparisonValue: f.comparisonValue,
                  componentType: "Filter",
                })),
              },
            };
          });

          return {
            currentState: Number(currentState),
            nextState,
          };
        }
      );

      return {
        eventname: eventName,
        currentState: currentStates,
      };
    }
  );

  const actions = rule.actions || [];
  const stateToAction = rule.stateToAction || {};

  const nudgeSelectionActions = actions.map((action: any, index: number) => {
    let nudgeType: NudgeType = NudgeType.TOOLTIP;
    if (action.type === "NUDGE_UI") {
      nudgeType = NudgeType.NUDGE_UI;
    } else if (action.type === "POPUP") {
      nudgeType = NudgeType.POPUP;
    } else if (action.type === "TOOLTIP") {
      nudgeType = NudgeType.TOOLTIP;
    }

    const transformDeeplinkParamsForForm = (node: any): any => {
      if (!node || typeof node !== "object") {
        return node;
      }

      if (Array.isArray(node.actions)) {
        node.actions = node.actions.map((action: any) => {
          if (
            action.type === "deeplink" &&
            action.params &&
            typeof action.params === "object"
          ) {
            const params = { ...action.params };

            if (
              Array.isArray(params.androidUrl) &&
              params.androidUrl.length > 0
            ) {
              params.androidUrl =
                params.androidUrl[0]?.value || params.androidUrl[0] || "";
            }

            if (Array.isArray(params.iosUrl) && params.iosUrl.length > 0) {
              params.iosUrl = params.iosUrl[0]?.value || params.iosUrl[0] || "";
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
        node.children = node.children.map(transformDeeplinkParamsForForm);
      }

      return node;
    };

    let template: any = null;
    if (action.template) {
      try {
        template =
          typeof action.template === "string"
            ? JSON.parse(action.template)
            : action.template;

        template = transformDeeplinkParamsForForm(template);
      } catch (e) {
        console.error("Failed to parse template:", e);
      }
    }

    // Extract variant from action.variant or template.props.templateVariantId
    let variant = action.variant;
    if (!variant && template?.props?.templateVariantId) {
      variant = template.props.templateVariantId;
    }

    if (!variant || variant === "Default") {
      if (nudgeType === NudgeType.NUDGE_UI && template?.children) {
        const hasMultipleButtons = template.children.some((child: any) => {
          const buttons =
            child.children?.filter((c: any) => c.type === "Button") || [];
          return buttons.length > 1;
        });
        variant = hasMultipleButtons ? "bottomsheet-cta" : "basic-bottomsheet";
      } else if (nudgeType === NudgeType.POPUP && template?.children) {
        const hasSingleButton = template.children.some((child: any) => {
          const buttons =
            child.children?.filter((c: any) => c.type === "Button") || [];
          return buttons.length === 1;
        });
        variant = hasSingleButton ? "popup-single-button" : "basic-popup";
      } else if (nudgeType === NudgeType.TOOLTIP) {
        variant = "basic-tooltip";
      } else {
        variant = "Default";
      }
    }

    if (template && variant) {
      template = {
        ...template,
        props: {
          ...template.props,
          templateVariantId: variant,
        },
      };
    }

    const onState =
      Object.entries(stateToAction).find(
        ([_, actionId]) => actionId === action.actionId
      )?.[0] || "1";

    return {
      config: {
        triggerDelay: action.config?.triggerDelay || 0,
      },
      onState,
      actionId: action.actionId || "",
      type: nudgeType,
      variant,
      template: template || {
        type: nudgeType,
        props: { testID: `testID-${Date.now()}` },
        actions: [],
        styles: {},
        children: [],
      },
      isNudgeValid: !!template,
    };
  });

  const contextParams = (rule.contextParams || []).map(
    (param: string, index: number) => ({
      id: index,
      label: param,
    })
  );

  const resetStates = rule.resetStates || [];

  return {
    ctaMetadata: {
      ctaTitle: apiData.name || "",
      description: apiData.description || "",
      tags: (apiData.tags || []).map((tag: string, index: number) => ({
        id: index,
        label: tag,
      })),
      team: apiData.team || "",
    },
    selectCohort: {
      includedCohorts: cohortEligibility.includes || [],
      exculdedCohorts: cohortEligibility.excludes || [],
      rollout: "",
      maximumUserCount: "",
      pilotUserId: "",
    },
    schedule: {
      startType,
      startDate,
      startTime: startTimeStr,
      startDateTime: null,
      endDate,
      endTime: endTimeStr,
      endDateTime: null,
      priority: rule.priority || null,
    },
    journeyFrequency,
    ruleEngine: {
      currentDropdownSelectedEvent:
        eventInfo.length > 0
          ? {
              id: 0,
              label: eventInfo[0].eventname,
            }
          : null,
      eventInfo,
    },
    contextParams,
    stateMachine: {
      states: [],
      events: [],
    },
    filterFunctionSeleted: {
      filterSelected: "",
    },
    nudgeSelection: {
      actions: nudgeSelectionActions,
      resetStates,
    },
  };
};
