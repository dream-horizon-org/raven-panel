"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useEventDetails } from "../../hooks/useEventsList";
import { Node } from "@xyflow/react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  MenuItem,
  Chip,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  useTheme,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  JourneyNodeData,
  Condition,
  Branch,
  Engagement,
} from "../../types/JourneyNode.interface";
import * as styles from "./styles/nodeConfigurationPanelStyles";
import {
  getInputType,
  isNumericType,
  normalizePropertyType,
} from "../../utils/propertyType.utils";
import { FormControl, InputLabel, Select } from "@mui/material";
import JourneyTutorialDialog from "./JourneyTutorialDialog";

interface NodeConfigurationPanelProps {
  node: Node<JourneyNodeData>;
  nodes: Node[];
  onUpdate: (nodeId: string, data: Partial<JourneyNodeData>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
  onDeleteEdge: (edgeId: string) => void;
  mockEventNames: string[];
  events?: Array<{
    eventName: string;
    properties: Array<{ propertyName: string; type: string }>;
  }>;
  isLoadingEvents?: boolean;
  systemPropertyNames?: string[];
  systemPropertyTypes?: Map<string, string>;
  highlightedBranchId?: string | null;
  highlightedEngagementId?: string | null;
  onRequestClose?: React.MutableRefObject<(() => void) | null>;
  onEngagementTemplateSelect?: (
    engagementId: string,
    engagementType: string
  ) => void;
}

export default function NodeConfigurationPanel({
  node,
  nodes,
  onUpdate,
  onDelete,
  onClose,
  onDeleteEdge,
  mockEventNames,
  events = [],
  isLoadingEvents = false,
  systemPropertyNames = [],
  systemPropertyTypes = new Map(),
  highlightedBranchId,
  highlightedEngagementId,
  onRequestClose,
  onEngagementTemplateSelect,
}: NodeConfigurationPanelProps) {
  const theme = useTheme();
  // Initialize form data
  const getInitialData = useCallback((): JourneyNodeData => {
    const hasBranches =
      node.data.branches &&
      Array.isArray(node.data.branches) &&
      node.data.branches.length > 0;
    const hasEventName =
      node.data.eventName && node.data.eventName.trim() !== "";

    if (hasEventName && !hasBranches) {
      const defaultBranch: Branch = {
        id: `branch-default-${Date.now()}`,
        targetNodeId: "exit",
        filters: [],
      };
      return {
        ...node.data,
        branches: [defaultBranch],
      };
    }
    return {
      ...node.data,
      branches: node.data.branches || [],
      engagements: node.data.engagements || [],
    };
  }, [node.data]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { isDirty, errors },
  } = useForm<JourneyNodeData & Record<string, unknown>>({
    defaultValues: getInitialData(),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Watch only specific form fields to avoid unnecessary re-renders
  const branches = watch("branches") || [];
  const engagements = watch("engagements") || [];
  const eventName = watch("eventName") || "";

  const {
    data: eventDetailsData,
    isLoading: isLoadingEventDetails,
  } = useEventDetails(eventName || null);

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [tutorialDialogOpen, setTutorialDialogOpen] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(true);
  const [newlyAddedBranchId, setNewlyAddedBranchId] = useState<string | null>(
    null
  );

  // Local state to track if highlight should be shown (auto-dismiss after 3 seconds)
  const [showBranchHighlight, setShowBranchHighlight] = useState(false);
  const [showEngagementHighlight, setShowEngagementHighlight] = useState(false);

  // Refs to track branch elements for scrolling
  const branchRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Ref to prevent infinite loop when saving - tracks if we just saved
  const isSavingRef = useRef(false);

  // Ref to store the last saved data to compare and prevent unnecessary resets
  const lastSavedDataRef = useRef<string>("");

  // Ref to track the node ID we're currently saving to prevent updates during save
  const savingNodeIdRef = useRef<string | null>(null);

  // Ref to track the previous node ID to detect node changes
  const previousNodeIdRef = useRef<string>(node.id);

  // Show tooltip on mount and hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelpTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Track if connection highlight was already dismissed (to prevent re-highlighting when new branch is added)
  const connectionHighlightDismissedRef = useRef(false);

  // Auto-dismiss branch highlight after user attention (3 seconds) and scroll to it
  useEffect(() => {
    if (highlightedBranchId) {
      // Reset the dismissed flag when a new branch is highlighted
      connectionHighlightDismissedRef.current = false;
      setShowBranchHighlight(true);

      // Scroll to the highlighted branch
      const scrollToBranch = () => {
        const branchElement = branchRefsMap.current.get(highlightedBranchId);
        if (branchElement) {
          branchElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return true;
        }
        return false;
      };

      // Try immediately, then retry if needed (branches might still be rendering)
      let timeoutId1: NodeJS.Timeout | null = null;
      let timeoutId2: NodeJS.Timeout | null = null;

      if (!scrollToBranch()) {
        timeoutId1 = setTimeout(() => {
          if (!scrollToBranch()) {
            timeoutId2 = setTimeout(scrollToBranch, 200);
          }
        }, 100);
      }

      const timeoutId = setTimeout(() => {
        setShowBranchHighlight(false);
        connectionHighlightDismissedRef.current = true;
      }, 3000);

      return () => {
        if (timeoutId1) clearTimeout(timeoutId1);
        if (timeoutId2) clearTimeout(timeoutId2);
        clearTimeout(timeoutId);
      };
    } else {
      setShowBranchHighlight(false);
      connectionHighlightDismissedRef.current = false;
    }
  }, [highlightedBranchId]);

  // Prevent re-enabling connection highlight when branches change if it was already dismissed
  useEffect(() => {
    // If connection highlight was dismissed and highlightedBranchId is still set,
    // don't re-enable it when branches change (e.g., when a new branch is added)
    if (connectionHighlightDismissedRef.current && highlightedBranchId) {
      setShowBranchHighlight(false);
    }
  }, [branches.length, highlightedBranchId]);

  // Auto-dismiss engagement highlight after user attention (3 seconds)
  useEffect(() => {
    if (highlightedEngagementId) {
      setShowEngagementHighlight(true);
      const timeoutId = setTimeout(() => {
        setShowEngagementHighlight(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    } else {
      setShowEngagementHighlight(false);
    }
  }, [highlightedEngagementId]);

  // Auto-dismiss newly added branch highlight after user attention (3 seconds) and scroll to it
  useEffect(() => {
    if (newlyAddedBranchId) {
      // Scroll to the newly added branch
      const scrollToNewBranch = () => {
        const branchElement = branchRefsMap.current.get(newlyAddedBranchId);
        if (branchElement) {
          branchElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return true;
        }
        return false;
      };

      // Try immediately, then retry if needed (branch might still be rendering)
      let timeoutId1: NodeJS.Timeout | null = null;
      let timeoutId2: NodeJS.Timeout | null = null;

      if (!scrollToNewBranch()) {
        timeoutId1 = setTimeout(() => {
          if (!scrollToNewBranch()) {
            timeoutId2 = setTimeout(scrollToNewBranch, 200);
          }
        }, 100);
      }

      const timeoutId = setTimeout(() => {
        setNewlyAddedBranchId(null);
      }, 3000);

      return () => {
        if (timeoutId1) clearTimeout(timeoutId1);
        if (timeoutId2) clearTimeout(timeoutId2);
        clearTimeout(timeoutId);
      };
    }
  }, [newlyAddedBranchId, branches.length]);

  // Memoize node data key to detect actual changes (not just reference changes)
  const nodeDataKey = useMemo(
    () =>
      JSON.stringify({
        id: node.id,
        eventName: node.data.eventName,
        branchesCount: node.data.branches?.length || 0,
        engagementsCount: node.data.engagements?.length || 0,
      }),
    [
      node.id,
      node.data.eventName,
      node.data.branches?.length,
      node.data.engagements?.length,
    ]
  );

  // Sync form with node.data when node changes
  useEffect(() => {
    // Skip entirely if we're currently saving (component will unmount soon anyway)
    if (isSavingRef.current || savingNodeIdRef.current === node.id) {
      return;
    }

    const currentNodeDataStr = JSON.stringify(node.data);
    const nodeIdChanged = previousNodeIdRef.current !== node.id;

    // Only reset if:
    // 1. Node ID changed (different node selected), OR
    // 2. Data actually changed (not just reference change)
    const dataChanged = lastSavedDataRef.current !== currentNodeDataStr;

    if (!nodeIdChanged && !dataChanged) {
      // Neither node ID nor data changed, skip reset
      return;
    }

    const hasBranches =
      node.data.branches &&
      Array.isArray(node.data.branches) &&
      node.data.branches.length > 0;
    const hasEventName =
      node.data.eventName && node.data.eventName.trim() !== "";

    let dataToReset: JourneyNodeData;
    if (hasBranches) {
      dataToReset = node.data;
    } else if (hasEventName) {
      const defaultBranch: Branch = {
        id: `branch-default-${Date.now()}`,
        targetNodeId: "exit",
        filters: [],
      };
      dataToReset = {
        ...node.data,
        branches: [defaultBranch],
        engagements: node.data.engagements || [],
      };
    } else {
      dataToReset = {
        ...node.data,
        branches: node.data.branches || [],
        engagements: node.data.engagements || [],
      };
    }
    reset(dataToReset);
    setNewlyAddedBranchId(null);
    // Update the references
    lastSavedDataRef.current = currentNodeDataStr;
    previousNodeIdRef.current = node.id;
  }, [nodeDataKey, reset, node.id]);

  const hasUnsavedChanges = isDirty;

  const onSubmit = useCallback(
    (data: JourneyNodeData) => {
      // Validate that event name is selected before allowing save
      const currentEventName = data.eventName || "";
      if (!currentEventName || currentEventName.trim() === "") {
        setError("eventName", {
          type: "required",
          message:
            "Please select an event first to enable transitions and engagements.",
        });
        return;
      } else {
        clearErrors("eventName");
      }

      // First, clear all existing filter errors to start fresh
      // This prevents stale errors from deleted filters
      if (data.branches && Array.isArray(data.branches)) {
        for (
          let branchIndex = 0;
          branchIndex < data.branches.length;
          branchIndex++
        ) {
          // Clear errors for up to 20 filters per branch to catch any stale errors
          for (let filterIndex = 0; filterIndex < 20; filterIndex++) {
            clearErrors(
              `branches.${branchIndex}.filters.${filterIndex}.property` as any
            );
            clearErrors(
              `branches.${branchIndex}.filters.${filterIndex}.operator` as any
            );
            clearErrors(
              `branches.${branchIndex}.filters.${filterIndex}.value` as any
            );
          }
        }
      }

      // Validate that all filter fields are filled (only if filters exist)
      let hasErrors = false;
      if (data.branches && Array.isArray(data.branches)) {
        for (
          let branchIndex = 0;
          branchIndex < data.branches.length;
          branchIndex++
        ) {
          const branch = data.branches[branchIndex];
          // Only validate if branch has filters
          if (
            branch.filters &&
            Array.isArray(branch.filters) &&
            branch.filters.length > 0
          ) {
            for (
              let filterIndex = 0;
              filterIndex < branch.filters.length;
              filterIndex++
            ) {
              const filter = branch.filters[filterIndex];
              // Check property - must be a non-empty string
              const propertyValue = filter.property;
              if (
                !propertyValue ||
                (typeof propertyValue === "string" &&
                  propertyValue.trim() === "")
              ) {
                setError(
                  `branches.${branchIndex}.filters.${filterIndex}.property` as any,
                  {
                    type: "required",
                    message: "Property is required",
                  }
                );
                hasErrors = true;
              } else {
                // Clear error if property is valid
                clearErrors(
                  `branches.${branchIndex}.filters.${filterIndex}.property` as any
                );
              }

              // Check operator - must be a non-empty string
              const operatorValue = filter.operator;
              if (
                !operatorValue ||
                (typeof operatorValue === "string" &&
                  operatorValue.trim() === "")
              ) {
                setError(
                  `branches.${branchIndex}.filters.${filterIndex}.operator` as any,
                  {
                    type: "required",
                    message: "Operator is required",
                  }
                );
                hasErrors = true;
              } else {
                // Clear error if operator is valid
                clearErrors(
                  `branches.${branchIndex}.filters.${filterIndex}.operator` as any
                );
              }

              // Check value - allow 0, false, and other falsy values that are valid
              // Only reject undefined, null, or empty string
              const value = filter.value;
              if (
                value === undefined ||
                value === null ||
                (typeof value === "string" && value.trim() === "")
              ) {
                setError(
                  `branches.${branchIndex}.filters.${filterIndex}.value` as any,
                  {
                    type: "required",
                    message: "Value is required",
                  }
                );
                hasErrors = true;
              } else {
                // Clear error if value is valid
                clearErrors(
                  `branches.${branchIndex}.filters.${filterIndex}.value` as any
                );
              }
            }
          }
        }
      }

      if (hasErrors) {
        return;
      }

      // Double-check: verify there are no errors in form state before saving
      // This catches any stale errors that might have been missed
      const formErrors = errors as any;
      if (formErrors?.branches) {
        for (
          let branchIndex = 0;
          branchIndex < (data.branches?.length || 0);
          branchIndex++
        ) {
          if (formErrors.branches[branchIndex]?.filters) {
            // Clear errors for all possible filter indices (up to 20) to catch stale errors
            for (let filterIndex = 0; filterIndex < 20; filterIndex++) {
              clearErrors(
                `branches.${branchIndex}.filters.${filterIndex}.property` as any
              );
              clearErrors(
                `branches.${branchIndex}.filters.${filterIndex}.operator` as any
              );
              clearErrors(
                `branches.${branchIndex}.filters.${filterIndex}.value` as any
              );
            }
          }
        }
      }

      // Set flags to prevent form reset from triggering infinite loop
      isSavingRef.current = true;
      savingNodeIdRef.current = node.id;

      // Store the data we're saving to compare later
      const dataStr = JSON.stringify(data);
      lastSavedDataRef.current = dataStr;
      previousNodeIdRef.current = node.id;

      // Update the node first
      onUpdate(node.id, data);

      // Close panel immediately after update
      // The component will unmount, preventing any further re-renders
      onClose();
    },
    [node.id, onUpdate, onClose, setError, clearErrors]
  );

  // Wrapper to clear stale errors before calling handleSubmit
  const handleSave = useCallback(() => {
    // Clear all filter errors before validation to prevent stale errors from blocking save
    const currentBranches = getValues("branches") || [];
    for (
      let branchIndex = 0;
      branchIndex < currentBranches.length;
      branchIndex++
    ) {
      // Clear errors for up to 20 filters per branch to catch any stale errors
      for (let filterIndex = 0; filterIndex < 20; filterIndex++) {
        clearErrors(
          `branches.${branchIndex}.filters.${filterIndex}.property` as any
        );
        clearErrors(
          `branches.${branchIndex}.filters.${filterIndex}.operator` as any
        );
        clearErrors(
          `branches.${branchIndex}.filters.${filterIndex}.value` as any
        );
      }
    }
    // Now call handleSubmit which will run validation and onSubmit if valid
    handleSubmit(onSubmit)();
  }, [getValues, clearErrors, handleSubmit, onSubmit]);

  const handleCloseClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowCloseDialog(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  useEffect(() => {
    if (onRequestClose) {
      onRequestClose.current = handleCloseClick;
    }
    return () => {
      if (onRequestClose) {
        onRequestClose.current = null;
      }
    };
  }, [handleCloseClick, onRequestClose]);

  const handleDiscardChanges = useCallback(() => {
    setShowCloseDialog(false);
    onClose();
  }, [onClose]);

  const handleSaveAndClose = useCallback(() => {
    setShowCloseDialog(false);
    handleSave();
  }, [handleSave]);

  // Branch handlers - memoized to prevent re-renders
  const handleAddBranch = useCallback(() => {
    const newBranchId = `branch-${Date.now()}`;
    const newBranch: Branch = {
      id: newBranchId,
      targetNodeId: "exit",
      filters: [],
    };
    const currentBranches = getValues("branches") || [];
    setValue("branches", [...currentBranches, newBranch], {
      shouldDirty: true,
    });
    setNewlyAddedBranchId(newBranchId);
    // Clear the connection highlight when a new branch is added
    // This prevents both highlights from showing at the same time
    setShowBranchHighlight(false);
    // Mark connection highlight as dismissed so it doesn't re-enable
    connectionHighlightDismissedRef.current = true;
  }, [getValues, setValue]);

  const handleUpdateBranch = useCallback(
    (branchId: string, updates: Partial<Branch>) => {
      const currentBranches = getValues("branches") || [];
      const updatedBranches = currentBranches.map((branch: Branch) =>
        branch.id === branchId ? { ...branch, ...updates } : branch
      );
      setValue("branches", updatedBranches, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleDeleteBranch = useCallback(
    (branchId: string) => {
      const currentBranches = getValues("branches") || [];
      const updatedBranches = currentBranches.filter(
        (branch: Branch) => branch.id !== branchId
      );
      setValue("branches", updatedBranches, { shouldDirty: true });
      onDeleteEdge(`edge-${branchId}`);
    },
    [getValues, setValue, onDeleteEdge]
  );

  // Branch filter handlers - memoized to prevent re-renders
  const handleAddBranchFilter = useCallback(
    (branchId: string) => {
      const newFilter: Condition = {
        id: `filter-${Date.now()}`,
        property: "",
        operator: "=",
        value: "",
      };
      const currentBranches = getValues("branches") || [];
      const updatedBranches = currentBranches.map((branch: Branch) =>
        branch.id === branchId
          ? { ...branch, filters: [...(branch.filters || []), newFilter] }
          : branch
      );
      setValue("branches", updatedBranches, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleUpdateBranchFilter = useCallback(
    (branchId: string, filterId: string, updates: Partial<Condition>) => {
      const currentBranches = getValues("branches") || [];
      const branchIndex = currentBranches.findIndex(
        (b: Branch) => b.id === branchId
      );
      const branch = currentBranches[branchIndex];
      const filterIndex =
        branch?.filters?.findIndex((f: Condition) => f.id === filterId) ?? -1;

      const updatedBranches = currentBranches.map((branch: Branch) =>
        branch.id === branchId
          ? {
              ...branch,
              filters: (branch.filters || []).map((filter) =>
                filter.id === filterId ? { ...filter, ...updates } : filter
              ),
            }
          : branch
      );
      setValue("branches", updatedBranches, { shouldDirty: true });

      // Clear errors for fields that are being updated
      if (branchIndex >= 0 && filterIndex >= 0) {
        if (updates.property) {
          clearErrors(
            `branches.${branchIndex}.filters.${filterIndex}.property` as any
          );
        }
        if (updates.operator) {
          clearErrors(
            `branches.${branchIndex}.filters.${filterIndex}.operator` as any
          );
        }
        if (updates.value !== undefined) {
          clearErrors(
            `branches.${branchIndex}.filters.${filterIndex}.value` as any
          );
        }
      }
    },
    [getValues, setValue, clearErrors]
  );

  const handleDeleteBranchFilter = useCallback(
    (branchId: string, filterId: string) => {
      const currentBranches = getValues("branches") || [];
      const branchIndex = currentBranches.findIndex(
        (b: Branch) => b.id === branchId
      );
      const branch = currentBranches[branchIndex];
      const filterIndex =
        branch?.filters?.findIndex((f: Condition) => f.id === filterId) ?? -1;

      const updatedBranches = currentBranches.map((branch: Branch) =>
        branch.id === branchId
          ? {
              ...branch,
              filters: (branch.filters || []).filter(
                (filter) => filter.id !== filterId
              ),
            }
          : branch
      );
      setValue("branches", updatedBranches, { shouldDirty: true });

      // Clear errors for the deleted filter to prevent stale errors
      if (branchIndex >= 0 && filterIndex >= 0) {
        clearErrors(
          `branches.${branchIndex}.filters.${filterIndex}.property` as any
        );
        clearErrors(
          `branches.${branchIndex}.filters.${filterIndex}.operator` as any
        );
        clearErrors(
          `branches.${branchIndex}.filters.${filterIndex}.value` as any
        );
      }
    },
    [getValues, setValue, clearErrors]
  );

  // Engagement handlers - memoized to prevent re-renders
  const handleAddEngagement = useCallback(() => {
    const newEngagement: Engagement = {
      id: `engagement-${Date.now()}`,
      type: "tooltip",
      config: {},
    };
    const currentEngagements = getValues("engagements") || [];
    setValue("engagements", [...currentEngagements, newEngagement], {
      shouldDirty: true,
    });
  }, [getValues, setValue]);

  const handleUpdateEngagement = useCallback(
    (engagementId: string, updates: Partial<Engagement>) => {
      const currentEngagements = getValues("engagements") || [];
      const updatedEngagements = currentEngagements.map(
        (engagement: Engagement) =>
          engagement.id === engagementId
            ? { ...engagement, ...updates }
            : engagement
      );
      setValue("engagements", updatedEngagements, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleDeleteEngagement = useCallback(
    (engagementId: string) => {
      const currentEngagements = getValues("engagements") || [];
      const updatedEngagements = currentEngagements.filter(
        (engagement: Engagement) => engagement.id !== engagementId
      );
      setValue("engagements", updatedEngagements, { shouldDirty: true });
      onDeleteEdge(`engagement-edge-${engagementId}`);
    },
    [getValues, setValue, onDeleteEdge]
  );

  // Memoize available target nodes to avoid recalculating on every render
  const availableTargetNodes = useMemo(
    () => nodes.filter((n) => n.id !== node.id && n.type === "state"),
    [nodes, node.id]
  );

  // Get available properties and property type map for the selected event
  const { availableProperties, propertyTypeMap } = useMemo(() => {
    const eventProperties: string[] = [];
    const typeMap = new Map<string, string>();

    if (eventName) {
      if (eventDetailsData?.data?.properties) {
        eventDetailsData.data.properties.forEach((prop) => {
          eventProperties.push(prop.propertyName);
          typeMap.set(prop.propertyName, prop.type || "string");
        });
      } else if (events.length > 0) {
        const selectedEvent = events.find(
          (e: {
            eventName: string;
            properties: Array<{ propertyName: string; type: string }>;
          }) => e.eventName === eventName
        );
        if (selectedEvent?.properties) {
          selectedEvent.properties.forEach(
            (prop: { propertyName: string; type: string }) => {
              eventProperties.push(prop.propertyName);
              typeMap.set(prop.propertyName, prop.type || "string");
            }
          );
        }
      }
    }

    const uniqueProperties = Array.from(new Set(eventProperties)).sort();

    return {
      availableProperties: uniqueProperties,
      propertyTypeMap: typeMap,
    };
  }, [eventName, eventDetailsData, events]);

  // Memoize filter editor to avoid recreating on every render
  const renderFilterEditor = useCallback(
    (
      filter: Condition,
      filterIndex: number,
      branchIndex: number,
      onUpdate: (updates: Partial<Condition>) => void,
      onDelete: () => void
    ) => {
      // Get errors for this filter
      const propertyError = (errors as any)?.branches?.[branchIndex]?.filters?.[
        filterIndex
      ]?.property;
      const operatorError = (errors as any)?.branches?.[branchIndex]?.filters?.[
        filterIndex
      ]?.operator;
      const valueError = (errors as any)?.branches?.[branchIndex]?.filters?.[
        filterIndex
      ]?.value;
      const selectedProperty = filter.property || "";
      const propertyType = propertyTypeMap.get(selectedProperty) || "string";
      const inputType = getInputType(propertyType);
      const normalizedType = normalizePropertyType(propertyType);

      // Convert value to number if property type is numeric
      const currentValue = filter.value;
      const displayValue =
        isNumericType(propertyType) && currentValue
          ? typeof currentValue === "string"
            ? parseFloat(currentValue)
            : currentValue
          : currentValue;

      return (
        <Box sx={styles.filterEditorStyles}>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              options={availableProperties}
              value={selectedProperty || null}
              onChange={(_: unknown, newValue: string | null) => {
                const newProperty = newValue || "";
                onUpdate({ property: newProperty });

                // Convert value if property type changes
                if (newProperty && propertyTypeMap.has(newProperty)) {
                  const newPropertyType =
                    propertyTypeMap.get(newProperty) || "string";
                  if (isNumericType(newPropertyType) && currentValue) {
                    const numValue = parseFloat(String(currentValue));
                    if (!isNaN(numValue)) {
                      onUpdate({ value: String(numValue) });
                    }
                  }
                }
              }}
              renderInput={(params: unknown) => (
                <TextField
                  {...(params as Record<string, unknown>)}
                  label="Property"
                  placeholder="e.g., platform, user.age"
                  size="small"
                  sx={styles.filterPropertyFieldStyles}
                  error={!!propertyError}
                  helperText={propertyError?.message}
                />
              )}
              noOptionsText="No properties found"
              filterOptions={(
                options: string[],
                { inputValue }: { inputValue: string }
              ) => {
                return options.filter((option: string) =>
                  option.toLowerCase().includes(inputValue.toLowerCase())
                );
              }}
            />
          </Box>
          <TextField
            select
            label="Operator"
            value={filter.operator}
            onChange={(e) =>
              onUpdate({ operator: e.target.value as Condition["operator"] })
            }
            size="small"
            sx={styles.filterOperatorFieldStyles}
            error={!!operatorError}
            helperText={operatorError?.message}
          >
            <MenuItem value="=">=</MenuItem>
            <MenuItem value="!=">≠</MenuItem>
            <MenuItem value=">">&gt;</MenuItem>
            <MenuItem value="<">&lt;</MenuItem>
            <MenuItem value=">=">≥</MenuItem>
            <MenuItem value="<=">≤</MenuItem>
            <MenuItem value="in">In</MenuItem>
            <MenuItem value="not in">Not In</MenuItem>
          </TextField>
          {inputType === "select" ? (
            <FormControl
              size="small"
              sx={styles.filterValueFieldStyles}
              error={!!valueError}
            >
              <InputLabel>Value</InputLabel>
              <Select
                value={String(displayValue || "")}
                label="Value"
                onChange={(e) => onUpdate({ value: String(e.target.value) })}
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
              {valueError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.75 }}
                >
                  {valueError.message}
                </Typography>
              )}
            </FormControl>
          ) : (
            <TextField
              label="Value"
              placeholder="Value"
              type={inputType}
              value={String(displayValue || "")}
              onChange={(e) => {
                const newValue =
                  inputType === "number"
                    ? e.target.value === ""
                      ? ""
                      : String(parseFloat(e.target.value))
                    : e.target.value;
                onUpdate({ value: String(newValue) });
              }}
              size="small"
              sx={styles.filterValueFieldStyles}
              error={!!valueError}
              helperText={valueError?.message}
            />
          )}
          <IconButton
            size="small"
            onClick={onDelete}
            color="error"
            sx={styles.filterDeleteButtonStyles}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    },
    [availableProperties, propertyTypeMap, errors]
  );

  // Generate dynamic header label based on node state
  const headerLabel = useMemo(() => {
    if (node.data.isEntry) {
      return eventName
        ? `Configure Entry: ${eventName}`
        : "Configure Entry Node";
    }
    return eventName ? `Configure: ${eventName}` : "Configure Journey Node";
  }, [node.data.isEntry, eventName]);

  return (
    <Box sx={styles.containerStyles}>
      <Box sx={styles.headerStyles}>
        <Box sx={styles.headerContentStyles}>
          {node.data.isEntry && (
            <Chip
              label="Entry"
              size="small"
              color="success"
              sx={styles.entryChipStyles}
            />
          )}
          <Typography sx={styles.headerTitleStyles}>{headerLabel}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip
            title="Learn How Journeys Work"
            placement="bottom"
            arrow
            open={showHelpTooltip}
            onClose={() => setShowHelpTooltip(false)}
            disableHoverListener
            disableFocusListener
            disableTouchListener
          >
            <IconButton
              size="small"
              onClick={() => {
                setTutorialDialogOpen(true);
                setShowHelpTooltip(false);
              }}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={handleCloseClick}
            sx={styles.closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={styles.formContainerStyles}
        component="form"
        onSubmit={handleSave}
      >
        {/* Event Name */}
        <Box sx={styles.eventNameContainerStyles(!!eventName)}>
          {node.data.isEntry && !eventName && (
            <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Start by selecting an event</strong> to configure this
                journey node. Once an event is selected, you&apos;ll be able to
                add transitions and engagements.
              </Typography>
            </Alert>
          )}
          <Controller
            name="eventName"
            control={control}
            render={({ field }) => {
              const handleEventNameChange = (eventName: string) => {
                field.onChange(eventName);
                if (eventName) {
                  const currentBranches = getValues("branches") || [];
                  if (currentBranches.length === 0) {
                    const defaultBranch: Branch = {
                      id: `branch-default-${Date.now()}`,
                      targetNodeId: "exit",
                      filters: [],
                    };
                    setValue("branches", [defaultBranch], {
                      shouldDirty: true,
                    });
                  }
                }
              };

              return (
                <Autocomplete
                  fullWidth
                  options={mockEventNames}
                  value={field.value || null}
                  loading={isLoadingEvents}
                  onChange={(_: unknown, newValue: string | null) => {
                    handleEventNameChange(newValue || "");
                  }}
                  renderInput={(params: unknown) => {
                    const fieldError = errors.eventName;
                    // Only show error if there's a validation error (from save attempt)
                    const hasError = !!fieldError;
                    return (
                      <TextField
                        {...(params as Record<string, unknown>)}
                        label="Event Name"
                        required
                        error={hasError}
                        focused={hasError}
                        helperText={
                          fieldError?.message ||
                          "Choose what user action starts this step. This determines when your journey moves forward."
                        }
                        sx={styles.eventNameInputStyles(
                          node.data.isEntry || false,
                          !!field.value
                        )}
                      />
                    );
                  }}
                  noOptionsText={
                    isLoadingEvents ? "Loading events..." : "No events found"
                  }
                  filterOptions={(
                    options: string[],
                    { inputValue }: { inputValue: string }
                  ) => {
                    return options.filter((option: string) =>
                      option.toLowerCase().includes(inputValue.toLowerCase())
                    );
                  }}
                />
              );
            }}
          />
        </Box>

        <Divider sx={styles.sectionDividerStyles} />

        {/* In-App Engagements */}
        <Box sx={styles.engagementContainerStyles}>
          <Box sx={styles.sectionHeaderStyles}>
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={styles.sectionTitleStyles}
              >
                In-App Engagements
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Show an engagement to users when they reach this step.
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddEngagement}
              variant="outlined"
              disabled={node.data.isEntry && !eventName}
              title={
                node.data.isEntry && !eventName
                  ? "Please select an event first"
                  : "Add an engagement"
              }
            >
              Add Engagement
            </Button>
          </Box>

          {engagements.length > 0 ? (
            <Box sx={styles.engagementListStyles}>
              {engagements.map((engagement: Engagement, index: number) => {
                const isHighlighted =
                  highlightedEngagementId === engagement.id &&
                  showEngagementHighlight;
                return (
                  <Paper
                    key={engagement.id}
                    elevation={isHighlighted ? 3 : 1}
                    sx={styles.engagementPaperStyles(isHighlighted)}
                  >
                    <Box sx={styles.engagementHeaderStyles}>
                      <Box
                        sx={{
                          ...styles.engagementIconContainerStyles,
                          flex: 1,
                        }}
                      >
                        {engagement.type === "tooltip" && (
                          <InfoIcon
                            sx={{ color: theme.palette.warning.main }}
                          />
                        )}
                        {engagement.type === "popup" && (
                          <OpenInNewIcon
                            sx={{ color: theme.palette.warning.main }}
                          />
                        )}
                        {engagement.type === "bottomsheet" && (
                          <ViewAgendaIcon
                            sx={{ color: theme.palette.warning.main }}
                          />
                        )}
                        <Typography variant="subtitle2" fontWeight={600}>
                          Engagement {index + 1}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEngagement(engagement.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Controller
                      name={`engagements.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Engagement Type"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleUpdateEngagement(engagement.id, {
                              type: e.target.value as
                                | "tooltip"
                                | "popup"
                                | "bottomsheet",
                            });
                          }}
                          size="small"
                        >
                          <MenuItem value="tooltip">
                            <Box sx={styles.engagementMenuItemStyles}>
                              <InfoIcon sx={{ fontSize: 18 }} />
                              <Typography>Tooltip</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem value="popup">
                            <Box sx={styles.engagementMenuItemStyles}>
                              <OpenInNewIcon sx={{ fontSize: 18 }} />
                              <Typography>Popup</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem value="bottomsheet">
                            <Box sx={styles.engagementMenuItemStyles}>
                              <ViewAgendaIcon sx={{ fontSize: 18 }} />
                              <Typography>Bottom Sheet</Typography>
                            </Box>
                          </MenuItem>
                        </TextField>
                      )}
                    />
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={styles.emptyEngagementBoxStyles(
                node.data.isEntry || false,
                !!eventName
              )}
            >
              <Typography
                variant="caption"
                color={
                  node.data.isEntry && !eventName
                    ? "text.disabled"
                    : "text.secondary"
                }
              >
                {node.data.isEntry && !eventName
                  ? "Select an event first to add engagements"
                  : "No engagements set up yet. Click 'Add Engagement' to show users an engagement at this step."}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={styles.sectionDividerStyles} />

        {/* Branches */}
        <Box>
          <Box sx={styles.sectionHeaderStyles}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Transitions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Set up what happens next in your journey. Choose where users go
                after this step and add rules to control the flow.
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddBranch}
              variant="outlined"
              disabled={node.data.isEntry && !eventName}
              title={
                node.data.isEntry && !eventName
                  ? "Please select an event first"
                  : "Add a transition"
              }
            >
              Add Transition
            </Button>
          </Box>

          {eventName && (
            <Alert
              icon={<InfoOutlinedIcon fontSize="inherit" />}
              severity="info"
              sx={{ mb: 2 }}
            >
              <Typography variant="caption">
                <strong>How it works:</strong> When a user performs{" "}
                <strong>'{eventName || "selected event"}'</strong> and meets all
                your rules, they move to the next step.
              </Typography>
            </Alert>
          )}

          {branches.length > 0 ? (
            <Box sx={styles.branchListStyles}>
              {branches.map((branch: Branch, index: number) => {
                const isHighlighted =
                  highlightedBranchId === branch.id && showBranchHighlight;
                const isNewlyAdded = newlyAddedBranchId === branch.id;
                const shouldHighlight = isHighlighted || isNewlyAdded;

                return (
                  <Paper
                    key={branch.id}
                    ref={(el) => {
                      if (el) {
                        branchRefsMap.current.set(branch.id, el);
                      } else {
                        branchRefsMap.current.delete(branch.id);
                      }
                    }}
                    elevation={shouldHighlight ? 3 : 1}
                    sx={styles.branchPaperStyles(shouldHighlight, isNewlyAdded)}
                  >
                    {/* Transition Flow Header */}
                    <Box sx={styles.branchHeaderStyles}>
                      <Box sx={styles.branchContentStyles}>
                        <Box sx={styles.branchChipContainerStyles}>
                          <Chip
                            label={`Transition ${index + 1}`}
                            size="small"
                            color={isHighlighted ? "primary" : "default"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        {/* Visual Flow Indicator */}
                        <Box sx={styles.flowIndicatorStyles}>
                          <Box sx={styles.flowStepStyles}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              When
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {eventName || "Event"}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon
                            sx={{ color: "text.secondary", fontSize: 20 }}
                          />
                          <Box sx={styles.flowStepStyles}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              All rules are met
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary.main"
                            >
                              {(branch.filters?.length || 0) === 0
                                ? "No conditions"
                                : `${branch.filters?.length || 0} condition${
                                    (branch.filters?.length || 0) > 1 ? "s" : ""
                                  }`}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon
                            sx={{ color: "text.secondary", fontSize: 20 }}
                          />
                          <Box sx={styles.flowStepStyles}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Go to
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {branch.targetNodeId === "exit"
                                ? "Exit"
                                : branch.targetNodeId || "Target"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteBranch(branch.id)}
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Divider sx={styles.branchDividerStyles} />

                    {/* Target Node Selection */}
                    <Box sx={{ mb: 3 }}>
                      <Controller
                        name={`branches.${index}.targetNodeId`}
                        control={control}
                        render={({ field }) => {
                          // Build options list: "exit" + event names from mockEventNames + event names from availableTargetNodes
                          const targetOptions = [
                            "exit",
                            ...mockEventNames,
                            ...availableTargetNodes.map((targetNode) => {
                              const eventName = (targetNode.data as JourneyNodeData)
                                .eventName;
                              return eventName || targetNode.id;
                            }),
                          ];
                          // Remove duplicates
                          const uniqueOptions = Array.from(
                            new Set(targetOptions)
                          );

                          return (
                            <Autocomplete
                              fullWidth
                              options={uniqueOptions}
                              value={field.value || null}
                              onChange={(
                                _: unknown,
                                newValue: string | null
                              ) => {
                                const target = newValue || "exit";
                                field.onChange(target);
                                handleUpdateBranch(branch.id, {
                                  targetNodeId: target,
                                });
                                if (
                                  target === "exit" ||
                                  branch.targetNodeId !== target
                                ) {
                                  onDeleteEdge(`edge-${branch.id}`);
                                }
                              }}
                              renderInput={(params: unknown) => (
                                <TextField
                                  {...(params as Record<string, unknown>)}
                                  label="Target Node"
                                  size="small"
                                  helperText="Choose the next step users will see. Select 'Exit' to end the journey."
                                />
                              )}
                              filterOptions={(
                                options: string[],
                                { inputValue }: { inputValue: string }
                              ) => {
                                return options.filter((option: string) =>
                                  option
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                );
                              }}
                              renderOption={(
                                props: unknown,
                                option: string
                              ) => (
                                <li
                                  {...(props as Record<string, unknown>)}
                                  key={option}
                                >
                                  {option === "exit" ? "Exit" : option}
                                </li>
                              )}
                            />
                          );
                        }}
                      />
                    </Box>

                    {/* Conditions Section */}
                    <Box>
                      <Box sx={styles.conditionsHeaderStyles}>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={styles.sectionTitleStyles}
                          >
                            Conditions
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Evaluated on{" "}
                            <strong>{eventName || "this event"}</strong>&apos;s
                            properties
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddBranchFilter(branch.id)}
                          variant="outlined"
                        >
                          Add Condition
                        </Button>
                      </Box>

                      {(branch.filters?.length || 0) > 0 ? (
                        <Box>
                          {/* AND Logic Header */}
                          {(branch.filters?.length || 0) > 1 && (
                            <Box sx={styles.andLogicHeaderStyles}>
                              <CheckCircleOutlineIcon
                                sx={styles.andLogicIconStyles}
                              />
                              <Typography
                                variant="caption"
                                fontWeight={600}
                                color="primary.main"
                              >
                                All conditions must pass (AND logic)
                              </Typography>
                            </Box>
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0,
                            }}
                          >
                            {(branch.filters || []).map(
                              (filter: Condition, filterIndex: number) => (
                                <Box key={filter.id}>
                                  {filterIndex > 0 && (
                                    <Box sx={styles.andConnectorStyles}>
                                      <Box sx={styles.andConnectorLineStyles} />
                                      <Box sx={styles.andBadgeStyles}>
                                        <Typography
                                          variant="caption"
                                          fontWeight={700}
                                          sx={{
                                            fontSize: "0.7rem",
                                            letterSpacing: 0.5,
                                          }}
                                        >
                                          AND
                                        </Typography>
                                      </Box>
                                      <Box sx={styles.andConnectorLineStyles} />
                                    </Box>
                                  )}
                                  <Box sx={styles.conditionCardStyles}>
                                    <Box sx={styles.conditionHeaderStyles}>
                                      <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                      >
                                        Condition {filterIndex + 1}
                                      </Typography>
                                    </Box>
                                    {renderFilterEditor(
                                      filter,
                                      filterIndex,
                                      index,
                                      (updates: Partial<Condition>) =>
                                        handleUpdateBranchFilter(
                                          branch.id,
                                          filter.id,
                                          updates
                                        ),
                                      () =>
                                        handleDeleteBranchFilter(
                                          branch.id,
                                          filter.id
                                        )
                                    )}
                                  </Box>
                                </Box>
                              )
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={styles.emptyConditionsBoxStyles}>
                          <Typography variant="caption" color="text.secondary">
                            No conditions. Always taken if no other transition
                            matches.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={styles.emptyBranchBoxStyles(
                node.data.isEntry || false,
                !!eventName
              )}
            >
              <Typography
                variant="body2"
                color={
                  node.data.isEntry && !eventName
                    ? "text.disabled"
                    : "text.secondary"
                }
              >
                {node.data.isEntry && !eventName
                  ? "Select an event first to add transitions"
                  : "No next steps set up yet. Click 'Add Transition' to define where the journey goes next."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={styles.footerDividerStyles} />

      <Box sx={styles.actionButtonsContainerStyles}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            onDelete(node.id);
            onClose();
          }}
          sx={styles.actionButtonStyles}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={styles.actionButtonStyles}
        >
          Save
        </Button>
      </Box>

      {/* Confirmation Dialog for Unsaved Changes */}
      <Dialog
        open={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        aria-labelledby="unsaved-changes-dialog-title"
        aria-describedby="unsaved-changes-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="unsaved-changes-dialog-title">
          <Box sx={styles.dialogTitleContainerStyles}>
            <WarningAmberIcon sx={styles.dialogTitleIconStyles} />
            <Typography variant="h6" component="span">
              Unsaved Changes
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="unsaved-changes-dialog-description"
            sx={styles.dialogContentTextStyles}
          >
            You have unsaved changes to this node configuration. What would you
            like to do?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Save:</strong> Save your changes and close the panel.
              <br />
              <strong>Discard:</strong> Close without saving. Your changes will
              be lost.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={styles.dialogActionsStyles}>
          <Button onClick={() => setShowCloseDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDiscardChanges}
            color="error"
            variant="outlined"
          >
            Discard
          </Button>
          <Button onClick={handleSaveAndClose} variant="contained" autoFocus>
            Save & Close
          </Button>
        </DialogActions>
      </Dialog>

      <JourneyTutorialDialog
        open={tutorialDialogOpen}
        onClose={() => setTutorialDialogOpen(false)}
      />
    </Box>
  );
}
