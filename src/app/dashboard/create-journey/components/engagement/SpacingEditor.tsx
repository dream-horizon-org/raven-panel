"use client";

import { useEffect, useRef, useMemo } from "react";
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

  // Watch only specific fields to avoid unnecessary re-renders
  const margin = watch("margin");
  const padding = watch("padding");

  // Memoize spacing key to detect actual changes
  const spacingKey = useMemo(
    () => JSON.stringify({
      margin: spacing?.margin,
      padding: spacing?.padding,
    }),
    [spacing?.margin, spacing?.padding]
  );

  // Sync form when spacing prop changes
  useEffect(() => {
    reset({
      margin: spacing?.margin || defaultSpacing.margin,
      padding: spacing?.padding || defaultSpacing.padding,
    });
  }, [spacingKey, reset]);

  // Update parent when form values change
  const prevMarginRef = useRef(margin);
  const prevPaddingRef = useRef(padding);
  useEffect(() => {
    // Only update if values actually changed
    if (
      JSON.stringify(prevMarginRef.current) !== JSON.stringify(margin) ||
      JSON.stringify(prevPaddingRef.current) !== JSON.stringify(padding)
    ) {
      onSpacingChange({
        margin: margin || defaultSpacing.margin,
        padding: padding || defaultSpacing.padding,
      });
      prevMarginRef.current = margin;
      prevPaddingRef.current = padding;
    }
  }, [margin, padding, onSpacingChange]);

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

