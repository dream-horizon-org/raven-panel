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
import {
  ReactNativeJson,
  CreateJourneyFormData,
} from "../../types/journeyTypes";
import { ComponentDefinition } from "../../utils/componentDefinitions";
import { contentElementEditorStyles } from "../../styles/contentElementEditorStyles";
import { useFormContext, Path } from "react-hook-form";

interface ElementStylesEditorProps {
  element: ReactNativeJson;
  componentDef: ComponentDefinition | undefined;
  onStyleChange: (
    styleName: string,
    value: string | number | undefined
  ) => void;
  basePath?: string; // e.g., "nudgeSelection.actions.0.template" or "nudgeSelection.actions.0.template.children.0"
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
  basePath = "nudgeSelection.actions.0.template",
}: ElementStylesEditorProps) {
  const {
    formState: { errors },
    clearErrors,
  } = useFormContext<CreateJourneyFormData>();

  // Helper to get field error - handles nested paths with array indices
  const getFieldError = (styleName: string) => {
    if (!basePath) return undefined;
    const fieldPath = `${basePath}.styles.${styleName}`;

    // Navigate through the errors object using the path
    const pathParts = fieldPath.split(".");
    let current: any = errors;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      if (!current || typeof current !== "object") {
        return undefined;
      }

      // Check if this part is a numeric string (array index)
      const numericIndex = parseInt(part, 10);
      const isNumericKey =
        !isNaN(numericIndex) && part === String(numericIndex);

      if (isNumericKey) {
        // React Hook Form stores array indices as object keys (e.g., { 0: {...}, 1: {...} })
        // Check if the key exists in the object
        if (part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      } else {
        // Regular object property
        if (part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
    }

    // Return the error object if it exists and has a message
    if (current && typeof current === "object" && "message" in current) {
      return current;
    }

    return undefined;
  };

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
    // For number fields, use empty string if undefined, but keep 0 as 0
    const value =
      currentValue === undefined || currentValue === null ? "" : currentValue;
    const fieldError = getFieldError(styleName);
    const hasError = !!fieldError;
    const errorMessage = fieldError?.message;

    if (styleName === "flexDirection") {
      return (
        <FormControl
          key={styleName}
          size="small"
          sx={{ width: "auto", maxWidth: "300px" }}
        >
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
        <FormControl
          key={styleName}
          size="small"
          sx={{ width: "auto", maxWidth: "300px" }}
        >
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
            {"Item Alignment"}
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
            sx={contentElementEditorStyles.contentLabel}
            gutterBottom
          >
            Text Alignment
          </Typography>
          <ButtonGroup size="small">
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
          error={hasError}
          helperText={errorMessage}
          FormHelperTextProps={{
            sx: { color: hasError ? "error.main" : "inherit" },
          }}
        />
      );
    }

    if (styleName === "backgroundColor") {
      return (
        <Box key={styleName}>
          <Typography
            sx={contentElementEditorStyles.contentLabel}
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
              error={hasError}
              helperText={errorMessage}
              FormHelperTextProps={{
                sx: { color: hasError ? "error.main" : "inherit" },
              }}
              InputProps={{
                startAdornment: (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      backgroundColor: backgroundColor,
                      border: "1px solid",
                      borderColor: hasError ? "error.main" : "divider",
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
                border: hasError
                  ? "2px solid #d32f2f"
                  : "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      );
    }

    // Special handling for height and width
    if (styleName === "height" || styleName === "width") {
      // Handle display value: show empty string if undefined/null, but keep 0 as 0
      // Also handle percentage strings - convert them to display format
      let displayValue: string | number = "";
      if (value !== undefined && value !== null) {
        if (typeof value === "string" && value.includes("%")) {
          // If it's a percentage string like "100%", show it as-is
          displayValue = value;
        } else {
          displayValue = value;
        }
      }

      return (
        <TextField
          key={styleName}
          size="small"
          type="text"
          label={styleName.charAt(0).toUpperCase() + styleName.slice(1)}
          value={displayValue}
          error={hasError}
          helperText={errorMessage}
          FormHelperTextProps={{
            sx: { color: hasError ? "error.main" : "inherit" },
          }}
          placeholder="e.g., 100 or 100%"
          onChange={(e) => {
            const inputValue = e.target.value.trim();

            // If empty, set to undefined
            if (inputValue === "") {
              const fieldPath = `${basePath}.styles.${styleName}` as Path<
                CreateJourneyFormData
              >;
              clearErrors(fieldPath);
              onStyleChange(styleName, undefined);
              return;
            }

            // Check if it's a percentage string
            if (/^\d+(\.\d+)?%$/.test(inputValue)) {
              // Keep as percentage string
              onStyleChange(styleName, inputValue);
            } else {
              // Try to parse as number
              const numValue = Number(inputValue);
              if (!isNaN(numValue)) {
                onStyleChange(styleName, numValue);
              } else {
                // Invalid value - let validation handle it
                onStyleChange(styleName, inputValue);
              }
            }
          }}
          sx={{ flex: 1 }}
        />
      );
    }

    // Default to number input for most styles
    return (
      <TextField
        key={styleName}
        size="small"
        type="number"
        label={styleName}
        value={value || ""}
        onChange={(e) =>
          onStyleChange(
            styleName,
            e.target.value && e.target.value.trim() !== ""
              ? Number(e.target.value)
              : undefined
          )
        }
        sx={{ width: "auto", maxWidth: "300px" }}
        error={hasError}
        helperText={errorMessage}
        FormHelperTextProps={{
          sx: { color: hasError ? "error.main" : "inherit" },
        }}
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
          <Typography sx={contentElementEditorStyles.contentLabel}>
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
                  const marginError = getFieldError(styleName);
                  const marginHasError = !!marginError;
                  const marginErrorMessage = marginError?.message;
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
                      error={marginHasError}
                      helperText={marginErrorMessage}
                      FormHelperTextProps={{
                        sx: {
                          color: marginHasError ? "error.main" : "inherit",
                        },
                      }}
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
                  const paddingError = getFieldError(styleName);
                  const paddingHasError = !!paddingError;
                  const paddingErrorMessage = paddingError?.message;
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
                      error={paddingHasError}
                      helperText={paddingErrorMessage}
                      FormHelperTextProps={{
                        sx: {
                          color: paddingHasError ? "error.main" : "inherit",
                        },
                      }}
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
          <Typography sx={contentElementEditorStyles.contentLabel}>
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
            sx={contentElementEditorStyles.contentLabel}
            gutterBottom
          >
            Dimensions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mt: 2 }}>
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
