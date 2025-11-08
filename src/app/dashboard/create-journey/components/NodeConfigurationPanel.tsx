"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { JourneyNodeData, Condition, Branch, Engagement } from "./types";

interface NodeConfigurationPanelProps {
  node: Node<JourneyNodeData>;
  nodes: Node[];
  onUpdate: (nodeId: string, data: Partial<JourneyNodeData>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
  onDeleteEdge: (edgeId: string) => void;
  mockEventNames: string[];
  highlightedBranchId?: string | null;
  highlightedEngagementId?: string | null;
  onRequestClose?: React.MutableRefObject<(() => void) | null>;
}

export default function NodeConfigurationPanel({
  node,
  nodes,
  onUpdate,
  onDelete,
  onClose,
  onDeleteEdge,
  mockEventNames,
  highlightedBranchId,
  highlightedEngagementId,
  onRequestClose,
}: NodeConfigurationPanelProps) {
  // Initialize form data
  const getInitialData = useCallback((): JourneyNodeData => {
    const hasBranches = node.data.branches && Array.isArray(node.data.branches) && node.data.branches.length > 0;
    const hasEventName = node.data.eventName && node.data.eventName.trim() !== "";
    
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

  const { control, handleSubmit, watch, reset, setValue, getValues, formState: { isDirty } } = useForm<JourneyNodeData & Record<string, unknown>>({
    defaultValues: getInitialData(),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Watch form data - this gives us reactive access to branches
  const formData = watch();
  const branches = (formData.branches || []) as Branch[];
  const engagements = (formData.engagements || []) as Engagement[];
  const eventName = formData.eventName || "";

  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [newlyAddedBranchId, setNewlyAddedBranchId] = useState<string | null>(null);

  // Local state to track if highlight should be shown (auto-dismiss after 3 seconds)
  const [showBranchHighlight, setShowBranchHighlight] = useState(false);
  const [showEngagementHighlight, setShowEngagementHighlight] = useState(false);

  // Refs to track branch elements for scrolling
  const branchRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

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

  // Sync form with node.data when node changes
  useEffect(() => {
    const hasBranches = node.data.branches && Array.isArray(node.data.branches) && node.data.branches.length > 0;
    const hasEventName = node.data.eventName && node.data.eventName.trim() !== "";
    
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
  }, [node.data, reset]);

  const hasUnsavedChanges = isDirty;

  const onSubmit = (data: JourneyNodeData) => {
    onUpdate(node.id, data);
    onClose();
  };

  const handleSave = handleSubmit(onSubmit);

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

  const handleDiscardChanges = () => {
    setShowCloseDialog(false);
    onClose();
  };

  const handleSaveAndClose = () => {
    setShowCloseDialog(false);
    handleSave();
  };

  // Branch handlers - update form directly using setValue (already destructured above)

  const handleAddBranch = () => {
    const newBranchId = `branch-${Date.now()}`;
    const newBranch: Branch = {
      id: newBranchId,
      targetNodeId: "exit",
      filters: [],
    };
    const currentBranches = getValues("branches") || [];
    setValue("branches", [...currentBranches, newBranch], { shouldDirty: true });
    setNewlyAddedBranchId(newBranchId);
    // Clear the connection highlight when a new branch is added
    // This prevents both highlights from showing at the same time
    setShowBranchHighlight(false);
    // Mark connection highlight as dismissed so it doesn't re-enable
    connectionHighlightDismissedRef.current = true;
  };

  const handleUpdateBranch = (branchId: string, updates: Partial<Branch>) => {
    const currentBranches = getValues("branches") || [];
    const updatedBranches = currentBranches.map((branch: Branch) =>
      branch.id === branchId ? { ...branch, ...updates } : branch
    );
    setValue("branches", updatedBranches, { shouldDirty: true });
  };

  const handleDeleteBranch = (branchId: string) => {
    const currentBranches = getValues("branches") || [];
    const updatedBranches = currentBranches.filter((branch: Branch) => branch.id !== branchId);
    setValue("branches", updatedBranches, { shouldDirty: true });
    onDeleteEdge(`edge-${branchId}`);
  };

  // Branch filter handlers
  const handleAddBranchFilter = (branchId: string) => {
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
  };

  const handleUpdateBranchFilter = (branchId: string, filterId: string, updates: Partial<Condition>) => {
    const currentBranches = getValues("branches") || [];
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
  };

  const handleDeleteBranchFilter = (branchId: string, filterId: string) => {
    const currentBranches = getValues("branches") || [];
    const updatedBranches = currentBranches.map((branch: Branch) =>
      branch.id === branchId
        ? {
            ...branch,
            filters: (branch.filters || []).filter((filter) => filter.id !== filterId),
          }
        : branch
    );
    setValue("branches", updatedBranches, { shouldDirty: true });
  };

  // Engagement handlers
  const handleAddEngagement = () => {
    const newEngagement: Engagement = {
      id: `engagement-${Date.now()}`,
      type: "tooltip",
      config: {},
    };
    const currentEngagements = getValues("engagements") || [];
    setValue("engagements", [...currentEngagements, newEngagement], { shouldDirty: true });
  };

  const handleUpdateEngagement = (engagementId: string, updates: Partial<Engagement>) => {
    const currentEngagements = getValues("engagements") || [];
    const updatedEngagements = currentEngagements.map((engagement: Engagement) =>
      engagement.id === engagementId ? { ...engagement, ...updates } : engagement
    );
    setValue("engagements", updatedEngagements, { shouldDirty: true });
  };

  const handleDeleteEngagement = (engagementId: string) => {
    const currentEngagements = getValues("engagements") || [];
    const updatedEngagements = currentEngagements.filter((engagement: Engagement) => engagement.id !== engagementId);
    setValue("engagements", updatedEngagements, { shouldDirty: true });
    onDeleteEdge(`engagement-edge-${engagementId}`);
  };

  const availableTargetNodes = nodes.filter((n) => n.id !== node.id && n.type === "state");

  const renderFilterEditor = (
    filter: Condition,
    onUpdate: (updates: Partial<Condition>) => void,
    onDelete: () => void
  ) => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <TextField
        label="Property"
        placeholder="e.g., platform, user.age"
        value={filter.property}
        onChange={(e) => onUpdate({ property: e.target.value })}
        size="small"
        sx={{ flex: 2 }}
      />
      <TextField
        select
        label="Operator"
        value={filter.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as Condition["operator"] })}
        size="small"
        sx={{ flex: 1, minWidth: 120 }}
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
      <TextField
        label="Value"
        placeholder="Value"
        value={filter.value}
        onChange={(e) => onUpdate({ value: e.target.value })}
        size="small"
        sx={{ flex: 2 }}
      />
      <IconButton size="small" onClick={onDelete} color="error" sx={{ mt: 0.5 }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Configure Node</Typography>
        <IconButton size="small" onClick={handleCloseClick}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, overflowY: "auto" }} component="form" onSubmit={handleSave}>
        {/* Event Name */}
        <Box sx={{ mb: 3, mt: eventName ? 2 : 0 }}>
          {node.data.isEntry && !eventName && (
            <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Start by selecting an event</strong> to configure this journey node. Once an event is selected, you&apos;ll be able to add transitions and engagements.
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
                    setValue("branches", [defaultBranch], { shouldDirty: true });
                  }
                }
              };
              
              return (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Event Name"
                  value={field.value || ""}
                  onChange={(e) => handleEventNameChange(e.target.value)}
                  required
                  error={node.data.isEntry && !field.value}
                  focused={node.data.isEntry && !field.value}
                  helperText={
                    node.data.isEntry && !field.value
                      ? "⚠️ Please select an event first to enable transitions and engagements"
                      : "The event that triggers this node. Conditions on transitions are evaluated on this event's properties."
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      ...(node.data.isEntry && !field.value && {
                        "& fieldset": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                        animation: "pulse 2s ease-in-out infinite",
                        "@keyframes pulse": {
                          "0%, 100%": {
                            boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.4)",
                          },
                          "50%": {
                            boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                          },
                        },
                      }),
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select an event</em>
                  </MenuItem>
                  {mockEventNames.map((eventName) => (
                    <MenuItem key={eventName} value={eventName}>
                      {eventName}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* In-App Presentations */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                In-App Presentations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Show nudge when journey reaches this node
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddEngagement}
              variant="outlined"
              disabled={node.data.isEntry && !eventName}
              title={node.data.isEntry && !eventName ? "Please select an event first" : "Add an engagement"}
            >
              Add Engagement
            </Button>
          </Box>

          {engagements.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {engagements.map((engagement: Engagement, index: number) => {
                const isHighlighted = highlightedEngagementId === engagement.id && showEngagementHighlight;
                return (
                <Paper
                  key={engagement.id}
                  elevation={isHighlighted ? 3 : 1}
                  sx={{
                    border: "2px solid",
                    borderColor: isHighlighted ? "primary.main" : "divider",
                    borderRadius: 2,
                    p: 2.5,
                    bgcolor: isHighlighted ? "action.selected" : "background.paper",
                    transition: "all 0.2s",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {engagement.type === "tooltip" && <InfoIcon sx={{ color: "#ff9800" }} />}
                      {engagement.type === "popup" && <OpenInNewIcon sx={{ color: "#ff9800" }} />}
                      {engagement.type === "bottomsheet" && <ViewAgendaIcon sx={{ color: "#ff9800" }} />}
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
                    render={({ field }: { field: { value: string; onChange: (value: string) => void } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        select
                        label="Engagement Type"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleUpdateEngagement(engagement.id, {
                            type: e.target.value as "tooltip" | "popup" | "bottomsheet",
                          });
                        }}
                        size="small"
                      >
                        <MenuItem value="tooltip">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <InfoIcon sx={{ fontSize: 18 }} />
                            <Typography>Tooltip</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="popup">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <OpenInNewIcon sx={{ fontSize: 18 }} />
                            <Typography>Popup</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="bottomsheet">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: node.data.isEntry && !eventName ? "action.disabledBackground" : "action.hover",
                borderRadius: 1,
                border: node.data.isEntry && !eventName ? "1px dashed" : "none",
                borderColor: node.data.isEntry && !eventName ? "divider" : "transparent",
              }}
            >
              <Typography
                variant="caption"
                color={node.data.isEntry && !eventName ? "text.disabled" : "text.secondary"}
              >
                {node.data.isEntry && !eventName
                  ? "Select an event first to add engagements"
                  : "No engagements. Add an in-app presentation to show when this node is reached."}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Branches */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Transitions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Define when and where the journey moves next
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddBranch}
              variant="outlined"
              disabled={node.data.isEntry && !eventName}
              title={node.data.isEntry && !eventName ? "Please select an event first" : "Add a transition"}
            >
              Add Transition
            </Button>
          </Box>

          {eventName && (
            <Alert icon={<InfoOutlinedIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
              <Typography variant="caption">
                <strong>How it works:</strong> When the <strong>{eventName || "selected event"}</strong> occurs and all
                conditions pass, the journey transitions to the target node.
              </Typography>
            </Alert>
          )}

          {branches.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {branches.map((branch: Branch, index: number) => {
                const isHighlighted = highlightedBranchId === branch.id && showBranchHighlight;
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
                    sx={{
                      border: "2px solid",
                      borderColor: shouldHighlight ? "primary.main" : "divider",
                      borderRadius: 2,
                      p: 2.5,
                      bgcolor: shouldHighlight ? "action.selected" : "background.paper",
                      transition: "all 0.2s",
                      ...(shouldHighlight && {
                        boxShadow: isNewlyAdded
                          ? "0 4px 16px rgba(25, 118, 210, 0.5)"
                          : "0 4px 12px rgba(25, 118, 210, 0.3)",
                      }),
                    }}
                  >
                    {/* Transition Flow Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Chip
                            label={`Transition ${index + 1}`}
                            size="small"
                            color={isHighlighted ? "primary" : "default"}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        {/* Visual Flow Indicator */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1.5,
                            p: 1.5,
                            bgcolor: "action.hover",
                            borderRadius: 1,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              When
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {eventName || "Event"}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              AND conditions pass
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              {(branch.filters?.length || 0) === 0
                                ? "No conditions"
                                : `${branch.filters?.length || 0} condition${(branch.filters?.length || 0) > 1 ? "s" : ""}`}
                            </Typography>
                          </Box>
                          <ArrowForwardIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Go to
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {branch.targetNodeId === "exit" ? "Exit" : branch.targetNodeId || "Target"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={() => handleDeleteBranch(branch.id)} color="error" sx={{ ml: 1 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Target Node Selection */}
                    <Box sx={{ mb: 3 }}>
                      <Controller
                        name={`branches.${index}.targetNodeId`}
                        control={control}
                        render={({ field }: { field: { value: string | "exit"; onChange: (value: string | "exit") => void } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            select
                            label="Target Node"
                            value={field.value}
                            onChange={(e) => {
                              const target = e.target.value as string | "exit";
                              field.onChange(target);
                              handleUpdateBranch(branch.id, {
                                targetNodeId: target,
                              });
                              if (target === "exit" || branch.targetNodeId !== target) {
                                onDeleteEdge(`edge-${branch.id}`);
                              }
                            }}
                            size="small"
                            helperText="Where the journey moves to when conditions are met"
                          >
                            <MenuItem value="exit">Exit</MenuItem>
                            {mockEventNames.map((eventName) => (
                              <MenuItem key={eventName} value={eventName}>
                                {eventName}
                              </MenuItem>
                            ))}
                            {availableTargetNodes.map((targetNode) => (
                              <MenuItem key={targetNode.id} value={targetNode.data.eventName}>
                                {targetNode.data.eventName || targetNode.id}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Box>

                    {/* Conditions Section */}
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                            Conditions
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Evaluated on <strong>{eventName || "this event"}</strong>&apos;s properties
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 2,
                                p: 1.5,
                                bgcolor: (theme) =>
                                  theme.palette.mode === "light"
                                    ? "rgba(25, 118, 210, 0.08)"
                                    : "rgba(144, 202, 249, 0.16)",
                                borderRadius: 1,
                                border: "1px solid",
                                borderColor: (theme) =>
                                  theme.palette.mode === "light"
                                    ? "rgba(25, 118, 210, 0.2)"
                                    : "rgba(144, 202, 249, 0.3)",
                              }}
                            >
                              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "primary.main" }} />
                              <Typography variant="caption" fontWeight={600} color="primary.main">
                                All conditions must pass (AND logic)
                              </Typography>
                            </Box>
                          )}

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {(branch.filters || []).map((filter: Condition, filterIndex: number) => (
                              <Box key={filter.id}>
                                {filterIndex > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      my: 1.5,
                                      position: "relative",
                                    }}
                                  >
                                    <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        px: 1.5,
                                        py: 0.5,
                                        bgcolor: "primary.main",
                                        color: "white",
                                        borderRadius: 2,
                                        boxShadow: 1,
                                      }}
                                    >
                                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.7rem", letterSpacing: 0.5 }}>
                                        AND
                                      </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                                  </Box>
                                )}
                                <Box
                                  sx={{
                                    p: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    bgcolor: "background.paper",
                                    position: "relative",
                                    "&:hover": {
                                      borderColor: "primary.main",
                                      boxShadow: 1,
                                    },
                                    transition: "all 0.2s",
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                      Condition {filterIndex + 1}
                                    </Typography>
                                  </Box>
                                  {renderFilterEditor(
                                    filter,
                                    (updates) => handleUpdateBranchFilter(branch.id, filter.id, updates),
                                    () => handleDeleteBranchFilter(branch.id, filter.id)
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "action.hover", borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            No conditions. Always taken if no other transition matches.
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
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: node.data.isEntry && !eventName ? "action.disabledBackground" : "action.hover",
                borderRadius: 1,
                border: node.data.isEntry && !eventName ? "1px dashed" : "none",
                borderColor: node.data.isEntry && !eventName ? "divider" : "transparent",
              }}
            >
              <Typography variant="body2" color={node.data.isEntry && !eventName ? "text.disabled" : "text.secondary"}>
                {node.data.isEntry && !eventName
                  ? "Select an event first to add transitions"
                  : "No transitions. Add a transition to define where the journey moves next."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" color="error" onClick={() => { onDelete(node.id); onClose(); }} sx={{ flex: 1 }}>
          Delete
        </Button>
        <Button variant="contained" onClick={handleSave} sx={{ flex: 1 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <WarningAmberIcon sx={{ color: "warning.main", fontSize: 28 }} />
            <Typography variant="h6" component="span">
              Unsaved Changes
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unsaved-changes-dialog-description" sx={{ fontSize: "0.95rem", lineHeight: 1.6, color: "text.primary", mb: 1 }}>
            You have unsaved changes to this node configuration. What would you like to do?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Save:</strong> Save your changes and close the panel.
              <br />
              <strong>Discard:</strong> Close without saving. Your changes will be lost.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setShowCloseDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDiscardChanges} color="error" variant="outlined">
            Discard
          </Button>
          <Button onClick={handleSaveAndClose} variant="contained" autoFocus>
            Save & Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
