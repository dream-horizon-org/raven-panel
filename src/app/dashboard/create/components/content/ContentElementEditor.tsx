"use client";

import {
  Box,
  Typography,
  IconButton,
  Collapse,
  MenuItem,
  Button,
  Menu,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useElementLocator } from "../../contexts/ElementLocatorContext";
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
} from "../../types/journey.interface";
import { contentElementEditorStyles } from "./styles/contentElementEditorStyles";
import {
  getComponentDefinition,
  getComponentDefinitionByDisplay,
} from "../../utils/componentDefinitions.utils";
import ElementPropsEditor from "./ElementPropsEditor";
import ElementStylesEditor from "./ElementStylesEditor";
import ElementActionsEditor from "./ElementActionsEditor";

interface ContentElementEditorProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  index: number;
  onRemove: () => void;
  parentPath?: number[];
  isChild?: boolean;
  actionIndex?: number;
}

export default function ContentElementEditor({
  control,
  errors,
  index,
  onRemove,
  parentPath = [],
  isChild = false,
  actionIndex = 0,
}: ContentElementEditorProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const { setSelectedTestID } = useElementLocator();
  const [expanded, setExpanded] = useState(false);
  const [childMenuAnchor, setChildMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const childMenuOpen = Boolean(childMenuAnchor);

  const template = useWatchHook({
    control,
    name: `nudgeSelection.actions.${actionIndex}.template` as any,
  }) as ReactNativeJson | undefined;

  const actions = useWatchHook({
    control,
    name: "nudgeSelection.actions",
  });
  const engagementType = actions?.[actionIndex]?.type;

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

    if (element.type === "View") {
      const flexDirection = element.styles?.flexDirection;
      if (flexDirection === "row") {
        return getComponentDefinitionByDisplay("Horizontal Stack");
      } else {
        return getComponentDefinitionByDisplay("Vertical Stack");
      }
    }

    return getComponentDefinition(element.type);
  }, [element?.type, element?.styles?.flexDirection]);

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
    setValue(
      `nudgeSelection.actions.${actionIndex}.template` as any,
      updatedTemplate
    );
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
    const updatedStyles: Record<string, string | number> = { ...currentStyles };

    // If value is undefined, remove the property instead of setting it to undefined
    if (value === undefined || value === null || value === "") {
      delete updatedStyles[styleKey];
    } else {
      updatedStyles[styleKey] = value;
    }

    updateElement({
      styles: updatedStyles,
    });
  };

  // Update margin/padding (now in styles) - unused but kept for potential future use
  // const updateSpacing = (
  //   type: "margin" | "padding",
  //   side: "Top" | "Right" | "Bottom" | "Left",
  //   value: number
  // ) => {
  //   const styleKey = `${type}${side}`;
  //   updateStyle(styleKey, value);
  // };

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

  // Unused function - kept for potential future use
  // const getElementLabel = () => {
  //   if (!element) return "Element";
  //
  //   const displayName = componentDef?.display || element.type;
  //
  //   if (element.type === "Text") {
  //     const textContent =
  //       element.props?.title || element.props?.textContent || "Empty";
  //     return `${displayName}: ${textContent}`;
  //   }
  //
  //   return displayName;
  // };

  // Helper to check if a specific path has errors
  const checkPathForErrors = (path: string): boolean => {
    const pathParts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;

    for (const part of pathParts) {
      if (!current || typeof current !== "object") return false;

      const numericIndex = parseInt(part, 10);
      const isNumericKey =
        !isNaN(numericIndex) && part === String(numericIndex);

      if (isNumericKey) {
        if (part in current) {
          current = current[part];
        } else {
          return false;
        }
      } else {
        if (part in current) {
          current = current[part];
        } else {
          return false;
        }
      }
    }

    // Check if current has error message or nested errors
    if (current && typeof current === "object") {
      if ("message" in current) return true;
      // Check nested properties
      for (const key in current) {
        if (checkPathForErrors(`${path}.${key}`)) return true;
      }
    }

    return false;
  };

  // Helper to check if this element path has errors
  const hasElementErrors = (): boolean => {
    if (!elementPath || elementPath.length === 0) return false;

    // Build the path string: nudgeSelection.actions.{actionIndex}.template.children.0.children.1...
    let pathString = `nudgeSelection.actions.${actionIndex}.template`;
    for (let i = 0; i < elementPath.length; i++) {
      pathString += `.children.${elementPath[i]}`;
    }

    // Check for errors in props and styles
    const propsPath = `${pathString}.props`;
    const stylesPath = `${pathString}.styles`;

    return checkPathForErrors(propsPath) || checkPathForErrors(stylesPath);
  };

  const hasActionErrors = (): boolean => {
    if (!element || !element.actions || !Array.isArray(element.actions)) {
      return false;
    }

    let basePathString = `nudgeSelection.actions.${actionIndex}.template`;
    for (let i = 0; i < elementPath.length; i++) {
      basePathString += `.children.${elementPath[i]}`;
    }

    const actionsPath = `${basePathString}.actions`;

    return checkPathForErrors(actionsPath);
  };

  // Helper to check if any child elements have errors (recursively)
  const hasChildErrors = (): boolean => {
    if (
      !element ||
      element.type !== "View" ||
      !element.children ||
      element.children.length === 0
    ) {
      return false;
    }

    // Build the base path for this element's children
    let basePathString = `nudgeSelection.actions.${actionIndex}.template`;
    for (let i = 0; i < elementPath.length; i++) {
      basePathString += `.children.${elementPath[i]}`;
    }
    const childrenPath = `${basePathString}.children`;

    // Recursively check all children paths for errors
    const checkChildrenRecursively = (path: string): boolean => {
      // First check if this path has errors
      if (checkPathForErrors(path)) {
        return true;
      }

      // Navigate to the path in errors object
      const pathParts = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = errors;
      for (const part of pathParts) {
        if (!current || typeof current !== "object") return false;
        const numericIndex = parseInt(part, 10);
        const isNumericKey =
          !isNaN(numericIndex) && part === String(numericIndex);
        if (isNumericKey) {
          if (part in current) {
            current = current[part];
          } else {
            return false;
          }
        } else {
          if (part in current) {
            current = current[part];
          } else {
            return false;
          }
        }
      }

      // If we found the children array in errors, check all indices
      if (current && typeof current === "object") {
        // Check all numeric keys (array indices)
        for (const key in current) {
          const numericKey = parseInt(key, 10);
          if (!isNaN(numericKey) && key === String(numericKey)) {
            // This is a child index, check if it has errors
            const childPath = `${path}.${key}`;
            if (
              checkPathForErrors(`${childPath}.props`) ||
              checkPathForErrors(`${childPath}.styles`)
            ) {
              return true;
            }

            const childActionsPath = `${childPath}.actions`;
            const childActionsParts = childActionsPath.split(".");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let childActionsCurrent: any = errors;
            for (const part of childActionsParts) {
              if (
                !childActionsCurrent ||
                typeof childActionsCurrent !== "object"
              )
                break;
              const numericIndex = parseInt(part, 10);
              const isNumericKey =
                !isNaN(numericIndex) && part === String(numericIndex);
              if (isNumericKey) {
                if (part in childActionsCurrent) {
                  childActionsCurrent = childActionsCurrent[part];
                } else {
                  break;
                }
              } else {
                if (part in childActionsCurrent) {
                  childActionsCurrent = childActionsCurrent[part];
                } else {
                  break;
                }
              }
            }

            if (
              childActionsCurrent &&
              typeof childActionsCurrent === "object"
            ) {
              for (const actionKey in childActionsCurrent) {
                const actionNumericKey = parseInt(actionKey, 10);
                if (
                  !isNaN(actionNumericKey) &&
                  actionKey === String(actionNumericKey)
                ) {
                  const actionPath = `${childActionsPath}.${actionKey}`;
                  if (
                    checkPathForErrors(`${actionPath}.params.androidUrl`) ||
                    checkPathForErrors(`${actionPath}.params.iosUrl`)
                  ) {
                    return true;
                  }
                }
              }
            }
            // Recursively check this child's children
            if (checkChildrenRecursively(`${childPath}.children`)) {
              return true;
            }
          }
        }
      }

      return false;
    };

    return checkChildrenRecursively(childrenPath);
  };

  const elementHasErrors = hasElementErrors();
  const childHasErrors = hasChildErrors();
  const actionHasErrors = hasActionErrors();
  const shouldHighlight = elementHasErrors || childHasErrors || actionHasErrors;

  if (!element) {
    return null;
  }

  const elementTestID = (element.props as Record<string, unknown>)?.testID as
    | string
    | undefined;

  const handleLocatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (elementTestID) {
      // Just set the element to highlight (will auto-dismiss after 3 seconds)
      setSelectedTestID(elementTestID);
    }
  };

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
        ...(shouldHighlight && {
          borderColor: "error.main",
          borderWidth: 2,
          borderStyle: "solid",
        }),
      }}
    >
      <Box sx={contentElementEditorStyles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ p: 0.5, ml: -1 }}
          >
            {expanded ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
          <Typography
            sx={{
              ...contentElementEditorStyles.elementLabel,
              ...(shouldHighlight && {
                color: "error.main",
                fontWeight: 600,
              }),
            }}
          >
            {componentDef?.display || element.type}
          </Typography>
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={handleLocatorClick}
            title="Locate element in preview"
          >
            <LocationOnIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onRemove} color="error">
            <DeleteIcon fontSize="small" />
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
            basePath={
              elementPath.length === 0
                ? `nudgeSelection.actions.${actionIndex}.template`
                : `nudgeSelection.actions.${actionIndex}.template.children.${elementPath.join(
                    ".children."
                  )}`
            }
          />

          {/* Render Styles Editor */}
          <ElementStylesEditor
            element={element}
            componentDef={componentDef}
            onStyleChange={updateStyle}
            basePath={
              elementPath.length === 0
                ? `nudgeSelection.actions.${actionIndex}.template`
                : `nudgeSelection.actions.${actionIndex}.template.children.${elementPath.join(
                    ".children."
                  )}`
            }
          />

          {/* Render Actions Editor */}
          {componentDef?.actions && componentDef.actions.length > 0 && (
            <ElementActionsEditor
              element={element}
              componentType={element.type}
              onActionsChange={handleActionsChange}
              engagementType={engagementType}
              basePath={
                elementPath.length === 0
                  ? `nudgeSelection.actions.${actionIndex}.template`
                  : `nudgeSelection.actions.${actionIndex}.template.children.${elementPath.join(
                      ".children."
                    )}`
              }
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
                        actionIndex={actionIndex}
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
