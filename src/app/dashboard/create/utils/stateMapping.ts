import { Node, Edge } from "@xyflow/react";
import { JourneyNodeData, Branch } from "../types/JourneyNode.interface";
import { EventInfo, Filter } from "../types/journey.interface";

/**
 * Maps event names to their state numbers
 * Key: eventName, Value: stateNumber (as string)
 */
export type EventStateMap = Map<string, string>;

/**
 * Maps node IDs to their state numbers
 * Key: nodeId, Value: stateNumber (as string)
 */
export type NodeStateMap = Map<string, string>;

/**
 * Builds a map of eventName -> stateNumber by analyzing the flow
 * Entry node always gets state "0"
 * Other nodes get state numbers based on which transitionTo reaches them
 */
export function buildEventStateMap(
  nodes: Node<JourneyNodeData>[]
): EventStateMap {
  const eventStateMap: EventStateMap = new Map();
  const nodeStateMap: NodeStateMap = new Map();

  // Find entry node
  const entryNode = nodes.find(
    (n) => n.type === "state" && n.data.isEntry && n.data.eventName
  );

  if (!entryNode || !entryNode.data.eventName) {
    return eventStateMap;
  }

  // Entry node always has state "0"
  eventStateMap.set(entryNode.data.eventName, "0");
  nodeStateMap.set(entryNode.id, "0");

  // Build a graph to traverse and assign states
  const visited = new Set<string>();

  visited.add(entryNode.id);

  // Note: queue was removed as it was unused

  // Track all transitions to determine next state numbers
  const allTransitions: Array<{
    sourceState: string;
    targetEvent: string;
    sourceNodeId: string;
  }> = [];

  // First pass: collect all transitions (even if source doesn't have state yet)
  nodes.forEach((node) => {
    if (node.type === "state" && node.data.branches) {
      const sourceEvent = node.data.eventName;
      if (!sourceEvent) return;

      // Get source state - it might not be assigned yet, so we'll assign it later
      const sourceState =
        eventStateMap.get(sourceEvent) || nodeStateMap.get(node.id);

      node.data.branches.forEach((branch) => {
        if (branch.targetNodeId !== "exit") {
          allTransitions.push({
            sourceState: sourceState || "", // Will be assigned if empty
            targetEvent: branch.targetNodeId,
            sourceNodeId: node.id,
          });
        }
      });
    }
  });

  // Second pass: assign state numbers
  // If target event already exists, reuse its state
  // Otherwise, assign next sequential number
  let nextStateNumber = 1;
  const usedStates = new Set<string>(["0"]);

  // First, ensure all nodes with eventName have a state assigned
  // This handles cases where nodes are created dynamically
  nodes.forEach((node) => {
    if (node.type === "state" && node.data.eventName) {
      const eventName = node.data.eventName;
      if (!eventStateMap.has(eventName)) {
        // This node doesn't have a state yet, but it's not the entry node
        // Check if it's referenced as a target in any branch
        const isReferencedAsTarget = nodes.some((n) => {
          if (n.type !== "state" || !n.data.branches) return false;
          return n.data.branches.some(
            (b: Branch) => b.targetNodeId === eventName
          );
        });

        if (isReferencedAsTarget) {
          // Assign next available state number
          let assignedState = String(nextStateNumber);

          // Make sure state number is unique
          while (usedStates.has(assignedState)) {
            nextStateNumber++;
            assignedState = String(nextStateNumber);
          }

          eventStateMap.set(eventName, assignedState);
          usedStates.add(assignedState);
          nextStateNumber++;
        }
      }
    }
  });

  // Process transitions in order
  allTransitions.forEach((transition) => {
    const { sourceState, targetEvent, sourceNodeId } = transition;

    // If source state is not assigned yet, assign it first
    let actualSourceState = sourceState;
    if (!actualSourceState) {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (
        sourceNode &&
        sourceNode.type === "state" &&
        sourceNode.data.eventName
      ) {
        const sourceEventName = sourceNode.data.eventName;
        if (!eventStateMap.has(sourceEventName)) {
          // Assign state to source node
          let assignedState = String(nextStateNumber);
          while (usedStates.has(assignedState)) {
            nextStateNumber++;
            assignedState = String(nextStateNumber);
          }
          eventStateMap.set(sourceEventName, assignedState);
          nodeStateMap.set(sourceNode.id, assignedState);
          usedStates.add(assignedState);
          actualSourceState = assignedState;
          nextStateNumber++;
        } else {
          actualSourceState = eventStateMap.get(sourceEventName) || "";
        }
      }
    }

    if (!actualSourceState) return;

    // Check if target event already has a state assigned
    if (eventStateMap.has(targetEvent)) {
      // Reuse existing state
      return;
    }

    // Check if we need to assign a new state
    // Find the target node
    const targetNode = nodes.find(
      (n) => n.type === "state" && n.data.eventName === targetEvent
    );

    if (targetNode && !nodeStateMap.has(targetNode.id)) {
      // Assign next available state number
      let assignedState = String(nextStateNumber);

      // Make sure state number is unique
      while (usedStates.has(assignedState)) {
        nextStateNumber++;
        assignedState = String(nextStateNumber);
      }

      eventStateMap.set(targetEvent, assignedState);
      nodeStateMap.set(targetNode.id, assignedState);
      usedStates.add(assignedState);
      nextStateNumber++;
    }
  });

  return eventStateMap;
}

