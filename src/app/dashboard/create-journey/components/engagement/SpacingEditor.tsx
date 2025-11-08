"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
  const defaultSpacing = {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  };

  const { control, watch, reset } = useForm<{
    margin: SpacingType;
    padding: SpacingType;
  } & Record<string, unknown>>({
    defaultValues: {
      margin: spacing?.margin || defaultSpacing.margin,
      padding: spacing?.padding || defaultSpacing.padding,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Watch form values
  const formData = watch();

  // Sync form when spacing prop changes
  const prevSpacingRef = useRef(spacing);
  useEffect(() => {
    // Only reset if spacing prop actually changed
    if (JSON.stringify(prevSpacingRef.current) !== JSON.stringify(spacing)) {
      reset({
        margin: spacing?.margin || defaultSpacing.margin,
        padding: spacing?.padding || defaultSpacing.padding,
      });
      prevSpacingRef.current = spacing;
    }
  }, [spacing, reset]);

  // Update parent when form values change
  const prevFormDataRef = useRef(formData);
  useEffect(() => {
    // Only update if form data actually changed
    if (JSON.stringify(prevFormDataRef.current) !== JSON.stringify(formData)) {
      onSpacingChange({
        margin: formData.margin,
        padding: formData.padding,
      });
      prevFormDataRef.current = formData;
    }
  }, [formData, onSpacingChange]);

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
            <Controller
              name="margin.top"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Top"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="margin.right"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Right"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="margin.bottom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bottom"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="margin.left"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Left"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
          </Box>
        </Box>

        {/* Padding */}
        <Box>
          <Typography variant="caption" fontWeight={600} sx={{ mb: 1, display: "block" }}>
            Padding
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <Controller
              name="padding.top"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Top"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="padding.right"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Right"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="padding.bottom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Bottom"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
            <Controller
              name="padding.left"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Left"
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

