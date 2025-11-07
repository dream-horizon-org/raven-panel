"use client";

import { useState, useCallback, useEffect } from "react";
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
} from "@mui/material";
import { StateNode } from "./FlowNodes";
import NodeConfigurationPanel from "./NodeConfigurationPanel";
import { JourneyNodeData, Branch } from "./types";

const nodeTypes: NodeTypes = {
  state: StateNode,
};

// Mock event names
const MOCK_EVENT_NAMES = [
  "UserLoggedIn",
  "PaymentCompleted",
  "ScreenViewed",
  "ButtonClicked",
  "FormSubmitted",
  "ItemAddedToCart",
  "CheckoutStarted",
  "ProfileUpdated",
];

const initialNodes: Node<JourneyNodeData>[] = [];

const initialEdges: Edge[] = [];

// Helper function to calculate non-overlapping position for new nodes
function calculateNonOverlappingPosition(
  sourceNode: Node<JourneyNodeData> | undefined,
  existingNodes: Node<JourneyNodeData>[],
  horizontalSpacing: number = 250,
  verticalSpacing: number = 150
): { x: number; y: number } {
  const nodeWidth = 200; // Approximate node width
  const nodeHeight = 100; // Approximate node height
  
  if (!sourceNode) {
    // If no source node, place in a default position
    return { x: 250, y: 200 };
  }
  
  // Start position: to the right and slightly below the source node
  let x = sourceNode.position.x + horizontalSpacing;
  let y = sourceNode.position.y + verticalSpacing;
  
  // Check for overlaps and adjust position
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const hasOverlap = existingNodes.some((node) => {
      const distanceX = Math.abs(node.position.x - x);
      const distanceY = Math.abs(node.position.y - y);
      return distanceX < nodeWidth + 20 && distanceY < nodeHeight + 20;
    });
    
    if (!hasOverlap) {
      break;
    }
    
    // Try different positions: move down, then right, then up
    if (attempts % 3 === 0) {
      y += verticalSpacing;
    } else if (attempts % 3 === 1) {
      x += horizontalSpacing;
    } else {
      y -= verticalSpacing / 2;
    }
    
    attempts++;
  }
  
  // Ensure position is within reasonable bounds
  return {
    x: Math.max(50, Math.min(x, 2000)),
    y: Math.max(50, Math.min(y, 2000)),
  };
}