/**
 * Builds nodeId -> stateNumber map
 */
export function buildNodeStateMap(
  nodes: Node<JourneyNodeData>[],
  eventStateMap: EventStateMap
): NodeStateMap {
  const nodeStateMap: NodeStateMap = new Map();

  nodes.forEach((node) => {
    if (node.type === "state" && node.data.eventName) {
      const state = eventStateMap.get(node.data.eventName);
      if (state !== undefined) {
        nodeStateMap.set(node.id, state);
      }
    }
  });

  return nodeStateMap;
}

/**
 * Converts flow nodes/edges to ruleEngine.eventInfo format
 */
export function convertFlowToEventInfo(
  nodes: Node<JourneyNodeData>[],
  edges: Edge[],
  eventStateMap: EventStateMap,
  nodeStateMap: NodeStateMap
): EventInfo[] {
  const eventInfoMap = new Map<string, EventInfo>();

  // Track the highest state number to assign next incremental state for exit branches
  let maxStateNumber = 0;
  eventStateMap.forEach((state) => {
    const stateNum = Number(state);
    if (!isNaN(stateNum) && stateNum > maxStateNumber) {
      maxStateNumber = stateNum;
    }
  });
  let nextIncrementalState = maxStateNumber + 1;

  nodes.forEach((node) => {
    if (node.type !== "state" || !node.data.eventName) return;

    const eventName = node.data.eventName;
    const currentStateNumber =
      nodeStateMap.get(node.id) || eventStateMap.get(eventName);

    if (!currentStateNumber) return;

    // Get or create EventInfo for this event
    let eventInfo = eventInfoMap.get(eventName);
    if (!eventInfo) {
      eventInfo = {
        eventname: eventName,
        currentState: [],
      };
      eventInfoMap.set(eventName, eventInfo);
    }

    // Find or create CurrentState entry
    let currentStateEntry = eventInfo.currentState.find(
      (cs) => String(cs.currentState) === currentStateNumber
    );

    if (!currentStateEntry) {
      currentStateEntry = {
        currentState: Number(currentStateNumber),
        nextState: [],
      };
      eventInfo.currentState.push(currentStateEntry);
    }

    // Convert branches to nextState entries
    if (node.data.branches && node.data.branches.length > 0) {
      node.data.branches.forEach((branch) => {
        // Handle exit branches: add to resetStates AND create nextState with incremental value
        if (branch.targetNodeId === "exit") {
          // Check if this state already has a nextState entry for exit
          // We'll create one with the next incremental state number if not already present
          const exitTransitionIndex = currentStateEntry.nextState.findIndex(
            (ns) => {
              // Check if this transitionTo value is higher than max state (likely an exit transition)
              const transitionToNum = Number(ns.transitionTo);
              return (
                !isNaN(transitionToNum) &&
                transitionToNum >= nextIncrementalState
              );
            }
          );

          // Check if the next incremental state already exists in event map
          let exitStateNumber = nextIncrementalState;

          // Keep incrementing until we find a state that doesn't exist in the event map
          const eventMapStates = new Set(Array.from(eventStateMap.values()));
          while (eventMapStates.has(String(exitStateNumber))) {
            exitStateNumber++;
          }

          const filters = {
            operator: "AND" as const,
            filter: branch.filters.map((condition) => ({
              propertyName: {
                label: condition.property,
                isLocal: false,
              },
              propertyType: "string",
              comparisonType: condition.operator,
              comparisonValue: String(condition.value),
              componentType: "Filter" as const,
            })),
          };

          if (exitTransitionIndex === -1) {
            // Add new exit transition
            currentStateEntry.nextState.push({
              transitionTo: exitStateNumber,
              filters,
            });
            // Increment for next exit branch (use the assigned state + 1)
            nextIncrementalState = exitStateNumber + 1;
          } else {
            // Update existing exit transition with new filters
            currentStateEntry.nextState[exitTransitionIndex] = {
              transitionTo:
                currentStateEntry.nextState[exitTransitionIndex].transitionTo,
              filters,
            };
          }
          return;
        }

        // Find target node's state
        const targetNode = nodes.find(
          (n) => n.type === "state" && n.data.eventName === branch.targetNodeId
        );

        if (!targetNode) {
          // If target node doesn't exist, try to find it by eventName in eventStateMap
          // This handles cases where the node exists but hasn't been processed yet
          const targetStateFromMap = eventStateMap.get(branch.targetNodeId);
          if (targetStateFromMap) {
            // Create a transition even if the node doesn't exist in the nodes array yet
            // This ensures the transition is preserved in the form data
            const filters = {
              operator: "AND" as const,
              filter: branch.filters.map((condition) => ({
                propertyName: {
                  label: condition.property,
                  isLocal: false,
                },
                propertyType: "string",
                comparisonType: condition.operator,
                comparisonValue: String(condition.value),
                componentType: "Filter" as const,
              })),
            };

            const existingTransitionIndex = currentStateEntry.nextState.findIndex(
              (ns) => String(ns.transitionTo) === targetStateFromMap
            );

            if (existingTransitionIndex === -1) {
              // Add new transition
              currentStateEntry.nextState.push({
                transitionTo: Number(targetStateFromMap),
                filters,
              });
            } else {
              // Update existing transition with new filters
              currentStateEntry.nextState[existingTransitionIndex] = {
                transitionTo: Number(targetStateFromMap),
                filters,
              };
            }
          }
          return;
        }

        const targetState =
          nodeStateMap.get(targetNode.id) ||
          eventStateMap.get(targetNode.data.eventName || "") ||
          eventStateMap.get(branch.targetNodeId);

        if (!targetState) {
          // If target state is not found, the target node might not have been processed yet
          // Try to find it in eventStateMap by eventName
          const targetStateFromEventName = eventStateMap.get(
            branch.targetNodeId
          );
          if (targetStateFromEventName) {
            const filters = {
              operator: "AND" as const,
              filter: branch.filters.map((condition) => ({
                propertyName: {
                  label: condition.property,
                  isLocal: false,
                },
                propertyType: "string",
                comparisonType: condition.operator,
                comparisonValue: String(condition.value),
                componentType: "Filter" as const,
              })),
            };

            const existingTransitionIndex = currentStateEntry.nextState.findIndex(
              (ns) => String(ns.transitionTo) === targetStateFromEventName
            );

            if (existingTransitionIndex === -1) {
              // Add new transition
              currentStateEntry.nextState.push({
                transitionTo: Number(targetStateFromEventName),
                filters,
              });
            } else {
              // Update existing transition with new filters
              currentStateEntry.nextState[existingTransitionIndex] = {
                transitionTo: Number(targetStateFromEventName),
                filters,
              };
            }
          }
          return;
        }

        // Convert filters
        const filters = {
          operator: "AND" as const,
          filter: branch.filters.map((condition) => ({
            propertyName: {
              label: condition.property,
              isLocal: false,
            },
            propertyType: "string", // Default, could be enhanced
            comparisonType: condition.operator,
            comparisonValue: String(condition.value),
            componentType: "Filter" as const,
          })),
        };

        // Check if this transition already exists
        const existingTransitionIndex = currentStateEntry.nextState.findIndex(
          (ns) => String(ns.transitionTo) === targetState
        );

        if (existingTransitionIndex === -1) {
          // Add new transition
          currentStateEntry.nextState.push({
            transitionTo: Number(targetState),
            filters,
          });
        } else {
          // Update existing transition with new filters
          currentStateEntry.nextState[existingTransitionIndex] = {
            transitionTo: Number(targetState),
            filters,
          };
        }
      });
    }
  });

  return Array.from(eventInfoMap.values());
}

