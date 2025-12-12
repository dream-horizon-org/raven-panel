import { Node, Edge } from "@xyflow/react";
import { JourneyNodeData, Branch } from "../types/JourneyNode.interface";
import { EventInfo, Filter } from "../types/journey.interface";

export type EventStateMap = Map<string, string>;

export type NodeStateMap = Map<string, string>;

export function buildEventStateMap(
  nodes: Node<JourneyNodeData>[]
): EventStateMap {
  const eventStateMap: EventStateMap = new Map();
  const nodeStateMap: NodeStateMap = new Map();

  let entryNode = nodes.find(
    (n) => n.type === "state" && n.data.isEntry && n.data.eventName
  );

  if (!entryNode) {
    entryNode = nodes.find((n) => n.type === "state" && n.data.eventName);
  }

  if (!entryNode || !entryNode.data.eventName) {
    return eventStateMap;
  }

  eventStateMap.set(entryNode.data.eventName, "0");
  nodeStateMap.set(entryNode.id, "0");

  const visited = new Set<string>();

  visited.add(entryNode.id);

  const allTransitions: Array<{
    sourceState: string;
    targetEvent: string;
    sourceNodeId: string;
  }> = [];

  nodes.forEach((node) => {
    if (node.type === "state" && node.data.branches) {
      const sourceEvent = node.data.eventName;
      if (!sourceEvent) return;

      const sourceState =
        eventStateMap.get(sourceEvent) || nodeStateMap.get(node.id);

      node.data.branches.forEach((branch) => {
        if (branch.targetNodeId !== "exit") {
          allTransitions.push({
            sourceState: sourceState || "",
            targetEvent: branch.targetNodeId,
            sourceNodeId: node.id,
          });
        }
      });
    }
  });

  let nextStateNumber = 1;
  const usedStates = new Set<string>(["0"]);

  nodes.forEach((node) => {
    if (node.type === "state" && node.data.eventName) {
      const eventName = node.data.eventName;
      if (!eventStateMap.has(eventName)) {
        const isReferencedAsTarget = nodes.some((n) => {
          if (n.type !== "state" || !n.data.branches) return false;
          return n.data.branches.some(
            (b: Branch) => b.targetNodeId === eventName
          );
        });

        if (isReferencedAsTarget) {
          let assignedState = String(nextStateNumber);
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

  allTransitions.forEach((transition) => {
    const { sourceState, targetEvent, sourceNodeId } = transition;

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

    if (eventStateMap.has(targetEvent)) {
      return;
    }

    const targetNode = nodes.find(
      (n) => n.type === "state" && n.data.eventName === targetEvent
    );

    if (targetNode && !nodeStateMap.has(targetNode.id)) {
      let assignedState = String(nextStateNumber);
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

export function convertFlowToEventInfo(
  nodes: Node<JourneyNodeData>[],
  edges: Edge[],
  eventStateMap: EventStateMap,
  nodeStateMap: NodeStateMap
): EventInfo[] {
  const eventInfoMap = new Map<string, EventInfo>();

  const entryNode = nodes.find(
    (n) => n.type === "state" && n.data.isEntry && n.data.eventName
  );

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
    if (!eventStateMap.has(eventName)) {
      const isEntry =
        node.data.isEntry ||
        (!entryNode &&
          nodes.indexOf(node) ===
            nodes.findIndex((n) => n.type === "state" && n.data.eventName));
      if (isEntry) {
        eventStateMap.set(eventName, "0");
        nodeStateMap.set(node.id, "0");
      } else {
        let maxState = 0;
        eventStateMap.forEach((state) => {
          const stateNum = Number(state);
          if (!isNaN(stateNum) && stateNum > maxState) {
            maxState = stateNum;
          }
        });
        const nextState = String(maxState + 1);
        eventStateMap.set(eventName, nextState);
        nodeStateMap.set(node.id, nextState);
      }
    }
  });

  nodes.forEach((node) => {
    if (node.type !== "state" || !node.data.eventName) return;

    const eventName = node.data.eventName;
    const currentStateNumber =
      nodeStateMap.get(node.id) || eventStateMap.get(eventName);

    if (!currentStateNumber) {
      console.warn(
        `[convertFlowToEventInfo] Node ${node.id} with event ${eventName} has no state number, skipping`
      );
      return;
    }

    let eventInfo = eventInfoMap.get(eventName);
    if (!eventInfo) {
      eventInfo = {
        eventname: eventName,
        currentState: [],
      };
      eventInfoMap.set(eventName, eventInfo);
    }

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

    if (node.data.branches && node.data.branches.length > 0) {
      node.data.branches.forEach((branch) => {
        if (branch.targetNodeId === "exit") {
          const exitTransitionIndex = currentStateEntry.nextState.findIndex(
            (ns) => {
              const transitionToNum = Number(ns.transitionTo);
              return (
                !isNaN(transitionToNum) &&
                transitionToNum >= nextIncrementalState
              );
            }
          );

          let exitStateNumber = nextIncrementalState;

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
            nextIncrementalState = exitStateNumber + 1;
          } else {
            currentStateEntry.nextState[exitTransitionIndex] = {
              transitionTo:
                currentStateEntry.nextState[exitTransitionIndex].transitionTo,
              filters,
            };
          }
          return;
        }

        const targetNode = nodes.find(
          (n) => n.type === "state" && n.data.eventName === branch.targetNodeId
        );

        if (!targetNode) {
          const targetStateFromMap = eventStateMap.get(branch.targetNodeId);
          if (targetStateFromMap) {
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
              currentStateEntry.nextState[existingTransitionIndex] = {
                transitionTo: Number(targetStateFromMap),
                filters,
              };
            }
          } else {
            console.warn(
              `[convertFlowToEventInfo] Target node ${branch.targetNodeId} not found and has no state mapping. Skipping transition from ${eventName} state ${currentStateNumber}.`
            );
          }
          return;
        }

        const targetState =
          nodeStateMap.get(targetNode.id) ||
          eventStateMap.get(targetNode.data.eventName || "") ||
          eventStateMap.get(branch.targetNodeId);

        if (!targetState) {
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
              currentStateEntry.nextState.push({
                transitionTo: Number(targetStateFromEventName),
                filters,
              });
            } else {
              currentStateEntry.nextState[existingTransitionIndex] = {
                transitionTo: Number(targetStateFromEventName),
                filters,
              };
            }
          }
          return;
        }

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

        const existingTransitionIndex = currentStateEntry.nextState.findIndex(
          (ns) => String(ns.transitionTo) === targetState
        );

        if (existingTransitionIndex === -1) {
          currentStateEntry.nextState.push({
            transitionTo: Number(targetState),
            filters,
          });
        } else {
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

  eventInfo.forEach((info) => {
    info.currentState.forEach((cs) => {
      const stateStr = String(cs.currentState);
      eventStateMap.set(info.eventname, stateStr);

      let node = nodes.find(
        (n) => n.type === "state" && n.data.eventName === info.eventname
      );

      if (!node) {
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

      if (cs.nextState && cs.nextState.length > 0) {
        node.data.branches = cs.nextState.map((ns) => {
          const targetStateStr = String(ns.transitionTo);
          const targetEventInfo = eventInfo.find((ei) =>
            ei.currentState.some(
              (cs2) => String(cs2.currentState) === targetStateStr
            )
          );

          const targetEventName = targetEventInfo?.eventname || "";

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

export function findUnconnectedNodes(
  nodes: Node<JourneyNodeData>[],
  edges: Edge[]
): string[] {
  const unconnected: string[] = [];

  nodes.forEach((node) => {
    if (node.type !== "state") return;

    if (node.data.isEntry) {
      const hasOutgoing = edges.some((e) => e.source === node.id);
      if (!hasOutgoing) {
        unconnected.push(node.id);
      }
      return;
    }

    const hasIncoming = edges.some((e) => e.target === node.id);
    const hasOutgoing = edges.some((e) => e.source === node.id);

    if (!hasIncoming && !hasOutgoing) {
      unconnected.push(node.id);
    }
  });

  return unconnected;
}

export function findUnconnectedEngagementNodes(
  nodes: Node[],
  edges: Edge[]
): string[] {
  const unconnected: string[] = [];

  nodes.forEach((node) => {
    if (node.type !== "engagement") return;

    const hasIncomingFromState = edges.some(
      (e) => e.target === node.id && e.sourceHandle === "engagement-source"
    );

    if (!hasIncomingFromState) {
      unconnected.push(node.id);
    }
  });

  return unconnected;
}
