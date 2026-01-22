import {
  CreateJourneyFormData,
  DeeplinkParams,
  ElementDataTypeValues,
  NextStateTransition,
  NudgeEvent,
  ReactNativeAction,
  ReactNativeJson,
  TemplateNode,
} from "../types/journey.interface";
import { NudgeType } from "../types/journey.interface";
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
    enableTimesInSession:
      !!frequency.session?.limit && frequency.session.limit !== 999,
    timesInSession:
      frequency.session?.limit !== undefined &&
      frequency.session?.limit !== null &&
      frequency.session?.limit !== 999
        ? frequency.session.limit
        : null,
    enableMaxTimesInPeriod:
      !!frequency.window?.limit && frequency.window.limit !== 999,
    maxTimesInPeriod:
      frequency.window?.limit !== undefined &&
      frequency.window?.limit !== null &&
      frequency.window?.limit !== 999
        ? frequency.window.limit
        : null,
    periodValue:
      frequency.window?.value !== undefined &&
      frequency.window?.value !== null &&
      frequency.window?.value !== 999
        ? frequency.window.value
        : null,
    periodUnit: frequency.window?.unit || "days",
    enableMaxTimesInLifetime:
      !!frequency.lifespan?.limit && frequency.lifespan.limit !== 999,
    maxTimesInLifetime:
      frequency.lifespan?.limit !== undefined &&
      frequency.lifespan?.limit !== null &&
      frequency.lifespan?.limit !== 999
        ? frequency.lifespan.limit
        : null,
  };

  const stateTransition = rule.stateTransition || {};
  const eventInfo = Object.entries(stateTransition).map(
    ([eventName, transitions]) => {
      const currentStates = Object.entries(transitions).map(
        ([currentState, nextStates]) => {
          const nextStateArray = Array.isArray(nextStates)
            ? (nextStates as NextStateTransition[])
            : [];
          const nextState = nextStateArray.map((ns) => {
            const filters = ns.filters || {};
            const filterArray = filters.filter || [];

            return {
              transitionTo: Number(ns.transitionTo),
              filters: {
                operator: (filters.operator || "AND") as "AND" | "OR",
                filter: filterArray.map((f) => ({
                  propertyName: {
                    label: String(f.propertyName),
                    isLocal: false,
                  },
                  propertyType: f.propertyType || "string",
                  comparisonType: f.comparisonType || "=",
                  comparisonValue: f.comparisonValue as
                    | string
                    | number
                    | boolean,
                  componentType: "Filter" as const,
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

  const nudgeSelectionActions = actions.map((action) => {
    let nudgeType: NudgeType = NudgeType.TOOLTIP;
    if (action.type === "NUDGE_UI") {
      nudgeType = NudgeType.NUDGE_UI;
    } else if (action.type === "POPUP") {
      nudgeType = NudgeType.POPUP;
    } else if (action.type === "TOOLTIP") {
      nudgeType = NudgeType.TOOLTIP;
    } else if (action.type === "NUDGE_ACTION") {
      nudgeType = NudgeType.NUDGE_ACTION;
    }

    const transformDeeplinkParamsForForm = (
      node: TemplateNode
    ): TemplateNode => {
      if (!node || typeof node !== "object") {
        return node;
      }

      if (Array.isArray(node.actions)) {
        node.actions = node.actions.map((action: ReactNativeAction) => {
          // Handle deeplink params
          if (
            action.type === "deeplink" &&
            action.params &&
            typeof action.params === "object"
          ) {
            const params: DeeplinkParams = {
              ...action.params,
            } as DeeplinkParams;

            if (
              Array.isArray(params.androidUrl) &&
              params.androidUrl.length > 0
            ) {
              const firstItem = params.androidUrl[0];
              params.androidUrl =
                (typeof firstItem === "object" &&
                firstItem !== null &&
                "value" in firstItem
                  ? firstItem.value
                  : typeof firstItem === "string"
                  ? firstItem
                  : "") || "";
            }

            if (Array.isArray(params.iosUrl) && params.iosUrl.length > 0) {
              const firstItem = params.iosUrl[0];
              params.iosUrl =
                (typeof firstItem === "object" &&
                firstItem !== null &&
                "value" in firstItem
                  ? firstItem.value
                  : typeof firstItem === "string"
                  ? firstItem
                  : "") || "";
            }

            return {
              ...action,
              params: params as ElementDataTypeValues,
            };
          }

          // Handle analyticsEvent and emitNativeEvent params - transform value from array format to display format
          if (
            (action.type === "analyticsEvent" &&
              action.name === "analyticsEvent") ||
            (action.type === "emitNativeEvent" &&
              action.name === "emitNativeEvent")
          ) {
            if (
              action.params &&
              typeof action.params === "object" &&
              "eventParams" in action.params
            ) {
              const eventParams = action.params as NudgeEvent;
              const transformedEventParams = eventParams.eventParams.map(
                (param) => {
                  // If value is an array (API format), extract the actual value
                  if (Array.isArray(param.value) && param.value.length > 0) {
                    const firstItem = param.value[0];
                    if (
                      typeof firstItem === "object" &&
                      firstItem !== null &&
                      "value" in firstItem &&
                      !firstItem.isTemplateString
                    ) {
                      return {
                        ...param,
                        value: firstItem.value as string | number | boolean,
                      };
                    }
                  }
                  // If value is already a primitive, keep it
                  return param;
                }
              );

              return {
                ...action,
                params: {
                  ...eventParams,
                  eventParams: transformedEventParams,
                } as NudgeEvent,
              };
            }
          }

          return action;
        });
      }

      if (Array.isArray(node.children)) {
        node.children = node.children.map((child) =>
          transformDeeplinkParamsForForm(child as TemplateNode)
        ) as ReactNativeJson[];
      }

      return node;
    };

    let template: ReactNativeJson | NudgeEvent | null = null;
    if (action.template) {
      try {
        // Handle template that might be a JSON string
        let parsedTemplate: unknown = action.template;
        if (typeof action.template === "string") {
          try {
            parsedTemplate = JSON.parse(action.template);
          } catch (parseError) {
            console.error(
              `[parseJourneyData] Failed to parse template string for action ${action.actionId}:`,
              parseError
            );
            parsedTemplate = action.template;
          }
        }

        // Check if this is a NUDGE_ACTION (Native Event Emitter)
        // Template should have eventName property for NUDGE_ACTION
        if (
          nudgeType === NudgeType.NUDGE_ACTION &&
          typeof parsedTemplate === "object" &&
          parsedTemplate !== null &&
          "eventName" in parsedTemplate
        ) {
          // Parse as NudgeEvent and ensure value arrays are initialized
          const nudgeEvent = parsedTemplate as NudgeEvent;
          template = {
            ...nudgeEvent,
            eventParams: (nudgeEvent.eventParams || []).map((param) => ({
              ...param,
              value:
                param.value &&
                Array.isArray(param.value) &&
                param.value.length > 0
                  ? param.value
                  : [{ value: "", isTemplateString: false }],
            })),
          };
        } else if (nudgeType === NudgeType.NUDGE_ACTION) {
          // NUDGE_ACTION but template doesn't have eventName - log warning
          console.warn(
            `[parseJourneyData] NUDGE_ACTION ${action.actionId} has template but missing eventName:`,
            parsedTemplate
          );
        } else {
          // Parse as ReactNativeJson for UI engagements
          const uiTemplate = parsedTemplate as ReactNativeJson;
          template = (transformDeeplinkParamsForForm(
            uiTemplate as TemplateNode
          ) as unknown) as ReactNativeJson;
        }
      } catch (e) {
        console.error(
          `[parseJourneyData] Failed to parse template for action ${action.actionId}:`,
          e,
          "Raw template:",
          action.template
        );
      }
    }

    let variant: string | undefined = action.variant;

    // Only handle variant for UI engagements, not NUDGE_ACTION
    if (nudgeType !== NudgeType.NUDGE_ACTION) {
      if (
        !variant &&
        template &&
        "props" in template &&
        template.props?.templateVariantId
      ) {
        variant = String(template.props.templateVariantId);
      }

      if (!variant || variant === "Default") {
        if (
          nudgeType === NudgeType.NUDGE_UI &&
          template &&
          "children" in template &&
          template.children
        ) {
          const hasMultipleButtons = (template.children as ReactNativeJson[]).some(
            (child: ReactNativeJson) => {
              const buttons = (child.children?.filter(
                (c: ReactNativeJson) => c.type === "Button"
              ) || []) as ReactNativeJson[];
              return buttons.length > 1;
            }
          );
          variant = hasMultipleButtons
            ? "bottomsheet-cta"
            : "basic-bottomsheet";
        } else if (
          nudgeType === NudgeType.POPUP &&
          template &&
          "children" in template &&
          template.children
        ) {
          const hasSingleButton = (template.children as ReactNativeJson[]).some(
            (child: ReactNativeJson) => {
              const buttons = (child.children?.filter(
                (c: ReactNativeJson) => c.type === "Button"
              ) || []) as ReactNativeJson[];
              return buttons.length === 1;
            }
          );
          variant = hasSingleButton ? "popup-single-button" : "basic-popup";
        } else if (nudgeType === NudgeType.TOOLTIP) {
          variant = "basic-tooltip";
        } else {
          variant = "Default";
        }
      }

      if (template && variant && "props" in template) {
        template = {
          ...template,
          props: {
            ...template.props,
            templateVariantId: variant,
          },
        } as ReactNativeJson;
      }
    }

    const onState = Object.entries(stateToAction).find(
      ([, actionId]) => actionId === action.actionId
    )?.[0];

    let originalEventName: string | undefined;
    if (onState) {
      const eventsWithState = eventInfo.filter((info) => {
        return info.currentState.some(
          (cs) => String(cs.currentState) === onState
        );
      });

      if (eventsWithState.length === 1) {
        // Only one event has this state - this is the correct match
        originalEventName = eventsWithState[0].eventname;
      } else if (eventsWithState.length > 1) {
        // Multiple events have this state - this shouldn't happen but could after deletions
        // Try to find the one that matches the stateToAction mapping more closely
        // For now, use the first one but log a warning
        console.warn(
          `[parseJourneyData] Multiple events found with state ${onState} for action ${action.actionId}. Using first match: ${eventsWithState[0].eventname}`
        );
        originalEventName = eventsWithState[0].eventname;
      } else {
        const eventsTransitioningToState = Object.entries(
          stateTransition
        ).filter(([, transitions]) => {
          return Object.values(transitions).some((nextStates) => {
            if (Array.isArray(nextStates)) {
              return nextStates.some(
                (ns) => String(ns.transitionTo) === onState
              );
            }
            return false;
          });
        });

        if (eventsTransitioningToState.length > 0) {
          const nonEntryEvents = eventsTransitioningToState.filter(
            ([eventName]) => {
              const eventInfoEntry = eventInfo.find(
                (info) => info.eventname === eventName
              );
              if (eventInfoEntry) {
                return !eventInfoEntry.currentState.some(
                  (cs) => cs.currentState === 0
                );
              }
              const transitions = stateTransition[eventName];
              return transitions && !Object.keys(transitions).includes("0");
            }
          );

          if (nonEntryEvents.length > 0) {
            originalEventName = nonEntryEvents[0][0];
          } else {
            originalEventName = eventsTransitioningToState[0][0];
          }
        } else {
          const eventWithStateInTransition = Object.entries(
            stateTransition
          ).find(([, transitions]) => {
            return Object.keys(transitions).includes(onState);
          });

          if (eventWithStateInTransition) {
            originalEventName = eventWithStateInTransition[0];
          } else if (onState === "0") {
            const entryEvents = eventInfo.filter((info) => {
              return info.currentState.some((cs) => cs.currentState === 0);
            });
            if (entryEvents.length > 0) {
              originalEventName = entryEvents[0].eventname;
            }
          } else {
            const entryEvents = eventInfo.filter((info) => {
              return info.currentState.some((cs) => cs.currentState === 0);
            });
            if (entryEvents.length > 0) {
              console.warn(
                `[parseJourneyData] Action ${action.actionId} mapped to state ${onState} which doesn't exist. Assigning to entry node: ${entryEvents[0].eventname}`
              );
              originalEventName = entryEvents[0].eventname;
            }
          }
        }
      }
    }

    let defaultTemplate: ReactNativeJson | NudgeEvent;
    if (nudgeType === NudgeType.NUDGE_ACTION) {
      defaultTemplate = {
        eventName: "",
        eventParams: [],
      };
    } else {
      defaultTemplate = {
        type: nudgeType,
        props: { testID: `testID-${Date.now()}` },
        actions: [],
        styles: {},
        children: [],
      };
    }

    return {
      config: {
        triggerDelay: Number(action.config?.triggerDelay) || 0,
        originalEventName: originalEventName,
      },
      onState,
      actionId: String(action.actionId || ""),
      type: nudgeType,
      variant: variant as CreateJourneyFormData["nudgeSelection"]["actions"][0]["variant"],
      template: template || defaultTemplate,
      isNudgeValid: !!template,
    };
  });

  const contextParams = (rule.contextParams || []).map(
    (param: string, index) => ({
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
    testFeature: {
      isTestFeatureEnabled: false,
      prevCtaId: "",
      expireInMins: 0,
      userIds: "",
    },
  };
};
