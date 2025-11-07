"use client";

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
  if (element.type === "text") {
    const textElement = element as TextElement;
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Text"
          value={textElement.text || ""}
          onChange={(e) => onUpdate({ text: e.target.value } as Partial<TextElement>)}
          multiline
          rows={2}
          size="small"
        />

        <FormControl fullWidth size="small">
          <InputLabel>Text Alignment</InputLabel>
          <Select
            value={textElement.textAlignment || "left"}
            label="Text Alignment"
            onChange={(e) =>
              onUpdate({ textAlignment: e.target.value as "left" | "center" | "right" } as Partial<TextElement>)
            }
          >
            <MenuItem value="left">Left</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="right">Right</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Text Color"
            type="color"
            value={textElement.textColor || "#000000"}
            onChange={(e) => onUpdate({ textColor: e.target.value } as Partial<TextElement>)}
            size="small"
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Font Size (dp)"
            type="number"
            value={textElement.fontSize || 16}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) } as Partial<TextElement>)}
            size="small"
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TextField
          fullWidth
          label="Font Family"
          value={textElement.fontFamily || ""}
          onChange={(e) => onUpdate({ fontFamily: e.target.value } as Partial<TextElement>)}
          size="small"
          placeholder="e.g., PlusJakartaSans-Bold.ttf"
        />

        <SpacingEditor
          spacing={textElement.spacing}
          onSpacingChange={(spacing) => onUpdate({ spacing } as Partial<TextElement>)}
        />
      </Box>
    );
  }

  if (element.type === "image") {
    const imageElement = element as ImageElement;
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Image Source"
          value={imageElement.imageSource || ""}
          onChange={(e) => onUpdate({ imageSource: e.target.value } as Partial<ImageElement>)}
          size="small"
          placeholder="URL or path to image"
          helperText="Supported formats: JPEG, PNG, WEBP and GIF up to 1 MB"
        />

        <FormControl fullWidth size="small">
          <InputLabel>Click Action</InputLabel>
          <Select
            value={imageElement.clickAction || "none"}
            label="Click Action"
            onChange={(e) => onUpdate({ clickAction: e.target.value } as Partial<ImageElement>)}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="open-url">Open URL</MenuItem>
            <MenuItem value="deep-link">Deep Link</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={imageElement.occupyFullWidth || false}
              onChange={(e) => onUpdate({ occupyFullWidth: e.target.checked } as Partial<ImageElement>)}
            />
          }
          label="Occupy Full Width Of Container"
        />

        <SpacingEditor
          spacing={imageElement.spacing}
          onSpacingChange={(spacing) => onUpdate({ spacing } as Partial<ImageElement>)}
        />
      </Box>
    );
  }

  if (element.type === "view") {
    const viewElement = element as ViewElement;
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Orientation</InputLabel>
          <Select
            value={viewElement.orientation || "vertical"}
            label="Orientation"
            onChange={(e) =>
              onUpdate({ orientation: e.target.value as "horizontal" | "vertical" } as Partial<ViewElement>)
            }
          >
            <MenuItem value="vertical">Vertical</MenuItem>
            <MenuItem value="horizontal">Horizontal</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          Children: {viewElement.children?.length || 0} element(s)
        </Typography>

        <SpacingEditor
          spacing={viewElement.spacing}
          onSpacingChange={(spacing) => onUpdate({ spacing } as Partial<ViewElement>)}
        />
      </Box>
    );
  }

  return null;
}

