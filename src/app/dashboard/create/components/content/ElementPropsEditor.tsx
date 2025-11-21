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
  ListItemIcon,
  ListItemText,
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
} from "../../types/journeyTypes";
import {
  getComponentDefinition,
  ComponentDefinition,
} from "../../utils/componentDefinitions";
import { contentElementEditorStyles } from "../../styles/contentElementEditorStyles";

interface ElementPropsEditorProps {
  element: ReactNativeJson;
  componentDef: ComponentDefinition | undefined;
  onPropChange: (
    propName: string,
    value: string | number | boolean | DynamicTextValueType | null | undefined
  ) => void;
}

export default function ElementPropsEditor({
  element,
  componentDef,
  onPropChange,
}: ElementPropsEditorProps) {
  if (!componentDef?.props || componentDef.props.length === 0) {
    return null;
  }

  const renderPropInput = (
    prop: NonNullable<ComponentDefinition["props"]>[number]
  ) => {
    const currentValue = element.props?.[prop.name];

    // Handle template props (DynamicTextValueType)
    if (prop.isTemplate) {
      // Check if currentValue is a DynamicTextValueType array
      const isDynamicTextArray =
        Array.isArray(currentValue) &&
        currentValue.length > 0 &&
        typeof currentValue[0] === "object" &&
        "isTemplateString" in currentValue[0];

      if (isDynamicTextArray) {
        const dynamicTextArray = currentValue as DynamicTextValueType;
        const firstItem = dynamicTextArray[0];
        // Extract value from static type
        const displayValue =
          firstItem && !firstItem.isTemplateString
            ? String(firstItem.value)
            : "";

        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.name}
            value={displayValue}
            onChange={(e) => {
              // Update the DynamicTextValueType array with new value
              const updatedArray: DynamicTextValueType = [
                {
                  isTemplateString: false,
                  value: e.target.value,
                } as DynamicTextStaticType,
              ];
              onPropChange(prop.name, updatedArray);
            }}
            required={prop.isRequired}
            placeholder={prop.default ? String(prop.default) : ""}
            sx={{ width: "auto", maxWidth: "300px" }}
          />
        );
      } else {
        // Initialize with empty array if not set
        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.name}
            value=""
            onChange={(e) => {
              const updatedArray: DynamicTextValueType = [
                {
                  isTemplateString: false,
                  value: e.target.value,
                } as DynamicTextStaticType,
              ];
              onPropChange(prop.name, updatedArray);
            }}
            required={prop.isRequired}
            placeholder={prop.default ? String(prop.default) : ""}
            sx={{ width: "auto", maxWidth: "300px" }}
          />
        );
      }
    }

    const value = currentValue ?? prop.default ?? "";

    switch (prop.type) {
      case "string":
        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            placeholder={prop.default ? String(prop.default) : ""}
            sx={{ width: "auto", maxWidth: "300px" }}
          />
        );

      case "number":
        return (
          <TextField
            key={prop.name}
            size="small"
            type="number"
            label={prop.name}
            value={value}
            onChange={(e) =>
              onPropChange(prop.name, Number(e.target.value) || 0)
            }
            required={prop.isRequired}
            sx={{ width: "auto", maxWidth: "300px" }}
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
            label={prop.name}
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
                {prop.name}
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
            <InputLabel>{prop.name}</InputLabel>
            <Select
              value={value || prop.default || ""}
              label={prop.name}
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
            label={prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            placeholder="https://..."
            sx={{ width: "auto", maxWidth: "300px" }}
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
              label={prop.name}
              value={value || ""}
              onChange={(e) => onPropChange(prop.name, e.target.value)}
              placeholder="#000000"
              sx={{ width: "auto", maxWidth: "300px" }}
            />
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onPropChange(prop.name, e.target.value)}
              style={{ width: 40, height: 40, cursor: "pointer" }}
            />
          </Box>
        );

      default:
        return (
          <TextField
            key={prop.name}
            size="small"
            label={prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            sx={{ width: "auto", maxWidth: "300px" }}
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