export default function JourneyFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<JourneyNodeData> | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [highlightedBranchId, setHighlightedBranchId] = useState<string | null>(null);

  // Create initial node on mount and remove any exit nodes
  useEffect(() => {
    setNodes((currentNodes) => {
      // Remove any exit nodes
      const filteredNodes = currentNodes.filter((n) => n.type !== "exit");
      
      if (filteredNodes.length === 0) {
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
        return [initialNode];
      }
      return filteredNodes;
    });
    
    // Remove edges pointing to exit nodes
    setEdges((currentEdges) => {
      return currentEdges.filter((e) => {
        // Check if target is an exit node by checking if it's "exit-node" or if we need to check nodes
        return e.target !== "exit-node";
      });
    });
  }, [nodes.length, setNodes, setEdges]);

  // Sync edges with branches
  useEffect(() => {
    const branchEdges: Edge[] = [];

    nodes.forEach((node) => {
      if (node.type === "state" && node.data.branches && Array.isArray(node.data.branches)) {
        node.data.branches.forEach((branch) => {
          // Skip edges for exit branches - they're shown on the node itself
          if (branch.targetNodeId === "exit") {
            return;
          }
          
          // Find node by eventName
          const targetNode = nodes.find(
            (n) => n.type === "state" && n.data.eventName === branch.targetNodeId
          );
          if (targetNode) {
            branchEdges.push({
              id: `edge-${branch.id}`,
              source: node.id,
              target: targetNode.id,
              type: "bezier",
              data: { branchId: branch.id },
              style: { strokeWidth: 2 },
              markerEnd: { type: "arrowclosed" },
            });
          }
          // If target node doesn't exist yet, don't create edge - it will be created when node is saved
        });
      }
    });

    // Update edges to match branches
    setEdges((currentEdges) => {
      // Keep edges that are not branch-based (manually created)
      const manualEdges = currentEdges.filter((e) => !e.id.startsWith("edge-"));
      
      // Create a map of existing branch edges for quick lookup
      const existingBranchEdgesMap = new Map(
        currentEdges.filter((e) => e.id.startsWith("edge-")).map((e) => [e.id, e])
      );
      
      // Update or create branch edges
      const updatedBranchEdges = branchEdges.map((be) => {
        const existing = existingBranchEdgesMap.get(be.id);
        if (existing) {
          // Preserve any custom properties from existing edge, but update with branch data
          return { ...existing, ...be };
        }
        return be;
      });

      // Combine manual edges with branch edges
      return [...manualEdges, ...updatedBranchEdges];
    });
  }, [nodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<JourneyNodeData>) => {
      setSelectedNode(node);
      setConfigPanelOpen(true);
      setHighlightedBranchId(null);
    },
    []
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      // Find the source node
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode) {
        setSelectedNode(sourceNode as Node<JourneyNodeData>);
        setConfigPanelOpen(true);
        // Extract branchId from edge id (format: edge-{branchId})
        const branchId = edge.id.replace("edge-", "");
        setHighlightedBranchId(branchId);
      }
    },
    [nodes]
  );


  const handleUpdateNode = useCallback(
    (nodeId: string, data: Partial<JourneyNodeData>) => {
      setNodes((currentNodes) => {
        const updated = currentNodes.map((node) => {
          if (node.id === nodeId) {
            // Update label to event name if event name is provided
            const updatedData = { ...node.data, ...data };
            if (data.eventName && data.eventName.trim() !== "") {
              updatedData.label = data.eventName;
            }
            return { ...node, data: updatedData };
          }
          return node;
        });
        
        // Create nodes for branches that reference event names that don't exist yet
        if (data.branches) {
          data.branches.forEach((branch) => {
            if (branch.targetNodeId && branch.targetNodeId !== "exit") {
              // Check if a node with this event name already exists
              const existingNode = updated.find(
                (n) => n.type === "state" && n.data.eventName === branch.targetNodeId
              );
              
              if (!existingNode) {
                // Find the source node to position the new node relative to it
                const sourceNode = updated.find((n) => n.id === nodeId);
                
                // Calculate position to avoid overlaps
                const newNodePosition = calculateNonOverlappingPosition(
                  sourceNode as Node<JourneyNodeData> | undefined,
                  updated as Node<JourneyNodeData>[],
                  250, // horizontal spacing
                  150  // vertical spacing
                );
                
                // Create new node for this event name
                const newNodeId = `state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
                updated.push(newNode);
              }
            }
          });
        }
        
        // Update selected node if it's the one being updated
        if (selectedNode?.id === nodeId) {
          const updatedNode = updated.find((n) => n.id === nodeId) as Node<JourneyNodeData> | undefined;
          if (updatedNode) {
            setSelectedNode(updatedNode);
          }
        }
        
        // Force edge sync by triggering it after nodes are updated
        // The useEffect will handle edge creation, but we need to ensure it runs
        return updated;
      });
    },
    [setNodes, selectedNode]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
        setConfigPanelOpen(false);
      }
    },
    [setNodes, setEdges, selectedNode]
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges]
  );

  // This function is no longer needed - nodes are created when configuration is saved
  // Keeping it for backward compatibility but it does nothing now
  const handleCreateNodeOrExit = useCallback(() => {
    // Do nothing - nodes will be created when handleUpdateNode is called (on save)
  }, []);

  const handleClosePanel = () => {
    setConfigPanelOpen(false);
    setSelectedNode(null);
    setHighlightedBranchId(null);
  };

  return (
    <Box sx={{ height: "100%", position: "relative", width: "100%", display: "flex", flexDirection: "column" }}>
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
            fitView
            edgesUpdatable={true}
            edgesFocusable={true}
            defaultEdgeOptions={{ type: "bezier" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
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
            node={selectedNode}
            nodes={nodes}
            onUpdate={handleUpdateNode}
            onDelete={handleDeleteNode}
            onClose={handleClosePanel}
            onDeleteEdge={handleDeleteEdge}
            mockEventNames={MOCK_EVENT_NAMES}
            highlightedBranchId={highlightedBranchId}
          />
        )}
      </Drawer>
    </Box>
  );
}
