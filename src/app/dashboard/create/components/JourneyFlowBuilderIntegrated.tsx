"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Box,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import {
  Control,
  FieldErrors,
  useFormContext,
  useWatch,
  useFieldArray,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  EventInfo,
  NudgeEvent,
} from "../types/journey.interface";
import { StateNode, EngagementNode } from "./content/FlowNodes";
import NodeConfigurationPanel from "./content/NodeConfigurationPanel";
import {
  JourneyNodeData,
  Branch,
  EngagementNodeData,
  Engagement,
} from "../types/JourneyNode.interface";
import {
  buildEventStateMap,
  buildNodeStateMap,
  convertFlowToEventInfo,
  convertEventInfoToFlow,
  EventStateMap,
  NodeStateMap,
} from "../utils/stateMapping.utils";
import {
  syncEngagementToAction,
  syncActionToEngagement,
  mapNudgeTypeToEngagementType,
} from "../utils/engagementToActionMapping.utils";

// Helper function to calculate non-overlapping position for new nodes
function calculateNonOverlappingPosition(
  sourceNode: Node<JourneyNodeData> | undefined,
  existingNodes: Node<JourneyNodeData>[],
  horizontalSpacing: number = 250,
  verticalSpacing: number = 150
): { x: number; y: number } {
  if (!sourceNode) {
    return { x: 250, y: 100 };
  }

  let x = sourceNode.position.x + horizontalSpacing;
  let y = sourceNode.position.y + verticalSpacing;

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const hasOverlap = existingNodes.some((node) => {
      const dx = Math.abs(node.position.x - x);
      const dy = Math.abs(node.position.y - y);
      return dx < 200 && dy < 100;
    });

    if (!hasOverlap) {
      break;
    }

    if (attempts % 2 === 0) {
      y += verticalSpacing;
    } else {
      x += horizontalSpacing;
      y = sourceNode.position.y + verticalSpacing;
    }

    attempts++;
  }

  return {
    x: Math.max(50, Math.min(x, 2000)),
    y: Math.max(50, Math.min(y, 2000)),
  };
}

const nodeTypes: NodeTypes = {
  state: (StateNode as unknown) as NodeTypes["state"],
  engagement: (EngagementNode as unknown) as NodeTypes["engagement"],
};

interface JourneyFlowBuilderIntegratedProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  events: Array<{
    eventName: string;
    properties: Array<{ propertyName: string; type: string }>;
  }>;
  isLoadingEvents?: boolean;
  systemPropertyNames?: string[];
  systemPropertyTypes?: Map<string, string>;
  onEngagementSelect?: (
    nodeId: string,
    engagementId: string,
    stateNumber: string
  ) => void;
  onSave?: () => void;
  onTemplateSaved?: () => void;
  syncTemplateRef?: React.MutableRefObject<(() => void) | null>;
  checkAllEngagementsHaveTemplatesRef?: React.MutableRefObject<
    (() => boolean) | null
  >;
  checkUnconnectedNodesRef?: React.MutableRefObject<(() => boolean) | null>;
  syncFlowToFormRef?: React.MutableRefObject<(() => void) | null>;
}

