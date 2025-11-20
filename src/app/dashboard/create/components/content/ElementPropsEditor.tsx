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
} from "@mui/material";
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
            fullWidth
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
          />
        );
      } else {
        // Initialize with empty array if not set
        return (
          <TextField
            key={prop.name}
            fullWidth
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
            fullWidth
            size="small"
            label={prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            placeholder={prop.default ? String(prop.default) : ""}
          />
        );

      case "number":
        return (
          <TextField
            key={prop.name}
            fullWidth
            size="small"
            type="number"
            label={prop.name}
            value={value}
            onChange={(e) =>
              onPropChange(prop.name, Number(e.target.value) || 0)
            }
            required={prop.isRequired}
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
        return (
          <FormControl key={prop.name} fullWidth size="small">
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
            fullWidth
            size="small"
            type="url"
            label={prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
            placeholder="https://..."
          />
        );

      case "color":
        return (
          <Box
            key={prop.name}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            <TextField
              fullWidth
              size="small"
              label={prop.name}
              value={value || ""}
              onChange={(e) => onPropChange(prop.name, e.target.value)}
              placeholder="#000000"
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
            fullWidth
            size="small"
            label={prop.name}
            value={value}
            onChange={(e) => onPropChange(prop.name, e.target.value)}
            required={prop.isRequired}
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
