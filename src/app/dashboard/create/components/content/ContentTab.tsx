"use client";

import { Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useMemo } from "react";
import {
  Control,
  FieldErrors,
  useWatch,
  useFormContext,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
  NudgeType,
  DynamicTextValueType,
} from "../../types/journey.interface";
import { contentTabStyles } from "./styles/contentTabStyles";
import ContentElementEditor from "./ContentElementEditor";
import {
  getComponentDefinition,
  getComponentDefinitionByDisplay,
} from "../../utils/componentDefinitions";
import ElementPropsEditor from "./ElementPropsEditor";
import ElementStylesEditor from "./ElementStylesEditor";

interface ContentTabProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  engagementId?: string | null;
}

const ELEMENT_TYPES = [
  { value: "Vertical Stack", label: "Vertical Stack" },
  { value: "Horizontal Stack", label: "Horizontal Stack" },
  { value: "Text", label: "Text" },
  { value: "Image", label: "Image" },
];

export default function ContentTab({
  control,
  errors,
  engagementId,
}: ContentTabProps) {
  const { setValue, getValues } = useFormContext<CreateJourneyFormData>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });
  const engagementType = actions?.[actionIndex]?.type;
  const isTooltip = engagementType === NudgeType.TOOLTIP;

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
      setValue(
        `nudgeSelection.actions.${actionIndex}.template` as any,
        newTemplate
      );
      return;
    }

    const updatedTemplate: ReactNativeJson = {
      ...template,
      children: newChildren,
    };
    setValue(
      `nudgeSelection.actions.${actionIndex}.template` as any,
      updatedTemplate
    );
  };

  const handleAddElement = (
    type: "Vertical Stack" | "Horizontal Stack" | "Text" | "Image" | "Button"
  ) => {
    const currentChildren = [...children];
    const timestamp = Date.now();

    const componentDef =
      type === "Vertical Stack" || type === "Horizontal Stack"
        ? getComponentDefinitionByDisplay(type)
        : getComponentDefinition(type);

    const elementType =
      type === "Vertical Stack" || type === "Horizontal Stack" ? "View" : type;

    const flexDirection =
      type === "Vertical Stack"
        ? "column"
        : type === "Horizontal Stack"
        ? "row"
        : undefined;

    // Create base element with testID
    const baseElement: ReactNativeJson = {
      type: elementType,
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
      const initialStyles: Record<string, number | string> = {};
      // Initialize spacing styles to 0
      componentDef.styles.forEach((styleName) => {
        if (styleName.startsWith("margin") || styleName.startsWith("padding")) {
          initialStyles[styleName] = 0;
        }
      });

      if (flexDirection) {
        initialStyles.flexDirection = flexDirection;
      }
      baseElement.styles = initialStyles;
    }

    // Add children array for View elements
    if (elementType === "View") {
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

  // Update template props directly (for tooltip)
  const updateTemplateProps = (
    propKey: string,
    value: string | number | boolean | DynamicTextValueType | null | undefined
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

  // Update template styles directly (for tooltip)
  const updateTemplateStyles = (
    styleKey: string,
    value: string | number | undefined
  ) => {
    if (!template) return;
    const currentStyles = template.styles || {};
    const updatedStyles: Record<string, string | number> = { ...currentStyles };

    // If value is undefined, remove the property instead of setting it to undefined
    if (value === undefined || value === null || value === "") {
      delete updatedStyles[styleKey];
    } else {
      updatedStyles[styleKey] = value;
    }

    const updatedTemplate: ReactNativeJson = {
      ...template,
      styles: updatedStyles,
    };
    setValue(
      `nudgeSelection.actions.${actionIndex}.template` as any,
      updatedTemplate
    );
  };

  // For tooltip: show props and styles editors
  if (isTooltip && template) {
    const componentDef = getComponentDefinition("TOOLTIP");

    // Filter out targetScreen and targetId from props (they're in Location tab)
    const filteredComponentDef = componentDef
      ? {
          ...componentDef,
          props: componentDef.props?.filter(
            (prop) => prop.name !== "targetScreen" && prop.name !== "targetId"
          ),
        }
      : undefined;

    return (
      <Box sx={contentTabStyles.container}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          {filteredComponentDef && (
            <>
              <ElementPropsEditor
                element={template}
                componentDef={filteredComponentDef}
                onPropChange={updateTemplateProps}
                basePath={`nudgeSelection.actions.${actionIndex}.template`}
              />
              <ElementStylesEditor
                element={template}
                componentDef={filteredComponentDef}
                onStyleChange={updateTemplateStyles}
                basePath={`nudgeSelection.actions.${actionIndex}.template`}
              />
            </>
          )}
        </Box>
      </Box>
    );
  }

  // For other types: show children elements
  return (
    <Box sx={contentTabStyles.container}>
      {!template || children.length === 0 ? (
        <Box sx={contentTabStyles.container}>
          <Box sx={contentTabStyles.header}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={contentTabStyles.addButton}
            >
              Add Element
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              {ELEMENT_TYPES.map((type) => (
                <MenuItem
                  key={type.value}
                  onClick={() =>
                    handleAddElement(
                      type.value as
                        | "Vertical Stack"
                        | "Horizontal Stack"
                        | "Text"
                        | "Image"
                        | "Button"
                    )
                  }
                >
                  {type.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
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
        </Box>
      ) : (
        <Box sx={contentTabStyles.container}>
          <Box sx={contentTabStyles.elementsList}>
            {children.map((child: ReactNativeJson, index: number) => (
              <ContentElementEditor
                key={child.props?.testID || index}
                control={control}
                errors={errors}
                index={index}
                onRemove={() => handleRemoveElement(index)}
                actionIndex={actionIndex}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