export default function JourneyFlowBuilderIntegrated({
  control,
  events,
  isLoadingEvents = false,
  systemPropertyNames = [],
  systemPropertyTypes = new Map(),
  onEngagementSelect,
  onSave,
  syncTemplateRef,
  checkAllEngagementsHaveTemplatesRef,
  checkUnconnectedNodesRef,
  syncFlowToFormRef,
}: JourneyFlowBuilderIntegratedProps) {
  const theme = useTheme();
  const { setValue, getValues } = useFormContext<CreateJourneyFormData>();

  // Use useFieldArray for proper array management - this ensures React Hook Form tracks changes correctly
  const {
    fields: actionFields,
    remove: removeAction,
    replace: replaceActions,
  } = useFieldArray({
    control,
    name: "nudgeSelection.actions",
  });

  const currentEngagementContextRef = useRef<{
    nodeId: string;
    engagementId: string;
  } | null>(null); // Ref to prevent syncFlowToForm from running during node save

  const isSavingNodeRef = useRef(false); // Ref to track if the initial flow structure has been set
  const isInitializedRef = useRef(false); // Watch ruleEngine.eventInfo from form

  const eventInfo = useWatch({
    control,
    name: "ruleEngine.eventInfo",
  }) as EventInfo[] | undefined; // Watch nudgeSelection.actions to restore engagements

  const nudgeActions = useWatch({
    control,
    name: "nudgeSelection.actions",
  }) as CreateJourneyFormData["nudgeSelection"]["actions"] | undefined;

  const resetStates = useWatch({
    control,
    name: "nudgeSelection.resetStates",
  }) as string[] | undefined;

  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<Record<string, unknown>>
  >([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node<
    JourneyNodeData
  > | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [highlightedBranchId, setHighlightedBranchId] = useState<string | null>(
    null
  );
  const [highlightedEngagementId, setHighlightedEngagementId] = useState<
    string | null
  >(null);
  const panelCloseHandlerRef = useRef<(() => void) | null>(null);
  const saveNodePanelRef = useRef<(() => void) | null>(null);
  const hasOpenedInitialNodeRef = useRef(false);
  const [eventStateMap, setEventStateMap] = useState<EventStateMap>(new Map());
  const [nodeStateMap, setNodeStateMap] = useState<NodeStateMap>(new Map());
  const [unconnectedNodesDialog, setUnconnectedNodesDialog] = useState<{
    open: boolean;
    nodeIds: string[];
    engagementNodeIds: string[];
    isInitialNodeOnly: boolean;
  }>({
    open: false,
    nodeIds: [],
    engagementNodeIds: [],
    isInitialNodeOnly: false,
  });

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    // Check if we have data to process or if we need to set the initial blank state
    if (!eventInfo || eventInfo.length === 0) {
      if (nodes.length === 0) {
        const initialNodeId = `state-${Date.now()}`;
        const initialNode: Node<JourneyNodeData> = {
          id: initialNodeId,
          type: "state",
          position: { x: 250, y: 100 },
          data: {
            label: "Initial Node",
            nodeType: "state",
            eventName: "",
            engagements: [],
            branches: [],
            isEntry: true,
          },
        };
        setNodes([initialNode]);
        isInitializedRef.current = true;
      }
      return;
    }

    // Proceed with restoration only if eventInfo exists and we haven't initialized yet
    if (eventInfo && eventInfo.length > 0) {
      const {
        nodes: initialNodes,
        edges: initialEdges,
        eventStateMap: esm,
        nodeStateMap: nsm,
      } = convertEventInfoToFlow(
        eventInfo,
        nodes as Node<JourneyNodeData>[],
        edges
      );

      let updatedNodes = ([...initialNodes] as unknown) as Node<
        JourneyNodeData | EngagementNodeData
      >[];
      let updatedEdges = initialEdges;

      // Restore engagements from nudgeSelection.actions
      if (nudgeActions && nudgeActions.length > 0) {
        // CRITICAL: Build a map of nextState -> eventName from eventInfo
        // This tells us which event transitions to which state
        // Example: If AppInstalled transitions to state "1", then nextStateToEventMap["1"] = "AppInstalled"
        const nextStateToEventMap = new Map<string, string>();
        eventInfo?.forEach((event) => {
          event.currentState?.forEach((currentState) => {
            currentState.nextState?.forEach((nextState) => {
              const nextStateStr = String(nextState.transitionTo);
              // Map nextState to the event that transitions to it
              nextStateToEventMap.set(nextStateStr, event.eventname);
            });
          });
        });

        // CRITICAL FIX: Check for orphaned actions BEFORE restoring
        const stateNumberToNodeIdMap = new Map<string, string>();
        initialNodes.forEach((node) => {
          if (node.type === "state") {
            const nodeData = node.data as JourneyNodeData;
            const nodeState =
              nsm.get(node.id) || esm.get(nodeData.eventName || "");
            if (nodeState) {
              stateNumberToNodeIdMap.set(nodeState, node.id);
            }
          }
        });

        // First, build a map of which nodes transition to which reset states
        // This helps us determine if a reset state action should be restored to a node
        const nodeToResetStateMap = new Map<string, Set<string>>();
        initialNodes.forEach((node) => {
          if (node.type !== "state") return;
          const nodeData = node.data as JourneyNodeData;
          const nodeState =
            nsm.get(node.id) || esm.get(nodeData.eventName || "");
          if (!nodeState) return;

          // Check if this node transitions to any reset states
          const resetStatesForNode = new Set<string>();
          nodeData.branches?.forEach((branch) => {
            if (branch.targetNodeId === "exit") {
              // Exit branches transition to reset states - we need to find which one
              // Check eventInfo to see what state this exit branch maps to
              const eventInfoEntry = eventInfo?.find(
                (ei) => ei.eventname === nodeData.eventName
              );
              if (eventInfoEntry) {
                eventInfoEntry.currentState?.forEach((cs) => {
                  if (String(cs.currentState) === nodeState) {
                    cs.nextState?.forEach((ns) => {
                      const transitionToState = String(ns.transitionTo);
                      if (resetStates?.includes(transitionToState)) {
                        resetStatesForNode.add(transitionToState);
                      }
                    });
                  }
                });
              }
            } else {
              // Regular branch - check if target node has a reset state
              const targetNode = initialNodes.find(
                (n) => n.id === branch.targetNodeId
              );
              if (targetNode && targetNode.type === "state") {
                const targetNodeData = targetNode.data as JourneyNodeData;
                const targetNodeState =
                  nsm.get(targetNode.id) ||
                  esm.get(targetNodeData.eventName || "");
                if (targetNodeState && resetStates?.includes(targetNodeState)) {
                  resetStatesForNode.add(targetNodeState);
                }
              }
            }
          });
          if (resetStatesForNode.size > 0) {
            nodeToResetStateMap.set(node.id, resetStatesForNode);
          }
        });

        updatedNodes = initialNodes.map((node) => {
          if (node.type !== "state" || !node.data.eventName) return node;

          const nodeData = (node.data as unknown) as JourneyNodeData;
          const nodeState =
            nsm.get(node.id) || esm.get(node.data.eventName || "");

          if (!nodeState) return node;

          // Find actions for this state
          // CRITICAL: After deletion, onState is the source of truth because it's been updated
          // to reflect the new state numbers. We should check onState FIRST if it exists.
          const stateActions = nudgeActions.filter((action) => {
            const actionConfig = action.config as
              | Record<string, unknown>
              | undefined;
            const actionOriginalNodeId = actionConfig?.originalNodeId as
              | string
              | undefined;

            // CRITICAL: If action has onState, check if it matches this node's state
            // This is the PRIMARY check after deletion because onState is updated correctly
            // when nodes are deleted and state numbers shift
            if (action.onState) {
              const isActionStateResetState =
                resetStates?.includes(action.onState) || false;
              const isNodeStateResetState =
                resetStates?.includes(nodeState) || false;

              // Case 1: onState exactly matches nodeState - restore it
              if (action.onState === nodeState) {
                return true;
              }

              // Case 2: Action's onState is a reset state, but node's state is not
              // Check if this node transitions to that reset state
              if (isActionStateResetState && !isNodeStateResetState) {
                const nodeResetStates = nodeToResetStateMap.get(node.id);
                if (nodeResetStates && nodeResetStates.has(action.onState)) {
                  // Node transitions to this reset state - restore the action
                  return true;
                }
                // Node doesn't transition to the reset state - don't restore
                return false;
              }

              // Case 3: Both are regular states but don't match - don't restore
              // This means the action belongs to a different node
              if (!isActionStateResetState && !isNodeStateResetState) {
                return false;
              }
            }

            // Fallback: If action has originalNodeId, it MUST match this node's ID
            // This is the most reliable check for actions that haven't been updated yet
            if (actionOriginalNodeId) {
              if (actionOriginalNodeId !== node.id) {
                return false; // Don't restore - engagement was from a different node
              }
              // originalNodeId matches - this action belongs to this node
              return true;
            }

            // If action doesn't have originalNodeId, check originalEventName FIRST (before state)
            // CRITICAL: originalEventName is more reliable than state after deletions because
            // event names don't change, but state numbers shift when nodes are deleted
            const originalEventName = actionConfig?.originalEventName as
              | string
              | undefined;

            if (originalEventName) {
              // If originalEventName is stored, it must match this node's eventName
              // This is the PRIMARY check when originalNodeId is not available
              if (originalEventName !== nodeData.eventName) {
                return false; // Don't restore - engagement was from a different node
              }

              // CRITICAL: originalEventName matches, but we need to verify state compatibility
              // If action's onState is a reset state and doesn't match node's state,
              // verify that this node actually transitions to that reset state
              if (action.onState !== nodeState) {
                const isActionStateResetState =
                  (action.onState && resetStates?.includes(action.onState)) ||
                  false;
                const isNodeStateResetState =
                  resetStates?.includes(nodeState) || false;

                if (isActionStateResetState && !isNodeStateResetState) {
                  // Action is mapped to a reset state, but node is not
                  // Check if this node transitions to that reset state using the pre-built map
                  const nodeResetStates = nodeToResetStateMap.get(node.id);
                  if (
                    !nodeResetStates ||
                    !nodeResetStates.has(action?.onState || "undefined")
                  ) {
                    // Node doesn't transition to the reset state - don't restore
                    return false;
                  }
                  // Node transitions to this reset state - allow restoration
                } else if (!isActionStateResetState && !isNodeStateResetState) {
                  // Both are regular states but don't match - this might be due to state shifts after deletions
                  // Allow restoration but log a warning
                  console.warn(
                    `[JourneyFlowBuilderIntegrated] Restoring action ${action.actionId} with originalEventName ${originalEventName} but state mismatch: action.onState=${action.onState}, nodeState=${nodeState}. This is expected after deletions.`
                  );
                }
              }

              // CRITICAL: Verify that this action's engagement ID doesn't already exist on a different node
              // This prevents duplicate restorations if metadata is stale
              const actionEngagementId = action.actionId.includes("_")
                ? action.actionId.split("_")[0]
                : action.actionId;

              // Check if this engagement ID is already restored to a different node
              // We'll do this check after all nodes are processed, but for now, trust the originalEventName match
              return true;
            }

            if (action.onState !== nodeState) {
              // State doesn't match - don't restore
              return false;
            }

            console.warn(
              `[JourneyFlowBuilderIntegrated] Restoring legacy action ${action.actionId} by state matching (state ${nodeState}). This is unreliable after deletions. Consider re-saving to update metadata.`
            );
            return true;
          });

          // CRITICAL: When attaching engagements, match by nextState from eventInfo
          // onState represents the state number where the engagement should appear
          // We need to find which event transitions to that state and attach the engagement to that event's node
          // Example: If action.onState is "1", find which event transitions to state "1" and attach to that event's node
          const actionsForThisNode = nudgeActions.filter((action) => {
            if (!action.onState) return false;

            // Find which event transitions to this onState
            const eventNameThatTransitionsToOnState = nextStateToEventMap.get(
              action.onState
            );

            // Check if this node's eventName matches the event that transitions to the onState
            if (eventNameThatTransitionsToOnState === nodeData.eventName) {
              return true;
            }

            // No match
            return false;
          });

          // if (actionsForThisNode.length > 0) {
          // }
          if (actionsForThisNode.length > 0) {
            const restoredEngagements: Engagement[] = actionsForThisNode.map(
              (action) => {
                const engagementId = action.actionId.includes("_")
                  ? action.actionId.split("_")[0]
                  : action.actionId;

                const engagementType = mapNudgeTypeToEngagementType(
                  action.type
                );

                // Get originalNodeId from action config, or use current node's ID
                const actionConfig = action.config as
                  | Record<string, unknown>
                  | undefined;
                const actionOriginalNodeId = actionConfig?.originalNodeId as
                  | string
                  | undefined;

                return {
                  id: engagementId,
                  type: engagementType as "tooltip" | "popup" | "bottomsheet",
                  config: {
                    template: action.template,
                    variant: action.variant,
                    originalOnState: action.onState,
                    originalActionId: action.actionId,
                    // CRITICAL: Always use current node's ID and event name, not stored values
                    // Stored values might be from a previous incorrect match after deletions
                    originalEventName: nodeData.eventName, // Always use current node's event name
                    originalNodeId: node.id, // Always use current node's ID
                  },
                };
              }
            );

            return {
              ...node,
              data: ({
                ...nodeData,
                engagements: restoredEngagements,
              } as unknown) as Record<string, unknown>,
            };
          }

          return node;
        }) as Node<JourneyNodeData | EngagementNodeData>[];

        // CRITICAL: Deduplicate engagements across nodes - each engagement ID should only exist on one node
        // This prevents the same engagement from being restored to multiple nodes due to stale metadata
        const engagementIdToRestoredNodeMap = new Map<
          string,
          { nodeId: string; engagement: Engagement }
        >();
        const nodesWithEngagements = updatedNodes.filter((node) => {
          if (node.type !== "state") return false;
          const nodeData = node.data as JourneyNodeData;
          return nodeData.engagements && nodeData.engagements.length > 0;
        });

        // First pass: collect all engagements and their nodes
        nodesWithEngagements.forEach((node) => {
          const nodeData = node.data as JourneyNodeData;
          nodeData.engagements?.forEach((engagement) => {
            if (engagement.id) {
              const existing = engagementIdToRestoredNodeMap.get(engagement.id);
              if (!existing) {
                engagementIdToRestoredNodeMap.set(engagement.id, {
                  nodeId: node.id,
                  engagement,
                });
              } else {
                // Duplicate found - keep the one with originalNodeId matching the node, or the first one
                const engagementConfig = engagement.config as
                  | Record<string, unknown>
                  | undefined;
                const engagementOriginalNodeId = engagementConfig?.originalNodeId as
                  | string
                  | undefined;
                const existingConfig = existing.engagement.config as
                  | Record<string, unknown>
                  | undefined;
                const existingOriginalNodeId = existingConfig?.originalNodeId as
                  | string
                  | undefined;

                // Prefer the one where originalNodeId matches the node ID
                if (
                  engagementOriginalNodeId === node.id &&
                  existingOriginalNodeId !== existing.nodeId
                ) {
                  engagementIdToRestoredNodeMap.set(engagement.id, {
                    nodeId: node.id,
                    engagement,
                  });
                  console.warn(
                    `[JourneyFlowBuilderIntegrated] Duplicate engagement ${engagement.id} found. Keeping on node ${node.id} (originalNodeId matches). Removing from node ${existing.nodeId}.`
                  );
                } else if (
                  existingOriginalNodeId === existing.nodeId &&
                  engagementOriginalNodeId !== node.id
                ) {
                  // Keep existing one
                  console.warn(
                    `[JourneyFlowBuilderIntegrated] Duplicate engagement ${engagement.id} found. Keeping on node ${existing.nodeId} (originalNodeId matches). Removing from node ${node.id}.`
                  );
                } else {
                  // Neither matches - keep the first one encountered
                  console.warn(
                    `[JourneyFlowBuilderIntegrated] Duplicate engagement ${engagement.id} found on nodes ${existing.nodeId} and ${node.id}. Keeping first occurrence on node ${existing.nodeId}.`
                  );
                }
              }
            }
          });
        });

        // Second pass: remove duplicate engagements from nodes
        updatedNodes = updatedNodes.map((node) => {
          if (node.type !== "state") return node;
          const nodeData = node.data as JourneyNodeData;
          if (!nodeData.engagements || nodeData.engagements.length === 0)
            return node;

          const filteredEngagements = nodeData.engagements.filter(
            (engagement) => {
              if (!engagement.id) return true;
              const mapped = engagementIdToRestoredNodeMap.get(engagement.id);
              return mapped?.nodeId === node.id;
            }
          );

          if (filteredEngagements.length !== nodeData.engagements.length) {
            return {
              ...node,
              data: ({
                ...nodeData,
                engagements: filteredEngagements,
              } as unknown) as Record<string, unknown>,
            };
          }

          return node;
        }) as Node<JourneyNodeData | EngagementNodeData>[];

        // --- FINAL ENGAGEMENT NODE/EDGE CREATION (from updatedNodes) ---
        const engagementEdges: Edge[] = [];
        updatedNodes.forEach((node) => {
          if (node.type !== "state") return;
          const nodeData = (node.data as unknown) as JourneyNodeData;
          if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
            nodeData.engagements.forEach((engagement, engagementIndex) => {
              if (!engagement.type || !engagement.id) return;

              const engagementNodeId = `engagement-${engagement.id}`;
              const existingEngagementNode = updatedNodes.find(
                (n) => n.id === engagementNodeId
              );

              const getEngagementLabel = (type: string): string => {
                switch (type) {
                  case "tooltip":
                    return "Tooltip";
                  case "popup":
                    return "Popup";
                  case "bottomsheet":
                    return "Bottom Sheet";
                  default:
                    return type;
                }
              };

              if (!existingEngagementNode) {
                const baseX = node.position.x + 300;
                const baseY = node.position.y;
                const verticalOffset = engagementIndex * 120;

                const engagementNode: Node<EngagementNodeData> = {
                  id: engagementNodeId,
                  type: "engagement",
                  position: {
                    x: baseX,
                    y: baseY + verticalOffset,
                  },
                  data: {
                    label: getEngagementLabel(engagement.type),
                    nodeType: "engagement",
                    engagementId: engagement.id,
                    engagementType: engagement.type as
                      | "tooltip"
                      | "popup"
                      | "bottomsheet",
                  },
                };
                updatedNodes.push(engagementNode);
              }

              // Always ensure the edge exists
              const engagementEdge: Edge = {
                id: `edge-${node.id}-${engagementNodeId}`,
                source: node.id,
                target: engagementNodeId,
                type: "smoothstep",
                animated: false,
                style: {
                  stroke: theme.palette.warning.main,
                  strokeWidth: 2,
                  strokeDasharray: "5,5",
                },
                data: {
                  engagementId: engagement.id,
                },
              };
              engagementEdges.push(engagementEdge);
            });
          }
        });

        updatedEdges = [...initialEdges, ...engagementEdges];
        // --- END ENGAGEMENT NODE/EDGE CREATION ---

        // CRITICAL: Rebuild eventInfo from current flow state to get accurate next states
        // This ensures we have the correct transitions after deletions
        const currentEventInfo = convertFlowToEventInfo(
          updatedNodes as Node<JourneyNodeData>[],
          updatedEdges,
          esm,
          nsm
        );

        // CRITICAL: Update actions' onState to match next states after restoration
        // This ensures stateToAction mapping is correct even after multiple deletions
        // onState should be the NEXT state (where engagement appears), not the current state
        const currentActions = getValues("nudgeSelection.actions") || [];

        // Build a map of engagement IDs to nodes for quick lookup
        const engagementIdToNodeMap = new Map<string, Node<JourneyNodeData>>();
        updatedNodes.forEach((node) => {
          if (node.type === "state") {
            const nodeData = node.data as JourneyNodeData;
            if (nodeData.engagements) {
              nodeData.engagements.forEach((engagement) => {
                if (engagement.id) {
                  engagementIdToNodeMap.set(
                    engagement.id,
                    node as Node<JourneyNodeData>
                  );
                }
              });
            }
          }
        });

        // Build a map of node's current state -> next state from currentEventInfo
        const nodeStateToNextStateMap = new Map<string, string>();
        currentEventInfo.forEach((eventInfoEntry) => {
          eventInfoEntry.currentState?.forEach((currentState) => {
            const currentStateStr = String(currentState.currentState);
            // Get the first nextState transition
            const firstNextState = currentState.nextState?.[0];
            if (firstNextState) {
              const nextStateStr = String(firstNextState.transitionTo);
              // Find the node with this event name and current state
              const nodeWithEvent = updatedNodes.find(
                (n) =>
                  n.type === "state" &&
                  (n.data as JourneyNodeData).eventName ===
                    eventInfoEntry.eventname
              );
              if (nodeWithEvent) {
                const nodeState =
                  nsm.get(nodeWithEvent.id) ||
                  esm.get(eventInfoEntry.eventname) ||
                  currentStateStr;
                // Map: node's current state -> next state it transitions to
                nodeStateToNextStateMap.set(nodeState, nextStateStr);
              }
            }
          });
        });

        const updatedActions = currentActions.map((action) => {
          const actionConfig = action.config as
            | Record<string, unknown>
            | undefined;
          const actionOriginalNodeId = actionConfig?.originalNodeId as
            | string
            | undefined;
          const actionOriginalEventName = actionConfig?.originalEventName as
            | string
            | undefined;

          // Extract engagement ID from actionId
          const actionEngagementId = action.actionId.includes("_")
            ? action.actionId.split("_")[0]
            : action.actionId;

          // Find the node this action belongs to
          let matchingNode: Node<JourneyNodeData> | undefined;

          // First, try to find by originalNodeId
          if (actionOriginalNodeId) {
            matchingNode = updatedNodes.find(
              (n) => n.id === actionOriginalNodeId && n.type === "state"
            ) as Node<JourneyNodeData> | undefined;

            // Verify the engagement actually exists on this node
            if (matchingNode) {
              const nodeData = matchingNode.data as JourneyNodeData;
              const hasEngagement = nodeData.engagements?.some(
                (e) => e.id === actionEngagementId
              );
              if (!hasEngagement) {
                // Engagement doesn't exist on this node - clear matchingNode to try other methods
                matchingNode = undefined;
              }
            }
          }

          // If not found by originalNodeId, try by originalEventName
          if (!matchingNode && actionOriginalEventName) {
            matchingNode = updatedNodes.find(
              (n) =>
                n.type === "state" &&
                (n.data as JourneyNodeData).eventName ===
                  actionOriginalEventName
            ) as Node<JourneyNodeData> | undefined;

            // Verify the engagement actually exists on this node
            if (matchingNode) {
              const nodeData = matchingNode.data as JourneyNodeData;
              const hasEngagement = nodeData.engagements?.some(
                (e) => e.id === actionEngagementId
              );
              if (!hasEngagement) {
                // Engagement doesn't exist on this node - clear matchingNode
                matchingNode = undefined;
              }
            }
          }

          // If still not found, try to find by engagement ID (last resort)
          if (!matchingNode) {
            matchingNode = engagementIdToNodeMap.get(actionEngagementId);
          }

          if (matchingNode) {
            const nodeData = matchingNode.data as JourneyNodeData;
            const nodeState =
              nsm.get(matchingNode.id) || esm.get(nodeData.eventName || "");
            const nodeEventName = nodeData.eventName || "";

            // CRITICAL: Get the next state that this node transitions to
            // This is the state where the engagement should appear (onState)
            const nextState = nodeState
              ? nodeStateToNextStateMap.get(nodeState)
              : undefined;

            // CRITICAL: Always update onState, originalNodeId, and originalEventName to match current node
            // This ensures the action is correctly associated with the node even after multiple deletions
            // CRITICAL: onState should be the NEXT state (where engagement appears), not the current state
            if (nextState) {
              const needsUpdate =
                !action.onState || // CRITICAL: Update if onState is undefined
                action.onState !== nextState || // Compare with nextState, not nodeState
                (actionOriginalNodeId || matchingNode.id) !== matchingNode.id ||
                (actionOriginalEventName || nodeEventName) !== nodeEventName;

              if (needsUpdate) {
                // Update onState to next state and metadata to match current node
                return {
                  ...action,
                  onState: nextState, // CRITICAL: Set onState to node's NEXT state (where engagement appears)
                  config: {
                    ...action.config,
                    originalNodeId: matchingNode.id, // Always use current node's ID
                    originalEventName: nodeEventName, // Always use current node's event name
                    originalOnState: nextState, // CRITICAL: Store the next state for recovery
                  } as typeof action.config & {
                    originalNodeId: string;
                    originalEventName: string;
                    originalOnState: string;
                  },
                };
              }
            } else if (nodeState) {
              // Fallback: If nextState not found, use current state (shouldn't happen normally)
              // This might happen if the node has no transitions
              const needsUpdate =
                !action.onState ||
                action.onState !== nodeState ||
                (actionOriginalNodeId || matchingNode.id) !== matchingNode.id ||
                (actionOriginalEventName || nodeEventName) !== nodeEventName;

              if (needsUpdate) {
                return {
                  ...action,
                  onState: nodeState, // Fallback to current state
                  config: {
                    ...action.config,
                    originalNodeId: matchingNode.id,
                    originalEventName: nodeEventName,
                    originalOnState: nodeState,
                  } as typeof action.config & {
                    originalNodeId: string;
                    originalEventName: string;
                    originalOnState: string;
                  },
                };
              }
            }
          }
          return action;
        });
        // Use replaceActions from useFieldArray to ensure React Hook Form tracks changes correctly
        replaceActions(updatedActions);
      }

      // Finalize setting state and mark as initialized
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setEventStateMap(esm);
      setNodeStateMap(nsm);
      isInitializedRef.current = true;
    }
  }, [eventInfo, nudgeActions, setEdges, setNodes, setValue, theme]); // Now depends on form data, but guarded by isInitializedRef // Sync flow changes back to form

  // Auto-open configuration panel for initial node
  useEffect(() => {
    // Only open once, if panel is not already open, and we have nodes
    if (
      hasOpenedInitialNodeRef.current ||
      configPanelOpen ||
      nodes.length === 0
    ) {
      return;
    }

    // Find the initial/entry node
    const initialNode = nodes.find((node) => {
      if (node.type !== "state") return false;
      const nodeData = node.data as JourneyNodeData;
      return nodeData.isEntry === true || nodeData.label === "Initial Node";
    });

    // If we found an initial node and panel is closed, open it
    if (initialNode && !selectedNode) {
      setSelectedNode(initialNode as Node<JourneyNodeData>);
      setConfigPanelOpen(true);
      hasOpenedInitialNodeRef.current = true;
    }
  }, [nodes, configPanelOpen, selectedNode]);

  // Sync flow changes back to form
  // Helper function to get the next state that a node transitions to
  const getNextStateForNode = useCallback(
    (
      node: Node<JourneyNodeData>,
      currentEventInfo: EventInfo[] | undefined,
      currentEsm: EventStateMap,
      currentNsm: NodeStateMap
    ): string | undefined => {
      const nodeData = node.data as JourneyNodeData;
      const nodeState =
        currentNsm.get(node.id) || currentEsm.get(nodeData.eventName || "");

      if (!nodeState || !currentEventInfo) return undefined;

      // Find the event info for this node's event
      const eventInfoEntry = currentEventInfo.find(
        (ei) => ei.eventname === nodeData.eventName
      );

      if (eventInfoEntry) {
        // Find the currentState entry that matches this node's state
        const currentStateEntry = eventInfoEntry.currentState?.find(
          (cs) => String(cs.currentState) === nodeState
        );

        if (currentStateEntry?.nextState?.[0]) {
          // Return the first nextState transition
          return String(currentStateEntry.nextState[0].transitionTo);
        }
      }

      return undefined;
    },
    []
  );

  const syncFlowToForm = useCallback(() => {
    // Only run if initialization is complete
    if (!isInitializedRef.current) return;

    // Rebuild state maps first to ensure they're up to date
    const esm = buildEventStateMap(nodes as Node<JourneyNodeData>[]);
    const nsm = buildNodeStateMap(nodes as Node<JourneyNodeData>[], esm);
    setEventStateMap(esm);
    setNodeStateMap(nsm);

    const newEventInfo = convertFlowToEventInfo(
      nodes as Node<JourneyNodeData>[],
      edges,
      esm,
      nsm
    );
    // CRITICAL: This setValue updates `eventInfo` which could re-trigger the init useEffect
    // if not guarded. The fix is done via isInitializedRef in the init effect.
    setValue("ruleEngine.eventInfo", newEventInfo); // Handle resetStates - collect the nextState values from exit branches

    const resetStates: string[] = [];
    newEventInfo.forEach((eventInfo) => {
      eventInfo.currentState?.forEach((currentState) => {
        currentState.nextState?.forEach((nextState) => {
          const transitionToState = String(nextState.transitionTo);
          const stateExistsInEvents = newEventInfo.some((ei) =>
            ei.currentState?.some(
              (cs) => String(cs.currentState) === transitionToState
            )
          );

          if (!stateExistsInEvents) {
            if (!resetStates.includes(transitionToState)) {
              resetStates.push(transitionToState);
            }
          }
        });
      });
    });
    setValue("nudgeSelection.resetStates", resetStates); // Sync all engagements from all nodes to nudgeSelection.actions

    const currentActions = getValues("nudgeSelection.actions") || [];
    console.log(
      `[syncFlowToForm] Current actions from form:`,
      currentActions.map((a) => ({
        actionId: a.actionId,
        type: a.type,
        template: a.template,
      }))
    );
    let updatedActions = [...currentActions];
    const engagementStateMap = new Map<
      string,
      {
        engagement: Engagement;
        node: Node<JourneyNodeData>;
        stateNumber: string;
      }
    >(); // Collect engagements from state nodes

    // CRITICAL: Build a map of node's current state -> next state from eventInfo
    // This tells us what state each node transitions to
    const nodeStateToNextStateMap = new Map<string, string>();
    newEventInfo.forEach((eventInfo) => {
      eventInfo.currentState?.forEach((currentState) => {
        const currentStateStr = String(currentState.currentState);
        // Get the first nextState transition (assuming single transition for now)
        const firstNextState = currentState.nextState?.[0];
        if (firstNextState) {
          const nextStateStr = String(firstNextState.transitionTo);
          // Find the node with this event name and current state
          const nodeWithEvent = nodes.find(
            (n) =>
              n.type === "state" &&
              (n.data as JourneyNodeData).eventName === eventInfo.eventname
          );
          if (nodeWithEvent) {
            const nodeState =
              nsm.get(nodeWithEvent.id) ||
              esm.get(eventInfo.eventname) ||
              currentStateStr;
            // Map: node's current state -> next state it transitions to
            nodeStateToNextStateMap.set(nodeState, nextStateStr);
          }
        }
      });
    });

    nodes.forEach((node) => {
      if (node.type !== "state") return;

      const nodeData = (node.data as unknown) as JourneyNodeData;
      if (!nodeData.engagements || !Array.isArray(nodeData.engagements)) {
        return;
      }

      const stateNumber = nsm.get(node.id) || esm.get(nodeData.eventName || "");
      if (!stateNumber) {
        console.warn(
          `[syncFlowToForm] Node ${node.id} has no state number. Skipping engagements to prevent data corruption.`
        );
        return;
      }

      // CRITICAL: Get the next state that this node transitions to
      // This is the state where the engagement should appear
      const nextState = nodeStateToNextStateMap.get(stateNumber);

      nodeData.engagements.forEach((engagement) => {
        if (engagement.id) {
          engagementStateMap.set(engagement.id, {
            engagement,
            node: node as Node<JourneyNodeData>,
            stateNumber: nextState || stateNumber, // Use nextState if available, fallback to current state
          });
        }
      });
    }); // Sync each engagement to an action (only once per engagement ID)

    engagementStateMap.forEach(({ engagement, node, stateNumber }) => {
      // CRITICAL: stateNumber here is actually the NEXT state (where engagement appears)
      // This is the state that should be used for onState in the action
      const engagementConfig = engagement.config as
        | Record<string, unknown>
        | undefined;

      // Check if engagement has originalOnState that is a reset state
      // If so, preserve that reset state instead of using the next state
      const originalOnState = engagementConfig?.originalOnState as
        | string
        | undefined;
      const isOriginalOnStateResetState =
        originalOnState && resetStates?.includes(originalOnState);

      // Always set originalNodeId and originalEventName to current node's values
      // This ensures the engagement is correctly associated with this node
      const nodeData = node.data as JourneyNodeData;
      engagement.config = {
        ...engagementConfig,
        originalNodeId: node.id, // Always use current node's ID
        originalEventName: nodeData.eventName || "", // Always use current node's event name
        // Preserve originalOnState if it's a reset state, otherwise use next state
        originalOnState: isOriginalOnStateResetState
          ? originalOnState
          : stateNumber, // stateNumber is now the next state
      };

      // Use originalOnState if it's a reset state, otherwise use next state
      const stateToUse = isOriginalOnStateResetState
        ? originalOnState
        : stateNumber; // stateNumber is now the next state

      updatedActions = syncEngagementToAction(
        node,
        engagement,
        stateToUse,
        updatedActions
      );
    }); // CRITICAL: Deduplicate actions by exact actionId first, then by engagement ID
    // This prevents duplicate actions with the same actionId or same engagement ID
    const actionsByActionId = new Map<string, typeof updatedActions[0]>();
    const seenEngagementIds = new Set<string>();

    updatedActions.forEach((action) => {
      // First, deduplicate by exact actionId
      if (actionsByActionId.has(action.actionId)) {
        const existingAction = actionsByActionId.get(action.actionId)!;
        // Keep the one with variant if one has it and the other doesn't
        if (action.variant && !existingAction.variant) {
          actionsByActionId.set(action.actionId, action);
        }
        // Otherwise keep existing (first one encountered)
        return;
      }

      // Check for duplicate by engagement ID prefix
      const engagementId = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;

      if (seenEngagementIds.has(engagementId)) {
        // This engagement ID already has an action, skip this duplicate
        console.warn(
          `[syncFlowToForm] Duplicate action found for engagement ${engagementId}. Keeping first action, skipping: ${action.actionId}`
        );
        return;
      }

      // Add to maps
      actionsByActionId.set(action.actionId, action);
      seenEngagementIds.add(engagementId);
    });

    // Rebuild updatedActions from deduplicated map
    updatedActions = Array.from(actionsByActionId.values());

    // Only remove actions that truly don't exist anymore

    const engagementIds = new Set(engagementStateMap.keys());
    const existingStateNumbers = new Set<string>();
    newEventInfo.forEach((event) => {
      event.currentState?.forEach((state) => {
        existingStateNumbers.add(String(state.currentState));
      });
    });

    // CRITICAL: Build a map of node ID -> engagement IDs that exist on that node
    // This allows us to verify that an action's engagement actually exists on the node it claims to belong to
    const nodeToEngagementIdsMap = new Map<string, Set<string>>();
    nodes.forEach((node) => {
      if (node.type !== "state") return;
      const nodeData = (node.data as unknown) as JourneyNodeData;
      if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
        const engagementIdsOnNode = new Set<string>();
        nodeData.engagements.forEach((engagement) => {
          if (engagement.id) {
            engagementIdsOnNode.add(engagement.id);
          }
        });
        nodeToEngagementIdsMap.set(node.id, engagementIdsOnNode);
      }
    });

    // CRITICAL: First pass - update actions that need originalNodeId correction
    // This handles cases where nodes were deleted and recreated with new IDs
    updatedActions = updatedActions.map((action) => {
      const actionEngagementId = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;

      const actionConfig = action.config as Record<string, unknown> | undefined;
      const actionOriginalNodeId = actionConfig?.originalNodeId as
        | string
        | undefined;

      // Check if originalNodeId points to a node that doesn't exist
      if (actionOriginalNodeId) {
        const engagementIdsOnNode = nodeToEngagementIdsMap.get(
          actionOriginalNodeId
        );
        // If node doesn't exist or engagement not on that node, try to find by event name
        if (
          !engagementIdsOnNode ||
          !engagementIdsOnNode.has(actionEngagementId)
        ) {
          const actionOriginalEventName = actionConfig?.originalEventName as
            | string
            | undefined;
          if (actionOriginalEventName) {
            // Find node by event name
            const nodeByEventName = nodes.find(
              (n) =>
                n.type === "state" &&
                (n.data as JourneyNodeData).eventName ===
                  actionOriginalEventName
            );
            if (nodeByEventName) {
              const engagementIdsOnNewNode = nodeToEngagementIdsMap.get(
                nodeByEventName.id
              );
              if (
                engagementIdsOnNewNode &&
                engagementIdsOnNewNode.has(actionEngagementId)
              ) {
                // Found by event name - update originalNodeId to new node ID
                return {
                  ...action,
                  config: {
                    ...action.config,
                    originalNodeId: nodeByEventName.id,
                  } as typeof action.config & { originalNodeId: string },
                };
              }
            }
          }
        }
      }
      return action;
    });

    // Second pass - filter out actions that don't have matching engagements
    // EXCEPTION: Keep actions with onState that is a reset state, even if not attached to any node
    updatedActions = updatedActions.filter((action) => {
      const actionEngagementId = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;

      // Check if action's onState is a reset state
      // Reset states don't have direct node representations, so their engagements won't be in the flow
      // But we should still keep the action
      const isActionOnStateResetState =
        action.onState && resetStates?.includes(action.onState);

      // If it's a reset state action, always keep it
      if (isActionOnStateResetState) {
        return true;
      }

      // Check if engagement exists in current flow
      const hasMatchingEngagement = engagementIds.has(actionEngagementId);

      // CRITICAL: Verify that if action has originalNodeId, the engagement actually exists on that node
      // This prevents keeping actions from deleted engagements or engagements moved to different nodes
      const actionConfig = action.config as Record<string, unknown> | undefined;
      const actionOriginalNodeId = actionConfig?.originalNodeId as
        | string
        | undefined;

      let engagementExistsOnNode = false;
      if (actionOriginalNodeId) {
        const engagementIdsOnNode = nodeToEngagementIdsMap.get(
          actionOriginalNodeId
        );
        if (engagementIdsOnNode) {
          engagementExistsOnNode = engagementIdsOnNode.has(actionEngagementId);
        }
      }

      // Keep action ONLY if:
      // 1. Engagement exists in current flow AND (if originalNodeId exists) it exists on that specific node
      // This ensures we don't keep orphaned actions from deleted engagements or wrong nodes
      const shouldKeep =
        hasMatchingEngagement &&
        (engagementExistsOnNode || !actionOriginalNodeId);

      // if (!shouldKeep) {
      // }

      return shouldKeep;
    });

    // CRITICAL: After syncing all engagements, update all actions' onState to match current next states
    // This ensures that after node deletion, when state numbers shift, all onState values are updated correctly
    updatedActions = updatedActions.map((action) => {
      const actionConfig = action.config as Record<string, unknown> | undefined;
      const actionOriginalNodeId = actionConfig?.originalNodeId as
        | string
        | undefined;
      const actionOriginalOnState = actionConfig?.originalOnState as
        | string
        | undefined;

      // Check if originalOnState is a reset state - if so, preserve it
      const isOriginalOnStateResetState =
        actionOriginalOnState && resetStates?.includes(actionOriginalOnState);

      // Find the node this action belongs to
      const matchingNode = nodes.find(
        (n) => n.id === actionOriginalNodeId && n.type === "state"
      ) as Node<JourneyNodeData> | undefined;

      if (matchingNode) {
        const nodeData = matchingNode.data as JourneyNodeData;
        const nodeState =
          nsm.get(matchingNode.id) || esm.get(nodeData.eventName || "");

        if (nodeState) {
          // Get the next state that this node transitions to
          const nextState = nodeStateToNextStateMap.get(nodeState);

          // If originalOnState is a reset state, preserve it
          if (isOriginalOnStateResetState && actionOriginalOnState) {
            if (action.onState !== actionOriginalOnState) {
              // Update onState to match the preserved reset state
              return {
                ...action,
                onState: actionOriginalOnState,
                config: {
                  ...action.config,
                  originalOnState: actionOriginalOnState, // Preserve reset state
                } as typeof action.config & { originalOnState: string },
              };
            }
          } else if (nextState && action.onState !== nextState) {
            // Update onState to match the current next state
            return {
              ...action,
              onState: nextState,
              config: {
                ...action.config,
                originalOnState: nextState, // Also update originalOnState
              } as typeof action.config & { originalOnState: string },
            };
          }
        }
      }

      return action;
    });

    // CRITICAL: Use replaceActions from useFieldArray instead of setValue
    // This ensures React Hook Form properly tracks the array changes
    console.log(
      `[syncFlowToForm] About to replaceActions with:`,
      updatedActions.map((a) => ({
        actionId: a.actionId,
        type: a.type,
        template: a.template,
      }))
    );

    replaceActions(updatedActions);
  }, [nodes, edges, setValue, getValues]);

  useEffect(() => {
    if (syncFlowToFormRef) {
      syncFlowToFormRef.current = () => {
        if (configPanelOpen && saveNodePanelRef.current) {
          saveNodePanelRef.current();
        }
        setTimeout(() => {
          syncFlowToForm();
        }, 100);
      };
    }
  }, [syncFlowToForm, syncFlowToFormRef, configPanelOpen]);

  // FIX: This effect now ONLY runs when nodes/edges (the React Flow graph state) change due to user interaction,
  // triggering the sync *back* to the form state.
  useEffect(() => {
    // Skip sync if we're currently saving a node (to prevent infinite loop)
    if (isSavingNodeRef.current) {
      return;
    }
    // Only run if the component is fully initialized
    if (nodes.length > 0 && isInitializedRef.current) {
      syncFlowToForm();
    }
  }, [nodes, edges, syncFlowToForm]); // Function to sync saved template back to engagement config

  const syncTemplateToEngagement = useCallback(() => {
    const context = currentEngagementContextRef.current;
    if (!context) return;

    setNodes((currentNodes) => {
      const node = currentNodes.find((n) => n.id === context.nodeId);
      if (!node || node.type !== "state") return currentNodes;

      const nodeData = (node.data as unknown) as JourneyNodeData;
      const engagement = nodeData.engagements?.find(
        (e) => e.id === context.engagementId
      );
      if (!engagement) return currentNodes; // Get the saved template from form (use getValues to get latest data)

      const currentActions = getValues("nudgeSelection.actions") || [];
      const savedAction = currentActions.find(
        // Find the specific action matching the engagement ID prefix
        (a) => a.actionId.startsWith(context.engagementId)
      );

      if (savedAction && savedAction.template) {
        // Sync template back to engagement config
        const updatedEngagement = syncActionToEngagement(
          savedAction,
          node as Node<JourneyNodeData>,
          context.engagementId
        );
        if (updatedEngagement) {
          // Update the node with the updated engagement
          return currentNodes.map((n) => {
            if (n.id === context.nodeId && n.type === "state") {
              const nd = (n.data as unknown) as JourneyNodeData;
              return {
                ...n,
                data: ({
                  ...nd,
                  engagements: nd.engagements?.map((e) =>
                    e.id === context.engagementId ? updatedEngagement : e
                  ),
                } as unknown) as Record<string, unknown>,
              };
            }
            return n;
          });
        }
      }
      return currentNodes;
    });
  }, [getValues, setNodes]); // Function to check if all engagement nodes have templates

  const checkAllEngagementsHaveTemplates = useCallback((): boolean => {
    // Get all state nodes
    const stateNodes = nodes.filter((n) => n.type === "state") as Node<
      JourneyNodeData
    >[]; // Check each state node's engagements

    for (const node of stateNodes) {
      const nodeData = node.data as JourneyNodeData;
      const engagements = nodeData.engagements || []; // If there are engagements, check if all have templates

      if (engagements.length > 0) {
        for (const engagement of engagements) {
          if (engagement.type === "nativeEventEmitter") {
            // Validate NudgeEvent for nativeEventEmitter
            const hasTemplate =
              engagement.config &&
              typeof engagement.config === "object" &&
              engagement.config.template &&
              typeof engagement.config.template === "object";

            if (!hasTemplate) {
              return false; // Engagement exists but no template
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const template = engagement.config.template as any;

            // Check if it's a NudgeEvent structure
            if ("eventName" in template) {
              const nudgeEvent = template as NudgeEvent;

              // Validate eventName
              if (!nudgeEvent.eventName || nudgeEvent.eventName.trim() === "") {
                return false;
              }

              // Require at least one property if eventName is filled
              if (nudgeEvent.eventName && nudgeEvent.eventName.trim() !== "") {
                if (
                  !nudgeEvent.eventParams ||
                  nudgeEvent.eventParams.length === 0
                ) {
                  return false;
                }
              }

              // Validate eventParams if they exist
              if (nudgeEvent.eventParams && nudgeEvent.eventParams.length > 0) {
                for (const param of nudgeEvent.eventParams) {
                  // Validate param name
                  if (!param.name || param.name.trim() === "") {
                    return false;
                  }

                  // Validate param value
                  if (!param.value || param.value.length === 0) {
                    return false;
                  }

                  const firstValue = param.value[0];
                  if (!firstValue) {
                    return false;
                  }

                  // Check if it's a static type and has a value
                  if (!firstValue.isTemplateString) {
                    const staticValue = firstValue.value;
                    if (
                      staticValue === undefined ||
                      staticValue === null ||
                      String(staticValue).trim() === ""
                    ) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false; // Invalid template structure
            }

            continue;
          }

          // Check if engagement has a template in its config
          const hasTemplate =
            engagement.config &&
            typeof engagement.config === "object" &&
            engagement.config.template &&
            typeof engagement.config.template === "object" &&
            Object.keys(engagement.config.template).length > 0; // Check if template has meaningful content (more than just default structure)

          if (hasTemplate) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const template = engagement.config.template as any;
            const hasContent =
              (template.children &&
                Array.isArray(template.children) &&
                template.children.length > 0) ||
              (template.props && Object.keys(template.props).length > 1) || // More than just testID
              (template.styles && Object.keys(template.styles).length > 0) ||
              (template.type && template.type !== "undefined");

            if (!hasContent) {
              return false; // Engagement exists but template is empty/default
            }
          } else {
            return false; // Engagement exists but no template
          }
        }
      }
    }

    return true; // All engagements have templates
  }, [nodes]); // Expose sync function via ref for parent to call

  useEffect(() => {
    if (syncTemplateRef) {
      syncTemplateRef.current = syncTemplateToEngagement;
    }
  }, [syncTemplateToEngagement, syncTemplateRef]); // Expose check function via ref for parent to call

  useEffect(() => {
    if (checkAllEngagementsHaveTemplatesRef) {
      checkAllEngagementsHaveTemplatesRef.current = checkAllEngagementsHaveTemplates;
    }
  }, [checkAllEngagementsHaveTemplates, checkAllEngagementsHaveTemplatesRef]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.type === "engagement") {
        const engagementData = (node.data as unknown) as EngagementNodeData;
        const engagementId = engagementData.engagementId; // Find the source node for this engagement

        const sourceEdge = edges.find((e) => e.target === node.id);
        if (sourceEdge && onEngagementSelect) {
          const sourceNode = nodes.find((n) => n.id === sourceEdge.source);
          if (sourceNode && sourceNode.type === "state") {
            const stateNodeData = (sourceNode.data as unknown) as JourneyNodeData;
            const stateNumber =
              nodeStateMap.get(sourceNode.id) ||
              eventStateMap.get(stateNodeData.eventName || "") ||
              "0"; // Find the engagement in the source node

            const engagement = stateNodeData.engagements?.find(
              (e) => e.id === engagementId
            );
            if (engagement) {
              // Store engagement context for syncing template back
              currentEngagementContextRef.current = {
                nodeId: sourceNode.id,
                engagementId: engagementId,
              }; // Sync engagement to form action

              // CRITICAL: Get the next state that this node transitions to
              // This is the state where the engagement should appear
              const currentEventInfo = getValues("ruleEngine.eventInfo") as
                | EventInfo[]
                | undefined;
              const nextState =
                getNextStateForNode(
                  sourceNode as Node<JourneyNodeData>,
                  currentEventInfo,
                  eventStateMap,
                  nodeStateMap
                ) || stateNumber; // Fallback to current state if next state not found

              const currentActions = getValues("nudgeSelection.actions") || [];
              const updatedActions = syncEngagementToAction(
                sourceNode as Node<JourneyNodeData>,
                engagement,
                nextState, // Use next state instead of current state
                currentActions
              );
              replaceActions(updatedActions); // Use replaceActions to ensure React Hook Form tracks changes

              let attempts = 0;
              const maxAttempts = 20; // 2 seconds max wait
              const checkAndOpen = () => {
                attempts++;
                const formActions = getValues("nudgeSelection.actions") || [];
                const firstAction = formActions.find((a) =>
                  a.actionId.startsWith(engagementId)
                ); // Check if form state has been updated with the engagement data

                if (firstAction?.type && firstAction?.template) {
                  // Form state is ready, open the panel
                  onEngagementSelect(sourceNode.id, engagementId, stateNumber);
                } else if (attempts < maxAttempts) {
                  // Keep polling
                  setTimeout(checkAndOpen, 100);
                } else {
                  // Timeout - open anyway (might be a new engagement without template)
                  console.warn(
                    "Timeout waiting for form state update, opening panel anyway"
                  );
                  onEngagementSelect(sourceNode.id, engagementId, stateNumber);
                }
              }; // Start polling after a small delay to allow setValue to process

              setTimeout(checkAndOpen, 50);
            } else {
              // No engagement found, but still try to open panel
              onEngagementSelect(sourceNode.id, engagementId, stateNumber);
            }
          }
        }
        return;
      }

      if (node.type === "state") {
        setSelectedNode(node as Node<JourneyNodeData>);
        setConfigPanelOpen(true);
      }
    },
    [
      nodes,
      edges,
      onEngagementSelect,
      nodeStateMap,
      eventStateMap,
      getValues,
      setValue,
    ]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (edge.data?.branchId) {
      setHighlightedBranchId(edge.data.branchId as string);
    }
    if (edge.data?.engagementId) {
      setHighlightedEngagementId(edge.data.engagementId as string);
    }
  }, []);

  const handleUpdateNode = useCallback(
    (nodeId: string, data: Partial<JourneyNodeData>) => {
      // Set flag to prevent syncFlowToForm from running
      isSavingNodeRef.current = true;

      setNodes((nds) => {
        const sourceNode = nds.find((n) => n.id === nodeId);
        if (!sourceNode || sourceNode.type !== "state") {
          return nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          );
        }

        const updated = nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        );

        const updatedNode = updated.find((n) => n.id === nodeId);
        if (!updatedNode || updatedNode.type !== "state") {
          return updated;
        }

        const nodeData = (updatedNode.data as unknown) as JourneyNodeData;
        let workingArray = updated; // Handle engagement nodes

        if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
          // Create or update engagement nodes for this node
          nodeData.engagements.forEach((engagement, engagementIndex) => {
            // Skip if engagement type is missing or invalid
            if (!engagement.type || !engagement.id) {
              return;
            }

            const existingEngagementNode = workingArray.find(
              (n) =>
                n.type === "engagement" &&
                ((n.data as unknown) as EngagementNodeData).engagementId ===
                  engagement.id
            );

            if (!existingEngagementNode) {
              // Calculate position to the right of the source node, vertically offset for each engagement
              let engagementPosition;
              if (sourceNode) {
                // Position to the right of source node
                const baseX = sourceNode.position.x + 300; // Calculate Y position: start from source node's Y, then offset by engagement index // Each engagement is offset by 120px vertically to avoid overlap
                const baseY = sourceNode.position.y;
                const verticalOffset = engagementIndex * 120; // 120px spacing between engagement nodes
                engagementPosition = {
                  x: baseX,
                  y: baseY + verticalOffset,
                };
              } else {
                engagementPosition = {
                  x: 500,
                  y: 200 + engagementIndex * 120,
                };
              } // Helper function to get proper label for engagement type

              const getEngagementLabel = (type: string): string => {
                switch (type) {
                  case "tooltip":
                    return "Tooltip";
                  case "popup":
                    return "Popup";
                  case "bottomsheet":
                    return "Bottom Sheet";
                  default:
                    return type;
                }
              }; // Create engagement node

              const engagementNode: Node<EngagementNodeData> = {
                id: `engagement-${engagement.id}`,
                type: "engagement",
                position: engagementPosition,
                data: {
                  label: getEngagementLabel(engagement.type),
                  nodeType: "engagement",
                  engagementId: engagement.id,
                  engagementType: engagement.type as
                    | "tooltip"
                    | "popup"
                    | "bottomsheet"
                    | "nativeEventEmitter",
                },
              };
              workingArray.push(
                (engagementNode as unknown) as Node<Record<string, unknown>>
              );
            } else {
              // Update existing engagement node if type changed
              const engagementNodeData = (existingEngagementNode.data as unknown) as EngagementNodeData; // Helper function to get proper label for engagement type

              const getEngagementLabel = (type: string): string => {
                switch (type) {
                  case "tooltip":
                    return "Tooltip";
                  case "popup":
                    return "Popup";
                  case "bottomsheet":
                    return "Bottom Sheet";
                  default:
                    return type;
                }
              };

              if (engagementNodeData.engagementType !== engagement.type) {
                const index = workingArray.findIndex(
                  (n) => n.id === existingEngagementNode.id
                );
                if (index !== -1) {
                  workingArray[index] = {
                    ...existingEngagementNode,
                    data: ({
                      ...engagementNodeData,
                      engagementType: engagement.type as
                        | "tooltip"
                        | "popup"
                        | "bottomsheet",
                      label: getEngagementLabel(engagement.type),
                    } as unknown) as Record<string, unknown>,
                  };
                }
              } else {
                // Update label even if type hasn't changed, to ensure it's correct
                const index = workingArray.findIndex(
                  (n) => n.id === existingEngagementNode.id
                );
                if (
                  index !== -1 &&
                  engagementNodeData.label !==
                    getEngagementLabel(engagement.type)
                ) {
                  workingArray[index] = {
                    ...existingEngagementNode,
                    data: ({
                      ...engagementNodeData,
                      label: getEngagementLabel(engagement.type),
                    } as unknown) as Record<string, unknown>,
                  };
                }
              }
            }
          });
        } // Remove engagement nodes that are no longer in ANY node's engagements array // This needs to be done after all node updates, so we collect all engagement IDs from all state nodes

        const allEngagementIds = new Set<string>();
        workingArray.forEach((node) => {
          if (node.type === "state") {
            const nodeData = (node.data as unknown) as JourneyNodeData;
            if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
              nodeData.engagements.forEach((engagement) => {
                allEngagementIds.add(engagement.id);
              });
            }
          }
        }); // Filter out engagement nodes that don't exist in any state node's engagements

        workingArray = workingArray.filter((n) => {
          if (n.type === "engagement") {
            const engagementData = (n.data as unknown) as EngagementNodeData;
            return allEngagementIds.has(engagementData.engagementId);
          }
          return true;
        }); // Create nodes for branches that reference event names that don't exist yet

        if (nodeData.branches && Array.isArray(nodeData.branches)) {
          nodeData.branches.forEach((branch) => {
            if (branch.targetNodeId && branch.targetNodeId !== "exit") {
              // Check if a node with this event name already exists
              const existingNode = workingArray.find(
                (n) =>
                  n.type === "state" &&
                  ((n.data as unknown) as JourneyNodeData).eventName ===
                    branch.targetNodeId
              );

              if (!existingNode) {
                // Find the source node to position the new node relative to it
                const sourceNodeForPosition = workingArray.find(
                  (n) => n.id === nodeId && n.type === "state"
                ); // Calculate position to avoid overlaps

                const stateNodes = workingArray
                  .filter((n) => n.type === "state")
                  .map((n) => (n as unknown) as Node<JourneyNodeData>);
                const newNodePosition = calculateNonOverlappingPosition(
                  sourceNodeForPosition
                    ? ((sourceNodeForPosition as unknown) as Node<
                        JourneyNodeData
                      >)
                    : undefined,
                  stateNodes,
                  250, // horizontal spacing
                  150 // vertical spacing
                ); // Create new node for this event name

                const newNodeId = `state-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`; // Create default exit branch for new nodes
                const defaultBranch: Branch = {
                  id: `branch-default-${Date.now()}`,
                  targetNodeId: "exit",
                  filters: [],
                };
                const newNode: Node<JourneyNodeData> = {
                  id: newNodeId,
                  type: "state",
                  position: newNodePosition,
                  data: {
                    label: branch.targetNodeId,
                    nodeType: "state",
                    eventName: branch.targetNodeId,
                    engagements: [],
                    branches: [defaultBranch],
                    isEntry: false,
                  },
                };
                workingArray.push(
                  (newNode as unknown) as Node<Record<string, unknown>>
                );
              }
            }
          });
        }

        return workingArray;
      }); // Reset flag after a delay and manually trigger syncFlowToForm

      setTimeout(() => {
        isSavingNodeRef.current = false; // Manually trigger syncFlowToForm after save completes // Use requestAnimationFrame to ensure nodes state has updated
        requestAnimationFrame(() => {
          syncFlowToForm();
        });
      }, 100);
    },
    [setNodes, syncFlowToForm]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      // First, find the node being deleted and collect its engagement IDs
      const nodeToDelete = nodes.find((n) => n.id === nodeId);
      const engagementIdsToDelete = new Set<string>();

      if (nodeToDelete && nodeToDelete.type === "state") {
        const nodeData = nodeToDelete.data as JourneyNodeData;
        if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
          nodeData.engagements.forEach((engagement) => {
            if (engagement.id) {
              engagementIdsToDelete.add(engagement.id);
            }
          });
        }
      }

      // Find engagement node IDs connected to the deleted node
      const engagementNodeIds = new Set<string>();
      edges.forEach((edge) => {
        if (edge.source === nodeId && edge.target.startsWith("engagement-")) {
          engagementNodeIds.add(edge.target);
          // Extract engagement ID from node ID (format: engagement-{id})
          const engagementId = edge.target.replace("engagement-", "");
          if (engagementId) {
            engagementIdsToDelete.add(engagementId);
          }
        }
      });

      // Remove actions from form for deleted engagements using React Hook Form's removeAction
      // CRITICAL: Only remove actions that belong to THIS specific deleted node
      // We verify by BOTH engagement ID AND originalNodeId to ensure we don't remove actions from other nodes
      if (engagementIdsToDelete.size > 0) {
        const currentActions = getValues("nudgeSelection.actions") || [];
        // Find indices of actions to remove (in reverse order to maintain correct indices)
        const indicesToRemove: number[] = [];
        currentActions.forEach((action, index) => {
          const actionIdPrefix = action.actionId.includes("_")
            ? action.actionId.split("_")[0]
            : action.actionId;

          // First check: engagement ID must match one from deleted node
          if (!engagementIdsToDelete.has(actionIdPrefix)) {
            // Engagement ID doesn't match - keep this action
            return;
          }

          // Second check: action must have originalNodeId that matches the deleted node
          // This is the critical check to ensure we only remove actions from the deleted node
          const actionConfig = action.config as
            | Record<string, unknown>
            | undefined;
          const actionOriginalNodeId = actionConfig?.originalNodeId as
            | string
            | undefined;

          // CRITICAL: Only remove if action has originalNodeId AND it matches the deleted node ID
          // If action doesn't have originalNodeId, we can't verify it belongs to another node,
          // so we keep it to be safe (it might belong to a different node with same engagement ID)
          if (actionOriginalNodeId && actionOriginalNodeId === nodeId) {
            // Action belongs to deleted node - mark for removal
            indicesToRemove.push(index);
          }
        });

        // Remove actions in reverse order to maintain correct indices
        indicesToRemove
          .sort((a, b) => b - a)
          .forEach((index) => {
            removeAction(index);
          });
      }

      // Update nodes to remove the deleted node and its engagement nodes
      setNodes((nds) => {
        const filteredNodes = nds.filter(
          (node) => node.id !== nodeId && !engagementNodeIds.has(node.id)
        );

        // CRITICAL: After deletion, state numbers shift - update all remaining actions' onState
        // This ensures engagements stay intact for nodes that shifted to the deleted node's place
        setTimeout(() => {
          // Rebuild state maps with remaining nodes to get NEW state numbers
          const esm = buildEventStateMap(
            filteredNodes as Node<JourneyNodeData>[]
          );
          const nsm = buildNodeStateMap(
            filteredNodes as Node<JourneyNodeData>[],
            esm
          );

          // Rebuild eventInfo from remaining nodes to get NEW next states
          const newEdges = edges.filter(
            (edge) =>
              edge.source !== nodeId &&
              edge.target !== nodeId &&
              !engagementNodeIds.has(edge.source) &&
              !engagementNodeIds.has(edge.target)
          );
          const newEventInfo = convertFlowToEventInfo(
            filteredNodes as Node<JourneyNodeData>[],
            newEdges,
            esm,
            nsm
          );

          // Build a map of node's current state -> next state from newEventInfo
          const nodeStateToNextStateMap = new Map<string, string>();
          newEventInfo.forEach((eventInfoEntry) => {
            eventInfoEntry.currentState?.forEach((currentState) => {
              const currentStateStr = String(currentState.currentState);
              const firstNextState = currentState.nextState?.[0];
              if (firstNextState) {
                const nextStateStr = String(firstNextState.transitionTo);
                // Find the node with this event name and current state
                const nodeWithEvent = filteredNodes.find(
                  (n) =>
                    n.type === "state" &&
                    (n.data as JourneyNodeData).eventName ===
                      eventInfoEntry.eventname
                );
                if (nodeWithEvent) {
                  const nodeState =
                    nsm.get(nodeWithEvent.id) ||
                    esm.get(eventInfoEntry.eventname) ||
                    currentStateStr;
                  // Map: node's current state -> next state it transitions to
                  nodeStateToNextStateMap.set(nodeState, nextStateStr);
                }
              }
            });
          });

          // Get current actions and update their onState to match their node's NEW next state
          const currentActions = getValues("nudgeSelection.actions") || [];
          const updatedActions = currentActions.map((action) => {
            const actionConfig = action.config as
              | Record<string, unknown>
              | undefined;
            const actionOriginalNodeId = actionConfig?.originalNodeId as
              | string
              | undefined;
            const actionOriginalOnState = actionConfig?.originalOnState as
              | string
              | undefined;

            // CRITICAL: Calculate reset states from NEW eventInfo, not from old form data
            // After deletion, reset states may have changed (e.g., state "2" was reset, now it's regular)
            // A state is a reset state ONLY if it's a nextState but NOT a currentState of any event
            const newResetStates: string[] = [];
            const allCurrentStates = new Set<string>();
            const allNextStates = new Set<string>();

            // First, collect all current states and next states
            newEventInfo.forEach((eventInfo) => {
              eventInfo.currentState?.forEach((currentState) => {
                const currentStateStr = String(currentState.currentState);
                allCurrentStates.add(currentStateStr);

                currentState.nextState?.forEach((nextState) => {
                  const nextStateStr = String(nextState.transitionTo);
                  allNextStates.add(nextStateStr);
                });
              });
            });

            // A state is a reset state if it's a nextState but NOT a currentState
            allNextStates.forEach((nextState) => {
              if (!allCurrentStates.has(nextState)) {
                if (!newResetStates.includes(nextState)) {
                  newResetStates.push(nextState);
                }
              }
            });

            // Check if originalOnState is STILL a reset state in the NEW state configuration
            const isOriginalOnStateResetState =
              actionOriginalOnState &&
              newResetStates.includes(actionOriginalOnState);

            if (!actionOriginalNodeId) {
              // Action doesn't have originalNodeId - try to find node by engagement ID
              // Extract engagement ID from actionId
              const actionEngagementId = action.actionId.includes("_")
                ? action.actionId.split("_")[0]
                : action.actionId;

              // Try to find the node that has this engagement
              let matchingNodeByEngagement: Node<JourneyNodeData> | undefined;
              filteredNodes.forEach((node) => {
                if (node.type === "state") {
                  const nodeData = node.data as JourneyNodeData;
                  if (
                    nodeData.engagements?.some(
                      (e) => e.id === actionEngagementId
                    )
                  ) {
                    matchingNodeByEngagement = node as Node<JourneyNodeData>;
                  }
                }
              });

              if (matchingNodeByEngagement) {
                // Continue with the found node
                const nodeData = matchingNodeByEngagement.data as JourneyNodeData;
                const newNodeState =
                  nsm.get(matchingNodeByEngagement.id) ||
                  esm.get(nodeData.eventName || "");

                if (newNodeState) {
                  const newNextState = nodeStateToNextStateMap.get(
                    newNodeState
                  );
                  if (newNextState && action.onState !== newNextState) {
                    return {
                      ...action,
                      onState: newNextState,
                      config: {
                        ...action.config,
                        originalNodeId: matchingNodeByEngagement.id, // Set originalNodeId for future updates
                        originalEventName: nodeData.eventName || "",
                        originalOnState: newNextState,
                      } as typeof action.config & {
                        originalNodeId: string;
                        originalEventName: string;
                        originalOnState: string;
                      },
                    };
                  }
                }
              } else {
              }
              return action;
            }

            // Find the node this action belongs to
            const matchingNode = filteredNodes.find(
              (n) => n.id === actionOriginalNodeId && n.type === "state"
            ) as Node<JourneyNodeData> | undefined;

            if (!matchingNode) {
              // Node not found - action is orphaned, will be handled by syncFlowToForm
              return action;
            }

            // Get the NEW state number for this node (after deletion, states have shifted)
            const nodeData = matchingNode.data as JourneyNodeData;
            const newNodeState =
              nsm.get(matchingNode.id) || esm.get(nodeData.eventName || "");

            if (!newNodeState) {
              return action;
            }

            // CRITICAL: Get the NEW next state that this node transitions to
            // This is the state where the engagement should appear (onState)
            const newNextState = nodeStateToNextStateMap.get(newNodeState);

            // CRITICAL: If the node has a new next state, ALWAYS use that (even if originalOnState was a reset state)
            // Only preserve reset state if there's NO new next state for this node
            if (newNextState && action.onState !== newNextState) {
              // Node has a new next state - update to it (this takes priority over preserving reset state)
              return {
                ...action,
                onState: newNextState, // CRITICAL: Update onState to NEW next state (where engagement appears)
                config: {
                  ...action.config,
                  originalOnState: newNextState, // Also update stored state
                } as typeof action.config & { originalOnState: string },
              };
            } else if (
              isOriginalOnStateResetState &&
              actionOriginalOnState &&
              !newNextState
            ) {
              // Only preserve reset state if there's NO new next state for this node
              if (action.onState !== actionOriginalOnState) {
                return {
                  ...action,
                  onState: actionOriginalOnState,
                  config: {
                    ...action.config,
                    originalOnState: actionOriginalOnState, // Preserve reset state
                  } as typeof action.config & { originalOnState: string },
                };
              } else {
              }
            } else if (!newNextState) {
            }
            // else {
            // }

            return action;
          });

          // CRITICAL: Update eventInfo in form first to ensure state transitions are correct
          setValue("ruleEngine.eventInfo", newEventInfo);

          // Handle resetStates - collect the nextState values from exit branches
          const resetStates: string[] = [];
          newEventInfo.forEach((eventInfo) => {
            eventInfo.currentState?.forEach((currentState) => {
              currentState.nextState?.forEach((nextState) => {
                const transitionToState = String(nextState.transitionTo);
                const stateExistsInEvents = newEventInfo.some((ei) =>
                  ei.currentState?.some(
                    (cs) => String(cs.currentState) === transitionToState
                  )
                );

                if (!stateExistsInEvents) {
                  if (!resetStates.includes(transitionToState)) {
                    resetStates.push(transitionToState);
                  }
                }
              });
            });
          });
          setValue("nudgeSelection.resetStates", resetStates);

          // Update actions in form with new onState values
          replaceActions(updatedActions);
        }, 0);

        return filteredNodes;
      });

      // Remove edges connected to the deleted node and its engagement nodes
      setEdges((eds) => {
        return eds.filter(
          (edge) =>
            edge.source !== nodeId &&
            edge.target !== nodeId &&
            !engagementNodeIds.has(edge.source) &&
            !engagementNodeIds.has(edge.target)
        );
      });
    },
    [
      setNodes,
      setEdges,
      nodes,
      edges,
      getValues,
      setValue,
      removeAction,
      replaceActions,
    ]
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges]
  );

  const handleClosePanel = useCallback(() => {
    if (panelCloseHandlerRef.current) {
      panelCloseHandlerRef.current();
      panelCloseHandlerRef.current = null;
    }
    setConfigPanelOpen(false);
    setSelectedNode(null);
    setHighlightedBranchId(null);
    setHighlightedEngagementId(null);
  }, []);

  const handleDirectClose = useCallback(() => {
    setConfigPanelOpen(false);
    setSelectedNode(null);
  }, []); // Sync edges with branches and engagements

  useEffect(() => {
    // Only run this synchronization logic if the component is initialized
    if (!isInitializedRef.current) return;

    const branchEdges: Edge[] = [];
    const engagementEdges: Edge[] = [];

    nodes.forEach((node) => {
      if (node.type === "state") {
        const nodeData = (node.data as unknown) as JourneyNodeData;

        if (nodeData.branches && Array.isArray(nodeData.branches)) {
          nodeData.branches.forEach((branch) => {
            // Skip edges for exit branches - they're shown on the node itself
            if (branch.targetNodeId === "exit") {
              return;
            } // Find node by eventName

            const targetNode = nodes.find((n) => {
              if (n.type !== "state") return false;
              const targetNodeData = (n.data as unknown) as JourneyNodeData;
              return targetNodeData.eventName === branch.targetNodeId;
            });
            if (targetNode) {
              branchEdges.push({
                id: `edge-${branch.id}`,
                source: node.id,
                target: targetNode.id,
                sourceHandle: "branch-source",
                targetHandle: null,
                type: "bezier",
                data: { branchId: branch.id },
                style: { strokeWidth: 2 }, // eslint-disable-next-line @typescript-eslint/no-explicit-any
                markerEnd: { type: "arrowclosed" as any },
              });
            } // If target node doesn't exist yet, don't create edge - it will be created when node is saved
          });
        }

        if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
          nodeData.engagements.forEach((engagement) => {
            const engagementNode = nodes.find(
              (n) =>
                n.type === "engagement" &&
                ((n.data as unknown) as EngagementNodeData).engagementId ===
                  engagement.id
            );
            if (engagementNode) {
              engagementEdges.push({
                id: `engagement-edge-${engagement.id}`,
                source: node.id,
                target: engagementNode.id,
                sourceHandle: "engagement-source",
                targetHandle: null,
                type: "bezier",
                data: { engagementId: engagement.id },
                style: {
                  strokeWidth: 2,
                  stroke: theme.palette.warning.main,
                  strokeDasharray: "5,5",
                },
                markerEnd: {
                  type: "arrowclosed" as any,
                  color: theme.palette.warning.main,
                },
              });
            }
          });
        }
      }
    });

    setEdges((currentEdges) => {
      // Keep edges that are not branch-based or engagement-based (manually created)
      const manualEdges = currentEdges.filter(
        (e) => !e.id.startsWith("edge-") && !e.id.startsWith("engagement-edge-")
      ); // Create maps of existing edges for quick lookup

      const existingBranchEdgesMap = new Map(
        currentEdges
          .filter((e) => e.id.startsWith("edge-"))
          .map((e) => [e.id, e])
      );
      const existingEngagementEdgesMap = new Map(
        currentEdges
          .filter((e) => e.id.startsWith("engagement-edge-"))
          .map((e) => [e.id, e])
      ); // Update or create branch edges

      const updatedBranchEdges = branchEdges.map((be) => {
        const existing = existingBranchEdgesMap.get(be.id);
        if (existing) {
          return { ...existing, ...be };
        }
        return be;
      }); // Update or create engagement edges

      const updatedEngagementEdges = engagementEdges.map((ee) => {
        const existing = existingEngagementEdgesMap.get(ee.id);
        if (existing) {
          return { ...existing, ...ee };
        }
        return ee;
      }); // Combine all edges

      return [...manualEdges, ...updatedBranchEdges, ...updatedEngagementEdges];
    });
  }, [nodes, setEdges, theme]); // Added theme to dependency array

  const handleRemoveUnconnectedNodes = useCallback(() => {
    const {
      nodeIds,
      engagementNodeIds,
      isInitialNodeOnly,
    } = unconnectedNodesDialog; // If it's just the initial node with no data, don't remove it - just close dialog

    if (isInitialNodeOnly) {
      setUnconnectedNodesDialog({
        open: false,
        nodeIds: [],
        engagementNodeIds: [],
        isInitialNodeOnly: false,
      });
      return;
    } // Use functional updates to compute and update nodes and edges

    setNodes((nds) => {
      setEdges((eds) => {
        // Collect all engagement node IDs that are connected to nodes being removed
        const engagementNodesToRemove = new Set<string>(engagementNodeIds); // Find engagement nodes connected to state nodes being removed

        nodeIds.forEach((nodeId) => {
          eds.forEach((edge) => {
            if (
              edge.source === nodeId &&
              edge.target.startsWith("engagement-")
            ) {
              engagementNodesToRemove.add(edge.target);
            }
          });
        }); // First pass: remove the explicitly identified unconnected nodes and their connected engagements

        let tempRemainingNodes = nds.filter(
          (node) =>
            !nodeIds.includes(node.id) && !engagementNodesToRemove.has(node.id)
        ); // Remove edges connected to removed nodes

        let tempRemainingEdges = eds.filter(
          (edge) =>
            !nodeIds.includes(edge.source) &&
            !nodeIds.includes(edge.target) &&
            !engagementNodesToRemove.has(edge.source) &&
            !engagementNodesToRemove.has(edge.target)
        ); // Helper function to find all reachable state nodes from entry node using BFS

        const findReachableStateNodes = (
          entryNodeId: string,
          nodes: Node<Record<string, unknown>>[],
          edges: Edge[]
        ): Set<string> => {
          const reachableNodes = new Set<string>();
          const queue: string[] = [entryNodeId];
          reachableNodes.add(entryNodeId);

          while (queue.length > 0) {
            const currentNodeId = queue.shift();
            if (!currentNodeId) continue; // Find all state nodes reachable from current node

            edges.forEach((edge) => {
              if (edge.source === currentNodeId) {
                const targetId = edge.target;
                const targetNode = nodes.find(
                  (n) => n.id === targetId && n.type === "state"
                );
                if (targetNode && !reachableNodes.has(targetId)) {
                  reachableNodes.add(targetId);
                  queue.push(targetId);
                }
              }
            });
          }

          return reachableNodes;
        }; // Second pass: after removing nodes, check if any remaining nodes become unconnected // Keep checking until no more unconnected nodes are found

        let hasMoreUnconnected = true;
        while (hasMoreUnconnected) {
          const stateNodes = tempRemainingNodes.filter(
            (n) => n.type === "state"
          ) as Node<JourneyNodeData>[]; // Check if there's an entry node in the remaining nodes

          const entryNode = stateNodes.find((n) => n.data.isEntry); // If no entry node exists, all remaining state nodes are unconnected

          let newlyUnconnectedStateNodes: string[] = [];
          let reachableStateNodes: Set<string> = new Set();

          if (!entryNode) {
            // All state nodes are unconnected if there's no entry node
            newlyUnconnectedStateNodes = stateNodes.map((n) => n.id);
          } else {
            // Find all state nodes reachable from entry node
            reachableStateNodes = findReachableStateNodes(
              entryNode.id,
              tempRemainingNodes,
              tempRemainingEdges
            ); // Nodes not in reachableStateNodes are unconnected

            newlyUnconnectedStateNodes = stateNodes
              .filter((n) => !reachableStateNodes.has(n.id))
              .map((n) => n.id);
          } // Find all engagement nodes connected to newly unconnected state nodes

          const newlyUnconnectedEngagements: string[] = []; // Collect engagement nodes connected to unconnected state nodes

          newlyUnconnectedStateNodes.forEach((nodeId) => {
            tempRemainingEdges.forEach((edge) => {
              if (
                edge.source === nodeId &&
                edge.target.startsWith("engagement-")
              ) {
                newlyUnconnectedEngagements.push(edge.target);
              }
            });
          }); // Also find engagement nodes that are not connected to any reachable state node

          const engagementNodes = tempRemainingNodes.filter(
            (n) => n.type === "engagement"
          );

          engagementNodes.forEach((engagementNode) => {
            // Check if this engagement has an incoming edge from a reachable state node
            const hasReachableSource = tempRemainingEdges.some((edge) => {
              if (edge.target === engagementNode.id) {
                // If there's an entry node, check if source is reachable
                if (entryNode) {
                  return reachableStateNodes.has(edge.source);
                } // If no entry node, no state nodes are reachable
                return false;
              }
              return false;
            });

            if (!hasReachableSource) {
              newlyUnconnectedEngagements.push(engagementNode.id);
            }
          }); // Remove duplicates

          const uniqueUnconnectedEngagements = Array.from(
            new Set(newlyUnconnectedEngagements)
          ); // If no new unconnected nodes found, stop

          if (
            newlyUnconnectedStateNodes.length === 0 &&
            uniqueUnconnectedEngagements.length === 0
          ) {
            hasMoreUnconnected = false;
          } else {
            // Remove newly unconnected nodes (both state and engagement nodes)
            tempRemainingNodes = tempRemainingNodes.filter(
              (node) =>
                !newlyUnconnectedStateNodes.includes(node.id) &&
                !uniqueUnconnectedEngagements.includes(node.id)
            ); // Remove edges connected to newly removed nodes

            tempRemainingEdges = tempRemainingEdges.filter(
              (edge) =>
                !newlyUnconnectedStateNodes.includes(edge.source) &&
                !newlyUnconnectedStateNodes.includes(edge.target) &&
                !uniqueUnconnectedEngagements.includes(edge.source) &&
                !uniqueUnconnectedEngagements.includes(edge.target)
            );
          }
        } // If no state nodes remain, add initial node

        const finalStateNodes = tempRemainingNodes.filter(
          (n) => n.type === "state"
        );
        if (finalStateNodes.length === 0) {
          const initialNodeId = `state-${Date.now()}`;
          const initialNode: Node<JourneyNodeData> = {
            id: initialNodeId,
            type: "state",
            position: { x: 250, y: 100 },
            data: {
              label: "Initial Node",
              nodeType: "state",
              eventName: "",
              engagements: [],
              branches: [],
              isEntry: true,
            },
          };
          tempRemainingNodes = [...tempRemainingNodes, initialNode];
        } // Update nodes (this will be called after setEdges completes)

        setTimeout(() => {
          setNodes(tempRemainingNodes);
        }, 0); // Return updated edges

        return tempRemainingEdges;
      });

      return nds;
    });

    setUnconnectedNodesDialog({
      open: false,
      nodeIds: [],
      engagementNodeIds: [],
      isInitialNodeOnly: false,
    });
    syncFlowToForm();
    if (onSave) {
      onSave();
    }
  }, [unconnectedNodesDialog, setNodes, setEdges, syncFlowToForm, onSave]);

  const handleKeepUnconnectedNodes = useCallback(() => {
    setUnconnectedNodesDialog({
      open: false,
      nodeIds: [],
      engagementNodeIds: [],
      isInitialNodeOnly: false,
    }); // Do nothing on cancel - just close the dialog
  }, []); // Helper function to find all reachable state nodes from entry node using BFS

  const findReachableStateNodesForCheck = (
    entryNodeId: string,
    nodes: Node<Record<string, unknown>>[],
    edges: Edge[]
  ): Set<string> => {
    const reachableNodes = new Set<string>();
    const queue: string[] = [entryNodeId];
    reachableNodes.add(entryNodeId);

    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      if (!currentNodeId) continue; // Find all state nodes reachable from current node

      edges.forEach((edge) => {
        if (edge.source === currentNodeId) {
          const targetId = edge.target;
          const targetNode = nodes.find(
            (n) => n.id === targetId && n.type === "state"
          );
          if (targetNode && !reachableNodes.has(targetId)) {
            reachableNodes.add(targetId);
            queue.push(targetId);
          }
        }
      });
    }

    return reachableNodes;
  }; // Function to check for unconnected nodes/engagements (exposed via ref)

  const checkUnconnectedNodes = useCallback((): boolean => {
    const stateNodes = nodes.filter((n) => n.type === "state") as Node<
      JourneyNodeData
    >[]; // Check if there's only one initial node with no event data

    const isInitialNodeOnly =
      stateNodes.length === 1 &&
      stateNodes[0].data.isEntry &&
      (!stateNodes[0].data.eventName ||
        stateNodes[0].data.eventName.trim() === "") &&
      (!stateNodes[0].data.engagements ||
        stateNodes[0].data.engagements.length === 0);

    if (isInitialNodeOnly) {
      setUnconnectedNodesDialog({
        open: true,
        nodeIds: [],
        engagementNodeIds: [],
        isInitialNodeOnly: true,
      });
      return true;
    } // Check if nodes form a connected graph (even without explicit entry node)

    const findConnectedComponent = (startNodeId: string): Set<string> => {
      const connected = new Set<string>();
      const queue: string[] = [startNodeId];
      connected.add(startNodeId); // BFS to find all connected nodes (both directions - undirected graph)

      while (queue.length > 0) {
        const currentId = queue.shift();
        if (!currentId) continue; // Find nodes reachable FROM this node

        edges.forEach((edge) => {
          if (edge.source === currentId) {
            const targetId = edge.target;
            const targetNode = nodes.find(
              (n) => n.id === targetId && n.type === "state"
            );
            if (targetNode && !connected.has(targetId)) {
              connected.add(targetId);
              queue.push(targetId);
            }
          }
        }); // Find nodes that reach TO this node (bidirectional check)

        edges.forEach((edge) => {
          if (edge.target === currentId) {
            const sourceId = edge.source;
            const sourceNode = nodes.find(
              (n) => n.id === sourceId && n.type === "state"
            );
            if (sourceNode && !connected.has(sourceId)) {
              connected.add(sourceId);
              queue.push(sourceId);
            }
          }
        });
      }

      return connected;
    }; // Check if all state nodes are in one connected component

    let allNodesConnected = false;
    if (stateNodes.length > 0) {
      const firstNodeId = stateNodes[0].id;
      const connectedComponent = findConnectedComponent(firstNodeId);
      allNodesConnected = stateNodes.every((node) =>
        connectedComponent.has(node.id)
      );
    } // Check for unconnected nodes using reachability from entry node

    const entryNode = stateNodes.find((n) => n.data.isEntry);
    let unconnectedStateNodes: string[] = [];
    let reachableStateNodes: Set<string> = new Set();

    if (!entryNode) {
      // If no entry node, check if nodes form a connected component
      if (allNodesConnected && stateNodes.length > 0) {
        // All nodes are connected - valid flow, no unconnected nodes
        unconnectedStateNodes = [];
      } else {
        // Check if any node can serve as entry (no incoming edges)
        const potentialEntryNodes = stateNodes.filter((node) => {
          const hasIncoming = edges.some((edge) => edge.target === node.id);
          return !hasIncoming;
        });

        if (potentialEntryNodes.length > 0) {
          // Use the first potential entry node to check reachability
          reachableStateNodes = findReachableStateNodesForCheck(
            potentialEntryNodes[0].id,
            nodes,
            edges
          ); // Nodes not in reachableStateNodes are unconnected

          unconnectedStateNodes = stateNodes
            .filter((n) => !reachableStateNodes.has(n.id))
            .map((n) => n.id);
        } else {
          // No potential entry node and not all connected - all nodes are unconnected
          unconnectedStateNodes = stateNodes.map((n) => n.id);
        }
      }
    } else {
      // Find all state nodes reachable from entry node
      reachableStateNodes = findReachableStateNodesForCheck(
        entryNode.id,
        nodes,
        edges
      ); // Nodes not in reachableStateNodes are unconnected

      unconnectedStateNodes = stateNodes
        .filter((n) => !reachableStateNodes.has(n.id))
        .map((n) => n.id);
    } // Find unconnected engagement nodes

    const unconnectedEngagements: string[] = []; // Collect engagement nodes connected to unconnected state nodes

    unconnectedStateNodes.forEach((nodeId) => {
      edges.forEach((edge) => {
        if (edge.source === nodeId && edge.target.startsWith("engagement-")) {
          unconnectedEngagements.push(edge.target);
        }
      });
    }); // Also find engagement nodes that are not connected to any reachable state node

    const engagementNodes = nodes.filter((n) => n.type === "engagement");

    engagementNodes.forEach((engagementNode) => {
      // Check if this engagement has an incoming edge from a reachable state node
      const hasReachableSource = edges.some((edge) => {
        if (edge.target === engagementNode.id) {
          const sourceNode = nodes.find(
            (n) => n.id === edge.source && n.type === "state"
          );
          if (sourceNode) {
            // If there's an entry node, check if source is reachable
            if (entryNode) {
              return reachableStateNodes.has(edge.source);
            } // If no entry node, check if source is in the connected component
            if (stateNodes.length > 0) {
              const connectedComponent = findConnectedComponent(
                stateNodes[0].id
              );
              return connectedComponent.has(edge.source);
            }
          }
        }
        return false;
      });

      if (!hasReachableSource) {
        unconnectedEngagements.push(engagementNode.id);
      }
    }); // Remove duplicates

    const uniqueUnconnectedEngagements = Array.from(
      new Set(unconnectedEngagements)
    );

    if (
      unconnectedStateNodes.length > 0 ||
      uniqueUnconnectedEngagements.length > 0
    ) {
      setUnconnectedNodesDialog({
        open: true,
        nodeIds: unconnectedStateNodes,
        engagementNodeIds: uniqueUnconnectedEngagements,
        isInitialNodeOnly: false,
      });
      return true;
    }
    return false;
  }, [nodes, edges]); // Expose checkUnconnectedNodes via ref if provided

  useEffect(() => {
    if (checkUnconnectedNodesRef) {
      checkUnconnectedNodesRef.current = checkUnconnectedNodes;
    }
  }, [checkUnconnectedNodes, checkUnconnectedNodesRef]); // Get event names from events prop

  const eventNames = events.map((e) => e.eventName);

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        "& .react-flow__controls": {
          backgroundColor: `${theme.palette.background.paper} !important`,
          border: `1px solid ${theme.palette.divider} !important`,
        },
        "& .react-flow__controls-button": {
          backgroundColor: `${theme.palette.background.paper} !important`,
          borderBottom: `1px solid ${theme.palette.divider} !important`,
          color: `${theme.palette.text.primary} !important`,
          "&:hover": {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
          "&:last-child": {
            borderBottom: "none !important",
          },
        },
      }}
    >
      <Box
        sx={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}
      >
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
            edgesFocusable={true}
            defaultEdgeOptions={{ type: "bezier" }}
            style={{ width: "100%", height: "100%" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls
              style={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </ReactFlow>
        </ReactFlowProvider>
      </Box>

      <Drawer
        anchor="right"
        open={configPanelOpen}
        onClose={handleClosePanel}
        PaperProps={{
          sx: { width: "50vw", p: 3 },
        }}
      >
        {selectedNode && (
          <NodeConfigurationPanel
            node={selectedNode as Node<JourneyNodeData>}
            nodes={nodes as Node<JourneyNodeData>[]}
            onUpdate={(nodeId: string, data: Partial<JourneyNodeData>) => {
              handleUpdateNode(nodeId, data);
            }}
            onDelete={handleDeleteNode}
            onClose={handleDirectClose}
            onDeleteEdge={handleDeleteEdge}
            mockEventNames={eventNames}
            events={events}
            isLoadingEvents={isLoadingEvents}
            systemPropertyNames={systemPropertyNames}
            systemPropertyTypes={systemPropertyTypes}
            highlightedBranchId={highlightedBranchId}
            highlightedEngagementId={highlightedEngagementId}
            onRequestClose={panelCloseHandlerRef}
            saveNodePanelRef={saveNodePanelRef}
            onEngagementTemplateSelect={(
              engagementId: string,
              _engagementType: string
            ) => {
              if (onEngagementSelect && selectedNode) {
                const currentStateNumber =
                  nodeStateMap.get(selectedNode.id) ||
                  eventStateMap.get(selectedNode.data.eventName || "") ||
                  "0";

                // CRITICAL: Get the next state that this node transitions to
                // This is the state where the engagement should appear
                const currentEventInfo = getValues("ruleEngine.eventInfo") as
                  | EventInfo[]
                  | undefined;
                const stateNumber =
                  getNextStateForNode(
                    selectedNode,
                    currentEventInfo,
                    eventStateMap,
                    nodeStateMap
                  ) || currentStateNumber; // Fallback to current state if next state not found

                // Find the engagement

                const engagement = selectedNode.data.engagements?.find(
                  (e) => e.id === engagementId
                );
                if (engagement) {
                  // Store engagement context for syncing template back
                  currentEngagementContextRef.current = {
                    nodeId: selectedNode.id,
                    engagementId: engagementId,
                  }; // Sync engagement to form action

                  const currentActions =
                    getValues("nudgeSelection.actions") || [];
                  const updatedActions = syncEngagementToAction(
                    selectedNode,
                    engagement,
                    stateNumber,
                    currentActions
                  );
                  replaceActions(updatedActions); // Use replaceActions to ensure React Hook Form tracks changes
                }

                onEngagementSelect(selectedNode.id, engagementId, stateNumber);
              }
            }}
          />
        )}
      </Drawer>
      <Dialog
        open={unconnectedNodesDialog.open}
        onClose={() =>
          setUnconnectedNodesDialog({
            open: false,
            nodeIds: [],
            engagementNodeIds: [],
            isInitialNodeOnly: false,
          })
        }
      >
        <DialogTitle>
          {unconnectedNodesDialog.isInitialNodeOnly
            ? "Initial Journey Setup"
            : "Detached Nodes/Engagements"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {unconnectedNodesDialog.isInitialNodeOnly
              ? "Please fill the initial journey and engagement. Select an event for the initial node and add engagements to configure your journey."
              : unconnectedNodesDialog.nodeIds.length > 0 &&
                unconnectedNodesDialog.engagementNodeIds.length > 0
              ? `There are ${unconnectedNodesDialog.nodeIds.length} detached node(s) and ${unconnectedNodesDialog.engagementNodeIds.length} detached engagement(s) that are not connected to the main flow. Please remove them manually.`
              : unconnectedNodesDialog.nodeIds.length > 0
              ? `There are ${unconnectedNodesDialog.nodeIds.length} detached node(s) that are not connected to the main flow. Please remove them manually.`
              : `There are ${unconnectedNodesDialog.engagementNodeIds.length} detached engagement(s) that are not connected to the main flow. Please remove them manually.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setUnconnectedNodesDialog({
                open: false,
                nodeIds: [],
                engagementNodeIds: [],
                isInitialNodeOnly: false,
              })
            }
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
