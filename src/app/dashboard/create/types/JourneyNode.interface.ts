export type NodeType = "state" | "exit" | "engagement";

export interface Condition {
  id: string;
  property: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "in" | "not in";
  value: string;
  logicalOperator?: "AND" | "OR";
}

export interface Engagement {
  id: string;
  type:
    | "tooltip"
    | "popup"
    | "bottomsheet"
    | "coachmark"
    | "pip"
    | "nativeEventEmitter";
  config: Record<string, unknown>;
}

// UI Element Types for Engagement Configuration
export type UIElementType = "view" | "text" | "image";

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TextElement {
  id: string;
  type: "text";
  text: string;
  textAlignment?: "left" | "center" | "right";
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  spacing?: {
    margin?: Spacing;
    padding?: Spacing;
  };
}

export interface ImageElement {
  id: string;
  type: "image";
  imageSource?: string;
  clickAction?: string;
  occupyFullWidth?: boolean;
  spacing?: {
    margin?: Spacing;
    padding?: Spacing;
  };
}

export interface ViewElement {
  id: string;
  type: "view";
  orientation?: "horizontal" | "vertical";
  children?: UIElement[];
  spacing?: {
    margin?: Spacing;
    padding?: Spacing;
  };
}

export type UIElement = TextElement | ImageElement | ViewElement;

export interface EngagementVariant {
  id: string;
  name: string;
  description?: string;
  preview?: string; // URL or path to preview image
}

export interface EngagementConfig extends Record<string, unknown> {
  variant?: string; // Selected variant ID
  content?: {
    elements?: UIElement[];
  };
}

export interface EngagementNodeData extends Record<string, unknown> {
  label: string;
  nodeType: "engagement";
  engagementId: string;
  engagementType: "tooltip" | "popup" | "bottomsheet" | "nativeEventEmitter";
}

export interface Branch {
  id: string;
  targetNodeId: string | "exit"; // "exit" means journey ends
  filters: Condition[]; // All filters are evaluated with AND logic
  label?: string;
}

export interface JourneyNodeData extends Record<string, unknown> {
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

export interface CheckTemplateErrorsParams {
  formStateErrors?: {
    nudgeSelection?: {
      actions?: unknown;
    };
  };
  errors?: {
    nudgeSelection?: {
      actions?: unknown;
    };
  };
}
