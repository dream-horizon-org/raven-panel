"use client";

import { Box, Typography, TextField, Paper } from "@mui/material";
import { Spacing as SpacingType } from "../../types";

interface SpacingEditorProps {
  spacing?: {
    margin?: SpacingType;
    padding?: SpacingType;
  };
  onSpacingChange: (spacing: { margin?: SpacingType; padding?: SpacingType }) => void;
}

export default function SpacingEditor({ spacing, onSpacingChange }: SpacingEditorProps) {
  const margin = spacing?.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  const padding = spacing?.padding || { top: 0, right: 0, bottom: 0, left: 0 };

  const handleMarginChange = (side: keyof SpacingType, value: number) => {
    onSpacingChange({
      ...spacing,
      margin: {
        ...margin,
        [side]: value,
      },
    });
  };

  const handlePaddingChange = (side: keyof SpacingType, value: number) => {
    onSpacingChange({
      ...spacing,
      padding: {
        ...padding,
        [side]: value,
      },
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Spacing (in dp)
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Margin */}
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>
            Margin
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <TextField
              label="Top"
              type="number"
              value={margin.top}
              onChange={(e) => handleMarginChange("top", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Right"
              type="number"
              value={margin.right}
              onChange={(e) => handleMarginChange("right", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Bottom"
              type="number"
              value={margin.bottom}
              onChange={(e) => handleMarginChange("bottom", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Left"
              type="number"
              value={margin.left}
              onChange={(e) => handleMarginChange("left", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Padding */}
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>
            Padding
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <TextField
              label="Top"
              type="number"
              value={padding.top}
              onChange={(e) => handlePaddingChange("top", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Right"
              type="number"
              value={padding.right}
              onChange={(e) => handlePaddingChange("right", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Bottom"
              type="number"
              value={padding.bottom}
              onChange={(e) => handlePaddingChange("bottom", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Left"
              type="number"
              value={padding.left}
              onChange={(e) => handlePaddingChange("left", Number(e.target.value) || 0)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