/**
 * Converts ruleEngine.eventInfo to flow nodes/edges
 */
export function convertEventInfoToFlow(
  eventInfo: EventInfo[],
  existingNodes?: Node<JourneyNodeData>[],
  existingEdges?: Edge[]
): {
  nodes: Node<JourneyNodeData>[];
  edges: Edge[];
  eventStateMap: EventStateMap;
  nodeStateMap: NodeStateMap;
} {
  const nodes: Node<JourneyNodeData>[] = existingNodes
    ? [...existingNodes]
    : [];
  const edges: Edge[] = existingEdges ? [...existingEdges] : [];
  const eventStateMap: EventStateMap = new Map();
  const nodeStateMap: NodeStateMap = new Map();

  // Build state maps from eventInfo
  eventInfo.forEach((info) => {
    info.currentState.forEach((cs) => {
      const stateStr = String(cs.currentState);
      eventStateMap.set(info.eventname, stateStr);

      // Find or create node for this event
      let node = nodes.find(
        (n) => n.type === "state" && n.data.eventName === info.eventname
      );

      if (!node) {
        // Create new node
        const nodeId = `state-${Date.now()}-${Math.random()}`;
        node = {
          id: nodeId,
          type: "state",
          position: { x: 250 + nodes.length * 300, y: 100 },
          data: {
            label: info.eventname,
            nodeType: "state",
            eventName: info.eventname,
            engagements: [],
            branches: [],
            isEntry: stateStr === "0",
          },
        };
        nodes.push(node);
      }

      nodeStateMap.set(node.id, stateStr);

      // Convert nextState to branches
      if (cs.nextState && cs.nextState.length > 0) {
        node.data.branches = cs.nextState.map((ns) => {
          // Find target event by state number
          const targetStateStr = String(ns.transitionTo);
          const targetEventInfo = eventInfo.find((ei) =>
            ei.currentState.some(
              (cs2) => String(cs2.currentState) === targetStateStr
            )
          );

          const targetEventName = targetEventInfo?.eventname || "";

          // Convert filters - only handle Filter type, skip FilterGroup and FilterFunction for now
          const conditions = (ns.filters?.filter || [])
            .filter(
              (f): f is Filter =>
                f !== null &&
                typeof f === "object" &&
                "propertyName" in f &&
                "comparisonType" in f &&
                "comparisonValue" in f
            )
            .map((f) => ({
              id: `condition-${Date.now()}-${Math.random()}`,
              property:
                typeof f.propertyName === "object"
                  ? f.propertyName.label
                  : String(f.propertyName),
              operator: f.comparisonType as
                | "="
                | "!="
                | ">"
                | "<"
                | ">="
                | "<="
                | "in"
                | "not in",
              value: String(f.comparisonValue),
            }));

          return {
            id: `branch-${Date.now()}-${Math.random()}`,
            targetNodeId: targetEventName || "exit",
            filters: conditions,
          };
        });
      }
    });
  });

  // Build edges from branches
  nodes.forEach((node) => {
    if (node.type === "state" && node.data.branches) {
      node.data.branches.forEach((branch) => {
        if (branch.targetNodeId === "exit") return;

        const targetNode = nodes.find(
          (n) => n.type === "state" && n.data.eventName === branch.targetNodeId
        );

        if (targetNode) {
          edges.push({
            id: `edge-${branch.id}`,
            source: node.id,
            target: targetNode.id,
            type: "bezier",
            data: { branchId: branch.id },
          });
        }
      });
    }
  });

  return { nodes, edges, eventStateMap, nodeStateMap };
}

