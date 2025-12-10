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
  const originalNodeId = engagementConfig?.originalNodeId as string | undefined;

  let actionIndex = -1;
  let actionId: string;
  let onState: string;

  if (originalActionId) {
    // Try to find action by exact originalActionId match
    // CRITICAL: Also verify originalNodeId matches to ensure action belongs to this node
    const targetNodeId = originalNodeId || node.id;
    actionIndex = currentActions.findIndex((action) => {
      if (action.actionId !== originalActionId) {
        return false;
      }

      // Verify originalNodeId matches (if stored in action)
      const actionConfig = action.config as Record<string, unknown> | undefined;
      const actionOriginalNodeId = actionConfig?.originalNodeId as
        | string
        | undefined;

      // If action has originalNodeId, it must match the target node ID
      if (actionOriginalNodeId) {
        return actionOriginalNodeId === targetNodeId;
      }

      // If action doesn't have originalNodeId, only match if engagement also doesn't have it
      // (both are legacy - safe to match)
      if (!originalNodeId) {
        return true;
      }

      // Engagement has originalNodeId but action doesn't - don't match (action might be from wrong node)
      return false;
    });
  }

  // If not found by originalActionId, try to find by actionId prefix AND originalNodeId
  // This ensures we match the correct action even if state numbers changed
  // CRITICAL: Action MUST have originalNodeId that matches the target node ID
  if (actionIndex === -1) {
    // Use engagement's originalNodeId if set, otherwise use current node's ID
    // This is the node ID this engagement belongs to
    const targetNodeId = originalNodeId || node.id;

    actionIndex = currentActions.findIndex((action) => {
      // First check: actionId prefix must match engagement ID
      const actionIdPrefix = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;
      if (actionIdPrefix !== engagement.id) {
        return false;
      }

      // Second check: action MUST have originalNodeId that matches target node ID
      // This is CRITICAL for preventing cross-node matching
      const actionConfig = action.config as Record<string, unknown> | undefined;
      const actionOriginalNodeId = actionConfig?.originalNodeId as
        | string
        | undefined;

      // CRITICAL: Action must have originalNodeId and it must match the target node ID
      // This prevents matching actions from deleted nodes or other nodes
      if (!actionOriginalNodeId) {
        // Action doesn't have originalNodeId - don't match (might belong to wrong node)
        return false;
      }

      // Action has originalNodeId - it must match the target node ID
      return actionOriginalNodeId === targetNodeId;
    });
  }

  // If not found by actionId, try to find by originalNodeId ONLY (don't use state)
  // CRITICAL: After node deletion, state numbers are reassigned, so matching by state is unreliable
  // We should ONLY match by originalNodeId to ensure we match the correct node regardless of state changes
  if (actionIndex === -1) {
    // Use engagement's originalNodeId if set, otherwise use current node's ID
    const targetNodeId = originalNodeId || node.id;

    actionIndex = currentActions.findIndex((action) => {
      // First check: actionId prefix must match engagement ID
      const actionIdPrefix = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;
      if (actionIdPrefix !== engagement.id) {
        return false;
      }

      // CRITICAL: Action must have originalNodeId and it must match the target node ID
      // We DON'T check state here because states are reassigned after node deletion
      // Matching by state would cause engagements to attach to wrong nodes
      const actionConfig = action.config as Record<string, unknown> | undefined;
      const actionOriginalNodeId = actionConfig?.originalNodeId as
        | string
        | undefined;

      // Action must have originalNodeId and it must match the target node ID
      if (!actionOriginalNodeId) {
        // Action doesn't have originalNodeId - don't match (might belong to wrong node)
        return false;
      }

      // Action has originalNodeId - it must match the target node ID
      return actionOriginalNodeId === targetNodeId;
    });
  }

  // Determine the actionId and onState to use
  if (actionIndex >= 0) {
    // Use existing action's actionId, but ALWAYS use current node's state number
    // This ensures that if states were reassigned after node deletion, we use the correct new state
    actionId = currentActions[actionIndex].actionId;
    // CRITICAL: Always use current node's state number, not the stored onState
    // This prevents matching to wrong nodes when states are reassigned after deletion
    onState = stateNumber;
  } else {
    // Create new action - always use current node's state number
    const baseTimestamp = Date.now();
    actionId = originalActionId || `${engagement.id}_${baseTimestamp}`;
    onState = stateNumber; // Always use current node's state
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
  // Also check if existing action has a template (preserve it if more complete)
  let template = defaultTemplate;

  // First, try to get template from existing action if it exists and has a type
  if (actionIndex >= 0 && currentActions[actionIndex].template) {
    const existingTemplate = currentActions[actionIndex].template;
    if (
      existingTemplate &&
      typeof existingTemplate === "object" &&
      "type" in existingTemplate
    ) {
      template = existingTemplate;
    }
  }

  // Then, try to extract template from engagement config if it exists and is more complete
  if (engagement.config && typeof engagement.config === "object") {
    const configTemplate = (engagement.config as Record<string, unknown>)
      .template;
    if (configTemplate) {
      try {
        const parsedTemplate =
          typeof configTemplate === "string"
            ? JSON.parse(configTemplate)
            : configTemplate;

        // Use config template if it has a type (more complete) or if we don't have one yet
        if (
          parsedTemplate &&
          typeof parsedTemplate === "object" &&
          "type" in parsedTemplate
        ) {
          template = parsedTemplate;
        }
      } catch (e) {
        console.error("Failed to parse template from engagement config:", e);
      }
    }
  }

  // Get original node ID - prioritize engagement's originalNodeId, then current node ID
  // CRITICAL: Always use the current node's ID if engagement doesn't have originalNodeId
  // Don't use existingActionNodeId from a matched action - it might be from a different node
  const finalNodeId = originalNodeId || node.id;

  // Get the event name from the node - this is critical for matching after deletions
  const nodeEventName = node.data.eventName || "";

  // CRITICAL: Preserve originalOnState if it's a reset state, otherwise use current stateNumber
  // This ensures reset states are preserved even after node deletions
  const finalOriginalOnState =
    originalOnState && originalOnState !== stateNumber
      ? originalOnState
      : stateNumber;

  const newAction = {
    config: {
      triggerDelay:
        actionIndex >= 0 ? currentActions[actionIndex].config.triggerDelay : 0,
      originalNodeId: finalNodeId, // Always store the node ID this engagement belongs to
      originalEventName: nodeEventName, // CRITICAL: Store event name for matching after node deletions
      originalOnState: finalOriginalOnState, // CRITICAL: Store the onState for recovery after deletions
    },
    onState, // CRITICAL: This is the NEXT state where engagement appears (from stateNumber parameter)
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
    // CRITICAL: Always update originalNodeId, originalEventName, and onState to match current node
    // This ensures if an action was incorrectly matched or states shifted after deletion, it gets corrected
    updatedActions[actionIndex] = {
      ...newAction,
      onState, // CRITICAL: Always update onState to current next state
      config: {
        ...newAction.config,
        originalNodeId: finalNodeId, // Always use current node's ID
        originalEventName: nodeEventName, // Always update event name to current node's event name
        originalOnState: finalOriginalOnState, // Always update originalOnState to current state
      } as typeof newAction.config & {
        originalNodeId: string;
        originalEventName: string;
        originalOnState: string;
      },
    };
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
