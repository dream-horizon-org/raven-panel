"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import {
  JourneyNodeData,
  EngagementNodeData,
  Engagement,
} from "../../types/JourneyNode.interface";
import InfoIcon from "@mui/icons-material/Info";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

// Type aliases to work around React Flow's NodeProps constraint
// @ts-expect-error - NodeProps constraint requires Node type, but we only have data types
type JourneyNodeProps = NodeProps<Record<string, unknown>>;
// @ts-expect-error - NodeProps constraint requires Node type, but we only have data types
type EngagementNodeProps = NodeProps<Record<string, unknown>>;

// nodeStyle will be created with theme inside component

// State Node (represents a node/state in the journey)
export const StateNode = memo((props: JourneyNodeProps) => {
  const theme = useTheme();
  const data = props.data as JourneyNodeData;
  const branchCount = data.branches?.length || 0;
  const hasExitBranch = data.branches?.some((b) => b.targetNodeId === "exit");
  const hasNoBranches = branchCount === 0;
  const isEntry = data.isEntry || false;

  const nodeStyle = {
    border: "2px solid",
    borderRadius: "8px",
    padding: "12px 16px",
    minWidth: "200px",
    backgroundColor: theme.palette.background.paper,
  };

  return (
    <Box
      sx={{
        ...nodeStyle,
        borderColor: isEntry
          ? theme.palette.success.main
          : theme.palette.primary.main,
        backgroundColor: isEntry
          ? theme.palette.mode === "dark"
            ? theme.palette.success.dark + "20"
            : "#e8f5e9"
          : theme.palette.mode === "dark"
          ? theme.palette.primary.dark + "20"
          : "#e3f2fd",
        borderWidth: isEntry ? "3px" : "2px",
        position: "relative",
      }}
    >
      <Handle type="target" position={Position.Top} />
      {isEntry && (
        <Chip
          label="Entry"
          size="small"
          sx={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: theme.palette.success.main,
            color: "white",
            fontSize: "10px",
            height: "20px",
            fontWeight: 600,
            zIndex: 10,
          }}
        />
      )}
      <Typography
        variant="subtitle2"
        fontWeight={600}
        sx={{
          mb: 1,
          mt: isEntry ? 0.5 : 0,
          color: theme.palette.text.primary,
        }}
      >
        {data.eventName || data.label || "Node"}
      </Typography>
      {hasNoBranches ? (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 0.5 }}
        >
          → Exit (default)
        </Typography>
      ) : (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 0.5 }}
        >
          {branchCount} branch{branchCount !== 1 ? "es" : ""}
          {hasExitBranch && " (includes exit)"}
        </Typography>
      )}
      {data.engagements && data.engagements.length > 0 && (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
          {data.engagements.map((eng: Engagement) => (
            <Chip
              key={eng.id}
              label={eng.type}
              size="small"
              sx={{ fontSize: "10px", height: "20px" }}
            />
          ))}
        </Box>
      )}
      <Handle type="source" position={Position.Bottom} id="branch-source" />
      <Handle type="source" position={Position.Right} id="engagement-source" />
    </Box>
  );
});

StateNode.displayName = "StateNode";

// Exit Node
export const ExitNode = memo((props: JourneyNodeProps) => {
  const theme = useTheme();
  const data = props.data as JourneyNodeData;

  const nodeStyle = {
    border: "2px solid",
    borderRadius: "8px",
    padding: "12px 16px",
    minWidth: "200px",
    backgroundColor: theme.palette.background.paper,
  };

  return (
    <Box
      sx={{
        ...nodeStyle,
        borderColor: theme.palette.error.main,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.error.dark + "20"
            : "#ffebee",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ color: theme.palette.text.primary }}
        >
          Exit
        </Typography>
      </Box>
    </Box>
  );
});

ExitNode.displayName = "ExitNode";

// Engagement Node (represents an in-app nudge/engagement)
export const EngagementNode = memo((props: EngagementNodeProps) => {
  const theme = useTheme();
  const data = props.data as EngagementNodeData;
  const getIcon = () => {
    switch (data.engagementType) {
      case "tooltip":
        return <InfoIcon sx={{ fontSize: 20 }} />;
      case "popup":
        return <OpenInNewIcon sx={{ fontSize: 20 }} />;
      case "bottomsheet":
        return <ViewAgendaIcon sx={{ fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (data.engagementType) {
      case "tooltip":
        return "Tooltip";
      case "popup":
        return "Popup";
      case "bottomsheet":
        return "Bottom Sheet";
      default:
        return data.engagementType;
    }
  };

  return (
    <Box
      sx={{
        border: `2px dashed ${theme.palette.warning.main}`,
        borderRadius: "6px",
        padding: "8px 12px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.warning.dark + "20"
            : "#fff3e0",
        minWidth: "120px",
        maxWidth: "120px",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.25,
        }}
      >
        <Box
          sx={{
            color: theme.palette.warning.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getIcon()}
        </Box>
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ fontSize: "0.65rem" }}
        >
          {getTypeLabel()}
        </Typography>
        <Chip
          label="Engagement"
          size="small"
          sx={{
            fontSize: "8px",
            height: "16px",
            bgcolor: theme.palette.warning.main,
            color: "white",
            fontWeight: 600,
            "& .MuiChip-label": {
              padding: "0 4px",
            },
          }}
        />
      </Box>
    </Box>
  );
});

EngagementNode.displayName = "EngagementNode";
