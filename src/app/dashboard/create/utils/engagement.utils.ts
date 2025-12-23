import { EventsSchemaResponse } from "@/api/services/types/events.interface";
import { CreateJourneyFormData } from "../types/journey.interface";
import { ReactNativeJson } from "../types/journey.interface";

const getActionIdPrefix = (actionId: string): string => {
  return actionId.includes("_") ? actionId.split("_")[0] : actionId;
};

export const findTargetAction = (
  actions: CreateJourneyFormData["nudgeSelection"]["actions"],
  engagementId?: string | null
): CreateJourneyFormData["nudgeSelection"]["actions"][0] | undefined => {
  if (!actions || actions.length === 0) {
    return undefined;
  }

  let targetAction = actions[0];

  if (engagementId) {
    const matchingAction = actions.find((action) => {
      const actionIdPrefix = getActionIdPrefix(action.actionId);
      return actionIdPrefix === engagementId;
    });

    if (matchingAction) {
      targetAction = matchingAction;
    }
  }

  return targetAction;
};

export const getInitialTemplate = (
  actions: CreateJourneyFormData["nudgeSelection"]["actions"],
  engagementId?: string | null
): ReactNativeJson | null => {
  const targetAction = findTargetAction(actions, engagementId);
  const currentTemplate = targetAction?.template;

  return currentTemplate ? JSON.parse(JSON.stringify(currentTemplate)) : null;
};

export const getAvailableProperties = (actionParams: {
  eventName?: string;
  eventsData: EventsSchemaResponse;
  systemPropertyNames: string[];
}): string[] => {
  const properties: string[] = [];

  if (actionParams.eventName && actionParams.eventsData?.data?.eventList) {
    const selectedEvent = actionParams.eventsData.data.eventList.find(
      (event) => event.metadata?.eventName === actionParams.eventName
    );
    if (selectedEvent?.properties) {
      selectedEvent.properties.forEach((prop) => {
        if (prop.propertyName && !properties.includes(prop.propertyName)) {
          properties.push(prop.propertyName);
        }
      });
    }
  }

  actionParams.systemPropertyNames.forEach((propName) => {
    if (!properties.includes(propName)) {
      properties.push(propName);
    }
  });

  return properties.sort();
};
