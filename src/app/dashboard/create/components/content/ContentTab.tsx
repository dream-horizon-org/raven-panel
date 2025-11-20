"use client";

import { Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useMemo } from "react";
import {
  Control,
  FieldErrors,
  useWatch,
  useFormContext,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
} from "../../types/journeyTypes";
import { contentTabStyles } from "../../styles/contentTabStyles";
import ContentElementEditor from "./ContentElementEditor";
import { getComponentDefinition } from "../../utils/componentDefinitions";

interface ContentTabProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

const ELEMENT_TYPES = [
  { value: "View", label: "View" },
  { value: "Text", label: "Text" },
  { value: "Image", label: "Image" },
];

export default function ContentTab({ control, errors }: ContentTabProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const template = useWatch({
    control,
    name: "nudgeSelection.actions.0.template",
  }) as ReactNativeJson | undefined;

  // Extract children array from template
  const children = useMemo(() => {
    return template?.children || [];
  }, [template]);

  const updateTemplate = (newChildren: ReactNativeJson[]) => {
    if (!template) {
      // If no template exists, create a basic one
      const newTemplate: ReactNativeJson = {
        type: "TOOLTIP", // Default, should be set from engagement type
        props: {
          testID: `testID-${Date.now()}`,
        },
        actions: [],
        styles: {},
        children: newChildren,
      };
      setValue("nudgeSelection.actions.0.template", newTemplate);
      return;
    }

    const updatedTemplate: ReactNativeJson = {
      ...template,
      children: newChildren,
    };
    setValue("nudgeSelection.actions.0.template", updatedTemplate);
  };

  const handleAddElement = (type: "View" | "Text" | "Image" | "Button") => {
    const currentChildren = [...children];
    const timestamp = Date.now();
    const componentDef = getComponentDefinition(type);

    // Create base element with testID
    const baseElement: ReactNativeJson = {
      type,
      props: {
        testID: `testID-${timestamp}`,
      },
      actions: [],
      styles: {},
    };

    // Initialize props from component definition
    if (componentDef?.props) {
      const initialProps: Record<
        string,
        string | number | boolean | null | undefined
      > = {
        testID: `testID-${timestamp}`,
      };
      componentDef.props.forEach((prop) => {
        if (prop.default !== null && prop.default !== undefined) {
          initialProps[prop.name] = prop.default;
        } else if (prop.type === "string") {
          initialProps[prop.name] = "";
        } else if (prop.type === "number") {
          initialProps[prop.name] = 0;
        } else if (prop.type === "boolean") {
          initialProps[prop.name] = false;
        }
      });
      baseElement.props = initialProps as ReactNativeJson["props"];
    }

    // Initialize styles if component has styles
    if (componentDef?.styles && componentDef.styles.length > 0) {
      const initialStyles: Record<string, number> = {};
      // Initialize spacing styles to 0
      componentDef.styles.forEach((styleName) => {
        if (styleName.startsWith("margin") || styleName.startsWith("padding")) {
          initialStyles[styleName] = 0;
        }
      });
      baseElement.styles = initialStyles;
    }

    // Add children array for View elements
    if (type === "View") {
      baseElement.children = [];
    }

    currentChildren.push(baseElement);
    updateTemplate(currentChildren);
    setAnchorEl(null);
  };

  const handleRemoveElement = (index: number) => {
    const currentChildren = [...children];
    currentChildren.splice(index, 1);
    updateTemplate(currentChildren);
  };

  return (
    <Box sx={contentTabStyles.container}>
      <Box sx={contentTabStyles.header}>
        <Box>
          <Typography sx={contentTabStyles.title}>Content Elements</Typography>
          <Typography sx={contentTabStyles.subtitle}>
            Configure the UI elements for your engagement
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={contentTabStyles.addButton}
        >
          Add Element
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          {ELEMENT_TYPES.map((type) => (
            <MenuItem
              key={type.value}
              onClick={() =>
                handleAddElement(
                  type.value as "View" | "Text" | "Image" | "Button"
                )
              }
            >
              {type.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {!template || children.length === 0 ? (
        <Box sx={contentTabStyles.emptyState}>
          <Typography sx={contentTabStyles.emptyStateText}>
            {!template
              ? "Please select a template first"
              : "No elements added yet"}
          </Typography>
          <Typography sx={contentTabStyles.emptyStateSubtext}>
            {!template
              ? "Go to the Template tab to select a template"
              : "Use the 'Add Element' dropdown to start building your engagement UI"}
          </Typography>
        </Box>
      ) : (
        <Box sx={contentTabStyles.elementsList}>
          {children.map((child: ReactNativeJson, index: number) => (
            <ContentElementEditor
              key={child.props?.testID || index}
              control={control}
              errors={errors}
              index={index}
              onRemove={() => handleRemoveElement(index)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
