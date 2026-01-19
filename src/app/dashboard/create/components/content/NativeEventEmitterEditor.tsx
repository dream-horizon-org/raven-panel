"use client";

import React, { useCallback, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useFormContext, get, useWatch } from "react-hook-form";
import {
  CreateJourneyFormData,
  NudgeEvent,
  DynamicTextValueType,
} from "../../types/journey.interface";

interface NativeEventEmitterEditorProps {
  actionIndex: number;
}

export default function NativeEventEmitterEditor({
  actionIndex,
}: NativeEventEmitterEditorProps) {
  const {
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateJourneyFormData>();

  const template = useWatch({
    control,
    name: `nudgeSelection.actions.${actionIndex}.template` as any,
  }) as NudgeEvent | undefined;

  // Debug: Log template to see what we're getting
  useEffect(() => {
    const formValue = getValues(
      `nudgeSelection.actions.${actionIndex}.template`
    );
    const allActions = getValues("nudgeSelection.actions") || [];
    const actionData = allActions[actionIndex];
  }, [template, actionIndex, getValues]);

  // Check if template is a valid NudgeEvent
  const isValidNudgeEvent = (t: unknown): t is NudgeEvent => {
    const isValid =
      typeof t === "object" &&
      t !== null &&
      "eventName" in t &&
      typeof (t as NudgeEvent).eventName === "string";
    if (!isValid && t) {
    }
    return isValid;
  };

  // Initialize default template if not present, but preserve existing data
  // Ensure we properly extract and normalize the data from the form state
  const currentTemplate: NudgeEvent = isValidNudgeEvent(template)
    ? {
        eventName: template.eventName || "",
        eventParams: Array.isArray(template.eventParams)
          ? template.eventParams.map((param) => {
              // Ensure value is properly formatted
              let normalizedValue: DynamicTextValueType;
              if (
                param.value &&
                Array.isArray(param.value) &&
                param.value.length > 0
              ) {
                // Map each value item to ensure proper structure
                normalizedValue = param.value.map((v) => {
                  if (
                    typeof v === "object" &&
                    v !== null &&
                    "value" in v &&
                    "isTemplateString" in v
                  ) {
                    // Already in correct format - preserve as-is
                    const isTemplateStr = Boolean(v.isTemplateString);
                    if (isTemplateStr && "variableName" in v) {
                      // Dynamic type
                      return {
                        isTemplateString: true as const,
                        variableName: String((v as any).variableName || ""),
                        default: (v as any).default || "",
                        variableType: ((v as any).variableType || "string") as
                          | "string"
                          | "number"
                          | "boolean"
                          | "url",
                      };
                    } else {
                      // Static type
                      return {
                        value: v.value,
                        isTemplateString: false as const,
                      };
                    }
                  }
                  // Convert to proper format - static type
                  return {
                    value:
                      typeof v === "object" && v !== null && "value" in v
                        ? v.value
                        : String(v || ""),
                    isTemplateString: false as const,
                  };
                }) as DynamicTextValueType;
              } else {
                normalizedValue = [
                  { value: "", isTemplateString: false as const },
                ];
              }

              return {
                name: param.name || "",
                type: (param.type || "string") as
                  | "string"
                  | "boolean"
                  | "number",
                value: normalizedValue,
              };
            })
          : [],
      }
    : {
        eventName: "",
        eventParams: [],
      };

  const eventName = currentTemplate.eventName || "";
  const eventParams = currentTemplate.eventParams || [];

  // Get error messages
  const eventNameError = get(
    errors,
    `nudgeSelection.actions.${actionIndex}.template.eventName`
  )?.message as string | undefined;

  const getParamError = (paramIndex: number, field: "name" | "value") => {
    return get(
      errors,
      `nudgeSelection.actions.${actionIndex}.template.eventParams.${paramIndex}.${field}`
    )?.message as string | undefined;
  };

  // Don't initialize template here - let the form state handle it
  // The template should already be set when the form is reset with parsed data
  // Only initialize if we're absolutely sure there's no data (for new engagements)
  useEffect(() => {
    // Only run this once when component mounts or actionIndex changes
    // Don't run when template changes to avoid clearing loaded data
    const formTemplateValue = getValues(
      `nudgeSelection.actions.${actionIndex}.template`
    ) as unknown;

    // Only initialize if template is completely missing (null/undefined)
    // Don't initialize if it exists, even if invalid - let the user see what's there
    if (!formTemplateValue) {
      // Check if this is a new engagement (no other actions exist or all are empty)
      const allActions = getValues("nudgeSelection.actions") || [];
      const hasAnyData = allActions.some(
        (action) =>
          action.template &&
          typeof action.template === "object" &&
          Object.keys(action.template).length > 0
      );

      // Only initialize if this is truly a new engagement (no data anywhere)
      if (!hasAnyData) {
        const defaultTemplate: NudgeEvent = {
          eventName: "",
          eventParams: [],
        };
        setValue(
          `nudgeSelection.actions.${actionIndex}.template`,
          defaultTemplate,
          { shouldDirty: false }
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionIndex]);

  const handleEventNameChange = useCallback(
    (value: string) => {
      const currentTemplate: NudgeEvent = {
        eventName: value,
        eventParams: eventParams,
      };
      setValue(
        `nudgeSelection.actions.${actionIndex}.template`,
        currentTemplate
      );
      // Clear error when user starts typing
      if (value.trim() !== "") {
        clearErrors(
          `nudgeSelection.actions.${actionIndex}.template.eventName` as any
        );
      }
    },
    [eventParams, actionIndex, setValue, clearErrors]
  );

  const handleAddProperty = useCallback(() => {
    const newParam = {
      name: "",
      type: "string" as const,
      value: [
        {
          value: "",
          isTemplateString: false as const,
        },
      ],
    };
    const updatedParams = [...eventParams, newParam];
    const updatedTemplate: NudgeEvent = {
      eventName,
      eventParams: updatedParams,
    };
    setValue(`nudgeSelection.actions.${actionIndex}.template`, updatedTemplate);
  }, [eventName, eventParams, actionIndex, setValue]);

  const handleDeleteProperty = useCallback(
    (index: number) => {
      const updatedParams = eventParams.filter((_, i) => i !== index);
      const updatedTemplate: NudgeEvent = {
        eventName,
        eventParams: updatedParams,
      };
      setValue(
        `nudgeSelection.actions.${actionIndex}.template`,
        updatedTemplate
      );
    },
    [eventName, eventParams, actionIndex, setValue]
  );

  const handlePropertyChange = useCallback(
    (
      paramIndex: number,
      field: "name" | "type" | "value",
      value: string | DynamicTextValueType
    ) => {
      const updatedParams = [...eventParams];
      if (field === "value") {
        updatedParams[paramIndex] = {
          ...updatedParams[paramIndex],
          value: value as DynamicTextValueType,
        };
      } else {
        updatedParams[paramIndex] = {
          ...updatedParams[paramIndex],
          [field]: value,
        };
      }
      const updatedTemplate: NudgeEvent = {
        eventName,
        eventParams: updatedParams,
      };
      setValue(
        `nudgeSelection.actions.${actionIndex}.template`,
        updatedTemplate
      );

      if (
        field === "name" &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        clearErrors(
          `nudgeSelection.actions.${actionIndex}.template.eventParams.${paramIndex}.name` as any
        );
      }
    },
    [eventName, eventParams, actionIndex, setValue, clearErrors]
  );

  const handleValueChange = useCallback(
    (paramIndex: number, valueIndex: number, value: string) => {
      const updatedParams = [...eventParams];
      const currentValue = updatedParams[paramIndex].value || [
        { value: "", isTemplateString: false as const },
      ];
      const updatedValue = [...currentValue];
      const existingItem = updatedValue[valueIndex];
      if (existingItem && !existingItem.isTemplateString) {
        updatedValue[valueIndex] = {
          ...existingItem,
          value,
        };
      } else {
        updatedValue[valueIndex] = {
          value,
          isTemplateString: false as const,
        };
      }
      updatedParams[paramIndex] = {
        ...updatedParams[paramIndex],
        value: updatedValue,
      };
      const updatedTemplate: NudgeEvent = {
        eventName,
        eventParams: updatedParams,
      };
      setValue(
        `nudgeSelection.actions.${actionIndex}.template`,
        updatedTemplate
      );
      // Clear error when user starts typing
      if (value.trim() !== "") {
        clearErrors(
          `nudgeSelection.actions.${actionIndex}.template.eventParams.${paramIndex}.value` as any
        );
      }
    },
    [eventName, eventParams, actionIndex, setValue, clearErrors]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Emit System events nudge type
      </Typography>

      <Box sx={{ mb: 3 }}>
        {/* Event Name with Add Property button on same row */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
          <TextField
            label="Event Name"
            value={eventName}
            onChange={(e) => handleEventNameChange(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            error={!!eventNameError}
            helperText={eventNameError}
            required
          />
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddProperty}
            variant="contained"
            size="small"
            sx={{ mt: 0.5 }}
          >
            Add Property
          </Button>
        </Box>

        {/* Event Property Rows */}
        {eventParams.map((param, paramIndex) => {
          const valueItem = param.value?.[0];
          const displayValue =
            valueItem && !valueItem.isTemplateString
              ? String(valueItem.value || "")
              : "";

          return (
            <Box
              key={paramIndex}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <TextField
                label="Event Property"
                value={param.name}
                onChange={(e) =>
                  handlePropertyChange(paramIndex, "name", e.target.value)
                }
                size="small"
                sx={{ flex: 1 }}
                error={!!getParamError(paramIndex, "name")}
                helperText={getParamError(paramIndex, "name")}
                required
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={param.type}
                  label="Type"
                  onChange={(e) =>
                    handlePropertyChange(
                      paramIndex,
                      "type",
                      e.target.value as "string" | "boolean" | "number"
                    )
                  }
                >
                  <MenuItem value="string">string</MenuItem>
                  <MenuItem value="boolean">boolean</MenuItem>
                  <MenuItem value="number">number</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Value"
                value={displayValue}
                onChange={(e) =>
                  handleValueChange(paramIndex, 0, e.target.value)
                }
                size="small"
                sx={{ flex: 1 }}
                error={!!getParamError(paramIndex, "value")}
                helperText={getParamError(paramIndex, "value")}
                required
              />

              <IconButton
                size="small"
                onClick={() => handleDeleteProperty(paramIndex)}
                color="error"
                sx={{ minWidth: 40, height: 40 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
