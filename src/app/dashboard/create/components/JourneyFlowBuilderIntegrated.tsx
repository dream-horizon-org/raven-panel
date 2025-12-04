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
} from "react-hook-form";
import { CreateJourneyFormData, EventInfo } from "../types/journey.interface";
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
  findUnconnectedNodes,
  findUnconnectedEngagementNodes,
  EventStateMap,
  NodeStateMap,
} from "../utils/stateMapping";
import {
  syncEngagementToAction,
  syncActionToEngagement,
  mapNudgeTypeToEngagementType,
} from "../utils/engagementToActionMapping";

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

  // Start position: to the right and slightly below the source node
  let x = sourceNode.position.x + horizontalSpacing;
  let y = sourceNode.position.y + verticalSpacing;

  // Check for overlaps and adjust
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const hasOverlap = existingNodes.some((node) => {
      const dx = Math.abs(node.position.x - x);
      const dy = Math.abs(node.position.y - y);
      return dx < 200 && dy < 100; // Overlap threshold
    });

    if (!hasOverlap) {
      break;
    }

    // Try next position: move down first, then right
    if (attempts % 2 === 0) {
      y += verticalSpacing;
    } else {
      x += horizontalSpacing;
      y = sourceNode.position.y + verticalSpacing; // Reset Y
    }

    attempts++;
  }

  // Clamp to reasonable bounds
  return {
    x: Math.max(50, Math.min(x, 2000)),
    y: Math.max(50, Math.min(y, 2000)),
  };
}

// Type-safe conversion: React Flow's NodeTypes expects a specific structure,
// but our components work correctly at runtime. Using unknown as intermediate type
// is safer than 'any' and allows the type conversion.
const nodeTypes: NodeTypes = {
  state: (StateNode as unknown) as NodeTypes["state"],
  engagement: (EngagementNode as unknown) as NodeTypes["engagement"],
};

interface JourneyFlowBuilderIntegratedProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  events: Array<{
    metadata: { eventName: string };
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
}: JourneyFlowBuilderIntegratedProps) {
  const theme = useTheme();
  const { setValue, watch, getValues } = useFormContext<
    CreateJourneyFormData
  >();

  // Store current engagement context for syncing template back
  const currentEngagementContextRef = useRef<{
    nodeId: string;
    engagementId: string;
  } | null>(null);

  // Ref to prevent syncFlowToForm from running during node save
  const isSavingNodeRef = useRef(false);

  // Watch ruleEngine.eventInfo from form
  const eventInfo = useWatch({
    control,
    name: "ruleEngine.eventInfo",
  }) as EventInfo[] | undefined;

  // Watch nudgeSelection.actions to restore engagements
  const nudgeActions = useWatch({
    control,
    name: "nudgeSelection.actions",
  }) as CreateJourneyFormData["nudgeSelection"]["actions"] | undefined;

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

  // Initialize flow from form data
  useEffect(() => {
    // Skip initialization if we're currently saving a node (to prevent infinite loop)
    if (isSavingNodeRef.current) {
      return;
    }

    // Don't re-initialize if nodes already exist (preserve state on tab change)
    // This prevents nodes from being reset when component remounts
    if (nodes.length > 0) {
      return;
    }

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

      // Restore engagements from nudgeSelection.actions
      if (nudgeActions && nudgeActions.length > 0) {
        const updatedNodes = initialNodes.map((node) => {
          if (node.type !== "state" || !node.data.eventName) return node;

          const nodeData = (node.data as unknown) as JourneyNodeData;
          const nodeState =
            nsm.get(node.id) || esm.get(node.data.eventName || "");

          if (!nodeState) return node;

          // Find actions for this state
          const stateActions = nudgeActions.filter(
            (action) => action.onState === nodeState
          );

          if (stateActions.length > 0) {
            // Restore engagements from actions
            const restoredEngagements: Engagement[] = stateActions.map(
              (action) => {
                // Extract engagement ID from actionId (format: engagement-{timestamp}_{timestamp})
                const engagementId = action.actionId.includes("_")
                  ? action.actionId.split("_")[0]
                  : action.actionId;

                const engagementType = mapNudgeTypeToEngagementType(
                  action.type
                );

                return {
                  id: engagementId,
                  type: engagementType as "tooltip" | "popup" | "bottomsheet",
                  config: {
                    template: action.template,
                    variant: action.variant,
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
        });

        // Create engagement nodes and edges for restored engagements
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

              if (!existingEngagementNode) {
                // Helper function to get proper label for engagement type
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

                // Calculate position to the right of the source node
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
                updatedNodes.push(
                  (engagementNode as unknown) as Node<Record<string, unknown>>
                );

                // Create edge from state node to engagement node
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
              } else {
                // Edge might already exist, but ensure it's in the edges array
                const existingEdge = initialEdges.find(
                  (e) => e.source === node.id && e.target === engagementNodeId
                );
                if (!existingEdge) {
                  const engagementEdge: Edge = {
                    id: `edge-${node.id}-${engagementNodeId}`,
                    source: node.id,
                    target: engagementNodeId,
                    type: "smoothstep",
                    animated: false,
                    style: {
                      stroke: "#ff9800",
                      strokeWidth: 2,
                      strokeDasharray: "5,5",
                    },
                    data: {
                      engagementId: engagement.id,
                    },
                  };
                  engagementEdges.push(engagementEdge);
                }
              }
            });
          }
        });

        setNodes(updatedNodes);
        setEdges([...initialEdges, ...engagementEdges]);
        setEventStateMap(esm);
        setNodeStateMap(nsm);
      } else if (initialNodes.length > 0) {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setEventStateMap(esm);
        setNodeStateMap(nsm);
      }
    } else if (nodes.length === 0 && (!eventInfo || eventInfo.length === 0)) {
      // Only create initial entry node if no data exists AND no eventInfo
      // This prevents creating "Initial Node" when eventInfo exists but hasn't been processed yet
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
    }
  }, [eventInfo, nudgeActions, nodes.length]); // Re-run when eventInfo or nudgeActions change, but only if nodes are empty

  // Sync flow changes back to form
  const syncFlowToForm = useCallback(() => {
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
    setValue("ruleEngine.eventInfo", newEventInfo);

    // Handle resetStates - collect the nextState values from exit branches
    // Simply get the nextState value when user selects "exit" as target node
    const resetStates: string[] = [];
    newEventInfo.forEach((eventInfo) => {
      eventInfo.currentState?.forEach((currentState) => {
        currentState.nextState?.forEach((nextState) => {
          // Check if this nextState is an exit transition
          // Exit transitions have state numbers that don't match any event's currentState
          const transitionToState = String(nextState.transitionTo);
          const stateExistsInEvents = newEventInfo.some((ei) =>
            ei.currentState?.some(
              (cs) => String(cs.currentState) === transitionToState
            )
          );

          // If it doesn't exist in events, it's an exit transition - add nextState value to resetStates
          if (!stateExistsInEvents) {
            if (!resetStates.includes(transitionToState)) {
              resetStates.push(transitionToState);
            }
          }
        });
      });
    });
    setValue("nudgeSelection.resetStates", resetStates);
  }, [nodes, edges, setValue]);

  // Sync on node/edge changes
  useEffect(() => {
    // Skip sync if we're currently saving a node (to prevent infinite loop)
    if (isSavingNodeRef.current) {
      return;
    }
    if (nodes.length > 0) {
      syncFlowToForm();
    }
  }, [nodes, edges, syncFlowToForm]);

  // Function to sync saved template back to engagement config
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
      if (!engagement) return currentNodes;

      // Get the saved template from form (use getValues to get latest data)
      const currentActions = getValues("nudgeSelection.actions") || [];
      const savedAction = currentActions[0]; // Template is at index 0
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
  }, [nodes, getValues, setNodes]);

  // Function to check if all engagement nodes have templates
  const checkAllEngagementsHaveTemplates = useCallback((): boolean => {
    // Get all state nodes
    const stateNodes = nodes.filter((n) => n.type === "state") as Node<
      JourneyNodeData
    >[];

    // Check each state node's engagements
    for (const node of stateNodes) {
      const nodeData = node.data as JourneyNodeData;
      const engagements = nodeData.engagements || [];

      // If there are engagements, check if all have templates
      if (engagements.length > 0) {
        for (const engagement of engagements) {
          // Check if engagement has a template in its config
          const hasTemplate =
            engagement.config &&
            typeof engagement.config === "object" &&
            engagement.config.template &&
            typeof engagement.config.template === "object" &&
            Object.keys(engagement.config.template).length > 0;

          // Check if template has meaningful content (more than just default structure)
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
  }, [nodes]);

  // Expose sync function via ref for parent to call
  useEffect(() => {
    if (syncTemplateRef) {
      syncTemplateRef.current = syncTemplateToEngagement;
    }
  }, [syncTemplateToEngagement, syncTemplateRef]);

  // Expose check function via ref for parent to call
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
        const engagementId = engagementData.engagementId;

        // Find the source node for this engagement
        const sourceEdge = edges.find((e) => e.target === node.id);
        if (sourceEdge && onEngagementSelect) {
          const sourceNode = nodes.find((n) => n.id === sourceEdge.source);
          if (sourceNode && sourceNode.type === "state") {
            const stateNodeData = (sourceNode.data as unknown) as JourneyNodeData;
            const stateNumber =
              nodeStateMap.get(sourceNode.id) ||
              eventStateMap.get(stateNodeData.eventName || "") ||
              "0";

            // Find the engagement in the source node
            const engagement = stateNodeData.engagements?.find(
              (e) => e.id === engagementId
            );
            if (engagement) {
              // Store engagement context for syncing template back
              currentEngagementContextRef.current = {
                nodeId: sourceNode.id,
                engagementId: engagementId,
              };

              // Sync engagement to form action
              const currentActions = watch("nudgeSelection.actions") || [];
              const updatedActions = syncEngagementToAction(
                sourceNode as Node<JourneyNodeData>,
                engagement,
                stateNumber,
                currentActions
              );
              setValue("nudgeSelection.actions", updatedActions);
            }

            // Call onEngagementSelect to open EngagementSidePanel
            onEngagementSelect(sourceNode.id, engagementId, stateNumber);
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
      watch,
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
        let workingArray = updated;

        // Handle engagement nodes
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
                const baseX = sourceNode.position.x + 300;
                // Calculate Y position: start from source node's Y, then offset by engagement index
                // Each engagement is offset by 120px vertically to avoid overlap
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
              }

              // Helper function to get proper label for engagement type
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

              // Create engagement node
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
                    | "bottomsheet",
                },
              };
              workingArray.push(
                (engagementNode as unknown) as Node<Record<string, unknown>>
              );
            } else {
              // Update existing engagement node if type changed
              const engagementNodeData = (existingEngagementNode.data as unknown) as EngagementNodeData;

              // Helper function to get proper label for engagement type
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
        }

        // Remove engagement nodes that are no longer in ANY node's engagements array
        // This needs to be done after all node updates, so we collect all engagement IDs from all state nodes
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
        });

        // Filter out engagement nodes that don't exist in any state node's engagements
        workingArray = workingArray.filter((n) => {
          if (n.type === "engagement") {
            const engagementData = (n.data as unknown) as EngagementNodeData;
            return allEngagementIds.has(engagementData.engagementId);
          }
          return true;
        });

        // Create nodes for branches that reference event names that don't exist yet
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
                );

                // Calculate position to avoid overlaps
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
                );

                // Create new node for this event name
                const newNodeId = `state-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`;
                // Create default exit branch for new nodes
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
      });

      // Reset flag after a delay and manually trigger syncFlowToForm
      setTimeout(() => {
        isSavingNodeRef.current = false;
        // Manually trigger syncFlowToForm after save completes
        // Use requestAnimationFrame to ensure nodes state has updated
        requestAnimationFrame(() => {
          syncFlowToForm();
        });
      }, 100);
    },
    [setNodes, syncFlowToForm]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
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
  }, []);

  // Sync edges with branches and engagements
  useEffect(() => {
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
            }

            // Find node by eventName
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
                style: { strokeWidth: 2 },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                markerEnd: { type: "arrowclosed" as any },
              });
            }
            // If target node doesn't exist yet, don't create edge - it will be created when node is saved
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
      );

      // Create maps of existing edges for quick lookup
      const existingBranchEdgesMap = new Map(
        currentEdges
          .filter((e) => e.id.startsWith("edge-"))
          .map((e) => [e.id, e])
      );
      const existingEngagementEdgesMap = new Map(
        currentEdges
          .filter((e) => e.id.startsWith("engagement-edge-"))
          .map((e) => [e.id, e])
      );

      // Update or create branch edges
      const updatedBranchEdges = branchEdges.map((be) => {
        const existing = existingBranchEdgesMap.get(be.id);
        if (existing) {
          return { ...existing, ...be };
        }
        return be;
      });

      // Update or create engagement edges
      const updatedEngagementEdges = engagementEdges.map((ee) => {
        const existing = existingEngagementEdgesMap.get(ee.id);
        if (existing) {
          return { ...existing, ...ee };
        }
        return ee;
      });

      // Combine all edges
      return [...manualEdges, ...updatedBranchEdges, ...updatedEngagementEdges];
    });
  }, [nodes, setEdges]);

  // Validate unconnected nodes before save (unused but kept for potential future use)
  // const validateAndSave = useCallback(() => {
  //   const unconnected = findUnconnectedNodes(
  //     nodes as Node<JourneyNodeData>[],
  //     edges
  //   );
  //
  //   if (unconnected.length > 0) {
  //     setUnconnectedNodesDialog({ open: true, nodeIds: unconnected });
  //     return;
  //   }
  //
  //   syncFlowToForm();
  //   if (onSave) {
  //     onSave();
  //   }
  // }, [nodes, edges, syncFlowToForm, onSave]);

  const handleRemoveUnconnectedNodes = useCallback(() => {
    const {
      nodeIds,
      engagementNodeIds,
      isInitialNodeOnly,
    } = unconnectedNodesDialog;

    // If it's just the initial node with no data, don't remove it - just close dialog
    if (isInitialNodeOnly) {
      setUnconnectedNodesDialog({
        open: false,
        nodeIds: [],
        engagementNodeIds: [],
        isInitialNodeOnly: false,
      });
      return;
    }

    const allNodeIdsToRemove = [...nodeIds, ...engagementNodeIds];

    setNodes((nds) => {
      const remainingNodes = nds.filter(
        (node) => !allNodeIdsToRemove.includes(node.id)
      );

      // If no state nodes remain, add initial node
      const stateNodes = remainingNodes.filter((n) => n.type === "state");
      if (stateNodes.length === 0) {
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
        return [...remainingNodes, initialNode];
      }

      return remainingNodes;
    });

    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !allNodeIdsToRemove.includes(edge.source) &&
          !allNodeIdsToRemove.includes(edge.target)
      )
    );

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
    });
    // Do nothing on cancel - just close the dialog
  }, []);

  // Function to check for unconnected nodes/engagements (exposed via ref)
  const checkUnconnectedNodes = useCallback((): boolean => {
    const stateNodes = nodes.filter((n) => n.type === "state") as Node<
      JourneyNodeData
    >[];

    // Check if there's only one initial node with no event data
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
    }

    const unconnectedStateNodes = findUnconnectedNodes(stateNodes, edges);
    const unconnectedEngagements = findUnconnectedEngagementNodes(nodes, edges);

    if (unconnectedStateNodes.length > 0 || unconnectedEngagements.length > 0) {
      setUnconnectedNodesDialog({
        open: true,
        nodeIds: unconnectedStateNodes,
        engagementNodeIds: unconnectedEngagements,
        isInitialNodeOnly: false,
      });
      return true;
    }
    return false;
  }, [nodes, edges]);

  // Expose checkUnconnectedNodes via ref if provided
  useEffect(() => {
    if (checkUnconnectedNodesRef) {
      checkUnconnectedNodesRef.current = checkUnconnectedNodes;
    }
  }, [checkUnconnectedNodes, checkUnconnectedNodesRef]);

  // Get event names from events prop
  const eventNames = events.map((e) => e.metadata.eventName);

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
      <Box sx={{ flex: 1, position: "relative" }}>
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
            onEngagementTemplateSelect={(
              engagementId: string,
              _engagementType: string
            ) => {
              if (onEngagementSelect && selectedNode) {
                const stateNumber =
                  nodeStateMap.get(selectedNode.id) ||
                  eventStateMap.get(selectedNode.data.eventName || "") ||
                  "0";

                // Find the engagement
                const engagement = selectedNode.data.engagements?.find(
                  (e) => e.id === engagementId
                );
                if (engagement) {
                  // Store engagement context for syncing template back
                  currentEngagementContextRef.current = {
                    nodeId: selectedNode.id,
                    engagementId: engagementId,
                  };

                  // Sync engagement to form action
                  const currentActions = watch("nudgeSelection.actions") || [];
                  const updatedActions = syncEngagementToAction(
                    selectedNode,
                    engagement,
                    stateNumber,
                    currentActions
                  );
                  setValue("nudgeSelection.actions", updatedActions);
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
              ? `There are ${unconnectedNodesDialog.nodeIds.length} detached node(s) and ${unconnectedNodesDialog.engagementNodeIds.length} detached engagement(s) that are not connected. Do you want to remove them?`
              : unconnectedNodesDialog.nodeIds.length > 0
              ? `There are ${unconnectedNodesDialog.nodeIds.length} detached node(s) that are not connected. Do you want to remove them?`
              : `There are ${unconnectedNodesDialog.engagementNodeIds.length} detached engagement(s) that are not connected. Do you want to remove them?`}
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
            Cancel
          </Button>
          {!unconnectedNodesDialog.isInitialNodeOnly && (
            <Button onClick={handleRemoveUnconnectedNodes} color="error">
              Remove
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
