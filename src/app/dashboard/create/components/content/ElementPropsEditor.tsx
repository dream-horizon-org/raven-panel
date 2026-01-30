"use client";

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  ButtonGroup,
  Button,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import {
  ReactNativeJson,
  DynamicTextValueType,
  DynamicTextStaticType,
  CreateJourneyFormData,
  ComponentDefinition,
} from "../../types/journey.interface";
import { contentElementEditorStyles } from "./styles/contentElementEditorStyles";
import { useFormContext, useWatch } from "react-hook-form";
import TemplatizedTextInput from "./TemplatizedTextInput";
import { useEventsList } from "../../hooks/useEventsList";

interface ElementPropsEditorProps {
  element: ReactNativeJson;
  componentDef: ComponentDefinition | undefined;
  onPropChange: (
    propName: string,
    value: string | number | boolean | DynamicTextValueType | null | undefined
  ) => void;
  basePath?: string; // e.g., "nudgeSelection.actions.0.template" or "nudgeSelection.actions.0.template.children.0"
}

export default function ElementPropsEditor({
  element,
  componentDef,
  onPropChange,
  basePath = "nudgeSelection.actions.0.template",
}: ElementPropsEditorProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext<CreateJourneyFormData>();

  // Get events data
  const { data: eventsData } = useEventsList();
  const events = eventsData?.data?.eventList || [];

  // Get eventInfo and contextParams from form
  const eventInfo = useWatch({
    control,
    name: "ruleEngine.eventInfo",
  }) as CreateJourneyFormData["ruleEngine"]["eventInfo"] || [];

  const contextParams = useWatch({
    control,
    name: "contextParams",
  }) as CreateJourneyFormData["contextParams"] || [];

  // Helper to get field error - handles nested paths with array indices
  const getFieldError = (propName: string) => {
    if (!basePath) return undefined;
    const fieldPath = `${basePath}.props.${propName}`;

    // Navigate through the errors object using the path
    const pathParts = fieldPath.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  if (!componentDef?.props || componentDef.props.length === 0) {
    return null;
  }

  const renderPropInput = (
    prop: NonNullable<ComponentDefinition["props"]>[number]
  ) => {
    const currentValue = element.props?.[prop.name];
    const fieldError = getFieldError(prop.name);
    const hasError = !!fieldError;
    const errorMessage = fieldError?.message;

    // Handle template props (DynamicTextValueType)
    if (prop.isTemplate) {
      const currentValue = element.props?.[prop.name] as DynamicTextValueType | undefined;

      return (
        <TemplatizedTextInput
          key={prop.name}
          value={currentValue}
          onChange={(newValue) => onPropChange(prop.name, newValue)}
          label={prop.display || prop.name}
          placeholder={prop.default ? String(prop.default) : ""}
          required={prop.isRequired}
          error={hasError}
          helperText={errorMessage}
          events={events}
          eventInfo={eventInfo}
          contextParams={contextParams}
        />
      );
    }

    const value = currentValue ?? prop.default ?? "";

    switch (prop.type) {
      case "string":
        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.display ? prop.display : prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            placeholder={prop.default ? String(prop.default) : ""}
            sx={{ width: "auto", maxWidth: "300px" }}
            error={hasError}
            helperText={errorMessage}
            FormHelperTextProps={{
              sx: { color: hasError ? "error.main" : "inherit" },
            }}
          />
        );

      case "number":
        return (
          <TextField
            key={prop.name}
            size="small"
            type="number"
            label={prop.display ? prop.display : prop.name}
            value={value}
            onChange={(e) =>
              onPropChange(prop.name, Number(e.target.value) || 0)
            }
            required={prop.isRequired}
            sx={{ width: "auto", maxWidth: "300px" }}
            error={hasError}
            helperText={errorMessage}
            FormHelperTextProps={{
              sx: { color: hasError ? "error.main" : "inherit" },
            }}
          />
        );

      case "boolean":
        return (
          <FormControlLabel
            key={prop.name}
            control={
              <Switch
                checked={value || false}
                onChange={(e) => onPropChange(prop.name, e.target.checked)}
              />
            }
            label={prop.display ? prop.display : prop.name}
          />
        );

      case "enum":
        // Special handling for position prop with button group
        const isPositionProp = prop.name === "position";

        // Special handling for alignment props with button groups
        const isAlignmentProp =
          prop.name === "titleAlignment" ||
          prop.name === "subTitleAlignment" ||
          (prop.acceptedValues?.includes("left") &&
            prop.acceptedValues?.includes("center") &&
            prop.acceptedValues?.includes("right"));

        const getPositionIcon = (position: string) => {
          switch (position.toLowerCase()) {
            case "top":
              return <ArrowUpwardIcon fontSize="small" />;
            case "bottom":
              return <ArrowDownwardIcon fontSize="small" />;
            case "left":
              return <ArrowBackIcon fontSize="small" />;
            case "right":
              return <ArrowForwardIcon fontSize="small" />;
            default:
              return null;
          }
        };

        if (isPositionProp) {
          const currentPosition = (value as string) || prop.default || "top";
          return (
            <Box key={prop.name}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  mb: 1,
                }}
                gutterBottom
              >
                {prop.display ? prop.display : prop.name}
              </Typography>
              <ButtonGroup size="small">
                {prop.acceptedValues?.map((val: string) => {
                  const isSelected = currentPosition === val;
                  return (
                    <Button
                      key={val}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => onPropChange(prop.name, val)}
                      sx={{
                        "&:hover": {
                          backgroundColor: isSelected
                            ? undefined
                            : "action.hover",
                        },
                      }}
                    >
                      {getPositionIcon(val)}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Box>
          );
        }

        if (isAlignmentProp) {
          const currentAlign = (value as string) || prop.default || "left";
          return (
            <Box key={prop.name}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  mb: 1,
                }}
                gutterBottom
              >
                {prop.name}
              </Typography>
              <ButtonGroup size="small">
                <Button
                  variant={currentAlign === "left" ? "contained" : "outlined"}
                  onClick={() => onPropChange(prop.name, "left")}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        currentAlign === "left" ? undefined : "action.hover",
                    },
                  }}
                >
                  <FormatAlignLeftIcon fontSize="small" />
                </Button>
                <Button
                  variant={currentAlign === "center" ? "contained" : "outlined"}
                  onClick={() => onPropChange(prop.name, "center")}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        currentAlign === "center" ? undefined : "action.hover",
                    },
                  }}
                >
                  <FormatAlignCenterIcon fontSize="small" />
                </Button>
                <Button
                  variant={currentAlign === "right" ? "contained" : "outlined"}
                  onClick={() => onPropChange(prop.name, "right")}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        currentAlign === "right" ? undefined : "action.hover",
                    },
                  }}
                >
                  <FormatAlignRightIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>
          );
        }

        return (
          <FormControl
            key={prop.name}
            size="small"
            sx={{ width: "auto", maxWidth: "300px" }}
          >
            <InputLabel>{prop.display ? prop.display : prop.name}</InputLabel>
            <Select
              value={value || prop.default || ""}
              label={prop.display ? prop.display : prop.name}
              onChange={(e) => onPropChange(prop.name, e.target.value)}
            >
              {prop.acceptedValues?.map((val: string) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case "url":
        return (
          <TextField
            key={prop.name}
            size="small"
            type="url"
            label={prop.display ? prop.display : prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            placeholder="https://..."
            sx={{ width: "auto", maxWidth: "300px" }}
            error={hasError}
            helperText={errorMessage}
            FormHelperTextProps={{
              sx: { color: hasError ? "error.main" : "inherit" },
            }}
          />
        );

      case "color":
        return (
          <Box
            key={prop.name}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <TextField
              size="small"
              label={prop.display ? prop.display : prop.name}
              value={value || ""}
              onChange={(e) => onPropChange(prop.name, e.target.value)}
              placeholder="#000000"
              sx={{ width: "auto", maxWidth: "300px" }}
              error={hasError}
              helperText={errorMessage}
              FormHelperTextProps={{
                sx: { color: hasError ? "error.main" : "inherit" },
              }}
            />
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onPropChange(prop.name, e.target.value)}
              style={{
                width: 40,
                height: 40,
                cursor: "pointer",
                border: hasError ? "2px solid #d32f2f" : "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </Box>
        );

      default:
        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.display ? prop.display : prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            sx={{ width: "auto", maxWidth: "300px" }}
            error={hasError}
            helperText={errorMessage}
            FormHelperTextProps={{
              sx: { color: hasError ? "error.main" : "inherit" },
            }}
          />
        );
    }
  };

  return (
    <Box sx={contentElementEditorStyles.section}>
      <Typography sx={contentElementEditorStyles.sectionLabel}>
        PROPERTIES
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {componentDef.props.map((prop) => renderPropInput(prop))}
      </Box>
    </Box>
  );
}
