"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Box, Typography, Chip } from "@mui/material";
import { JourneyNodeData } from "./types";

const nodeStyle = {
  border: "2px solid",
  borderRadius: "8px",
  padding: "12px 16px",
  minWidth: "200px",
  backgroundColor: "white",
};

// State Node (represents a node/state in the journey)
export const StateNode = memo(({ data }: NodeProps<JourneyNodeData>) => {
  const branchCount = data.branches?.length || 0;
  const hasExitBranch = data.branches?.some((b) => b.targetNodeId === "exit");
  const hasNoBranches = branchCount === 0;
  const isEntry = data.isEntry || false;

  return (
    <Box
      sx={{
        ...nodeStyle,
        borderColor: isEntry ? "#4caf50" : "#2196f3",
        backgroundColor: isEntry ? "#e8f5e9" : "#e3f2fd",
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
            bgcolor: "#4caf50",
            color: "white",
            fontSize: "10px",
            height: "20px",
            fontWeight: 600,
            zIndex: 10,
          }}
        />
      )}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, mt: isEntry ? 0.5 : 0 }}>
        {data.eventName || data.label || "Node"}
      </Typography>
      {hasNoBranches ? (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          → Exit (default)
        </Typography>
      ) : (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          {branchCount} branch{branchCount !== 1 ? "es" : ""}
          {hasExitBranch && " (includes exit)"}
        </Typography>
      )}
      {data.engagements && data.engagements.length > 0 && (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
          {data.engagements.map((eng) => (
            <Chip
              key={eng.id}
              label={eng.type}
              size="small"
              sx={{ fontSize: "10px", height: "20px" }}
            />
          ))}
        </Box>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
});

StateNode.displayName = "StateNode";

// Exit Node
export const ExitNode = memo(({ data }: NodeProps<JourneyNodeData>) => {
  return (
    <Box
      sx={{
        ...nodeStyle,
        borderColor: "#f44336",
        backgroundColor: "#ffebee",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Exit
        </Typography>
      </Box>
    </Box>
  );
});

ExitNode.displayName = "ExitNode";