/**
 * Validates that all nodes are connected (have at least one edge)
 * Returns array of unconnected node IDs
 */
export function findUnconnectedNodes(
  nodes: Node<JourneyNodeData>[],
  edges: Edge[]
): string[] {
  const unconnected: string[] = [];

  nodes.forEach((node) => {
    if (node.type !== "state") return;

    // Entry node doesn't need incoming edges
    if (node.data.isEntry) {
      // Check if it has outgoing edges
      const hasOutgoing = edges.some((e) => e.source === node.id);
      if (!hasOutgoing) {
        unconnected.push(node.id);
      }
      return;
    }

    // Non-entry nodes need at least one incoming or outgoing edge
    const hasIncoming = edges.some((e) => e.target === node.id);
    const hasOutgoing = edges.some((e) => e.source === node.id);

    if (!hasIncoming && !hasOutgoing) {
      unconnected.push(node.id);
    }
  });

  return unconnected;
}

/**
 * Finds unconnected engagement nodes (engagement nodes without a source state node)
 * Returns array of unconnected engagement node IDs
 */
export function findUnconnectedEngagementNodes(
  nodes: Node[],
  edges: Edge[]
): string[] {
  const unconnected: string[] = [];

  nodes.forEach((node) => {
    if (node.type !== "engagement") return;

    // Check if this engagement node has an incoming edge from a state node
    const hasIncomingFromState = edges.some(
      (e) => e.target === node.id && e.sourceHandle === "engagement-source"
    );

    if (!hasIncomingFromState) {
      unconnected.push(node.id);
    }
  });

  return unconnected;
}
