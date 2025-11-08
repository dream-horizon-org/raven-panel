"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  onRequestClose?: React.MutableRefObject<(() => void) | null>; // Ref to store close handler (for intercepting Drawer's onClose)
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
  const [localData, setLocalData] = useState<JourneyNodeData>(() => {
    // Initialize with default exit branch if event name exists but no branches
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
    // Ensure branches is always an array
    return {
      ...node.data,
      branches: node.data.branches || [],
    };
  });
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // Sync with node.data and ensure default branch exists when eventName is set
  useEffect(() => {
    const hasBranches = node.data.branches && Array.isArray(node.data.branches) && node.data.branches.length > 0;
    const hasEventName = node.data.eventName && node.data.eventName.trim() !== "";
    
    if (hasBranches) {
      // Node has branches, sync them
      setLocalData(node.data);
    } else if (hasEventName) {
      // Node has eventName but no branches, create default branch
      const defaultBranch: Branch = {
        id: `branch-default-${Date.now()}`,
        targetNodeId: "exit",
        filters: [],
      };
      setLocalData({
        ...node.data,
        branches: [defaultBranch],
      });
    } else {
      // No event name, just sync
      setLocalData({
        ...node.data,
        branches: node.data.branches || [],
      });
    }
  }, [node.data.eventName, node.id]);

  // Compute branches to display - ensure default branch is shown if eventName exists
  const branchesToDisplay = useMemo(() => {
    const currentBranches = localData.branches && Array.isArray(localData.branches) ? localData.branches : [];
    return currentBranches;
  }, [localData.branches]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const originalData = node.data;
    const currentBranches = localData.branches || [];
    const originalBranches = originalData.branches || [];
    const currentEngagements = localData.engagements || [];
    const originalEngagements = originalData.engagements || [];
    
    // Compare event name
    if (localData.eventName !== originalData.eventName) {
      return true;
    }
    
    // Compare branches (simplified comparison - check length and basic structure)
    if (currentBranches.length !== originalBranches.length) {
      return true;
    }
    
    // Compare engagements
    if (currentEngagements.length !== originalEngagements.length) {
      return true;
    }
    
    // Deep compare branches
    for (let i = 0; i < currentBranches.length; i++) {
      const current = currentBranches[i];
      const original = originalBranches[i];
      if (
        !original ||
        current.targetNodeId !== original.targetNodeId ||
        current.filters.length !== original.filters.length
      ) {
        return true;
      }
    }
    
    // Deep compare engagements
    for (let i = 0; i < currentEngagements.length; i++) {
      const current = currentEngagements[i];
      const original = originalEngagements[i];
      if (!original || current.type !== original.type) {
        return true;
      }
    }
    
    return false;
  }, [localData, node.data]);

  const handleSave = () => {
    onUpdate(node.id, localData);
    onClose();
  };

  const handleCloseClick = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowCloseDialog(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // Expose close handler to parent (for Drawer's onClose)
  useEffect(() => {
    if (onRequestClose) {
      // Store the close handler that checks for unsaved changes
      onRequestClose.current = handleCloseClick;
    }
    // Cleanup: remove handler when component unmounts
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

  // Branch handlers
  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      targetNodeId: "exit", // Default to exit
      filters: [],
    };
    setLocalData({
      ...localData,
      branches: [...(localData.branches || []), newBranch],
    });
    // Don't create nodes immediately - they'll be created when saved
  };

  const handleUpdateBranch = (branchId: string, updates: Partial<Branch>) => {
    setLocalData({
      ...localData,
      branches: (localData.branches || []).map((branch) =>
        branch.id === branchId ? { ...branch, ...updates } : branch
      ),
    });
  };

  const handleDeleteBranch = (branchId: string) => {
    setLocalData({
      ...localData,
      branches: (localData.branches || []).filter((branch) => branch.id !== branchId),
    });
    // Delete the corresponding edge
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
    setLocalData({
      ...localData,
      branches: (localData.branches || []).map((branch) =>
        branch.id === branchId
          ? { ...branch, filters: [...(branch.filters || []), newFilter] }
          : branch
      ),
    });
  };

  const handleUpdateBranchFilter = (
    branchId: string,
    filterId: string,
    updates: Partial<Condition>
  ) => {
    setLocalData({
      ...localData,
      branches: (localData.branches || []).map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              filters: (branch.filters || []).map((filter) =>
                filter.id === filterId ? { ...filter, ...updates } : filter
              ),
            }
          : branch
      ),
    });
  };

  const handleDeleteBranchFilter = (branchId: string, filterId: string) => {
    setLocalData({
      ...localData,
      branches: (localData.branches || []).map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              filters: (branch.filters || []).filter((filter) => filter.id !== filterId),
            }
          : branch
      ),
    });
  };

  // Engagement handlers
  const handleAddEngagement = () => {
    const newEngagement: Engagement = {
      id: `engagement-${Date.now()}`,
      type: "tooltip", // Default to tooltip
      config: {},
    };
    setLocalData({
      ...localData,
      engagements: [...(localData.engagements || []), newEngagement],
    });
  };

  const handleUpdateEngagement = (engagementId: string, updates: Partial<Engagement>) => {
    setLocalData({
      ...localData,
      engagements: (localData.engagements || []).map((engagement) =>
        engagement.id === engagementId ? { ...engagement, ...updates } : engagement
      ),
    });
  };

  const handleDeleteEngagement = (engagementId: string) => {
    setLocalData({
      ...localData,
      engagements: (localData.engagements || []).filter((engagement) => engagement.id !== engagementId),
    });
    // Delete the corresponding edge
    onDeleteEdge(`engagement-edge-${engagementId}`);
  };

  const availableTargetNodes = nodes.filter(
    (n) => n.id !== node.id && n.type === "state"
  );

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

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {/* Event Name */}
        <Box sx={{ mb: 3 }}>
          {node.data.isEntry && !localData.eventName && (
            <Alert 
              severity="info" 
              icon={<InfoOutlinedIcon />}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">
                <strong>Start by selecting an event</strong> to configure this journey node. Once an event is selected, you&apos;ll be able to add transitions and engagements.
              </Typography>
            </Alert>
          )}
          <TextField
            fullWidth
            select
            label="Event Name"
            value={localData.eventName || ""}
            onChange={(e) => {
              const eventName = e.target.value;
              const currentBranches = localData.branches && Array.isArray(localData.branches) ? localData.branches : [];
              
              const updatedData: JourneyNodeData = {
                ...localData,
                eventName,
                label: eventName || "New Node",
              };
              
              // If event name is selected and no branches exist, create default exit transition
              if (eventName) {
                if (currentBranches.length === 0) {
                  const defaultBranch: Branch = {
                    id: `branch-default-${Date.now()}`,
                    targetNodeId: "exit",
                    filters: [],
                  };
                  updatedData.branches = [defaultBranch];
                } else {
                  // Keep existing branches
                  updatedData.branches = currentBranches;
                }
              } else {
                // If event name is cleared, clear branches too
                updatedData.branches = [];
              }
              
              setLocalData(updatedData);
            }}
            required
            error={node.data.isEntry && !localData.eventName}
            focused={node.data.isEntry && !localData.eventName}
            helperText={
              node.data.isEntry && !localData.eventName
                ? "⚠️ Please select an event first to enable transitions and engagements"
                : "The event that triggers this node. Conditions on transitions are evaluated on this event's properties."
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                ...(node.data.isEntry && !localData.eventName && {
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
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* In-App Presentations */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
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
              disabled={node.data.isEntry && !localData.eventName}
              title={node.data.isEntry && !localData.eventName ? "Please select an event first" : "Add an engagement"}
            >
              Add Engagement
            </Button>
          </Box>

          {localData.engagements && localData.engagements.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {localData.engagements.map((engagement, index) => (
                <Paper
                  key={engagement.id}
                  elevation={highlightedEngagementId === engagement.id ? 3 : 1}
                  sx={{
                    border: "2px solid",
                    borderColor: highlightedEngagementId === engagement.id ? "primary.main" : "divider",
                    borderRadius: 2,
                    p: 2.5,
                    bgcolor: highlightedEngagementId === engagement.id ? "action.selected" : "background.paper",
                    transition: "all 0.2s",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
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

                  <TextField
                    fullWidth
                    select
                    label="Engagement Type"
                    value={engagement.type}
                    onChange={(e) => {
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
                </Paper>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: node.data.isEntry && !localData.eventName ? "action.disabledBackground" : "action.hover",
                borderRadius: 1,
                border: node.data.isEntry && !localData.eventName ? "1px dashed" : "none",
                borderColor: node.data.isEntry && !localData.eventName ? "divider" : "transparent",
              }}
            >
              <Typography 
                variant="caption" 
                color={node.data.isEntry && !localData.eventName ? "text.disabled" : "text.secondary"}
              >
                {node.data.isEntry && !localData.eventName
                  ? "Select an event first to add engagements"
                  : "No engagements. Add an in-app presentation to show when this node is reached."}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Branches */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
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
              disabled={node.data.isEntry && !localData.eventName}
              title={node.data.isEntry && !localData.eventName ? "Please select an event first" : "Add a transition"}
            >
              Add Transition
            </Button>
          </Box>

          {localData.eventName && (
            <Alert 
              icon={<InfoOutlinedIcon fontSize="inherit" />} 
              severity="info" 
              sx={{ mb: 2 }}
            >
              <Typography variant="caption">
                <strong>How it works:</strong> When the <strong>{localData.eventName || "selected event"}</strong> occurs 
                and all conditions pass, the journey transitions to the target node.
              </Typography>
            </Alert>
          )}

          {branchesToDisplay.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {branchesToDisplay.map((branch, index) => (
                <Paper
                  key={branch.id}
                  elevation={highlightedBranchId === branch.id ? 3 : 1}
                  sx={{
                    border: "2px solid",
                    borderColor: highlightedBranchId === branch.id ? "primary.main" : "divider",
                    borderRadius: 2,
                    p: 2.5,
                    bgcolor: highlightedBranchId === branch.id ? "action.selected" : "background.paper",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Transition Flow Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2.5,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={`Transition ${index + 1}`}
                          size="small"
                          color={highlightedBranchId === branch.id ? "primary" : "default"}
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
                            {localData.eventName || "Event"}
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            AND conditions pass
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            {branch.filters.length === 0 ? "No conditions" : `${branch.filters.length} condition${branch.filters.length > 1 ? "s" : ""}`}
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
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteBranch(branch.id)}
                      color="error"
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Target Node Selection */}
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      select
                      label="Target Node"
                      value={branch.targetNodeId}
                      onChange={(e) => {
                        const target = e.target.value as string | "exit";
                        handleUpdateBranch(branch.id, {
                          targetNodeId: target,
                        });
                        // Don't create nodes immediately - they'll be created when saved
                        // Delete edge if switching to exit or if target changes
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
                  </Box>

                  {/* Conditions Section */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                          Conditions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Evaluated on <strong>{localData.eventName || "this event"}</strong>&apos;s properties
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

                    {branch.filters.length > 0 ? (
                      <Box>
                        {/* AND Logic Header */}
                        {branch.filters.length > 1 && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                              p: 1.5,
                              bgcolor: (theme) => theme.palette.mode === "light" 
                                ? "rgba(25, 118, 210, 0.08)" 
                                : "rgba(144, 202, 249, 0.16)",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: (theme) => theme.palette.mode === "light"
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
                          {branch.filters.map((filter, filterIndex) => (
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
                                  {/* Left line */}
                                  <Box
                                    sx={{
                                      flex: 1,
                                      height: "1px",
                                      bgcolor: "divider",
                                    }}
                                  />
                                  {/* AND Badge */}
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
                                    <Typography
                                      variant="caption"
                                      fontWeight={700}
                                      sx={{ fontSize: "0.7rem", letterSpacing: 0.5 }}
                                    >
                                      AND
                                    </Typography>
                                  </Box>
                                  {/* Right line */}
                                  <Box
                                    sx={{
                                      flex: 1,
                                      height: "1px",
                                      bgcolor: "divider",
                                    }}
                                  />
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mb: 1,
                                  }}
                                >
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
                                  (updates) =>
                                    handleUpdateBranchFilter(branch.id, filter.id, updates),
                                  () => handleDeleteBranchFilter(branch.id, filter.id)
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          bgcolor: "action.hover",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          No conditions. Always taken if no other transition matches.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: node.data.isEntry && !localData.eventName ? "action.disabledBackground" : "action.hover",
                borderRadius: 1,
                border: node.data.isEntry && !localData.eventName ? "1px dashed" : "none",
                borderColor: node.data.isEntry && !localData.eventName ? "divider" : "transparent",
              }}
            >
              <Typography 
                variant="body2" 
                color={node.data.isEntry && !localData.eventName ? "text.disabled" : "text.secondary"}
              >
                {node.data.isEntry && !localData.eventName
                  ? "Select an event first to add transitions"
                  : "No transitions. Add a transition to define where the journey moves next."}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            onDelete(node.id);
            onClose();
          }}
          sx={{ flex: 1 }}
        >
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
          <DialogContentText 
            id="unsaved-changes-dialog-description"
            sx={{ 
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "text.primary",
              mb: 1
            }}
          >
            You have unsaved changes to this node configuration. What would you like to do?
          </DialogContentText>
          <Alert 
            severity="info" 
            icon={<InfoOutlinedIcon />}
            sx={{ 
              mt: 2,
              "& .MuiAlert-icon": {
                alignItems: "center"
              }
            }}
          >
            <Typography variant="caption" component="div">
              If you close without saving, all your changes will be lost.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
          <Button 
            onClick={() => setShowCloseDialog(false)} 
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDiscardChanges} 
            color="error"
            variant="outlined"
            sx={{ minWidth: 140 }}
          >
            Discard Changes
          </Button>
          <Button 
            onClick={handleSaveAndClose} 
            variant="contained" 
            autoFocus
            sx={{ minWidth: 140 }}
          >
            Save & Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
