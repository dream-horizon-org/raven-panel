"use client";

import { useEffect, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { UIElement, TextElement, ImageElement, ViewElement, Spacing } from "../../types";
import SpacingEditor from "./SpacingEditor";

interface ElementConfigEditorProps {
  element: UIElement;
  onUpdate: (updates: Partial<UIElement>) => void;
}

export default function ElementConfigEditor({ element, onUpdate }: ElementConfigEditorProps) {
  const { control, watch, reset, setValue } = useForm<UIElement & Record<string, unknown>>({
    defaultValues: element,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Watch only specific fields to avoid unnecessary re-renders
  // We watch the entire form but only update when specific fields change
  const formData = watch();

  // Memoize element key to detect actual changes
  const textValue = element.type === "text" ? (element as TextElement).text : undefined;
  const imageSource = element.type === "image" ? (element as ImageElement).imageSource : undefined;
  const elementKey = useMemo(
    () => JSON.stringify({
      id: element.id,
      type: element.type,
      text: textValue,
      imageSource: imageSource,
    }),
    [element.id, element.type, textValue, imageSource]
  );

  // Sync form when element changes
  useEffect(() => {
    reset(element);
  }, [elementKey, reset]); // Only reset when element actually changes

  // Update parent when form values change (debounced via onBlur mode)
  // Use a ref to prevent infinite loops
  const prevElementRef = useRef(element);
  const prevFormDataRef = useRef(formData);
  useEffect(() => {
    // Only update if form data has actually changed and element hasn't changed externally
    if (
      prevElementRef.current.id === element.id && 
      JSON.stringify(prevFormDataRef.current) !== JSON.stringify(formData)
    ) {
      onUpdate(formData as Partial<UIElement>);
      prevFormDataRef.current = formData;
    }
    prevElementRef.current = element;
  }, [formData, element, onUpdate]);

  if (element.type === "text") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Text"
              multiline
              rows={2}
              size="small"
            />
          )}
        />

        <Controller
          name="textAlignment"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Text Alignment</InputLabel>
              <Select
                {...field}
                label="Text Alignment"
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Controller
            name="textColor"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Text Color"
                type="color"
                size="small"
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <Controller
            name="fontSize"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Font Size (dp)"
                type="number"
                size="small"
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Box>

        <Controller
          name="fontFamily"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Font Family"
              size="small"
              placeholder="e.g., PlusJakartaSans-Bold.ttf"
            />
          )}
        />

        <Controller
          name="spacing"
          control={control}
          render={({ field }) => (
            <SpacingEditor
              spacing={field.value}
              onSpacingChange={(spacing) => {
                field.onChange(spacing);
                setValue("spacing", spacing, { shouldDirty: true });
              }}
            />
          )}
        />
      </Box>
    );
  }

  if (element.type === "image") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="imageSource"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Image Source"
              size="small"
              placeholder="URL or path to image"
              helperText="Supported formats: JPEG, PNG, WEBP and GIF up to 1 MB"
            />
          )}
        />

        <Controller
          name="clickAction"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Click Action</InputLabel>
              <Select
                {...field}
                label="Click Action"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="open-url">Open URL</MenuItem>
                <MenuItem value="deep-link">Deep Link</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="occupyFullWidth"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value || false}
                  onChange={field.onChange}
                />
              }
              label="Occupy Full Width Of Container"
            />
          )}
        />

        <Controller
          name="spacing"
          control={control}
          render={({ field }) => (
            <SpacingEditor
              spacing={field.value}
              onSpacingChange={(spacing) => {
                field.onChange(spacing);
                setValue("spacing", spacing, { shouldDirty: true });
              }}
            />
          )}
        />
      </Box>
    );
  }

  if (element.type === "view") {
    const viewElement = element as ViewElement;
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="orientation"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <InputLabel>Orientation</InputLabel>
              <Select
                {...field}
                label="Orientation"
              >
                <MenuItem value="vertical">Vertical</MenuItem>
                <MenuItem value="horizontal">Horizontal</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Typography variant="body2" color="text.secondary">
          Children: {viewElement.children?.length || 0} element(s)
        </Typography>

        <Controller
          name="spacing"
          control={control}
          render={({ field }) => (
            <SpacingEditor
              spacing={field.value}
              onSpacingChange={(spacing) => {
                field.onChange(spacing);
                setValue("spacing", spacing, { shouldDirty: true });
              }}
            />
          )}
        />
      </Box>
    );
  }

  return null;
}

