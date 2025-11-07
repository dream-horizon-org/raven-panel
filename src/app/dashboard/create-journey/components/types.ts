export type NodeType = "state" | "exit";

export interface Condition {
  id: string;
  property: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "in" | "not in";
  value: string;
  logicalOperator?: "AND" | "OR";
}

export interface Engagement {
  id: string;
  type: "tooltip" | "popup" | "bottomsheet" | "coachmark" | "pip";
  config: Record<string, unknown>;
}

export interface Branch {
  id: string;
  targetNodeId: string | "exit"; // "exit" means journey ends
  filters: Condition[]; // All filters are evaluated with AND logic
  label?: string;
}

export interface JourneyNodeData {
  label: string;
  nodeType: NodeType;
  // Event configuration
  eventName: string;
  // Node-level filters applied on event properties
  filters?: Condition[];
  // Engagements
  engagements?: Engagement[];
  // Branches from this node to other nodes
  branches?: Branch[];
  // Indicates if this is the entry node
  isEntry?: boolean;
}

