"use client";

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
} from "@mui/material";
import { ReactNativeJson } from "../../types/journeyTypes";
import { ComponentDefinition } from "../../utils/componentDefinitions";
import { contentElementEditorStyles } from "../../styles/contentElementEditorStyles";

interface ElementStylesEditorProps {
  element: ReactNativeJson;
  componentDef: ComponentDefinition | undefined;
  onStyleChange: (
    styleName: string,
    value: string | number | undefined
  ) => void;
}

const SPACING_STYLES = [
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
];

const FLEX_STYLES = [
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "flexDirection",
  "justifyContent",
  "alignItems",
];

const FLEX_DIRECTION_VALUES = [
  "row",
  "column",
  "row-reverse",
  "column-reverse",
];
const JUSTIFY_CONTENT_VALUES = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
];
const ALIGN_ITEMS_VALUES = [
  "flex-start",
  "flex-end",
  "center",
  "stretch",
  "baseline",
];

const TEXT_ALIGN_VALUES = ["left", "center", "right", "justify"];

export default function ElementStylesEditor({
  element,
  componentDef,
  onStyleChange,
}: ElementStylesEditorProps) {
  if (!componentDef?.styles || componentDef.styles.length === 0) {
    return null;
  }

  const availableStyles = componentDef.styles;
  const spacingStyles = availableStyles.filter((s) =>
    SPACING_STYLES.includes(s)
  );
  const flexStyles = availableStyles.filter((s) => FLEX_STYLES.includes(s));

  // Separate dimension styles (borderRadius, height, width) from other styles
  const dimensionStyles = availableStyles.filter((s) =>
    ["borderRadius", "height", "width"].includes(s)
  );
  const otherStyles = availableStyles.filter(
    (s) =>
      !SPACING_STYLES.includes(s) &&
      !FLEX_STYLES.includes(s) &&
      !["borderRadius", "height", "width"].includes(s)
  );

  // Get current background color
  const backgroundColor =
    ((element.styles as Record<string, string | number | undefined>)?.[
      "backgroundColor"
    ] as string) || "#FFFFFF";

  // Handle color change
  const handleColorChange = (color: string) => {
    onStyleChange("backgroundColor", color);
  };

  const renderStyleInput = (styleName: string) => {
    const currentValue = (element.styles as Record<
      string,
      string | number | undefined
    >)?.[styleName];
    const value = currentValue ?? "";

    if (styleName === "flexDirection") {
      return (
        <FormControl key={styleName} fullWidth size="small">
          <InputLabel>{styleName}</InputLabel>
          <Select
            value={value || ""}
            label={styleName}
            onChange={(e) => onStyleChange(styleName, e.target.value)}
          >
            {FLEX_DIRECTION_VALUES.map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (styleName === "justifyContent") {
      return (
        <FormControl key={styleName} fullWidth size="small">
          <InputLabel>{styleName}</InputLabel>
          <Select
            value={value || ""}
            label={styleName}
            onChange={(e) => onStyleChange(styleName, e.target.value)}
          >
            {JUSTIFY_CONTENT_VALUES.map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (styleName === "alignItems") {
      const currentAlign = (value as string) || "flex-start";
      return (
        <Box key={styleName}>
          <Typography
            sx={contentElementEditorStyles.spacingSubLabel}
            gutterBottom
          >
            {styleName}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              onClick={() => onStyleChange(styleName, "flex-start")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1,
                px: 2,
                cursor: "pointer",
                backgroundColor:
                  currentAlign === "flex-start"
                    ? "primary.main"
                    : "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  backgroundColor:
                    currentAlign === "flex-start"
                      ? "primary.dark"
                      : "action.hover",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H14M2 6H10M2 9H14M2 12H10"
                  stroke={
                    currentAlign === "flex-start" ? "#FFFFFF" : "currentColor"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Box
              onClick={() => onStyleChange(styleName, "center")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1,
                px: 2,
                cursor: "pointer",
                backgroundColor:
                  currentAlign === "center"
                    ? "primary.main"
                    : "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  backgroundColor:
                    currentAlign === "center" ? "primary.dark" : "action.hover",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H13M4 6H12M3 9H13M4 12H12"
                  stroke={
                    currentAlign === "center" ? "#FFFFFF" : "currentColor"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Box
              onClick={() => onStyleChange(styleName, "flex-end")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1,
                px: 2,
                cursor: "pointer",
                backgroundColor:
                  currentAlign === "flex-end"
                    ? "primary.main"
                    : "background.paper",
                "&:hover": {
                  backgroundColor:
                    currentAlign === "flex-end"
                      ? "primary.dark"
                      : "action.hover",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H14M6 6H14M2 9H14M6 12H14"
                  stroke={
                    currentAlign === "flex-end" ? "#FFFFFF" : "currentColor"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
          </Box>
        </Box>
      );
    }

    if (styleName === "textAlign") {
      const currentAlign = (value as string) || "left";
      return (
        <Box key={styleName}>
          <Typography
            sx={contentElementEditorStyles.spacingSubLabel}
            gutterBottom
          >
            Text Alignment
          </Typography>
          <ButtonGroup fullWidth size="small">
            <Button
              variant={currentAlign === "left" ? "contained" : "outlined"}
              onClick={() => onStyleChange(styleName, "left")}
              sx={{
                "&:hover": {
                  backgroundColor:
                    currentAlign === "left" ? undefined : "action.hover",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H14M2 6H10M2 9H14M2 12H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
            <Button
              variant={currentAlign === "center" ? "contained" : "outlined"}
              onClick={() => onStyleChange(styleName, "center")}
              sx={{
                "&:hover": {
                  backgroundColor:
                    currentAlign === "center" ? undefined : "action.hover",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H13M4 6H12M3 9H13M4 12H12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
            <Button
              variant={currentAlign === "right" ? "contained" : "outlined"}
              onClick={() => onStyleChange(styleName, "right")}
              sx={{
                "&:hover": {
                  backgroundColor:
                    currentAlign === "right" ? undefined : "action.hover",
                },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 3H14M6 6H14M2 9H14M6 12H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </ButtonGroup>
        </Box>
      );
    }

    if (styleName === "borderRadius") {
      const borderRadiusValue = (value as number) || 0;
      return (
        <TextField
          key={styleName}
          size="small"
          type="number"
          label="Corner Radius"
          value={borderRadiusValue}
          onChange={(e) =>
            onStyleChange(styleName, Number(e.target.value) || 0)
          }
          inputProps={{ min: 0 }}
          sx={{ flex: 1 }}
        />
      );
    }

    if (styleName === "backgroundColor") {
      return (
        <Box key={styleName}>
          <Typography
            sx={contentElementEditorStyles.spacingSubLabel}
            gutterBottom
          >
            Background Color
          </Typography>
          <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
            <TextField
              size="small"
              value={backgroundColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#FFFFFF"
              sx={{ width: 150 }}
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      backgroundColor: backgroundColor,
                      border: "1px solid",
                      borderColor: "divider",
                      mr: 1,
                    }}
                  />
                ),
              }}
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => handleColorChange(e.target.value)}
              style={{
                width: 40,
                height: 40,
                cursor: "pointer",
                border: "1px solid",
                borderColor: "rgba(0, 0, 0, 0.23)",
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      );
    }

    // Special handling for height and width
    if (styleName === "height" || styleName === "width") {
      return (
        <TextField
          key={styleName}
          size="small"
          type="number"
          label={styleName.charAt(0).toUpperCase() + styleName.slice(1)}
          value={value || ""}
          onChange={(e) =>
            onStyleChange(
              styleName,
              e.target.value ? Number(e.target.value) : 0
            )
          }
          sx={{ flex: 1 }}
        />
      );
    }

    // Default to number input for most styles
    return (
      <TextField
        key={styleName}
        fullWidth
        size="small"
        type="number"
        label={styleName}
        value={value || ""}
        onChange={(e) =>
          onStyleChange(styleName, e.target.value ? Number(e.target.value) : 0)
        }
      />
    );
  };

  return (
    <Box sx={contentElementEditorStyles.section}>
      <Typography sx={contentElementEditorStyles.sectionLabel}>
        STYLES
      </Typography>

      {spacingStyles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={contentElementEditorStyles.spacingSubLabel}>
            Spacing (in dp)
          </Typography>
          <Box sx={contentElementEditorStyles.spacingGrid}>
            <Box>
              <Typography sx={contentElementEditorStyles.spacingSubLabel}>
                Margin
              </Typography>
              <Box sx={contentElementEditorStyles.spacingInputs}>
                {["Top", "Right", "Bottom", "Left"].map((side) => {
                  const styleName = `margin${side}`;
                  if (!spacingStyles.includes(styleName)) return null;
                  return (
                    <TextField
                      key={styleName}
                      type="number"
                      size="small"
                      label={side}
                      value={
                        ((element.styles as Record<
                          string,
                          string | number | undefined
                        >)?.[styleName] as number) || 0
                      }
                      onChange={(e) =>
                        onStyleChange(styleName, Number(e.target.value) || 0)
                      }
                      sx={contentElementEditorStyles.spacingInput}
                    />
                  );
                })}
              </Box>
            </Box>
            <Box>
              <Typography sx={contentElementEditorStyles.spacingSubLabel}>
                Padding
              </Typography>
              <Box sx={contentElementEditorStyles.spacingInputs}>
                {["Top", "Right", "Bottom", "Left"].map((side) => {
                  const styleName = `padding${side}`;
                  if (!spacingStyles.includes(styleName)) return null;
                  return (
                    <TextField
                      key={styleName}
                      type="number"
                      size="small"
                      label={side}
                      value={
                        ((element.styles as Record<
                          string,
                          string | number | undefined
                        >)?.[styleName] as number) || 0
                      }
                      onChange={(e) =>
                        onStyleChange(styleName, Number(e.target.value) || 0)
                      }
                      sx={contentElementEditorStyles.spacingInput}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {flexStyles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={contentElementEditorStyles.spacingSubLabel}>
            Layout
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {flexStyles.map((styleName) => renderStyleInput(styleName))}
          </Box>
        </Box>
      )}

      {dimensionStyles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={contentElementEditorStyles.spacingSubLabel}
            gutterBottom
          >
            Dimensions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            {dimensionStyles.map((styleName) => renderStyleInput(styleName))}
          </Box>
        </Box>
      )}

      {otherStyles.length > 0 && (
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {otherStyles.map((styleName) => renderStyleInput(styleName))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
