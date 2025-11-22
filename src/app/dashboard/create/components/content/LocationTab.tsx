"use client";

import { Box, Typography, TextField } from "@mui/material";
import {
  Control,
  FieldErrors,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
} from "../../types/journeyTypes";
import { contentTabStyles } from "../../styles/contentTabStyles";

interface LocationTabProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function LocationTab({ control, errors }: LocationTabProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();

  const template = useWatch({
    control,
    name: "nudgeSelection.actions.0.template",
  }) as ReactNativeJson | undefined;

  const updateTemplateProps = (
    propKey: string,
    value: string | number | boolean | null | undefined
  ) => {
    if (!template) return;

    const updatedTemplate: ReactNativeJson = {
      ...template,
      props: {
        ...template.props,
        [propKey]: value,
      },
    };
    setValue("nudgeSelection.actions.0.template", updatedTemplate);
  };

  const tooltipProps = (template?.props || {}) as Record<string, any>;

  return (
    <Box sx={contentTabStyles.container}>
      <Box sx={contentTabStyles.header}>
        <Box>
          <Typography sx={contentTabStyles.title}>Location</Typography>
          <Typography sx={contentTabStyles.subtitle}>
            Configure the target screen and element ID for the tooltip
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
        <Controller
          name="nudgeSelection.actions.0.template.props.targetScreen"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Target Screen"
              placeholder="Enter target screen name"
              value={tooltipProps.targetScreen || ""}
              onChange={(e) => {
                updateTemplateProps("targetScreen", e.target.value);
                field.onChange(e.target.value);
              }}
              fullWidth
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              FormHelperTextProps={{
                sx: { color: fieldState.error ? "error.main" : "inherit" },
              }}
            />
          )}
        />

        <Controller
          name="nudgeSelection.actions.0.template.props.targetId"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Target ID"
              placeholder="Enter target element ID"
              value={tooltipProps.targetId || ""}
              onChange={(e) => {
                updateTemplateProps("targetId", e.target.value);
                field.onChange(e.target.value);
              }}
              fullWidth
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              FormHelperTextProps={{
                sx: { color: fieldState.error ? "error.main" : "inherit" },
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
}
