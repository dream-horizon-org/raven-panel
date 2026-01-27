/** ---------- Top-level response ---------- */
export interface GetListOfCTAsResponse {
  data: {
    ctas: CTA[];
    totalEntries: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    statusWiseCount: StatusWiseCount;
  };
}

/** ---------- Entities ---------- */
export interface CTA {
  id: number;
  rule: Rule;
  ctaStatus: CTAStatus; // "PAUSED" | "LIVE" | ...
  name: string;
  description: string;
  tags: string[];
  team: string;
  behaviourTags: string[];
  startTime: number; // epoch ms
  endTime: number; // epoch ms
  createdAt: number; // epoch ms
  createdBy: string; // user id as string
  lastUpdatedAt: number; // epoch ms
  lastUpdatedBy: string; // user id as string (or "")
}

export type CTAStatus =
  | "DRAFT"
  | "PAUSED"
  | "LIVE"
  | "SCHEDULED"
  | "CONCLUDED"
  | "TERMINATED";

export interface StatusWiseCount {
  draft: number;
  paused: number;
  live: number;
  scheduled: number;
  concluded: number;
  terminated: number;
}

/** ---------- Rule / Engine ---------- */
export interface Rule {
  cohortEligibility: {
    includes: string[];
    excludes: string[];
  };

  /** Map of stateId -> actionId */
  stateToAction: Record<string, string>;

  /** States that reset the machine */
  resetStates: string[];

  resetCTAonFirstLaunch: boolean;

  /** Optional extra context keys */
  contextParams: string[];

  /**
   * stateTransition:
   *   "<EventName>": {
   *      "<stateIndex>": Transition[]
   *   }
   */
  stateTransition: Record<string, Record<string, Transition[]>>;

  groupByConfig: {
    maxActiveStateMachineCount: number;
    groupByKeys: string[];
  };

  priority: number;
  stateMachineTTL: number; // ms
  ctaValidTill?: number; // epoch ms (present on some items)

  actions: Action[];

  frequency: {
    session: { limit: number };
    lifespan: { limit: number };
    window: { limit: number; unit: "days" | string; value: number };
  };
}

export interface Transition {
  transitionTo: string;
  filters: Filters;
}

export interface Filters {
  operator: "AND" | "OR";
  filter: FilterCondition[];
}

export interface FilterCondition {
  propertyName: string;
  propertyType: "string" | "number" | string;
  comparisonType:
    | "="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | string;
  comparisonValue: string; // server sends string, even for numbers
}

/** ---------- Actions & Templates ---------- */
export type ActionType = "TOOLTIP" | "POPUP" | "NUDGE_UI" | string;

export interface BaseAction {
  type: ActionType;
  actionId: string;
  config?: { triggerDelay?: number } & Record<string, unknown>;
  variant?: string;
}

/** TOOLTIP action (flat template) */
export interface TooltipAction extends BaseAction {
  type: "TOOLTIP";
  template: {
    type: "TOOLTIP";
    props: TooltipProps;
    actions: unknown[];
    styles: UIStyle;
  };
}

export interface TooltipProps {
  title?: string;
  subTitle?: string;
  position?: string; // "top" | "bottom" | ...
  titleFontSize?: number;
  subTitleFontSize?: number;
  targetScreen?: string;
  targetId?: string;
  titleColor?: string;
  subTitleColor?: string;
  triggerDelay?: number;
  titleAlignment?: string;
  subTitleAlignment?: string;
  arrowSize?: number;
  testID?: string;
  dismissOnOutsideTouch?: boolean;
}

/** POPUP / NUDGE_UI actions (tree template) */
export interface PopupAction extends BaseAction {
  type: "POPUP";
  template: UITemplateTree;
}

export interface NudgeUIAction extends BaseAction {
  type: "NUDGE_UI";
  template: UITemplateTree;
}

/** Generic UI template tree */
export interface UITemplateTree {
  type: string; // e.g., "POPUP", "BottomSheet", etc.
  props?: Record<string, unknown>;
  actions: unknown[];
  styles: UIStyle;
  children?: UINode[]; // recursive UI nodes
}

/** Generic UI node used within template trees */
export interface UINode {
  type: string; // e.g., "View" | "Text" | "Image" | "Button"
  props?: Record<string, unknown>;
  actions?: unknown[];
  styles?: UIStyle;
  children?: UINode[];
}

/** Style is arbitrary CSS-ish / RN-ish keys */
export type UIStyle = Record<string, string | number | boolean>;

/** Union of known actions + future-proof fallback */
export type Action = TooltipAction | PopupAction | NudgeUIAction | BaseAction;
