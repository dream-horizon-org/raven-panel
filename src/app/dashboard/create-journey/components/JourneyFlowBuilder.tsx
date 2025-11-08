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
} from "@mui/material";
import { StateNode, EngagementNode } from "./FlowNodes";
import NodeConfigurationPanel from "./NodeConfigurationPanel";
import EngagementConfigurationPanel from "./EngagementConfigurationPanel";
import { JourneyNodeData, Branch, EngagementNodeData, EngagementConfig } from "./types";

const nodeTypes: NodeTypes = {
  state: StateNode,
  engagement: EngagementNode,
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
  const [highlightedEngagementId, setHighlightedEngagementId] = useState<string | null>(null);
  const panelCloseHandlerRef = useRef<(() => void) | null>(null);
  const [selectedEngagementNode, setSelectedEngagementNode] = useState<Node<EngagementNodeData> | null>(null);
  const [engagementConfigPanelOpen, setEngagementConfigPanelOpen] = useState(false);

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

  // Sync edges with branches and engagements
  useEffect(() => {
    const branchEdges: Edge[] = [];
    const engagementEdges: Edge[] = [];

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
              sourceHandle: "branch-source",
              targetHandle: null,
              type: "bezier",
              data: { branchId: branch.id },
              style: { strokeWidth: 2 },
              markerEnd: { type: "arrowclosed" },
            });
          }
          // If target node doesn't exist yet, don't create edge - it will be created when node is saved
        });
      }

      // Create edges for engagements
      if (node.type === "state" && node.data.engagements && Array.isArray(node.data.engagements)) {
        node.data.engagements.forEach((engagement) => {
          // Find engagement node
          const engagementNode = nodes.find(
            (n) => n.type === "engagement" && (n.data as EngagementNodeData).engagementId === engagement.id
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
              style: { strokeWidth: 2, stroke: "#ff9800", strokeDasharray: "5,5" },
              markerEnd: { type: "arrowclosed", color: "#ff9800" },
            });
          }
        });
      }
    });

    // Update edges to match branches and engagements
    setEdges((currentEdges) => {
      // Keep edges that are not branch-based or engagement-based (manually created)
      const manualEdges = currentEdges.filter(
        (e) => !e.id.startsWith("edge-") && !e.id.startsWith("engagement-edge-")
      );
      
      // Create maps of existing edges for quick lookup
      const existingBranchEdgesMap = new Map(
        currentEdges.filter((e) => e.id.startsWith("edge-")).map((e) => [e.id, e])
      );
      const existingEngagementEdgesMap = new Map(
        currentEdges.filter((e) => e.id.startsWith("engagement-edge-")).map((e) => [e.id, e])
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

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === "state") {
        setSelectedNode(node as Node<JourneyNodeData>);
        setConfigPanelOpen(true);
        setHighlightedBranchId(null);
        setHighlightedEngagementId(null);
      } else if (node.type === "engagement") {
        // Open engagement configuration panel
        setSelectedEngagementNode(node as Node<EngagementNodeData>);
        setEngagementConfigPanelOpen(true);
      }
    },
    []
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      // Find the source node
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode && sourceNode.type === "state") {
        setSelectedNode(sourceNode as Node<JourneyNodeData>);
        setConfigPanelOpen(true);
        
        // Check if it's an engagement edge or branch edge
        if (edge.id.startsWith("engagement-edge-")) {
          // Extract engagementId from edge id (format: engagement-edge-{engagementId})
          const engagementId = edge.id.replace("engagement-edge-", "");
          setHighlightedEngagementId(engagementId);
          setHighlightedBranchId(null);
        } else if (edge.id.startsWith("edge-")) {
          // Extract branchId from edge id (format: edge-{branchId})
          const branchId = edge.id.replace("edge-", "");
          setHighlightedBranchId(branchId);
          setHighlightedEngagementId(null);
        }
      }
    },
    [nodes]
  );


  const handleUpdateNode = useCallback(
    (nodeId: string, data: Partial<JourneyNodeData>) => {
      setNodes((currentNodes) => {
        let updated = currentNodes.map((node) => {
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
        
        // Handle engagement nodes separately after updating the main node
        if (data.engagements && Array.isArray(data.engagements)) {
          const sourceNode = updated.find((n) => n.id === nodeId);
          
          data.engagements.forEach((engagement, engagementIndex) => {
            // Check if engagement node already exists
            const existingEngagementNode = updated.find(
              (n) => n.type === "engagement" && (n.data as EngagementNodeData).engagementId === engagement.id
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
                engagementPosition = { x: 500, y: 200 + (engagementIndex * 120) };
              }
              
              // Create engagement node
              const engagementNode: Node<EngagementNodeData> = {
                id: `engagement-${engagement.id}`,
                type: "engagement",
                position: engagementPosition,
                data: {
                  label: engagement.type,
                  nodeType: "engagement",
                  engagementId: engagement.id,
                  engagementType: engagement.type as "tooltip" | "popup" | "bottomsheet",
                },
              };
              updated.push(engagementNode);
            } else {
              // Update existing engagement node if type changed
              const engagementNodeData = existingEngagementNode.data as EngagementNodeData;
              if (engagementNodeData.engagementType !== engagement.type) {
                const index = updated.indexOf(existingEngagementNode);
                updated[index] = {
                  ...existingEngagementNode,
                  data: {
                    ...engagementNodeData,
                    engagementType: engagement.type as "tooltip" | "popup" | "bottomsheet",
                    label: engagement.type,
                  },
                };
              }
            }
          });
        }
        
        // Remove engagement nodes that are no longer in ANY node's engagements array
        // This needs to be done after all node updates, so we collect all engagement IDs from all state nodes
        const allEngagementIds = new Set<string>();
        updated.forEach((node) => {
          if (node.type === "state") {
            const nodeData = node.data as JourneyNodeData;
            if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
              nodeData.engagements.forEach((engagement) => {
                allEngagementIds.add(engagement.id);
              });
            }
          }
        });
        
        // Filter out engagement nodes that don't exist in any state node's engagements
        updated = updated.filter((n) => {
          if (n.type === "engagement") {
            const engagementData = n.data as EngagementNodeData;
            return allEngagementIds.has(engagementData.engagementId);
          }
          return true;
        });
        
        // Create nodes for branches that reference event names that don't exist yet
        if (data.branches) {
          data.branches.forEach((branch) => {
            if (branch.targetNodeId && branch.targetNodeId !== "exit") {
              // Check if a node with this event name already exists
              const existingNode = updated.find(
                (n) => n.type === "state" && (n.data as JourneyNodeData).eventName === branch.targetNodeId
              );
              
              if (!existingNode) {
                // Find the source node to position the new node relative to it
                const sourceNode = updated.find((n) => n.id === nodeId);
                
                // Calculate position to avoid overlaps
                const newNodePosition = calculateNonOverlappingPosition(
                  sourceNode as Node<JourneyNodeData> | undefined,
                  updated.filter((n) => n.type === "state") as Node<JourneyNodeData>[],
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
        
        return updated;
      });
    },
    [setNodes, selectedNode]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        // Find the node being deleted to get its engagements
        const nodeToDelete = nds.find((n) => n.id === nodeId);
        
        // Get engagement IDs from the node being deleted
        const engagementIds: string[] = [];
        if (nodeToDelete && nodeToDelete.type === "state") {
          const nodeData = nodeToDelete.data as JourneyNodeData;
          if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
            engagementIds.push(...nodeData.engagements.map((e) => e.id));
          }
        }
        
        // Filter out the deleted node and all its associated engagement nodes
        return nds.filter((node) => {
          // Remove the deleted node
          if (node.id === nodeId) {
            return false;
          }
          
          // Remove engagement nodes associated with the deleted node
          if (node.type === "engagement") {
            const engagementData = node.data as EngagementNodeData;
            return !engagementIds.includes(engagementData.engagementId);
          }
          
          return true;
        });
      });
      
      setEdges((eds) => {
        // Find engagement IDs from the node being deleted
        const nodeToDelete = nodes.find((n) => n.id === nodeId);
        const engagementIds: string[] = [];
        if (nodeToDelete && nodeToDelete.type === "state") {
          const nodeData = nodeToDelete.data as JourneyNodeData;
          if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
            engagementIds.push(...nodeData.engagements.map((e) => e.id));
          }
        }
        
        // Get engagement node IDs that will be deleted
        const engagementNodeIds = engagementIds.map((id) => `engagement-${id}`);
        
        // Filter out edges connected to:
        // 1. The deleted node (as source or target)
        // 2. Engagement nodes associated with the deleted node (as source or target)
        // 3. Engagement edges from the deleted node
        return eds.filter((edge) => {
          // Remove edges connected to the deleted node
          if (edge.source === nodeId || edge.target === nodeId) {
            return false;
          }
          
          // Remove edges connected to engagement nodes that will be deleted
          if (engagementNodeIds.includes(edge.source) || engagementNodeIds.includes(edge.target)) {
            return false;
          }
          
          // Remove engagement edges that reference the deleted node's engagements
          if (edge.id.startsWith("engagement-edge-")) {
            const engagementId = edge.id.replace("engagement-edge-", "");
            if (engagementIds.includes(engagementId)) {
              return false;
            }
          }
          
          return true;
        });
      });
      
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
        setConfigPanelOpen(false);
      }
      
      // Also close engagement config panel if it's open for a deleted engagement
      if (selectedEngagementNode) {
        const engagementData = selectedEngagementNode.data as EngagementNodeData;
        const nodeToDelete = nodes.find((n) => n.id === nodeId);
        if (nodeToDelete && nodeToDelete.type === "state") {
          const nodeData = nodeToDelete.data as JourneyNodeData;
          if (nodeData.engagements && Array.isArray(nodeData.engagements)) {
            const engagementIds = nodeData.engagements.map((e) => e.id);
            if (engagementIds.includes(engagementData.engagementId)) {
              setSelectedEngagementNode(null);
              setEngagementConfigPanelOpen(false);
            }
          }
        }
      }
    },
    [setNodes, setEdges, selectedNode, nodes, selectedEngagementNode, setSelectedEngagementNode, setEngagementConfigPanelOpen]
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges]
  );


  const handleClosePanel = () => {
    // If panel has a close handler (for checking unsaved changes), use it
    // Otherwise, close directly
    if (panelCloseHandlerRef.current) {
      panelCloseHandlerRef.current();
    } else {
      setConfigPanelOpen(false);
      setSelectedNode(null);
      setHighlightedBranchId(null);
      setHighlightedEngagementId(null);
    }
  };

  const handleDirectClose = () => {
    setConfigPanelOpen(false);
    setSelectedNode(null);
    setHighlightedBranchId(null);
    setHighlightedEngagementId(null);
    panelCloseHandlerRef.current = null;
  };

  const handleUpdateEngagementConfig = useCallback(
    (engagementId: string, config: EngagementConfig) => {
      setNodes((currentNodes) => {
        return currentNodes.map((node) => {
          if (node.type === "state") {
            const nodeData = node.data as JourneyNodeData;
            if (nodeData.engagements) {
              const updatedEngagements = nodeData.engagements.map((engagement) =>
                engagement.id === engagementId
                  ? { ...engagement, config: config as Record<string, unknown> }
                  : engagement
              );
              return {
                ...node,
                data: {
                  ...nodeData,
                  engagements: updatedEngagements,
                },
              };
            }
          }
          return node;
        });
      });
    },
    [setNodes]
  );

  const handleCloseEngagementPanel = () => {
    setEngagementConfigPanelOpen(false);
    setSelectedEngagementNode(null);
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
            defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
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
            onClose={handleDirectClose}
            onDeleteEdge={handleDeleteEdge}
            mockEventNames={MOCK_EVENT_NAMES}
            highlightedBranchId={highlightedBranchId}
            highlightedEngagementId={highlightedEngagementId}
            onRequestClose={panelCloseHandlerRef}
          />
        )}
      </Drawer>

      {/* Engagement Configuration Panel */}
      <Drawer
        anchor="right"
        open={engagementConfigPanelOpen}
        onClose={handleCloseEngagementPanel}
        PaperProps={{
          sx: { width: "85vw", maxWidth: "1400px", p: 3 },
        }}
      >
        {selectedEngagementNode && (
          <EngagementConfigurationPanel
            engagementNode={selectedEngagementNode}
            sourceNode={
              nodes.find(
                (n) =>
                  n.type === "state" &&
                  (n.data as JourneyNodeData).engagements?.some(
                    (e) => e.id === selectedEngagementNode.data.engagementId
                  )
              ) || selectedNode || nodes[0]
            }
            onUpdate={handleUpdateEngagementConfig}
            onClose={handleCloseEngagementPanel}
          />
        )}
      </Drawer>
    </Box>
  );
}
