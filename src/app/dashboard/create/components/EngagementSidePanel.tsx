"use client";

import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Button,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Control,
  FieldErrors,
  useWatch,
  useFormContext,
  Path,
} from "react-hook-form";
import { CreateJourneyFormData, NudgeType } from "../types/journeyTypes";
import { useState, useEffect } from "react";
import TemplateTab from "./content/TemplateTab";
import ContentTab from "./content/ContentTab";
import LocationTab from "./content/LocationTab";
import PreviewPanel from "./content/PreviewPanel";
import { engagementSidePanelStyles } from "../styles/engagementSidePanelStyles";
import { validateTemplate } from "../utils/validation";

interface EngagementSidePanelProps {
  open: boolean;
  onClose: () => void;
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  onTemplateSaved?: () => void;
}

export default function EngagementSidePanel({
  open,
  onClose,
  control,
  errors,
  onTemplateSaved,
}: EngagementSidePanelProps) {
  const { getValues, setError, clearErrors } = useFormContext<
    CreateJourneyFormData
  >();
  const [activeSubTab, setActiveSubTab] = useState<
    "template" | "content" | "location"
  >("template");

  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });
  const engagementType = actions?.[0]?.type;
  const isTooltip = engagementType === NudgeType.TOOLTIP;

  // Helper to get nested error from errors object
  const getNestedError = (path: string) => {
    const pathParts = path.split(".");
    let current: any = errors;
    for (const part of pathParts) {
      if (current && typeof current === "object") {
        const index = parseInt(part, 10);
        if (!isNaN(index) && part === String(index)) {
          if (part in current) {
            current = current[part];
          } else {
            return undefined;
          }
        } else if (part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
    return current;
  };

  // Helper to recursively check if any errors exist in a path
  const hasErrorsInPath = (basePath: string): boolean => {
    const baseError = getNestedError(basePath);
    if (!baseError) return false;

    // If it has a message property, it's an error
    if (typeof baseError === "object" && "message" in baseError) return true;

    // Recursively check all nested properties
    if (typeof baseError === "object") {
      for (const key in baseError) {
        if (hasErrorsInPath(`${basePath}.${key}`)) return true;
      }
    }

    return false;
  };

  // Helper to check if Content tab has errors
  // For tooltip: props and styles (excluding targetScreen and targetId)
  // For bottomsheet/popup: children props and styles
  const hasContentErrors = (): boolean => {
    if (isTooltip) {
      // Check template props (excluding targetScreen and targetId)
      const templatePropsPath = "nudgeSelection.actions.0.template.props";
      const propsErrors = getNestedError(templatePropsPath);
      if (propsErrors && typeof propsErrors === "object") {
        for (const key in propsErrors) {
          if (
            key !== "targetScreen" &&
            key !== "targetId" &&
            propsErrors[key]
          ) {
            return true;
          }
        }
      }

      // Check template styles
      const templateStylesPath = "nudgeSelection.actions.0.template.styles";
      if (hasErrorsInPath(templateStylesPath)) return true;
    } else {
      // For bottomsheet/popup: check children recursively
      const childrenPath = "nudgeSelection.actions.0.template.children";
      if (hasErrorsInPath(childrenPath)) return true;
    }

    return false;
  };

  // Helper to check if Location tab has errors (targetScreen and targetId)
  const hasLocationErrors = (): boolean => {
    if (!isTooltip) return false;

    const targetScreenPath =
      "nudgeSelection.actions.0.template.props.targetScreen";
    const targetIdPath = "nudgeSelection.actions.0.template.props.targetId";

    return !!(getNestedError(targetScreenPath) || getNestedError(targetIdPath));
  };

  const handleSave = () => {
    const data = getValues();
    if (!data.nudgeSelection?.actions?.[0]?.template) {
      onClose();
      return;
    }

    const template = data.nudgeSelection.actions[0].template;
    const basePath = "nudgeSelection.actions.0.template" as Path<
      CreateJourneyFormData
    >;

    const isValid = validateTemplate(template, basePath, setError, clearErrors);

    if (isValid) {
      // Notify parent that template was saved successfully
      // This will trigger re-validation in parent component
      if (onTemplateSaved) {
        onTemplateSaved();
      }
      onClose();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: engagementSidePanelStyles.drawerPaper,
      }}
    >
      <Box sx={engagementSidePanelStyles.container}>
        <Box sx={engagementSidePanelStyles.header}>
          <Typography sx={engagementSidePanelStyles.title}>
            Configure Engagement:{" "}
            {engagementType ? String(engagementType) : "Select Type"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={engagementSidePanelStyles.content}>
          <Box sx={engagementSidePanelStyles.previewSection}>
            <PreviewPanel control={control} />
          </Box>

          <Box sx={engagementSidePanelStyles.configSection}>
            <Tabs
              value={activeSubTab}
              onChange={(_, newValue) => setActiveSubTab(newValue)}
              sx={engagementSidePanelStyles.tabs}
            >
              <Tab value="template" label="Template" />
              <Tab
                value="content"
                label={
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasContentErrors()}
                    sx={{ "& .MuiBadge-badge": { right: -8, top: 8 } }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: hasContentErrors() ? "error.main" : "inherit",
                      }}
                    >
                      Content
                    </Box>
                  </Badge>
                }
              />
              {isTooltip && (
                <Tab
                  value="location"
                  label={
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!hasLocationErrors()}
                      sx={{ "& .MuiBadge-badge": { right: -8, top: 8 } }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: hasLocationErrors() ? "error.main" : "inherit",
                        }}
                      >
                        Location
                      </Box>
                    </Badge>
                  }
                />
              )}
            </Tabs>

            <Box sx={engagementSidePanelStyles.tabContent}>
              {activeSubTab === "template" && (
                <TemplateTab control={control} errors={errors} />
              )}
              {activeSubTab === "content" && (
                <ContentTab control={control} errors={errors} />
              )}
              {activeSubTab === "location" && isTooltip && (
                <LocationTab control={control} errors={errors} />
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={engagementSidePanelStyles.footer}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
