"use client";

import {
  Box,
  Typography,
  IconButton,
  Collapse,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Menu,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import { useState, useMemo } from "react";
import {
  Control,
  FieldErrors,
  useWatch as useWatchHook,
  useFormContext,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
  DynamicTextValueType,
} from "../../types/journeyTypes";
import { contentElementEditorStyles } from "../../styles/contentElementEditorStyles";
import { getComponentDefinition } from "../../utils/componentDefinitions";
import ElementPropsEditor from "./ElementPropsEditor";
import ElementStylesEditor from "./ElementStylesEditor";
import ElementActionsEditor from "./ElementActionsEditor";

interface ContentElementEditorProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  index: number;
  onRemove: () => void;
  parentPath?: number[]; // For nested children, e.g., [0, 0] means children[0].children[0]
  isChild?: boolean;
}

export default function ContentElementEditor({
  control,
  errors,
  index,
  onRemove,
  parentPath = [],
  isChild = false,
}: ContentElementEditorProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const [expanded, setExpanded] = useState(true);
  const [childMenuAnchor, setChildMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const childMenuOpen = Boolean(childMenuAnchor);

  const template = useWatchHook({
    control,
    name: "nudgeSelection.actions.0.template",
  }) as ReactNativeJson | undefined;

  // Get the element at the current path
  const { element, templateObj, elementPath } = useMemo(() => {
    if (!template) {
      return { element: null, templateObj: null, elementPath: [] };
    }

    let current = template.children || [];

    // Navigate to the element using parentPath and index
    const fullPath = [...parentPath, index];
    for (let i = 0; i < fullPath.length; i++) {
      if (i === fullPath.length - 1) {
        // Last index - this is our element
        return {
          element: current[fullPath[i]] || null,
          templateObj: template,
          elementPath: fullPath,
        };
      } else {
        // Navigate deeper
        if (current[fullPath[i]]?.children) {
          current = current[fullPath[i]].children!;
        } else {
          return {
            element: null,
            templateObj: template,
            elementPath: fullPath,
          };
        }
      }
    }
    return { element: null, templateObj: template, elementPath: fullPath };
  }, [template, index, parentPath]);

  // Get children array for View elements
  const children = useMemo(() => {
    if (element?.type === "View" && element.children) {
      return element.children;
    }
    return [];
  }, [element]);

  // Get component definition for this element type
  const componentDef = useMemo(() => {
    if (!element?.type) return undefined;
    return getComponentDefinition(element.type);
  }, [element?.type]);

  // Update template with new element data
  const updateElement = (updates: Partial<ReactNativeJson>) => {
    if (!templateObj) return;

    const updateChildren = (
      children: ReactNativeJson[],
      path: number[]
    ): ReactNativeJson[] => {
      if (path.length === 1) {
        // Update this element
        const newChildren = [...children];
        newChildren[path[0]] = { ...newChildren[path[0]], ...updates };
        return newChildren;
      } else {
        // Navigate deeper
        const newChildren = [...children];
        const [first, ...rest] = path;
        newChildren[first] = {
          ...newChildren[first],
          children: updateChildren(newChildren[first].children || [], rest),
        };
        return newChildren;
      }
    };

    const updatedTemplate: ReactNativeJson = {
      ...templateObj,
      children: updateChildren(templateObj.children || [], elementPath),
    };
    setValue("nudgeSelection.actions.0.template", updatedTemplate);
  };

  // Update a prop field
  const updateProp = (
    propKey: string,
    value: string | number | boolean | DynamicTextValueType | null | undefined
  ) => {
    if (!element) return;
    const currentProps = element.props || {};
    updateElement({
      props: { ...currentProps, [propKey]: value },
    });
  };

  // Update actions
  const handleActionsChange = (actions: ReactNativeJson["actions"]) => {
    updateElement({ actions });
  };

  // Update a style field
  const updateStyle = (
    styleKey: string,
    value: string | number | undefined
  ) => {
    if (!element) return;
    const currentStyles = element.styles || {};
    updateElement({
      styles: { ...currentStyles, [styleKey]: value },
    });
  };

  // Update margin/padding (now in styles)
  const updateSpacing = (
    type: "margin" | "padding",
    side: "Top" | "Right" | "Bottom" | "Left",
    value: number
  ) => {
    const styleKey = `${type}${side}`;
    updateStyle(styleKey, value);
  };

  const handleAddChildElement = (
    type: "View" | "Text" | "Image" | "Button"
  ) => {
    if (element?.type !== "View") {
      setChildMenuAnchor(null);
      return;
    }

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

    const currentChildren = [...(element.children || [])];
    currentChildren.push(baseElement);
    updateElement({ children: currentChildren });
    setChildMenuAnchor(null);
  };

  const handleRemoveChild = (childIndex: number) => {
    if (element?.type !== "View") return;
    const currentChildren = [...(element.children || [])];
    currentChildren.splice(childIndex, 1);
    updateElement({ children: currentChildren });
  };

  const getElementLabel = () => {
    if (!element) return "Element";

    const displayName = componentDef?.display || element.type;

    if (element.type === "View") {
      const orientation =
        element.props?.flexDirection ||
        element.props?.orientation ||
        "vertical";
      return `${displayName} (${orientation})`;
    } else if (element.type === "Text") {
      const textContent =
        element.props?.title || element.props?.textContent || "Empty";
      return `${displayName}: ${textContent}`;
    } else if (element.type === "Image") {
      return displayName;
    }

    return displayName;
  };

  if (!element) {
    return null;
  }

  return (
    <Box
      sx={{
        ...contentElementEditorStyles.container,
        ...(isChild && {
          ml: 2,
          mt: 1,
          borderColor: "primary.light",
          borderWidth: 1,
        }),
      }}
    >
      <Box sx={contentElementEditorStyles.header}>
        <Typography sx={contentElementEditorStyles.elementLabel}>
          {element.type}
        </Typography>
        <Box>
          <IconButton size="small" onClick={() => {}}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onRemove} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={contentElementEditorStyles.content}>
          {/* Render Props Editor */}
          <ElementPropsEditor
            element={element}
            componentDef={componentDef}
            onPropChange={updateProp}
          />

          {/* Render Styles Editor */}
          <ElementStylesEditor
            element={element}
            componentDef={componentDef}
            onStyleChange={updateStyle}
          />

          {/* Render Actions Editor */}
          {componentDef?.actions && componentDef.actions.length > 0 && (
            <ElementActionsEditor
              element={element}
              componentType={element.type}
              onActionsChange={handleActionsChange}
            />
          )}

          {/* Children section for View elements */}
          {element.type === "View" && (
            <Box sx={contentElementEditorStyles.section}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography sx={contentElementEditorStyles.sectionLabel}>
                  CHILD ELEMENTS
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={(e) => setChildMenuAnchor(e.currentTarget)}
                >
                  Add Element
                </Button>
              </Box>
              <Menu
                anchorEl={childMenuAnchor}
                open={childMenuOpen}
                onClose={() => setChildMenuAnchor(null)}
              >
                <MenuItem onClick={() => handleAddChildElement("View")}>
                  View
                </MenuItem>
                <MenuItem onClick={() => handleAddChildElement("Text")}>
                  Text
                </MenuItem>
                <MenuItem onClick={() => handleAddChildElement("Image")}>
                  Image
                </MenuItem>
                <MenuItem onClick={() => handleAddChildElement("Button")}>
                  Button
                </MenuItem>
              </Menu>
              {children.length === 0 ? (
                <Typography sx={contentElementEditorStyles.emptyText}>
                  No child elements
                </Typography>
              ) : (
                <Box sx={{ marginTop: 1 }}>
                  {children.map(
                    (child: ReactNativeJson, childIndex: number) => (
                      <ContentElementEditor
                        key={child.props?.testID || childIndex}
                        control={control}
                        errors={errors}
                        index={childIndex}
                        onRemove={() => handleRemoveChild(childIndex)}
                        parentPath={[...elementPath]}
                        isChild={true}
                      />
                    )
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
