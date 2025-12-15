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
} from "../../types/journey.interface";
import { contentTabStyles } from "./styles/contentTabStyles";
import { useMemo } from "react";

interface LocationTabProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  engagementId?: string | null;
}

export default function LocationTab({
  control,
  engagementId,
}: LocationTabProps) {
  const { setValue, getValues } = useFormContext<CreateJourneyFormData>();

  // Find the correct action index based on engagementId
  const actionIndex = useMemo(() => {
    if (!engagementId) return 0;

    const formActions = getValues("nudgeSelection.actions") || [];
    const index = formActions.findIndex((action) => {
      const actionIdPrefix = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;
      return actionIdPrefix === engagementId;
    });

    return index >= 0 ? index : 0;
  }, [engagementId, getValues]);

  const template = useWatch({
    control,
    name: `nudgeSelection.actions.${actionIndex}.template` as any,
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
    setValue(
      `nudgeSelection.actions.${actionIndex}.template` as any,
      updatedTemplate
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          name={
            `nudgeSelection.actions.${actionIndex}.template.props.targetScreen` as any
          }
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
          name={
            `nudgeSelection.actions.${actionIndex}.template.props.targetId` as any
          }
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
