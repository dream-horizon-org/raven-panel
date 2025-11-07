"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { JourneyNodeData, Condition, Branch } from "./types";

interface NodeConfigurationPanelProps {
  node: Node<JourneyNodeData>;
  nodes: Node[];
  onUpdate: (nodeId: string, data: Partial<JourneyNodeData>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
  onDeleteEdge: (edgeId: string) => void;
  mockEventNames: string[];
  highlightedBranchId?: string | null;
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
}: NodeConfigurationPanelProps) {
  const [localData, setLocalData] = useState<JourneyNodeData>(node.data);

  useEffect(() => {
    setLocalData(node.data);
    
    // Auto-create default exit transition if event name exists but no branches
    if (node.data.eventName && (!node.data.branches || node.data.branches.length === 0)) {
      const defaultBranch: Branch = {
        id: `branch-default-${Date.now()}`,
        targetNodeId: "exit",
        filters: [],
      };
      setLocalData({
        ...node.data,
        branches: [defaultBranch],
      });
    }
  }, [node.data]);

  const handleSave = () => {
    onUpdate(node.id, localData);
    onClose();
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
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {/* Event Name */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            select
            label="Event Name"
            value={localData.eventName || ""}
            onChange={(e) => {
              const eventName = e.target.value;
              const updatedData = {
                ...localData,
                eventName,
                label: eventName || "New Node",
              };
              
              // If event name is selected and no branches exist, create default exit transition
              if (eventName && (!localData.branches || localData.branches.length === 0)) {
                const defaultBranch: Branch = {
                  id: `branch-default-${Date.now()}`,
                  targetNodeId: "exit",
                  filters: [],
                };
                updatedData.branches = [defaultBranch];
              }
              
              setLocalData(updatedData);
            }}
            required
            helperText="The event that triggers this node. Conditions below will be evaluated on this event's properties."
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
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddBranch}>
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

          {localData.branches && localData.branches.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {localData.branches.map((branch, index) => (
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
                bgcolor: "action.hover",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {localData.eventName 
                  ? "Select an event name to create a default transition."
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
    </Box>
  );
}
