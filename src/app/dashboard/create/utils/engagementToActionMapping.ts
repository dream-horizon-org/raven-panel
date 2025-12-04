import { Node } from "@xyflow/react";
import { JourneyNodeData, Engagement } from "../types/JourneyNode.interface";
import {
  CreateJourneyFormData,
  NudgeType,
  ReactNativeJson,
  SyncEngagementToActionType,
} from "../types/journey.interface";

/**
 * Maps engagement type from flow to NudgeType
 */
export function mapEngagementTypeToNudgeType(
  engagementType: string
): NudgeType {
  switch (engagementType.toLowerCase()) {
    case "tooltip":
      return NudgeType.TOOLTIP;
    case "popup":
      return NudgeType.POPUP;
    case "bottomsheet":
      return NudgeType.NUDGE_UI;
    default:
      return NudgeType.TOOLTIP;
  }
}

/**
 * Maps NudgeType back to engagement type string
 */
export function mapNudgeTypeToEngagementType(nudgeType: NudgeType): string {
  switch (nudgeType) {
    case NudgeType.TOOLTIP:
      return "tooltip";
    case NudgeType.POPUP:
      return "popup";
    case NudgeType.NUDGE_UI:
      return "bottomsheet";
    default:
      return "tooltip";
  }
}

/**
 * Creates or updates an action in nudgeSelection.actions for a given engagement
 * The action is placed at index 0 temporarily for EngagementSidePanel to edit
 */
export const syncEngagementToAction: SyncEngagementToActionType = (
  node,
  engagement,
  stateNumber,
  currentActions
) => {
  const nudgeType = mapEngagementTypeToNudgeType(engagement.type);

  // First, try to find existing action by originalActionId stored in engagement config
  // This handles cases where engagement was restored from API and has a specific actionId
  const engagementConfig = engagement.config as
    | Record<string, unknown>
    | undefined;
  const originalActionId = engagementConfig?.originalActionId as
    | string
    | undefined;
  const originalOnState = engagementConfig?.originalOnState as
    | string
    | undefined;

  let actionIndex = -1;
  let actionId: string;
  let onState: string;

  if (originalActionId) {
    // Try to find action by exact originalActionId match
    actionIndex = currentActions.findIndex(
      (action) => action.actionId === originalActionId
    );
  }

  // If not found by originalActionId, try to find by actionId prefix (for backwards compatibility)
  if (actionIndex === -1) {
    actionIndex = currentActions.findIndex((action) => {
      if (action.actionId.includes("_")) {
        const actionIdPrefix = action.actionId.split("_")[0];
        return actionIdPrefix === engagement.id;
      }
      return action.actionId === engagement.id;
    });
  }

  // If not found by actionId, try to find by state
  if (actionIndex === -1) {
    actionIndex = currentActions.findIndex(
      (action) => action.onState === stateNumber
    );
  }

  // Determine the actionId and onState to use
  if (actionIndex >= 0) {
    // Use existing action's actionId and onState to preserve original state
    actionId = currentActions[actionIndex].actionId;
    onState = originalOnState || currentActions[actionIndex].onState;
  } else {
    // Create new action - use originalOnState if available, otherwise use node's state
    const baseTimestamp = Date.now();
    actionId = originalActionId || `${engagement.id}_${baseTimestamp}`;
    onState = originalOnState || stateNumber;
  }

  // Create default template based on type
  const defaultTemplate: ReactNativeJson = {
    type: nudgeType === NudgeType.NUDGE_UI ? "NUDGE_UI" : nudgeType,
    props: {
      testID: `testID-${Date.now()}`,
    },
    actions: [],
    styles: {},
    children: [],
  };

  // If engagement has config with template, use it
  let template = defaultTemplate;
  if (engagement.config && typeof engagement.config === "object") {
    // Try to extract template from config if it exists
    const configTemplate = (engagement.config as Record<string, unknown>)
      .template;
    if (configTemplate) {
      try {
        template =
          typeof configTemplate === "string"
            ? JSON.parse(configTemplate)
            : configTemplate;
      } catch (e) {
        console.error("Failed to parse template from engagement config:", e);
      }
    }
  }

  const newAction = {
    config: {
      triggerDelay:
        actionIndex >= 0 ? currentActions[actionIndex].config.triggerDelay : 0,
    },
    onState,
    actionId,
    type: nudgeType,
    variant: actionIndex >= 0 ? currentActions[actionIndex].variant : undefined,
    template,
    isNudgeValid:
      actionIndex >= 0 ? currentActions[actionIndex].isNudgeValid : false,
  };

  // If action exists, update it; otherwise add new one
  if (actionIndex >= 0) {
    const updatedActions = [...currentActions];
    updatedActions[actionIndex] = newAction;
    // Move to index 0 for EngagementSidePanel
    const [movedAction] = updatedActions.splice(actionIndex, 1);
    return [movedAction, ...updatedActions];
  } else {
    // Add new action at index 0
    return [newAction, ...currentActions];
  }
};

/**
 * Syncs actions back to flow engagements after template is saved
 */
export function syncActionToEngagement(
  action: CreateJourneyFormData["nudgeSelection"]["actions"][0],
  node: Node<JourneyNodeData>,
  engagementId: string
): Engagement | null {
  if (!node.data.engagements) return null;

  const engagement = node.data.engagements.find((e) => e.id === engagementId);
  if (!engagement) return null;

  // Update engagement config with template
  const updatedConfig = {
    ...engagement.config,
    template: action.template,
    variant: action.variant,
  };

  return {
    ...engagement,
    config: updatedConfig,
  };
}
